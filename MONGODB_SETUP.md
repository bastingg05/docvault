# MongoDB Setup Guide for DocuVault

## 🚀 Quick Setup

### 1. Fix Your Current MongoDB Connection

Your current `.env` file has a placeholder password. You need to:

1. **Get your actual MongoDB password** from your MongoDB Atlas account
2. **Replace `<db_password>`** in `backend/.env` with your real password
3. **Update the database name** in the URI to `docuvault`

**Example of correct MONGO_URI:**
```
MONGO_URI=mongodb+srv://bastingg05:YourActualPassword123@bastin0.zvpymix.mongodb.net/docuvault?retryWrites=true&w=majority&appName=Bastin0
```

### 2. Test Local Connection

After fixing the password:

```bash
cd backend
npm run dev
```

You should see:
```
✅ MongoDB Connected: bastin0.zvpymix.mongodb.net
📊 Database: docuvault
🔌 Connection State: 1
```

## 🌐 Vercel Deployment Setup

### 1. Backend Deployment

1. **Deploy backend to Vercel:**
   ```bash
   cd backend
   vercel --prod
   ```

2. **Set environment variables in Vercel dashboard:**
   - `MONGO_URI`: Your MongoDB connection string
   - `JWT_SECRET`: A strong random string for JWT tokens
   - `NODE_ENV`: production

### 2. Frontend Deployment

1. **Update the backend URL** in `frontend/src/config.js`:
   ```javascript
   production: {
     apiUrl: "https://your-actual-backend-url.vercel.app", // Replace with your real backend URL
     environment: "production"
   }
   ```

2. **Deploy frontend to Vercel:**
   ```bash
   cd frontend
   vercel --prod
   ```

## 🔧 MongoDB Atlas Configuration

### 1. Network Access
- Go to MongoDB Atlas → Network Access
- Add your IP address or `0.0.0.0/0` for all IPs (for production)

### 2. Database User
- Go to MongoDB Atlas → Database Access
- Ensure your user has read/write permissions
- Use a strong password

### 3. Database Name
- Create a database named `docuvault` in your cluster
- Collections will be created automatically by Mongoose

## 📊 Health Check Endpoints

After setup, test these endpoints:

- **Health**: `http://localhost:5000/health`
- **Users**: `http://localhost:5000/api/users`
- **Documents**: `http://localhost:5000/api/documents` (requires auth)

## 🚨 Troubleshooting

### Common Issues:

1. **"bad auth : authentication failed"**
   - Check your password in the MONGO_URI
   - Ensure username is correct

2. **"ECONNREFUSED"**
   - Check if MongoDB Atlas is accessible
   - Verify network access settings

3. **"MongoServerSelectionError"**
   - Check your internet connection
   - Verify the cluster is running

### Debug Commands:

```bash
# Test MongoDB connection
curl http://localhost:5000/health

# Check server logs
cd backend
npm run dev
```

## 🔐 Security Best Practices

1. **Never commit `.env` files** to git
2. **Use strong JWT secrets** (32+ characters)
3. **Limit MongoDB network access** to necessary IPs
4. **Use environment variables** for all sensitive data
5. **Regularly rotate passwords** and secrets

## 📱 Testing Your Setup

1. **Local Testing:**
   - Open `test-connection.html` in your browser
   - Should show all green checkmarks

2. **Production Testing:**
   - Deploy to Vercel
   - Test all endpoints from the production URL
   - Verify MongoDB connection works in production

## 🎯 Next Steps

After successful setup:

1. ✅ Test local development
2. ✅ Deploy backend to Vercel
3. ✅ Update frontend config with backend URL
4. ✅ Deploy frontend to Vercel
5. ✅ Test production deployment
6. ✅ Monitor MongoDB connection in production

---

**Need Help?** Check the MongoDB Atlas logs and Vercel deployment logs for detailed error messages.
