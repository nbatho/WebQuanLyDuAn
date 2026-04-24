import type { SpaceData, SpaceDetail } from "@/store/modules/spaces";
import { beApi } from "../callApi";

export const getSpacesForWorkspace = async (workspace_id: number) : Promise<SpaceDetail[]> => {
    return beApi.get(`/spaces/workspaces/${workspace_id}`);
}

export const createSpace = async (workspace_id: number, name: string, description: string, color: string, is_private?: boolean) : Promise<SpaceData> => {
    return beApi.post(`/spaces/workspaces/${workspace_id}`, { name, description, color, isPrivate: is_private });
}

export const updateSpace = async (space_id: number, name: string, description: string, color: string) : Promise<SpaceData> => {
    return beApi.put(`/spaces/${space_id}`, { name, description, color });
}
    
export const deleteSpace = async (space_id: number) => {
    return beApi.delete(`/spaces/${space_id}`);
}

export const getSpaceMembers = async (space_id: number) => {
    return beApi.get(`/spaces/${space_id}/members`);
}

export const getSpaceDetails = async (space_id: number) : Promise<SpaceDetail> => {
    return beApi.get(`/spaces/spacesDetails/${space_id}`);
}