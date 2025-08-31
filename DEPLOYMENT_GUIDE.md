# 🚀 DocuVault Deployment Guide

## **Platform Options**

### **1. Railway (Recommended)**
**Best for:** Full-stack apps, easy deployment, auto-deploys

**Steps:**
1. Install Railway CLI: `npm install -g @railway/cli`
2. Run: `deploy-railway.bat` (Windows) or `./deploy-railway.sh` (Mac/Linux)
3. Follow prompts to login and deploy

**Pros:** ✅ Free tier, auto-deploys, great for Node.js
**Cons:** ❌ $5 credit limit monthly

---

### **2. Render**
**Best for:** Static frontend + Node.js backend

**Steps:**
1. Go to [render.com](https://render.com)
2. Connect your GitHub repo
3. Create new Web Service (backend)
4. Create new Static Site (frontend)
5. Use `render.yaml` for automatic setup

**Pros:** ✅ Free tier, simple setup, auto-deploys
**Cons:** ❌ Sleeps after 15 min inactivity

---

### **3. Netlify**
**Best for:** Frontend deployment

**Steps:**
1. Go to [netlify.com](https://netlify.com)
2. Connect GitHub repo
3. Build command: `cd frontend && npm run build`
4. Publish directory: `frontend/dist`

**Pros:** ✅ Generous free tier, great performance
**Cons:** ❌ Frontend only (need separate backend)

---

### **4. Heroku**
**Best for:** Production apps

**Steps:**
1. Install Heroku CLI
2. Run: `heroku create docuvault-app`
3. Set environment variables
4. Deploy: `git push heroku master`

**Pros:** ✅ Very reliable, great ecosystem
**Cons:** ❌ No free tier, paid plans only

---

## **🚀 Quick Deploy Commands**

### **Railway (Windows):**
```bash
deploy-railway.bat
```

### **Railway (Mac/Linux):**
```bash
chmod +x deploy-railway.sh
./deploy-railway.sh
```

### **Manual Railway:**
```bash
npm install -g @railway/cli
railway login
railway init
railway up
```

---

## **🔧 Environment Variables**

Set these in your deployment platform:

- `MONGO_URI` - Your MongoDB connection string
- `JWT_SECRET` - Secret key for JWT tokens
- `NODE_ENV` - Set to "production"
- `PORT` - Usually auto-set by platform

---

## **📱 After Deployment**

1. **Test your API endpoints:**
   - Health: `https://your-app.railway.app/health`
   - Login: `https://your-app.railway.app/api/users/login`

2. **Update frontend config** to use new backend URL

3. **Test the full app** - login, register, etc.

---

## **🆘 Troubleshooting**

### **Common Issues:**
- **Build fails:** Check Node.js version compatibility
- **Database connection:** Verify MONGO_URI is correct
- **CORS errors:** Check frontend URL in backend CORS config

### **Get Help:**
- Check platform logs in dashboard
- Verify environment variables
- Test locally first

---

## **⭐ Recommended Approach**

1. **Start with Railway** - easiest full-stack deployment
2. **Use Render as backup** - good free alternative
3. **Consider Heroku** for production when ready

**Happy Deploying! 🎉**
