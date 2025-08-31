# 🚀 DocuVault V2 - Deployment Guide

## 📋 Overview

This guide will help you deploy DocuVault V2 to Render.com for free. The application consists of:
- **Backend**: Node.js/Express API server
- **Frontend**: React static site
- **Database**: MongoDB Atlas (free tier)

## 🎯 Quick Deployment Steps

### Step 1: Prepare Your Repository

1. **Fork/Clone** this repository to your GitHub account
2. **Verify** the following files exist:
   - `render.yaml` - Render deployment configuration
   - `package.json` - Backend dependencies
   - `frontend/package.json` - Frontend dependencies
   - `server.js` - Main backend server

### Step 2: Deploy to Render

1. **Go to [Render.com](https://render.com)** and sign up/login
2. **Click "New +"** → **"Blueprint"**
3. **Connect your GitHub repository**
4. **Render will automatically detect** the `render.yaml` file
5. **Click "Apply"** to start deployment

### Step 3: Wait for Deployment

- **Backend Service**: Will be deployed as a Web Service
- **Frontend Service**: Will be deployed as a Static Site
- **Total Time**: ~5-10 minutes for both services

## 🔧 Manual Deployment (Alternative)

If Blueprint deployment doesn't work, deploy manually:

### Backend Service

1. **Click "New +"** → **"Web Service"**
2. **Connect your GitHub repository**
3. **Configure:**
   - **Name**: `docuvault-v2-backend`
   - **Environment**: `Node`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
   - **Health Check Path**: `/health`

### Frontend Service

1. **Click "New +"** → **"Static Site"**
2. **Connect your GitHub repository**
3. **Configure:**
   - **Name**: `docuvault-v2-frontend`
   - **Build Command**: `cd frontend && npm install && npm run build`
   - **Publish Directory**: `frontend/dist`

## 🌐 Environment Variables

The application works with default MongoDB Atlas connection. No additional environment variables are required.

## 📊 Health Checks

- **Backend Health**: `https://your-backend-url.onrender.com/health`
- **Expected Response**: `{"status":"healthy","database":"connected"}`

## 🔗 Service URLs

After deployment, you'll get:
- **Backend URL**: `https://docuvault-v2-backend.onrender.com`
- **Frontend URL**: `https://docuvault-v2-frontend.onrender.com`

## 🧪 Testing the Deployment

### 1. Test Backend
```bash
curl https://your-backend-url.onrender.com/health
```

### 2. Test Frontend
- Open your frontend URL in a browser
- Try logging in with demo account:
  - **Email**: `bastin123@gmail.com`
  - **Password**: `test123`

### 3. Test File Upload
- Login to the application
- Go to "Add Document"
- Upload a test file (image, PDF, etc.)

## 🚨 Troubleshooting

### Backend Issues

**Problem**: Backend fails to start
**Solution**: 
- Check Render logs for errors
- Verify MongoDB Atlas connection
- Ensure all dependencies are installed

**Problem**: Health check fails
**Solution**:
- Check if server is listening on correct port
- Verify `/health` endpoint exists
- Check MongoDB connection

### Frontend Issues

**Problem**: Frontend build fails
**Solution**:
- Check if all frontend dependencies are installed
- Verify `vite.config.js` exists
- Check for syntax errors in React components

**Problem**: Frontend can't connect to backend
**Solution**:
- Verify backend URL is correct in frontend config
- Check CORS settings in backend
- Ensure backend is running and accessible

### Database Issues

**Problem**: MongoDB connection fails
**Solution**:
- Check MongoDB Atlas network access
- Verify connection string
- Ensure database cluster is running

## 📈 Monitoring

### Render Dashboard
- Monitor service health in Render dashboard
- Check logs for errors
- Monitor resource usage

### Application Health
- Backend health endpoint: `/health`
- Database connection status
- File upload functionality

## 🔄 Updates and Maintenance

### Updating the Application
1. **Push changes** to your GitHub repository
2. **Render will automatically redeploy** (if auto-deploy is enabled)
3. **Monitor deployment** in Render dashboard

### Manual Redeploy
1. Go to your service in Render dashboard
2. Click "Manual Deploy"
3. Select branch and commit

## 💰 Cost Management

### Free Tier Limits
- **Backend**: 750 hours/month (sleeps after 15 minutes of inactivity)
- **Frontend**: Always free (static site)
- **Database**: 512MB storage (MongoDB Atlas free tier)

### Scaling Up
- Upgrade to paid plans for:
  - Always-on backend (no sleep)
  - More storage and bandwidth
  - Custom domains
  - SSL certificates

## 🎉 Success Checklist

- [ ] Backend service deployed and healthy
- [ ] Frontend service deployed and accessible
- [ ] Database connection working
- [ ] User registration/login working
- [ ] File upload functionality working
- [ ] Document management working
- [ ] Health checks passing

## 🆘 Support

If you encounter issues:

1. **Check Render logs** for detailed error messages
2. **Verify all files** are present in your repository
3. **Test locally** before deploying
4. **Check this guide** for common solutions

## 🔗 Useful Links

- [Render Documentation](https://render.com/docs)
- [MongoDB Atlas](https://www.mongodb.com/atlas)
- [React Documentation](https://reactjs.org/docs)
- [Express.js Documentation](https://expressjs.com/)

---

**🎯 Your DocuVault V2 application should now be live and fully functional!**

