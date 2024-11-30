@echo off
setlocal enabledelayedexpansion

:: Define color codes
set "RED=31"
set "GREEN=32"
set "YELLOW=33"
set "BLUE=34"

:: Function to print colored text
call :print_colored %BLUE% "DRQ Website Branch Analysis"
echo.

:: Create log file
set "log_file=branch-logs\branches-%date:~-4,4%%date:~-10,2%%date:~-7,2%.txt"
if not exist "branch-logs" mkdir branch-logs

echo DRQ Website Branch Analysis Log > %log_file%
echo =========================== >> %log_file%
echo Started: %date% %time% >> %log_file%
echo. >> %log_file%

:: 1. List all branches
call :print_colored %BLUE% "1. Listing all branches..."
echo Branch List: >> %log_file%

git branch -a > branch-list.txt
type branch-list.txt >> %log_file%

:: 2. Analyze each branch
call :print_colored %BLUE% "2. Analyzing branches..."
echo Branch Analysis: >> %log_file%

echo.
echo Branch Details:
echo --------------

for /f "tokens=* delims= " %%b in (branch-list.txt) do (
    set "branch=%%b"
    if "!branch:~0,1!"=="*" (
        set "branch=!branch:~2!"
        call :analyze_branch "!branch!" "current"
    ) else (
        call :analyze_branch "%%b"
    )
)

del branch-list.txt

:: Final summary
call :print_colored %GREEN% "Branch analysis completed!"
echo.
echo Branch Categories:
echo - ui-*: User interface components and layouts
echo - api-*: API endpoints and backend functionality
echo - feature-*: New feature implementations
echo - fix-*: Bug fixes and improvements
echo - test-*: Testing implementations
echo - docs-*: Documentation updates

goto :end

:analyze_branch
set "branch_name=%~1"
set "is_current=%~2"

echo.
if "%is_current%"=="current" (
    call :print_colored %GREEN% "* %branch_name% (current)"
) else (
    call :print_colored %BLUE% "  %branch_name%"
)

:: Get last commit info
for /f "tokens=*" %%c in ('git log -1 --format^="%%s" %branch_name% 2^>nul') do (
    echo    Last commit: %%c
)

:: Get branch creation date
for /f "tokens=*" %%d in ('git log --date^=format:"%%Y-%%m-%%d" --reverse %branch_name% 2^>nul ^| findstr Date: ^| head -1') do (
    echo    Created: %%d
)

:: Count commits
for /f "tokens=*" %%e in ('git rev-list --count %branch_name% 2^>nul') do (
    echo    Commits: %%e
)

:: Analyze branch type
echo    Type: 
if "!branch_name:ui-=!"=="!branch_name!" (
    if "!branch_name:api-=!"=="!branch_name!" (
        if "!branch_name:feature-=!"=="!branch_name!" (
            if "!branch_name:fix-=!"=="!branch_name!" (
                if "!branch_name:test-=!"=="!branch_name!" (
                    if "!branch_name:docs-=!"=="!branch_name!" (
                        echo           Other
                    ) else (
                        echo           Documentation
                    )
                ) else (
                    echo           Testing
                )
            ) else (
                echo           Bug Fix
            )
        ) else (
            echo           Feature
        )
    ) else (
        echo           API
    )
) else (
    echo           UI
)

:: Log to file
echo Branch: %branch_name% >> %log_file%
git log -1 --format="Last commit: %%s%%nCreated: %%aD%%nCommits: %%h" %branch_name% >> %log_file%
echo. >> %log_file%

exit /b

:print_colored
echo [%~1m%~2[0m
exit /b

:end
endlocal
