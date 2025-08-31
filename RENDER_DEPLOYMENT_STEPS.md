# 🚀 Deploy DocuVault to Render - Complete Guide

## **📋 Prerequisites**
✅ GitHub repository: `bastingg05/docvault`  
✅ Latest code pushed to master branch  
✅ MongoDB Atlas database ready  

---

## **🌐 Step 1: Access Render**
1. **Open Browser:** Go to [render.com](https://render.com)
2. **Sign Up/Login:** Use your GitHub account
3. **Dashboard:** You'll see the Render dashboard

---

## **🔧 Step 2: Create Backend Service**

### **2.1 Start Backend Creation**
- Click **"New +"** button (top right)
- Select **"Web Service"**
- Click **"Connect account"** if not connected to GitHub

### **2.2 Connect Repository**
- **Repository:** `bastingg05/docvault`
- **Branch:** `master`
- Click **"Connect"**

### **2.3 Configure Backend**
Fill in these exact values:

| Field | Value |
|-------|-------|
| **Name** | `docuvault-backend` |
| **Environment** | `Node` |
| **Region** | `Oregon (US West)` |
| **Branch** | `master` |
| **Plan** | `Free` |

### **2.4 Build & Deploy Settings**
| Field | Value |
|-------|-------|
| **Build Command** | `cd backend && npm install` |
| **Start Command** | `cd backend && npm start` |
| **Root Directory** | Leave empty |

### **2.5 Environment Variables**
Click **"Advanced"** → **"Add Environment Variable"**

| Key | Value |
|-----|-------|
| `MONGO_URI` | `mongodb+srv://bastingg05:gladwin2@bastin0.zvpymix.mongodb.net/docuvault?retryWrites=true&w=majority&appName=Bastin0` |
| `JWT_SECRET` | `your-super-secret-jwt-key-change-this-in-production` |
| `NODE_ENV` | `production` |

### **2.6 Create Backend**
- Click **"Create Web Service"**
- **Wait for deployment** (2-5 minutes)
- **Note the URL:** `https://docuvault-backend.onrender.com`

---

## **📱 Step 3: Create Frontend Service**

### **3.1 Start Frontend Creation**
- Click **"New +"** button again
- Select **"Static Site"**
- Connect the same repository: `bastingg05/docvault`

### **3.2 Configure Frontend**
Fill in these exact values:

| Field | Value |
|-------|-------|
| **Name** | `docuvault-frontend` |
| **Branch** | `master` |
| **Plan** | `Free` |

### **3.3 Build Settings**
| Field | Value |
|-------|-------|
| **Build Command** | `cd frontend && npm install && npm run build` |
| **Publish Directory** | `frontend/dist` |
| **Root Directory** | Leave empty |

### **3.4 Environment Variables**
Click **"Advanced"** → **"Add Environment Variable"**

| Key | Value |
|-----|-------|
| `VITE_API_URL` | `https://docuvault-backend.onrender.com` |

**⚠️ Important:** Replace with your actual backend URL from Step 2.6

### **3.5 Create Frontend**
- Click **"Create Static Site"**
- **Wait for deployment** (1-3 minutes)
- **Note the URL:** `https://docuvault-frontend.onrender.com`

---

## **✅ Step 4: Test Your Deployment**

### **4.1 Test Backend**
- **Health Check:** Visit `https://docuvault-backend.onrender.com/health`
- **Expected:** JSON response with status "healthy"

### **4.2 Test Frontend**
- **Main App:** Visit `https://docuvault-frontend.onrender.com`
- **Expected:** DocuVault login page loads

### **4.3 Test Full Flow**
1. **Register** a new account
2. **Login** with credentials
3. **Upload** a document
4. **Verify** everything works

---

## **🔧 Step 5: Troubleshooting**

### **If Backend Fails:**
- Check **Logs** in Render dashboard
- Verify **Environment Variables** are correct
- Ensure **MongoDB URI** is accessible
- Check **Build Command** syntax

### **If Frontend Fails:**
- Check **Build Logs**
- Verify **API URL** environment variable
- Ensure **Publish Directory** is correct
- Check **Node.js version** compatibility

### **Common Issues:**
- **Build timeout:** Increase build timeout in settings
- **Memory limit:** Upgrade to paid plan if needed
- **Port issues:** Render handles ports automatically

---

## **📊 Step 6: Monitor & Maintain**

### **6.1 Auto-Deployments**
- ✅ **Automatic:** Every push to master triggers deployment
- ✅ **Rollback:** Easy to revert to previous versions
- ✅ **Logs:** Real-time deployment and runtime logs

### **6.2 Performance**
- **Free tier:** Sleeps after 15 minutes of inactivity
- **First request:** May take 30-60 seconds to wake up
- **Subsequent requests:** Fast response times

### **6.3 Scaling**
- **Free tier:** 750 hours/month
- **Upgrade:** $7/month for always-on service
- **Custom domains:** Available on all plans

---

## **🎯 Success Checklist**

- [ ] Backend service created and running
- [ ] Frontend service created and running
- [ ] Environment variables set correctly
- [ ] Health check endpoint responding
- [ ] Frontend can connect to backend
- [ ] User registration/login working
- [ ] Document upload/management working

---

## **🚀 Your Live URLs**

**Backend API:** `https://docuvault-backend.onrender.com`  
**Frontend App:** `https://docuvault-frontend.onrender.com`  
**Health Check:** `https://docuvault-backend.onrender.com/health`

---

## **💡 Pro Tips**

1. **Bookmark** your Render dashboard
2. **Monitor** deployment logs for any issues
3. **Test** all features after deployment
4. **Share** your live app URL with others
5. **Consider** upgrading to paid plan for production use

---

**🎉 Congratulations! Your DocuVault is now live on Render!**
