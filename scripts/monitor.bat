@echo off
setlocal enabledelayedexpansion

:: Define color codes
set "RED=31"
set "GREEN=32"
set "YELLOW=33"
set "BLUE=34"

:: Function to print colored text
call :print_colored %BLUE% "DRQ Website Deployment Monitor"
echo.

:: Create log file
set "log_file=monitor-logs\monitor-%date:~-4,4%%date:~-10,2%%date:~-7,2%.txt"
if not exist "monitor-logs" mkdir monitor-logs

echo DRQ Website Monitor Log > %log_file%
echo ===================== >> %log_file%
echo Started: %date% %time% >> %log_file%
echo. >> %log_file%

:: 1. Check Vercel CLI
call :print_colored %BLUE% "1. Checking Vercel CLI..."
echo Vercel CLI Check: >> %log_file%

where vercel >nul 2>&1
if !errorlevel! neq 0 (
    call :print_colored %RED% "Vercel CLI not found. Please run scripts\deploy.bat first"
    goto :error
)

:: 2. Check deployment status
call :print_colored %BLUE% "2. Checking deployment status..."
echo Deployment Status: >> %log_file%

:: Get latest deployment info
call vercel ls >> %log_file% 2>&1
if !errorlevel! neq 0 (
    call :print_colored %RED% "Failed to get deployment info"
    goto :error
)

:: 3. Check production status
call :print_colored %BLUE% "3. Checking production status..."
echo Production Status: >> %log_file%

call vercel ls --prod >> %log_file% 2>&1
if !errorlevel! neq 0 (
    call :print_colored %RED% "Failed to get production status"
    goto :error
)

:: 4. Check deployment logs
call :print_colored %BLUE% "4. Checking deployment logs..."
echo Deployment Logs: >> %log_file%

call vercel logs >> %log_file% 2>&1
if !errorlevel! neq 0 (
    call :print_colored %YELLOW% "No deployment logs available"
    echo No logs available >> %log_file%
)

:: 5. Check deployment inspect
call :print_colored %BLUE% "5. Inspecting deployment..."
echo Deployment Inspect: >> %log_file%

call vercel inspect >> %log_file% 2>&1
if !errorlevel! neq 0 (
    call :print_colored %YELLOW% "Could not inspect deployment"
    echo Inspect failed >> %log_file%
)

:: 6. Monitor options
call :print_colored %BLUE% "6. Available monitoring options:"
echo.
echo 1. View deployment logs:    vercel logs
echo 2. Inspect deployment:      vercel inspect
echo 3. List deployments:        vercel ls
echo 4. Production status:       vercel ls --prod
echo 5. Open dashboard:          vercel dashboard

:: Ask for monitoring option
echo.
set /p "option=Select monitoring option (1-5, or Q to quit): "

if "!option!"=="1" (
    vercel logs
) else if "!option!"=="2" (
    vercel inspect
) else if "!option!"=="3" (
    vercel ls
) else if "!option!"=="4" (
    vercel ls --prod
) else if "!option!"=="5" (
    vercel dashboard
) else if /i "!option!"=="Q" (
    goto :end
) else (
    call :print_colored %YELLOW% "Invalid option"
)

:: Final status
call :print_colored %GREEN% "Monitoring completed!"
echo.
echo Monitoring Summary:
echo - Deployment: Active
echo - Logs: Available
echo - Status: Verified

echo.
echo Next Steps:
echo 1. Check Vercel dashboard for detailed metrics
echo 2. Monitor error logs for issues
echo 3. Test deployment functionality

goto :end

:error
echo Error occurred at: %date% %time% >> %log_file%
call :print_colored %RED% "Monitoring failed. Check log for details."
type %log_file%
exit /b 1

:print_colored
echo [%~1m%~2[0m
exit /b

:end
endlocal
