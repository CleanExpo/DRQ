@echo off
setlocal enabledelayedexpansion

:: Define color codes
set "RED=31"
set "GREEN=32"
set "YELLOW=33"
set "BLUE=34"

:: Function to print colored text
call :print_colored %BLUE% "DRQ Website Development Tools"
echo.

:: Create log file
set "log_file=dev-logs\dev-%date:~-4,4%%date:~-10,2%%date:~-7,2%.txt"
if not exist "dev-logs" mkdir dev-logs

echo DRQ Website Development Log > %log_file%
echo ========================= >> %log_file%
echo Started: %date% %time% >> %log_file%
echo. >> %log_file%

:: Show available options
echo Development Options:
echo 1. Start development server (npm run dev)
echo 2. Run type check (npm run type-check)
echo 3. Run lint check (npm run lint)
echo 4. Format code (npm run format)
echo 5. Clean build (npm run build)
echo 6. Update dependencies (scripts\update-next.bat)
echo 7. Deploy to Vercel (scripts\deploy.bat)
echo 8. Monitor deployment (scripts\monitor.bat)
echo Q. Quit

:: Get option selection
set /p "option=Select option (1-8, or Q to quit): "

:: Process selection
if "!option!"=="1" (
    call :print_colored %BLUE% "Starting development server..."
    call npm run dev >> %log_file% 2>&1
) else if "!option!"=="2" (
    call :print_colored %BLUE% "Running type check..."
    call npm run type-check >> %log_file% 2>&1
) else if "!option!"=="3" (
    call :print_colored %BLUE% "Running lint check..."
    call npm run lint >> %log_file% 2>&1
) else if "!option!"=="4" (
    call :print_colored %BLUE% "Formatting code..."
    call npm run format >> %log_file% 2>&1
) else if "!option!"=="5" (
    call :print_colored %BLUE% "Running clean build..."
    if exist ".next" rmdir /s /q .next
    call npm run build >> %log_file% 2>&1
) else if "!option!"=="6" (
    call :print_colored %BLUE% "Updating dependencies..."
    call scripts\update-next.bat >> %log_file% 2>&1
) else if "!option!"=="7" (
    call :print_colored %BLUE% "Deploying to Vercel..."
    call scripts\deploy.bat >> %log_file% 2>&1
) else if "!option!"=="8" (
    call :print_colored %BLUE% "Monitoring deployment..."
    call scripts\monitor.bat >> %log_file% 2>&1
) else if /i "!option!"=="Q" (
    goto :end
) else (
    call :print_colored %RED% "Invalid option selected"
    goto :error
)

if !errorlevel! neq 0 (
    call :print_colored %RED% "Command failed"
    goto :error
)

:: Ask if user wants to perform another action
echo.
set /p "another=Perform another action? (Y/N) "
if /i "!another!"=="Y" (
    cls
    call scripts\dev.bat
)

goto :end

:error
echo Error occurred at: %date% %time% >> %log_file%
call :print_colored %RED% "Development task failed. Check log for details."
type %log_file%
exit /b 1

:print_colored
echo [%~1m%~2[0m
exit /b

:end
endlocal
