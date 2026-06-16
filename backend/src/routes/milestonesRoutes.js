import express from "express";
import {
  getMilestonesBySpaceId,
  createMilestone,
  getMilestoneById,
  updateMilestone,
  deleteMilestone,
} from "../controllers/milestonesController.js";

// Import Middleware Phân quyền
import { requirePermission } from '../middlewares/roleMiddlewares.js';
import { requireSpaceMembership } from '../middlewares/membershipMiddleware.js';

const router = express.Router();

router.get("/spaces/:spaceId/milestones", requireSpaceMembership, getMilestonesBySpaceId);

// Tạo milestone -> Yêu cầu quyền: SETTING_MANAGE (Admin + Manager)
router.post("/spaces/:spaceId/milestones", requirePermission('SETTING_MANAGE'), createMilestone);

router.get("/:milestoneId", requireSpaceMembership, getMilestoneById);


// Cập nhật milestone -> Yêu cầu quyền: SETTING_MANAGE (Admin + Manager)
router.put("/:milestoneId", requirePermission('SETTING_MANAGE'), updateMilestone);

// Xóa milestone -> Yêu cầu quyền: SETTING_MANAGE (Admin + Manager)
router.delete("/:milestoneId", requirePermission('SETTING_MANAGE'), deleteMilestone);

export default router;
