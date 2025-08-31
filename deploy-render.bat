@echo off
echo 🚀 Deploying DocuVault to Render...
echo.
echo 📋 Manual Deployment Steps for Render:
echo.
echo 1. 🌐 Go to: https://render.com
echo 2. 🔐 Sign up/Login with GitHub
echo 3. 📦 Click "New +" then "Web Service"
echo 4. 🔗 Connect your GitHub repo: bastingg05/docvault
echo 5. ⚙️ Configure Backend:
echo    - Name: docuvault-backend
echo    - Environment: Node
echo    - Build Command: cd backend && npm install
echo    - Start Command: cd backend && npm start
echo    - Plan: Free
echo.
echo 6. 🔧 Set Environment Variables:
echo    - MONGO_URI: your-mongodb-connection-string
echo    - JWT_SECRET: your-jwt-secret-key
echo    - NODE_ENV: production
echo.
echo 7. 🚀 Click "Create Web Service"
echo.
echo 8. 📱 Create Frontend (Static Site):
echo    - Click "New +" then "Static Site"
echo    - Name: docuvault-frontend
echo    - Build Command: cd frontend && npm install && npm run build
echo    - Publish Directory: frontend/dist
echo.
echo ✅ Your app will auto-deploy from GitHub!
echo 🌐 Check status at: https://render.com/dashboard
echo.
pause
