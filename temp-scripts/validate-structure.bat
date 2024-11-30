@echo off
setlocal enabledelayedexpansion

:: Define color codes
set "RED=31"
set "GREEN=32"
set "YELLOW=33"
set "BLUE=34"

:: Function to print colored text
call :print_colored %BLUE% "Project Structure Validation"
echo.

:: Create validation log
set "log_file=validation-logs\structure-%date:~-4,4%%date:~-10,2%%date:~-7,2%.txt"
if not exist "validation-logs" mkdir validation-logs

echo Project Structure Validation Log > %log_file%
echo ============================= >> %log_file%
echo Started: %date% %time% >> %log_file%
echo. >> %log_file%

:: 1. Check Required Directories
call :print_colored %BLUE% "1. Checking required directories..."
echo Directory Structure: >> %log_file%

:: Define required directories and files
set "required_dirs=src/app src/components src/config public"
set "required_files=next.config.js package.json tsconfig.json"

:: Check directories
for %%d in (%required_dirs%) do (
    if not exist "%%d" (
        call :print_colored %RED% "Missing directory: %%d"
        echo Missing directory: %%d >> %log_file%
        set "validation_failed=1"
    ) else (
        echo Found directory: %%d >> %log_file%
    )
)

:: Check files
for %%f in (%required_files%) do (
    if not exist "%%f" (
        call :print_colored %RED% "Missing file: %%f"
        echo Missing file: %%f >> %log_file%
        set "validation_failed=1"
    ) else (
        echo Found file: %%f >> %log_file%
    )
)

:: 2. Validate Page Routes
call :print_colored %BLUE% "2. Validating page routes..."
echo Page Routes: >> %log_file%

:: Define required pages
set "required_pages=page layout loading error not-found"
set "required_routes=services contact about"

:: Check app directory pages
for %%p in (%required_pages%) do (
    if not exist "src/app/[locale]/%%p.tsx" (
        call :print_colored %RED% "Missing page: src/app/[locale]/%%p.tsx"
        echo Missing page: src/app/[locale]/%%p.tsx >> %log_file%
        set "validation_failed=1"
    ) else (
        echo Found page: src/app/[locale]/%%p.tsx >> %log_file%
    )
)

:: Check route pages
for %%r in (%required_routes%) do (
    if not exist "src/app/[locale]/%%r" (
        call :print_colored %RED% "Missing route: src/app/[locale]/%%r"
        echo Missing route: src/app/[locale]/%%r >> %log_file%
        set "validation_failed=1"
    ) else (
        echo Found route: src/app/[locale]/%%r >> %log_file%
    )
)

:: 3. Check Build Output
call :print_colored %BLUE% "3. Checking build output..."
echo Build Output: >> %log_file%

:: Run build
call npm run build >> %log_file% 2>&1
if !errorlevel! neq 0 (
    call :print_colored %RED% "Build failed"
    echo Build failed >> %log_file%
    set "validation_failed=1"
) else (
    if not exist ".next" (
        call :print_colored %RED% "Build directory (.next) not found"
        echo Build directory (.next) not found >> %log_file%
        set "validation_failed=1"
    ) else (
        echo Build successful, .next directory exists >> %log_file%
    )
)

:: 4. Validate Dynamic Routes
call :print_colored %BLUE% "4. Validating dynamic routes..."
echo Dynamic Routes: >> %log_file%

:: Check service routes
if not exist "src/app/[locale]/services/[service]" (
    call :print_colored %RED% "Missing dynamic service route"
    echo Missing dynamic service route >> %log_file%
    set "validation_failed=1"
) else (
    echo Found dynamic service route >> %log_file%
)

:: 5. Check Static Assets
call :print_colored %BLUE% "5. Checking static assets..."
echo Static Assets: >> %log_file%

:: Define required assets
set "required_assets=images/hero/water-damage-team.jpg favicon.ico"

for %%a in (%required_assets%) do (
    if not exist "public/%%a" (
        call :print_colored %RED% "Missing asset: public/%%a"
        echo Missing asset: public/%%a >> %log_file%
        set "validation_failed=1"
    ) else (
        echo Found asset: public/%%a >> %log_file%
    )
)

:: Final Status
echo. >> %log_file%
echo Validation completed at: %date% %time% >> %log_file%

if defined validation_failed (
    call :print_colored %RED% "Validation failed. Check log for details."
    echo Validation Status: FAILED >> %log_file%
    exit /b 1
) else (
    call :print_colored %GREEN% "Validation successful!"
    echo Validation Status: PASSED >> %log_file%
)

echo.
echo Next Steps:
echo 1. Review validation log: %log_file%
echo 2. Fix any missing files or directories
echo 3. Run scripts\deploy-vercel.bat for deployment

goto :end

:print_colored
echo [%~1m%~2[0m
exit /b

:end
endlocal
