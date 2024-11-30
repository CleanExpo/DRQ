@echo off
echo Testing API routes and connections...
npx ts-node scripts/test-routes.ts

if %ERRORLEVEL% EQU 0 (
  echo.
  echo All routes and connections are working properly.
  exit /b 0
) else (
  echo.
  echo Some routes or connections have failed. Check the logs above for details.
  exit /b 1
)
