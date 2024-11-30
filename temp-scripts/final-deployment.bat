@echo off
setlocal enabledelayedexpansion

:: Define color codes
set "RED=31"
set "GREEN=32"
set "YELLOW=33"
set "BLUE=34"

:: Function to print colored text
call :print_colored %BLUE% "DRQ Website Final Deployment Checklist"
echo.

:: Create deployment log
set "log_file=deployment-logs\final-deployment-%date:~-4,4%%date:~-10,2%%date:~-7,2%_%time:~0,2%%time:~3,2%.txt"
if not exist "deployment-logs" mkdir deployment-logs

echo DRQ Website Final Deployment Log > %log_file%
echo ============================== >> %log_file%
echo Started: %date% %time% >> %log_file%
echo. >> %log_file%

:: 1. Branch Validation
call :print_colored %BLUE% "1. Validating branch structure..."
echo Branch Validation: >> %log_file%
call scripts\validate-branches.bat >> %log_file% 2>&1
if !errorlevel! neq 0 (
    call :print_colored %RED% "Branch validation failed. Check %log_file% for details."
    goto :error
)

:: 2. Run All Tests
call :print_colored %BLUE% "2. Running comprehensive tests..."
echo Test Results: >> %log_file%
call scripts\run-tests.bat >> %log_file% 2>&1
if !errorlevel! neq 0 (
    call :print_colored %RED% "Tests failed. Check %log_file% for details."
    goto :error
)

:: 3. Staging Validation
call :print_colored %BLUE% "3. Validating staging environment..."
echo Staging Validation: >> %log_file%
call scripts\validate-staging.bat >> %log_file% 2>&1
if !errorlevel! neq 0 (
    call :print_colored %RED% "Staging validation failed. Check %log_file% for details."
    goto :error
)

:: 4. Security Audit
call :print_colored %BLUE% "4. Running security audit..."
echo Security Audit: >> %log_file%
call npm audit >> %log_file% 2>&1
findstr /C:"found 0 vulnerabilities" %log_file% > nul
if !errorlevel! neq 0 (
    call :print_colored %YELLOW% "Security vulnerabilities found. Review %log_file% for details."
)

:: 5. Performance Check
call :print_colored %BLUE% "5. Checking performance metrics..."
echo Performance Metrics: >> %log_file%
call npx lighthouse http://localhost:3000 --output json --output-path=./temp-lighthouse.json --chrome-flags="--headless"
node -e "const report = require('./temp-lighthouse.json'); const scores = {performance: report.categories.performance.score * 100, accessibility: report.categories.accessibility.score * 100, seo: report.categories.seo.score * 100}; console.log(JSON.stringify(scores));" > temp-scores.json
set /p scores=<temp-scores.json
echo %scores% >> %log_file%

:: 6. Production Deployment
call :print_colored %BLUE% "6. Deploying to production..."
echo Production Deployment: >> %log_file%
call vercel --prod >> %log_file% 2>&1
if !errorlevel! neq 0 (
    call :print_colored %RED% "Production deployment failed. Check %log_file% for details."
    goto :error
)

:: 7. Post-Deployment Validation
call :print_colored %BLUE% "7. Running post-deployment checks..."
echo Post-Deployment Validation: >> %log_file%
call scripts\validate-deployment.bat >> %log_file% 2>&1

:: 8. Monitor Setup
call :print_colored %BLUE% "8. Setting up monitoring..."
echo Monitoring Setup: >> %log_file%

:: Check Sentry setup
if defined SENTRY_DSN (
    echo Sentry monitoring configured >> %log_file%
) else (
    call :print_colored %YELLOW% "Warning: Sentry DSN not configured"
    echo Warning: Sentry monitoring not configured >> %log_file%
)

:: Check GA setup
if defined GA_MEASUREMENT_ID (
    echo Google Analytics configured >> %log_file%
) else (
    call :print_colored %YELLOW% "Warning: Google Analytics not configured"
    echo Warning: Google Analytics not configured >> %log_file%
)

:: Final Status
echo. >> %log_file%
echo Deployment completed at: %date% %time% >> %log_file%

:: Display summary
call :print_colored %GREEN% "Deployment completed successfully!"
echo.
echo Next Steps:
echo 1. Monitor error tracking in Sentry
echo 2. Review analytics in Google Analytics
echo 3. Run scripts\maintenance.bat weekly
echo 4. Schedule monthly security audits
echo.
echo Detailed logs available in: %log_file%

goto :end

:error
echo. >> %log_file%
echo Deployment failed at: %date% %time% >> %log_file%
call :print_colored %RED% "Deployment failed. Check logs for details."
exit /b 1

:print_colored
echo [%~1m%~2[0m
exit /b

:end
:: Cleanup
del temp-lighthouse.json 2>nul
del temp-scores.json 2>nul

endlocal
