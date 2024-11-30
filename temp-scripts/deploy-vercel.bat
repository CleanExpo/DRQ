@echo off
setlocal enabledelayedexpansion

:: Define color codes
set "RED=31"
set "GREEN=32"
set "YELLOW=33"
set "BLUE=34"

:: Function to print colored text
call :print_colored %BLUE% "Vercel Deployment Process"
echo.

:: Create deployment log
set "log_file=deployment-logs\vercel-deploy-%date:~-4,4%%date:~-10,2%%date:~-7,2%_%time:~0,2%%time:~3,2%.txt"
if not exist "deployment-logs" mkdir deployment-logs

echo Vercel Deployment Log > %log_file%
echo ==================== >> %log_file%
echo Started: %date% %time% >> %log_file%
echo. >> %log_file%

:: 1. Check Vercel CLI
call :print_colored %BLUE% "1. Checking Vercel CLI..."
vercel --version > nul 2>&1
if !errorlevel! neq 0 (
    call :print_colored %YELLOW% "Installing Vercel CLI..."
    call npm install -g vercel
    if !errorlevel! neq 0 (
        call :print_colored %RED% "Failed to install Vercel CLI"
        goto :error
    )
)

:: 2. Environment Check
call :print_colored %BLUE% "2. Checking environment variables..."
if not defined VERCEL_TOKEN (
    call :print_colored %RED% "VERCEL_TOKEN not set"
    goto :error
)

:: 3. Run Tests
call :print_colored %BLUE% "3. Running tests..."
echo Test Results: >> %log_file%
call npm test >> %log_file% 2>&1
if !errorlevel! neq 0 (
    call :print_colored %RED% "Tests failed"
    goto :error
)

:: 4. Type Check
call :print_colored %BLUE% "4. Running type check..."
echo Type Check Results: >> %log_file%
call npm run type-check >> %log_file% 2>&1
if !errorlevel! neq 0 (
    call :print_colored %RED% "Type check failed"
    goto :error
)

:: 5. Build Project
call :print_colored %BLUE% "5. Building project..."
echo Build Results: >> %log_file%
call npm run build >> %log_file% 2>&1
if !errorlevel! neq 0 (
    call :print_colored %RED% "Build failed"
    goto :error
)

:: 6. Run Local Tests
call :print_colored %BLUE% "6. Testing build locally..."
echo Local Test Results: >> %log_file%
start /b npm start
timeout /t 10 /nobreak > nul
curl -f http://localhost:3000 > nul 2>&1
if !errorlevel! neq 0 (
    call :print_colored %RED% "Local test failed"
    goto :error
)
taskkill /F /IM node.exe > nul 2>&1

:: 7. Deploy to Preview
call :print_colored %BLUE% "7. Deploying to preview environment..."
echo Preview Deployment: >> %log_file%
call vercel --confirm >> %log_file% 2>&1
if !errorlevel! neq 0 (
    call :print_colored %RED% "Preview deployment failed"
    goto :error
)

:: Extract preview URL
for /f "tokens=2 delims=: " %%a in ('findstr /C:"Preview:" %log_file%') do set "PREVIEW_URL=%%a"

:: 8. Run E2E Tests on Preview
call :print_colored %BLUE% "8. Running E2E tests on preview..."
echo E2E Test Results: >> %log_file%
set "PLAYWRIGHT_TEST_BASE_URL=%PREVIEW_URL%"
call npm run test:e2e >> %log_file% 2>&1
if !errorlevel! neq 0 (
    call :print_colored %RED% "E2E tests failed on preview"
    goto :error
)

:: 9. Deploy to Production
call :print_colored %BLUE% "9. Deploying to production..."
echo Production Deployment: >> %log_file%
call vercel --prod --confirm >> %log_file% 2>&1
if !errorlevel! neq 0 (
    call :print_colored %RED% "Production deployment failed"
    goto :error
)

:: 10. Final Validation
call :print_colored %BLUE% "10. Running final validation..."
echo Final Validation: >> %log_file%
call scripts\validate-deployment.bat >> %log_file% 2>&1

:: Success
call :print_colored %GREEN% "Deployment completed successfully!"
echo.
echo Deployment Summary:
echo ------------------
echo 1. All tests passed
echo 2. Build successful
echo 3. Preview deployment verified
echo 4. Production deployment complete
echo.
echo Next Steps:
echo 1. Monitor Vercel dashboard for deployment status
echo 2. Check Sentry for any error reports
echo 3. Review Google Analytics for user activity
echo 4. Run scripts\maintenance.bat for regular checks

goto :end

:error
echo. >> %log_file%
echo Deployment failed at: %date% %time% >> %log_file%
call :print_colored %RED% "Deployment failed. Check logs for details."
exit /b 1

:print_colored
echo [%~1m%~2[0m
exit /b

:end
echo.
echo Deployment log saved to: %log_file%
endlocal
