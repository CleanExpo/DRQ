@echo off
setlocal enabledelayedexpansion

:: Create stress test log
echo. > stress-test-log.txt

:: Check if k6 is installed
k6 version > nul 2>&1
if !errorlevel! neq 0 (
    echo Error: k6 is not installed.
    echo Install from: https://k6.io/docs/getting-started/installation
    exit /b 1
)

:: Create k6 test script
echo Creating k6 test script...
(
echo import http from 'k6/http';
echo import { check, sleep } from 'k6';
echo.
echo export const options = {
echo   stages: [
echo     { duration: '1m', target: 50 },   // Ramp up to 50 users
echo     { duration: '3m', target: 50 },   // Stay at 50 users
echo     { duration: '1m', target: 100 },  // Ramp up to 100 users
echo     { duration: '3m', target: 100 },  // Stay at 100 users
echo     { duration: '1m', target: 0 },    // Ramp down to 0 users
echo   ],
echo   thresholds: {
echo     http_req_duration: ['p(95^) < 2000'], // 95%% of requests should be below 2s
echo     http_req_failed: ['rate < 0.01'],     // Less than 1%% of requests should fail
echo   },
echo };
echo.
echo export default function() {
echo   const BASE_URL = __ENV.TARGET_URL;
echo.
echo   // Test homepage
echo   const homeRes = http.get(BASE_URL);
echo   check(homeRes, {
echo     'homepage status 200': (r^) =^> r.status === 200,
echo     'homepage load time OK': (r^) =^> r.timings.duration < 2000,
echo   });
echo.
echo   // Test service pages
echo   const serviceRes = http.get(`${BASE_URL}/services`);
echo   check(serviceRes, {
echo     'service page status 200': (r^) =^> r.status === 200,
echo     'service page load time OK': (r^) =^> r.timings.duration < 2000,
echo   });
echo.
echo   sleep(1);
echo }
) > stress-test.js

:: Get deployment URL from production-deployment-log.txt
for /f "tokens=*" %%a in ('findstr /C:"Production:" production-deployment-log.txt') do set "DEPLOY_URL=%%a"

echo Running stress test against: %DEPLOY_URL%
echo Test started at: %date% %time% >> stress-test-log.txt

:: Run k6 test
k6 run --env TARGET_URL=%DEPLOY_URL% stress-test.js >> stress-test-log.txt

:: Parse results and create summary
echo. >> stress-test-log.txt
echo Test Summary: >> stress-test-log.txt
findstr /C:"checks" /C:"http_req_duration" /C:"http_req_failed" stress-test-log.txt >> stress-test-log.txt

:: Display results
echo.
echo Stress Test Summary:
type stress-test-log.txt

:: Cleanup
del stress-test.js

endlocal
