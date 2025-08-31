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

// Create sample documents for the current user
const createSampleDocuments = async () => {
  try {
    // Find the first user in the database
    const user = await User.findOne();
    
    if (!user) {
      console.log('❌ No users found in database. Please register a user first.');
      return;
    }
    
    console.log(`👤 Creating documents for user: ${user.name} (${user.email})`);
    
    // Sample documents data
    const sampleDocuments = [
      {
        title: 'Project Proposal',
        category: 'Business',
        expiryDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000), // 1 year from now
        fileUrl: '/uploads/sample-proposal.pdf',
        fileName: 'sample-proposal.pdf',
        fileSize: 245760, // 240KB
        fileType: 'application/pdf',
        description: 'Business proposal for Q4 2024 project',
        uploadedBy: user._id
      },
      {
        title: 'Team Photo',
        category: 'Images',
        expiryDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000),
        fileUrl: '/uploads/team-photo.jpg',
        fileName: 'team-photo.jpg',
        fileSize: 1024000, // 1MB
        fileType: 'image/jpeg',
        description: 'Team building event photo from last month',
        uploadedBy: user._id
      },
      {
        title: 'Meeting Notes',
        category: 'Documents',
        expiryDate: new Date(Date.now() + 180 * 24 * 60 * 60 * 1000), // 6 months
        fileUrl: '/uploads/meeting-notes.docx',
        fileName: 'meeting-notes.docx',
        fileSize: 51200, // 50KB
        fileType: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        description: 'Notes from the weekly team meeting',
        uploadedBy: user._id
      },
      {
        title: 'Budget Spreadsheet',
        category: 'Finance',
        expiryDate: new Date(Date.now() + 730 * 24 * 60 * 60 * 1000), // 2 years
        fileUrl: '/uploads/budget-2024.xlsx',
        fileName: 'budget-2024.xlsx',
        fileSize: 153600, // 150KB
        fileType: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        description: 'Annual budget planning spreadsheet',
        uploadedBy: user._id
      },
      {
        title: 'Product Screenshot',
        category: 'Design',
        expiryDate: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000), // 3 months
        fileUrl: '/uploads/product-screenshot.png',
        fileName: 'product-screenshot.png',
        fileSize: 768000, // 750KB
        fileType: 'image/png',
        description: 'Latest product interface screenshot',
        uploadedBy: user._id
      }
    ];
    
    // Create the documents
    const createdDocs = await Document.insertMany(sampleDocuments);
    
    console.log(`✅ Created ${createdDocs.length} sample documents:`);
    
    createdDocs.forEach((doc, index) => {
      console.log(`  ${index + 1}. ${doc.title} (${doc.category})`);
    });
    
    console.log(`\n📋 User now has ${createdDocs.length} documents in their account.`);
    console.log('🎯 You can now log in and see these documents in the Documents page!');
    
  } catch (error) {
    console.error('❌ Error creating sample documents:', error);
  }
};

// Main execution
const main = async () => {
  const connected = await connectDB();
  if (connected) {
    await createSampleDocuments();
    process.exit(0);
  } else {
    process.exit(1);
  }
};

main();
