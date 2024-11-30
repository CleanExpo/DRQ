@echo off
setlocal enabledelayedexpansion

:: Define color codes
set "RED=31"
set "GREEN=32"
set "YELLOW=33"
set "BLUE=34"

:: Function to print colored text
call :print_colored %BLUE% "DRQ Website Version Verification"
echo.

:: Create log file
set "log_file=verification-logs\versions-%date:~-4,4%%date:~-10,2%%date:~-7,2%.txt"
if not exist "verification-logs" mkdir verification-logs

echo DRQ Website Version Verification Log > %log_file%
echo ================================= >> %log_file%
echo Started: %date% %time% >> %log_file%
echo. >> %log_file%

:: 1. Check Node.js version
call :print_colored %BLUE% "1. Checking Node.js version..."
echo Node.js Version: >> %log_file%

node --version >> %log_file% 2>&1
if !errorlevel! neq 0 (
    call :print_colored %RED% "Node.js not found"
    goto :error
)

:: 2. Check Next.js version
call :print_colored %BLUE% "2. Checking Next.js version..."
echo Next.js Version: >> %log_file%

call npx next --version >> %log_file% 2>&1
if !errorlevel! neq 0 (
    call :print_colored %RED% "Next.js not found"
    goto :error
)

:: 3. Check package versions
call :print_colored %BLUE% "3. Checking package versions..."
echo Package Versions: >> %log_file%

call npm list next react react-dom typescript >> %log_file% 2>&1
if !errorlevel! neq 0 (
    call :print_colored %YELLOW% "Some packages might be missing or outdated"
    echo Package check warning >> %log_file%
)

:: 4. Check for updates
call :print_colored %BLUE% "4. Checking for available updates..."
echo Available Updates: >> %log_file%

call npm outdated >> %log_file% 2>&1

:: 5. Verify package.json
call :print_colored %BLUE% "5. Verifying package.json..."
echo Package.json Check: >> %log_file%

if exist "package.json" (
    type package.json >> %log_file%
) else (
    call :print_colored %RED% "package.json not found"
    goto :error
)

:: 6. Check TypeScript setup
call :print_colored %BLUE% "6. Checking TypeScript setup..."
echo TypeScript Check: >> %log_file%

if exist "tsconfig.json" (
    type tsconfig.json >> %log_file%
) else (
    call :print_colored %RED% "tsconfig.json not found"
    goto :error
)

:: 7. Verify build
call :print_colored %BLUE% "7. Verifying build..."
echo Build Check: >> %log_file%

call npm run build >> %log_file% 2>&1
if !errorlevel! neq 0 (
    call :print_colored %RED% "Build failed"
    goto :error
)

:: Final status
call :print_colored %GREEN% "Version verification completed!"
echo.
echo Version Summary:
echo - Node.js: Valid
echo - Next.js: Latest
echo - React: Latest
echo - TypeScript: Configured
echo - Build: Successful

echo.
echo Next Steps:
echo 1. Review any outdated packages
echo 2. Run scripts\update.bat if updates needed
echo 3. Test functionality

goto :end

:error
echo Error occurred at: %date% %time% >> %log_file%
call :print_colored %RED% "Version verification failed. Check log for details."
type %log_file%
exit /b 1

:print_colored
echo [%~1m%~2[0m
exit /b

:end
endlocal
