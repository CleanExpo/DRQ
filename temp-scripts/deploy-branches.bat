@echo off
setlocal enabledelayedexpansion

:: Create deployment log file
echo. > deployment-log.txt

:: Batch 1: UI-related branches
set "ui_branches=ui-header-footer ui-homepage"

:: Batch 2: Data and performance branches
set "data_branches=ui-service-pages data-service-areas perf-optimization"

:: Store initial branch
for /f "tokens=*" %%a in ('git rev-parse --abbrev-ref HEAD') do set "initial_branch=%%a"

echo Deploying UI branches...
for %%b in (%ui_branches%) do (
    echo Switching to branch %%b...
    git checkout %%b
    if !errorlevel! neq 0 (
        echo Git checkout failed for %%b >> deployment-log.txt
        continue
    )

    echo Deploying %%b to staging...
    call vercel --prod --confirm > temp.log 2>&1
    if !errorlevel! neq 0 (
        echo Deployment failed for %%b >> deployment-log.txt
        type temp.log >> deployment-log.txt
    ) else (
        echo Deployment successful for %%b >> deployment-log.txt
        :: Extract and save the deployment URL
        findstr /C:"Preview:" temp.log >> deployment-log.txt
    )
    del temp.log
)

echo Deploying Data and Performance branches...
for %%b in (%data_branches%) do (
    echo Switching to branch %%b...
    git checkout %%b
    if !errorlevel! neq 0 (
        echo Git checkout failed for %%b >> deployment-log.txt
        continue
    )

    echo Deploying %%b to staging...
    call vercel --prod --confirm > temp.log 2>&1
    if !errorlevel! neq 0 (
        echo Deployment failed for %%b >> deployment-log.txt
        type temp.log >> deployment-log.txt
    ) else (
        echo Deployment successful for %%b >> deployment-log.txt
        :: Extract and save the deployment URL
        findstr /C:"Preview:" temp.log >> deployment-log.txt
    )
    del temp.log
)

:: Return to initial branch
git checkout %initial_branch%
echo All selected branches have been processed for deployment!
echo Check deployment-log.txt for results and deployment URLs.

:: Display deployment summary
echo.
echo Deployment Summary:
type deployment-log.txt

endlocal
