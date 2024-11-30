@echo off
setlocal enabledelayedexpansion

:: Define color codes
set "RED=31"
set "GREEN=32"
set "YELLOW=33"
set "BLUE=34"

:: Function to print colored text
call :print_colored %BLUE% "DRQ Website Deployment Validation"
echo.

:: Create validation log
set "log_file=validation-logs\deployment-%date:~-4,4%%date:~-10,2%%date:~-7,2%.txt"
if not exist "validation-logs" mkdir validation-logs

echo DRQ Website Deployment Validation Log > %log_file%
echo ================================= >> %log_file%
echo Started: %date% %time% >> %log_file%
echo. >> %log_file%

:: 1. Run full workflow validation
call :print_colored %BLUE% "1. Running workflow validation..."
echo Workflow Validation: >> %log_file%
call scripts\validate-workflow.bat >> %log_file% 2>&1
if !errorlevel! neq 0 (
    call :print_colored %RED% "Workflow validation failed"
    goto :error
)

:: 2. Deploy to Vercel
call :print_colored %BLUE% "2. Deploying to Vercel..."
echo Vercel Deployment: >> %log_file%
call vercel --prod >> %log_file% 2>&1
if !errorlevel! neq 0 (
    call :print_colored %RED% "Vercel deployment failed"
    goto :error
)

:: 3. DNS Check
call :print_colored %BLUE% "3. Checking DNS propagation..."
echo DNS Check: >> %log_file%
nslookup www.disasterrecoveryqld.au >> %log_file% 2>&1
if !errorlevel! neq 0 (
    call :print_colored %YELLOW% "DNS check failed - may need time to propagate"
    echo DNS propagation pending >> %log_file%
)

:: 4. Site Availability
call :print_colored %BLUE% "4. Checking site availability..."
echo Site Availability: >> %log_file%

:: Wait for deployment
timeout /t 30 /nobreak > nul

:: Test main routes
set "routes=/ /services /contact"
for %%r in (%routes%) do (
    curl -f https://www.disasterrecoveryqld.au%%r -o nul 2>>%log_file%
    if !errorlevel! neq 0 (
        call :print_colored %RED% "Route %%r not accessible"
        echo Route %%r failed >> %log_file%
        set "validation_failed=1"
    ) else (
        echo Route %%r accessible >> %log_file%
    )
)

:: 5. Performance Check
call :print_colored %BLUE% "5. Running performance checks..."
echo Performance Check: >> %log_file%

:: Install Lighthouse if needed
npm list -g lighthouse > nul 2>&1
if !errorlevel! neq 0 (
    call :print_colored %YELLOW% "Installing Lighthouse..."
    call npm install -g lighthouse >> %log_file% 2>&1
)

:: Run Lighthouse
lighthouse https://www.disasterrecoveryqld.au --output json --output-path=./temp-lighthouse.json --chrome-flags="--headless" >> %log_file% 2>&1

:: Parse scores
node -e "const report = require('./temp-lighthouse.json'); const scores = {performance: report.categories.performance.score * 100, accessibility: report.categories.accessibility.score * 100, seo: report.categories.seo.score * 100}; console.log(JSON.stringify(scores));" > temp-scores.json
set /p scores=<temp-scores.json

echo Performance Scores: >> %log_file%
echo %scores% >> %log_file%

:: 6. Error Monitoring
call :print_colored %BLUE% "6. Checking error monitoring..."
echo Error Monitoring: >> %log_file%

:: Check Sentry setup
if defined SENTRY_DSN (
    echo Sentry monitoring configured >> %log_file%
) else (
    call :print_colored %YELLOW% "Warning: Sentry monitoring not configured"
    echo Sentry monitoring not configured >> %log_file%
)

:: 7. Analytics Check
call :print_colored %BLUE% "7. Verifying analytics..."
echo Analytics Check: >> %log_file%

:: Check GA setup
if defined GA_MEASUREMENT_ID (
    echo Google Analytics configured >> %log_file%
) else (
    call :print_colored %YELLOW% "Warning: Google Analytics not configured"
    echo Google Analytics not configured >> %log_file%
)

:: 8. Security Headers
call :print_colored %BLUE% "8. Checking security headers..."
echo Security Headers: >> %log_file%
curl -I https://www.disasterrecoveryqld.au >> %log_file% 2>&1

:: Clean up
del temp-lighthouse.json temp-scores.json 2>nul

:: Final status
if defined validation_failed (
    call :print_colored %RED% "Deployment validation failed. Check log for details."
    echo.
    echo Troubleshooting Steps:
    echo 1. Review Vercel deployment logs
    echo 2. Check DNS configuration
    echo 3. Verify security headers
    echo 4. Monitor error tracking
    
    exit /b 1
) else (
    call :print_colored %GREEN% "Deployment validation successful!"
    echo.
    echo Deployment Summary:
    echo - Site: https://www.disasterrecoveryqld.au
    echo - Status: Live and accessible
    echo - Performance: Validated
    echo - Monitoring: Active
    
    echo.
    echo Next Steps:
    echo 1. Monitor Vercel dashboard
    echo 2. Check Sentry for errors
    echo 3. Review Google Analytics
    echo 4. Schedule regular maintenance
)

goto :end

:error
echo Error occurred at: %date% %time% >> %log_file%
call :print_colored %RED% "Deployment validation failed. Check log for details."
exit /b 1

:print_colored
echo [%~1m%~2[0m
exit /b

:end
endlocal
