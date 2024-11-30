@echo off
setlocal enabledelayedexpansion

:: Define color codes
set "RED=31"
set "GREEN=32"
set "YELLOW=33"
set "BLUE=34"

:: Function to print colored text
call :print_colored %BLUE% "DRQ Website Styles Verification"
echo.

:: Create verification log
set "log_file=verification-logs\styles-%date:~-4,4%%date:~-10,2%%date:~-7,2%.txt"
if not exist "verification-logs" mkdir verification-logs

echo DRQ Website Styles Verification Log > %log_file%
echo ================================ >> %log_file%
echo Started: %date% %time% >> %log_file%
echo. >> %log_file%

:: 1. Check required files
call :print_colored %BLUE% "1. Checking required files..."
echo Required Files: >> %log_file%

set "style_files=tailwind.config.js postcss.config.js src/styles/globals.css"
for %%f in (%style_files%) do (
    if exist "%%f" (
        echo Found %%f >> %log_file%
    ) else (
        call :print_colored %RED% "Missing required file: %%f"
        echo Missing file: %%f >> %log_file%
        set "verification_failed=1"
    )
)

:: 2. Verify Tailwind dependencies
call :print_colored %BLUE% "2. Verifying Tailwind dependencies..."
echo Tailwind Dependencies: >> %log_file%

set "tw_deps=tailwindcss @tailwindcss/forms @tailwindcss/typography autoprefixer postcss"
for %%d in (%tw_deps%) do (
    call npm ls %%d >> %log_file% 2>&1
    if !errorlevel! neq 0 (
        call :print_colored %RED% "Missing Tailwind dependency: %%d"
        echo Missing dependency: %%d >> %log_file%
        set "verification_failed=1"
    )
)

:: 3. Check Tailwind config
call :print_colored %BLUE% "3. Checking Tailwind configuration..."
echo Tailwind Configuration: >> %log_file%

node -e "require('./tailwind.config.js')" >> %log_file% 2>&1
if !errorlevel! neq 0 (
    call :print_colored %RED% "Invalid Tailwind configuration"
    goto :error
)

:: 4. Check PostCSS config
call :print_colored %BLUE% "4. Checking PostCSS configuration..."
echo PostCSS Configuration: >> %log_file%

node -e "require('./postcss.config.js')" >> %log_file% 2>&1
if !errorlevel! neq 0 (
    call :print_colored %RED% "Invalid PostCSS configuration"
    goto :error
)

:: 5. Build CSS
call :print_colored %BLUE% "5. Building CSS..."
echo CSS Build: >> %log_file%

:: Create temporary build script
echo module.exports = { > temp-build.js
echo   plugins: [ >> temp-build.js
echo     require('tailwindcss'), >> temp-build.js
echo     require('autoprefixer'), >> temp-build.js
echo   ] >> temp-build.js
echo } >> temp-build.js

npx postcss src/styles/globals.css -o temp.css --config temp-build.js >> %log_file% 2>&1
if !errorlevel! neq 0 (
    call :print_colored %RED% "CSS build failed"
    del temp-build.js temp.css 2>nul
    goto :error
)

:: Clean up
del temp-build.js temp.css 2>nul

:: Final status
if defined verification_failed (
    call :print_colored %RED% "Style verification failed. Check log for details."
    echo.
    echo Action Items:
    echo 1. Install missing dependencies
    echo 2. Fix configuration files
    echo 3. Check CSS build process
    
    exit /b 1
) else (
    call :print_colored %GREEN% "Style verification completed successfully!"
    echo.
    echo Style Summary:
    echo - Files: Present
    echo - Dependencies: Installed
    echo - Configuration: Valid
    echo - Build: Successful
    
    echo.
    echo Next Steps:
    echo 1. Start development server: npm run dev
    echo 2. Check styles in browser
    echo 3. Run build: npm run build
)

goto :end

:error
echo Error occurred at: %date% %time% >> %log_file%
call :print_colored %RED% "Style verification failed. Check log for details."
exit /b 1

:print_colored
echo [%~1m%~2[0m
exit /b

:end
endlocal
