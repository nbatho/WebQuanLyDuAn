import express from "express";
import {
  getWorkspaces,
  createWorkspaces,
  getWorkspaceById,
  updateWorkspaces,
  deleteWorkspaces,
  getWorkspaceMembers,
} from "../controllers/workspacesControllers.js";

// Import Middleware Phân quyền
import { requirePermission } from '../middlewares/roleMiddlewares.js';

const router = express.Router();


router.get("/", getWorkspaces);


// Ai cũng có thể tạo Workspace mới (không cần permission check)
router.post("/", createWorkspaces);


router.get("/:workspaceId", getWorkspaceById);


// Chỉ Admin mới được cập nhật Workspace
router.put("/:workspaceId", requirePermission('WORKSPACE_UPDATE'), updateWorkspaces);


// Chỉ Admin mới được xóa Workspace
router.delete("/:workspaceId", requirePermission('WORKSPACE_DELETE'), deleteWorkspaces);

// --- Members ---


router.get("/:workspaceId/members", getWorkspaceMembers);


export default router;
