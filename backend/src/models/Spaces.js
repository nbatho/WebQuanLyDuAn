import con from "../config/connect.js";

export const findAllSpacesByWorkspaceId = async (workspace_id) => {
  try {
    const query = `SELECT * FROM spaces WHERE workspace_id = $1 AND deleted_at IS NULL`;
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
  const client = await con.connect();
  try {
    await client.query('BEGIN');

    const spaceQuery = `
            INSERT INTO spaces (workspace_id, name, description, is_private) 
            VALUES ($1, $2, $3, $4) 
            RETURNING *`;
    const spaceValues = [workspace_id, name, description, is_private];
    const spaceResult = await client.query(spaceQuery, spaceValues);
    const newSpace = spaceResult.rows[0];
    const spaceId = newSpace.space_id;

    const statusQuery = `
            INSERT INTO task_status (space_id, status_name, color, position, is_done_state, is_default)
            VALUES 
                ($1, 'TO DO', '#9CA3AF', 0, false, true),
                ($1, 'IN PROGRESS', '#2563EB', 1, false, false),
                ($1, 'COMPLETE', '#22C55E', 2, true, false)
        `;

    await client.query(statusQuery, [spaceId]);

    await client.query('COMMIT');

    return newSpace;

  } catch (error) {
    await client.query('ROLLBACK');
    throw error;
  } finally {
    client.release();
  }
};

export const findSpaceById = async (space_id) => {
  try {
    const query = `SELECT * FROM spaces WHERE space_id = $1 AND deleted_at IS NULL`;
    const values = [space_id];
    const result = await con.query(query, values);
    return result.rows[0];
  } catch (error) {
    throw error;
  }
};
export const updateSpace = async (space_id, name, description) => {
  try {
    const query = `UPDATE spaces SET name = $1, description = $2 WHERE space_id = $3 AND deleted_at IS NULL RETURNING *`;
    const values = [name, description, space_id];
    const result = await con.query(query, values);
    return result.rows[0];
  } catch (error) {
    throw error;
  }
};

export const deleteSpace = async (space_id, user_id) => {
  try {
    const query = `UPDATE spaces SET deleted_at = CURRENT_TIMESTAMP WHERE space_id = $1 AND deleted_at IS NULL RETURNING *`;
    const values = [space_id];
    const result = await con.query(query, values);
    return result.rows[0];
  } catch (error) {
    throw error;
  }
};

export const findSpaceMembers = async (space_id) => {
  try {
    const query = `SELECT u.user_id, u.username, u.email FROM users u JOIN space_members sm ON u.user_id = sm.user_id WHERE sm.space_id = $1 AND sm.deleted_at IS NULL AND u.deleted_at IS NULL`;
    const values = [space_id];
    const result = await con.query(query, values);
    return result.rows;
  } catch (error) {
    throw error;
  }
};

export const addSpaceMember = async (space_id, user_id) => {
  try {
    const query = `INSERT INTO space_members (space_id, user_id) VALUES ($1, $2)
                   ON CONFLICT (space_id, user_id)
                   DO UPDATE SET deleted_at = NULL
                   RETURNING *`;
    const values = [space_id, user_id];
    const result = await con.query(query, values);
    return result.rows[0];
  } catch (error) {
    throw error;
  }
};

export const removeSpaceMember = async (space_id, user_id) => {
  try {
    const query = `UPDATE space_members SET deleted_at = CURRENT_TIMESTAMP WHERE space_id = $1 AND user_id = $2 AND deleted_at IS NULL RETURNING *`;
    const values = [space_id, user_id];
    const result = await con.query(query, values);
    return result.rows[0];
  } catch (error) {
    throw error;
  }
};