// backend/routes/documentRoutes.js
import express from "express";
import Document from "../models/Document.js";
import protect from "../middleware/authMiddleware.js";
import multer from "multer";
import path from "path";
import fs from "fs";

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
    
    // Create document with file info
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

    res.status(201).json(doc);
  } catch (err) {
    // Clean up uploaded file if document creation fails
    if (req.file) {
      fs.unlinkSync(req.file.path);
    }
    res.status(400).json({ message: err.message });
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
    
    // Remove the file from uploads directory
    if (doc.fileName) {
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
