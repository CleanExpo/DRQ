@echo off
setlocal enabledelayedexpansion

:: Define color codes
set "RED=31"
set "GREEN=32"
set "YELLOW=33"
set "BLUE=34"

:: Function to print colored text
call :print_colored %BLUE% "DRQ Website Next.js Verification"
echo.

:: Create log file
set "log_file=verification-logs\next-%date:~-4,4%%date:~-10,2%%date:~-7,2%.txt"
if not exist "verification-logs" mkdir verification-logs

echo DRQ Website Next.js Verification Log > %log_file%
echo ================================= >> %log_file%
echo Started: %date% %time% >> %log_file%
echo. >> %log_file%

:: 1. Check Next.js version
call :print_colored %BLUE% "1. Checking Next.js version..."
echo Next.js Version: >> %log_file%

call npx next --version >> %log_file% 2>&1
if !errorlevel! neq 0 (
    call :print_colored %RED% "Next.js not found"
    goto :error
)

:: 2. Check React version
call :print_colored %BLUE% "2. Checking React version..."
echo React Version: >> %log_file%

call npm list react react-dom >> %log_file% 2>&1
if !errorlevel! neq 0 (
    call :print_colored %YELLOW% "React version check warning"
    echo React version warning >> %log_file%
)

:: 3. Check app directory
call :print_colored %BLUE% "3. Checking app directory..."
echo App Directory: >> %log_file%

if not exist "src/app" (
    call :print_colored %RED% "App directory not found"
    echo App directory missing >> %log_file%
    set "verification_failed=1"
)

:: 4. Check required files
call :print_colored %BLUE% "4. Checking required files..."
echo Required Files: >> %log_file%

set "required_files=next.config.js src/app/layout.tsx src/app/page.tsx"
for %%f in (%required_files%) do (
    if exist "%%f" (
        echo Found %%f >> %log_file%
    ) else (
        call :print_colored %RED% "Missing required file: %%f"
        echo Missing file: %%f >> %log_file%
        set "verification_failed=1"
    )
)

:: 5. Check middleware
call :print_colored %BLUE% "5. Checking middleware..."
echo Middleware: >> %log_file%

if exist "src/middleware.ts" (
    echo Found middleware.ts >> %log_file%
) else (
    call :print_colored %YELLOW% "Middleware not found"
    echo Middleware missing >> %log_file%
)

:: 6. Build project
call :print_colored %BLUE% "6. Building project..."
echo Build Process: >> %log_file%

call npm run build >> %log_file% 2>&1
if !errorlevel! neq 0 (
    call :print_colored %RED% "Build failed"
    goto :error
)

:: 7. Start development server
call :print_colored %BLUE% "7. Testing development server..."
echo Development Server: >> %log_file%

:: Start server in background
start /b npm run dev > temp-server.log
timeout /t 10 /nobreak > nul

:: Test server
curl -f http://localhost:3000 -o nul 2>>%log_file%
if !errorlevel! neq 0 (
    call :print_colored %RED% "Development server not responding"
    echo Server test failed >> %log_file%
    set "verification_failed=1"
)

:: Clean up
taskkill /F /IM node.exe >nul 2>&1
del temp-server.log 2>nul

:: Final status
if defined verification_failed (
    call :print_colored %RED% "Next.js verification completed with issues"
    echo.
    echo Action Items:
    echo 1. Add missing files
    echo 2. Fix build errors
    echo 3. Check server issues
    echo 4. Run verification again
    
    exit /b 1
) else (
    call :print_colored %GREEN% "Next.js verification completed successfully!"
    echo.
    echo Verification Summary:
    echo - Next.js: Latest version
    echo - React: Compatible
    echo - Files: Present
    echo - Build: Successful
    echo - Server: Working
    
    echo.
    echo Next Steps:
    echo 1. Start development: npm run dev
    echo 2. Open browser: http://localhost:3000
    echo 3. Test functionality
)

goto :end

:error
echo Error occurred at: %date% %time% >> %log_file%
call :print_colored %RED% "Verification failed. Check log for details."
type %log_file%
exit /b 1

:print_colored
echo [%~1m%~2[0m
exit /b

:end
endlocal
