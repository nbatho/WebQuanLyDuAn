import express from "express";
import {
  getFoldersBySpace,
  getFolderById,
  createNewFolder,
  updateFolderById,
  deleteFolderById,
} from "../controllers/folderController.js";

const router = express.Router();

// GET all folders for a space (with nested lists)
router.get("/spaces/:space_id", getFoldersBySpace);

// GET single folder by ID
router.get("/:folder_id", getFolderById);

// POST create folder in a space
router.post("/spaces/:space_id", createNewFolder);

// PUT update folder
router.put("/:folder_id", updateFolderById);

// DELETE soft-delete folder
router.delete("/:folder_id", deleteFolderById);

export default router;
