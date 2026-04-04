import {
  findAllRoles,
  findRoleById,
  findPermissionsByRoleId,
  findAllPermissions,
} from "../models/Roles.js";

export const getRoles = async (req, res) => {
  try {
    const roles = await findAllRoles();
    res.status(200).json(roles);
  } catch (error) {
    console.error("Failed to retrieve roles:", error.message);
    res.status(500).json({ error: "Failed to retrieve roles" });
  }
};

export const getRoleById = async (req, res) => {
  try {
    const { roleId } = req.params;
    if (!roleId) {
      return res.status(400).json({ error: "Role ID is required" });
    }
    const role = await findRoleById(roleId);
    if (!role) {
      return res.status(404).json({ error: "Role not found" });
    }
    res.status(200).json(role);
  } catch (error) {
    console.error("Failed to retrieve role:", error.message);
    res.status(500).json({ error: "Failed to retrieve role" });
  }
};

export const getPermissionsByRoleId = async (req, res) => {
  try {
    const { roleId } = req.params;
    if (!roleId) {
      return res.status(400).json({ error: "Role ID is required" });
    }
    const permissions = await findPermissionsByRoleId(roleId);
    res.status(200).json(permissions);
  } catch (error) {
    console.error("Failed to retrieve permissions:", error.message);
    res.status(500).json({ error: "Failed to retrieve permissions" });
  }
};

export const getPermissions = async (req, res) => {
  try {
    const permissions = await findAllPermissions();
    res.status(200).json(permissions);
  } catch (error) {
    console.error("Failed to retrieve permissions:", error.message);
    res.status(500).json({ error: "Failed to retrieve permissions" });
  }
};
