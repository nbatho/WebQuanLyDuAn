import type { TaskData, TaskWithSpaceData, TaskAttachment } from "@/store/modules/tasks";
import { beApi } from "../callApi";

export type { TaskData, TaskWithSpaceData, TaskAttachment };

// ─────────────────────────────────────────────
// Task CRUD
// ─────────────────────────────────────────────

export const getTasksForSpace = async (space_id: number): Promise<TaskWithSpaceData[]> => {
    return beApi.get(`/tasks/spaces/${space_id}`);
};

export const getTasksForList = async (list_id: number): Promise<TaskWithSpaceData[]> => {
    return beApi.get(`/tasks/lists/${list_id}`);
};

export const getTasksForFolder = async (folder_id: number): Promise<TaskWithSpaceData[]> => {
    return beApi.get(`/tasks/folders/${folder_id}`).then((res: any) => res.data); // Adjust for JSON wrapper {status: "success", data: []}
};

export const createTaskInList = async (taskData: {
    list_id: number;
    name: string;
    description?: string;
    status?: string;
    priority?: string;
    due_date?: string | null;
}): Promise<TaskData> => {
    return beApi.post(`/tasks/lists/${taskData.list_id}`, taskData);
};

export const getTaskById = async (task_id: number): Promise<TaskWithSpaceData> => {
    return beApi.get(`/tasks/${task_id}`);
};

export const createTask = async (
    space_id: number,
    taskData: Partial<TaskData>
): Promise<TaskData> => {
    return beApi.post(`/tasks/spaces/${space_id}`, taskData);
};

export const updateTask = async (
    task_id: number,
    updates: Partial<TaskData>
): Promise<TaskData> => {
    return beApi.put(`/tasks/${task_id}`, updates);
};

export const deleteTask = async (task_id: number): Promise<void> => {
    return beApi.delete(`/tasks/${task_id}`);
};

// ─────────────────────────────────────────────
// Subtasks
// ─────────────────────────────────────────────

export const getSubTasks = async (task_id: number): Promise<TaskWithSpaceData[]> => {
    return beApi.get(`/tasks/${task_id}/subtasks`);
};

// ─────────────────────────────────────────────
// Attachments
// ─────────────────────────────────────────────

export const getAttachmentsByTask = async (task_id: number): Promise<TaskAttachment[]> => {
    return beApi.get(`/tasks/${task_id}/attachments`);
};

export const createAttachment = async (
    task_id: number,
    url: string,
    description?: string
): Promise<TaskAttachment> => {
    return beApi.post(`/tasks/${task_id}/attachments`, { url, description });
};

export const deleteAttachment = async (attachment_id: number): Promise<void> => {
    return beApi.delete(`/tasks/attachments/${attachment_id}`);
};

// ─────────────────────────────────────────────
// Assignees
// ─────────────────────────────────────────────

export const addAssignee = async (task_id: number, userId: string): Promise<void> => {
    return beApi.post(`/tasks/${task_id}/assignees`, { userId });
};

export const removeAssignee = async (task_id: number, userId: string): Promise<void> => {
    return beApi.delete(`/tasks/${task_id}/assignees/${userId}`);
};
