import Item from "../models/ItemModel.js";
import User from "../models/UserModel.js";
import asyncHandler from "express-async-handler";

// Create a new item
export const createItem = asyncHandler(async (req, res) => {
  const { title, description, images, category, desiredItems, visible } =
    req.body;
  const item = new Item({
    ownerId: req.user._id,
    title,
    description,
    images,
    category,
    desiredItems,
    visible,
  });

  const createdItem = await item.save();

  await User.findByIdAndUpdate(req.user._id, {
    $push: { itemsPosted: createdItem._id },
  });

  res.status(201).json(createdItem);
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

// Update an item by ID
export const updateItem = asyncHandler(async (req, res) => {
  const { title, description, images, category, desiredItems, visible } =
    req.body;
  const item = await Item.findById(req.params.id);

  if (item) {
    item.title = title;
    item.description = description;
    item.images = images;
    item.category = category;
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
  const item = await Item.findById(req.params.id);

  if (!item) {
    res.status(404).json({ message: "Item not found" });
    return;
  }

  // Check if the logged-in user is the owner of the item
  if (item.ownerId.toString() !== req.user._id.toString()) {
    res.status(401).json({ message: "User not authorized" });
    return;
  }

  await Item.findByIdAndDelete(req.params.id);
  // After deleting the item, remove it from the user's itemsPosted array
  await User.findByIdAndUpdate(req.user._id, {
    $pull: { itemsPosted: req.params.id },
  });

  res.status(200).json({ message: "Item deleted successfully" });
});
