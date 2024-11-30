@echo off
setlocal enabledelayedexpansion

:: Define color codes
set "RED=31"
set "GREEN=32"
set "YELLOW=33"
set "BLUE=34"

:: Function to print colored text
call :print_colored %BLUE% "DRQ Website Update"
echo.

:: Create log file
set "log_file=update-logs\update-%date:~-4,4%%date:~-10,2%%date:~-7,2%.txt"
if not exist "update-logs" mkdir update-logs

echo DRQ Website Update Log > %log_file%
echo =================== >> %log_file%
echo Started: %date% %time% >> %log_file%
echo. >> %log_file%

:: 1. Clean cache
call :print_colored %BLUE% "1. Cleaning cache..."
echo Cleaning Cache: >> %log_file%

if exist ".next" rmdir /s /q .next
if exist "node_modules/.cache" rmdir /s /q node_modules\.cache

:: 2. Update Next.js and React
call :print_colored %BLUE% "2. Updating Next.js and React..."
echo Updating Core Dependencies: >> %log_file%

call npm install next@latest react@latest react-dom@latest >> %log_file% 2>&1
if !errorlevel! neq 0 (
    call :print_colored %RED% "Failed to update core dependencies"
    goto :error
)

:: 3. Update dev dependencies
call :print_colored %BLUE% "3. Updating dev dependencies..."
echo Updating Dev Dependencies: >> %log_file%

call npm install -D @types/node@latest @types/react@latest @types/react-dom@latest typescript@latest eslint@latest eslint-config-next@latest >> %log_file% 2>&1
if !errorlevel! neq 0 (
    call :print_colored %RED% "Failed to update dev dependencies"
    goto :error
)

:: 4. Update other dependencies
call :print_colored %BLUE% "4. Updating other dependencies..."
echo Updating Other Dependencies: >> %log_file%

call npm install class-variance-authority@latest clsx@latest tailwind-merge@latest >> %log_file% 2>&1
if !errorlevel! neq 0 (
    call :print_colored %RED% "Failed to update other dependencies"
    goto :error
)

:: 5. Clean install
call :print_colored %BLUE% "5. Running clean install..."
echo Clean Install: >> %log_file%

call npm ci >> %log_file% 2>&1
if !errorlevel! neq 0 (
    call :print_colored %YELLOW% "Clean install failed, trying regular install..."
    call npm install >> %log_file% 2>&1
    if !errorlevel! neq 0 (
        call :print_colored %RED% "Failed to install dependencies"
        goto :error
    )
)

:: 6. Build project
call :print_colored %BLUE% "6. Building project..."
echo Build Process: >> %log_file%

call npm run build >> %log_file% 2>&1
if !errorlevel! neq 0 (
    call :print_colored %RED% "Build failed"
    goto :error
)

:: 7. Run type check
call :print_colored %BLUE% "7. Running type check..."
echo Type Check: >> %log_file%

call npm run type-check >> %log_file% 2>&1
if !errorlevel! neq 0 (
    call :print_colored %RED% "Type check failed"
    goto :error
)

:: Final status
call :print_colored %GREEN% "Update completed successfully!"
echo.
echo Update Summary:
echo - Next.js: Updated to latest
echo - React: Updated to latest
echo - Dependencies: Updated
echo - Build: Successful
echo - Types: Valid

echo.
echo Next Steps:
echo 1. Start development server: scripts\dev.bat
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
