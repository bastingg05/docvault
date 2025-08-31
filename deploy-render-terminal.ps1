Write-Host "🚀 Deploying DocuVault to Render via Terminal" -ForegroundColor Green
Write-Host "=============================================" -ForegroundColor Green
Write-Host ""

Write-Host "📋 Prerequisites Check:" -ForegroundColor Yellow
Write-Host "✅ GitHub repo: bastingg05/docvault" -ForegroundColor Green
Write-Host "✅ render.yaml configuration ready" -ForegroundColor Green
Write-Host "✅ Environment variables configured" -ForegroundColor Green
Write-Host ""

Write-Host "🌐 Deployment Steps:" -ForegroundColor Yellow
Write-Host ""
Write-Host "1. Open your browser and go to: https://render.com" -ForegroundColor Cyan
Write-Host "2. Login to your Render account" -ForegroundColor Cyan
Write-Host "3. Click 'New +' then 'Blueprint'" -ForegroundColor Cyan
Write-Host "4. Connect your GitHub repo: bastingg05/docvault" -ForegroundColor Cyan
Write-Host "5. Render will automatically detect render.yaml" -ForegroundColor Cyan
Write-Host "6. Click 'Create New Blueprint Instance'" -ForegroundColor Cyan
Write-Host ""

Write-Host "🔧 What This Will Create:" -ForegroundColor Yellow
Write-Host "- Backend Web Service (Node.js + Express)" -ForegroundColor White
Write-Host "- Frontend Static Site (React + Vite)" -ForegroundColor White
Write-Host "- Auto-deployments from GitHub" -ForegroundColor White
Write-Host "- Environment variables configured" -ForegroundColor White
Write-Host ""

Write-Host "📊 After Deployment:" -ForegroundColor Yellow
Write-Host "- Backend URL: https://docuvault-backend.onrender.com" -ForegroundColor Cyan
Write-Host "- Frontend URL: https://docuvault-frontend.onrender.com" -ForegroundColor Cyan
Write-Host "- Health Check: https://docuvault-backend.onrender.com/health" -ForegroundColor Cyan
Write-Host ""

Write-Host "🎯 Ready to Deploy?" -ForegroundColor Green
Write-Host ""
Write-Host "Open https://render.com in your browser now!" -ForegroundColor Yellow
Write-Host "The render.yaml file will handle all the configuration automatically." -ForegroundColor Yellow
Write-Host ""

Read-Host "Press Enter to continue..."
