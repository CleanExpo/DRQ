@echo off
setlocal

REM List of branches to test
set branches=ui-header-footer ui-homepage ui-service-pages data-service-areas perf-optimization

REM Create or clear the error log file
echo Testing Log - %date% %time% > error-log.txt

for %%b in (%branches%) do (
    echo Testing branch: %%b
    echo.
    
    REM Switch to branch
    git checkout %%b
    
    REM Install dependencies
    echo Installing dependencies...
    call npm install
    if errorlevel 1 (
        echo npm install failed in %%b >> error-log.txt
    )
    
    REM Run tests
    echo Running tests...
    call npm test
    if errorlevel 1 (
        echo Tests failed in %%b >> error-log.txt
    )
    
    REM Build project
    echo Building project...
    call npm run build
    if errorlevel 1 (
        echo Build failed in %%b >> error-log.txt
    )
    
    echo ----------------------------------------
)

REM Switch back to main branch
git checkout main

REM Check if error log has content (excluding header)
findstr /v "Testing Log" error-log.txt > nul
if errorlevel 1 (
    echo All tests and builds completed successfully!
) else (
    echo Errors found during testing. See error-log.txt for details.
    type error-log.txt
)

endlocal
