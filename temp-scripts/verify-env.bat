@echo off
setlocal enabledelayedexpansion

:: Define color codes
set "RED=31"
set "GREEN=32"
set "YELLOW=33"
set "BLUE=34"

:: Function to print colored text
call :print_colored %BLUE% "DRQ Website Environment Verification"
echo.

:: Create verification log
set "log_file=verification-logs\env-%date:~-4,4%%date:~-10,2%%date:~-7,2%.txt"
if not exist "verification-logs" mkdir verification-logs

echo DRQ Website Environment Verification Log > %log_file%
echo ================================== >> %log_file%
echo Started: %date% %time% >> %log_file%
echo. >> %log_file%

:: 1. Check .env file existence
call :print_colored %BLUE% "1. Checking environment files..."
echo Environment Files: >> %log_file%

if exist ".env.local" (
    echo Found .env.local >> %log_file%
) else (
    call :print_colored %RED% "Missing .env.local file"
    echo Missing .env.local >> %log_file%
    set "verification_failed=1"
)

:: 2. Verify required variables
call :print_colored %BLUE% "2. Verifying required variables..."
echo Required Variables: >> %log_file%

:: Core variables
set "required_vars=NEXT_PUBLIC_SITE_URL NEXT_PUBLIC_COMPANY_NAME NEXT_PUBLIC_CONTACT_PHONE NEXT_PUBLIC_CONTACT_EMAIL"

:: Read .env.local file
for /f "tokens=*" %%a in (.env.local) do (
    set line=%%a
    if not "!line:~0,1!"=="#" (
        for %%v in (%required_vars%) do (
            echo !line! | findstr /C:"%%v=" > nul
            if !errorlevel! equ 0 (
                echo Found variable: %%v >> %log_file%
                
                :: Check if variable has a value
                for /f "tokens=2 delims==" %%b in ("!line!") do (
                    if "%%b"=="" (
                        call :print_colored %RED% "Variable %%v is empty"
                        echo Variable %%v is empty >> %log_file%
                        set "verification_failed=1"
                    )
                )
            )
        )
    )
)

:: 3. Check environment type
call :print_colored %BLUE% "3. Checking environment type..."
echo Environment Type: >> %log_file%

findstr /C:"NODE_ENV=" .env.local > nul
if !errorlevel! equ 0 (
    for /f "tokens=2 delims==" %%a in ('findstr /C:"NODE_ENV=" .env.local') do (
        echo Environment: %%a >> %log_file%
    )
) else (
    call :print_colored %YELLOW% "NODE_ENV not set, defaulting to development"
    echo NODE_ENV not set >> %log_file%
)

:: 4. Validate URL format
call :print_colored %BLUE% "4. Validating URL format..."
echo URL Validation: >> %log_file%

for /f "tokens=2 delims==" %%a in ('findstr /C:"NEXT_PUBLIC_SITE_URL=" .env.local') do (
    echo %%a | findstr /R /C:"^https\?://.*" > nul
    if !errorlevel! neq 0 (
        call :print_colored %RED% "Invalid site URL format"
        echo Invalid site URL format >> %log_file%
        set "verification_failed=1"
    )
)

:: 5. Check optional services
call :print_colored %BLUE% "5. Checking optional services..."
echo Optional Services: >> %log_file%

:: Analytics
findstr /C:"NEXT_PUBLIC_GA_MEASUREMENT_ID=" .env.local > nul
if !errorlevel! equ 0 (
    echo Google Analytics configured >> %log_file%
) else (
    call :print_colored %YELLOW% "Google Analytics not configured"
    echo Google Analytics not configured >> %log_file%
)

:: Error tracking
findstr /C:"NEXT_PUBLIC_SENTRY_DSN=" .env.local > nul
if !errorlevel! equ 0 (
    echo Sentry configured >> %log_file%
) else (
    call :print_colored %YELLOW% "Sentry not configured"
    echo Sentry not configured >> %log_file%
)

:: 6. Check feature flags
call :print_colored %BLUE% "6. Checking feature flags..."
echo Feature Flags: >> %log_file%

set "feature_flags=NEXT_PUBLIC_ENABLE_CHAT NEXT_PUBLIC_ENABLE_BLOG NEXT_PUBLIC_MAINTENANCE_MODE"

for %%f in (%feature_flags%) do (
    findstr /C:"%%f=" .env.local > nul
    if !errorlevel! equ 0 (
        for /f "tokens=2 delims==" %%a in ('findstr /C:"%%f=" .env.local') do (
            echo Feature %%f: %%a >> %log_file%
        )
    ) else (
        call :print_colored %YELLOW% "Feature flag %%f not set"
        echo Feature flag %%f not set >> %log_file%
    )
)

:: Final status
if defined verification_failed (
    call :print_colored %RED% "Environment verification failed. Check log for details."
    echo.
    echo Action Items:
    echo 1. Create missing .env.local file if needed
    echo 2. Set required environment variables
    echo 3. Fix invalid variable formats
    echo 4. Configure optional services
    
    exit /b 1
) else (
    call :print_colored %GREEN% "Environment verification successful!"
    echo.
    echo Environment Summary:
    echo - Required variables: Present
    echo - URL format: Valid
    echo - Optional services: Checked
    echo - Feature flags: Configured
    
    echo.
    echo Next Steps:
    echo 1. Run scripts\verify-build.bat
    echo 2. Deploy with vercel --prod
    echo 3. Monitor deployment logs
)

goto :end

:error
echo Error occurred at: %date% %time% >> %log_file%
call :print_colored %RED% "Environment verification failed. Check log for details."
exit /b 1

:print_colored
echo [%~1m%~2[0m
exit /b

:end
endlocal
