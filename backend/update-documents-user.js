import mongoose from 'mongoose';
import Document from './models/Document.js';
import User from './models/User.js';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();
dotenv.config({ path: './env.local' });

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

// Update documents to be associated with a real user
const updateDocumentsUser = async () => {
  try {
    // Find the first user in the database
    const user = await User.findOne();
    
    if (!user) {
      console.log('❌ No users found in database. Please register a user first.');
      return;
    }
    
    console.log(`👤 Found user: ${user.name} (${user.email})`);
    
    // Find all documents that don't have a valid user association
    const documents = await Document.find({
      $or: [
        { uploadedBy: { $exists: false } },
        { uploadedBy: null },
        { uploadedBy: { $type: "string" } } // If uploadedBy is a string instead of ObjectId
      ]
    });
    
    console.log(`📁 Found ${documents.length} documents to update`);
    
    if (documents.length === 0) {
      console.log('✅ All documents already have proper user associations');
      return;
    }
    
    // Update all documents to be associated with this user
    const result = await Document.updateMany(
      {
        $or: [
          { uploadedBy: { $exists: false } },
          { uploadedBy: null },
          { uploadedBy: { $type: "string" } }
        ]
      },
      { uploadedBy: user._id }
    );
    
    console.log(`✅ Updated ${result.modifiedCount} documents to be associated with user: ${user.name}`);
    
    // Show the updated documents
    const updatedDocs = await Document.find({ uploadedBy: user._id });
    console.log(`📋 User now has ${updatedDocs.length} documents:`);
    
    updatedDocs.forEach((doc, index) => {
      console.log(`  ${index + 1}. ${doc.title} (${doc.fileName})`);
    });
    
  } catch (error) {
    console.error('❌ Error updating documents:', error);
  }
};

// Main execution
const main = async () => {
  const connected = await connectDB();
  if (connected) {
    await updateDocumentsUser();
    process.exit(0);
  } else {
    process.exit(1);
  }
};

main();
