import { beApi } from '../callApi';
import type { ActivityLog } from '@/types/activityLogs';

export const getActivitiesByTask = async (
    taskId: number,
    limit = 50,
    offset = 0,
): Promise<ActivityLog[]> => {
    return beApi.get(`/activities/tasks/${taskId}`, {
        params: { limit, offset },
    });
};
