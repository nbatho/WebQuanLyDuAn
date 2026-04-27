import { beApi } from '../callApi';
import type { PriorityData } from '@/store/modules/priorities';

export const getPrioritiesBySpace = async (spaceId: number): Promise<PriorityData[]> => {
    return beApi.get(`/priorities/spaces/${spaceId}`);
};

export const getPriorityById = async (priorityId: number): Promise<PriorityData> => {
    return beApi.get(`/priorities/${priorityId}`);
};

export const createTaskPriority = async (
    spaceId: number,
    body: {
        priorityName: string;
        color?: string;
        position?: number;
    },
): Promise<PriorityData> => {
    return beApi.post(`/priorities/spaces/${spaceId}`, body);
};

export const updateTaskPriority = async (
    priorityId: number,
    body: {
        priorityName?: string;
        color?: string;
    },
): Promise<PriorityData> => {
    return beApi.put(`/priorities/${priorityId}`, body);
};

export const deleteTaskPriority = async (priorityId: number): Promise<void> => {
    return beApi.delete(`/priorities/${priorityId}`);
};

export const reorderPriority = async (priorityId: number, position: number): Promise<PriorityData> => {
    return beApi.put(`/priorities/${priorityId}/reorder`, { position });
};
