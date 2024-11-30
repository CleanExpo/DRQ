@echo off
setlocal enabledelayedexpansion

:: Define color codes
set "RED=31"
set "GREEN=32"
set "YELLOW=33"
set "BLUE=34"

:: Function to print colored text
call :print_colored %BLUE% "DRQ Website Environment Fix"
echo.

:: Create log file
set "log_file=env-logs\env-%date:~-4,4%%date:~-10,2%%date:~-7,2%.txt"
if not exist "env-logs" mkdir env-logs

echo DRQ Website Environment Fix Log > %log_file%
echo =========================== >> %log_file%
echo Started: %date% %time% >> %log_file%
echo. >> %log_file%

:: 1. Create .env file
call :print_colored %BLUE% "1. Creating environment files..."
echo Environment Files: >> %log_file%

echo # Site Configuration > .env.local
echo NEXT_PUBLIC_SITE_URL=http://localhost:3000 >> .env.local
echo NEXT_PUBLIC_COMPANY_NAME=Disaster Recovery Qld >> .env.local
echo NEXT_PUBLIC_CONTACT_PHONE=1300 309 361 >> .env.local
echo NEXT_PUBLIC_CONTACT_EMAIL=admin@disasterrecoveryqld.au >> .env.local
echo. >> .env.local
echo # Analytics and Monitoring >> .env.local
echo NEXT_PUBLIC_GA_MEASUREMENT_ID= >> .env.local
echo NEXT_PUBLIC_SENTRY_DSN= >> .env.local
echo. >> .env.local
echo # Feature Flags >> .env.local
echo NEXT_PUBLIC_ENABLE_CHAT=false >> .env.local
echo NEXT_PUBLIC_ENABLE_BLOG=false >> .env.local
echo NEXT_PUBLIC_MAINTENANCE_MODE=false >> .env.local
echo. >> .env.local
echo # Development Settings >> .env.local
echo NODE_ENV=development >> .env.local

:: 2. Create .env.development
call :print_colored %BLUE% "2. Creating development environment..."
copy .env.local .env.development >nul

:: 3. Create .env.production
call :print_colored %BLUE% "3. Creating production environment..."
echo # Site Configuration > .env.production
echo NEXT_PUBLIC_SITE_URL=https://www.disasterrecoveryqld.au >> .env.production
echo NEXT_PUBLIC_COMPANY_NAME=Disaster Recovery Qld >> .env.production
echo NEXT_PUBLIC_CONTACT_PHONE=1300 309 361 >> .env.production
echo NEXT_PUBLIC_CONTACT_EMAIL=admin@disasterrecoveryqld.au >> .env.production
echo. >> .env.production
echo # Analytics and Monitoring >> .env.production
echo NEXT_PUBLIC_GA_MEASUREMENT_ID= >> .env.production
echo NEXT_PUBLIC_SENTRY_DSN= >> .env.production
echo. >> .env.production
echo # Feature Flags >> .env.production
echo NEXT_PUBLIC_ENABLE_CHAT=false >> .env.production
echo NEXT_PUBLIC_ENABLE_BLOG=false >> .env.production
echo NEXT_PUBLIC_MAINTENANCE_MODE=false >> .env.production
echo. >> .env.production
echo # Production Settings >> .env.production
echo NODE_ENV=production >> .env.production

:: 4. Update .gitignore
call :print_colored %BLUE% "4. Updating .gitignore..."
echo Updating .gitignore: >> %log_file%

echo # Dependencies >> .gitignore
echo /node_modules >> .gitignore
echo /.pnp >> .gitignore
echo .pnp.js >> .gitignore
echo. >> .gitignore
echo # Testing >> .gitignore
echo /coverage >> .gitignore
echo. >> .gitignore
echo # Next.js >> .gitignore
echo /.next/ >> .gitignore
echo /out/ >> .gitignore
echo. >> .gitignore
echo # Production >> .gitignore
echo /build >> .gitignore
echo. >> .gitignore
echo # Environment >> .gitignore
echo .env*.local >> .gitignore
echo. >> .gitignore
echo # Vercel >> .gitignore
echo .vercel >> .gitignore
echo. >> .gitignore
echo # TypeScript >> .gitignore
echo *.tsbuildinfo >> .gitignore
echo next-env.d.ts >> .gitignore
echo. >> .gitignore
echo # IDE >> .gitignore
echo .vscode/ >> .gitignore
echo .idea/ >> .gitignore
echo. >> .gitignore
echo # Logs >> .gitignore
echo *-logs/ >> .gitignore
echo *.log >> .gitignore

:: 5. Create next.config.js
call :print_colored %BLUE% "5. Creating Next.js configuration..."
echo Next.js Configuration: >> %log_file%

echo /** @type {import('next').NextConfig} */ > next.config.js
echo const nextConfig = { >> next.config.js
echo   reactStrictMode: true, >> next.config.js
echo   images: { >> next.config.js
echo     domains: [], >> next.config.js
echo     deviceSizes: [640, 750, 828, 1080, 1200, 1920], >> next.config.js
echo     imageSizes: [16, 32, 48, 64, 96, 128, 256, 384], >> next.config.js
echo   }, >> next.config.js
echo   i18n: { >> next.config.js
echo     locales: ['en-AU'], >> next.config.js
echo     defaultLocale: 'en-AU', >> next.config.js
echo   }, >> next.config.js
echo } >> next.config.js
echo. >> next.config.js
echo module.exports = nextConfig >> next.config.js

:: Final status
call :print_colored %GREEN% "Environment setup completed successfully!"
echo.
echo Next Steps:
echo 1. Review .env.local for any custom values
echo 2. Run scripts\verify-app.bat to verify setup
echo 3. Start development with scripts\dev.bat

goto :end

:error
echo Error occurred at: %date% %time% >> %log_file%
call :print_colored %RED% "Environment setup failed. Check log for details."
exit /b 1

:print_colored
echo [%~1m%~2[0m
exit /b

:end
endlocal
