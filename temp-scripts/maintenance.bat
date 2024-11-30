@echo off
setlocal enabledelayedexpansion

:: Define color codes
set "RED=31"
set "GREEN=32"
set "YELLOW=33"
set "BLUE=34"

:: Function to print colored text
call :print_colored %BLUE% "DRQ Website Maintenance"
echo.

:: Create maintenance log
set "log_file=maintenance-logs\maintenance-%date:~-4,4%%date:~-10,2%%date:~-7,2%.txt"
if not exist "maintenance-logs" mkdir maintenance-logs

echo DRQ Website Maintenance Log > %log_file%
echo ========================= >> %log_file%
echo Started: %date% %time% >> %log_file%
echo. >> %log_file%

:: 1. Run full validation
call :print_colored %BLUE% "1. Running validation workflow..."
echo Validation Workflow: >> %log_file%
call scripts\validate-workflow.bat >> %log_file% 2>&1
if !errorlevel! neq 0 (
    call :print_colored %RED% "Validation workflow failed"
    goto :error
)

:: 2. Check for outdated dependencies
call :print_colored %BLUE% "2. Checking dependencies..."
echo Dependency Check: >> %log_file%
call npm outdated >> %log_file% 2>&1

:: 3. Update dependencies if needed
call :print_colored %BLUE% "3. Updating dependencies..."
echo Dependency Update: >> %log_file%
call npm update >> %log_file% 2>&1

:: 4. Security audit
call :print_colored %BLUE% "4. Running security audit..."
echo Security Audit: >> %log_file%
call npm audit >> %log_file% 2>&1
if !errorlevel! neq 0 (
    call :print_colored %YELLOW% "Security vulnerabilities found"
    echo Security vulnerabilities found >> %log_file%
    
    :: Try to fix vulnerabilities
    call :print_colored %BLUE% "Attempting to fix vulnerabilities..."
    call npm audit fix >> %log_file% 2>&1
)

:: 5. Performance check
call :print_colored %BLUE% "5. Checking performance..."
echo Performance Check: >> %log_file%

:: Run Lighthouse
lighthouse https://www.disasterrecoveryqld.au --output json --output-path=./temp-lighthouse.json --chrome-flags="--headless" >> %log_file% 2>&1

:: Parse scores
node -e "const report = require('./temp-lighthouse.json'); const scores = {performance: report.categories.performance.score * 100, accessibility: report.categories.accessibility.score * 100, seo: report.categories.seo.score * 100}; console.log(JSON.stringify(scores));" > temp-scores.json
set /p scores=<temp-scores.json

echo Performance Scores: >> %log_file%
echo %scores% >> %log_file%

:: 6. Error monitoring
call :print_colored %BLUE% "6. Checking error logs..."
echo Error Monitoring: >> %log_file%

:: Check Vercel logs
vercel logs >> %log_file% 2>&1

:: Check Sentry if configured
if defined SENTRY_DSN (
    sentry-cli monitor >> %log_file% 2>&1
)

:: 7. Analytics review
call :print_colored %BLUE% "7. Reviewing analytics..."
echo Analytics Review: >> %log_file%

if defined GA_MEASUREMENT_ID (
    echo Google Analytics configured and tracking >> %log_file%
) else (
    call :print_colored %YELLOW% "Warning: Google Analytics not configured"
    echo Google Analytics not configured >> %log_file%
)

:: 8. Route health check
call :print_colored %BLUE% "8. Checking route health..."
echo Route Health: >> %log_file%

set "routes=/ /services /contact"
for %%r in (%routes%) do (
    curl -f https://www.disasterrecoveryqld.au%%r -o nul 2>>%log_file%
    if !errorlevel! neq 0 (
        call :print_colored %RED% "Route %%r not accessible"
        echo Route %%r failed >> %log_file%
        set "maintenance_failed=1"
    ) else (
        echo Route %%r accessible >> %log_file%
    )
)

:: Clean up
del temp-lighthouse.json temp-scores.json 2>nul

:: Final status
if defined maintenance_failed (
    call :print_colored %RED% "Maintenance check failed. Review logs for details."
    echo.
    echo Action Items:
    echo 1. Fix failing routes
    echo 2. Address security vulnerabilities
    echo 3. Improve performance scores
    echo 4. Review error logs
    
    exit /b 1
) else (
    call :print_colored %GREEN% "Maintenance completed successfully!"
    echo.
    echo Maintenance Summary:
    echo - Dependencies: Updated
    echo - Security: Checked
    echo - Performance: Monitored
    echo - Routes: Validated
    
    echo.
    echo Next Steps:
    echo 1. Review maintenance log: %log_file%
    echo 2. Monitor Vercel dashboard
    echo 3. Check analytics trends
    echo 4. Schedule next maintenance
)

goto :end

:error
echo Error occurred at: %date% %time% >> %log_file%
call :print_colored %RED% "Maintenance failed. Check log for details."
exit /b 1

:print_colored
echo [%~1m%~2[0m
exit /b

:end
endlocal
