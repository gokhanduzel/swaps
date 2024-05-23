import express from 'express';
import { getUserProfile, updateUserProfile, deleteUserProfile } from '../controllers/userController.js';
import { authenticate } from '../middlewares/authMiddleware.js';

const router = express.Router();

// Get a user profile
router.get('getuser/:userId', authenticate, getUserProfile);

// Update a user profile
router.put('updateuser/:userId', authenticate, updateUserProfile);

// Delete a user profile
router.delete('deleteuser/:userId', authenticate, deleteUserProfile);

export default router;
