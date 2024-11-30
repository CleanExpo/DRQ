@echo off
setlocal enabledelayedexpansion

:: Define color codes
set "RED=31"
set "GREEN=32"
set "YELLOW=33"
set "BLUE=34"

:: Function to print colored text
call :print_colored %BLUE% "DRQ Website Error Analysis"
echo.

:: 1. Check TypeScript errors
call :print_colored %BLUE% "1. Checking TypeScript errors..."
echo.

call npm run type-check

:: 2. Check Next.js build errors
call :print_colored %BLUE% "2. Checking build errors..."
echo.

call npm run build

:: 3. Display verification logs
call :print_colored %BLUE% "3. Recent verification logs..."
echo.

if exist "verification-logs" (
    for /f "delims=" %%a in ('dir /b /od verification-logs\*.txt') do set "latest_log=%%a"
    if defined latest_log (
        type "verification-logs\!latest_log!"
    ) else (
        echo No verification logs found.
    )
) else (
    echo No verification logs directory found.
)

:: 4. Display development logs
call :print_colored %BLUE% "4. Recent development logs..."
echo.

if exist "dev-logs" (
    for /f "delims=" %%a in ('dir /b /od dev-logs\*.txt') do set "latest_log=%%a"
    if defined latest_log (
        type "dev-logs\!latest_log!"
    ) else (
        echo No development logs found.
    )
) else (
    echo No development logs directory found.
)

goto :end

:print_colored
echo [%~1m%~2[0m
exit /b

:end
endlocal
