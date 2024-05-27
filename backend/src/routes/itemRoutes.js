import express from "express";
import {
  createItem,
  getItems,
  getItem,
  getVisibleItems,
  getItemsByUser,
  updateItem,
  deleteItem,
} from "../controllers/itemController.js";
import { authenticate } from '../middlewares/authMiddleware.js';

const router = express.Router();


// Route to create a new item
router.post("/createitem", authenticate, createItem);

// Route to update an item by ID
router.put("/updateitem/:id", authenticate, updateItem);

// Route to delete an item by ID
router.delete("/deleteitem/:id", authenticate, deleteItem);


// Route to get all items
router.get("/getitems", getItems);

// Route to get all items with visible set to true
router.get("/getvisibleitems", getVisibleItems);

// Route to get a single item by ID
router.get("/getitem/:id", authenticate, getItem);

// Route to get all items posted by a user
router.get("/getitemsbyuser/:id", authenticate, getItemsByUser);






export default router;
