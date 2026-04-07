import { beApi } from "../callApi";

export const getSpacesForWorkspace = async (workspace_id: number) => {
    return beApi.get(`/workspaces/${workspace_id}/spaces`);
}

export const createSpace = async (workspace_id: number, name: string, description: string, color: string) => {
    return beApi.post(`/workspaces/${workspace_id}/spaces`, { name, description, color });
}

export const updateSpace = async (space_id: number, name: string, description: string, color: string) => {
    return beApi.put(`/spaces/${space_id}`, { name, description, color });
}

export const deleteSpace = async (space_id: number) => {
    return beApi.delete(`/spaces/${space_id}`);
}
