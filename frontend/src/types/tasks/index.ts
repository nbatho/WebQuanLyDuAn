export interface Assignee {
    user_id: number;
    name: string;
    avatar_url: string | null;
}

export interface Task {
    task_id: number;
    parent_task_id: number | null;
    list_id: number;
    space_id: number;
    folder_id: number | null;
    name: string;
    description: string | null;
    status_id: number;
    status_name: string;
    status_color: string;
    priority_id: number | null;
    priority_name: string | null;
    priority_color: string | null;
    due_date: string | null;
    position: number;
    subtask_count: number;
    subtask_done_count: number;
    comment_count: number;
    attachment_count: number;
    assignees: Assignee[];
}

export interface StatusGroup {
    id: number;
    name: string;
    color: string;
    isExpanded: boolean;
    tasks: Task[];
}

export interface NewTaskData {
    name: string;
    description?: string | null;
    list_id: number;
    parent_task_id?: number | null;
    status_id?: number;
    priority_id?: number | null;
    due_date?: string | null;
    assignee_ids?: number[];
}