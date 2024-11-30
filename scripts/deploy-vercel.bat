@echo off
setlocal enabledelayedexpansion

:: Define color codes
set "RED=31"
set "GREEN=32"
set "YELLOW=33"
set "BLUE=34"

:: Function to print colored text
call :print_colored %BLUE% "DRQ Website Vercel Deployment"
echo.

:: Create log file
set "log_file=deployment-logs\vercel-%date:~-4,4%%date:~-10,2%%date:~-7,2%.txt"
if not exist "deployment-logs" mkdir deployment-logs

echo DRQ Website Vercel Deployment Log > %log_file%
echo ============================= >> %log_file%
echo Started: %date% %time% >> %log_file%
echo. >> %log_file%

:: 1. Check Vercel CLI
call :print_colored %BLUE% "1. Checking Vercel CLI..."
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

:: 2. Kill any existing Node processes
call :print_colored %BLUE% "2. Cleaning up processes..."
echo Process Cleanup: >> %log_file%

taskkill /F /IM node.exe >nul 2>&1

:: 3. Build project
call :print_colored %BLUE% "3. Building project..."
echo Build Process: >> %log_file%

call npm run build >> %log_file% 2>&1
if !errorlevel! neq 0 (
    call :print_colored %RED% "Build failed"
    goto :error
)

:: 4. Verify Vercel login
call :print_colored %BLUE% "4. Verifying Vercel login..."
echo Login Verification: >> %log_file%

vercel whoami >> %log_file% 2>&1
if !errorlevel! neq 0 (
    call :print_colored %YELLOW% "Please login to Vercel..."
    vercel login
    if !errorlevel! neq 0 (
        call :print_colored %RED% "Login failed"
        goto :error
    )
)

:: 5. Link project if needed
call :print_colored %BLUE% "5. Checking project link..."
echo Project Link: >> %log_file%

if not exist ".vercel" (
    call :print_colored %YELLOW% "Linking project..."
    vercel link >> %log_file% 2>&1
    if !errorlevel! neq 0 (
        call :print_colored %RED% "Project linking failed"
        goto :error
    )
)

:: 6. Deploy to Vercel
call :print_colored %BLUE% "6. Deploying to Vercel..."
echo Vercel Deployment: >> %log_file%

:: Ask for deployment type
set /p "prod=Deploy to production? (Y/N) "
if /i "!prod!"=="Y" (
    call :print_colored %BLUE% "Deploying to production..."
    vercel deploy --prod --yes >> %log_file% 2>&1
) else (
    call :print_colored %BLUE% "Creating preview deployment..."
    vercel deploy --yes >> %log_file% 2>&1
)

if !errorlevel! neq 0 (
    call :print_colored %RED% "Deployment failed"
    goto :error
)

:: 7. Get deployment URL
call :print_colored %BLUE% "7. Getting deployment URL..."
echo Deployment URL: >> %log_file%

if /i "!prod!"=="Y" (
    for /f "tokens=2 delims= " %%a in ('vercel ls --prod ^| findstr "drq-website"') do (
        set "url=%%a"
        echo Production URL: !url! >> %log_file%
        call :print_colored %GREEN% "Production URL: !url!"
    )
) else (
    for /f "tokens=2 delims= " %%a in ('vercel ls ^| findstr "drq-website"') do (
        set "url=%%a"
        echo Preview URL: !url! >> %log_file%
        call :print_colored %GREEN% "Preview URL: !url!"
    )
)

:: Final status
call :print_colored %GREEN% "Deployment completed successfully!"
echo.
echo Deployment Summary:
echo - Build: Successful
echo - Environment: !prod!=="Y" ? Production : Preview
echo - URL: !url!

echo.
echo Next Steps:
echo 1. Visit the deployment URL
echo 2. Test the API endpoints
echo 3. Monitor performance

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
