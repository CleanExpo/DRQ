@echo off
echo Starting complete site verification...

echo Starting development server...
start "Next.js Dev Server" /B npm run dev

echo Waiting for server to start...
timeout /t 10 /nobreak > nul

echo Running all verifications...
node scripts/verify-all.js
set VERIFY_STATUS=%ERRORLEVEL%

echo Stopping development server...
for /f "tokens=5" %%a in ('netstat -aon ^| find ":3000" ^| find "LISTENING"') do taskkill /f /pid %%a > nul 2>&1

if %VERIFY_STATUS% EQU 0 (
  echo.
  echo ✅ All verifications passed successfully.
  echo Site is ready for deployment.
  exit /b 0
) else (
  echo.
  echo ❌ Some verifications failed.
  echo Please check the reports above and fix any issues.
  exit /b 1
)
