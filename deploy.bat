@echo off
echo 🚀 Starting JT-Lab documentation deployment...

REM Check if we're in the correct directory
if not exist "package.json" (
    echo ❌ Error: package.json not found. Make sure you're in the project root.
    pause
    exit /b 1
)

REM Check if git is configured
if not exist ".git" (
    echo ❌ Error: This is not a git repository.
    pause
    exit /b 1
)

REM Install dependencies
echo 📦 Installing dependencies...
call npm ci

REM Build project
echo 🔨 Building project...
call npm run build

REM Check if build was successful
if not exist "build" (
    echo ❌ Error: Build failed. Build folder not created.
    pause
    exit /b 1
)

REM Add all changes to git
echo 📝 Adding changes to git...
git add .

REM Create commit
echo 💾 Creating commit...
git commit -m "Deploy: Update documentation %date% %time%"

REM Push to main branch
echo 🚀 Pushing changes to GitHub...
git push origin main

echo ✅ Deployment completed! GitHub Actions will automatically deploy the site.
echo 🌐 Site will be available at: https://docs.jt-lab.com/
echo.
echo 📊 Check deployment status in the Actions section on GitHub.
pause