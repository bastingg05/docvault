// backend/routes/documentRoutes.js
import express from "express";
import Document from "../models/Document.js";
import protect from "../middleware/authMiddleware.js";
import multer from "multer";
import path from "path";
import fs from "fs";
import mongoose from "mongoose";

const router = express.Router();

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadDir = path.join(process.cwd(), 'uploads');
    // Create uploads directory if it doesn't exist
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    // Generate unique filename with timestamp
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

// Initialize GridFS bucket for environments without persistent disk (e.g., Render)
let gridFSBucket;
mongoose.connection.on('connected', () => {
  try {
    gridFSBucket = new mongoose.mongo.GridFSBucket(mongoose.connection.db, { bucketName: 'uploads' });
    console.log('✅ GridFS bucket ready');
  } catch (e) {
    console.warn('GridFS init failed:', e.message);
  }
});

// GET - get all documents for logged in user
router.get("/", protect, async (req, res) => {
  try {
    const docs = await Document.find({ uploadedBy: req.user._id }).sort({ createdAt: -1 });
    res.json(docs);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET - get single document by ID
router.get("/:id", protect, async (req, res) => {
  try {
    const doc = await Document.findById(req.params.id);
    if (!doc) {
      return res.status(404).json({ message: "Document not found" });
    }
    
    // Check if user owns this document
    if (doc.uploadedBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Access denied" });
    }
    
    res.json(doc);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST - create document metadata
router.post("/", protect, async (req, res) => {
  const { title, category, expiryDate, fileUrl, fileName, fileSize, fileType, description } = req.body;
  try {
    const doc = await Document.create({
      title, 
      category, 
      expiryDate, 
      fileUrl, 
      fileName: fileName || 'Unknown',
      fileSize: fileSize || 0,
      fileType: fileType || 'application/octet-stream',
      description: description || '',
      uploadedBy: req.user._id
    });
    res.status(201).json(doc);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// POST - upload file and create document
router.post("/upload", protect, upload.single('file'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    const { title, category, expiryDate, description } = req.body;

    // Prefer GridFS storage when available
    if (gridFSBucket) {
      const readStream = fs.createReadStream(req.file.path);
      const uploadStream = gridFSBucket.openUploadStream(req.file.originalname, {
        contentType: req.file.mimetype,
        metadata: { userId: req.user._id.toString() }
      });

      readStream
        .pipe(uploadStream)
        .on('error', (e) => {
          console.error('GridFS upload error:', e);
          try { fs.unlinkSync(req.file.path); } catch {}
          return res.status(500).json({ message: 'File storage failed' });
        })
        .on('finish', async (file) => {
          try { fs.unlinkSync(req.file.path); } catch {}
          const doc = await Document.create({
            title: title || req.file.originalname,
            category: category || 'General',
            expiryDate: expiryDate || new Date(Date.now() + 365 * 24 * 60 * 60 * 1000),
            fileUrl: `/api/documents/file/${file._id.toString()}`,
            fileId: file._id,
            fileName: req.file.originalname,
            fileSize: req.file.size,
            fileType: req.file.mimetype,
            description: description || '',
            uploadedBy: req.user._id
          });
          return res.status(201).json(doc);
        });

      return; // response will be sent in finish handler
    }

    // Fallback: keep file on disk
    const doc = await Document.create({
      title: title || req.file.originalname,
      category: category || 'General',
      expiryDate: expiryDate || new Date(Date.now() + 365 * 24 * 60 * 60 * 1000), // 1 year default
      fileUrl: `/uploads/${req.file.filename}`,
      fileName: req.file.filename,
      fileSize: req.file.size,
      fileType: req.file.mimetype,
      description: description || '',
      uploadedBy: req.user._id
    });

    return res.status(201).json(doc);
  } catch (err) {
    if (req.file && req.file.path) {
      try { fs.unlinkSync(req.file.path); } catch {}
    }
    res.status(400).json({ message: err.message });
  }
});

// Stream a file by GridFS id
router.get('/file/:id', protect, async (req, res) => {
  try {
    if (!gridFSBucket) return res.status(404).json({ message: 'File storage unavailable' });
    const id = new mongoose.Types.ObjectId(req.params.id);
    const files = await mongoose.connection.db.collection('uploads.files').find({ _id: id }).toArray();
    if (!files || files.length === 0) return res.status(404).json({ message: 'File not found' });
    res.set('Content-Type', files[0].contentType || 'application/octet-stream');
    gridFSBucket.openDownloadStream(id).pipe(res);
  } catch (e) {
    res.status(400).json({ message: e.message });
  }
});

// PUT - update document metadata
router.put("/:id", protect, async (req, res) => {
  try {
    const { title, category, expiryDate, description } = req.body;
    
    const doc = await Document.findById(req.params.id);
    if (!doc) {
      return res.status(404).json({ message: "Document not found" });
    }
    
    if (doc.uploadedBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Access denied" });
    }
    
    const updatedDoc = await Document.findByIdAndUpdate(
      req.params.id,
      { title, category, expiryDate, description },
      { new: true, runValidators: true }
    );
    
    res.json(updatedDoc);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// DELETE
router.delete("/:id", protect, async (req, res) => {
  try {
    const doc = await Document.findById(req.params.id);
    if (!doc) return res.status(404).json({ message: "Document not found" });
    if (doc.uploadedBy?.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not allowed" });
    }
    
    // Try to remove from GridFS first if present
    if (doc.fileId && gridFSBucket) {
      try {
        await gridFSBucket.delete(new mongoose.Types.ObjectId(doc.fileId));
      } catch (e) {
        console.warn('GridFS delete failed:', e.message);
      }
    } else if (doc.fileName) {
      // Remove from local uploads folder
      const filePath = path.join(process.cwd(), 'uploads', doc.fileName);
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
    }
    
    await Document.findByIdAndDelete(req.params.id);
    res.json({ message: "Document removed" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;
