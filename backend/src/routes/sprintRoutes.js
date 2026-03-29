import express from "express";
import {
  getSprintsBySpaceId,
  createSprint,
  getSprintById,
  updateSprint,
  deleteSprint,
} from "../controllers/sprintController.js";
const router = express.Router();

router.get("/spaces/:spaceId/sprints", getSprintsBySpaceId);
router.post("/spaces/:spaceId/sprints", createSprint);
router.get("/sprints/:sprintId", getSprintById);
router.put("/sprints/:sprintId", updateSprint);
router.delete("/sprints/:sprintId", deleteSprint);

export default router;
