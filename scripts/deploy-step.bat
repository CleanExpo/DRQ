@echo off
setlocal enabledelayedexpansion

:: Define color codes
set "RED=31"
set "GREEN=32"
set "YELLOW=33"
set "BLUE=34"

:: Function to print colored text
call :print_colored %BLUE% "DRQ Website Step-by-Step Deployment"
echo.

:: Create log file
set "log_file=deployment-logs\deploy-step-%date:~-4,4%%date:~-10,2%%date:~-7,2%.txt"
if not exist "deployment-logs" mkdir deployment-logs

echo DRQ Website Step Deployment Log > %log_file%
echo ============================= >> %log_file%
echo Started: %date% %time% >> %log_file%
echo. >> %log_file%

:: Step 1: Install Vercel CLI
call :print_colored %BLUE% "Step 1: Installing Vercel CLI..."
call npm install -g vercel
if !errorlevel! neq 0 (
    call :print_colored %RED% "Failed to install Vercel CLI"
    goto :error
)
call :print_colored %GREEN% "Vercel CLI installed successfully"
pause

:: Step 2: Login to Vercel
call :print_colored %BLUE% "Step 2: Logging in to Vercel..."
vercel login
if !errorlevel! neq 0 (
    call :print_colored %RED% "Failed to login to Vercel"
    goto :error
)
call :print_colored %GREEN% "Logged in to Vercel successfully"
pause

:: Step 3: Link project
call :print_colored %BLUE% "Step 3: Linking project..."
if exist ".vercel" (
    call :print_colored %YELLOW% "Project already linked. Removing old link..."
    rmdir /s /q .vercel
)
vercel link
if !errorlevel! neq 0 (
    call :print_colored %RED% "Failed to link project"
    goto :error
)
call :print_colored %GREEN% "Project linked successfully"
pause

:: Step 4: Pull environment variables
call :print_colored %BLUE% "Step 4: Pulling environment variables..."
vercel env pull .env.local
if !errorlevel! neq 0 (
    call :print_colored %YELLOW% "No environment variables to pull"
)
call :print_colored %GREEN% "Environment setup complete"
pause

:: Step 5: Build project
call :print_colored %BLUE% "Step 5: Building project..."
call npm run build
if !errorlevel! neq 0 (
    call :print_colored %RED% "Build failed"
    goto :error
)
call :print_colored %GREEN% "Build successful"
pause

:: Step 6: Deploy to Vercel
call :print_colored %BLUE% "Step 6: Deploying to Vercel..."
set /p "prod=Deploy to production? (Y/N) "
if /i "!prod!"=="Y" (
    vercel deploy --prod
) else (
    vercel deploy
)
if !errorlevel! neq 0 (
    call :print_colored %RED% "Deployment failed"
    goto :error
)
call :print_colored %GREEN% "Deployment successful"
pause

:: Step 7: Verify deployment
call :print_colored %BLUE% "Step 7: Verifying deployment..."
vercel ls
if !errorlevel! neq 0 (
    call :print_colored %RED% "Failed to verify deployment"
    goto :error
)
call :print_colored %GREEN% "Deployment verified"

:: Final status
call :print_colored %GREEN% "Deployment process completed successfully!"
echo.
echo Next Steps:
echo 1. Check deployment URL above
echo 2. Test the deployed site
echo 3. Monitor with: scripts\monitor.bat

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
