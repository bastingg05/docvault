# 🚀 Production Deployment Guide - Fix Network Error

## 🔍 **Current Issue:**
Your Vercel frontend is trying to connect to `localhost:5000` which causes network errors because:
- Frontend: Deployed on Vercel (`https://docvault-seven.vercel.app/`)
- Backend: Still running locally (`http://localhost:5000`)
- Result: Network error during sign-in

## 🛠️ **Solution: Deploy Backend to Production**

### **Option 1: Deploy Backend to Vercel (Recommended)**

1. **Create Backend Vercel Project:**
   ```bash
   # In your backend directory
   cd backend
   vercel --prod
   ```

2. **Set Environment Variables:**
   ```bash
   vercel env add MONGODB_URI
   vercel env add JWT_SECRET
   vercel env add NODE_ENV=production
   ```

3. **Update Frontend API URL:**
   - Go to Vercel Dashboard
   - Add environment variable: `VITE_API_URL=https://your-backend.vercel.app/api`

### **Option 2: Deploy Backend to Railway/Heroku**

1. **Railway (Free Tier Available):**
   ```bash
   # Install Railway CLI
   npm install -g @railway/cli
   
   # Deploy
   railway login
   railway init
   railway up
   ```

2. **Heroku:**
   ```bash
   # Install Heroku CLI
   heroku create your-docuvault-backend
   git push heroku main
   ```

### **Option 3: Use Your Deployment Scripts**

1. **Deploy to Your Server:**
   ```bash
   # Windows
   deploy.bat deploy
   
   # Linux/Mac
   ./deploy.sh deploy
   ```

2. **Update Frontend API URL:**
   - Set `VITE_API_URL=https://your-server-domain.com/api`

## 🔧 **Quick Fix for Testing:**

### **Update API Configuration:**
```javascript
// In frontend/src/api.js
const API_BASE_URL = import.meta.env.VITE_API_URL || "https://your-backend-url.com/api";
```

### **Set Environment Variable in Vercel:**
1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Select your DocuVault project
3. Go to Settings → Environment Variables
4. Add: `VITE_API_URL` = `https://your-backend-url.com/api`

## 📱 **After Deployment:**

Your app will have:
- ✅ **Working Sign-in** - No more network errors
- ✅ **Health Monitoring** - 99.9% uptime system
- ✅ **PWA Features** - Offline functionality
- ✅ **Auto-Recovery** - Self-healing system

## 🚨 **Immediate Action Required:**

1. **Deploy your backend** to a production server
2. **Update the API URL** in Vercel environment variables
3. **Redeploy frontend** to pick up the new configuration

## 💡 **Recommended Approach:**

1. **Use Vercel for both** frontend and backend (easiest)
2. **Set environment variables** for production URLs
3. **Test the connection** before deploying to production

This will resolve your network error and make your high-availability system fully functional! 🎯
