import Chat from '../models/ChatModel.js';
import User from '../models/UserModel.js';

// Create a new chat session
export const createChat = async (req, res) => {
    const { user1Id, user2Id } = req.body; // IDs of the users involved in the swap

    const newChat = new Chat({
        participants: [user1Id, user2Id],
        messages: []
    });

    try {
        const savedChat = await newChat.save();

        // Add chat ID to each participant's chatIds array
        await User.findByIdAndUpdate(user1Id, { $push: { chatIds: savedChat._id } });
        await User.findByIdAndUpdate(user2Id, { $push: { chatIds: savedChat._id } });

        res.status(201).json(savedChat);
    } catch (error) {
        res.status(400).json({ message: "Error creating chat session", error: error.toString() });
    }
};

// Retrieve messages from a specific chat session
export const getMessages = async (req, res) => {
    const { chatId } = req.params;

    try {
        const chat = await Chat.findById(chatId).populate('messages.senderId', 'username');
        if (!chat) {
            return res.status(404).json({ message: "Chat not found" });
        }
        res.json(chat.messages);
    } catch (error) {
        res.status(500).json({ message: "Error retrieving messages", error: error.toString() });
    }
};

// Delete a chat session
export const deleteChat = async (req, res) => {
    const { chatId } = req.params;
    const userId = req.user._id; // Assuming authentication provides userId

    try {
        const chat = await Chat.findById(chatId);
        if (!chat) {
            return res.status(404).json({ message: "Chat not found" });
        }

        // Check if the user requesting the delete is part of the chat participants
        if (!chat.participants.includes(userId.toString())) {
            return res.status(403).json({ message: "Not authorized to delete this chat" });
        }

        // Delete the chat from the database
        await Chat.findByIdAndDelete(chatId);

        // Remove the chat ID from each participant's chatIds array
        await User.updateMany(
            { _id: { $in: chat.participants } },
            { $pull: { chatIds: chatId } }
        );

        res.status(200).json({ message: "Chat deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: "Error deleting chat", error: error.toString() });
    }
};