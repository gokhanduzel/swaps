import Item from "../models/ItemModel.js";
import User from "../models/UserModel.js";
import asyncHandler from "express-async-handler";
import mongoose from "mongoose";
import { s3Client } from "../config/awsConfig.js";
import { DeleteObjectCommand } from "@aws-sdk/client-s3";

// Function to delete an image from S3
const deleteImageFromS3 = async (url) => {
  const key = url.split("/").pop();
  await s3Client.send(
    new DeleteObjectCommand({
      Bucket: process.env.AWS_S3_BUCKET_NAME,
      Key: key,
    })
  );
};

// Create a new item
export const createItem = asyncHandler(async (req, res) => {
  const { title, description, tags, desiredItems, visible } = req.body;
  const images = req.body.images || []; // URLs from S3

  // Data validation
  if (!title || !description || !tags || visible === undefined) {
    res.status(400);
    throw new Error("Missing required fields");
  }

  // Parse tags and desiredItems
  let parsedTags = [];
  let parsedDesiredItems = [];

  try {
    parsedTags = JSON.parse(tags);
    parsedDesiredItems = JSON.parse(desiredItems);
  } catch (error) {
    res.status(400);
    throw new Error("Invalid tags or desiredItems format");
  }

  const item = new Item({
    ownerId: req.user._id,
    title,
    description,
    images,
    tags: parsedTags,
    desiredItems: parsedDesiredItems,
    visible,
  });

  try {
    const createdItem = await item.save();
    await User.findByIdAndUpdate(
      req.user._id,
      { $push: { itemsPosted: createdItem._id } },
      { new: true }
    );
    res.status(201).json({
      message: "Item created successfully",
      item: createdItem,
    });
  } catch (error) {
    console.error(error);
    res.status(500);
    throw new Error("Failed to create item");
  }
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
  const { title, description, tags, desiredItems, visible, removeImages } =
    req.body;
  const item = await Item.findById(req.params.id);

  if (!item) {
    res.status(404).json({ message: "Item not found" });
    return;
  }

  // Check if the user is the owner of the item
  if (item.ownerId.toString() !== req.user._id.toString()) {
    res.status(401).json({ message: "Not authorized to update this item" });
    return;
  }

  // Update item details
  item.title = title || item.title;
  item.description = description || item.description;
  item.tags = tags || item.tags;
  item.desiredItems = desiredItems || item.desiredItems;
  item.visible = visible !== undefined ? visible : item.visible;

  // Remove selected images
  if (removeImages && removeImages.length > 0) {
    for (const url of removeImages) {
      await deleteImageFromS3(url); // Delete image from S3
      item.images = item.images.filter((image) => image !== url); // Remove URL from MongoDB
    }
  }

  // Add new images
  if (req.body.images && req.body.images.length > 0) {
    const newImages = req.body.images; // URLs from S3
    item.images.push(...newImages); // Add URLs to MongoDB
  }

  const updatedItem = await item.save(); // Save the updated item
  res.status(200).json(updatedItem); // Respond with the updated item
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

    // Delete images from S3
    for (const url of item.images) {
      await deleteImageFromS3(url);
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

export const searchItems = asyncHandler(async (req, res) => {
  const { keyword, location, range } = req.body;

  let itemQuery = { visible: true };
  let userQuery = {};

  if (keyword) {
    itemQuery = {
      ...itemQuery,
      $or: [
        { title: new RegExp(keyword, "i") },
        { description: new RegExp(keyword, "i") },
        { tags: new RegExp(keyword, "i") },
      ],
    };
  }

  if (location && location.coordinates.length === 2) {
    userQuery = {
      ...userQuery,
      location: {
        $near: {
          $geometry: {
            type: "Point",
            coordinates: location.coordinates,
          },
          $maxDistance: range || 10000, // Default range is 10 km
        },
      },
    };
  }

  try {
    const users = await User.find(userQuery, "_id");
    const userIds = users.map((user) => user._id);

    if (userIds.length > 0) {
      itemQuery = { ...itemQuery, ownerId: { $in: userIds } };
    } else {
      // No users found within the location range
      return res.json([]);
    }

    const items = await Item.find(itemQuery);
    res.json(items);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error searching items", error: error.message });
  }
});
