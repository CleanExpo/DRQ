@echo off
setlocal enabledelayedexpansion

:: Create error log file
echo. > error-log.txt

:: Group 1
set "group1=ui-header-footer ui-homepage"

:: Group 2
set "group2=ui-service-pages data-service-areas perf-optimization"

echo Testing Group 1...
for %%b in (%group1%) do (
    echo Testing %%b...
    git checkout %%b
    if !errorlevel! neq 0 (
        echo Git checkout failed for %%b >> error-log.txt
        continue
    )
    
    call npm install --silent
    if !errorlevel! neq 0 (
        echo npm install failed for %%b >> error-log.txt
        continue
    )
    
    call npm test --silent
    if !errorlevel! neq 0 (
        echo Tests failed in %%b >> error-log.txt
    )
    
    call npm run build --silent
    if !errorlevel! neq 0 (
        echo Build failed in %%b >> error-log.txt
    )
)

echo Testing Group 2...
for %%b in (%group2%) do (
    echo Testing %%b...
    git checkout %%b
    if !errorlevel! neq 0 (
        echo Git checkout failed for %%b >> error-log.txt
        continue
    )
    
    call npm install --silent
    if !errorlevel! neq 0 (
        echo npm install failed for %%b >> error-log.txt
        continue
    )
    
    call npm test --silent
    if !errorlevel! neq 0 (
        echo Tests failed in %%b >> error-log.txt
    )
    
    call npm run build --silent
    if !errorlevel! neq 0 (
        echo Build failed in %%b >> error-log.txt
    )
)

echo Testing complete. Check error-log.txt for any issues.
endlocal
