@echo off
setlocal enabledelayedexpansion

:: Define color codes
set "RED=31"
set "GREEN=32"
set "YELLOW=33"
set "BLUE=34"

:: Function to print colored text
call :print_colored %BLUE% "DRQ Website Cleanup"
echo.

:: Create cleanup log
set "log_file=cleanup-logs\cleanup-%date:~-4,4%%date:~-10,2%%date:~-7,2%.txt"
if not exist "cleanup-logs" mkdir cleanup-logs

echo DRQ Website Cleanup Log > %log_file%
echo ==================== >> %log_file%
echo Started: %date% %time% >> %log_file%
echo. >> %log_file%

:: 1. Remove test configurations
call :print_colored %BLUE% "1. Removing test configurations..."
echo Test Configurations: >> %log_file%

set "test_files=playwright.config.ts jest.config.js jest.setup.js"
for %%f in (%test_files%) do (
    if exist "%%f" (
        del "%%f"
        echo Removed %%f >> %log_file%
    )
)

:: 2. Clean build artifacts
call :print_colored %BLUE% "2. Cleaning build artifacts..."
echo Build Artifacts: >> %log_file%

if exist ".next" (
    rmdir /s /q .next
    echo Removed .next directory >> %log_file%
)

if exist "out" (
    rmdir /s /q out
    echo Removed out directory >> %log_file%
)

:: 3. Remove cache directories
call :print_colored %BLUE% "3. Removing cache directories..."
echo Cache Directories: >> %log_file%

if exist ".cache" (
    rmdir /s /q .cache
    echo Removed .cache directory >> %log_file%
)

if exist ".eslintcache" (
    del .eslintcache
    echo Removed .eslintcache >> %log_file%
)

:: 4. Clean node_modules
call :print_colored %BLUE% "4. Cleaning node_modules..."
echo Node Modules: >> %log_file%

if exist "node_modules" (
    rmdir /s /q node_modules
    echo Removed node_modules directory >> %log_file%
)

:: 5. Remove lock files
call :print_colored %BLUE% "5. Removing lock files..."
echo Lock Files: >> %log_file%

if exist "package-lock.json" (
    del package-lock.json
    echo Removed package-lock.json >> %log_file%
)

if exist "yarn.lock" (
    del yarn.lock
    echo Removed yarn.lock >> %log_file%
)

:: 6. Clean test directories
call :print_colored %BLUE% "6. Cleaning test directories..."
echo Test Directories: >> %log_file%

if exist "e2e" (
    rmdir /s /q e2e
    echo Removed e2e directory >> %log_file%
)

if exist "coverage" (
    rmdir /s /q coverage
    echo Removed coverage directory >> %log_file%
)

:: 7. Remove temporary files
call :print_colored %BLUE% "7. Removing temporary files..."
echo Temporary Files: >> %log_file%

del /s /q *.log 2>nul
del /s /q *.tmp 2>nul
echo Removed temporary files >> %log_file%

:: 8. Reinstall dependencies
call :print_colored %BLUE% "8. Reinstalling dependencies..."
echo Dependencies: >> %log_file%

call npm install >> %log_file% 2>&1
if !errorlevel! neq 0 (
    call :print_colored %RED% "Failed to reinstall dependencies"
    goto :error
)

:: Final status
call :print_colored %GREEN% "Cleanup completed successfully!"
echo.
echo Cleanup Summary:
echo - Test configurations: Removed
echo - Build artifacts: Cleaned
echo - Cache: Cleared
echo - Dependencies: Reinstalled

echo.
echo Next Steps:
echo 1. Run npm run dev to start development
echo 2. Check build with npm run build
echo 3. Verify types with npm run type-check

goto :end

:error
echo Error occurred at: %date% %time% >> %log_file%
call :print_colored %RED% "Cleanup failed. Check log for details."
exit /b 1

:print_colored
echo [%~1m%~2[0m
exit /b

:end
endlocal
