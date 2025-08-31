@echo off
echo 🚀 DocuVault Multi-Platform Deployment
echo ======================================
echo.
echo 📋 Choose your deployment platform:
echo.
echo 1. 🚂 Railway (Full-stack, may have service issues)
echo 2. 🌐 Render (Most reliable free tier)
echo 3. 📱 Netlify (Frontend only)
echo 4. 🆘 Manual deployment guide
echo.
set /p choice="Enter your choice (1-4): "

if "%choice%"=="1" (
    echo.
    echo 🚂 Deploying to Railway...
    echo ⚠️ Note: Railway free tier may have service issues
    echo.
    call deploy-railway.bat
) else if "%choice%"=="2" (
    echo.
    echo 🌐 Deploying to Render...
    echo ✅ Most reliable free tier option
    echo.
    call deploy-render.bat
) else if "%choice%"=="3" (
    echo.
    echo 📱 Deploying to Netlify...
    echo ⚠️ Frontend only - you'll need a separate backend
    echo.
    echo 🌐 Go to: https://netlify.com
    echo 📦 Connect GitHub repo: bastingg05/docvault
    echo 🔨 Build command: cd frontend && npm run build
    echo 📁 Publish directory: frontend/dist
    echo.
    pause
) else if "%choice%"=="4" (
    echo.
    echo 📖 Opening deployment guide...
    echo.
    echo 📋 Manual Deployment Steps:
    echo.
    echo 🚂 Railway: npm install -g @railway/cli && railway login && railway up
    echo 🌐 Render: https://render.com (connect GitHub, create Web Service)
    echo 📱 Netlify: https://netlify.com (connect GitHub, build frontend)
    echo 🚀 Heroku: heroku create && git push heroku master
    echo.
    echo 📚 See DEPLOYMENT_GUIDE.md for detailed instructions
    echo.
    pause
) else (
    echo.
    echo ❌ Invalid choice. Please run again and select 1-4.
    echo.
    pause
)

echo.
echo 🎉 Deployment process completed!
echo 📊 Check your chosen platform's dashboard for status
echo.
pause
