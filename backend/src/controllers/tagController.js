import {
  findTagsBySpaceId,
  findTagById,
  createTag,
  updateTagById,
  deleteTagById,
  addTagToTask,
  removeTagFromTask,
  findTagsByTaskId,
} from "../models/Tags.js";

export const getTagsBySpaceId = async (req, res) => {
  try {
    const { spaceId } = req.params;
    if (!spaceId) {
      return res.status(400).json({ error: "Space ID is required" });
    }
    const tags = await findTagsBySpaceId(spaceId);
    res.status(200).json(tags);
  } catch (error) {
    console.error("Failed to retrieve tags:", error.message);
    res.status(500).json({ error: "Failed to retrieve tags" });
  }
};

export const createTags = async (req, res) => {
  try {
    const { spaceId } = req.params;
    const { name, color } = req.body;

    if (!spaceId) {
      return res.status(400).json({ error: "Space ID is required" });
    }
    if (!name) {
      return res.status(400).json({ error: "Tag name is required" });
    }

    const createdBy = req.user?.user_id || null;
    const newTag = await createTag(spaceId, name, color, createdBy);
    res.status(201).json(newTag);
  } catch (error) {
    if (error.code === '23505') {
      return res.status(409).json({ error: "Tag name already exists in this space" });
    }
    console.error("Failed to create tag:", error.message);
    res.status(500).json({ error: "Failed to create tag" });
  }
};

export const getTagById = async (req, res) => {
  try {
    const { tagId } = req.params;
    if (!tagId) {
      return res.status(400).json({ error: "Tag ID is required" });
    }
    const tag = await findTagById(tagId);
    if (!tag) {
      return res.status(404).json({ error: "Tag not found" });
    }
    res.status(200).json(tag);
  } catch (error) {
    console.error("Failed to retrieve tag:", error.message);
    res.status(500).json({ error: "Failed to retrieve tag" });
  }
};

export const updateTags = async (req, res) => {
  try {
    const { tagId } = req.params;
    const { name, color } = req.body;

    if (!tagId) {
      return res.status(400).json({ error: "Tag ID is required" });
    }

    const updatedTag = await updateTagById(tagId, name, color);
    if (!updatedTag) {
      return res.status(404).json({ error: "Tag not found" });
    }
    res.status(200).json(updatedTag);
  } catch (error) {
    console.error("Failed to update tag:", error.message);
    res.status(500).json({ error: "Failed to update tag" });
  }
};

export const deleteTags = async (req, res) => {
  try {
    const { tagId } = req.params;
    if (!tagId) {
      return res.status(400).json({ error: "Tag ID is required" });
    }
    const deleted = await deleteTagById(tagId);
    if (!deleted) {
      return res.status(404).json({ error: "Tag not found" });
    }
    res.status(200).json({ message: "Tag deleted successfully" });
  } catch (error) {
    console.error("Failed to delete tag:", error.message);
    res.status(500).json({ error: "Failed to delete tag" });
  }
};

// Task-Tag relationship controllers
export const getTaskTags = async (req, res) => {
  try {
    const { taskId } = req.params;
    if (!taskId) {
      return res.status(400).json({ error: "Task ID is required" });
    }
    const tags = await findTagsByTaskId(taskId);
    res.status(200).json(tags);
  } catch (error) {
    console.error("Failed to retrieve task tags:", error.message);
    res.status(500).json({ error: "Failed to retrieve task tags" });
  }
};

export const addTagToTasks = async (req, res) => {
  try {
    const { taskId } = req.params;
    const { tagId } = req.body;

    if (!taskId) {
      return res.status(400).json({ error: "Task ID is required" });
    }
    if (!tagId) {
      return res.status(400).json({ error: "Tag ID is required" });
    }

    const result = await addTagToTask(taskId, tagId);
    res.status(201).json(result);
  } catch (error) {
    if (error.code === '23505') {
      return res.status(409).json({ error: "Tag already assigned to this task" });
    }
    console.error("Failed to add tag to task:", error.message);
    res.status(500).json({ error: "Failed to add tag to task" });
  }
};

export const removeTagFromTasks = async (req, res) => {
  try {
    const { taskId, tagId } = req.params;

    if (!taskId || !tagId) {
      return res.status(400).json({ error: "Task ID and Tag ID are required" });
    }

    const removed = await removeTagFromTask(taskId, tagId);
    if (!removed) {
      return res.status(404).json({ error: "Tag not found on this task" });
    }
    res.status(200).json({ message: "Tag removed from task successfully" });
  } catch (error) {
    console.error("Failed to remove tag from task:", error.message);
    res.status(500).json({ error: "Failed to remove tag from task" });
  }
};
