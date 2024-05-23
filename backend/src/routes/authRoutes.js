import express from 'express';
import {
  registerUser,
  loginUser,
  logoutUser,
  refreshToken
} from '../controllers/authController.js';

const router = express.Router();

// Register a new user
router.post('/register', registerUser);

// Login a user and receive an access token and a refresh token
router.post('/login', loginUser);

// Logout a user (optional implementation to clear cookies or token blacklist)
router.post('/logout', logoutUser);

// Refresh the access token using a refresh token
router.post('/refresh', refreshToken);

export default router;
