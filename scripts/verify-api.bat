@echo off
echo Starting development server for API testing...
start "Next.js Dev Server" /B npm run dev

echo Waiting for server to start...
timeout /t 10 /nobreak > nul

echo Verifying API endpoints...
node scripts/verify-api.js
set API_STATUS=%ERRORLEVEL%

echo Stopping development server...
for /f "tokens=5" %%a in ('netstat -aon ^| find ":3000" ^| find "LISTENING"') do taskkill /f /pid %%a > nul 2>&1

if %API_STATUS% EQU 0 (
  echo.
  echo All API endpoints are working correctly.
  exit /b 0
) else (
  echo.
  echo Issues found in API verification. Check the report above for details.
  exit /b 1
)
