@echo off
setlocal enabledelayedexpansion

:: Define color codes
set "RED=31"
set "GREEN=32"
set "YELLOW=33"
set "BLUE=34"

:: Function to print colored text
call :print_colored %BLUE% "DRQ Website Server Manager"
echo.

:: Create log file
set "log_file=server-logs\server-%date:~-4,4%%date:~-10,2%%date:~-7,2%.txt"
if not exist "server-logs" mkdir server-logs

echo DRQ Website Server Log > %log_file%
echo ==================== >> %log_file%
echo Started: %date% %time% >> %log_file%
echo. >> %log_file%

:: Function to check if server is running
:check_server
netstat -ano | findstr ":3000" > nul
if !errorlevel! equ 0 (
    set "server_running=1"
) else (
    set "server_running=0"
)
exit /b

:: Show menu
:menu
cls
call :print_colored %BLUE% "Server Management Options:"
echo.
echo 1. Start development server
echo 2. Stop development server
echo 3. Restart development server
echo 4. Check server status
echo 5. Test API endpoints
echo Q. Quit

set /p "option=Select option (1-5, or Q to quit): "

if "!option!"=="1" (
    call :start_server
) else if "!option!"=="2" (
    call :stop_server
) else if "!option!"=="3" (
    call :restart_server
) else if "!option!"=="4" (
    call :server_status
) else if "!option!"=="5" (
    call :test_api
) else if /i "!option!"=="Q" (
    goto :end
) else (
    call :print_colored %RED% "Invalid option"
    timeout /t 2 >nul
    goto :menu
)

goto :menu

:start_server
call :check_server
if "!server_running!"=="1" (
    call :print_colored %YELLOW% "Server is already running"
) else (
    call :print_colored %BLUE% "Starting development server..."
    start /b npm run dev > !log_file! 2>&1
    timeout /t 5 /nobreak > nul
    call :check_server
    if "!server_running!"=="1" (
        call :print_colored %GREEN% "Server started successfully"
    ) else (
        call :print_colored %RED% "Failed to start server"
    )
)
timeout /t 2 >nul
exit /b

:stop_server
call :check_server
if "!server_running!"=="0" (
    call :print_colored %YELLOW% "Server is not running"
) else (
    call :print_colored %BLUE% "Stopping development server..."
    for /f "tokens=5" %%a in ('netstat -ano ^| findstr ":3000"') do (
        taskkill /F /PID %%a >nul 2>&1
    )
    timeout /t 2 /nobreak > nul
    call :check_server
    if "!server_running!"=="0" (
        call :print_colored %GREEN% "Server stopped successfully"
    ) else (
        call :print_colored %RED% "Failed to stop server"
    )
)
timeout /t 2 >nul
exit /b

:restart_server
call :stop_server
timeout /t 2 /nobreak > nul
call :start_server
exit /b

:server_status
call :check_server
if "!server_running!"=="1" (
    call :print_colored %GREEN% "Server is running"
) else (
    call :print_colored %YELLOW% "Server is not running"
)
timeout /t 2 >nul
exit /b

:test_api
call :check_server
if "!server_running!"=="0" (
    call :print_colored %RED% "Server is not running. Start it first."
    timeout /t 2 >nul
    exit /b
)

call :print_colored %BLUE% "Testing API endpoints..."
curl -f http://localhost:3000/api/health
if !errorlevel! neq 0 (
    call :print_colored %RED% "Health endpoint not responding"
) else (
    call :print_colored %GREEN% "Health endpoint is working"
)
echo.
timeout /t 2 >nul
exit /b

:print_colored
echo [%~1m%~2[0m
exit /b

:end
:: Stop server before exiting
call :stop_server
endlocal
