export interface Task {
    task_id: number;
    space_id: number;
    folder_id: number | null;
    list_id: number | null;
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
    listId: number;
}

export interface StatusGroup {
    id: string;
    name: string;
    color: string;
    isExpanded: boolean;
    tasks: Task[];
}
