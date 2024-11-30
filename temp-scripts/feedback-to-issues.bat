@echo off
setlocal enabledelayedexpansion

:: Check if feedback log exists
if not exist "feedback-log.txt" (
    echo Error: feedback-log.txt not found.
    echo Create feedback-log.txt with each piece of feedback on a new line.
    exit /b 1
)

:: Check if GitHub CLI is installed
gh --version > nul 2>&1
if !errorlevel! neq 0 (
    echo Error: GitHub CLI not installed.
    echo Install from: https://cli.github.com/
    exit /b 1
)

:: Check if logged in to GitHub
gh auth status > nul 2>&1
if !errorlevel! neq 0 (
    echo Error: Not logged in to GitHub.
    echo Run: gh auth login
    exit /b 1
)

echo Processing feedback and creating GitHub issues...
echo. > issue-creation-log.txt

:: Read feedback-log.txt line by line and create issues
for /f "usebackq tokens=*" %%a in ("feedback-log.txt") do (
    :: Skip empty lines
    if not "%%a"=="" (
        :: Create labels based on feedback content
        set "labels="
        echo %%a | findstr /i "bug error fail" > nul
        if !errorlevel!==0 set "labels=!labels!,bug"
        echo %%a | findstr /i "enhance improve feature" > nul
        if !errorlevel!==0 set "labels=!labels!,enhancement"
        echo %%a | findstr /i "performance speed slow" > nul
        if !errorlevel!==0 set "labels=!labels!,performance"
        
        :: Remove leading comma if present
        if defined labels set "labels=!labels:~1!"
        
        :: Create issue
        echo Creating issue for: %%a
        if defined labels (
            gh issue create --title "Feedback: %%~na" --body "%%a" --label "!labels!" >> issue-creation-log.txt 2>&1
        ) else (
            gh issue create --title "Feedback: %%~na" --body "%%a" --label "feedback" >> issue-creation-log.txt 2>&1
        )
        
        if !errorlevel! neq 0 (
            echo Failed to create issue for: %%a >> issue-creation-log.txt
        ) else (
            echo Successfully created issue for: %%a >> issue-creation-log.txt
        )
    )
)

:: Display results
echo.
echo Issue Creation Summary:
type issue-creation-log.txt

:: Cleanup
echo.
echo Would you like to clear the feedback log? (Y/N)
set /p clear=
if /i "!clear!"=="Y" (
    echo. > feedback-log.txt
    echo Feedback log cleared.
)

endlocal
