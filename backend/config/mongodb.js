import mongoose from "mongoose";

const connectDB = async () => {
  try {
    const mongoURI = process.env.MONGO_URI;
    
    if (!mongoURI) {
      console.error("❌ MONGO_URI environment variable is not set");
      console.log("Please set MONGO_URI in your .env file");
      return false;
    }

    // Connection options for better performance and reliability
    const options = {
      maxPoolSize: 10, // Maintain up to 10 socket connections
      serverSelectionTimeoutMS: 5000, // Keep trying to send operations for 5 seconds
      socketTimeoutMS: 45000, // Close sockets after 45 seconds of inactivity
      bufferCommands: false, // Disable mongoose buffering
    };

    const conn = await mongoose.connect(mongoURI, options);
    
    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
    console.log(`📊 Database: ${conn.connection.name}`);
    console.log(`🔌 Connection State: ${conn.connection.readyState}`);
    
    // Set global flag for health checks
    global.mongooseConnectionReady = true;
    
    // Handle connection events
    mongoose.connection.on('error', (err) => {
      console.error('❌ MongoDB connection error:', err);
      global.mongooseConnectionReady = false;
    });

    mongoose.connection.on('disconnected', () => {
      console.log('⚠️ MongoDB disconnected');
      global.mongooseConnectionReady = false;
    });

    mongoose.connection.on('reconnected', () => {
      console.log('🔄 MongoDB reconnected');
      global.mongooseConnectionReady = true;
    });

    return true;
  } catch (error) {
    console.error(`❌ MongoDB connection error: ${error.message}`);
    global.mongooseConnectionReady = false;
    return false;
  }
};

export default connectDB;
