import { beApi } from '../callApi';

export type SpaceStatusRow = {
    status_id: number;
    space_id: number;
    status_name: string;
    color: string | null;
    position: number;
    is_done_state?: boolean;
    is_default?: boolean;
};

export const getStatusesBySpace = async (spaceId: number): Promise<SpaceStatusRow[]> => {
    return beApi.get(`/statuses/spaces/${spaceId}`);
};

export const createTaskStatus = async (
    spaceId: number,
    body: {
        statusName: string;
        color?: string;
        position?: number;
        isDoneState?: boolean;
        isDefault?: boolean;
    },
): Promise<SpaceStatusRow> => {
    return beApi.post(`/statuses/spaces/${spaceId}`, body);
};
