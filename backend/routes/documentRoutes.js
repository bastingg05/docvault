// backend/routes/documentRoutes.js
import express from "express";
import Document from "../models/Document.js";
import protect from "../middleware/authMiddleware.js";

const router = express.Router();

// GET - get all documents for logged in user
router.get("/", protect, async (req, res) => {
  try {
    const docs = await Document.find({ uploadedBy: req.user._id }).sort({ createdAt: -1 });
    res.json(docs);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST - create document metadata (fileUrl must be provided client-side for now)
router.post("/", protect, async (req, res) => {
  const { title, category, expiryDate, fileUrl } = req.body;
  try {
    const doc = await Document.create({
      title, category, expiryDate, fileUrl, uploadedBy: req.user._id
    });
    res.status(201).json(doc);
  } catch (err) {
    res.status(400).json({ message: err.message });
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
    await doc.remove();
    res.json({ message: "Document removed" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;
