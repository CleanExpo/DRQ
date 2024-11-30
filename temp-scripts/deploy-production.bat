@echo off
setlocal enabledelayedexpansion

:: Create deployment log file
echo. > production-deployment-log.txt

:: Store initial branch
for /f "tokens=*" %%a in ('git rev-parse --abbrev-ref HEAD') do set "initial_branch=%%a"

echo Creating and switching to production branch...
git checkout -b production 2>nul || git checkout production

:: List of feature branches to merge
set "branches=ui-header-footer ui-homepage ui-service-pages data-service-areas perf-optimization"

:: Merge each feature branch
for %%b in (%branches%) do (
    echo Merging %%b into production...
    git merge %%b --no-edit
    
    if !errorlevel! neq 0 (
        echo Merge conflict detected with %%b. Please resolve conflicts manually. >> production-deployment-log.txt
        echo Deployment aborted due to merge conflicts.
        git merge --abort
        goto :cleanup
    ) else (
        echo Successfully merged %%b >> production-deployment-log.txt
    )
)

:: Deploy to production
echo Deploying production branch to Vercel...
call vercel --prod --confirm > temp.log 2>&1

if !errorlevel! neq 0 (
    echo Production deployment failed >> production-deployment-log.txt
    type temp.log >> production-deployment-log.txt
) else (
    echo Production deployment successful >> production-deployment-log.txt
    :: Extract and save the deployment URL
    findstr /C:"Production:" temp.log >> production-deployment-log.txt
)
del temp.log

:: Create git tag for this production deployment
for /f "tokens=2 delims==" %%a in ('wmic OS Get localdatetime /value') do set "dt=%%a"
set "timestamp=%dt:~0,8%-%dt:~8,4%"
git tag -a "prod-%timestamp%" -m "Production deployment %timestamp%"
git push origin "prod-%timestamp%"

:cleanup
:: Return to initial branch
git checkout %initial_branch%

:: Display deployment summary
echo.
echo Production Deployment Summary:
type production-deployment-log.txt

:: Next steps reminder
echo.
echo Next Steps:
echo 1. Monitor production using Google Lighthouse and Core Web Vitals
echo 2. Check Sentry for any error reports
echo 3. Review Google Analytics for user interactions
echo 4. Document any issues or improvements needed

endlocal
