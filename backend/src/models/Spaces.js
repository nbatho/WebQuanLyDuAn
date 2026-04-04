import con from "../config/connect.js";

export const findAllSpacesByWorkspaceId = async (workspace_id) => {
  try {
    const query = `SELECT * FROM spaces WHERE workspace_id = $1`;
    const values = [workspace_id];
    const result = await con.query(query, values);
    return result.rows;
  } catch (error) {
    throw error;
  }
};

export const createSpaces = async (
  name,
  description,
  workspace_id,
  is_private = false,
) => {
  try {
    const query = `INSERT INTO spaces (workspace_id,name, description, is_private) VALUES ($1, $2, $3, $4) RETURNING *`;
    const values = [workspace_id, name, description, is_private];
    const result = await con.query(query, values);
    return result.rows[0];
  } catch (error) {
    throw error;
  }
};

export const findSpaceById = async (space_id) => {
  try {
    const query = `SELECT * FROM spaces WHERE space_id = $1`;
    const values = [space_id];
    const result = await con.query(query, values);
    return result.rows[0];
  } catch (error) {
    throw error;
  }
};
export const updateSpace = async (space_id, name, description) => {
  try {
    const query = `UPDATE spaces SET name = $1, description = $2 WHERE space_id = $3 RETURNING *`;
    const values = [name, description, space_id];
    const result = await con.query(query, values);
    return result.rows[0];
  } catch (error) {
    throw error;
  }
};

export const deleteSpace = async (space_id, user_id) => {
  try {
    const query = `DELETE FROM spaces WHERE space_id = $1 RETURNING *`;
    const values = [space_id];
    const result = await con.query(query, values);
    return result.rows[0];
  } catch (error) {
    throw error;
  }
};

export const findSpaceMembers = async (space_id) => {
  try {
    const query = `SELECT u.user_id, u.username, u.email FROM users u JOIN space_members sm ON u.user_id = sm.user_id WHERE sm.space_id = $1`;
    const values = [space_id];
    const result = await con.query(query, values);
    return result.rows;
  } catch (error) {
    throw error;
  }
};

export const addSpaceMember = async (space_id, user_id) => {
  try {
    const query = `INSERT INTO space_members (space_id, user_id) VALUES ($1, $2) RETURNING *`;
    const values = [space_id, user_id];
    const result = await con.query(query, values);
    return result.rows[0];
  } catch (error) {
    throw error;
  }
};

export const removeSpaceMember = async (space_id, user_id) => {
  try {
    const query = `DELETE FROM space_members WHERE space_id = $1 AND user_id = $2 RETURNING *`;
    const values = [space_id, user_id];
    const result = await con.query(query, values);
    return result.rows[0];
  } catch (error) {
    throw error;
  }
};