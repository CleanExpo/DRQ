@echo off
setlocal EnableDelayedExpansion

:: Colors for Windows console
set "RED=[91m"
set "GREEN=[92m"
set "BLUE=[94m"
set "NC=[0m"

:: Check if git repository exists
git rev-parse --git-dir >nul 2>&1
if errorlevel 1 (
    echo %RED%Error: Not a git repository%NC%
    exit /b 1
)

:: Store current branch
for /f "tokens=*" %%a in ('git symbolic-ref --short HEAD') do set "current_branch=%%a"

:: Function to create branch if it doesn't exist
:create_branch
set "branch=%~1"
set "base=%~2"

git show-ref --verify --quiet refs/heads/%branch%
if errorlevel 1 (
    echo %BLUE%Creating %branch% branch from %base%...%NC%
    git checkout %base%
    git checkout -b %branch%
    git push -u origin %branch%
    echo %GREEN%Created %branch% branch%NC%
) else (
    echo %BLUE%Branch %branch% already exists%NC%
)
goto :eof

:: Create main branches
call :create_branch "main" "main"
call :create_branch "develop" "main"

:: Create feature and hotfix branches
call :create_branch "feature/ui-enhancements" "develop"
call :create_branch "feature/backend-data" "develop"
call :create_branch "hotfix/current" "main"

:: Return to original branch
git checkout %current_branch%

echo.
echo %GREEN%Branch structure setup complete!%NC%
echo.
echo Branch structure:
echo %BLUE%main%NC% - Production branch
echo %BLUE%develop%NC% - Development branch
echo %BLUE%feature/ui-enhancements%NC% - UI/UX improvements
echo %BLUE%feature/backend-data%NC% - Backend data management
echo %BLUE%hotfix/current%NC% - Current hotfixes

:: Create .gitflow documentation
(
echo # DRQ Website Git Branching Strategy
echo.
echo ## Main Branches
echo - main: Production-ready code
echo - develop: Development integration branch
echo.
echo ## Feature Branches
echo - feature/*: New features and improvements
echo   - feature/ui-enhancements: UI/UX improvements
echo   - feature/backend-data: Backend data management
echo.
echo ## Hotfix Branches
echo - hotfix/*: Urgent fixes for production
echo.
echo ## Branch Usage Guidelines
echo 1. All new features should branch from 'develop'
echo 2. Hotfixes should branch from 'main'
echo 3. Always merge back into both 'main' and 'develop'
echo 4. Delete feature branches after merging
) > .gitflow

echo.
echo %GREEN%Created .gitflow documentation file%NC%

endlocal
