import { beApi } from "../callApi";

export const getWorkspaces = async () => {
    return beApi.get("/workspaces");
}

export const createWorkspace = async (name: string, slug: string, description: string) => {
    return beApi.post("/workspaces", { name, slug, description });
}

export const updateWorkspace = async (workspace_id: number, name: string, slug: string, description: string) => {
    return beApi.put(`/workspaces/${workspace_id}`, { name, slug, description });
}

export const deleteWorkspace = async (workspace_id: number, owner_id: number) => {
    return beApi.delete(`/workspaces/${workspace_id}`, { data: { owner_id } });
}

export const getWorkspaceById = async (workspace_id: number) => {
    return beApi.get(`/workspaces/${workspace_id}`);
}

export const getWorkspaceMembers = async (workspace_id: number) => {
    return beApi.get(`/workspaces/${workspace_id}/members`);
}