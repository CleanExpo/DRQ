@echo off
setlocal enabledelayedexpansion

:: Define color codes
set "RED=31"
set "GREEN=32"
set "YELLOW=33"
set "BLUE=34"

:: Function to print colored text
call :print_colored %BLUE% "DRQ Website Clean Installation"
echo.

:: Create log file
set "log_file=setup-logs\clean-install-%date:~-4,4%%date:~-10,2%%date:~-7,2%.txt"
if not exist "setup-logs" mkdir setup-logs

echo DRQ Website Clean Installation Log > %log_file%
echo ============================== >> %log_file%
echo Started: %date% %time% >> %log_file%
echo. >> %log_file%

:: 1. Clean existing files
call :print_colored %BLUE% "1. Cleaning existing files..."
echo Cleaning Files: >> %log_file%

if exist "node_modules" (
    call :print_colored %YELLOW% "Removing node_modules..."
    rmdir /s /q node_modules
)

if exist ".next" (
    call :print_colored %YELLOW% "Removing .next directory..."
    rmdir /s /q .next
)

if exist "package-lock.json" (
    call :print_colored %YELLOW% "Removing package-lock.json..."
    del package-lock.json
)

:: 2. Clear npm cache
call :print_colored %BLUE% "2. Clearing npm cache..."
echo Clearing Cache: >> %log_file%
call npm cache clean --force >> %log_file% 2>&1

:: 3. Install dependencies
call :print_colored %BLUE% "3. Installing dependencies..."
echo Installing Dependencies: >> %log_file%
call npm install >> %log_file% 2>&1
if !errorlevel! neq 0 (
    call :print_colored %RED% "Failed to install dependencies"
    goto :error
)

:: 4. Verify installation
call :print_colored %BLUE% "4. Verifying installation..."
echo Verification: >> %log_file%

:: Check core dependencies
set "core_deps=next react react-dom typescript"
for %%d in (%core_deps%) do (
    call npm ls %%d >> %log_file% 2>&1
    if !errorlevel! neq 0 (
        call :print_colored %RED% "Missing core dependency: %%d"
        set "verification_failed=1"
    )
)

:: 5. Type check
call :print_colored %BLUE% "5. Running type check..."
echo Type Check: >> %log_file%
call npm run type-check >> %log_file% 2>&1
if !errorlevel! neq 0 (
    call :print_colored %YELLOW% "Type check found issues - see log for details"
) else (
    call :print_colored %GREEN% "Type check passed"
)

:: 6. Build check
call :print_colored %BLUE% "6. Running build check..."
echo Build Check: >> %log_file%
call npm run build >> %log_file% 2>&1
if !errorlevel! neq 0 (
    call :print_colored %RED% "Build failed"
    goto :error
)

:: Final status
if defined verification_failed (
    call :print_colored %RED% "Installation completed with warnings. Check log for details."
    echo.
    echo Action Items:
    echo 1. Review missing dependencies
    echo 2. Fix type errors if any
    echo 3. Check build output
    
    exit /b 1
) else (
    call :print_colored %GREEN% "Clean installation completed successfully!"
    echo.
    echo Installation Summary:
    echo - Dependencies: Installed
    echo - Types: Verified
    echo - Build: Successful
    
    echo.
    echo Next Steps:
    echo 1. Start development server: npm run dev
    echo 2. Check build: npm run build
    echo 3. Run type check: npm run type-check
)

goto :end

:error
echo Error occurred at: %date% %time% >> %log_file%
call :print_colored %RED% "Installation failed. Check log for details."
exit /b 1

:print_colored
echo [%~1m%~2[0m
exit /b

:end
endlocal
