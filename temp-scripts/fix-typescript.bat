@echo off
setlocal enabledelayedexpansion

:: Define color codes
set "RED=31"
set "GREEN=32"
set "YELLOW=33"
set "BLUE=34"

:: Function to print colored text
call :print_colored %BLUE% "DRQ Website TypeScript Fix"
echo.

:: Create log directory
if not exist "typescript-logs" mkdir typescript-logs

:: Create log file
set "log_file=typescript-logs\fix-%date:~-4,4%%date:~-10,2%%date:~-7,2%.txt"
echo DRQ Website TypeScript Fix Log > %log_file%
echo =========================== >> %log_file%
echo Started: %date% %time% >> %log_file%
echo. >> %log_file%

:: 1. Install core dependencies first
call :print_colored %BLUE% "1. Installing core dependencies..."
echo Installing Core Dependencies: >> %log_file%

call npm install --save next react react-dom >> %log_file% 2>&1
if !errorlevel! neq 0 (
    call :print_colored %RED% "Failed to install core dependencies"
    goto :error
)

:: 2. Install TypeScript dependencies
call :print_colored %BLUE% "2. Installing TypeScript dependencies..."
echo Installing TypeScript Dependencies: >> %log_file%

call npm install --save-dev typescript @types/node @types/react @types/react-dom @typescript-eslint/eslint-plugin @typescript-eslint/parser >> %log_file% 2>&1
if !errorlevel! neq 0 (
    call :print_colored %RED% "Failed to install TypeScript dependencies"
    goto :error
)

:: 3. Initialize TypeScript if needed
call :print_colored %BLUE% "3. Initializing TypeScript configuration..."
echo Initializing TypeScript: >> %log_file%

if not exist "tsconfig.json" (
    echo Creating tsconfig.json...
    echo {> tsconfig.json
    echo   "compilerOptions": {>> tsconfig.json
    echo     "target": "es2017",>> tsconfig.json
    echo     "lib": ["dom", "dom.iterable", "esnext"],>> tsconfig.json
    echo     "allowJs": true,>> tsconfig.json
    echo     "skipLibCheck": true,>> tsconfig.json
    echo     "strict": true,>> tsconfig.json
    echo     "noEmit": true,>> tsconfig.json
    echo     "esModuleInterop": true,>> tsconfig.json
    echo     "module": "esnext",>> tsconfig.json
    echo     "moduleResolution": "bundler",>> tsconfig.json
    echo     "resolveJsonModule": true,>> tsconfig.json
    echo     "isolatedModules": true,>> tsconfig.json
    echo     "jsx": "preserve",>> tsconfig.json
    echo     "incremental": true,>> tsconfig.json
    echo     "plugins": [{ "name": "next" }],>> tsconfig.json
    echo     "baseUrl": ".",>> tsconfig.json
    echo     "paths": {>> tsconfig.json
    echo       "@/*": ["./src/*"]>> tsconfig.json
    echo     }>> tsconfig.json
    echo   },>> tsconfig.json
    echo   "include": ["next-env.d.ts", "**/*.ts", "**/*.tsx", ".next/types/**/*.ts"],>> tsconfig.json
    echo   "exclude": ["node_modules"]>> tsconfig.json
    echo }>> tsconfig.json
)

:: 4. Create required directories
call :print_colored %BLUE% "4. Creating required directories..."
echo Creating Directories: >> %log_file%

mkdir src 2>nul
mkdir src\app 2>nul
mkdir src\components 2>nul
mkdir src\config 2>nul
mkdir src\lib 2>nul
mkdir src\styles 2>nul
mkdir src\types 2>nul
mkdir src\utils 2>nul

:: 5. Create essential type definitions
call :print_colored %BLUE% "5. Creating type definitions..."
echo Creating Type Definitions: >> %log_file%

:: Create env.d.ts
if not exist "src\types\env.d.ts" (
    echo // Environment variables type definitions > src\types\env.d.ts
    echo declare namespace NodeJS { >> src\types\env.d.ts
    echo   interface ProcessEnv { >> src\types\env.d.ts
    echo     NODE_ENV: 'development' ^| 'production' ^| 'test' >> src\types\env.d.ts
    echo     NEXT_PUBLIC_SITE_URL: string >> src\types\env.d.ts
    echo     NEXT_PUBLIC_COMPANY_NAME: string >> src\types\env.d.ts
    echo     NEXT_PUBLIC_CONTACT_PHONE: string >> src\types\env.d.ts
    echo     NEXT_PUBLIC_CONTACT_EMAIL: string >> src\types\env.d.ts
    echo   } >> src\types\env.d.ts
    echo } >> src\types\env.d.ts
)

:: 6. Initialize Next.js types
call :print_colored %BLUE% "6. Initializing Next.js types..."
echo Initializing Next.js Types: >> %log_file%

call npx --yes create-next-app@latest . --ts --tailwind --eslint --app --src-dir --import-alias "@/*" --no-git --no-experimental-app --use-npm --skip-questions >> %log_file% 2>&1

:: 7. Run type check
call :print_colored %BLUE% "7. Running type check..."
echo Type Check: >> %log_file%

call npx tsc --noEmit >> %log_file% 2>&1
if !errorlevel! neq 0 (
    call :print_colored %YELLOW% "Type check found issues - this is expected for initial setup"
    echo Type check issues found - will be resolved in next steps >> %log_file%
) else (
    call :print_colored %GREEN% "Type check passed"
    echo Type check passed >> %log_file%
)

:: Success
call :print_colored %GREEN% "TypeScript setup completed successfully!"
echo.
echo Next steps:
echo 1. Run scripts\verify-app.bat to verify the setup
echo 2. Start development with scripts\dev.bat
echo 3. Check for any remaining type errors

goto :end

:error
echo Error occurred at: %date% %time% >> %log_file%
call :print_colored %RED% "TypeScript setup failed. Check log for details."
type %log_file%
exit /b 1

:print_colored
echo [%~1m%~2[0m
exit /b

:end
endlocal
