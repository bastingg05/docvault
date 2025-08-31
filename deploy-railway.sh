#!/bin/bash

echo "🚀 Deploying DocuVault to Railway..."

# Check if Railway CLI is installed
if ! command -v railway &> /dev/null; then
    echo "📦 Installing Railway CLI..."
    npm install -g @railway/cli
fi

# Login to Railway
echo "🔐 Logging into Railway..."
railway login

# Initialize Railway project (if not already done)
if [ ! -f "railway.json" ]; then
    echo "⚙️ Initializing Railway project..."
    railway init
fi

# Deploy to Railway
echo "🚀 Deploying to Railway..."
railway up

echo "✅ Deployment complete!"
echo "🌐 Your app should be available at the Railway URL above"
echo "📊 Check status at: https://railway.app/dashboard"
