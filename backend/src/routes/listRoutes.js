import express from "express";
import {
  getListsByFolder,
  getListsBySpace,
  getListById,
  createNewList,
  updateListById,
  deleteListById,
} from "../controllers/listController.js";

const router = express.Router();

// GET all lists for a folder
router.get("/folders/:folder_id", getListsByFolder);

// GET all lists for a space
router.get("/spaces/:space_id", getListsBySpace);

// GET single list by ID
router.get("/:list_id", getListById);

// POST create list
router.post("/", createNewList);

// PUT update list
router.put("/:list_id", updateListById);

// DELETE soft-delete list
router.delete("/:list_id", deleteListById);

export default router;
