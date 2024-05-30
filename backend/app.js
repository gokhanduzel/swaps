import express from "express";
import mongoose from "mongoose";
import { connectDB } from "./src/config/db.js";
import dotenv from "dotenv";
import cors from "cors";
import helmet from "helmet";
import pinoHttp from "pino-http";
import cookieParser from "cookie-parser";
import { createServer } from "http";
import { Server } from "socket.io";

import authRoutes from "./src/routes/authRoutes.js";
import itemRoutes from "./src/routes/itemRoutes.js";
import swapRoutes from "./src/routes/swapRoutes.js";
import chatRoutes from "./src/routes/chatRoutes.js";
import userRoutes from "./src/routes/userRoutes.js";

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
app.use(cors({
  origin: 'http://localhost:5173', // replace with your application's origin
  credentials: true
}));
app.use(express.json()); // For parsing application/json

app.use('/api/auth', authRoutes);
app.use('/api/items', itemRoutes);
app.use('/api/swaps', swapRoutes);
app.use('/api/chats', chatRoutes);
app.use('/api/users', userRoutes);

// Create HTTP server
const server = createServer(app);

// Initialize Socket.io
const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST"]
  }
});

// Handle Socket.io connections
io.on('connection', (socket) => {
  console.log('New client connected:', socket.id);

  socket.on('disconnect', () => {
    console.log('Client disconnected:', socket.id);
  });

  // Handle custom events here
  socket.on('sendMessage', (messageData) => {
    console.log('Message received:', messageData);
    io.to(messageData.chatId).emit('receiveMessage', messageData);
  });
});

// Start the server
const PORT = process.env.PORT || 5001;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));

export { io }; // Export io for use in other files
