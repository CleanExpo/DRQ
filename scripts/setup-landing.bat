@echo off
setlocal enabledelayedexpansion

:: Define color codes
set "RED=31"
set "GREEN=32"
set "YELLOW=33"
set "BLUE=34"

:: Function to print colored text
call :print_colored %BLUE% "DRQ Website Landing Page Setup"
echo.

:: Create log file
set "log_file=setup-logs\landing-%date:~-4,4%%date:~-10,2%%date:~-7,2%.txt"
if not exist "setup-logs" mkdir setup-logs

echo DRQ Website Landing Page Setup Log > %log_file%
echo ============================== >> %log_file%
echo Started: %date% %time% >> %log_file%
echo. >> %log_file%

:: 1. Install dependencies
call :print_colored %BLUE% "1. Installing dependencies..."
echo Installing Dependencies: >> %log_file%

call npm install --legacy-peer-deps >> %log_file% 2>&1
if !errorlevel! neq 0 (
    call :print_colored %RED% "Failed to install dependencies"
    goto :error
)

:: 2. Create public directory for logo
call :print_colored %BLUE% "2. Setting up public directory..."
echo Public Directory Setup: >> %log_file%

if not exist "public" mkdir public
if not exist "public\images" mkdir public\images

:: 3. Build project
call :print_colored %BLUE% "3. Building project..."
echo Building Project: >> %log_file%

call npm run build >> %log_file% 2>&1
if !errorlevel! neq 0 (
    call :print_colored %RED% "Build failed"
    goto :error
)

:: 4. Start development server
call :print_colored %BLUE% "4. Starting development server..."
echo Development Server: >> %log_file%

:: Kill any existing Node processes
taskkill /F /IM node.exe >nul 2>&1

:: Start the server
call :print_colored %GREEN% "Starting development server..."
echo.
echo Server will be available at: http://localhost:3000
echo.
echo Press Ctrl+C to stop the server
echo.

npm run dev

goto :end

:error
echo Error occurred at: %date% %time% >> %log_file%
call :print_colored %RED% "Setup failed. Check log for details."
type %log_file%
exit /b 1

:print_colored
echo [%~1m%~2[0m
exit /b

:end
endlocal
