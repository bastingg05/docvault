@echo off
echo 🚀 Deploying DocuVault to Railway...

REM Check if Railway CLI is installed
railway --version >nul 2>&1
if %errorlevel% neq 0 (
    echo 📦 Installing Railway CLI...
    npm install -g @railway/cli
)

REM Login to Railway
echo 🔐 Logging into Railway...
railway login

REM Initialize Railway project (if not already done)
if not exist "railway.json" (
    echo ⚙️ Initializing Railway project...
    railway init
)

REM Deploy to Railway
echo 🚀 Deploying to Railway...
railway up

echo ✅ Deployment complete!
echo 🌐 Your app should be available at the Railway URL above
echo 📊 Check status at: https://railway.app/dashboard

pause
