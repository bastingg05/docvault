import mongoose from "mongoose";

const connectDB = async () => {
  try {
    // Try to get MONGO_URI from environment
    let mongoURI = process.env.MONGO_URI;
    
    // If no MONGO_URI, use local MongoDB
    if (!mongoURI) {
      console.log("⚠️ No MONGO_URI found in environment variables");
      console.log("🔧 Using local MongoDB connection...");
      
      // Use local MongoDB instance
      mongoURI = "mongodb://localhost:27017/docuvault";
    }

    console.log("🔗 Attempting MongoDB connection...");
    console.log("📍 URI length:", mongoURI.length);
    
    const conn = await mongoose.connect(mongoURI, {
      maxPoolSize: 10,
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
    });
    
    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
    return true;
  } catch (error) {
    console.error(`❌ MongoDB connection error: ${error.message}`);
    console.log("⚠️ Running in demo mode without database connection");
    return false;
  }
};

export default connectDB;
