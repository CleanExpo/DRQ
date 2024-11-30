@echo off
setlocal enabledelayedexpansion

:: Define color codes
set "RED=31"
set "GREEN=32"
set "YELLOW=33"
set "BLUE=34"

:: Function to print colored text
call :print_colored %BLUE% "DRQ Branch Management Tool"
echo.

:menu
echo Select an operation:
echo 1. List all branches
echo 2. Create new feature branch
echo 3. Switch branch
echo 4. Pull latest changes
echo 5. Push changes
echo 6. Sync with main
echo 7. Delete branch
echo 8. Show branch status
echo 9. Exit
echo.

set /p choice="Enter your choice (1-9): "

if "%choice%"=="1" goto list_branches
if "%choice%"=="2" goto create_branch
if "%choice%"=="3" goto switch_branch
if "%choice%"=="4" goto pull_changes
if "%choice%"=="5" goto push_changes
if "%choice%"=="6" goto sync_main
if "%choice%"=="7" goto delete_branch
if "%choice%"=="8" goto show_status
if "%choice%"=="9" goto end
goto menu

:list_branches
echo.
call :print_colored %BLUE% "Available branches:"
git branch -a
echo.
goto menu

:create_branch
echo.
set /p branch_name="Enter new branch name (e.g., feature/homepage): "
git checkout -b %branch_name%
if !errorlevel! equ 0 (
    call :print_colored %GREEN% "Branch created successfully: %branch_name%"
) else (
    call :print_colored %RED% "Failed to create branch"
)
echo.
goto menu

:switch_branch
echo.
call :print_colored %BLUE% "Available branches:"
git branch
echo.
set /p branch_name="Enter branch name to switch to: "
git checkout %branch_name%
if !errorlevel! equ 0 (
    call :print_colored %GREEN% "Switched to branch: %branch_name%"
) else (
    call :print_colored %RED% "Failed to switch branch"
)
echo.
goto menu

:pull_changes
echo.
git pull
if !errorlevel! equ 0 (
    call :print_colored %GREEN% "Successfully pulled latest changes"
) else (
    call :print_colored %RED% "Failed to pull changes"
)
echo.
goto menu

:push_changes
echo.
set /p commit_msg="Enter commit message: "
git add .
git commit -m "%commit_msg%"
git push origin HEAD
if !errorlevel! equ 0 (
    call :print_colored %GREEN% "Successfully pushed changes"
) else (
    call :print_colored %RED% "Failed to push changes"
)
echo.
goto menu

:sync_main
echo.
git fetch origin main:main
git merge main
if !errorlevel! equ 0 (
    call :print_colored %GREEN% "Successfully synced with main"
) else (
    call :print_colored %RED% "Merge conflicts detected. Please resolve manually."
)
echo.
goto menu

:delete_branch
echo.
call :print_colored %BLUE% "Available branches:"
git branch
echo.
set /p branch_name="Enter branch name to delete: "
set /p confirm="Are you sure you want to delete %branch_name%? (Y/N): "
if /i "%confirm%"=="Y" (
    git branch -d %branch_name%
    if !errorlevel! equ 0 (
        call :print_colored %GREEN% "Branch deleted successfully"
    ) else (
        call :print_colored %RED% "Failed to delete branch"
    )
)
echo.
goto menu

:show_status
echo.
call :print_colored %BLUE% "Current branch status:"
git status
echo.
goto menu

:print_colored
echo [%~1m%~2[0m
exit /b

:end
endlocal
