import express from 'express';
import {
  registerUser,
  loginUser,
  logoutUser,
  refreshToken,
  checkAuth,
  getUserData
} from '../controllers/authController.js';
import { authenticate } from '../middlewares/authMiddleware.js';

const router = express.Router();

// Get a user profile
router.get('/getuserdata/:userId', authenticate, getUserData);

// Register a new user
router.post('/register', registerUser);

// Login a user and receive an access token and a refresh token
router.post('/login', loginUser);

// Logout a user (optional implementation to clear cookies or token blacklist)
router.post('/logout', logoutUser);

// Refresh the access token using a refresh token
router.post('/refresh', refreshToken);

// Check if the user is authenticated
router.get('/checkauth', authenticate, checkAuth);


export default router;
