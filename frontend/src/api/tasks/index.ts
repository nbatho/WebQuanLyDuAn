import { beApi } from "../callApi";

// Note: Backend routes might be structured differently depending on task setup.
// This implements a general wrapper assuming standard REST structure

export const getTasksForSpace = async (space_id: number) => {
    return beApi.get(`/spaces/${space_id}/tasks`);
}

export const createTask = async (space_id: number, taskData: any) => {
    return beApi.post(`/spaces/${space_id}/tasks`, taskData);
}

export const updateTask = async (task_id: number, updates: any) => {
    return beApi.put(`/tasks/${task_id}`, updates);
}

export const deleteTask = async (task_id: number) => {
    return beApi.delete(`/tasks/${task_id}`);
}
