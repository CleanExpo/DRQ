@echo off
setlocal enabledelayedexpansion

:: Define color codes
set "RED=31"
set "GREEN=32"
set "YELLOW=33"
set "BLUE=34"

:: Function to print colored text
call :print_colored %BLUE% "DRQ Website Setup"
echo.

:: Create log file
set "log_file=setup-logs\setup-%date:~-4,4%%date:~-10,2%%date:~-7,2%.txt"
if not exist "setup-logs" mkdir setup-logs

echo DRQ Website Setup Log > %log_file%
echo =================== >> %log_file%
echo Started: %date% %time% >> %log_file%
echo. >> %log_file%

:: 1. Initialize project
call :print_colored %BLUE% "1. Initializing project..."
echo Project Initialization: >> %log_file%

call scripts\init-project.bat >> %log_file% 2>&1
if !errorlevel! neq 0 (
    call :print_colored %RED% "Project initialization failed"
    goto :error
)

:: 2. Fix environment
call :print_colored %BLUE% "2. Setting up environment..."
echo Environment Setup: >> %log_file%

call scripts\fix-env.bat >> %log_file% 2>&1
if !errorlevel! neq 0 (
    call :print_colored %RED% "Environment setup failed"
    goto :error
)

:: 3. Fix TypeScript
call :print_colored %BLUE% "3. Configuring TypeScript..."
echo TypeScript Setup: >> %log_file%

call scripts\fix-typescript.bat >> %log_file% 2>&1
if !errorlevel! neq 0 (
    call :print_colored %RED% "TypeScript setup failed"
    goto :error
)

:: 4. Run all fixes
call :print_colored %BLUE% "4. Running fixes..."
echo Running Fixes: >> %log_file%

call scripts\fix-all.bat >> %log_file% 2>&1
if !errorlevel! neq 0 (
    call :print_colored %RED% "Fixes failed"
    goto :error
)

:: 5. Verify setup
call :print_colored %BLUE% "5. Verifying setup..."
echo Setup Verification: >> %log_file%

call scripts\verify-setup.bat >> %log_file% 2>&1
if !errorlevel! neq 0 (
    call :print_colored %YELLOW% "Setup verification found issues"
    echo Setup verification issues found >> %log_file%
)

:: 6. Show any errors
call :print_colored %BLUE% "6. Checking for errors..."
echo Error Check: >> %log_file%

call scripts\show-errors.bat >> %log_file% 2>&1

:: 7. Start development server
call :print_colored %BLUE% "7. Starting development server..."
echo Development Server: >> %log_file%

:: Ask user if they want to start the server
set /p "start_server=Start development server? (Y/N) "
if /i "!start_server!"=="Y" (
    call scripts\dev.bat
) else (
    call :print_colored %YELLOW% "Skipping development server"
)

:: Final status
call :print_colored %GREEN% "Setup completed!"
echo.
echo Next Steps:
echo 1. Review any warnings above
echo 2. Start development server: scripts\dev.bat
echo 3. Open browser: http://localhost:3000
echo 4. Begin development

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
