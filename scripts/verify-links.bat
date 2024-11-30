@echo off
echo Verifying site links and navigation...
node scripts/verify-links.js

if %ERRORLEVEL% EQU 0 (
  echo.
  echo All links are valid and pages exist.
  exit /b 0
) else (
  echo.
  echo Issues found in link verification. Check the report above for details.
  exit /b 1
)
