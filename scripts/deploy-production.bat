@echo off
setlocal enabledelayedexpansion

:: Define color codes
set "RED=31"
set "GREEN=32"
set "YELLOW=33"
set "BLUE=34"

:: Function to print colored text
call :print_colored %BLUE% "DRQ Website Production Deployment"
echo.

:: Create log file
set "log_file=deployment-logs\production-%date:~-4,4%%date:~-10,2%%date:~-7,2%.txt"
if not exist "deployment-logs" mkdir deployment-logs

echo DRQ Website Production Deployment Log > %log_file%
echo ================================= >> %log_file%
echo Started: %date% %time% >> %log_file%
echo. >> %log_file%

:: 1. Kill any existing processes
call :print_colored %BLUE% "1. Cleaning up processes..."
echo Process Cleanup: >> %log_file%

taskkill /F /IM node.exe >nul 2>&1

:: 2. Install dependencies
call :print_colored %BLUE% "2. Installing dependencies..."
echo Installing Dependencies: >> %log_file%

call npm install --legacy-peer-deps >> %log_file% 2>&1
if !errorlevel! neq 0 (
    call :print_colored %RED% "Failed to install dependencies"
    goto :error
)

:: 3. Build project
call :print_colored %BLUE% "3. Building project..."
echo Build Process: >> %log_file%

call npm run build >> %log_file% 2>&1
if !errorlevel! neq 0 (
    call :print_colored %RED% "Build failed"
    goto :error
)

:: 4. Verify Vercel CLI
call :print_colored %BLUE% "4. Checking Vercel CLI..."
echo Vercel CLI Check: >> %log_file%

where vercel >nul 2>&1
if !errorlevel! neq 0 (
    call :print_colored %YELLOW% "Installing Vercel CLI..."
    call npm install -g vercel >> %log_file% 2>&1
    if !errorlevel! neq 0 (
        call :print_colored %RED% "Failed to install Vercel CLI"
        goto :error
    )
)

:: 5. Check Vercel login
call :print_colored %BLUE% "5. Verifying Vercel login..."
echo Login Check: >> %log_file%

vercel whoami >> %log_file% 2>&1
if !errorlevel! neq 0 (
    call :print_colored %YELLOW% "Please login to Vercel..."
    vercel login
    if !errorlevel! neq 0 (
        call :print_colored %RED% "Login failed"
        goto :error
    )
)

:: 6. Deploy to production
call :print_colored %BLUE% "6. Deploying to production..."
echo Production Deployment: >> %log_file%

call :print_colored %YELLOW% "Are you sure you want to deploy to production? (Y/N) "
set /p "confirm="
if /i not "!confirm!"=="Y" (
    call :print_colored %YELLOW% "Deployment cancelled"
    goto :end
)

vercel deploy --prod --yes >> %log_file% 2>&1
if !errorlevel! neq 0 (
    call :print_colored %RED% "Production deployment failed"
    goto :error
)

:: 7. Verify deployment
call :print_colored %BLUE% "7. Verifying deployment..."
echo Deployment Verification: >> %log_file%

timeout /t 10 /nobreak > nul
call scripts\verify-deployment.bat >> %log_file% 2>&1
if !errorlevel! neq 0 (
    call :print_colored %RED% "Deployment verification failed"
    set "verification_failed=1"
)

:: Final status
if defined verification_failed (
    call :print_colored %RED% "Deployment completed with verification issues"
    echo.
    echo Action Items:
    echo 1. Check verification logs
    echo 2. Test endpoints manually
    echo 3. Monitor error logs
    echo 4. Consider rollback if needed
    
    exit /b 1
) else (
    call :print_colored %GREEN% "Production deployment completed successfully!"
    echo.
    echo Deployment Summary:
    echo - Build: Successful
    echo - Deploy: Complete
    echo - Verification: Passed
    
    echo.
    echo Next Steps:
    echo 1. Monitor production logs
    echo 2. Test all functionality
    echo 3. Watch error rates
)

goto :end

:error
echo Error occurred at: %date% %time% >> %log_file%
call :print_colored %RED% "Deployment failed. Check log for details."
type %log_file%
exit /b 1

:print_colored
echo [%~1m%~2[0m
exit /b

:end
endlocal
