// backend/models/Document.js
import mongoose from "mongoose";

const documentSchema = new mongoose.Schema({
  title: { type: String, required: true },
  category: { type: String, required: true },
  expiryDate: { type: Date, required: true },
  fileUrl: { type: String, required: true },
  uploadedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" }, // owner
}, { timestamps: true });

const Document = mongoose.model("Document", documentSchema);
export default Document;
