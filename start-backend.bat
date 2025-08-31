@echo off
echo 🚀 Starting DocuVault Backend...
echo.

cd backend

echo 📦 Installing dependencies...
npm install

echo.
echo 🔧 Starting server...
echo 📍 Server will run on: http://localhost:5000
echo 🌐 Health check: http://localhost:5000/health
echo 📊 API test: http://localhost:5000/api/users
echo.

npm start

pause
