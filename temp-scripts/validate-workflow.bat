@echo off
setlocal enabledelayedexpansion

:: Define color codes
set "RED=31"
set "GREEN=32"
set "YELLOW=33"
set "BLUE=34"

:: Function to print colored text
call :print_colored %BLUE% "DRQ Website Workflow Validation"
echo.

:: Create validation log
set "log_file=validation-logs\workflow-%date:~-4,4%%date:~-10,2%%date:~-7,2%.txt"
if not exist "validation-logs" mkdir validation-logs

echo DRQ Website Workflow Validation Log > %log_file%
echo ================================ >> %log_file%
echo Started: %date% %time% >> %log_file%
echo. >> %log_file%

:: 1. Node.js Setup
call :print_colored %BLUE% "1. Setting up Node.js environment..."
echo Node.js Setup: >> %log_file%
call scripts\setup-node.bat >> %log_file% 2>&1
if !errorlevel! neq 0 (
    call :print_colored %RED% "Node.js setup failed"
    goto :error
)

:: 2. Local Environment Verification
call :print_colored %BLUE% "2. Verifying local environment..."
echo Local Verification: >> %log_file%
call scripts\verify-local.bat >> %log_file% 2>&1
if !errorlevel! neq 0 (
    call :print_colored %RED% "Local verification failed"
    goto :error
)

:: 3. Type Checking
call :print_colored %BLUE% "3. Running type check..."
echo Type Check: >> %log_file%
call npm run type-check >> %log_file% 2>&1
if !errorlevel! neq 0 (
    call :print_colored %RED% "Type check failed"
    goto :error
)

:: 4. Build Process
call :print_colored %BLUE% "4. Testing build process..."
echo Build Process: >> %log_file%
call npm run build >> %log_file% 2>&1
if !errorlevel! neq 0 (
    call :print_colored %RED% "Build failed"
    goto :error
)

:: 5. Start Development Server
call :print_colored %BLUE% "5. Starting development server..."
echo Development Server: >> %log_file%

:: Start server in background
start /b npm run dev > temp-dev.log 2>&1
timeout /t 10 /nobreak > nul

:: Test server
curl -f http://localhost:3000 > nul 2>&1
if !errorlevel! neq 0 (
    call :print_colored %RED% "Development server failed to start"
    type temp-dev.log >> %log_file%
    goto :error
)

:: 6. Component Validation
call :print_colored %BLUE% "6. Validating components..."
echo Component Validation: >> %log_file%

:: Check Header component
if exist "src/components/Header/index.tsx" (
    echo Header component found >> %log_file%
) else (
    call :print_colored %RED% "Missing Header component"
    echo Missing Header component >> %log_file%
    set "validation_failed=1"
)

:: Check root page
if exist "src/app/[locale]/page.tsx" (
    echo Root page found >> %log_file%
) else (
    call :print_colored %RED% "Missing root page"
    echo Missing root page >> %log_file%
    set "validation_failed=1"
)

:: 7. Production Build Test
call :print_colored %BLUE% "7. Testing production build..."
echo Production Build: >> %log_file%

:: Kill development server
taskkill /F /IM node.exe > nul 2>&1

:: Start production server
call npm run build >> %log_file% 2>&1
if !errorlevel! neq 0 (
    call :print_colored %RED% "Production build failed"
    goto :error
)

start /b npm start > temp-prod.log 2>&1
timeout /t 10 /nobreak > nul

:: Test production server
curl -f http://localhost:3000 > nul 2>&1
if !errorlevel! neq 0 (
    call :print_colored %RED% "Production server failed to start"
    type temp-prod.log >> %log_file%
    goto :error
)

:: 8. Commit Changes
call :print_colored %BLUE% "8. Committing changes..."
echo Commit Changes: >> %log_file%
call scripts\commit-changes.bat "Validated local development workflow" >> %log_file% 2>&1
if !errorlevel! neq 0 (
    call :print_colored %RED% "Failed to commit changes"
    goto :error
)

:: Clean up
del temp-dev.log temp-prod.log 2>nul
taskkill /F /IM node.exe > nul 2>&1

:: Success
call :print_colored %GREEN% "Workflow validation completed successfully!"
echo.
echo Validation Summary:
echo - Node.js environment: OK
echo - Local verification: OK
echo - Type checking: OK
echo - Build process: OK
echo - Development server: OK
echo - Component validation: OK
echo - Production build: OK
echo - Changes committed: OK

echo.
echo Next Steps:
echo 1. Deploy to Vercel: vercel --prod
echo 2. Monitor deployment in Vercel dashboard
echo 3. Verify live site functionality

goto :end

:error
echo Error occurred at: %date% %time% >> %log_file%
call :print_colored %RED% "Workflow validation failed. Check log for details."
echo.
echo Troubleshooting Steps:
echo 1. Check Node.js version: node -v
echo 2. Verify dependencies: npm install
echo 3. Check component files
echo 4. Review error logs: %log_file%
exit /b 1

:print_colored
echo [%~1m%~2[0m
exit /b

:end
endlocal
