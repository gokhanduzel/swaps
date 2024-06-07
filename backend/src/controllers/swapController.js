import Swap from "../models/SwapModel.js";
import Chat from "../models/ChatModel.js";
import User from "../models/UserModel.js";
import mongoose from "mongoose";
import asyncHandler from "express-async-handler";
import { io } from "../../app.js";

// Create a new swap request
export const createSwapRequest = asyncHandler(async (req, res) => {
  const { item1Id, item2Id, user1Id, user2Id, message } = req.body;
  const swap = new Swap({
    item1Id,
    item2Id,
    user1Id,
    user2Id,
    status: "pending",
    message,
  });
  const createdSwap = await swap.save();
  res.status(201).json(createdSwap);
});

// Get all swap requests for the logged-in user
export const getSwapRequests = asyncHandler(async (req, res) => {
  const swaps = await Swap.find({
    $or: [{ user1Id: req.user._id }, { user2Id: req.user._id }],
  })
    .populate("item1Id")
    .populate("item2Id")
    .exec();
  res.status(200).json(swaps);
});

// Update a swap request by ID
export const updateSwapRequest = asyncHandler(async (req, res) => {
  const swap = await Swap.findById(req.params.id);
  if (swap) {
    // Only allow updates to status field (e.g., accept or reject)
    swap.status = req.body.status;
    const updatedSwap = await swap.save();
    res.json(updatedSwap);
  } else {
    res.status(404).json({ message: "Swap request not found" });
  }
});

export const acceptSwapRequest = async (req, res) => {
  const { swapId } = req.params;
  const session = await mongoose.startSession();
  let transactionCommitted = false;

  try {
    session.startTransaction();
    const swap = await Swap.findById(swapId).session(session);
    if (!swap) {
      throw new Error("Swap not found");
    }

    if (swap.status === "accepted" && swap.chatId) {
      throw new Error("Swap already accepted and chat created");
    }

    const initialMessage = {
      senderId: swap.user1Id,
      text: swap.message, // Use the swap message as the initial chat message
      timestamp: new Date(),
    };

    const newChat = new Chat({
      participants: [swap.user1Id, swap.user2Id],
      messages: [initialMessage],
    });
    const savedChat = await newChat.save({ session });

    swap.status = "accepted";
    swap.chatId = savedChat._id;
    await swap.save({ session });

    // Add chat ID to both users
    await User.findByIdAndUpdate(
      swap.user1Id,
      { $push: { chatIds: savedChat._id } },
      { session }
    );
    await User.findByIdAndUpdate(
      swap.user2Id,
      { $push: { chatIds: savedChat._id } },
      { session }
    );

    await session.commitTransaction();
    transactionCommitted = true; // Mark the transaction as committed

    // Emit a real-time event to both participants
    io.to(swap.user1Id.toString()).emit("swapAccepted", {
      swap,
      chatId: savedChat._id,
    });
    io.to(swap.user2Id.toString()).emit("swapAccepted", {
      swap,
      chatId: savedChat._id,
    });

    res.status(200).json(swap);
  } catch (error) {
    if (!transactionCommitted) {
      await session.abortTransaction(); // Only abort if the transaction was not committed
    }
    console.error("Transaction error:", error); // Log the error for debugging
    res.status(400).json({ message: error.message });
  } finally {
    session.endSession(); // Ensure the session is always ended to free up resources
  }
};

// Decline a swap request
export const declineSwapRequest = asyncHandler(async (req, res) => {
  const swap = await Swap.findById(req.params.swapId);

  if (!swap) {
    res.status(404).json({ message: "Swap request not found" });
    return;
  }

  if (swap.user2Id.toString() !== req.user._id.toString()) {
    res.status(401).json({ message: "User not authorized" });
    return;
  }

  swap.status = "declined";
  await swap.save();

  res.status(200).json(swap);
});

// Delete Swap Request by ID
export const deleteSwapRequest = asyncHandler(async (req, res) => {
  try   {
    const swap = await Swap.findById(req.params.id);
    if (!swap) {
      return res.status(404).json({ message: "Swap request not found" });
    }
    await Swap.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "Swap request deleted successfully" });
  } catch (error) {
    console.error("Error deleting swap request:", error);
    res.status(500).json({ message: "Internal Server Error", error: error.message });
  }
});