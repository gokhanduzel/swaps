import Swap from '../models/SwapModel.js';
import asyncHandler from 'express-async-handler';

// Create a new swap request
export const createSwapRequest = asyncHandler(async (req, res) => {
    const { item1Id, item2Id, user1Id, user2Id } = req.body;
    const swap = new Swap({ item1Id, item2Id, user1Id, user2Id, status: 'pending' });
    const createdSwap = await swap.save();
    res.status(201).json(createdSwap);
});

// Get all swap requests for the logged-in user
export const getSwapRequests = asyncHandler(async (req, res) => {
    const swaps = await Swap.find({ $or: [{ user1Id: req.user._id }, { user2Id: req.user._id }] });
    res.json(swaps);
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
        res.status(404).json({ message: 'Swap request not found' });
    }
});
