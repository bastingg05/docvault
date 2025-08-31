import mongoose from 'mongoose';

const connectDB = async () => {
  try {
    // Force MongoDB Atlas connection - no localhost fallback
    const mongoURI = process.env.MONGODB_URI || 
                     process.env.MONGO_URI || 
                     'mongodb+srv://bastingg05:gladwin2@bastin0.zvpymix.mongodb.net/docuvault?retryWrites=true&w=majority&appName=Bastin0';
    
    console.log('🔗 Connecting to MongoDB Atlas...');
    console.log('📍 URI length:', mongoURI.length);
    console.log('🌐 URI starts with:', mongoURI.substring(0, 20) + '...');
    
    // Connection options for better reliability
    const options = {
      maxPoolSize: 10,
      serverSelectionTimeoutMS: 10000,
      socketTimeoutMS: 45000,
      bufferCommands: false,
      retryWrites: true,
      w: 'majority'
    };
    
    const conn = await mongoose.connect(mongoURI, options);
    
    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
    console.log(`📊 Database: ${conn.connection.name}`);
    
    // Create default user if it doesn't exist
    const User = mongoose.model('User');
    const defaultUser = await User.findOne({ email: 'bastin123@gmail.com' });
    
    if (!defaultUser) {
      await User.create({
        name: 'Bastin',
        email: 'bastin123@gmail.com',
        password: 'test123'
      });
      console.log('✅ Default user created: bastin123@gmail.com / test123');
    } else {
      console.log('✅ Default user already exists');
    }
    
  } catch (error) {
    console.error('❌ MongoDB connection error:', error.message);
    console.error('🔍 Error details:', error);
    
    // Don't exit process, let it continue in demo mode
    console.log('⚠️ Running in demo mode without database connection');
    return false;
  }
};

export default connectDB;
