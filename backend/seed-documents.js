import mongoose from 'mongoose';
import Document from './models/Document.js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

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

// Seed documents from existing uploads
const seedDocuments = async () => {
  try {
    const uploadsDir = path.join(__dirname, 'uploads');
    const files = fs.readdirSync(uploadsDir);
    
    console.log(`📁 Found ${files.length} files in uploads directory`);
    
    // Create a test user ID (you can replace this with a real user ID)
    const testUserId = new mongoose.Types.ObjectId();
    
    for (const file of files) {
      const filePath = path.join(uploadsDir, file);
      const stats = fs.statSync(filePath);
      
      // Determine file type
      const ext = path.extname(file).toLowerCase();
      let fileType = 'application/octet-stream';
      if (['.png', '.jpg', '.jpeg', '.gif'].includes(ext)) {
        fileType = 'image/' + ext.slice(1);
      } else if (ext === '.pdf') {
        fileType = 'application/pdf';
      } else if (['.doc', '.docx'].includes(ext)) {
        fileType = 'application/msword';
      }
      
      // Create document record
      const doc = await Document.create({
        title: path.parse(file).name,
        category: 'General',
        expiryDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000), // 1 year from now
        fileUrl: `/uploads/${file}`,
        fileName: file,
        fileSize: stats.size,
        fileType: fileType,
        description: `Auto-imported file: ${file}`,
        uploadedBy: testUserId
      });
      
      console.log(`✅ Created document: ${doc.title} (${file})`);
    }
    
    console.log('🎉 Document seeding completed!');
    
  } catch (error) {
    console.error('❌ Error seeding documents:', error);
  }
};

// Main execution
const main = async () => {
  const connected = await connectDB();
  if (connected) {
    await seedDocuments();
    process.exit(0);
  } else {
    process.exit(1);
  }
};

main();
