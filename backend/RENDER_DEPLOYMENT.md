# 🚀 Render.com Deployment Guide

## Quick Deploy to Render.com

### Step 1: Connect Your GitHub Repository
1. Go to [render.com](https://render.com)
2. Sign up/Login with your GitHub account
3. Click "New +" → "Web Service"
4. Connect your GitHub repository: `bastin-georges/docuvault`

### Step 2: Configure the Service
- **Name**: `docuvault-backend`
- **Environment**: `Node`
- **Build Command**: `npm install`
- **Start Command**: `npm run mock`
- **Health Check Path**: `/health`

### Step 3: Set Environment Variables
- `NODE_ENV`: `production`
- `JWT_SECRET`: `your-secret-key-here` (or any secure string)

### Step 4: Deploy
Click "Create Web Service" and wait for deployment.

### Step 5: Get Your Backend URL
Once deployed, you'll get a URL like:
`https://docuvault-backend.onrender.com`

### Step 6: Update Frontend
Update your frontend `api.js` to use this new backend URL.

## Test Your Backend
- Health Check: `GET /health`
- Login: `POST /api/users/login` (use: bastin123@gmail.com / test123)
- Documents: `GET /api/documents`

## Why Render.com?
- ✅ Perfect for Node.js backends
- ✅ Free tier available
- ✅ Automatic deployments from GitHub
- ✅ Built-in health checks
- ✅ No authentication redirects like Vercel
