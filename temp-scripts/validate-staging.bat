@echo off
setlocal enabledelayedexpansion

:: Define color codes
set "RED=31"
set "GREEN=32"
set "YELLOW=33"
set "BLUE=34"

:: Function to print colored text
call :print_colored %BLUE% "Staging Validation Tool"
echo.

:: Create validation report directory
if not exist "validation-reports" mkdir validation-reports
set "report_file=validation-reports\staging-validation-%date:~-4,4%%date:~-10,2%%date:~-7,2%_%time:~0,2%%time:~3,2%.txt"

:: Start report
echo Staging Validation Report > %report_file%
echo ======================== >> %report_file%
echo Date: %date% Time: %time% >> %report_file%
echo. >> %report_file%

:: 1. Deploy to staging
call :print_colored %BLUE% "Deploying to staging..."
echo Deployment Status: >> %report_file%
call vercel --confirm > temp.log 2>&1
if !errorlevel! neq 0 (
    call :print_colored %RED% "Deployment failed"
    type temp.log >> %report_file%
    goto :cleanup
)

:: Extract staging URL
for /f "tokens=2 delims=: " %%a in ('findstr /C:"Preview:" temp.log') do set "STAGING_URL=%%a"
echo Staging URL: %STAGING_URL% >> %report_file%
echo. >> %report_file%

:: 2. Run Lighthouse audit
call :print_colored %BLUE% "Running Lighthouse audit..."
echo Lighthouse Audit Results: >> %report_file%
call npx lighthouse %STAGING_URL% --output json --output-path=./temp-lighthouse.json --chrome-flags="--headless"

:: Parse Lighthouse results
node -e "const report = require('./temp-lighthouse.json'); console.log(`Performance: ${report.categories.performance.score * 100}%%\nAccessibility: ${report.categories.accessibility.score * 100}%%\nBest Practices: ${report.categories['best-practices'].score * 100}%%\nSEO: ${report.categories.seo.score * 100}%%`);" >> %report_file%
echo. >> %report_file%

:: 3. Run E2E tests
call :print_colored %BLUE% "Running E2E tests..."
echo E2E Test Results: >> %report_file%
set "PLAYWRIGHT_TEST_BASE_URL=%STAGING_URL%"
call npm run test:e2e > temp.log 2>&1
if !errorlevel! neq 0 (
    call :print_colored %RED% "E2E tests failed"
    type temp.log >> %report_file%
) else (
    call :print_colored %GREEN% "E2E tests passed"
    echo All E2E tests passed successfully >> %report_file%
)
echo. >> %report_file%

:: 4. Check responsive layouts
call :print_colored %BLUE% "Checking responsive layouts..."
echo Responsive Layout Tests: >> %report_file%

:: Test different viewport sizes
set "viewports=375,667 768,1024 1440,900"
for %%v in (%viewports%) do (
    for /f "tokens=1,2 delims=," %%a in ("%%v") do (
        call :print_colored %BLUE% "Testing viewport %%ax%%b"
        call npx playwright test e2e/responsive.spec.ts --viewport-size="%%a,%%b" >> %report_file%
    )
)
echo. >> %report_file%

:: 5. Check Core Web Vitals
call :print_colored %BLUE% "Checking Core Web Vitals..."
echo Core Web Vitals: >> %report_file%
node -e "const report = require('./temp-lighthouse.json'); const lcp = report.audits['largest-contentful-paint'].numericValue; const fid = report.audits['total-blocking-time'].numericValue; const cls = report.audits['cumulative-layout-shift'].numericValue; console.log(`LCP: ${(lcp/1000).toFixed(2)}s ${lcp < 2500 ? '✓' : '✗'}\nFID: ${fid.toFixed(2)}ms ${fid < 100 ? '✓' : '✗'}\nCLS: ${cls.toFixed(3)} ${cls < 0.1 ? '✓' : '✗'}`);" >> %report_file%
echo. >> %report_file%

:: 6. Check for console errors
call :print_colored %BLUE% "Checking for console errors..."
echo Console Errors: >> %report_file%
call npx playwright test e2e/console-errors.spec.ts >> %report_file%
echo. >> %report_file%

:: Generate summary
echo Summary: >> %report_file%
echo -------- >> %report_file%
findstr /C:"Performance:" %report_file% >> %report_file%
findstr /C:"E2E tests" %report_file% >> %report_file%
findstr /C:"LCP:" %report_file% >> %report_file%

:: Display results
echo.
echo Validation complete. Results saved to: %report_file%
echo.

:: Recommendations
echo Recommendations:
echo ---------------
echo 1. Review the full report in %report_file%
echo 2. Address any failed tests or performance issues
echo 3. Check Core Web Vitals scores
echo 4. Verify responsive layouts across all devices
echo.

:cleanup
:: Clean up temporary files
del temp.log 2>nul
del temp-lighthouse.json 2>nul

:print_colored
echo [%~1m%~2[0m
exit /b

endlocal
