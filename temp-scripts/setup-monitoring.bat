@echo off
setlocal enabledelayedexpansion

:: List of branches for monitoring integration
set "branches=ui-header-footer ui-homepage ui-service-pages data-service-areas perf-optimization"

:: Create monitoring directory if it doesn't exist
if not exist "src\monitoring" mkdir "src\monitoring"

:: Store initial branch
for /f "tokens=*" %%a in ('git rev-parse --abbrev-ref HEAD') do set "initial_branch=%%a"

:: Create Sentry configuration
echo import * as Sentry from '@sentry/react';> src\monitoring\sentry.ts
echo.>> src\monitoring\sentry.ts
echo const SENTRY_DSN = process.env.NEXT_PUBLIC_SENTRY_DSN;>> src\monitoring\sentry.ts
echo.>> src\monitoring\sentry.ts
echo export const initSentry = () =^> {>> src\monitoring\sentry.ts
echo   if (SENTRY_DSN) {>> src\monitoring\sentry.ts
echo     Sentry.init({>> src\monitoring\sentry.ts
echo       dsn: SENTRY_DSN,>> src\monitoring\sentry.ts
echo       tracesSampleRate: 1.0,>> src\monitoring\sentry.ts
echo       environment: process.env.NODE_ENV,>> src\monitoring\sentry.ts
echo     });>> src\monitoring\sentry.ts
echo   }>> src\monitoring\sentry.ts
echo };>> src\monitoring\sentry.ts

:: Create Analytics configuration
echo import ReactGA from 'react-ga4';> src\monitoring\analytics.ts
echo.>> src\monitoring\analytics.ts
echo const GA_MEASUREMENT_ID = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;>> src\monitoring\analytics.ts
echo.>> src\monitoring\analytics.ts
echo export const initAnalytics = () =^> {>> src\monitoring\analytics.ts
echo   if (GA_MEASUREMENT_ID) {>> src\monitoring\analytics.ts
echo     ReactGA.initialize(GA_MEASUREMENT_ID);>> src\monitoring\analytics.ts
echo   }>> src\monitoring\analytics.ts
echo };>> src\monitoring\analytics.ts
echo.>> src\monitoring\analytics.ts
echo export const trackPageView = (path: string) =^> {>> src\monitoring\analytics.ts
echo   if (GA_MEASUREMENT_ID) {>> src\monitoring\analytics.ts
echo     ReactGA.send({ hitType: "pageview", page: path });>> src\monitoring\analytics.ts
echo   }>> src\monitoring\analytics.ts
echo };>> src\monitoring\analytics.ts

:: Add monitoring to each branch
for %%b in (%branches%) do (
    echo Processing branch %%b...
    git checkout %%b
    
    if !errorlevel! neq 0 (
        echo Failed to checkout branch %%b
        continue
    )

    :: Copy monitoring files
    xcopy /Y src\monitoring\*.ts src\monitoring\ > nul

    :: Stage and commit changes
    git add src\monitoring\*.ts
    git commit -m "Added monitoring tools (Sentry and Analytics) to %%b"
    git push origin %%b

    if !errorlevel! neq 0 (
        echo Failed to push changes to %%b
    ) else (
        echo Successfully updated %%b with monitoring
    )
)

:: Return to initial branch
git checkout %initial_branch%
echo Monitoring configurations added to all branches!

endlocal
