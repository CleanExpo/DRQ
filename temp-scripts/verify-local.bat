@echo off
setlocal enabledelayedexpansion

:: Define color codes
set "RED=31"
set "GREEN=32"
set "YELLOW=33"
set "BLUE=34"

:: Function to print colored text
call :print_colored %BLUE% "DRQ Website Local Development Verification"
echo.

:: Create verification log
set "log_file=verification-logs\local-%date:~-4,4%%date:~-10,2%%date:~-7,2%.txt"
if not exist "verification-logs" mkdir verification-logs

echo DRQ Website Local Verification Log > %log_file%
echo =============================== >> %log_file%
echo Started: %date% %time% >> %log_file%
echo. >> %log_file%

:: 1. Check Node.js version
call :print_colored %BLUE% "1. Checking Node.js version..."
echo Node.js Version: >> %log_file%
node -v >> %log_file% 2>&1
if !errorlevel! neq 0 (
    call :print_colored %RED% "Node.js not found. Please install Node.js v18 or later."
    goto :error
)

:: 2. Verify required files
call :print_colored %BLUE% "2. Verifying required files..."
echo Required Files: >> %log_file%

:: Check core files
set "required_files=package.json tsconfig.json next.config.js"
for %%f in (%required_files%) do (
    if exist "%%f" (
        echo Found %%f >> %log_file%
    ) else (
        call :print_colored %RED% "Missing required file: %%f"
        echo Missing: %%f >> %log_file%
        set "verification_failed=1"
    )
)

:: Check core directories
set "required_dirs=src/app src/components src/styles src/types"
for %%d in (%required_dirs%) do (
    if exist "%%d" (
        echo Found directory: %%d >> %log_file%
    ) else (
        call :print_colored %RED% "Missing required directory: %%d"
        echo Missing directory: %%d >> %log_file%
        set "verification_failed=1"
    )
)

:: 3. Check root page
call :print_colored %BLUE% "3. Checking root page..."
echo Root Page Check: >> %log_file%

if exist "src/app/[locale]/page.tsx" (
    echo Found root page: src/app/[locale]/page.tsx >> %log_file%
) else (
    call :print_colored %RED% "Missing root page: src/app/[locale]/page.tsx"
    echo Missing root page >> %log_file%
    set "verification_failed=1"
)

:: 4. Verify dependencies
call :print_colored %BLUE% "4. Verifying dependencies..."
echo Dependency Check: >> %log_file%

:: Check if node_modules exists
if not exist "node_modules" (
    call :print_colored %YELLOW% "node_modules not found. Installing dependencies..."
    echo Installing dependencies >> %log_file%
    call npm install >> %log_file% 2>&1
)

:: 5. Type check
call :print_colored %BLUE% "5. Running type check..."
echo Type Check: >> %log_file%
call npm run type-check >> %log_file% 2>&1
if !errorlevel! neq 0 (
    call :print_colored %RED% "Type check failed"
    echo Type check failed >> %log_file%
    set "verification_failed=1"
)

:: 6. Build check
call :print_colored %BLUE% "6. Running build check..."
echo Build Check: >> %log_file%
call npm run build >> %log_file% 2>&1
if !errorlevel! neq 0 (
    call :print_colored %RED% "Build failed"
    echo Build failed >> %log_file%
    set "verification_failed=1"
)

:: 7. Start development server
call :print_colored %BLUE% "7. Starting development server..."
echo Development Server: >> %log_file%

:: Start server in background
start /b npm run dev > temp-server.log 2>&1
timeout /t 10 /nobreak > nul

:: Check if server is running
curl -f http://localhost:3000 > nul 2>&1
if !errorlevel! neq 0 (
    call :print_colored %RED% "Development server failed to start"
    echo Development server failed >> %log_file%
    type temp-server.log >> %log_file%
    set "verification_failed=1"
) else (
    call :print_colored %GREEN% "Development server running at http://localhost:3000"
    echo Development server running >> %log_file%
)

:: Clean up
del temp-server.log 2>nul

:: Final status
if defined verification_failed (
    call :print_colored %RED% "Local verification failed. Please check the log for details."
    echo.
    echo Recommended Actions:
    echo 1. Install Node.js v18 if not installed
    echo 2. Run 'npm install' to update dependencies
    echo 3. Fix any type errors or build issues
    echo 4. Ensure all required files are present
    echo.
    echo For detailed error information, check: %log_file%
) else (
    call :print_colored %GREEN% "Local verification passed successfully!"
    echo.
    echo Next Steps:
    echo 1. Visit http://localhost:3000 to view the site
    echo 2. Make your changes
    echo 3. Run scripts\commit-changes.bat to commit
)

goto :end

:error
echo Error occurred at: %date% %time% >> %log_file%
exit /b 1

:print_colored
echo [%~1m%~2[0m
exit /b

:end
endlocal
