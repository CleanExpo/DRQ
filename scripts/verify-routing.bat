@echo off
setlocal enabledelayedexpansion

:: Define color codes
set "RED=31"
set "GREEN=32"
set "YELLOW=33"
set "BLUE=34"

:: Function to print colored text
call :print_colored %BLUE% "DRQ Website Routing Verification"
echo.

:: Create log file
set "log_file=verification-logs\routing-%date:~-4,4%%date:~-10,2%%date:~-7,2%.txt"
if not exist "verification-logs" mkdir verification-logs

echo DRQ Website Routing Verification Log > %log_file%
echo ================================= >> %log_file%
echo Started: %date% %time% >> %log_file%
echo. >> %log_file%

:: 1. Check required files
call :print_colored %BLUE% "1. Checking required files..."
echo Required Files: >> %log_file%

set "required_files=src/app/page.tsx src/app/layout.tsx src/app/[locale]/page.tsx src/middleware.ts src/styles/globals.css"
for %%f in (%required_files%) do (
    if exist "%%f" (
        echo Found file: %%f >> %log_file%
    ) else (
        call :print_colored %RED% "Missing required file: %%f"
        echo Missing file: %%f >> %log_file%
        set "verification_failed=1"
    )
)

:: 2. Check file contents
call :print_colored %BLUE% "2. Checking file contents..."
echo File Contents: >> %log_file%

:: Check root page redirect
findstr /C:"redirect('/en-AU')" src\app\page.tsx >nul
if !errorlevel! neq 0 (
    call :print_colored %RED% "Root page missing redirect"
    echo Root page missing redirect >> %log_file%
    set "verification_failed=1"
)

:: Check middleware locale handling
findstr /C:"const locales = ['en-AU']" src\middleware.ts >nul
if !errorlevel! neq 0 (
    call :print_colored %RED% "Middleware missing locale configuration"
    echo Middleware missing locale configuration >> %log_file%
    set "verification_failed=1"
)

:: 3. Build project
call :print_colored %BLUE% "3. Building project..."
echo Build Process: >> %log_file%

call npm run build >> %log_file% 2>&1
if !errorlevel! neq 0 (
    call :print_colored %RED% "Build failed"
    goto :error
)

:: 4. Start server and test routes
call :print_colored %BLUE% "4. Testing routes..."
echo Route Testing: >> %log_file%

:: Start server in background
start /b npm run dev > temp-server.log
timeout /t 10 /nobreak > nul

:: Test routes
curl -f http://localhost:3000 -o nul 2>>%log_file%
if !errorlevel! neq 0 (
    call :print_colored %RED% "Root route not working"
    echo Root route failed >> %log_file%
    set "verification_failed=1"
)

curl -f http://localhost:3000/en-AU -o nul 2>>%log_file%
if !errorlevel! neq 0 (
    call :print_colored %RED% "Locale route not working"
    echo Locale route failed >> %log_file%
    set "verification_failed=1"
)

:: Clean up
taskkill /F /IM node.exe >nul 2>&1
del temp-server.log 2>nul

:: Final status
if defined verification_failed (
    call :print_colored %RED% "Routing verification failed. Check log for details."
    echo.
    echo Action Items:
    echo 1. Add missing files
    echo 2. Fix file contents
    echo 3. Check route handling
    echo 4. Run verification again
    
    exit /b 1
) else (
    call :print_colored %GREEN% "Routing verification completed successfully!"
    echo.
    echo Routing Status:
    echo - Files: Present
    echo - Contents: Valid
    echo - Build: Successful
    echo - Routes: Working
    
    echo.
    echo Next Steps:
    echo 1. Start development server: scripts\dev.bat
    echo 2. Open browser: http://localhost:3000
    echo 3. Test navigation
)

goto :end

:error
echo Error occurred at: %date% %time% >> %log_file%
call :print_colored %RED% "Routing verification failed. Check log for details."
type %log_file%
exit /b 1

:print_colored
echo [%~1m%~2[0m
exit /b

:end
endlocal
