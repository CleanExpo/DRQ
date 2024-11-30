@echo off
setlocal EnableDelayedExpansion

:: Colors for Windows console
set "RED=[91m"
set "GREEN=[92m"
set "BLUE=[94m"
set "NC=[0m"

:: Store current branch
for /f "tokens=*" %%a in ('git symbolic-ref --short HEAD') do set "original_branch=%%a"

echo %BLUE%Starting automated build process...%NC%

:: Function to build and test a branch
:build_branch
set "branch=%~1"
set "env=%~2"

echo.
echo %BLUE%Processing %branch% branch for %env% environment...%NC%

:: Switch to branch
git checkout %branch%
if errorlevel 1 (
    echo %RED%Failed to switch to %branch% branch%NC%
    goto :error
)

:: Install dependencies
echo %BLUE%Installing dependencies...%NC%
call npm install
if errorlevel 1 (
    echo %RED%Failed to install dependencies%NC%
    goto :error
)

:: Copy appropriate .env file
if exist .env.%env% (
    copy /y .env.%env% .env.local
    echo %GREEN%Copied .env.%env% to .env.local%NC%
)

:: Build the application
echo %BLUE%Building application...%NC%
call npm run build
if errorlevel 1 (
    echo %RED%Build failed%NC%
    goto :error
)

:: Run tests if they exist
if exist "package.json" (
    findstr /C:"\"test\":" "package.json" >nul
    if not errorlevel 1 (
        echo %BLUE%Running tests...%NC%
        call npm test
        if errorlevel 1 (
            echo %RED%Tests failed%NC%
            goto :error
        )
    )
)

echo %GREEN%Successfully built %branch% branch for %env% environment%NC%
goto :eof

:error
echo %RED%Error occurred during build process%NC%
exit /b 1

:: Main build process
call :build_branch "develop" "development"
if errorlevel 1 goto :cleanup

call :build_branch "main" "production"
if errorlevel 1 goto :cleanup

:: Create feature branches if they don't exist
git checkout develop
git checkout -b feature/ui-enhancements
call :build_branch "feature/ui-enhancements" "development"
if errorlevel 1 goto :cleanup

git checkout develop
git checkout -b feature/backend-data
call :build_branch "feature/backend-data" "development"
if errorlevel 1 goto :cleanup

:cleanup
:: Return to original branch
echo %BLUE%Returning to original branch: %original_branch%%NC%
git checkout %original_branch%

echo.
echo %GREEN%Build process completed!%NC%
endlocal
