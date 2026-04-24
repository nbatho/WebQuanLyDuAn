import { beApi } from "../callApi";

export interface FolderData {
    folder_id: number;
    space_id: number;
    name: string;
    position: number;
    created_by: number | null;
    created_at: string;
    updated_at: string;
    lists: ListData[];
}

export interface ListData {
    list_id: number;
    folder_id: number | null;
    space_id: number;
    name: string;
    position: number;
    created_by: number | null;
    created_at: string;
    updated_at: string;
}


export const createFolder = async (space_id: number, name: string): Promise<FolderData> => {
    return beApi.post(`/folders/spaces/${space_id}`, { name });
};

export const updateFolder = async (folder_id: number, name: string): Promise<FolderData> => {
    return beApi.put(`/folders/${folder_id}`, { name });
};

export const deleteFolder = async (folder_id: number): Promise<void> => {
    return beApi.delete(`/folders/${folder_id}`);
};

export const createList = async (space_id: number, folder_id: number | null, name: string): Promise<ListData> => {
    return beApi.post(`/lists`, { space_id, folder_id, name });
};

export const updateList = async (list_id: number, name: string): Promise<ListData> => {
    return beApi.put(`/lists/${list_id}`, { name });
};

export const deleteList = async (list_id: number): Promise<void> => {
    return beApi.delete(`/lists/${list_id}`);
};
