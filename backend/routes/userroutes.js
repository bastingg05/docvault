// backend/routes/userRoutes.js
import express from "express";
import mongoose from "mongoose";
import User from "../models/User.js";
import generateToken from "../utils/generateToken.js";

const router = express.Router();

// Test route - explicit path
router.get("/test", (req, res) => {
  res.json({ message: "User routes test endpoint working", timestamp: new Date().toISOString() });
});

// Test route - root path
router.get("/", (req, res) => {
  res.json({ message: "User routes are working", timestamp: new Date().toISOString() });
});

// register
router.post("/register", async (req, res) => {
  const { name, email, password } = req.body;
  try {
    // Check if MongoDB is connected
    if (mongoose.connection.readyState !== 1) {
      // Demo mode - create a mock user
      const mockUser = {
        _id: Date.now().toString(),
        name,
        email,
        password: "hashed_password"
      };
      res.status(201).json({
        _id: mockUser._id,
        name: mockUser.name,
        email: mockUser.email,
        token: generateToken(mockUser._id),
      });
      return;
    }

    const exists = await User.findOne({ email });
    if (exists) return res.status(400).json({ message: "User already exists" });

    const user = await User.create({ name, email, password });
    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      token: generateToken(user._id),
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// login
router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  try {
    // Check if MongoDB is connected
    if (mongoose.connection.readyState !== 1) {
      // Demo mode - accept any email/password combination
      const mockUser = {
        _id: Date.now().toString(),
        name: email.split('@')[0], // Use email prefix as name
        email,
        password: "hashed_password"
      };
      res.json({
        _id: mockUser._id,
        name: mockUser.name,
        email: mockUser.email,
        token: generateToken(mockUser._id),
      });
      return;
    }

    const user = await User.findOne({ email });
    if (user && (await user.matchPassword(password))) {
      res.json({
        _id: user._id,
        name: user.name,
        email: user.email,
        token: generateToken(user._id),
      });
    } else {
      res.status(401).json({ message: "Invalid email or password" });
    }
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;
