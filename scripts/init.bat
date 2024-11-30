@echo off
setlocal enabledelayedexpansion

:: Define color codes
set "RED=31"
set "GREEN=32"
set "YELLOW=33"
set "BLUE=34"

:: Function to print colored text
call :print_colored %BLUE% "DRQ Website Initialization"
echo.

:: 1. Clean existing files
call :print_colored %BLUE% "1. Cleaning existing files..."
if exist ".next" rmdir /s /q .next
if exist "node_modules" rmdir /s /q node_modules
if exist "package-lock.json" del package-lock.json

:: 2. Create package.json with correct name
call :print_colored %BLUE% "2. Creating package.json..."

echo {> package.json
echo   "name": "drq-website",>> package.json
echo   "version": "0.1.0",>> package.json
echo   "private": true,>> package.json
echo   "scripts": {>> package.json
echo     "dev": "next dev",>> package.json
echo     "build": "next build",>> package.json
echo     "start": "next start",>> package.json
echo     "lint": "next lint">> package.json
echo   }>> package.json
echo }>> package.json

:: 3. Install dependencies
call :print_colored %BLUE% "3. Installing dependencies..."

:: Install dependencies with --save-exact to ensure specific versions
call npm install --save-exact next@13.4.19 react@18.2.0 react-dom@18.2.0
if !errorlevel! neq 0 (
    call :print_colored %RED% "Failed to install core dependencies"
    goto :error
)

call npm install --save-dev --save-exact typescript@5.0.4 @types/react@18.2.0 @types/node@18.11.17 @types/react-dom@18.2.0 autoprefixer@10.4.14 postcss@8.4.23 tailwindcss@3.3.2 eslint@8.39.0 eslint-config-next@13.4.19
if !errorlevel! neq 0 (
    call :print_colored %RED% "Failed to install dev dependencies"
    goto :error
)

call npm install --save-exact class-variance-authority@0.7.0 clsx@2.0.0 tailwind-merge@2.0.0
if !errorlevel! neq 0 (
    call :print_colored %RED% "Failed to install utility dependencies"
    goto :error
)

:: 4. Create project structure
call :print_colored %BLUE% "4. Creating project structure..."

mkdir src 2>nul
mkdir src\app 2>nul
mkdir src\app\[locale] 2>nul
mkdir src\components 2>nul
mkdir src\lib 2>nul
mkdir src\types 2>nul
mkdir src\config 2>nul
mkdir src\styles 2>nul

:: 5. Initialize Next.js files
call :print_colored %BLUE% "5. Creating Next.js files..."

:: Create tsconfig.json
echo {> tsconfig.json
echo   "compilerOptions": {>> tsconfig.json
echo     "target": "es5",>> tsconfig.json
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
echo     "paths": {>> tsconfig.json
echo       "@/*": ["./src/*"]>> tsconfig.json
echo     }>> tsconfig.json
echo   },>> tsconfig.json
echo   "include": ["next-env.d.ts", "**/*.ts", "**/*.tsx"],>> tsconfig.json
echo   "exclude": ["node_modules"]>> tsconfig.json
echo }>> tsconfig.json

:: Create next.config.js
echo /** @type {import('next').NextConfig} */> next.config.js
echo const nextConfig = {>> next.config.js
echo   reactStrictMode: true,>> next.config.js
echo }>> next.config.js
echo module.exports = nextConfig>> next.config.js

:: Initialize Tailwind CSS
echo /** @type {import('tailwindcss').Config} */> tailwind.config.js
echo module.exports = {>> tailwind.config.js
echo   content: [>> tailwind.config.js
echo     './src/**/*.{js,ts,jsx,tsx,mdx}'>> tailwind.config.js
echo   ],>> tailwind.config.js
echo   theme: {>> tailwind.config.js
echo     extend: {},>> tailwind.config.js
echo   },>> tailwind.config.js
echo   plugins: [],>> tailwind.config.js
echo }>> tailwind.config.js

:: Create PostCSS config
echo module.exports = {> postcss.config.js
echo   plugins: {>> postcss.config.js
echo     tailwindcss: {},>> postcss.config.js
echo     autoprefixer: {},>> postcss.config.js
echo   },>> postcss.config.js
echo }>> postcss.config.js

:: Create globals.css
echo @tailwind base;> src\styles\globals.css
echo @tailwind components;>> src\styles\globals.css
echo @tailwind utilities;>> src\styles\globals.css

:: Create root layout
echo import '@/styles/globals.css'> src\app\layout.tsx
echo export default function RootLayout({>> src\app\layout.tsx
echo   children,>> src\app\layout.tsx
echo }: {>> src\app\layout.tsx
echo   children: React.ReactNode>> src\app\layout.tsx
echo }) {>> src\app\layout.tsx
echo   return (>> src\app\layout.tsx
echo     ^<html lang="en"^>>> src\app\layout.tsx
echo       ^<body^>{children}^</body^>>> src\app\layout.tsx
echo     ^</html^>>> src\app\layout.tsx
echo   )>> src\app\layout.tsx
echo }>> src\app\layout.tsx

:: Create home page
echo export default function Home() {> src\app\[locale]\page.tsx
echo   return (>> src\app\[locale]\page.tsx
echo     ^<main^>>> src\app\[locale]\page.tsx
echo       ^<h1^>Welcome to DRQ Website^</h1^>>> src\app\[locale]\page.tsx
echo     ^</main^>>> src\app\[locale]\page.tsx
echo   )>> src\app\[locale]\page.tsx
echo }>> src\app\[locale]\page.tsx

:: 6. Initialize git repository
call :print_colored %BLUE% "6. Initializing git repository..."
git init

:: Create .gitignore
echo # dependencies> .gitignore
echo /node_modules>> .gitignore
echo /.pnp>> .gitignore
echo .pnp.js>> .gitignore
echo >> .gitignore
echo # testing>> .gitignore
echo /coverage>> .gitignore
echo >> .gitignore
echo # next.js>> .gitignore
echo /.next/>> .gitignore
echo /out/>> .gitignore
echo >> .gitignore
echo # production>> .gitignore
echo /build>> .gitignore
echo >> .gitignore
echo # misc>> .gitignore
echo .DS_Store>> .gitignore
echo *.pem>> .gitignore
echo >> .gitignore
echo # debug>> .gitignore
echo npm-debug.log*>> .gitignore
echo yarn-debug.log*>> .gitignore
echo yarn-error.log*>> .gitignore
echo >> .gitignore
echo # local env files>> .gitignore
echo .env*.local>> .gitignore
echo >> .gitignore
echo # vercel>> .gitignore
echo .vercel>> .gitignore
echo >> .gitignore
echo # typescript>> .gitignore
echo *.tsbuildinfo>> .gitignore
echo next-env.d.ts>> .gitignore

:: 7. Start development server
call :print_colored %GREEN% "Project initialized successfully!"
echo.
echo Next Steps:
echo 1. Start the development server: npm run dev
echo 2. Open browser: http://localhost:3000
echo 3. Begin development

:: Ask to start server
set /p "start_server=Start development server now? (Y/N) "
if /i "!start_server!"=="Y" (
    :: Add node_modules\.bin to PATH
    set "PATH=%CD%\node_modules\.bin;%PATH%"
    call npm run dev
)

goto :end

:error
call :print_colored %RED% "Initialization failed"
exit /b 1

:print_colored
echo [%~1m%~2[0m
exit /b

:end
endlocal
