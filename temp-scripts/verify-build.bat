@echo off
setlocal enabledelayedexpansion

:: Define color codes
set "RED=31"
set "GREEN=32"
set "YELLOW=33"
set "BLUE=34"

:: Function to print colored text
call :print_colored %BLUE% "DRQ Website Build Verification"
echo.

:: Create verification log
set "log_file=verification-logs\build-%date:~-4,4%%date:~-10,2%%date:~-7,2%.txt"
if not exist "verification-logs" mkdir verification-logs

echo DRQ Website Build Verification Log > %log_file%
echo =============================== >> %log_file%
echo Started: %date% %time% >> %log_file%
echo. >> %log_file%

:: 1. Check component structure
call :print_colored %BLUE% "1. Checking component structure..."
echo Component Structure: >> %log_file%

:: Required components
set "components=Header Hero ServiceCard ContactForm"
for %%c in (%components%) do (
    if exist "src\components\%%c\index.tsx" (
        echo Found component: %%c >> %log_file%
    ) else (
        call :print_colored %RED% "Missing component: %%c"
        echo Missing component: %%c >> %log_file%
        set "verification_failed=1"
    )
)

:: 2. Verify exports
call :print_colored %BLUE% "2. Verifying component exports..."
echo Component Exports: >> %log_file%

:: Check Header export
type "src\components\Header\index.tsx" | findstr /C:"export const Header" > nul
if !errorlevel! neq 0 (
    call :print_colored %RED% "Header component not properly exported"
    echo Header export missing >> %log_file%
    set "verification_failed=1"
)

:: 3. Check route structure
call :print_colored %BLUE% "3. Checking route structure..."
echo Route Structure: >> %log_file%

:: Required routes
set "routes=page services/page contact/page"
for %%r in (%routes%) do (
    if exist "src\app\[locale]\%%r.tsx" (
        echo Found route: %%r >> %log_file%
    ) else (
        call :print_colored %RED% "Missing route: %%r"
        echo Missing route: %%r >> %log_file%
        set "verification_failed=1"
    )
)

:: 4. Run build
call :print_colored %BLUE% "4. Running build process..."
echo Build Process: >> %log_file%

call npm run build >> %log_file% 2>&1
if !errorlevel! neq 0 (
    call :print_colored %RED% "Build failed"
    goto :error
)

:: 5. Verify build output
call :print_colored %BLUE% "5. Verifying build output..."
echo Build Output: >> %log_file%

:: Check .next directory
if not exist ".next" (
    call :print_colored %RED% "Build output directory not found"
    echo Build output missing >> %log_file%
    set "verification_failed=1"
)

:: Check for key build artifacts
set "artifacts=.next\server\app\[locale]\page.js .next\server\app\[locale]\services\page.js .next\server\app\[locale]\contact\page.js"
for %%a in (%artifacts%) do (
    if exist "%%a" (
        echo Found build artifact: %%a >> %log_file%
    ) else (
        call :print_colored %RED% "Missing build artifact: %%a"
        echo Missing build artifact: %%a >> %log_file%
        set "verification_failed=1"
    )
)

:: 6. Test local build
call :print_colored %BLUE% "6. Testing local build..."
echo Local Build Test: >> %log_file%

:: Start production server
start /b npm start > temp-server.log 2>&1
timeout /t 10 /nobreak > nul

:: Test routes
set "test_routes=/ /services /contact"
for %%r in (%test_routes%) do (
    curl -f http://localhost:3000%%r -o nul 2>>%log_file%
    if !errorlevel! neq 0 (
        call :print_colored %RED% "Route %%r not accessible"
        echo Route %%r failed >> %log_file%
        set "verification_failed=1"
    ) else (
        echo Route %%r accessible >> %log_file%
    )
)

:: Clean up
taskkill /F /IM node.exe > nul 2>&1
del temp-server.log 2>nul

:: Final status
if defined verification_failed (
    call :print_colored %RED% "Build verification failed. Check log for details."
    echo.
    echo Action Items:
    echo 1. Fix missing components
    echo 2. Correct export statements
    echo 3. Add missing routes
    echo 4. Review build output
    
    exit /b 1
) else (
    call :print_colored %GREEN% "Build verification successful!"
    echo.
    echo Build Summary:
    echo - Components: Verified
    echo - Routes: Validated
    echo - Build: Successful
    echo - Output: Complete
    
    echo.
    echo Next Steps:
    echo 1. Run scripts\validate-deployment.bat
    echo 2. Deploy to Vercel: vercel --prod
    echo 3. Monitor deployment logs
)

goto :end

:error
echo Error occurred at: %date% %time% >> %log_file%
call :print_colored %RED% "Build verification failed. Check log for details."
exit /b 1

:print_colored
echo [%~1m%~2[0m
exit /b

:end
endlocal
