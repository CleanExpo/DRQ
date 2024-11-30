@echo off
setlocal enabledelayedexpansion

:: Define color codes
set "RED=31"
set "GREEN=32"
set "YELLOW=33"
set "BLUE=34"

:: Function to print colored text
call :print_colored %BLUE% "DRQ Website Branch Report"
echo.

:: Create report directory
if not exist "reports" mkdir reports

:: Create report file
set "report_file=reports\branch-report-%date:~-4,4%%date:~-10,2%%date:~-7,2%.md"

:: Generate report header
echo # DRQ Website Branch Report > %report_file%
echo Generated: %date% %time% >> %report_file%
echo. >> %report_file%

:: 1. List branches
call :print_colored %BLUE% "1. Gathering branch information..."

echo ## Branch Overview >> %report_file%
echo. >> %report_file%
echo Branch structure and categorization: >> %report_file%
echo. >> %report_file%

:: Main branches
echo ### Main Branches >> %report_file%
echo. >> %report_file%
git branch -a | findstr "main master" >> %report_file%
echo. >> %report_file%

:: Feature branches
echo ### Feature Branches >> %report_file%
echo. >> %report_file%
git branch -a | findstr "feature" >> %report_file%
echo. >> %report_file%

:: UI branches
echo ### UI Branches >> %report_file%
echo. >> %report_file%
git branch -a | findstr "ui" >> %report_file%
echo. >> %report_file%

:: API branches
echo ### API Branches >> %report_file%
echo. >> %report_file%
git branch -a | findstr "api" >> %report_file%
echo. >> %report_file%

:: 2. Branch details
call :print_colored %BLUE% "2. Analyzing branch details..."

echo ## Branch Details >> %report_file%
echo. >> %report_file%

for /f "tokens=* delims= " %%b in ('git branch -a') do (
    set "branch=%%b"
    if "!branch:~0,1!"=="*" (
        set "branch=!branch:~2!"
    )
    
    echo ### !branch! >> %report_file%
    echo. >> %report_file%
    
    :: Last commit
    echo #### Latest Changes >> %report_file%
    git log -1 --format="- Last commit: %%s%%n- Author: %%an%%n- Date: %%ad" !branch! >> %report_file%
    echo. >> %report_file%
    
    :: File changes
    echo #### Files Changed >> %report_file%
    git diff --name-status main..!branch! >> %report_file%
    echo. >> %report_file%
    
    :: Features added
    echo #### Features Added >> %report_file%
    git log --format="- %%s" main..!branch! | findstr /i "add implement feature" >> %report_file%
    echo. >> %report_file%
    
    :: Bug fixes
    echo #### Bug Fixes >> %report_file%
    git log --format="- %%s" main..!branch! | findstr /i "fix resolve" >> %report_file%
    echo. >> %report_file%
)

:: 3. Generate statistics
call :print_colored %BLUE% "3. Generating statistics..."

echo ## Branch Statistics >> %report_file%
echo. >> %report_file%

:: Count branches by type
set "feature_count=0"
set "ui_count=0"
set "api_count=0"
set "other_count=0"

for /f "tokens=* delims= " %%b in ('git branch -a') do (
    set "branch=%%b"
    if "!branch:feature=!"=="!branch!" (
        if "!branch:ui=!"=="!branch!" (
            if "!branch:api=!"=="!branch!" (
                set /a other_count+=1
            ) else (
                set /a api_count+=1
            )
        ) else (
            set /a ui_count+=1
        )
    ) else (
        set /a feature_count+=1
    )
)

echo ### Branch Count >> %report_file%
echo - Feature branches: !feature_count! >> %report_file%
echo - UI branches: !ui_count! >> %report_file%
echo - API branches: !api_count! >> %report_file%
echo - Other branches: !other_count! >> %report_file%
echo. >> %report_file%

:: 4. Generate recommendations
call :print_colored %BLUE% "4. Generating recommendations..."

echo ## Recommendations >> %report_file%
echo. >> %report_file%
echo ### Merge Candidates >> %report_file%
echo Branches that might be ready to merge: >> %report_file%
git branch --merged main >> %report_file%
echo. >> %report_file%

echo ### Stale Branches >> %report_file%
echo Branches with no activity in the last 30 days: >> %report_file%
git branch -a --no-merged main | findstr /v "HEAD" >> %report_file%
echo. >> %report_file%

:: Final status
call :print_colored %GREEN% "Branch report generated successfully!"
echo.
echo Report location: %report_file%
echo.
echo Report sections:
echo 1. Branch Overview
echo 2. Branch Details
echo 3. Branch Statistics
echo 4. Recommendations

goto :end

:print_colored
echo [%~1m%~2[0m
exit /b

:end
endlocal
