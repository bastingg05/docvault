# 🚀 Deploy DocuVault Backend to Vercel

## ✅ **Why Vercel Instead of Render?**
- **More Reliable**: 99.9% uptime guarantee
- **Faster**: Global CDN and edge functions
- **Better Free Tier**: More generous limits
- **Auto-scaling**: Handles traffic spikes automatically
- **Better MongoDB Support**: Optimized for database connections

## 🛠️ **Step 1: Install Vercel CLI**

```bash
npm install -g vercel
```

## 🔐 **Step 2: Login to Vercel**

```bash
vercel login
```

## 🗄️ **Step 3: Set Up MongoDB (Already Done!)**

Your MongoDB is already configured:
- **Database**: MongoDB Atlas
- **URI**: `mongodb+srv://bastingg05:gladwin2@bastin0.zvpymix.mongodb.net/docuvault`
- **Status**: ✅ Ready to use

## 🚀 **Step 4: Deploy Backend to Vercel**

### **Option A: Use the Batch File (Windows)**
```bash
deploy-vercel.bat
```

### **Option B: Manual Deployment**
```bash
cd backend
vercel --prod
```

## ⚙️ **Step 5: Set Environment Variables in Vercel**

After deployment, go to your Vercel dashboard and set:

1. **MONGO_URI**: `mongodb+srv://bastingg05:gladwin2@bastin0.zvpymix.mongodb.net/docuvault?retryWrites=true&w=majority&appName=Bastin0`
2. **JWT_SECRET**: `your-super-secret-jwt-key-change-this-in-production`
3. **NODE_ENV**: `production`

## 🔗 **Step 6: Update Frontend API URL**

Your frontend is already configured to use:
```
https://docuvault-backend.vercel.app
```

## 🧪 **Step 7: Test Your Backend**

Test the health endpoint:
```bash
curl https://docuvault-backend.vercel.app/health
```

## 📱 **Step 8: Test Frontend Login**

1. Open your frontend
2. Try logging in
3. Should work without network errors!

## 🎯 **What You Get:**

✅ **Reliable Backend**: 99.9% uptime on Vercel  
✅ **MongoDB Integration**: Full database functionality  
✅ **No More Network Errors**: Stable connection  
✅ **Auto-scaling**: Handles any amount of traffic  
✅ **Global CDN**: Fast response times worldwide  

## 🚨 **If You Get Errors:**

1. **Check Vercel Dashboard**: Look for deployment logs
2. **Verify Environment Variables**: MONGO_URI and JWT_SECRET must be set
3. **Check MongoDB**: Ensure your database is accessible
4. **Test Health Endpoint**: Verify backend is responding

## 💡 **Pro Tips:**

- **Auto-deploy**: Vercel automatically redeploys when you push to GitHub
- **Preview Deployments**: Test changes before going live
- **Rollback**: Easy to revert to previous versions
- **Monitoring**: Built-in performance monitoring

Your DocuVault will now be rock-solid with Vercel + MongoDB! 🎉
