import mongoose from 'mongoose';
import User from './backend/models/User.js';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();
dotenv.config({ path: './backend/env.local' });
dotenv.config({ path: './.env' });

// Connect to MongoDB
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/docuvault');
    console.log('✅ MongoDB Connected');
    return true;
  } catch (error) {
    console.error('❌ MongoDB connection error:', error);
    return false;
  }
};

// Check users in database
const checkUsers = async () => {
  try {
    const users = await User.find({}).select('name email createdAt');
    
    console.log(`📋 Found ${users.length} users in database:`);
    
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
