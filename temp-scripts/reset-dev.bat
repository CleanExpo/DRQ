@echo off
setlocal enabledelayedexpansion

:: Define color codes
set "RED=31"
set "GREEN=32"
set "YELLOW=33"
set "BLUE=34"

:: Function to print colored text
call :print_colored %BLUE% "DRQ Website Development Reset"
echo.

:: Create log file
set "log_file=reset-logs\reset-%date:~-4,4%%date:~-10,2%%date:~-7,2%.txt"
if not exist "reset-logs" mkdir reset-logs

echo DRQ Website Reset Log > %log_file%
echo =================== >> %log_file%
echo Started: %date% %time% >> %log_file%
echo. >> %log_file%

:: 1. Kill processes
call :print_colored %BLUE% "1. Cleaning up processes..."
echo Process Cleanup: >> %log_file%

taskkill /F /IM node.exe >nul 2>&1
if !errorlevel! equ 0 (
    echo Terminated Node.js processes >> %log_file%
) else (
    echo No Node.js processes found >> %log_file%
)

:: 2. Clear Next.js cache
call :print_colored %BLUE% "2. Clearing Next.js cache..."
echo Cache Cleanup: >> %log_file%

if exist ".next" (
    rmdir /s /q .next
    echo Removed .next directory >> %log_file%
)

:: 3. Clear browser data
call :print_colored %BLUE% "3. Clearing browser data..."
echo Browser Cleanup: >> %log_file%

:: Clear Chrome cache (if Chrome is your default browser)
set "chrome_cache=%LOCALAPPDATA%\Google\Chrome\User Data\Default\Cache"
if exist "%chrome_cache%" (
    rmdir /s /q "%chrome_cache%"
    echo Cleared Chrome cache >> %log_file%
)

:: 4. Clean build files
call :print_colored %BLUE% "4. Cleaning build files..."
echo Build Cleanup: >> %log_file%

if exist "node_modules/.cache" (
    rmdir /s /q "node_modules\.cache"
    echo Removed build cache >> %log_file%
)

:: 5. Verify dependencies
call :print_colored %BLUE% "5. Verifying dependencies..."
echo Dependency Check: >> %log_file%

call npm install >> %log_file% 2>&1
if !errorlevel! neq 0 (
    call :print_colored %RED% "Failed to verify dependencies"
    goto :error
)

:: 6. Start development server
call :print_colored %BLUE% "6. Starting development server..."
echo Development Server: >> %log_file%

:: Set environment variables
set NODE_ENV=development
set PORT=3000

:: Start the server
call npm run dev >> %log_file% 2>&1

if !errorlevel! neq 0 (
    call :print_colored %RED% "Failed to start development server"
    goto :error
)

goto :end

:error
echo Error occurred at: %date% %time% >> %log_file%
call :print_colored %RED% "Reset failed. Check log for details."
exit /b 1

:print_colored
echo [%~1m%~2[0m
exit /b

:end
endlocal
