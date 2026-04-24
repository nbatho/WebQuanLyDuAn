import con from "../config/connect.js";

export const findAllTasksBySpaceId = async (space_id) => {
  try {
    const query = `
      SELECT 
        t.task_id,
        t.parent_task_id,
        t.space_id,
        
        s.name AS space_name,
        s.color AS space_color,
        
        t.status_id,
        ts.status_name,
        ts.color AS status_color,
        
        t.priority_id,
        tp.priority_name,
        tp.color AS priority_color,
        
        t.name, 
        t.description, 
        t.story_points,
        t.start_date,
        t.due_date,
        t.completed_at,
        t.position,
        
        COALESCE(
          (
            SELECT json_agg(
              json_build_object(
                'user_id', u.user_id,
                'name', u.name,
                'avatar_url', u.avatar_url
              )
            )
            FROM task_assigns ta
            JOIN users u ON ta.user_id = u.user_id
            WHERE ta.task_id = t.task_id
              AND ta.deleted_at IS NULL
              AND u.deleted_at IS NULL
          ), '[]'::json
        ) AS assignees,

        -- Lấy danh sách Tags (Thường đi kèm với Task) gom thành Array JSON
        COALESCE(
          (
            SELECT json_agg(
              json_build_object(
                'tag_id', tg.tag_id,
                'name', tg.name,
                'color', tg.color
              )
            )
            FROM task_tags tt
            JOIN tags tg ON tt.tag_id = tg.tag_id
            WHERE tt.task_id = t.task_id
              AND tg.deleted_at IS NULL
          ), '[]'::json
        ) AS tags

      FROM tasks t
      JOIN spaces s ON t.space_id = s.space_id
      LEFT JOIN task_status ts ON t.status_id = ts.status_id
      LEFT JOIN task_priority tp ON t.priority_id = tp.priority_id
      
      WHERE s.space_id = $1 
        AND t.deleted_at IS NULL 
        AND s.deleted_at IS NULL
      ORDER BY t.position ASC;
    `;

    const values = [space_id];
    const result = await con.query(query, values);

    return result.rows;
  } catch (error) {
    console.error("Error in findAllTasksBySpaceId:", error);
    throw error;
  }
};

export const findAllTasksByListId = async (list_id) => {
  try {
    const query = `
      SELECT 
        t.task_id,
        t.parent_task_id,
        t.space_id,
        t.folder_id,
        t.list_id,
        
        s.name AS space_name,
        s.color AS space_color,
        
        t.status_id,
        ts.status_name,
        ts.color AS status_color,
        
        t.priority_id,
        tp.priority_name,
        tp.color AS priority_color,
        
        t.name, 
        t.description, 
        t.story_points,
        t.start_date,
        t.due_date,
        t.completed_at,
        t.position,
        
        COALESCE(
          (
            SELECT json_agg(
              json_build_object(
                'user_id', u.user_id,
                'name', u.name,
                'avatar_url', u.avatar_url
              )
            )
            FROM task_assigns ta
            JOIN users u ON ta.user_id = u.user_id
            WHERE ta.task_id = t.task_id
              AND ta.deleted_at IS NULL
              AND u.deleted_at IS NULL
          ), '[]'::json
        ) AS assignees,

        COALESCE(
          (
            SELECT json_agg(
              json_build_object(
                'tag_id', tg.tag_id,
                'name', tg.name,
                'color', tg.color
              )
            )
            FROM task_tags tt
            JOIN tags tg ON tt.tag_id = tg.tag_id
            WHERE tt.task_id = t.task_id
              AND tg.deleted_at IS NULL
          ), '[]'::json
        ) AS tags

      FROM tasks t
      JOIN spaces s ON t.space_id = s.space_id
      LEFT JOIN task_status ts ON t.status_id = ts.status_id
      LEFT JOIN task_priority tp ON t.priority_id = tp.priority_id
      
      WHERE t.list_id = $1 
        AND t.deleted_at IS NULL 
        AND s.deleted_at IS NULL
      ORDER BY t.position ASC;
    `;

    const values = [list_id];
    const result = await con.query(query, values);

    return result.rows;
  } catch (error) {
    console.error("Error in findAllTasksByListId:", error);
    throw error;
  }
};

export const findAllTasksByFolderId = async (folder_id) => {
  try {
    const query = `
      SELECT 
        t.task_id,
        t.parent_task_id,
        t.space_id,
        t.folder_id,
        t.list_id,
        
        s.name AS space_name,
        s.color AS space_color,
        
        t.status_id,
        ts.status_name,
        ts.color AS status_color,
        
        t.priority_id,
        tp.priority_name,
        tp.color AS priority_color,
        
        t.name, 
        t.description, 
        t.story_points,
        t.start_date,
        t.due_date,
        t.completed_at,
        t.position,
        t.is_archived,
        t.created_by,
        t.created_at,
        t.updated_by,
        t.updated_at,
        t.deleted_at,

        (SELECT COUNT(*) FROM comments c WHERE c.task_id = t.task_id AND c.deleted_at IS NULL) AS comment_count,

        COALESCE(
          (
            SELECT json_agg(json_build_object('user_id', u.user_id, 'name', u.name, 'avatar_url', u.avatar_url))
            FROM task_assignees ta
            JOIN users u ON ta.user_id = u.user_id
            WHERE ta.task_id = t.task_id
          ), '[]'::json
        ) AS assignees,

        COALESCE(
          (
            SELECT json_agg(json_build_object('tag_id', tg.tag_id, 'name', tg.name, 'color', tg.color))
            FROM task_tags tt
            JOIN tags tg ON tt.tag_id = tg.tag_id
            WHERE tt.task_id = t.task_id
              AND tg.deleted_at IS NULL
          ), '[]'::json
        ) AS tags

      FROM tasks t
      JOIN spaces s ON t.space_id = s.space_id
      LEFT JOIN task_status ts ON t.status_id = ts.status_id
      LEFT JOIN task_priority tp ON t.priority_id = tp.priority_id
      
      WHERE t.folder_id = $1 
        AND t.deleted_at IS NULL 
        AND s.deleted_at IS NULL
      ORDER BY t.position ASC;
    `;

    const values = [folder_id];
    const result = await con.query(query, values);

    return result.rows;
  } catch (error) {
    console.error("Error in findAllTasksByFolderId:", error);
    throw error;
  }
};

export const createTask = async (name, description, space_id, due_date) => {
  try {
    const query = `INSERT INTO tasks (name, description, space_id, start_date, due_date) VALUES ($1, $2, $3, $4, $5) RETURNING *`;
    const values = [name, description, space_id, new Date(), due_date];
    const result = await con.query(query, values);
    return result.rows[0];
  } catch (error) {
    throw error;
  }
};

export const findTaskById = async (task_id) => {
  try {
    const query = `SELECT * FROM tasks WHERE task_id = $1`;
    const values = [task_id];
    const result = await con.query(query, values);
    return result.rows[0];
  } catch (error) {
    throw error;
  }
};

export const updateTask = async (task_id, name, description, due_date) => {
  try {
    const query = `UPDATE tasks SET name = $1, description = $2, due_date = $3 WHERE task_id = $4 RETURNING *`;
    const values = [name, description, due_date, task_id];
    const result = await con.query(query, values);
    return result.rows[0];
  } catch (error) {
    throw error;
  }
};

export const deleteTask = async (task_id) => {
  try {
    const query = `DELETE FROM tasks WHERE task_id = $1 RETURNING *`;
    const values = [task_id];
    const result = await con.query(query, values);
    return result.rows[0];
  } catch (error) {
    throw error;
  }
};

export const getSubtasksByTaskId = async (task_id) => {
  try {
    const query = `SELECT * FROM tasks WHERE parent_task_id = $1`;
    const values = [task_id];
    const result = await con.query(query, values);
    return result.rows;
  } catch (error) {
    throw error;
  }
};

export const createSubtask = async (name, description, task_id) => {
  try {
    const query = `INSERT INTO tasks (name, description, parent_task_id, space_id) VALUES ($1, $2, $3, $4) RETURNING *`;
    const values = [name, description, task_id, null];
    const result = await con.query(query, values);
    return result.rows[0];
  } catch (error) {
    throw error;
  }
};

export const updateSubtask = async (
  task_id,
  parent_task_id,
  name,
  description,
  due_date,
) => {
  try {
    const query = `UPDATE tasks SET name = $1, description = $2, due_date = $3 WHERE task_id = $4 AND parent_task_id = $5 RETURNING *`;
    const values = [name, description, due_date, task_id, parent_task_id];
    const result = await con.query(query, values);
    return result.rows[0];
  } catch (error) {
    throw error;
  }
};

export const deleteSubtask = async (task_id, parent_task_id) => {
  try {
    const query = `DELETE FROM tasks WHERE task_id = $1 AND parent_task_id = $2 RETURNING *`;
    const values = [task_id, parent_task_id];
    const result = await con.query(query, values);
    return result.rows[0];
  } catch (error) {
    throw error;
  }
};

export const getCommentsByTaskId = async (task_id) => {
  try {
    const query = `SELECT * FROM comments WHERE task_id = $1`;
    const values = [task_id];
    const result = await con.query(query, values);
    return result.rows;
  } catch (error) {
    throw error;
  }
};

export const createComment = async (content, task_id, user_id) => {
  try {
    const query = `INSERT INTO comments (content, task_id, user_id) VALUES ($1, $2, $3) RETURNING *`;
    const values = [content, task_id, user_id];
    const result = await con.query(query, values);
    return result.rows[0];
  } catch (error) {
    throw error;
  }
};
export const updateComment = async (comment_id, content) => {
  try {
    const query = `UPDATE comments SET content = $1 WHERE comment_id = $2 RETURNING *`;
    const values = [content, comment_id];
    const result = await con.query(query, values);
    return result.rows[0];
  } catch (error) {
    throw error;
  }
};

export const deleteComment = async (comment_id) => {
  try {
    const query = `DELETE FROM comments WHERE comment_id = $1 RETURNING *`;
    const values = [comment_id];
    const result = await con.query(query, values);
    return result.rows[0];
  } catch (error) {
    throw error;
  }
};

export const assignUserToTask = async (task_id, user_id) => {
  try {
    const query = `INSERT INTO task_assigns (task_id, user_id) VALUES ($1, $2) RETURNING *`;
    const values = [task_id, user_id];
    const result = await con.query(query, values);
    return result.rows[0];
  } catch (error) {
    throw error;
  }
};

export const unassignUserFromTask = async (task_id, user_id) => {
  try {
    const query = `DELETE FROM task_assigns WHERE task_id = $1 AND user_id = $2 RETURNING *`;
    const values = [task_id, user_id];
    const result = await con.query(query, values);
    return result.rows[0];
  } catch (error) {
    throw error;
  }
};

export const getAssignedUsersByTaskId = async (task_id) => {
  try {
    const query = `SELECT u.user_id, u.username, u.email FROM users u JOIN task_assigns ta ON u.user_id = ta.user_id WHERE ta.task_id = $1`;
    const values = [task_id];
    const result = await con.query(query, values);
    return result.rows;
  } catch (error) {
    throw error;
  }
};

export const getAttachmentsByTaskId = async (task_id) => {
  try {
    const query = `SELECT a.*, u.username as uploaded_by_username 
                       FROM attachments a 
                       LEFT JOIN users u ON a.uploaded_by = u.user_id 
                       WHERE a.task_id = $1 
                       ORDER BY a.created_at DESC`;
    const values = [task_id];
    const result = await con.query(query, values);
    return result.rows;
  } catch (error) {
    throw error;
  }
};

export const deleteAttachment = async (attachment_id) => {
  try {
    const query = `DELETE FROM attachments WHERE attachment_id = $1 RETURNING *`;
    const values = [attachment_id];
    const result = await con.query(query, values);
    return result.rows[0];
  } catch (error) {
    throw error;
  }
};

export const createAttachment = async (
  task_id,
  file_name,
  file_url,
  file_size,
  mime_type,
  uploaded_by,
  comment_id = null,
) => {
  try {
    const query = `INSERT INTO attachments (task_id, comment_id, file_name, file_url, file_size, mime_type, uploaded_by) 
                       VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *`;
    const values = [
      task_id,
      comment_id,
      file_name,
      file_url,
      file_size,
      mime_type,
      uploaded_by,
    ];
    const result = await con.query(query, values);
    return result.rows[0];
  } catch (error) {
    throw error;
  }
};
