@echo off
setlocal enabledelayedexpansion

:: Define color codes
set "RED=31"
set "GREEN=32"
set "YELLOW=33"
set "BLUE=34"

:: Function to print colored text
call :print_colored %BLUE% "DRQ Website Node.js Setup"
echo.

:: Create setup log
set "log_file=setup-logs\node-%date:~-4,4%%date:~-10,2%%date:~-7,2%.txt"
if not exist "setup-logs" mkdir setup-logs

echo DRQ Website Node.js Setup Log > %log_file%
echo ========================== >> %log_file%
echo Started: %date% %time% >> %log_file%
echo. >> %log_file%

:: 1. Check if nvm is installed
call :print_colored %BLUE% "1. Checking for Node Version Manager (nvm)..."
echo NVM Check: >> %log_file%
nvm version > nul 2>&1
if !errorlevel! neq 0 (
    call :print_colored %YELLOW% "nvm not found. Installing nvm..."
    echo Installing nvm >> %log_file%
    
    :: Download nvm-windows installer
    curl -o nvm-setup.exe https://github.com/coreybutler/nvm-windows/releases/latest/download/nvm-setup.exe
    
    :: Run installer
    start /wait nvm-setup.exe
    
    :: Clean up
    del nvm-setup.exe
    
    :: Refresh environment
    call refreshenv
)

:: 2. Install Node.js v18
call :print_colored %BLUE% "2. Installing Node.js v18..."
echo Node.js Installation: >> %log_file%
call nvm install 18 >> %log_file% 2>&1
if !errorlevel! neq 0 (
    call :print_colored %RED% "Failed to install Node.js v18"
    goto :error
)

:: 3. Use Node.js v18
call :print_colored %BLUE% "3. Switching to Node.js v18..."
echo Node.js Switch: >> %log_file%
call nvm use 18 >> %log_file% 2>&1
if !errorlevel! neq 0 (
    call :print_colored %RED% "Failed to switch to Node.js v18"
    goto :error
)

:: 4. Verify Node.js version
call :print_colored %BLUE% "4. Verifying Node.js version..."
echo Node.js Version: >> %log_file%
node -v >> %log_file% 2>&1
if !errorlevel! neq 0 (
    call :print_colored %RED% "Failed to verify Node.js version"
    goto :error
)

:: 5. Clean npm cache
call :print_colored %BLUE% "5. Cleaning npm cache..."
echo NPM Cache Clean: >> %log_file%
call npm cache clean --force >> %log_file% 2>&1

:: 6. Remove existing node_modules
call :print_colored %BLUE% "6. Removing existing node_modules..."
echo Remove node_modules: >> %log_file%
if exist "node_modules" (
    rmdir /s /q node_modules
    del package-lock.json 2>nul
)

:: 7. Install dependencies
call :print_colored %BLUE% "7. Installing dependencies..."
echo Installing Dependencies: >> %log_file%
call npm install >> %log_file% 2>&1
if !errorlevel! neq 0 (
    call :print_colored %RED% "Failed to install dependencies"
    goto :error
)

:: Success
call :print_colored %GREEN% "Node.js setup completed successfully!"
echo.
echo Node.js Version: 
node -v
echo npm Version: 
npm -v
echo.
echo Next Steps:
echo 1. Run scripts\verify-local.bat to verify setup
echo 2. Start development with npm run dev
echo 3. Check scripts\validate-staging.bat for staging

goto :end

:error
echo Error occurred at: %date% %time% >> %log_file%
call :print_colored %RED% "Setup failed. Check log for details."
exit /b 1

:print_colored
echo [%~1m%~2[0m
exit /b

:end
endlocal
