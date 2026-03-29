import exppress from "express";
import {
  getMilestonesBySpaceId,
  createMilestone,
  getMilestoneById,
  updateMilestone,
  deleteMilestone,
} from "../controllers/milestonesController.js";
const router = exppress.Router();

router.get("/spaces/:spaceId/milestones", getMilestonesBySpaceId);
router.post("/spaces/:spaceId/milestones", createMilestone);
router.get("/milestones/:milestoneId", getMilestoneById);
router.put("/milestones/:milestoneId", updateMilestone);
router.delete("/milestones/:milestoneId", deleteMilestone);

export default router;
