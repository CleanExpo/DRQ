@echo off
setlocal enabledelayedexpansion

:: Define color codes
set "RED=31"
set "GREEN=32"
set "YELLOW=33"
set "BLUE=34"

:: Function to print colored text
call :print_colored %BLUE% "DRQ Website Setup"
echo.

:: Create directories
mkdir scripts 2>nul
mkdir setup-logs 2>nul

:: Create log file
set "log_file=setup-logs\setup-%date:~-4,4%%date:~-10,2%%date:~-7,2%.txt"

echo DRQ Website Setup Log > %log_file%
echo =================== >> %log_file%
echo Started: %date% %time% >> %log_file%
echo. >> %log_file%

:: 1. Create required scripts
call :print_colored %BLUE% "1. Creating required scripts..."
echo Creating Scripts: >> %log_file%

:: Initialize npm if needed
if not exist "package.json" (
    call npm init -y > nul 2>&1
)

:: Install required dependencies
call :print_colored %BLUE% "Installing core dependencies..."
call npm install --save next react react-dom >> %log_file% 2>&1
call npm install --save-dev typescript @types/react @types/react-dom @types/node >> %log_file% 2>&1

:: Create Next.js config
echo /** @type {import('next').NextConfig} */ > next.config.js
echo const nextConfig = { >> next.config.js
echo   reactStrictMode: true, >> next.config.js
echo } >> next.config.js
echo module.exports = nextConfig >> next.config.js

:: Create tsconfig.json if it doesn't exist
if not exist "tsconfig.json" (
    echo { > tsconfig.json
    echo   "compilerOptions": { >> tsconfig.json
    echo     "target": "es5", >> tsconfig.json
    echo     "lib": ["dom", "dom.iterable", "esnext"], >> tsconfig.json
    echo     "allowJs": true, >> tsconfig.json
    echo     "skipLibCheck": true, >> tsconfig.json
    echo     "strict": true, >> tsconfig.json
    echo     "forceConsistentCasingInFileNames": true, >> tsconfig.json
    echo     "noEmit": true, >> tsconfig.json
    echo     "esModuleInterop": true, >> tsconfig.json
    echo     "module": "esnext", >> tsconfig.json
    echo     "moduleResolution": "node", >> tsconfig.json
    echo     "resolveJsonModule": true, >> tsconfig.json
    echo     "isolatedModules": true, >> tsconfig.json
    echo     "jsx": "preserve", >> tsconfig.json
    echo     "incremental": true, >> tsconfig.json
    echo     "plugins": [{ "name": "next" }], >> tsconfig.json
    echo     "paths": { >> tsconfig.json
    echo       "@/*": ["./src/*"] >> tsconfig.json
    echo     } >> tsconfig.json
    echo   }, >> tsconfig.json
    echo   "include": ["next-env.d.ts", "**/*.ts", "**/*.tsx"], >> tsconfig.json
    echo   "exclude": ["node_modules"] >> tsconfig.json
    echo } >> tsconfig.json
)

:: Create src directory structure
mkdir src 2>nul
mkdir src\app 2>nul
mkdir src\components 2>nul
mkdir src\styles 2>nul

:: Create basic app page
mkdir src\app\[locale] 2>nul
echo export default function Page() { > src\app\[locale]\page.tsx
echo   return ^<div^>Welcome to DRQ Website^</div^> >> src\app\[locale]\page.tsx
echo } >> src\app\[locale]\page.tsx

:: Create root layout
echo import './globals.css' > src\app\layout.tsx
echo export default function RootLayout({ children }) { >> src\app\layout.tsx
echo   return ( >> src\app\layout.tsx
echo     ^<html^> >> src\app\layout.tsx
echo       ^<body^>{children}^</body^> >> src\app\layout.tsx
echo     ^</html^> >> src\app\layout.tsx
echo   ) >> src\app\layout.tsx
echo } >> src\app\layout.tsx

:: Create global styles
echo @tailwind base; > src\app\globals.css
echo @tailwind components; >> src\app\globals.css
echo @tailwind utilities; >> src\app\globals.css

:: 2. Run development server
call :print_colored %BLUE% "2. Starting development server..."
echo Development Server: >> %log_file%

:: Ask user if they want to start the server
set /p "start_server=Start development server? (Y/N) "
if /i "!start_server!"=="Y" (
    call npm run dev
) else (
    call :print_colored %YELLOW% "Skipping development server"
)

:: Final status
call :print_colored %GREEN% "Setup completed!"
echo.
echo Next Steps:
echo 1. Start development server: npm run dev
echo 2. Open browser: http://localhost:3000
echo 3. Begin development

goto :end

:error
echo Error occurred at: %date% %time% >> %log_file%
call :print_colored %RED% "Setup failed. Check log for details."
type %log_file%
exit /b 1

:print_colored
echo [%~1m%~2[0m
exit /b

:end
endlocal
