import Chat from "../models/ChatModel.js";
import User from "../models/UserModel.js";
import { io } from "../../app.js"; // Import the io instance

// Create a new chat session
export const createChat = async (req, res) => {
  const { user1Id, user2Id } = req.body; // IDs of the users involved in the swap

  const newChat = new Chat({
    participants: [user1Id, user2Id],
    messages: [],
  });

  try {
    const savedChat = await newChat.save();

    // Add chat ID to each participant's chatIds array
    await User.findByIdAndUpdate(user1Id, {
      $push: { chatIds: savedChat._id },
    });
    await User.findByIdAndUpdate(user2Id, {
      $push: { chatIds: savedChat._id },
    });

    // Emit event to notify users of the new chat
    io.to(user1Id).emit("newChat", savedChat);
    io.to(user2Id).emit("newChat", savedChat);

    res.status(201).json(savedChat);
  } catch (error) {
    res.status(400).json({
      message: "Error creating chat session",
      error: error.toString(),
    });
  }
};

export const getMessages = async (req, res) => {
  const { chatId } = req.params;
  try {
    const chat = await Chat.findById(chatId).populate("messages.senderId");
    if (!chat) {
      return res.status(404).json({ message: "Chat not found" });
    }
    res.json(chat.messages);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error retrieving messages", error: error.toString() });
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
      return res
        .status(403)
        .json({ message: "Not authorized to delete this chat" });
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
    res
      .status(500)
      .json({ message: "Error deleting chat", error: error.toString() });
  }
};

// Add a new message to a chat
export const addMessage = async (req, res) => {
  const { chatId } = req.params;
  const { senderId, text } = req.body;

  if (!text.trim()) {
    return res.status(400).json({ message: "Message text cannot be empty" });
  }

  try {
    const chat = await Chat.findById(chatId);
    if (!chat) {
      return res.status(404).json({ message: "Chat not found" });
    }

    const newMessage = { senderId, text, timestamp: new Date() };
    chat.messages.push(newMessage);
    await chat.save();

    // Construct minimal message data for clients
    const messageForClients = {
      text: newMessage.text,
      senderId: newMessage.senderId,
      timestamp: newMessage.timestamp,
      chatId: chat._id
    };

    // Emit the message to all participants in the chat
    chat.participants.forEach(participant => {
      io.to(participant.toString()).emit("newMessage", messageForClients);
    });

    res.status(201).json(messageForClients);
  } catch (error) {
    console.error("Failed to add message:", error);
    res.status(500).json({ message: "Error adding message", error: error.toString() });
  }
};

