@echo off
setlocal enabledelayedexpansion

:: Define color codes
set "RED=31"
set "GREEN=32"
set "YELLOW=33"
set "BLUE=34"

:: Function to print colored text
call :print_colored %BLUE% "DRQ Website Project Setup"
echo.

:: Create setup log
set "log_file=setup-logs\setup-%date:~-4,4%%date:~-10,2%%date:~-7,2%.txt"
if not exist "setup-logs" mkdir setup-logs

echo DRQ Website Setup Log > %log_file%
echo ==================== >> %log_file%
echo Started: %date% %time% >> %log_file%
echo. >> %log_file%

:: 1. Clean up old type definition files
call :print_colored %BLUE% "1. Cleaning up old type definitions..."
echo Cleaning up type definitions: >> %log_file%
del /q src\types\*.d.ts 2>nul
if !errorlevel! equ 0 (
    echo Successfully removed old type definitions >> %log_file%
) else (
    echo No type definition files to remove >> %log_file%
)

:: 2. Install dependencies
call :print_colored %BLUE% "2. Installing dependencies..."
echo Installing dependencies: >> %log_file%
call npm install >> %log_file% 2>&1
if !errorlevel! neq 0 (
    call :print_colored %RED% "Failed to install dependencies"
    goto :error
)

:: 3. Install dev dependencies
call :print_colored %BLUE% "3. Installing dev dependencies..."
echo Installing dev dependencies: >> %log_file%
call npm install -D @types/node @types/react @types/react-dom @types/jest @testing-library/jest-dom @testing-library/react @playwright/test typescript >> %log_file% 2>&1
if !errorlevel! neq 0 (
    call :print_colored %RED% "Failed to install dev dependencies"
    goto :error
)

:: 4. Set up Husky
call :print_colored %BLUE% "4. Setting up Husky..."
echo Setting up Husky: >> %log_file%
call npx husky install >> %log_file% 2>&1
if !errorlevel! neq 0 (
    call :print_colored %RED% "Failed to set up Husky"
    goto :error
)

:: 5. Initialize Playwright
call :print_colored %BLUE% "5. Initializing Playwright..."
echo Initializing Playwright: >> %log_file%
call npx playwright install >> %log_file% 2>&1
if !errorlevel! neq 0 (
    call :print_colored %RED% "Failed to initialize Playwright"
    goto :error
)

:: 6. Type check
call :print_colored %BLUE% "6. Running type check..."
echo Running type check: >> %log_file%
call npm run type-check >> %log_file% 2>&1
if !errorlevel! neq 0 (
    call :print_colored %YELLOW% "Type check found issues - see log for details"
) else (
    call :print_colored %GREEN% "Type check passed"
)

:: 7. Run tests
call :print_colored %BLUE% "7. Running tests..."
echo Running tests: >> %log_file%
call npm test >> %log_file% 2>&1
if !errorlevel! neq 0 (
    call :print_colored %YELLOW% "Some tests failed - see log for details"
) else (
    call :print_colored %GREEN% "All tests passed"
)

:: Success
call :print_colored %GREEN% "Setup completed successfully!"
echo.
echo Next steps:
echo 1. Review the setup log: %log_file%
echo 2. Start the development server: npm run dev
echo 3. Run the validation script: scripts\validate-structure.bat

goto :end

:error
echo. >> %log_file%
echo Setup failed at: %date% %time% >> %log_file%
call :print_colored %RED% "Setup failed. Check logs for details."
exit /b 1

:print_colored
echo [%~1m%~2[0m
exit /b

:end
endlocal
