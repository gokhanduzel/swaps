import Item from "../models/ItemModel.js";
import User from "../models/UserModel.js";
import asyncHandler from "express-async-handler";
import mongoose from "mongoose";

// Create a new item
export const createItem = asyncHandler(async (req, res) => {
  const { title, description, tags, desiredItems, visible } = req.body;

  // Data validation
  if (
    !title ||
    !description ||
    !tags ||
    !desiredItems ||
    visible === undefined
  ) {
    res.status(400);
    throw new Error("Missing required fields");
  }

  const item = new Item({
    ownerId: req.user._id,
    title,
    description,
    tags,
    desiredItems,
    visible,
  });

  let createdItem;
  try {
    console.log(item); // Add this line
    createdItem = await item.save();
  } catch (error) {
    console.error(error);
    res.status(500);
    throw new Error("Failed to create item");
  }

  let updatedUser;
  try {
    updatedUser = await User.findByIdAndUpdate(
      req.user._id,
      {
        $push: { itemsPosted: createdItem._id },
      },
      { new: true }
    ); // Return the updated user
  } catch (error) {
    res.status(500);
    throw new Error("Failed to update user");
  }

  res.status(201).json({
    message: "Item created successfully",
    item: createdItem,
    user: updatedUser,
  });
});

// Get all items
export const getItems = asyncHandler(async (req, res) => {
  const items = await Item.find({});
  res.json(items);
});

// Get a single item by ID
export const getItem = asyncHandler(async (req, res) => {
  const item = await Item.findById(req.params.id);
  if (item) {
    res.json(item);
  } else {
    res.status(404).json({ message: "Item not found" });
  }
});

// Get all items with visible set to true
export const getVisibleItems = asyncHandler(async (req, res) => {
  const items = await Item.find({ visible: true });
  if (!items) {
    res.status(404).json({ message: "No items found" });
    return;
  }
  res.json(items);
});

// Get all items posted by a user
export const getItemsByUser = asyncHandler(async (req, res) => {
  const items = await Item.find({ ownerId: req.params.id });
  if (!items) {
    res.status(404).json({ message: "No items found" });
    return;
  }
  res.json(items);
});

// Update an item by ID
export const updateItem = asyncHandler(async (req, res) => {
  const { title, description, tags, desiredItems, visible } = req.body;
  const item = await Item.findById(req.params.id);

  if (item) {
    item.title = title;
    item.description = description;
    item.tags = tags;
    item.desiredItems = desiredItems;
    item.visible = visible;

    const updatedItem = await item.save();
    res.json(updatedItem);
  } else {
    res.status(404).json({ message: "Item not found" });
  }
});

// Delete an item by ID
export const deleteItem = asyncHandler(async (req, res) => {
  try {
    const item = await Item.findById(req.params.id);

    if (!item) {
      return res.status(404).json({ message: "Item not found" });
    }

    // Check if the logged-in user is the owner of the item
    if (item.ownerId.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: "User not authorized" });
    }

    await Item.findByIdAndDelete(req.params.id);

    // After deleting the item, remove it from the user's itemsPosted array
    await User.findByIdAndUpdate(req.user._id, {
      $pull: { itemsPosted: new mongoose.Types.ObjectId(req.params.id) },
    });

    res
      .status(200)
      .json({ message: "Item deleted successfully", itemId: req.params.id });
  } catch (error) {
    console.error("Error deleting item:", error);
    res
      .status(500)
      .json({ message: "Internal Server Error", error: error.message });
  }
});
