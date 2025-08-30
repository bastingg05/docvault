#!/bin/bash

echo "🚀 Deploying DocuVault to Render..."

# Check if we're in the right directory
if [ ! -f "render.yaml" ]; then
    echo "❌ Error: render.yaml not found. Make sure you're in the project root."
    exit 1
fi

# Check if backend directory exists
if [ ! -d "backend" ]; then
    echo "❌ Error: backend directory not found."
    exit 1
fi

# Check if server.js exists
if [ ! -f "backend/server.js" ]; then
    echo "❌ Error: backend/server.js not found."
    exit 1
fi

echo "✅ All files present. Ready for deployment."

# Instructions for manual deployment
echo ""
echo "📋 Manual Deployment Steps:"
echo "1. Go to: https://dashboard.render.com"
echo "2. Click 'New +' → 'Web Service'"
echo "3. Connect your GitHub repository"
echo "4. Render will automatically detect render.yaml"
echo "5. Click 'Create Web Service'"
echo ""
echo "🔧 Environment Variables (should be auto-set from render.yaml):"
echo "   NODE_ENV=production"
echo "   MONGO_URI=mongodb+srv://bastingg05:gladwin2@bastin0.zvpymix.mongodb.net/docuvault?retryWrites=true&w=majority&appName=Bastin0"
echo "   JWT_SECRET=your-super-secret-jwt-key-change-this-in-production"
echo ""
echo "🎯 After deployment, test:"
echo "   https://your-service-name.onrender.com/health"
echo "   https://your-service-name.onrender.com/api/users/"
echo ""
echo "✅ Deployment script completed!"
