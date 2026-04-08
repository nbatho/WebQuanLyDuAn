/** Aligns with `tasks` table: task_id, space_id, parent_task_id, name, description (+ UI-only fields until API exposes them). */
export interface Task {
    task_id: number;
    space_id: number;
    parent_task_id: number | null;
    name: string;
    description: string | null;
    status: string;
    statusColor: string;
    priority: string;
    priorityColor: string;
    due_date: string | null;
    comment_count: number;
    assignees: string[];
}
export interface NewTaskData {
    name: string;
    status: string;
    statusColor: string;
    priority: string;
    priorityColor: string;
    due_date: string | null;
    assignees: string[];
    description: string;
    listName: string;
}

export interface StatusGroup {
    id: string;
    name: string;
    color: string;
    isExpanded: boolean;
    tasks: Task[];
}
