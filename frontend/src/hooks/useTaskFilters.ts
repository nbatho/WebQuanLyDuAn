import { useState, useMemo } from 'react';
import type { StatusGroup, Task } from '../types/tasks';
import { visibleRootsWithFamily, familyTaskIds } from '../utils/taskFamily';

export function useTaskFilters(groups: StatusGroup[]) {
    const [filters, setFilters] = useState<{ status: string[]; priority: string[]; assignee: string[] }>({
        status: [],
        priority: [],
        assignee: [],
    });

    const filteredGroups = useMemo(() => {
        const hasFilters = filters.status.length > 0 || filters.priority.length > 0 || filters.assignee.length > 0;
        if (!hasFilters) return groups;

        return groups.map((g) => {
            const matches = (t: Task) => {
                if (filters.status.length > 0 && !filters.status.includes(t.status_name)) return false;
                if (filters.priority.length > 0 && !filters.priority.includes(t.priority_name)) return false;
                if (filters.assignee.length > 0 && !t.assignees.some((a) => filters.assignee.includes(a.name))) return false;
                return true;
            };
            const roots = visibleRootsWithFamily(g.tasks, matches);
            const keep = new Set(roots.flatMap((r) => familyTaskIds(g.tasks, r.task_id)));
            return { ...g, tasks: g.tasks.filter((t) => keep.has(t.task_id)) };
        });
    }, [groups, filters]);

    const flatTasks = useMemo(() => groups.flatMap((g) => g.tasks), [groups]);

    return {
        filters,
        setFilters,
        filteredGroups,
        flatTasks,
    };
}
