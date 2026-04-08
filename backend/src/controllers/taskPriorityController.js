import {
  findPrioritiesBySpaceId,
  findPriorityById,
  createPriority,
  updatePriorityById,
  deletePriorityById,
  reorderPriorities,
} from "../models/TaskPriority.js";

export const getPrioritiesBySpaceId = async (req, res) => {
  try {
    const { spaceId } = req.params;
    if (!spaceId) {
      return res.status(400).json({ error: "Space ID is required" });
    }
    const priorities = await findPrioritiesBySpaceId(spaceId);
    res.status(200).json(priorities);
  } catch (error) {
    console.error("Failed to retrieve priorities:", error.message);
    res.status(500).json({ error: "Failed to retrieve priorities" });
  }
};

export const createTaskPriority = async (req, res) => {
  try {
    const { spaceId } = req.params;
    const { priorityName, color, position } = req.body;

    if (!spaceId) {
      return res.status(400).json({ error: "Space ID is required" });
    }
    if (!priorityName) {
      return res.status(400).json({ error: "Priority name is required" });
    }

    const newPriority = await createPriority(spaceId, priorityName, color, position);
    res.status(201).json(newPriority);
  } catch (error) {
    if (error.code === '23505') {
      return res.status(409).json({ error: "Priority name already exists in this space" });
    }
    console.error("Failed to create priority:", error.message);
    res.status(500).json({ error: "Failed to create priority" });
  }
};

export const getPriorityById = async (req, res) => {
  try {
    const { priorityId } = req.params;
    if (!priorityId) {
      return res.status(400).json({ error: "Priority ID is required" });
    }
    const priority = await findPriorityById(priorityId);
    if (!priority) {
      return res.status(404).json({ error: "Priority not found" });
    }
    res.status(200).json(priority);
  } catch (error) {
    console.error("Failed to retrieve priority:", error.message);
    res.status(500).json({ error: "Failed to retrieve priority" });
  }
};

export const updateTaskPriority = async (req, res) => {
  try {
    const { priorityId } = req.params;
    const { priorityName, color } = req.body;

    if (!priorityId) {
      return res.status(400).json({ error: "Priority ID is required" });
    }

    const updatedPriority = await updatePriorityById(priorityId, priorityName, color);
    if (!updatedPriority) {
      return res.status(404).json({ error: "Priority not found" });
    }
    res.status(200).json(updatedPriority);
  } catch (error) {
    console.error("Failed to update priority:", error.message);
    res.status(500).json({ error: "Failed to update priority" });
  }
};

export const deleteTaskPriority = async (req, res) => {
  try {
    const { priorityId } = req.params;
    if (!priorityId) {
      return res.status(400).json({ error: "Priority ID is required" });
    }
    const deleted = await deletePriorityById(priorityId);
    if (!deleted) {
      return res.status(404).json({ error: "Priority not found" });
    }
    res.status(200).json({ message: "Priority deleted successfully" });
  } catch (error) {
    console.error("Failed to delete priority:", error.message);
    res.status(500).json({ error: "Failed to delete priority" });
  }
};

export const reorderPriority = async (req, res) => {
  try {
    const { priorityId } = req.params;
    const { position } = req.body;

    if (!priorityId) {
      return res.status(400).json({ error: "Priority ID is required" });
    }
    if (position === undefined || position === null) {
      return res.status(400).json({ error: "Position is required" });
    }

    const reordered = await reorderPriorities(priorityId, position);
    if (!reordered) {
      return res.status(404).json({ error: "Priority not found" });
    }
    res.status(200).json(reordered);
  } catch (error) {
    console.error("Failed to reorder priority:", error.message);
    res.status(500).json({ error: "Failed to reorder priority" });
  }
};
