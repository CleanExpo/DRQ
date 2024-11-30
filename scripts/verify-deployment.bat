@echo off
setlocal enabledelayedexpansion

:: Define color codes
set "RED=31"
set "GREEN=32"
set "YELLOW=33"
set "BLUE=34"

:: Function to print colored text
call :print_colored %BLUE% "DRQ Website Deployment Verification"
echo.

:: Create log file
set "log_file=verification-logs\deploy-%date:~-4,4%%date:~-10,2%%date:~-7,2%.txt"
if not exist "verification-logs" mkdir verification-logs

echo DRQ Website Deployment Verification Log > %log_file%
echo =================================== >> %log_file%
echo Started: %date% %time% >> %log_file%
echo. >> %log_file%

:: Get deployment URL
call :print_colored %BLUE% "Getting deployment URL..."
echo Deployment URL Check: >> %log_file%

:: Create temporary file for vercel output
vercel ls --prod > vercel_output.txt

:: Extract the most recent deployment URL
for /f "tokens=2" %%a in ('findstr /R "https://.*vercel.app" vercel_output.txt') do (
    set "base_url=%%a"
    goto :found_url
)

:found_url
del vercel_output.txt

if not defined base_url (
    call :print_colored %RED% "Could not find deployment URL"
    goto :error
)

call :print_colored %GREEN% "Found deployment URL: !base_url!"
echo Base URL: !base_url! >> %log_file%

:: Test health endpoint
call :print_colored %BLUE% "Testing health endpoint..."
echo Health Check: >> %log_file%

curl -f !base_url!/api/health -o health.json
if !errorlevel! neq 0 (
    call :print_colored %RED% "Health check failed"
    set "verification_failed=1"
) else (
    call :print_colored %GREEN% "Health check passed"
    type health.json >> %log_file%
)

:: Test services endpoint
call :print_colored %BLUE% "Testing services endpoint..."
echo Services Check: >> %log_file%

curl -f !base_url!/api/services -o services.json
if !errorlevel! neq 0 (
    call :print_colored %RED% "Services endpoint failed"
    set "verification_failed=1"
) else (
    call :print_colored %GREEN% "Services endpoint passed"
    type services.json >> %log_file%
)

:: Test areas endpoint
call :print_colored %BLUE% "Testing areas endpoint..."
echo Areas Check: >> %log_file%

curl -f !base_url!/api/areas -o areas.json
if !errorlevel! neq 0 (
    call :print_colored %RED% "Areas endpoint failed"
    set "verification_failed=1"
) else (
    call :print_colored %GREEN% "Areas endpoint passed"
    type areas.json >> %log_file%
)

:: Test postcode check
call :print_colored %BLUE% "Testing postcode check..."
echo Postcode Check: >> %log_file%

curl -f !base_url!/api/areas/check/4000 -o postcode.json
if !errorlevel! neq 0 (
    call :print_colored %RED% "Postcode check failed"
    set "verification_failed=1"
) else (
    call :print_colored %GREEN% "Postcode check passed"
    type postcode.json >> %log_file%
)

:: Clean up response files
del health.json services.json areas.json postcode.json 2>nul

:: Final status
if defined verification_failed (
    call :print_colored %RED% "Deployment verification completed with issues"
    echo.
    echo Action Items:
    echo 1. Check failed endpoints
    echo 2. Verify API responses
    echo 3. Check error logs
    echo 4. Run verification again
    
    exit /b 1
) else (
    call :print_colored %GREEN% "Deployment verification completed successfully!"
    echo.
    echo Verification Summary:
    echo - Health Check: Passed
    echo - Services API: Working
    echo - Areas API: Working
    echo - Postcode Check: Working
    echo - URL: !base_url!
    
    echo.
    echo Next Steps:
    echo 1. Test frontend functionality
    echo 2. Monitor API performance
    echo 3. Check error logs
)

goto :end

:error
echo Error occurred at: %date% %time% >> %log_file%
call :print_colored %RED% "Verification failed. Check log for details."
type %log_file%
exit /b 1

:print_colored
echo [%~1m%~2[0m
exit /b

:end
endlocal
