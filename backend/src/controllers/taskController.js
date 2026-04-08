import {
    findAllTasksBySpaceId,
    createTask,
    findTaskById,
    updateTask,
    deleteTask,
    getSubtasksByTaskId,
    createSubtask,
    updateSubtask,
    deleteSubtask,
    createComment,
    getCommentsByTaskId,
    updateComment,
    deleteComment,
    createAttachment,
    getAttachmentsByTaskId,
    deleteAttachment,
    assignUserToTask,
    unassignUserFromTask,
    getAssignedUsersByTaskId,
} from '../models/Task.js';



export const getTasksBySpaceId = async (req, res) => {
    try {
        const { spaceId } = req.params;
        if (!spaceId) {
            return res.status(400).json({ error: "Space ID is required" });
        }
        const tasks = await findAllTasksBySpaceId(spaceId);
        res.status(200).json(tasks);

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const createTasks = async (req, res) => {
    try {
        const { spaceId } = req.params;
        const { name, description } = req.body;
        if (!spaceId) {
            return res.status(400).json({ error: "Space ID is required" });
        }
        if (!name || !description) {
            return res.status(400).json({ error: "Name and description are required" });
        }
        const due_date = req.body.due_date ? new Date(req.body.due_date) : null;
        const newTask = await createTask(name, description, spaceId, due_date);
        res.status(201).json(newTask);  

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const updateTasks = async (req, res) => {
    try {
        const { taskId } = req.params;
        const { name, description, due_date } = req.body;
        if (!taskId) {
            return res.status(400).json({ error: "Task ID is required" });
        }
        await updateTask(taskId, name, description, due_date);
        res.status(200).json({ message: "Task updated successfully" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const deleteTasks = async (req, res) => {
    try {
        const { taskId } = req.params;
        if (!taskId) {
            return res.status(400).json({ error: "Task ID is required" });
        }
        await deleteTask(taskId);
        res.status(200).json({ message: "Task deleted successfully" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const getTaskById = async (req, res) => {
    try {
        const { taskId } = req.params;
        if (!taskId) {
            return res.status(400).json({ error: "Task ID is required" });
        }
        const task = await findTaskById(taskId);
        if (!task) {
            return res.status(404).json({ error: "Task not found" });
        }

        res.status(200).json(task);

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
export const getSubTasksByTaskIds = async (req, res) => {
    try {
        const { taskId } = req.params;
        if (!taskId) {
            return res.status(400).json({ error: "Task ID is required" });
        }
        const subtasks = await getSubtasksByTaskId(taskId);
        res.status(200).json(subtasks);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
export const createSubTasks = async (req, res) => {
    try {
        const { taskId } = req.params;
        const { name, description } = req.body;
        if (!taskId) {
            return res.status(400).json({ error: "Task ID is required" });
        }
        if (!name || !description) {
            return res.status(400).json({ error: "Name and description are required" });
        }
        const newSubtask = await createSubtask(name, description, taskId);
        res.status(201).json(newSubtask);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
export const updateSubTasks = async (req, res) => {
    try {
        const { subtaskId } = req.params;
        const { name, description } = req.body;
        if (!subtaskId) {
            return res.status(400).json({ error: "Subtask ID is required" });
        }
        if (!name || !description) {
            return res.status(400).json({ error: "Name and description are required" });
        }
        await updateSubtask(subtaskId, name, description);
        res.status(200).json({ message: "Subtask updated successfully" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
export const deleteSubTasks = async (req, res) => {
    try {
        const { subtaskId } = req.params;
        if (!subtaskId) {
            return res.status(400).json({ error: "Subtask ID is required" });
        }
        await deleteSubtask(subtaskId);
        res.status(200).json({ message: "Subtask deleted successfully" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const getCommentsByTaskIds = async (req, res) => {
    try {
        const { taskId } = req.params;
        if (!taskId) {
            return res.status(400).json({ error: "Task ID is required" });
        }
        const comments = await getCommentsByTaskId(taskId);
        res.status(200).json(comments);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const createComments = async (req, res) => {  
    try {
        const { taskId } = req.params;
        const { content } = req.body;
        if (!taskId) {
            return res.status(400).json({ error: "Task ID is required" });
        }
        if (!content) {
            return res.status(400).json({ error: "Comment content is required" });
        }
        const newComment = await createComment(taskId, content);
        res.status(201).json(newComment);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};  

export const getAttachmentsByTaskIds = async (req, res) => {
    try {
        const { taskId } = req.params;
        if (!taskId) {
            return res.status(400).json({ error: "Task ID is required" });
        }
        const attachments = await getAttachmentsByTaskId(taskId);
        res.status(200).json(attachments);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const createAttachments = async (req, res) => {
    try {
        const { taskId } = req.params;
        const { url, description } = req.body;
        if (!taskId) {
            return res.status(400).json({ error: "Task ID is required" });
        }
        if (!url) {
            return res.status(400).json({ error: "Attachment URL is required" });
        }
        const newAttachment = await createAttachment(taskId, url, description);
        res.status(201).json(newAttachment);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};  

export const deleteAttachments = async (req, res) => {
    try {
        const { attachmentId } = req.params;
        if (!attachmentId) {
            return res.status(400).json({ error: "Attachment ID is required" });
        }
        await deleteAttachment(attachmentId);
        res.status(200).json({ message: "Attachment deleted successfully" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const addAssigneeToTasks = async (req, res) => {  
    try {
        const { taskId } = req.params;
        const { userId } = req.body;
        if (!taskId) {
            return res.status(400).json({ error: "Task ID is required" });
        }
        if (!userId) {
            return res.status(400).json({ error: "User ID is required" });
        }
        await addAssigneeToTask(taskId, userId);
        res.status(200).json({ message: "Assignee added successfully" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const removeAssigneeFromTasks = async (req, res) => {  
    try {
        const { taskId } = req.params;
        const { userId } = req.body;
        if (!taskId) {
            return res.status(400).json({ error: "Task ID is required" });
        }
        if (!userId) {
            return res.status(400).json({ error: "User ID is required" });
        }
        await removeAssigneeFromTask(taskId, userId);
        res.status(200).json({ message: "Assignee removed successfully" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

