import express from "express";
import mongoose from "mongoose";
import { connectDB } from "./config/db.js";
import dotenv from "dotenv";
import cors from "cors";
import helmet from "helmet";
import pinoHttp from "pino-http";

// Initialize dotenv
dotenv.config();

// Connect to the database
connectDB();

// Initialize express app
const app = express();
app.use(cookieParser());

// Use pinoHttp for logging
app.use(pinoHttp());

// Middleware for security and body parsing
app.use(helmet()); // Adds security headers
app.use(cors()); // Enable CORS
app.use(express.json()); // For parsing application/json

// Define a simple route for testing
app.get("/", (req, res) => {
  res.send("Hello World!");
});

// Error handling middleware
app.use((err, req, res, next) => {
  res.status(500).send("Something broke!");
});

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
