@echo off
setlocal enabledelayedexpansion

:: Define color codes
set "RED=31"
set "GREEN=32"
set "YELLOW=33"
set "BLUE=34"

:: Function to print colored text
call :print_colored %BLUE% "DRQ Website Deployment Diagnosis"
echo.

:: Create log file
set "log_file=diagnosis-logs\diagnosis-%date:~-4,4%%date:~-10,2%%date:~-7,2%.txt"
if not exist "diagnosis-logs" mkdir diagnosis-logs

echo DRQ Website Diagnosis Log > %log_file%
echo ======================== >> %log_file%
echo Started: %date% %time% >> %log_file%
echo. >> %log_file%

:: 1. Check Vercel CLI installation
call :print_colored %BLUE% "1. Checking Vercel CLI..."
echo Vercel CLI Check: >> %log_file%

where vercel >nul 2>&1
if !errorlevel! neq 0 (
    call :print_colored %RED% "Vercel CLI not found"
    echo Installing Vercel CLI...
    call npm install -g vercel >> %log_file% 2>&1
    if !errorlevel! neq 0 (
        call :print_colored %RED% "Failed to install Vercel CLI"
        echo Action needed: Run 'npm install -g vercel' manually
        set "diagnosis_failed=1"
    )
)

:: 2. Check Vercel login status
call :print_colored %BLUE% "2. Checking Vercel login status..."
echo Login Status: >> %log_file%

vercel whoami >> %log_file% 2>&1
if !errorlevel! neq 0 (
    call :print_colored %RED% "Not logged in to Vercel"
    echo Action needed: Run 'vercel login'
    set "diagnosis_failed=1"
)

:: 3. Check project linking
call :print_colored %BLUE% "3. Checking project linking..."
echo Project Link: >> %log_file%

if not exist ".vercel" (
    call :print_colored %RED% "Project not linked to Vercel"
    echo Action needed: Run 'vercel link'
    set "diagnosis_failed=1"
) else (
    type .vercel\project.json >> %log_file% 2>&1
)

:: 4. Check build configuration
call :print_colored %BLUE% "4. Checking build configuration..."
echo Build Config: >> %log_file%

if not exist "next.config.js" (
    call :print_colored %RED% "Missing next.config.js"
    echo Action needed: Create next.config.js
    set "diagnosis_failed=1"
)

:: 5. Check dependencies
call :print_colored %BLUE% "5. Checking dependencies..."
echo Dependencies: >> %log_file%

call npm ls next react react-dom >> %log_file% 2>&1
if !errorlevel! neq 0 (
    call :print_colored %RED% "Missing core dependencies"
    echo Action needed: Run 'npm install'
    set "diagnosis_failed=1"
)

:: 6. Check build process
call :print_colored %BLUE% "6. Testing build process..."
echo Build Test: >> %log_file%

call npm run build >> %log_file% 2>&1
if !errorlevel! neq 0 (
    call :print_colored %RED% "Build process failed"
    echo Action needed: Fix build errors
    set "diagnosis_failed=1"
)

:: 7. Check deployment status
call :print_colored %BLUE% "7. Checking deployment status..."
echo Deployment Status: >> %log_file%

vercel ls >> %log_file% 2>&1
if !errorlevel! neq 0 (
    call :print_colored %RED% "Cannot fetch deployment status"
    echo Action needed: Check Vercel configuration
    set "diagnosis_failed=1"
)

:: Final diagnosis
if defined diagnosis_failed (
    call :print_colored %RED% "Deployment issues found!"
    echo.
    echo Required Actions:
    echo 1. Install Vercel CLI: npm install -g vercel
    echo 2. Login to Vercel: vercel login
    echo 3. Link project: vercel link
    echo 4. Fix build errors if any
    echo 5. Try deployment: vercel --prod
    
    exit /b 1
) else (
    call :print_colored %GREEN% "No deployment issues found!"
    echo.
    echo Deployment Steps:
    echo 1. Run: vercel
    echo 2. Confirm deployment settings
    echo 3. Wait for deployment to complete
    echo 4. Check deployment URL
)

goto :end

:error
echo Error occurred at: %date% %time% >> %log_file%
call :print_colored %RED% "Diagnosis failed. Check log for details."
type %log_file%
exit /b 1

:print_colored
echo [%~1m%~2[0m
exit /b

:end
endlocal
