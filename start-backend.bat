@echo off
echo 🚀 Starting DocuVault Backend Server...
echo.

cd backend

echo 📦 Installing dependencies...
npm install

echo.
echo 🚀 Starting server on http://localhost:5000...
echo.
echo Press Ctrl+C to stop the server
echo.

npm start

pause
