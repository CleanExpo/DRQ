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
set "log_file=deployment-logs\deploy-%date:~-4,4%%date:~-10,2%%date:~-7,2%.txt"
if not exist "deployment-logs" mkdir deployment-logs

echo DRQ Website Deployment Log > %log_file%
echo ======================= >> %log_file%
echo Started: %date% %time% >> %log_file%
echo. >> %log_file%

:: 1. Check Vercel CLI
call :print_colored %BLUE% "1. Checking Vercel CLI..."
echo Vercel CLI Check: >> %log_file%

where vercel >nul 2>&1
if !errorlevel! neq 0 (
    call :print_colored %YELLOW% "Installing Vercel CLI globally..."
    call npm install -g vercel >> %log_file% 2>&1
    if !errorlevel! neq 0 (
        call :print_colored %RED% "Failed to install Vercel CLI"
        goto :error
    )
)

:: 2. Verify login status
call :print_colored %BLUE% "2. Checking Vercel login..."
echo Login Check: >> %log_file%

vercel whoami >nul 2>&1
if !errorlevel! neq 0 (
    call :print_colored %YELLOW% "Please log in to Vercel..."
    call vercel login
    if !errorlevel! neq 0 (
        call :print_colored %RED% "Failed to log in to Vercel"
        goto :error
    )
)

:: 3. Build check
call :print_colored %BLUE% "3. Running build check..."
echo Build Check: >> %log_file%

call npm run build >> %log_file% 2>&1
if !errorlevel! neq 0 (
    call :print_colored %RED% "Build failed"
    goto :error
)

:: 4. Deploy to Vercel
call :print_colored %BLUE% "4. Deploying to Vercel..."
echo Vercel Deployment: >> %log_file%

:: Ask for environment
set /p "env=Deploy to production? (Y/N) "
if /i "!env!"=="Y" (
    call :print_colored %BLUE% "Deploying to production..."
    call vercel --prod --confirm >> %log_file% 2>&1
) else (
    call :print_colored %BLUE% "Creating preview deployment..."
    call vercel --confirm >> %log_file% 2>&1
)

if !errorlevel! neq 0 (
    call :print_colored %RED% "Deployment failed"
    goto :error
)

:: 5. Get deployment URL
call :print_colored %BLUE% "5. Getting deployment URL..."
echo Deployment URL: >> %log_file%

if /i "!env!"=="Y" (
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
echo - Environment: !env!=="Y" ? Production : Preview
echo - URL: !url!

echo.
echo Next Steps:
echo 1. Visit the deployment URL
echo 2. Test all functionality
echo 3. Monitor performance in Vercel dashboard

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
