import con from "../config/connect.js";

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
        
        t.priority AS priority_name,
        CASE t.priority
            WHEN 'Urgent' THEN '#ef4444'
            WHEN 'High'   THEN '#f59e0b'
            WHEN 'Normal' THEN '#3b82f6'
            WHEN 'Low'    THEN '#8b5cf6'
            WHEN 'Clear'  THEN '#9ca3af'
            ELSE 'transparent'
        END AS priority_color,
        
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

export const createTaskForList = async ({
  listId,
  name,
  description,
  priority,
  assignee_ids,
  due_date,
  status_id
}) => {
  const client = await con.connect();

  try {
    await client.query('BEGIN');
    const listRes = await client.query(
      'SELECT space_id, folder_id FROM lists WHERE list_id = $1 AND deleted_at IS NULL',
      [listId]
    );

    if (listRes.rows.length === 0) {
      const error = new Error("Không tìm thấy List (List not found)");
      error.statusCode = 404;
      throw error;
    }

    const { space_id, folder_id } = listRes.rows[0];
    let final_status_id = status_id;

    if (!final_status_id) {
      const statusRes = await client.query(
        'SELECT status_id FROM task_status WHERE space_id = $1 AND is_default = true LIMIT 1',
        [space_id]
      );
      final_status_id = statusRes.rows[0]?.status_id || null;
    }

    const taskQuery = `
                    INSERT INTO tasks (
                        name, description, space_id, folder_id, list_id, 
                        status_id, priority, due_date, start_date
                    ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, NOW()) RETURNING *`;

    const taskValues = [
      name,
      description || null,
      space_id,
      folder_id,
      listId,
      final_status_id,
      priority || 'Normal', 
      due_date || null
    ];

    const taskResult = await client.query(taskQuery, taskValues);
    const newTask = taskResult.rows[0];

    if (assignee_ids && Array.isArray(assignee_ids) && assignee_ids.length > 0) {
      const assignValues = [];
      const assignPlaceholders = assignee_ids.map((uid, idx) => {
        const userId = typeof uid === 'object' ? uid.id : uid;
        const taskId = newTask.task_id || newTask.id;

        assignValues.push(taskId, userId);
        return `($${idx * 2 + 1}, $${idx * 2 + 2})`;
      }).join(', ');

      const assignQuery = `INSERT INTO task_assigns (task_id, user_id) VALUES ${assignPlaceholders}`;

      await client.query(assignQuery, assignValues);
    }

    await client.query('COMMIT');

    return newTask;

  } catch (error) {
    await client.query('ROLLBACK');
    throw error;
  } finally {
    client.release();
  }
};

export const findTaskById = async (task_id) => {
  try {
    const query = `SELECT * FROM tasks WHERE task_id = $1 AND deleted_at IS NULL`;
    const values = [task_id];
    const result = await con.query(query, values);
    return result.rows[0];
  } catch (error) {
    throw error;
  }
};

export const updateTask = async (task_id, updateData) => {
  try {
    const allowedFields = [
      'name',
      'description',
      'due_date',
      'status_id',
      'priority',
      'start_date',
      'story_points',
      'position',
      'list_id',
      'folder_id',
      'is_archived'
    ];

    const fieldsToUpdate = [];
    const values = [];
    let paramIndex = 1;

    for (const [key, value] of Object.entries(updateData)) {
      if (allowedFields.includes(key)) {
        fieldsToUpdate.push(`${key} = $${paramIndex}`);
        values.push(value);
        paramIndex++;
      }
    }

    if (fieldsToUpdate.length === 0) {
      return null;
    }

    values.push(task_id);

    const query = `
      UPDATE tasks 
      SET ${fieldsToUpdate.join(', ')} 
      WHERE task_id = $${paramIndex} AND deleted_at IS NULL 
      RETURNING *
    `;

    const result = await con.query(query, values);

    if (result.rows.length === 0) {
      const error = new Error("Task không tồn tại hoặc đã bị xóa");
      error.statusCode = 404;
      throw error;
    }

    return result.rows[0];
  } catch (error) {
    throw error;
  }
};

export const deleteTask = async (taskId) => {
  const query = `
        UPDATE tasks 
        SET deleted_at = NOW() 
        WHERE task_id = $1 AND deleted_at IS NULL 
        RETURNING task_id;
    `;

  const result = await con.query(query, [taskId]);
  if (result.rows.length === 0) {
    const error = new Error("Task không tồn tại hoặc đã bị xóa");
    error.statusCode = 404;
    throw error;
  }

  return result.rows[0];
};

export const getSubtasksByTaskId = async (task_id) => {
  try {
    const query = `SELECT * FROM tasks WHERE parent_task_id = $1 AND deleted_at IS NULL`;
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

// ĐÃ LÀM ĐỘNG HÓA updateSubtask GIỐNG HỆT updateTask
export const updateSubtask = async (task_id, parent_task_id, updateData) => {
  try {
    const allowedFields = [
      'name',
      'description',
      'due_date',
      'status_id',
      'priority',
      'start_date',
      'story_points',
      'position',
      'is_archived'
    ];

    const fieldsToUpdate = [];
    const values = [];
    let paramIndex = 1;

    for (const [key, value] of Object.entries(updateData)) {
      if (allowedFields.includes(key)) {
        fieldsToUpdate.push(`${key} = $${paramIndex}`);
        values.push(value);
        paramIndex++;
      }
    }

    if (fieldsToUpdate.length === 0) {
      return null;
    }

    // Nạp task_id và parent_task_id vào cuối mảng values
    values.push(task_id, parent_task_id);

    const query = `
      UPDATE tasks 
      SET ${fieldsToUpdate.join(', ')} 
      WHERE task_id = $${paramIndex} 
        AND parent_task_id = $${paramIndex + 1} 
        AND deleted_at IS NULL 
      RETURNING *
    `;

    const result = await con.query(query, values);

    if (result.rows.length === 0) {
      const error = new Error("Subtask không tồn tại hoặc đã bị xóa");
      error.statusCode = 404;
      throw error;
    }

    return result.rows[0];
  } catch (error) {
    throw error;
  }
};

export const deleteSubtask = async (task_id, parent_task_id) => {
  try {
    const query = `UPDATE tasks SET deleted_at = NOW() WHERE task_id = $1 AND parent_task_id = $2 AND deleted_at IS NULL RETURNING *`;
    const values = [task_id, parent_task_id];
    const result = await con.query(query, values);
    
    if (result.rows.length === 0) {
      const error = new Error("Subtask không tồn tại hoặc đã bị xóa");
      error.statusCode = 404;
      throw error;
    }
    
    return result.rows[0];
  } catch (error) {
    throw error;
  }
};

export const getCommentsByTaskId = async (task_id) => {
  try {
    const query = `SELECT * FROM comments WHERE task_id = $1 AND deleted_at IS NULL`;
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
    const query = `UPDATE comments SET content = $1 WHERE comment_id = $2 AND deleted_at IS NULL RETURNING *`;
    const values = [content, comment_id];
    const result = await con.query(query, values);
    return result.rows[0];
  } catch (error) {
    throw error;
  }
};

export const deleteComment = async (comment_id) => {
  try {
    const query = `UPDATE comments SET deleted_at = NOW() WHERE comment_id = $1 AND deleted_at IS NULL RETURNING *`;
    const values = [comment_id];
    const result = await con.query(query, values);
    return result.rows[0];
  } catch (error) {
    throw error;
  }
};

export const assignUserToTask = async (task_id, user_id) => {
  try {
    const query = `INSERT INTO task_assigns (task_id, user_id) VALUES ($1, $2)
                   ON CONFLICT (task_id, user_id)
                   DO UPDATE SET deleted_at = NULL
                   RETURNING *`;
    const values = [task_id, user_id];
    const result = await con.query(query, values);
    return result.rows[0];
  } catch (error) {
    throw error;
  }
};

export const unassignUserFromTask = async (task_id, user_id) => {
  try {
    const query = `UPDATE task_assigns SET deleted_at = NOW() WHERE task_id = $1 AND user_id = $2 AND deleted_at IS NULL RETURNING *`;
    const values = [task_id, user_id];
    const result = await con.query(query, values);
    return result.rows[0];
  } catch (error) {
    throw error;
  }
};

export const getAssignedUsersByTaskId = async (task_id) => {
  try {
    const query = `SELECT u.user_id, u.username, u.email FROM users u JOIN task_assigns ta ON u.user_id = ta.user_id WHERE ta.task_id = $1 AND ta.deleted_at IS NULL AND u.deleted_at IS NULL`;
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
                       LEFT JOIN users u ON a.uploaded_by = u.user_id AND u.deleted_at IS NULL
                       WHERE a.task_id = $1 AND a.deleted_at IS NULL
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
    const query = `UPDATE attachments SET deleted_at = NOW() WHERE attachment_id = $1 AND deleted_at IS NULL RETURNING *`;
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