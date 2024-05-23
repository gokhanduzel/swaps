import express from 'express';
import { createChat, deleteChat, getMessages } from '../controllers/chatController.js';
import { authenticate } from '../middlewares/authMiddleware.js';

const router = express.Router();

// Route to create a new chat session when a swap is accepted
router.post('createchat/', authenticate, createChat);

// Route to delete a chat session
router.delete('deletechat/:chatId', authenticate, deleteChat);

router.get('getmessages/:chatId', authenticate, getMessages);

export default router;
