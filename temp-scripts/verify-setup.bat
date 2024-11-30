@echo off
setlocal enabledelayedexpansion

:: Define color codes
set "RED=31"
set "GREEN=32"
set "YELLOW=33"
set "BLUE=34"

:: Function to print colored text
call :print_colored %BLUE% "DRQ Website Setup Verification"
echo.

:: Create log file
set "log_file=verification-logs\setup-%date:~-4,4%%date:~-10,2%%date:~-7,2%.txt"
if not exist "verification-logs" mkdir verification-logs

echo DRQ Website Setup Verification Log > %log_file%
echo =============================== >> %log_file%
echo Started: %date% %time% >> %log_file%
echo. >> %log_file%

:: 1. Check Node.js and npm
call :print_colored %BLUE% "1. Checking Node.js installation..."
echo Node.js Check: >> %log_file%

node --version >> %log_file% 2>&1
if !errorlevel! neq 0 (
    call :print_colored %RED% "Node.js not found"
    echo Node.js installation required >> %log_file%
    goto :error
)

npm --version >> %log_file% 2>&1
if !errorlevel! neq 0 (
    call :print_colored %RED% "npm not found"
    echo npm installation required >> %log_file%
    goto :error
)

:: 2. Check required files
call :print_colored %BLUE% "2. Checking required files..."
echo Required Files: >> %log_file%

set "required_files=package.json tsconfig.json next.config.js postcss.config.js tailwind.config.js"
for %%f in (%required_files%) do (
    if exist "%%f" (
        echo Found %%f >> %log_file%
    ) else (
        call :print_colored %RED% "Missing required file: %%f"
        echo Missing file: %%f >> %log_file%
        set "verification_failed=1"
    )
)

:: 3. Check dependencies
call :print_colored %BLUE% "3. Checking dependencies..."
echo Dependencies: >> %log_file%

if not exist "node_modules" (
    call :print_colored %YELLOW% "Installing dependencies..."
    call npm install >> %log_file% 2>&1
)

:: 4. Verify Next.js setup
call :print_colored %BLUE% "4. Verifying Next.js setup..."
echo Next.js Setup: >> %log_file%

npx next --version >> %log_file% 2>&1
if !errorlevel! neq 0 (
    call :print_colored %RED% "Next.js not properly installed"
    goto :error
)

:: 5. Check TypeScript
call :print_colored %BLUE% "5. Checking TypeScript..."
echo TypeScript Check: >> %log_file%

npx tsc --version >> %log_file% 2>&1
if !errorlevel! neq 0 (
    call :print_colored %RED% "TypeScript not properly installed"
    goto :error
)

:: 6. Run type check
call :print_colored %BLUE% "6. Running type check..."
echo Type Check: >> %log_file%

npx tsc --noEmit >> %log_file% 2>&1
if !errorlevel! neq 0 (
    call :print_colored %YELLOW% "Type check found issues"
    echo Type check issues found >> %log_file%
    type %log_file%
)

:: 7. Test build
call :print_colored %BLUE% "7. Testing build..."
echo Build Test: >> %log_file%

npm run build >> %log_file% 2>&1
if !errorlevel! neq 0 (
    call :print_colored %RED% "Build failed"
    echo Build failed >> %log_file%
    type %log_file%
    goto :error
)

:: Final status
if defined verification_failed (
    call :print_colored %YELLOW% "Setup verification completed with warnings"
    echo.
    echo Action Items:
    echo 1. Add missing files
    echo 2. Fix type errors
    echo 3. Run verification again
    
    exit /b 1
) else (
    call :print_colored %GREEN% "Setup verification completed successfully!"
    echo.
    echo Setup Status:
    echo - Node.js: Installed
    echo - Dependencies: Complete
    echo - TypeScript: Configured
    echo - Build: Passing
    
    echo.
    echo Next Steps:
    echo 1. Start development server: scripts\dev.bat
    echo 2. Open browser: http://localhost:3000
    echo 3. Begin development
)

goto :end

:error
echo Error occurred at: %date% %time% >> %log_file%
call :print_colored %RED% "Setup verification failed. Check log for details."
type %log_file%
exit /b 1

:print_colored
echo [%~1m%~2[0m
exit /b

:end
endlocal
