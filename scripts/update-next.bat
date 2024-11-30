@echo off
setlocal enabledelayedexpansion

:: Define color codes
set "RED=31"
set "GREEN=32"
set "YELLOW=33"
set "BLUE=34"

:: Function to print colored text
call :print_colored %BLUE% "DRQ Website Next.js Update"
echo.

:: Create log file
set "log_file=update-logs\next-%date:~-4,4%%date:~-10,2%%date:~-7,2%.txt"
if not exist "update-logs" mkdir update-logs

echo DRQ Website Next.js Update Log > %log_file%
echo =========================== >> %log_file%
echo Started: %date% %time% >> %log_file%
echo. >> %log_file%

:: 1. Clean cache
call :print_colored %BLUE% "1. Cleaning cache..."
echo Cleaning Cache: >> %log_file%

if exist ".next" rmdir /s /q .next
if exist "node_modules/.cache" rmdir /s /q node_modules\.cache

:: 2. Update Next.js to latest stable
call :print_colored %BLUE% "2. Updating Next.js..."
echo Updating Next.js: >> %log_file%

call npm install next@latest react@latest react-dom@latest --legacy-peer-deps >> %log_file% 2>&1
if !errorlevel! neq 0 (
    call :print_colored %RED% "Failed to update Next.js"
    goto :error
)

:: 3. Update related dependencies
call :print_colored %BLUE% "3. Updating related dependencies..."
echo Updating Dependencies: >> %log_file%

call npm install eslint-config-next@latest --legacy-peer-deps >> %log_file% 2>&1
if !errorlevel! neq 0 (
    call :print_colored %YELLOW% "Warning: Failed to update ESLint config"
    echo ESLint config update failed >> %log_file%
)

:: 4. Clean install
call :print_colored %BLUE% "4. Running clean install..."
echo Clean Install: >> %log_file%

call npm install --legacy-peer-deps >> %log_file% 2>&1
if !errorlevel! neq 0 (
    call :print_colored %RED% "Failed to install dependencies"
    goto :error
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
call :print_colored %GREEN% "Next.js update completed successfully!"
echo.
echo Update Summary:
echo - Next.js: Latest stable version
echo - React: Latest compatible version
echo - Dependencies: Updated
echo - Build: Successful

echo.
echo Next Steps:
echo 1. Start development server: npm run dev
echo 2. Test functionality
echo 3. Check for breaking changes

goto :end

:error
echo Error occurred at: %date% %time% >> %log_file%
call :print_colored %RED% "Update failed. Check log for details."
type %log_file%
exit /b 1

:print_colored
echo [%~1m%~2[0m
exit /b

:end
endlocal
