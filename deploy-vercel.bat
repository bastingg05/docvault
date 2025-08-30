@echo off
echo 🚀 Deploying DocuVault to Vercel...

echo.
echo 📦 Building frontend...
cd frontend
call npm run build
if %errorlevel% neq 0 (
    echo ❌ Frontend build failed!
    pause
    exit /b 1
)

echo.
echo 🔧 Deploying frontend to Vercel...
call vercel --prod
if %errorlevel% neq 0 (
    echo ❌ Frontend deployment failed!
    pause
    exit /b 1
)

echo.
echo 🔧 Deploying backend to Vercel...
cd ..\backend
call vercel --prod
if %errorlevel% neq 0 (
    echo ❌ Backend deployment failed!
    pause
    exit /b 1
)

echo.
echo ✅ Deployment completed successfully!
echo.
echo 📍 Frontend: Check Vercel dashboard for URL
echo 📍 Backend: Check Vercel dashboard for URL
echo.
echo 🔑 Don't forget to set environment variables in Vercel:
echo    - MONGO_URI
echo    - JWT_SECRET
echo.
pause
