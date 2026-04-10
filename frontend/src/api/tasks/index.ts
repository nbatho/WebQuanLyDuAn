import type { TaskData, TaskWithSpaceData } from "@/store/modules/tasks";
import { beApi } from "../callApi";

export const getTasksForSpace = async (space_id: number) : Promise<TaskWithSpaceData[]> => {
    return beApi.get(`/tasks/spaces/${space_id}`);
}

export const createTask = async (space_id: number, taskData: any) : Promise<TaskData> => {
    return beApi.post(`/tasks/spaces/${space_id}`, taskData);
}

export const updateTask = async (task_id: number, updates: any) : Promise<TaskData> => {
    return beApi.put(`/tasks/${task_id}`, updates);
}

export const deleteTask = async (task_id: number) : Promise<void> => {
    return beApi.delete(`/tasks/${task_id}`);
}
