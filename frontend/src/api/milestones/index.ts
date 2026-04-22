import { beApi } from '../callApi';
import type { MilestoneData } from '@/store/modules/milestones';

export const getMilestonesBySpace = async (spaceId: number): Promise<MilestoneData[]> => {
    return beApi.get(`/milestones/spaces/${spaceId}/milestones`);
};

export const getMilestoneById = async (milestoneId: number): Promise<MilestoneData> => {
    return beApi.get(`/milestones/${milestoneId}`);
};

export const createMilestone = async (
    spaceId: number,
    body: {
        name: string;
        description?: string;
        status?: 'on_track' | 'at_risk' | 'completed' | 'cancelled';
        color?: string;
        dueDate?: string;
    },
): Promise<MilestoneData> => {
    return beApi.post(`/milestones/spaces/${spaceId}/milestones`, body);
};

export const updateMilestone = async (
    milestoneId: number,
    body: {
        name?: string;
        description?: string;
        status?: 'on_track' | 'at_risk' | 'completed' | 'cancelled';
        color?: string;
        dueDate?: string;
    },
): Promise<MilestoneData> => {
    return beApi.put(`/milestones/${milestoneId}`, body);
};

export const deleteMilestone = async (milestoneId: number): Promise<void> => {
    return beApi.delete(`/milestones/${milestoneId}`);
};
