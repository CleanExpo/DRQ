@echo off
setlocal enabledelayedexpansion

:: Define color codes
set "RED=31"
set "GREEN=32"
set "YELLOW=33"
set "BLUE=34"

:: Function to print colored text
call :print_colored %BLUE% "DRQ Website Runner"
echo.

:: Create log file
set "log_file=run-logs\run-%date:~-4,4%%date:~-10,2%%date:~-7,2%.txt"
if not exist "run-logs" mkdir run-logs

echo DRQ Website Run Log > %log_file%
echo ================== >> %log_file%
echo Started: %date% %time% >> %log_file%
echo. >> %log_file%

:: Show available modes
echo Available modes:
echo 1. Development (npm run dev)
echo 2. Production build (npm run build)
echo 3. Production start (npm start)
echo 4. Type check (npm run type-check)
echo 5. Lint check (npm run lint)
echo Q. Quit

:: Get mode selection
set /p "mode=Select mode (1-5, or Q to quit): "

:: Process selection
if "!mode!"=="1" (
    call :print_colored %BLUE% "Starting development server..."
    echo Development Server: >> %log_file%
    call npm run dev >> %log_file% 2>&1
) else if "!mode!"=="2" (
    call :print_colored %BLUE% "Building for production..."
    echo Production Build: >> %log_file%
    call npm run build >> %log_file% 2>&1
) else if "!mode!"=="3" (
    call :print_colored %BLUE% "Starting production server..."
    echo Production Server: >> %log_file%
    call npm start >> %log_file% 2>&1
) else if "!mode!"=="4" (
    call :print_colored %BLUE% "Running type check..."
    echo Type Check: >> %log_file%
    call npm run type-check >> %log_file% 2>&1
) else if "!mode!"=="5" (
    call :print_colored %BLUE% "Running lint check..."
    echo Lint Check: >> %log_file%
    call npm run lint >> %log_file% 2>&1
) else if /i "!mode!"=="Q" (
    goto :end
) else (
    call :print_colored %RED% "Invalid mode selected"
    goto :error
)

if !errorlevel! neq 0 (
    call :print_colored %RED% "Command failed"
    goto :error
)

goto :end

:error
echo Error occurred at: %date% %time% >> %log_file%
call :print_colored %RED% "Run failed. Check log for details."
type %log_file%
exit /b 1

:print_colored
echo [%~1m%~2[0m
exit /b

:end
endlocal
