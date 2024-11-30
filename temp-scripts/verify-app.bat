@echo off
setlocal enabledelayedexpansion

:: Define color codes
set "RED=31"
set "GREEN=32"
set "YELLOW=33"
set "BLUE=34"

:: Function to print colored text
call :print_colored %BLUE% "DRQ Website App Verification"
echo.

:: Create verification log
set "log_file=verification-logs\app-%date:~-4,4%%date:~-10,2%%date:~-7,2%.txt"
if not exist "verification-logs" mkdir verification-logs

echo DRQ Website App Verification Log > %log_file%
echo ============================= >> %log_file%
echo Started: %date% %time% >> %log_file%
echo. >> %log_file%

:: 1. Check required directories
call :print_colored %BLUE% "1. Checking directory structure..."
echo Directory Structure: >> %log_file%

set "directories=src/app src/components src/styles src/lib src/types src/config"
for %%d in (%directories%) do (
    if exist "%%d" (
        echo Found directory: %%d >> %log_file%
    ) else (
        call :print_colored %RED% "Missing directory: %%d"
        echo Missing directory: %%d >> %log_file%
        set "verification_failed=1"
    )
)

:: 2. Check required files
call :print_colored %BLUE% "2. Checking required files..."
echo Required Files: >> %log_file%

set "files=src/app/layout.tsx src/app/page.tsx src/styles/globals.css src/middleware.ts tsconfig.json package.json postcss.config.js tailwind.config.js"
for %%f in (%files%) do (
    if exist "%%f" (
        echo Found file: %%f >> %log_file%
    ) else (
        call :print_colored %RED% "Missing file: %%f"
        echo Missing file: %%f >> %log_file%
        set "verification_failed=1"
    )
)

:: 3. Check locale structure
call :print_colored %BLUE% "3. Checking locale structure..."
echo Locale Structure: >> %log_file%

set "locale_files=src/app/[locale]/layout.tsx src/app/[locale]/page.tsx src/app/[locale]/loading.tsx src/app/[locale]/error.tsx src/app/[locale]/not-found.tsx"
for %%f in (%locale_files%) do (
    if exist "%%f" (
        echo Found locale file: %%f >> %log_file%
    ) else (
        call :print_colored %RED% "Missing locale file: %%f"
        echo Missing locale file: %%f >> %log_file%
        set "verification_failed=1"
    )
)

:: 4. Check services structure
call :print_colored %BLUE% "4. Checking services structure..."
echo Services Structure: >> %log_file%

set "service_files=src/app/[locale]/services/layout.tsx src/app/[locale]/services/page.tsx src/app/[locale]/services/water-damage/layout.tsx src/app/[locale]/services/water-damage/page.tsx src/app/[locale]/services/water-damage/commercial/page.tsx"
for %%f in (%service_files%) do (
    if exist "%%f" (
        echo Found service file: %%f >> %log_file%
    ) else (
        call :print_colored %RED% "Missing service file: %%f"
        echo Missing service file: %%f >> %log_file%
        set "verification_failed=1"
    )
)

:: 5. Check component files
call :print_colored %BLUE% "5. Checking component files..."
echo Component Files: >> %log_file%

set "component_files=src/components/ui/card.tsx src/components/ui/skeleton.tsx src/components/Header/index.tsx src/components/Hero/index.tsx"
for %%f in (%component_files%) do (
    if exist "%%f" (
        echo Found component: %%f >> %log_file%
    ) else (
        call :print_colored %RED% "Missing component: %%f"
        echo Missing component: %%f >> %log_file%
        set "verification_failed=1"
    )
)

:: 6. Check configuration files
call :print_colored %BLUE% "6. Checking configuration files..."
echo Configuration Files: >> %log_file%

set "config_files=src/config/business.ts src/types/business.ts src/lib/utils.ts"
for %%f in (%config_files%) do (
    if exist "%%f" (
        echo Found config file: %%f >> %log_file%
    ) else (
        call :print_colored %RED% "Missing config file: %%f"
        echo Missing config file: %%f >> %log_file%
        set "verification_failed=1"
    )
)

:: 7. Verify imports
call :print_colored %BLUE% "7. Verifying TypeScript..."
echo TypeScript Verification: >> %log_file%

call npm run type-check >> %log_file% 2>&1
if !errorlevel! neq 0 (
    call :print_colored %RED% "TypeScript verification failed"
    set "verification_failed=1"
)

:: Final status
if defined verification_failed (
    call :print_colored %RED% "App verification failed. Check log for details."
    echo.
    echo Action Items:
    echo 1. Create missing directories
    echo 2. Add missing files
    echo 3. Fix TypeScript errors
    echo 4. Run verification again
    
    exit /b 1
) else (
    call :print_colored %GREEN% "App verification completed successfully!"
    echo.
    echo App Structure:
    echo - Directories: Complete
    echo - Files: Present
    echo - TypeScript: Valid
    echo - Components: Ready
    
    echo.
    echo Next Steps:
    echo 1. Start development server: scripts\dev.bat
    echo 2. Open browser: http://localhost:3000
    echo 3. Check all routes
)

goto :end

:error
echo Error occurred at: %date% %time% >> %log_file%
call :print_colored %RED% "App verification failed. Check log for details."
exit /b 1

:print_colored
echo [%~1m%~2[0m
exit /b

:end
endlocal
