@echo off
setlocal enabledelayedexpansion

:: Define color codes
set "RED=31"
set "GREEN=32"
set "YELLOW=33"
set "BLUE=34"

:: Function to print colored text
call :print_colored %BLUE% "DRQ Website Development Server"
echo.

:: Create log file
set "log_file=dev-logs\dev-%date:~-4,4%%date:~-10,2%%date:~-7,2%.txt"
if not exist "dev-logs" mkdir dev-logs

echo DRQ Website Development Log > %log_file%
echo ======================= >> %log_file%
echo Started: %date% %time% >> %log_file%
echo. >> %log_file%

:: 1. Kill any existing Node processes
call :print_colored %BLUE% "1. Cleaning up existing processes..."
echo Process Cleanup: >> %log_file%

taskkill /F /IM node.exe >nul 2>&1
if !errorlevel! equ 0 (
    echo Terminated existing Node.js processes >> %log_file%
) else (
    echo No existing Node.js processes found >> %log_file%
)

:: 2. Clean next cache
call :print_colored %BLUE% "2. Cleaning Next.js cache..."
echo Cache Cleanup: >> %log_file%

if exist ".next" (
    rmdir /s /q .next
    echo Removed .next directory >> %log_file%
)

:: 3. Verify dependencies
call :print_colored %BLUE% "3. Verifying dependencies..."
echo Dependency Check: >> %log_file%

call npm ls next react react-dom >> %log_file% 2>&1
if !errorlevel! neq 0 (
    call :print_colored %YELLOW% "Installing missing dependencies..."
    call npm install >> %log_file% 2>&1
)

:: 4. Start development server
call :print_colored %BLUE% "4. Starting development server..."
echo Development Server: >> %log_file%

:: Set environment variables
set NODE_ENV=development
set PORT=3000

:: Start the server with error handling
call npm run dev >> %log_file% 2>&1

if !errorlevel! neq 0 (
    call :print_colored %RED% "Failed to start development server"
    echo Server failed to start >> %log_file%
    goto :error
)

goto :end

:error
echo Error occurred at: %date% %time% >> %log_file%
call :print_colored %RED% "Development server failed. Check log for details."
exit /b 1

:print_colored
echo [%~1m%~2[0m
exit /b

:end
endlocal
