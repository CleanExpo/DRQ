@echo off
setlocal enabledelayedexpansion

:: Define color codes
set "RED=31"
set "GREEN=32"
set "YELLOW=33"
set "BLUE=34"

:: Function to print colored text
call :print_colored %BLUE% "DRQ Website Commit Changes"
echo.

:: Create commit log
set "log_file=commit-logs\commit-%date:~-4,4%%date:~-10,2%%date:~-7,2%.txt"
if not exist "commit-logs" mkdir commit-logs

echo DRQ Website Commit Log > %log_file%
echo ==================== >> %log_file%
echo Started: %date% %time% >> %log_file%
echo. >> %log_file%

:: 1. Run type check
call :print_colored %BLUE% "1. Running type check..."
echo Type Check: >> %log_file%
call npm run type-check >> %log_file% 2>&1
if !errorlevel! neq 0 (
    call :print_colored %RED% "Type check failed. Please fix type errors before committing."
    goto :error
)

:: 2. Run tests
call :print_colored %BLUE% "2. Running tests..."
echo Test Results: >> %log_file%
call npm test >> %log_file% 2>&1
if !errorlevel! neq 0 (
    call :print_colored %RED% "Tests failed. Please fix failing tests before committing."
    goto :error
)

:: 3. Run build
call :print_colored %BLUE% "3. Running build..."
echo Build Results: >> %log_file%
call npm run build >> %log_file% 2>&1
if !errorlevel! neq 0 (
    call :print_colored %RED% "Build failed. Please fix build errors before committing."
    goto :error
)

:: 4. Check current branch
call :print_colored %BLUE% "4. Checking current branch..."
echo Branch Check: >> %log_file%
for /f "tokens=*" %%a in ('git rev-parse --abbrev-ref HEAD') do set "current_branch=%%a"
echo Current branch: !current_branch! >> %log_file%

:: 5. Stage changes
call :print_colored %BLUE% "5. Staging changes..."
echo Staging Changes: >> %log_file%
git add . >> %log_file% 2>&1

:: 6. Get commit message
if "%~1"=="" (
    set /p commit_message="Enter commit message: "
) else (
    set "commit_message=%~1"
)

:: 7. Commit changes
call :print_colored %BLUE% "6. Committing changes..."
echo Commit: >> %log_file%
git commit -m "!commit_message!" >> %log_file% 2>&1
if !errorlevel! neq 0 (
    call :print_colored %RED% "Failed to commit changes."
    goto :error
)

:: 8. Push changes
call :print_colored %BLUE% "7. Pushing changes..."
echo Push: >> %log_file%
git push origin !current_branch! >> %log_file% 2>&1
if !errorlevel! neq 0 (
    call :print_colored %RED% "Failed to push changes."
    goto :error
)

:: Success
call :print_colored %GREEN% "Changes committed and pushed successfully!"
echo.
echo Commit Details:
echo - Branch: !current_branch!
echo - Message: !commit_message!
echo - Log: %log_file%

goto :end

:error
echo. >> %log_file%
echo Error occurred at: %date% %time% >> %log_file%
call :print_colored %RED% "Failed to commit changes. Check log for details."
exit /b 1

:print_colored
echo [%~1m%~2[0m
exit /b

:end
:: Display next steps
echo.
echo Next Steps:
echo 1. Monitor deployment in Vercel dashboard
echo 2. Run scripts\verify-deployment.bat to validate
echo 3. Check scripts\validate-staging.bat for staging environment

endlocal
