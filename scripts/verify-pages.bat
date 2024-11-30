@echo off
echo Verifying page connections and sitemap...
node scripts/verify-pages.js

if %ERRORLEVEL% EQU 0 (
  echo.
  echo All pages are properly connected and accessible.
  exit /b 0
) else (
  echo.
  echo Issues found in page connections. Check the report above for details.
  exit /b 1
)
