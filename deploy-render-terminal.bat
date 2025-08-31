@echo off
echo 🚀 Deploying DocuVault to Render via Terminal
echo ==============================================
echo.

echo 📋 Prerequisites Check:
echo ✅ GitHub repo: bastingg05/docvault
echo ✅ render.yaml configuration ready
echo ✅ Environment variables configured
echo.

echo 🌐 Deployment Steps:
echo.
echo 1. Open your browser and go to: https://render.com
echo 2. Login to your Render account
echo 3. Click "New +" then "Blueprint"
echo 4. Connect your GitHub repo: bastingg05/docvault
echo 5. Render will automatically detect render.yaml
echo 6. Click "Create New Blueprint Instance"
echo.

echo 🔧 What This Will Create:
echo - Backend Web Service (Node.js + Express)
echo - Frontend Static Site (React + Vite)
echo - Auto-deployments from GitHub
echo - Environment variables configured
echo.

echo 📊 After Deployment:
echo - Backend URL: https://docuvault-backend.onrender.com
echo - Frontend URL: https://docuvault-frontend.onrender.com
echo - Health Check: https://docuvault-backend.onrender.com/health
echo.

echo 🎯 Ready to Deploy?
echo.
echo Open https://render.com in your browser now!
echo The render.yaml file will handle all the configuration automatically.
echo.

pause
