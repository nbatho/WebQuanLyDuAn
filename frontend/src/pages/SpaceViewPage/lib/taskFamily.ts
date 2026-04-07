import type { Task } from '../../../types/tasks';

export function descendantTaskIds(tasks: Task[], parentTaskId: number): number[] {
    const direct = tasks
        .filter((t) => t.parent_task_id === parentTaskId)
        .map((t) => t.task_id);
    return direct.flatMap((id) => [id, ...descendantTaskIds(tasks, id)]);
}

export function familyTaskIds(tasks: Task[], rootTaskId: number): number[] {
    return [rootTaskId, ...descendantTaskIds(tasks, rootTaskId)];
}

export function rootTasks(tasks: Task[]): Task[] {
    return tasks.filter((t) => t.parent_task_id === null);
}

export function directChildTasks(tasks: Task[], parentTaskId: number): Task[] {
    return tasks.filter((t) => t.parent_task_id === parentTaskId);
}

export function directChildCount(tasks: Task[], parentTaskId: number): number {
    return tasks.filter((t) => t.parent_task_id === parentTaskId).length;
}

/** Roots whose family intersects rows matching `matches` (for filters). */
export function visibleRootsWithFamily(
    tasks: Task[],
    matches: (t: Task) => boolean,
): Task[] {
    return rootTasks(tasks).filter((root) => {
        const ids = new Set(familyTaskIds(tasks, root.task_id));
        return tasks.some((t) => ids.has(t.task_id) && matches(t));
    });
}
