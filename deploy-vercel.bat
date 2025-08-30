@echo off
echo 🚀 Deploying DocuVault Backend to Vercel...
echo.

cd backend

echo 📦 Installing dependencies...
npm install

echo.
echo 🚀 Deploying to Vercel...
echo.

vercel --prod

echo.
echo ✅ Deployment complete!
echo 🌐 Your backend is now available at: https://docuvault-backend.vercel.app
echo.

pause
