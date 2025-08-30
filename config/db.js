import mongoose from 'mongoose';

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/docuvault');
    
    console.log(`MongoDB Connected: ${conn.connection.host}`);
    
    // Create default user if it doesn't exist
    const User = mongoose.model('User');
    const defaultUser = await User.findOne({ email: 'bastin123@gmail.com' });
    
    if (!defaultUser) {
      await User.create({
        name: 'Bastin',
        email: 'bastin123@gmail.com',
        password: 'test123'
      });
      console.log('Default user created: bastin123@gmail.com / test123');
    }
    
  } catch (error) {
    console.error('MongoDB connection error:', error);
    process.exit(1);
  }
};

export default connectDB;
