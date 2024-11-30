@echo off
setlocal enabledelayedexpansion

:: Define color codes
set "RED=31"
set "GREEN=32"
set "YELLOW=33"
set "BLUE=34"

:: Function to print colored text
call :print_colored %BLUE% "DRQ Website Deployment Verification"
echo.

:: Create verification log
set "log_file=verification-logs\verify-%date:~-4,4%%date:~-10,2%%date:~-7,2%.txt"
if not exist "verification-logs" mkdir verification-logs

echo DRQ Website Deployment Verification Log > %log_file%
echo ================================== >> %log_file%
echo Started: %date% %time% >> %log_file%
echo. >> %log_file%

:: 1. Check root page existence
call :print_colored %BLUE% "1. Checking root page configuration..."
echo Root Page Check: >> %log_file%

:: Check app directory structure
if exist "src\app\[locale]\page.tsx" (
    call :print_colored %GREEN% "Found root page: src\app\[locale]\page.tsx"
    echo Found root page: src\app\[locale]\page.tsx >> %log_file%
) else (
    call :print_colored %RED% "Missing root page: src\app\[locale]\page.tsx"
    echo Missing root page: src\app\[locale]\page.tsx >> %log_file%
    set "verification_failed=1"
)

:: 2. Build verification
call :print_colored %BLUE% "2. Running build verification..."
echo Build Verification: >> %log_file%

call npm run build >> %log_file% 2>&1
if !errorlevel! neq 0 (
    call :print_colored %RED% "Build failed"
    echo Build failed >> %log_file%
    set "verification_failed=1"
) else (
    call :print_colored %GREEN% "Build successful"
    echo Build successful >> %log_file%
)

:: 3. Local server test
call :print_colored %BLUE% "3. Testing local server..."
echo Local Server Test: >> %log_file%

:: Start server in background
start /b npm start > nul 2>&1
timeout /t 10 /nobreak > nul

:: Test local server
curl -f http://localhost:3000 > nul 2>&1
if !errorlevel! neq 0 (
    call :print_colored %RED% "Local server test failed"
    echo Local server test failed >> %log_file%
    set "verification_failed=1"
) else (
    call :print_colored %GREEN% "Local server test passed"
    echo Local server test passed >> %log_file%
)

:: Kill the server
taskkill /F /IM node.exe > nul 2>&1

:: 4. Route verification
call :print_colored %BLUE% "4. Verifying routes..."
echo Route Verification: >> %log_file%

:: Define required routes
set "required_routes=services contact about"

:: Check each route
for %%r in (%required_routes%) do (
    if exist "src\app\[locale]\%%r\page.tsx" (
        call :print_colored %GREEN% "Found route: %%r"
        echo Found route: %%r >> %log_file%
    ) else (
        call :print_colored %RED% "Missing route: %%r"
        echo Missing route: %%r >> %log_file%
        set "verification_failed=1"
    )
)

:: 5. Check Vercel configuration
call :print_colored %BLUE% "5. Checking Vercel configuration..."
echo Vercel Configuration: >> %log_file%

:: Check vercel.json
if exist "vercel.json" (
    call :print_colored %GREEN% "Found vercel.json"
    echo Found vercel.json >> %log_file%
) else (
    call :print_colored %YELLOW% "Missing vercel.json - using default configuration"
    echo Missing vercel.json - using default configuration >> %log_file%
)

:: 6. Environment variables check
call :print_colored %BLUE% "6. Checking environment variables..."
echo Environment Variables: >> %log_file%

if exist ".env.local" (
    call :print_colored %GREEN% "Found .env.local"
    echo Found .env.local >> %log_file%
) else (
    call :print_colored %RED% "Missing .env.local"
    echo Missing .env.local >> %log_file%
    set "verification_failed=1"
)

:: Final status
echo. >> %log_file%
echo Verification completed at: %date% %time% >> %log_file%

if defined verification_failed (
    call :print_colored %RED% "Verification failed. Please check the log for details."
    echo Verification Status: FAILED >> %log_file%
    
    echo.
    echo Recommended Actions:
    echo 1. Create missing pages/routes
    echo 2. Fix build errors
    echo 3. Set up environment variables
    echo 4. Run verification again
    
    exit /b 1
) else (
    call :print_colored %GREEN% "Verification passed successfully!"
    echo Verification Status: PASSED >> %log_file%
    
    echo.
    echo Next Steps:
    echo 1. Deploy to Vercel: scripts\deploy-vercel.bat
    echo 2. Monitor deployment logs in Vercel dashboard
    echo 3. Run post-deployment validation
)

goto :end

:print_colored
echo [%~1m%~2[0m
exit /b

:end
endlocal
