import express from 'express';
import { createChat, deleteChat, getMessages, addMessage } from '../controllers/chatController.js';
import { authenticate } from '../middlewares/authMiddleware.js';

const router = express.Router();

// Route to create a new chat session when a swap is accepted
router.post('/createchat', authenticate, createChat);

// Route to delete a chat session
router.delete('/deletechat/:chatId', authenticate, deleteChat);

// Route to retrieve messages from a chat session
router.get('/getmessages/:chatId', authenticate, getMessages);

// Route to add a new message to a chat session
router.post('/addmessage/:chatId', authenticate, addMessage);

export default router;
