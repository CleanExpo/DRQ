@echo off
echo Generating page development status report...
npx ts-node scripts/page-status.ts

if %ERRORLEVEL% EQU 0 (
  echo.
  echo Report generated successfully.
  exit /b 0
) else (
  echo.
  echo Failed to generate report. Check the error messages above.
  exit /b 1
)
