import mongoose from 'mongoose';
import User from './backend/models/User.js';
import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';

// Load environment variables exactly like the backend does
dotenv.config();
dotenv.config({ path: './backend/env.local' });
dotenv.config({ path: './.env' });

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

// Create test user
const createTestUser = async () => {
  try {
    // Check if user already exists
    const existingUser = await User.findOne({ email: 'test@example.com' });
    
    if (existingUser) {
      console.log('👤 Test user already exists:');
      console.log(`   Name: ${existingUser.name}`);
      console.log(`   Email: ${existingUser.email}`);
      console.log(`   Created: ${existingUser.createdAt.toLocaleDateString()}`);
      return;
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash('testpass123', salt);

    // Create new user
    const newUser = new User({
      name: 'Test User',
      email: 'test@example.com',
      password: hashedPassword
    });

    await newUser.save();
    
    console.log('✅ Test user created successfully:');
    console.log(`   Name: ${newUser.name}`);
    console.log(`   Email: ${newUser.email}`);
    console.log(`   Password: testpass123`);
    console.log(`   Created: ${newUser.createdAt.toLocaleDateString()}`);
    
  } catch (error) {
    console.error('❌ Error creating test user:', error);
  }
};

// Main execution
const main = async () => {
  const connected = await connectDB();
  if (connected) {
    await createTestUser();
    process.exit(0);
  } else {
    process.exit(1);
  }
};

main();
