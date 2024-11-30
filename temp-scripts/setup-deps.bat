@echo off
setlocal enabledelayedexpansion

:: Define color codes
set "RED=31"
set "GREEN=32"
set "YELLOW=33"
set "BLUE=34"

:: Function to print colored text
call :print_colored %BLUE% "DRQ Website Dependencies Setup"
echo.

:: Create setup log
set "log_file=setup-logs\deps-%date:~-4,4%%date:~-10,2%%date:~-7,2%.txt"
if not exist "setup-logs" mkdir setup-logs

echo DRQ Website Dependencies Setup Log > %log_file%
echo ============================== >> %log_file%
echo Started: %date% %time% >> %log_file%
echo. >> %log_file%

:: 1. Clean install
call :print_colored %BLUE% "1. Cleaning previous installations..."
echo Cleaning Installation: >> %log_file%

if exist "node_modules" (
    rmdir /s /q node_modules
    del package-lock.json 2>nul
)

:: 2. Install dependencies
call :print_colored %BLUE% "2. Installing dependencies..."
echo Installing Dependencies: >> %log_file%
call npm install >> %log_file% 2>&1
if !errorlevel! neq 0 (
    call :print_colored %RED% "Failed to install dependencies"
    goto :error
)

:: 3. Verify TypeScript
call :print_colored %BLUE% "3. Verifying TypeScript setup..."
echo TypeScript Verification: >> %log_file%
call npx tsc --version >> %log_file% 2>&1
if !errorlevel! neq 0 (
    call :print_colored %RED% "TypeScript verification failed"
    goto :error
)

:: 4. Type check
call :print_colored %BLUE% "4. Running type check..."
echo Type Check: >> %log_file%
call npm run type-check >> %log_file% 2>&1
if !errorlevel! neq 0 (
    call :print_colored %YELLOW% "Type check found issues - see log for details"
) else (
    call :print_colored %GREEN% "Type check passed"
)

:: 5. Verify Next.js
call :print_colored %BLUE% "5. Verifying Next.js setup..."
echo Next.js Verification: >> %log_file%
call npx next --version >> %log_file% 2>&1
if !errorlevel! neq 0 (
    call :print_colored %RED% "Next.js verification failed"
    goto :error
)

:: 6. Verify UI Dependencies
call :print_colored %BLUE% "6. Verifying UI dependencies..."
echo UI Dependencies: >> %log_file%

set "ui_deps=clsx tailwind-merge class-variance-authority"
for %%d in (%ui_deps%) do (
    call npm ls %%d >> %log_file% 2>&1
    if !errorlevel! neq 0 (
        call :print_colored %RED% "Missing UI dependency: %%d"
        set "verification_failed=1"
    )
)

:: 7. Build check
call :print_colored %BLUE% "7. Running build check..."
echo Build Check: >> %log_file%
call npm run build >> %log_file% 2>&1
if !errorlevel! neq 0 (
    call :print_colored %RED% "Build failed"
    goto :error
)

:: Final status
if defined verification_failed (
    call :print_colored %RED% "Setup completed with warnings. Check log for details."
    echo.
    echo Action Items:
    echo 1. Review missing dependencies
    echo 2. Fix type errors if any
    echo 3. Check build output
    
    exit /b 1
) else (
    call :print_colored %GREEN% "Dependencies setup completed successfully!"
    echo.
    echo Setup Summary:
    echo - Dependencies: Installed
    echo - TypeScript: Verified
    echo - Next.js: Configured
    echo - UI Components: Ready
    
    echo.
    echo Next Steps:
    echo 1. Start development server: npm run dev
    echo 2. Run tests: npm test
    echo 3. Check build: npm run build
)

goto :end

:error
echo Error occurred at: %date% %time% >> %log_file%
call :print_colored %RED% "Setup failed. Check log for details."
exit /b 1

:print_colored
echo [%~1m%~2[0m
exit /b

:end
endlocal
