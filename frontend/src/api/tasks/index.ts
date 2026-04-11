import type { TaskData, TaskWithSpaceData } from "@/store/modules/tasks";
import { beApi } from "../callApi";

export type { TaskData };

export const getTasksForSpace = async (space_id: number) : Promise<TaskWithSpaceData[]> => {
    return beApi.get(`/tasks/spaces/${space_id}`);
}

export const getTasksForList = async (list_id: number) : Promise<any[]> => {
    return beApi.get(`/tasks/lists/${list_id}`);
}

export const createTask = async (space_id: number, taskData: TaskData) : Promise<TaskData> => {
    return beApi.post(`/tasks/spaces/${space_id}`, taskData);
}

export const createTaskInList = async (taskData: {
    list_id: number;
    name: string;
    status?: string;
    priority?: string;
    due_date?: string;
}) : Promise<any> => {
    return beApi.post(`/tasks`, taskData);
}

export const updateTask = async (task_id: number, updates: any) : Promise<TaskData> => {
    return beApi.put(`/tasks/${task_id}`, updates);
}

export const deleteTask = async (task_id: number) : Promise<void> => {
    return beApi.delete(`/tasks/${task_id}`);
}

