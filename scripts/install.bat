@echo off
setlocal enabledelayedexpansion

:: Define color codes
set "RED=31"
set "GREEN=32"
set "YELLOW=33"
set "BLUE=34"

:: Function to print colored text
call :print_colored %BLUE% "DRQ Website Installation"
echo.

:: Create log file
set "log_file=install-logs\install-%date:~-4,4%%date:~-10,2%%date:~-7,2%.txt"
if not exist "install-logs" mkdir install-logs

echo DRQ Website Installation Log > %log_file%
echo ========================= >> %log_file%
echo Started: %date% %time% >> %log_file%
echo. >> %log_file%

:: 1. Clean existing files
call :print_colored %BLUE% "1. Cleaning existing files..."
echo Cleaning Files: >> %log_file%

if exist "node_modules" rmdir /s /q node_modules
if exist "package-lock.json" del package-lock.json
if exist ".next" rmdir /s /q .next

:: 2. Install dependencies with legacy peer deps
call :print_colored %BLUE% "2. Installing dependencies..."
echo Installing Dependencies: >> %log_file%

call npm install --legacy-peer-deps >> %log_file% 2>&1
if !errorlevel! neq 0 (
    call :print_colored %RED% "Failed to install dependencies"
    goto :error
)

:: 3. Verify installation
call :print_colored %BLUE% "3. Verifying installation..."
echo Verifying Installation: >> %log_file%

:: Check core dependencies
call npm list next react react-dom >> %log_file% 2>&1
if !errorlevel! neq 0 (
    call :print_colored %YELLOW% "Core dependency check warning"
    echo Core dependency warning >> %log_file%
)

:: Check dev dependencies
call npm list typescript eslint prettier >> %log_file% 2>&1
if !errorlevel! neq 0 (
    call :print_colored %YELLOW% "Dev dependency check warning"
    echo Dev dependency warning >> %log_file%
)

:: 4. Run type check
call :print_colored %BLUE% "4. Running type check..."
echo Type Check: >> %log_file%

call npm run type-check >> %log_file% 2>&1
if !errorlevel! neq 0 (
    call :print_colored %YELLOW% "Type check found issues"
    echo Type check issues found >> %log_file%
)

:: 5. Build project
call :print_colored %BLUE% "5. Building project..."
echo Build Process: >> %log_file%

call npm run build >> %log_file% 2>&1
if !errorlevel! neq 0 (
    call :print_colored %RED% "Build failed"
    goto :error
)

:: Final status
call :print_colored %GREEN% "Installation completed successfully!"
echo.
echo Installation Summary:
echo - Dependencies: Installed
echo - Types: Checked
echo - Build: Successful

echo.
echo Next Steps:
echo 1. Start development server: npm run dev
echo 2. Open browser: http://localhost:3000
echo 3. Begin development

goto :end

:error
echo Error occurred at: %date% %time% >> %log_file%
call :print_colored %RED% "Installation failed. Check log for details."
type %log_file%
exit /b 1

:print_colored
echo [%~1m%~2[0m
exit /b

:end
endlocal
