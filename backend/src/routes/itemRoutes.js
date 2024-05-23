import express from "express";
import {
  createItem,
  getItems,
  getItem,
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

// Route to get a single item by ID
router.get("/getitem/:id", authenticate, getItem);




export default router;
