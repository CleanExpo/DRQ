@echo off
setlocal enabledelayedexpansion

:: Define color codes
set "RED=31"
set "GREEN=32"
set "YELLOW=33"
set "BLUE=34"

:: Function to print colored text
call :print_colored %BLUE% "DRQ Website Branch Feature Analysis"
echo.

:: Create log file
set "log_file=analysis-logs\features-%date:~-4,4%%date:~-10,2%%date:~-7,2%.txt"
if not exist "analysis-logs" mkdir analysis-logs

echo DRQ Website Branch Feature Analysis Log > %log_file%
echo =================================== >> %log_file%
echo Started: %date% %time% >> %log_file%
echo. >> %log_file%

:: 1. Get all branches
call :print_colored %BLUE% "1. Getting branch list..."
echo Branch List: >> %log_file%

git branch -a > branch-list.txt

:: 2. Analyze each branch
call :print_colored %BLUE% "2. Analyzing branch features..."
echo Branch Features: >> %log_file%

echo.
echo Branch Features and Changes:
echo --------------------------

for /f "tokens=* delims= " %%b in (branch-list.txt) do (
    set "branch=%%b"
    if "!branch:~0,1!"=="*" (
        set "branch=!branch:~2!"
        call :analyze_features "!branch!"
    ) else (
        call :analyze_features "%%b"
    )
)

del branch-list.txt

:: Final summary
call :print_colored %GREEN% "Feature analysis completed!"
echo.
echo Branch Categories:
echo - UI Components: Navigation, layouts, responsive design
echo - API Features: Endpoints, data handling, validation
echo - Core Features: Business logic, functionality
echo - Testing: Unit tests, integration tests
echo - Documentation: README, comments, docs

goto :end

:analyze_features
set "branch_name=%~1"

echo.
call :print_colored %BLUE% "Branch: %branch_name%"
echo Branch: %branch_name% >> %log_file%

:: Get changed files
echo Changed Files:
git diff --name-status main..%branch_name% > branch-changes.txt

:: Analyze changes by type
set "ui_changes=0"
set "api_changes=0"
set "test_changes=0"
set "doc_changes=0"
set "feature_changes=0"

for /f "tokens=1,2" %%f in (branch-changes.txt) do (
    set "file=%%g"
    if "!file:components=!"=="!file!" (
        if "!file:api=!"=="!file!" (
            if "!file:test=!"=="!file!" (
                if "!file:docs=!"=="!file!" (
                    set /a feature_changes+=1
                ) else (
                    set /a doc_changes+=1
                )
            ) else (
                set /a test_changes+=1
            )
        ) else (
            set /a api_changes+=1
        )
    ) else (
        set /a ui_changes+=1
    )
)

echo    UI Changes: !ui_changes!
echo    API Changes: !api_changes!
echo    Test Changes: !test_changes!
echo    Doc Changes: !doc_changes!
echo    Feature Changes: !feature_changes!

:: Get feature commits
echo.
echo Features Implemented:
git log --format="- %%s" main..%branch_name% | findstr /i "add implement feature" > feature-commits.txt
type feature-commits.txt
type feature-commits.txt >> %log_file%

:: Get bug fixes
echo.
echo Bug Fixes:
git log --format="- %%s" main..%branch_name% | findstr /i "fix resolve" > fix-commits.txt
type fix-commits.txt
type fix-commits.txt >> %log_file%

:: Clean up
del branch-changes.txt feature-commits.txt fix-commits.txt

echo. >> %log_file%
exit /b

:print_colored
echo [%~1m%~2[0m
exit /b

:end
endlocal
