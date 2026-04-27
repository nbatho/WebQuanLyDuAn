import {
  getKanbanTasks,
  getUserTaskSummary,
  getSpaceOverview,
  getWorkspaceOverview,
} from "../models/Dashboard.js";

export const getKanbanBoard = async (req, res) => {
  try {
    const { spaceId } = req.params;
    if (!spaceId) {
      return res.status(400).json({ error: "Space ID is required" });
    }
    const tasks = await getKanbanTasks(spaceId);
    res.status(200).json(tasks);
  } catch (error) {
    console.error("Failed to retrieve kanban board:", error.message);
    res.status(500).json({ error: "Failed to retrieve kanban board" });
  }
};

export const getMyTaskSummary = async (req, res) => {
  try {
    const userId = req.user?.user_id;
    const { spaceId } = req.query;

    if (!userId) {
      return res.status(401).json({ error: "User not authenticated" });
    }
    const summary = await getUserTaskSummary(userId, spaceId);
    res.status(200).json(summary);
  } catch (error) {
    console.error("Failed to retrieve task summary:", error.message);
    res.status(500).json({ error: "Failed to retrieve task summary" });
  }
};

export const getSpaceStats = async (req, res) => {
  try {
    const { spaceId } = req.params;
    if (!spaceId) {
      return res.status(400).json({ error: "Space ID is required" });
    }
    const overview = await getSpaceOverview(spaceId);
    res.status(200).json(overview);
  } catch (error) {
    console.error("Failed to retrieve space overview:", error.message);
    res.status(500).json({ error: "Failed to retrieve space overview" });
  }
};

export const getWorkspaceStats = async (req, res) => {
  try {
    const { workspaceId } = req.params;
    if (!workspaceId) {
      return res.status(400).json({ error: "Workspace ID is required" });
    }
    const overview = await getWorkspaceOverview(workspaceId);
    res.status(200).json(overview);
  } catch (error) {
    console.error("Failed to retrieve workspace overview:", error.message);
    res.status(500).json({ error: "Failed to retrieve workspace overview" });
  }
};
