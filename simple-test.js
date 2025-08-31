import mongoose from 'mongoose';
import User from './backend/models/User.js';
import dotenv from 'dotenv';

// Load environment variables exactly like the backend does
dotenv.config();
dotenv.config({ path: './backend/env.local' });

console.log('🔍 Environment Check:');
console.log('MONGO_URI exists:', !!process.env.MONGO_URI);
console.log('MONGO_URI length:', process.env.MONGO_URI ? process.env.MONGO_URI.length : 0);
console.log('NODE_ENV:', process.env.NODE_ENV);

// Connect to MongoDB
const connectDB = async () => {
  try {
    const mongoURI = process.env.MONGO_URI || 'mongodb://localhost:27017/docuvault';
    console.log('🔗 Connecting to MongoDB...');
    console.log('📍 URI length:', mongoURI.length);
    
    await mongoose.connect(mongoURI);
    console.log('✅ MongoDB Connected');
    return true;
  } catch (error) {
    console.error('❌ MongoDB connection error:', error.message);
    return false;
  }
};

// Check users in database
const checkUsers = async () => {
  try {
    const users = await User.find({}).select('name email createdAt');
    
    console.log(`\n📋 Found ${users.length} users in database:`);
    
    if (users.length === 0) {
      console.log('❌ No users found. Please register a user first.');
      return;
    }
    
    users.forEach((user, index) => {
      console.log(`  ${index + 1}. ${user.name} (${user.email}) - Created: ${user.createdAt.toLocaleDateString()}`);
    });
    
    console.log('\n🎯 You can use any of these credentials to test login!');
    
  } catch (error) {
    console.error('❌ Error checking users:', error);
  }
};

// Main execution
const main = async () => {
  const connected = await connectDB();
  if (connected) {
    await checkUsers();
    process.exit(0);
  } else {
    process.exit(1);
  }
};

main();
