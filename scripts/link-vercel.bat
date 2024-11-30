@echo off
setlocal enabledelayedexpansion

:: Define color codes
set "RED=31"
set "GREEN=32"
set "YELLOW=33"
set "BLUE=34"

:: Function to print colored text
call :print_colored %BLUE% "DRQ Website Vercel Project Link"
echo.

:: Create log file
set "log_file=link-logs\link-%date:~-4,4%%date:~-10,2%%date:~-7,2%.txt"
if not exist "link-logs" mkdir link-logs

echo DRQ Website Link Log > %log_file%
echo =================== >> %log_file%
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

:: 2. Check login status
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

:: 3. Link project
call :print_colored %BLUE% "3. Linking project..."
echo Project Link: >> %log_file%

:: Check if already linked
if exist ".vercel" (
    call :print_colored %YELLOW% "Project already linked. Do you want to relink? (Y/N) "
    set /p "relink="
    if /i "!relink!"=="Y" (
        rmdir /s /q .vercel
    ) else (
        goto :skip_link
    )
)

call vercel link --confirm >> %log_file% 2>&1
if !errorlevel! neq 0 (
    call :print_colored %RED% "Failed to link project"
    goto :error
)

:skip_link

:: 4. Pull environment variables
call :print_colored %BLUE% "4. Pulling environment variables..."
echo Environment Variables: >> %log_file%

call vercel env pull .env.local >> %log_file% 2>&1
if !errorlevel! neq 0 (
    call :print_colored %YELLOW% "No environment variables to pull"
    echo No environment variables >> %log_file%
)

:: 5. Verify project settings
call :print_colored %BLUE% "5. Verifying project settings..."
echo Project Settings: >> %log_file%

call vercel project ls >> %log_file% 2>&1
if !errorlevel! neq 0 (
    call :print_colored %RED% "Failed to verify project settings"
    goto :error
)

:: Final status
call :print_colored %GREEN% "Project link completed successfully!"
echo.
echo Link Summary:
echo - CLI: Installed
echo - Login: Verified
echo - Project: Linked
echo - Environment: Configured

echo.
echo Next Steps:
echo 1. Run scripts\deploy.bat to deploy
echo 2. Use scripts\monitor.bat to monitor
echo 3. Check Vercel dashboard for settings

goto :end

:error
echo Error occurred at: %date% %time% >> %log_file%
call :print_colored %RED% "Project link failed. Check log for details."
type %log_file%
exit /b 1

:print_colored
echo [%~1m%~2[0m
exit /b

:end
endlocal
