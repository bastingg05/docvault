// backend/seed.js
import mongoose from "mongoose";
import dotenv from "dotenv";
import Document from "./models/Document.js";

dotenv.config({ path: "../.env" }); // loads .env file

// Sample fake documents
const sampleDocs = [
  {
    title: "College ID Card",
    category: "Identity",
    expiryDate: new Date("2026-05-15"),
    fileUrl: "/uploads/college_id.pdf",
  },
  {
    title: "Health Insurance",
    category: "Insurance",
    expiryDate: new Date("2025-12-31"),
    fileUrl: "/uploads/insurance.pdf",
  },
  {
    title: "Driving License",
    category: "Identity",
    expiryDate: new Date("2027-01-20"),
    fileUrl: "/uploads/license.pdf",
  },
  {
    title: "Property Tax Receipt",
    category: "Bills",
    expiryDate: new Date("2026-03-01"),
    fileUrl: "/uploads/property_tax.pdf",
  },
];

// Insert into DB
async function seedDatabase() {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    // Clear old docs
    await Document.deleteMany({});
    console.log("✅ Old documents cleared");

    // Insert fake docs
    await Document.insertMany(sampleDocs);
    console.log("✅ Sample documents inserted");

    mongoose.connection.close();
  } catch (err) {
    console.error("❌ Error seeding database:", err);
    mongoose.connection.close();
  }
}

seedDatabase();
