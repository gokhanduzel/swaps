import express from "express";
import {
  createItem,
  getItems,
  getItem,
  getVisibleItems,
  getItemsByUser,
  updateItem,
  deleteItem,
  searchItems
} from "../controllers/itemController.js";
import { authenticate } from '../middlewares/authMiddleware.js';
import { upload, uploadFilesMiddleware } from '../middlewares/upload.js';

const router = express.Router();

// Route to create a new item
router.post("/createitem", authenticate, upload.array('images', 5), uploadFilesMiddleware, createItem);

// Route to update an item by ID
router.put("/updateitem/:id", authenticate, upload.array('images', 5), uploadFilesMiddleware, updateItem);

// Route to delete an item by ID
router.delete("/deleteitem/:id", authenticate, deleteItem);

// Route to get all items
router.get("/getitems", getItems);

// Route to get all items with visible set to true
router.get("/getvisibleitems", getVisibleItems);

// Route to get all the filtered visible items
router.post('/search', searchItems);

// Route to get a single item by ID
router.get("/getitem/:id", authenticate, getItem);

// Route to get all items posted by a user
router.get("/getitemsbyuser/:id", authenticate, getItemsByUser);

export default router;
