@echo off
setlocal enabledelayedexpansion

:: Define color codes
set "RED=31"
set "GREEN=32"
set "YELLOW=33"
set "BLUE=34"

:: Function to print colored text
call :print_colored %BLUE% "DRQ Website Complete Fix"
echo.

:: Create log file
set "log_file=fix-logs\fix-%date:~-4,4%%date:~-10,2%%date:~-7,2%.txt"
if not exist "fix-logs" mkdir fix-logs

echo DRQ Website Fix Log > %log_file%
echo ================== >> %log_file%
echo Started: %date% %time% >> %log_file%
echo. >> %log_file%

:: 1. Kill any running processes
call :print_colored %BLUE% "1. Cleaning up processes..."
echo Process Cleanup: >> %log_file%

taskkill /F /IM node.exe >nul 2>&1
if !errorlevel! equ 0 (
    echo Terminated Node.js processes >> %log_file%
) else (
    echo No Node.js processes found >> %log_file%
)

:: 2. Clean environment
call :print_colored %BLUE% "2. Cleaning environment..."
echo Environment Cleanup: >> %log_file%

if exist ".next" rmdir /s /q .next
if exist "node_modules" rmdir /s /q node_modules
if exist "package-lock.json" del package-lock.json
if exist ".env.local" del .env.local
if exist ".env.development" del .env.development
if exist ".env.production" del .env.production

:: 3. Initialize package.json if it doesn't exist
call :print_colored %BLUE% "3. Initializing package.json..."
echo Package Initialization: >> %log_file%

if not exist "package.json" (
    echo {> package.json
    echo   "name": "drq-website",>> package.json
    echo   "version": "0.1.0",>> package.json
    echo   "private": true,>> package.json
    echo   "scripts": {>> package.json
    echo     "dev": "next dev",>> package.json
    echo     "build": "next build",>> package.json
    echo     "start": "next start",>> package.json
    echo     "lint": "next lint",>> package.json
    echo     "type-check": "tsc --noEmit">> package.json
    echo   }>> package.json
    echo }>> package.json
)

:: 4. Fix environment
call :print_colored %BLUE% "4. Fixing environment..."
echo Environment Fix: >> %log_file%

call scripts\fix-env.bat >> %log_file% 2>&1
if !errorlevel! neq 0 (
    call :print_colored %RED% "Environment fix failed"
    goto :error
)

:: 5. Install core dependencies
call :print_colored %BLUE% "5. Installing core dependencies..."
echo Core Dependencies: >> %log_file%

call npm install --save next react react-dom >> %log_file% 2>&1
if !errorlevel! neq 0 (
    call :print_colored %RED% "Core dependency installation failed"
    goto :error
)

:: 6. Fix TypeScript
call :print_colored %BLUE% "6. Fixing TypeScript..."
echo TypeScript Fix: >> %log_file%

call scripts\fix-typescript.bat >> %log_file% 2>&1
if !errorlevel! neq 0 (
    call :print_colored %RED% "TypeScript fix failed"
    goto :error
)

:: 7. Install remaining dependencies
call :print_colored %BLUE% "7. Installing remaining dependencies..."
echo Remaining Dependencies: >> %log_file%

call npm install >> %log_file% 2>&1
if !errorlevel! neq 0 (
    call :print_colored %RED% "Dependency installation failed"
    goto :error
)

:: 8. Verify app
call :print_colored %BLUE% "8. Verifying app..."
echo App Verification: >> %log_file%

call scripts\verify-app.bat >> %log_file% 2>&1
if !errorlevel! neq 0 (
    call :print_colored %YELLOW% "App verification found issues - see log for details"
) else (
    call :print_colored %GREEN% "App verification passed"
)

:: 9. Show any remaining errors
call :print_colored %BLUE% "9. Checking for errors..."
echo Error Check: >> %log_file%

call scripts\show-errors.bat >> %log_file% 2>&1

:: Final status
call :print_colored %GREEN% "Fix process completed!"
echo.
echo Next Steps:
echo 1. Review any warnings or errors above
echo 2. Start development server: scripts\dev.bat
echo 3. Open browser: http://localhost:3000

goto :end

:error
echo Error occurred at: %date% %time% >> %log_file%
call :print_colored %RED% "Fix process failed. Check log for details."
type %log_file%
exit /b 1

:print_colored
echo [%~1m%~2[0m
exit /b

:end
endlocal
