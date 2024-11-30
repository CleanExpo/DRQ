@echo off
setlocal enabledelayedexpansion

:: Define color codes
set "RED=31"
set "GREEN=32"
set "YELLOW=33"
set "BLUE=34"

:: Function to print colored text
call :print_colored %BLUE% "DRQ Website Project Initialization"
echo.

:: Create log file
set "log_file=init-logs\init-%date:~-4,4%%date:~-10,2%%date:~-7,2%.txt"
if not exist "init-logs" mkdir init-logs

echo DRQ Website Initialization Log > %log_file%
echo =========================== >> %log_file%
echo Started: %date% %time% >> %log_file%
echo. >> %log_file%

:: 1. Clean existing files
call :print_colored %BLUE% "1. Cleaning existing files..."
echo Cleaning Files: >> %log_file%

:: Save scripts directory
mkdir temp-scripts 2>nul
xcopy /s /q scripts\*.* temp-scripts\ >nul 2>&1

:: Clean everything except temp-scripts
for /d %%d in (*) do if not "%%d"=="temp-scripts" rmdir /s /q "%%d"
for %%f in (*) do del "%%f"

:: 2. Initialize new Next.js project
call :print_colored %BLUE% "2. Initializing Next.js project..."
echo Next.js Initialization: >> %log_file%

call npx create-next-app@latest . --typescript --tailwind --eslint --app --src-dir --import-alias "@/*" --no-git --use-npm >> %log_file% 2>&1
if !errorlevel! neq 0 (
    call :print_colored %RED% "Failed to initialize Next.js project"
    goto :error
)

:: 3. Restore scripts
call :print_colored %BLUE% "3. Restoring scripts..."
echo Restoring Scripts: >> %log_file%

mkdir scripts 2>nul
xcopy /s /q temp-scripts\*.* scripts\ >nul 2>&1
rmdir /s /q temp-scripts

:: 4. Install additional dependencies
call :print_colored %BLUE% "4. Installing additional dependencies..."
echo Additional Dependencies: >> %log_file%

call npm install --save class-variance-authority clsx tailwind-merge >> %log_file% 2>&1
if !errorlevel! neq 0 (
    call :print_colored %RED% "Failed to install additional dependencies"
    goto :error
)

:: 5. Run fixes
call :print_colored %BLUE% "5. Running fixes..."
echo Running Fixes: >> %log_file%

call scripts\fix-all.bat >> %log_file% 2>&1
if !errorlevel! neq 0 (
    call :print_colored %RED% "Failed to run fixes"
    goto :error
)

:: Final status
call :print_colored %GREEN% "Project initialization completed!"
echo.
echo Next Steps:
echo 1. Start development server: scripts\dev.bat
echo 2. Open browser: http://localhost:3000
echo 3. Begin development

goto :end

:error
echo Error occurred at: %date% %time% >> %log_file%
call :print_colored %RED% "Project initialization failed. Check log for details."
type %log_file%
exit /b 1

:print_colored
echo [%~1m%~2[0m
exit /b

:end
endlocal
