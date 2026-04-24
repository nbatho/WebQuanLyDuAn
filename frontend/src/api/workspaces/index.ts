import { beApi } from "../callApi";
import type { WorkspaceMemberData, WorkspacesData } from "../../types/workspaces";

export const getWorkspaces = async (): Promise<WorkspacesData[]> => {
    return beApi.get("/workspaces");
}

export const createWorkspace = async (name: string, slug: string, description: string): Promise<WorkspacesData> => {
    return beApi.post("/workspaces", { name, slug, description });
}

export const updateWorkspace = async (workspace_id: number, name: string, slug: string, description: string): Promise<WorkspacesData> => {
    return beApi.put(`/workspaces/${workspace_id}`, { name, slug, description });
}

export const deleteWorkspace = async (workspace_id: number, owner_id: number): Promise<void> => {
    return beApi.delete(`/workspaces/${workspace_id}`, { data: { owner_id } });
}

export const getWorkspaceById = async (workspace_id: number): Promise<WorkspacesData> => {
    return beApi.get(`/workspaces/${workspace_id}`);
}

export const getWorkspaceMembers = async (workspace_id: number): Promise<WorkspaceMemberData[]> => {
    return beApi.get(`/workspaces/${workspace_id}/members`);
}

export const inviteMembers = async (workspaceId: string, emails: string) => {
    
    return beApi.post(`/members/invitations`, {
        email : emails,
        workspace_id : workspaceId
    });
}