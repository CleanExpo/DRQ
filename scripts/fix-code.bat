@echo off
setlocal enabledelayedexpansion

:: Define color codes
set "RED=31"
set "GREEN=32"
set "YELLOW=33"
set "BLUE=34"

:: Function to print colored text
call :print_colored %BLUE% "DRQ Website Code Fix"
echo.

:: Create log file
set "log_file=fix-logs\code-%date:~-4,4%%date:~-10,2%%date:~-7,2%.txt"
if not exist "fix-logs" mkdir fix-logs

echo DRQ Website Code Fix Log > %log_file%
echo ==================== >> %log_file%
echo Started: %date% %time% >> %log_file%
echo. >> %log_file%

:: 1. Install dependencies if needed
call :print_colored %BLUE% "1. Checking dependencies..."
echo Dependency Check: >> %log_file%

call npm list prettier eslint typescript >> %log_file% 2>&1
if !errorlevel! neq 0 (
    call :print_colored %YELLOW% "Installing missing dependencies..."
    call npm install --save-dev prettier eslint-config-prettier prettier-plugin-tailwindcss typescript @typescript-eslint/eslint-plugin @typescript-eslint/parser >> %log_file% 2>&1
)

:: 2. Run type check
call :print_colored %BLUE% "2. Running type check..."
echo Type Check: >> %log_file%

call npm run type-check >> %log_file% 2>&1
if !errorlevel! neq 0 (
    call :print_colored %YELLOW% "Type check found issues"
    echo Type check issues found >> %log_file%
)

:: 3. Run ESLint
call :print_colored %BLUE% "3. Running ESLint..."
echo ESLint Check: >> %log_file%

call npm run lint >> %log_file% 2>&1
if !errorlevel! neq 0 (
    call :print_colored %YELLOW% "ESLint found issues"
    echo ESLint issues found >> %log_file%
)

:: 4. Run Prettier
call :print_colored %BLUE% "4. Running Prettier..."
echo Prettier Format: >> %log_file%

call npm run format >> %log_file% 2>&1
if !errorlevel! neq 0 (
    call :print_colored %YELLOW% "Prettier formatting failed"
    echo Prettier formatting failed >> %log_file%
)

:: 5. Verify fixes
call :print_colored %BLUE% "5. Verifying fixes..."
echo Fix Verification: >> %log_file%

:: Run type check again
call npm run type-check >> %log_file% 2>&1
set type_check_status=!errorlevel!

:: Run ESLint again
call npm run lint >> %log_file% 2>&1
set lint_status=!errorlevel!

:: Check if any issues remain
if !type_check_status! neq 0 (
    call :print_colored %RED% "Type check issues remain"
    set "verification_failed=1"
)

if !lint_status! neq 0 (
    call :print_colored %RED% "ESLint issues remain"
    set "verification_failed=1"
)

:: Final status
if defined verification_failed (
    call :print_colored %RED% "Code fix completed with remaining issues"
    echo.
    echo Action Items:
    echo 1. Review type check errors
    echo 2. Fix remaining ESLint issues
    echo 3. Run fix again
    
    exit /b 1
) else (
    call :print_colored %GREEN% "Code fix completed successfully!"
    echo.
    echo Fix Summary:
    echo - Types: Valid
    echo - Lint: Clean
    echo - Format: Applied
    
    echo.
    echo Next Steps:
    echo 1. Review changes
    echo 2. Test functionality
    echo 3. Commit updates
)

goto :end

:error
echo Error occurred at: %date% %time% >> %log_file%
call :print_colored %RED% "Code fix failed. Check log for details."
type %log_file%
exit /b 1

:print_colored
echo [%~1m%~2[0m
exit /b

:end
endlocal
