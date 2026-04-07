import type { StatusGroup } from '../../../types/tasks';
import { initialStatusGroups } from '../data/initialStatusGroups';

/** 
 * Deep clone template tasks with unique task_id / space_id.
 * Only the Marketing Space should have the mock tasks prepopulated. 
 * Other existing and newly created Spaces will start with empty groups. 
 */
export function cloneInitialGroupsForSpace(routeSpaceId: string): StatusGroup[] {
    const idOffset = Math.abs(
        routeSpaceId.split('').reduce((acc, ch) => (acc * 31 + ch.charCodeAt(0)) | 0, 0) % 90000,
    );
    const spaceNumeric = idOffset + 1;
    return initialStatusGroups.map((g) => ({
        ...g,
        tasks: routeSpaceId === 'marketing-space' ? g.tasks.map((t) => ({
            ...t,
            task_id: t.task_id + idOffset,
            space_id: spaceNumeric,
            parent_task_id:
                t.parent_task_id === null ? null : t.parent_task_id + idOffset,
        })) : [],
    }));
}
