import {
  findAllWorkspacesByUserId,
  createWorkspace,
  findWorkspaceMembers,
  findWorkspaceById,
  updateWorkspace,
  deleteWorkspace,
  findWorkspaceInvitations,
  createWorkspaceInvitation,
  acceptWorkspaceInvitation as acceptInvitation,
  rejectWorkspaceInvitation as rejectInvitation,
  addWorkspaceMember,
  removeWorkspaceMember,
  updateMemberRole,
} from "../models/Workspaces.js";

const slugRegex = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

export const getWorkspaces = async (req, res) => {
  try {
    const user_id = req.user?.user_id;
    if (!user_id)
      return res.status(401).json({ error: "Không xác định được người dùng" });
    const workspaces = await findAllWorkspacesByUserId(user_id);
    res.status(200).json(workspaces);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const createWorkspaces = async (req, res) => {
  try {
    const { name, description, slug } = req.body;
    const owner_id = req.user?.user_id;

    if (!owner_id) {
      return res
        .status(401)
        .json({
          error: "Không xác định được người dùng. Vui lòng đăng nhập lại.",
        });
    }

    if (!name || typeof name !== "string" || name.trim() === "") {
      return res
        .status(400)
        .json({ error: "Tên Workspace là bắt buộc và không được để trống" });
    }
    if (!slug || !slugRegex.test(slug)) {
      return res
        .status(400)
        .json({
          error: 'Slug không hợp lệ (chỉ chấp nhận chữ thường, số và dấu "-")',
        });
    }

    const safeDescription =
      description && typeof description === "string"
        ? description.trim()
        : null;

    const workspace = await createWorkspace(
      name.trim(),
      safeDescription,
      slug.trim(),
      owner_id,
    );
    res.status(201).json(workspace);
  } catch (error) {
    if (error.code === "23505") {
      return res
        .status(409)
        .json({ error: "Slug này đã tồn tại, vui lòng chọn đường dẫn khác" });
    }
    console.error("Lỗi khi tạo Workspace:", error);
    res
      .status(500)
      .json({ error: "Đã có lỗi xảy ra từ máy chủ, vui lòng thử lại sau." });
  }
};

export const getWorkspaceById = async (req, res) => {
  try {
    const workspace_id = parseInt(req.params.workspaceId);
    if (isNaN(workspace_id)) {
      return res.status(400).json({ error: "ID Workspace không hợp lệ" });
    }

    const workspace = await findWorkspaceById(workspace_id);
    if (!workspace) {
      return res.status(404).json({ error: "Không tìm thấy Workspace" });
    }
    res.status(200).json(workspace);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const updateWorkspaces = async (req, res) => {
  try {
    const workspace_id = parseInt(req.params.workspaceId);
    if (isNaN(workspace_id)) {
      return res.status(400).json({ error: "ID Workspace không hợp lệ" });
    }

    const { name, description } = req.body;

    if (!name && description === undefined) {
      return res
        .status(400)
        .json({ error: "Cần cung cấp ít nhất tên hoặc mô tả để cập nhật" });
    }

    if (
      name !== undefined &&
      (typeof name !== "string" || name.trim() === "")
    ) {
      return res
        .status(400)
        .json({ error: "Tên Workspace không được để trống" });
    }

    const updatedWorkspace = await updateWorkspace(
      workspace_id,
      name?.trim(),
      description,
    );
    if (!updatedWorkspace) {
      return res
        .status(404)
        .json({ error: "Không tìm thấy Workspace để cập nhật" });
    }
    res.status(200).json(updatedWorkspace);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const deleteWorkspaces = async (req, res) => {
  try {
    const workspace_id = parseInt(req.params.workspaceId);
    const owner_id = req.user?.user_id;

    if (!owner_id) {
      return res
        .status(401)
        .json({
          error: "Không xác định được người dùng. Vui lòng đăng nhập lại.",
        });
    }
    if (isNaN(workspace_id)) {
      return res.status(400).json({ error: "ID Workspace không hợp lệ" });
    }

    await deleteWorkspace(workspace_id, owner_id);
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getWorkspaceMembers = async (req, res) => {
  try {
    const workspace_id = parseInt(req.params.workspaceId);
    if (isNaN(workspace_id)) {
      return res.status(400).json({ error: "ID Workspace không hợp lệ" });
    }

    const members = await findWorkspaceMembers(workspace_id);
    res.status(200).json(members);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// --- Workspace Invitations ---

export const getWorkspaceInvitations = async (req, res) => {
  try {
    const workspace_id = parseInt(req.params.workspaceId);
    if (isNaN(workspace_id)) {
      return res.status(400).json({ error: "ID Workspace không hợp lệ" });
    }
    const invitations = await findWorkspaceInvitations(workspace_id);
    res.status(200).json(invitations);
  } catch (error) {
    console.error("Failed to retrieve invitations:", error.message);
    res.status(500).json({ error: "Failed to retrieve invitations" });
  }
};

export const createInvitation = async (req, res) => {
  try {
    const workspace_id = parseInt(req.params.workspaceId);
    const { email, roleId } = req.body;
    const invited_by = req.user?.user_id;

    if (isNaN(workspace_id)) {
      return res.status(400).json({ error: "ID Workspace không hợp lệ" });
    }
    if (!email) {
      return res.status(400).json({ error: "Email is required" });
    }

    const invitation = await createWorkspaceInvitation(workspace_id, email, roleId || null, invited_by);
    res.status(201).json(invitation);
  } catch (error) {
    if (error.code === '23505') {
      return res.status(409).json({ error: "Invitation already sent to this email" });
    }
    console.error("Failed to create invitation:", error.message);
    res.status(500).json({ error: "Failed to create invitation" });
  }
};

export const acceptWorkspaceInvitation = async (req, res) => {
  try {
    const { invitationId } = req.params;
    if (!invitationId) {
      return res.status(400).json({ error: "Invitation ID is required" });
    }

    const invitation = await acceptInvitation(parseInt(invitationId));
    if (!invitation) {
      return res.status(404).json({ error: "Invitation not found or already processed" });
    }
    res.status(200).json({ message: "Invitation accepted successfully", invitation });
  } catch (error) {
    console.error("Failed to accept invitation:", error.message);
    res.status(500).json({ error: "Failed to accept invitation" });
  }
};

export const rejectWorkspaceInvitation = async (req, res) => {
  try {
    const { invitationId } = req.params;
    if (!invitationId) {
      return res.status(400).json({ error: "Invitation ID is required" });
    }

    const invitation = await rejectInvitation(parseInt(invitationId));
    if (!invitation) {
      return res.status(404).json({ error: "Invitation not found or already processed" });
    }
    res.status(200).json({ message: "Invitation rejected successfully", invitation });
  } catch (error) {
    console.error("Failed to reject invitation:", error.message);
    res.status(500).json({ error: "Failed to reject invitation" });
  }
};

// --- Workspace Member Management ---

export const addMemberToWorkspace = async (req, res) => {
  try {
    const workspace_id = parseInt(req.params.workspaceId);
    const { userId, roleId } = req.body;

    if (isNaN(workspace_id)) {
      return res.status(400).json({ error: "ID Workspace không hợp lệ" });
    }
    if (!userId) {
      return res.status(400).json({ error: "User ID is required" });
    }

    const member = await addWorkspaceMember(workspace_id, userId, roleId || null);
    res.status(201).json(member);
  } catch (error) {
    if (error.code === '23505') {
      return res.status(409).json({ error: "User is already a member of this workspace" });
    }
    console.error("Failed to add member:", error.message);
    res.status(500).json({ error: "Failed to add member" });
  }
};

export const removeMemberFromWorkspace = async (req, res) => {
  try {
    const workspace_id = parseInt(req.params.workspaceId);
    const user_id = parseInt(req.params.userId);

    if (isNaN(workspace_id) || isNaN(user_id)) {
      return res.status(400).json({ error: "Invalid workspace or user ID" });
    }

    const removed = await removeWorkspaceMember(workspace_id, user_id);
    if (!removed) {
      return res.status(404).json({ error: "Member not found in workspace" });
    }
    res.status(200).json({ message: "Member removed successfully" });
  } catch (error) {
    console.error("Failed to remove member:", error.message);
    res.status(500).json({ error: "Failed to remove member" });
  }
};

export const updateWorkspaceMemberRole = async (req, res) => {
  try {
    const workspace_id = parseInt(req.params.workspaceId);
    const user_id = parseInt(req.params.userId);
    const { roleId } = req.body;

    if (isNaN(workspace_id) || isNaN(user_id)) {
      return res.status(400).json({ error: "Invalid workspace or user ID" });
    }
    if (!roleId) {
      return res.status(400).json({ error: "Role ID is required" });
    }

    const updated = await updateMemberRole(workspace_id, user_id, roleId);
    if (!updated) {
      return res.status(404).json({ error: "Member not found in workspace" });
    }
    res.status(200).json(updated);
  } catch (error) {
    console.error("Failed to update member role:", error.message);
    res.status(500).json({ error: "Failed to update member role" });
  }
};

