import { beApi } from '../callApi';
import type { TagData } from '@/store/modules/tags';

export const getTagsBySpace = async (spaceId: number): Promise<TagData[]> => {
    return beApi.get(`/tags/spaces/${spaceId}`);
};

export const getTagById = async (tagId: number): Promise<TagData> => {
    return beApi.get(`/tags/${tagId}`);
};

export const createTag = async (
    spaceId: number,
    body: { name: string; color?: string },
): Promise<TagData> => {
    return beApi.post(`/tags/spaces/${spaceId}`, body);
};

export const updateTag = async (
    tagId: number,
    body: { name?: string; color?: string },
): Promise<TagData> => {
    return beApi.put(`/tags/${tagId}`, body);
};

export const deleteTag = async (tagId: number): Promise<void> => {
    return beApi.delete(`/tags/${tagId}`);
};

export const getTaskTags = async (taskId: number): Promise<TagData[]> => {
    return beApi.get(`/tags/tasks/${taskId}`);
};

export const addTagToTask = async (taskId: number, tagId: number): Promise<void> => {
    return beApi.post(`/tags/tasks/${taskId}`, { tagId });
};

export const removeTagFromTask = async (taskId: number, tagId: number): Promise<void> => {
    return beApi.delete(`/tags/tasks/${taskId}/${tagId}`);
};
