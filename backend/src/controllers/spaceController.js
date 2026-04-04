import { findAllSpacesByWorkspaceId, createSpaces,findSpaceById, updateSpace, deleteSpace, findSpaceMembers, removeSpaceMember, addSpaceMember } from "../models/Spaces.js";
export const getSpacesByWorkspaceId = async (req, res) => {
  try {
    const { workspaceId } = req.params;
    if (!workspaceId) {
      return res.status(400).json({ error: "Workspace ID is required" });
    }
    const spaces = await findAllSpacesByWorkspaceId(workspaceId);
    res.status(200).json(spaces);
  } catch (error) {
    res.status(500).json({ error: "Failed to retrieve spaces" });
  }
};
export const createSpace = async (req, res) => {
  try {
    const { workspaceId } = req.params;
    const { name, description, isPrivate } = req.body;
    if (!workspaceId) {
      return res.status(400).json({ error: "Workspace ID is required" });
    }
    const normalizedIsPrivate = isPrivate ?? false;
    if (!name) {
      return res.status(400).json({ error: "Space name is required" });
    }
    const newSpace = await createSpaces(
      name,
      description,
      workspaceId,
      normalizedIsPrivate,
    );
    res.status(201).json(newSpace);
  } catch (error) {
    console.error("Failed to create space:", error.message);
    res.status(500).json({ error: "Failed to create space" });
  }
};
export const getSpaceById = async (req, res) => {
  try {
    const { spaceId } = req.params;
    if (!spaceId) {
      return res.status(400).json({ error: "Space ID is required" });
    }
    const space = await findSpaceById(spaceId);
    if (!space) {
      return res.status(404).json({ error: "Space not found" });
    }
    res.status(200).json(space);

  } catch (error) {
    res.status(500).json({ error: "Failed to retrieve space" });
  }
};
export const updateSpaces = async (req, res) => {
  try {
    const { spaceId } = req.params;
    const { name, description, isPrivate } = req.body;
    if (!spaceId) {
      return res.status(400).json({ error: "Space ID is required" });
    }
    if (!name) {
      return res.status(400).json({ error: "Space name is required" });
    }
    const normalizedIsPrivate = isPrivate ?? false;
    const updatedSpace = await updateSpace(spaceId, name, description, normalizedIsPrivate);

    if (!updatedSpace) {
      return res.status(404).json({ error: "Space not found" });
    }
    res.status(200).json(updatedSpace);
  } catch (error) {
    res.status(500).json({ error: "Failed to update space" });
  }
};
export const deleteSpaces = async (req, res) => {
  try {
    const { spaceId } = req.params;
    if (!spaceId) {
      return res.status(400).json({ error: "Space ID is required" });
    }
    const ok = await deleteSpace(spaceId);
    if (!ok) {
      return res.status(404).json({ error: "Space not found" });
    }
    res.status(200).json({ message: "Space deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: "Failed to delete space" });
  }
};
export const getSpaceMembers = async (req, res) => {
  try {
    const { spaceId } = req.params;
    if (!spaceId) {
      return res.status(400).json({ error: "Space ID is required" });
    }
    const members = await findSpaceMembers(spaceId);
    res.status(200).json(members);
  } catch (error) {
    res.status(500).json({ error: "Failed to retrieve space members" });
  }
};

export const inviteMembersToSpace = async (req, res) => {
  try {
    const { spaceId } = req.params;
    const { userIds } = req.body;
    if (!spaceId) {
      return res.status(400).json({ error: "Space ID is required" });
    }
    if (!Array.isArray(userIds) || userIds.length === 0) {
      return res.status(400).json({ error: "User IDs are required" });
    }
    for (const userId of userIds) {
      await addSpaceMember(spaceId, userId);
    }
    res.status(200).json({ message: "Members invited to space successfully" });
  } catch (error) {
    res.status(500).json({ error: "Failed to invite members to space" });
  }
};

export const removeMemberFromSpace = async (req, res) => {
  try {
    const { spaceId, userId } = req.params;
    if (!spaceId || !userId) {
      return res.status(400).json({ error: "Space ID and User ID are required" });
    }
    const removedMember = await removeSpaceMember(spaceId, userId);
    if (!removedMember) {
      return res.status(404).json({ error: "Member not found in space" });
    }
    res.status(200).json({ message: "Member removed from space successfully" });
  } catch (error) {
    res.status(500).json({ error: "Failed to remove member from space" });
  }
};