import express from "express";
import cors from "cors";
import multer from "multer";
import path from "path";
import fs from "fs";
import { fileURLToPath } from 'url';
import memoryDB from "./backend/config/memoryDB.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 5000;

// Middleware
app.use(cors({
  origin: true,
  credentials: true
}));

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Serve uploaded files
app.use('/uploads', express.static(path.join(__dirname, 'backend', 'uploads')));

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadDir = path.join(__dirname, 'backend', 'uploads');
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + '-' + file.originalname);
  }
});

const upload = multer({ 
  storage: storage,
  limits: {
    fileSize: 10 * 1024 * 1024 // 10MB limit
  }
});

// Simple authentication middleware
const simpleAuth = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith('Bearer ')) {
    // For demo purposes, accept any token
    req.user = { _id: 'demo-user-1' };
    next();
  } else {
    res.status(401).json({ message: 'Not authorized, no token' });
  }
};

// Health check
app.get('/health', (req, res) => {
  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    version: '2.0.0',
    database: 'memory',
    uptime: process.uptime()
  });
});

// Login endpoint
app.post('/api/users/login', (req, res) => {
  const { email, password } = req.body;
  
  if (email === 'bastin123@gmail.com' && password === 'test123') {
    const token = 'demo-token-' + Date.now();
    res.json({
      token,
      user: {
        _id: 'demo-user-1',
        email: 'bastin123@gmail.com',
        name: 'Demo User'
      }
    });
  } else {
    res.status(401).json({ message: 'Invalid credentials' });
  }
});

// Get documents
app.get('/api/documents', simpleAuth, async (req, res) => {
  try {
    const documents = await memoryDB.findDocumentsByUser(req.user._id);
    res.json(documents);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Upload document
app.post('/api/documents/upload', simpleAuth, upload.single('file'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    const { title, description } = req.body;
    
    const document = await memoryDB.createDocument({
      title: title || req.file.originalname,
      description: description || '',
      fileName: req.file.filename,
      fileSize: req.file.size,
      fileType: req.file.mimetype,
      fileUrl: `/uploads/${req.file.filename}`,
      uploadedBy: req.user._id
    });

    res.status(201).json(document);
  } catch (error) {
    // Clean up uploaded file if document creation fails
    if (req.file) {
      fs.unlinkSync(req.file.path);
    }
    res.status(400).json({ message: error.message });
  }
});

// Delete document
app.delete('/api/documents/:id', simpleAuth, async (req, res) => {
  try {
    const document = await memoryDB.findDocumentById(req.params.id);
    if (!document) {
      return res.status(404).json({ message: "Document not found" });
    }
    
    if (document.uploadedBy !== req.user._id) {
      return res.status(403).json({ message: "Not allowed" });
    }
    
    // Remove the file from uploads directory
    if (document.fileName) {
      const filePath = path.join(__dirname, 'backend', 'uploads', document.fileName);
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
    }
    
    await memoryDB.deleteDocument(req.params.id);
    res.json({ message: "Document removed" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Simple DocuVault server running on port ${PORT}`);
  console.log(`🌐 Health check: http://localhost:${PORT}/health`);
  console.log(`📁 Uploads directory: ${path.join(__dirname, 'backend', 'uploads')}`);
  console.log(`💾 Using in-memory database for immediate testing`);
  console.log(`🔑 Demo login: bastin123@gmail.com / test123`);
});
