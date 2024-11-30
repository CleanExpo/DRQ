@echo off
setlocal enabledelayedexpansion

:: Define color codes
set "RED=31"
set "GREEN=32"
set "YELLOW=33"
set "BLUE=34"

:: Function to print colored text
call :print_colored %BLUE% "Branch Validation Tool"
echo.

:: Store current branch
for /f "tokens=*" %%a in ('git rev-parse --abbrev-ref HEAD') do set "current_branch=%%a"

:: Define expected feature branches and their files
set "frontend_branches=ui-header-footer ui-homepage ui-service-pages"
set "expected_files[ui-header-footer]=src/components/Header src/components/Footer"
set "expected_files[ui-homepage]=src/components/Hero src/components/Features"
set "expected_files[ui-service-pages]=src/app/[locale]/services"

echo Validating branch structure and files...
echo Current branch: %current_branch%
echo.

:: Check each branch
for %%b in (%frontend_branches%) do (
    echo Checking branch: %%b
    
    :: Switch to branch
    git checkout %%b > nul 2>&1
    if !errorlevel! neq 0 (
        call :print_colored %RED% "Error: Branch %%b does not exist"
        continue
    )

    :: Check for expected files
    for %%f in (!expected_files[%%b]!) do (
        if not exist "%%f" (
            call :print_colored %RED% "Warning: Expected file/directory %%f not found in branch %%b"
        ) else (
            call :print_colored %GREEN% "Found expected file/directory %%f"
        )
    )

    :: Check for uncommitted changes
    git diff --quiet
    if !errorlevel! neq 0 (
        call :print_colored %YELLOW% "Warning: Branch %%b has uncommitted changes"
    )

    :: Check if branch is behind/ahead of main
    git rev-list --left-right --count main...%%b > temp.txt
    set /p behind_ahead=<temp.txt
    del temp.txt
    
    for /f "tokens=1,2" %%x in ("!behind_ahead!") do (
        if %%x gtr 0 (
            call :print_colored %YELLOW% "Warning: Branch %%b is %%x commits behind main"
        )
        if %%y gtr 0 (
            call :print_colored %YELLOW% "Warning: Branch %%b is %%y commits ahead of main"
        )
    )

    echo.
)

:: Return to original branch
git checkout %current_branch% > nul 2>&1

:: Generate report
echo Generating validation report...
echo. > branch-validation-report.txt
echo Branch Validation Report >> branch-validation-report.txt
echo ====================== >> branch-validation-report.txt
echo Generated: %date% %time% >> branch-validation-report.txt
echo. >> branch-validation-report.txt

for %%b in (%frontend_branches%) do (
    echo Branch: %%b >> branch-validation-report.txt
    echo -------------------- >> branch-validation-report.txt
    
    :: List files in branch
    git checkout %%b > nul 2>&1
    echo Files: >> branch-validation-report.txt
    git ls-tree -r --name-only HEAD >> branch-validation-report.txt
    
    :: List recent commits
    echo. >> branch-validation-report.txt
    echo Recent Commits: >> branch-validation-report.txt
    git log -5 --oneline >> branch-validation-report.txt
    echo. >> branch-validation-report.txt
)

:: Return to original branch
git checkout %current_branch% > nul 2>&1

echo Report generated: branch-validation-report.txt
echo.

:: Recommendations
echo Recommendations:
echo ---------------
echo 1. Review any warnings in the validation report
echo 2. Merge main into branches that are behind
echo 3. Review uncommitted changes
echo 4. Ensure all expected files are present
echo.

:print_colored
echo [%~1m%~2[0m
exit /b

endlocal
