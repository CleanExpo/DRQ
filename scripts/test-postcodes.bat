@echo off
setlocal enabledelayedexpansion

:: Define color codes
set "RED=31"
set "GREEN=32"
set "YELLOW=33"
set "BLUE=34"

:: Function to print colored text
call :print_colored %BLUE% "DRQ Website Postcode Testing"
echo.

:: Create log file
set "log_file=test-logs\postcodes-%date:~-4,4%%date:~-10,2%%date:~-7,2%.txt"
if not exist "test-logs" mkdir test-logs

echo DRQ Website Postcode Test Log > %log_file%
echo ========================== >> %log_file%
echo Started: %date% %time% >> %log_file%
echo. >> %log_file%

:: Kill any existing Node processes
taskkill /F /IM node.exe >nul 2>&1

:: Start development server
call :print_colored %BLUE% "Starting development server..."
start /b npm run dev
timeout /t 10 /nobreak > nul

:: Test valid postcodes
call :print_colored %BLUE% "Testing valid postcodes..."
echo Valid Postcode Tests: >> %log_file%

set "valid_postcodes=4000 4001 4305 4114 4217 4163"
for %%p in (%valid_postcodes%) do (
    call :print_colored %BLUE% "Testing postcode: %%p"
    curl -s http://localhost:3000/api/areas/check/%%p > postcode-%%p.json
    type postcode-%%p.json >> %log_file%
    findstr /C:"true" postcode-%%p.json >nul
    if !errorlevel! equ 0 (
        call :print_colored %GREEN% "Postcode %%p is correctly serviced"
    ) else (
        call :print_colored %RED% "Postcode %%p should be serviced"
        set "test_failed=1"
    )
    del postcode-%%p.json
)

:: Test invalid postcodes
call :print_colored %BLUE% "Testing invalid postcodes..."
echo Invalid Postcode Tests: >> %log_file%

set "invalid_postcodes=2000 3000 6000"
for %%p in (%invalid_postcodes%) do (
    call :print_colored %BLUE% "Testing postcode: %%p"
    curl -s http://localhost:3000/api/areas/check/%%p > postcode-%%p.json
    type postcode-%%p.json >> %log_file%
    findstr /C:"false" postcode-%%p.json >nul
    if !errorlevel! equ 0 (
        call :print_colored %GREEN% "Postcode %%p is correctly not serviced"
    ) else (
        call :print_colored %RED% "Postcode %%p should not be serviced"
        set "test_failed=1"
    )
    del postcode-%%p.json
)

:: Test error handling
call :print_colored %BLUE% "Testing error handling..."
echo Error Handling Tests: >> %log_file%

:: Test empty postcode
curl -s http://localhost:3000/api/areas/check/ -w "%%{http_code}" > error-empty.txt
findstr "400" error-empty.txt >nul
if !errorlevel! equ 0 (
    call :print_colored %GREEN% "Empty postcode handled correctly"
) else (
    call :print_colored %RED% "Empty postcode not handled correctly"
    set "test_failed=1"
)
del error-empty.txt

:: Clean up
taskkill /F /IM node.exe >nul 2>&1

:: Final status
if defined test_failed (
    call :print_colored %RED% "Postcode tests completed with failures"
    echo.
    echo Action Items:
    echo 1. Check postcode validation
    echo 2. Verify service areas
    echo 3. Fix error handling
    echo 4. Run tests again
    
    exit /b 1
) else (
    call :print_colored %GREEN% "All postcode tests passed successfully!"
    echo.
    echo Test Summary:
    echo - Valid postcodes: Correct
    echo - Invalid postcodes: Correct
    echo - Error handling: Working
    
    echo.
    echo Next Steps:
    echo 1. Deploy changes
    echo 2. Test in production
    echo 3. Monitor usage
)

goto :end

:error
echo Error occurred at: %date% %time% >> %log_file%
call :print_colored %RED% "Testing failed. Check log for details."
type %log_file%
exit /b 1

:print_colored
echo [%~1m%~2[0m
exit /b

:end
endlocal
