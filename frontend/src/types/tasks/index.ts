/* ── Types ── */

export interface SubTask {
    id: string; title: string; status: string; statusColor: string; assignee?: string;
}
export interface Task {
    id: string; 
    title: string; 
    status: string; 
    statusColor: string;
    priority: string; 
    priorityColor: string; 
    dueDate: string | null;
    assignees: string[]; 
    comments: number; 
    subtasks: SubTask[];
    description?: string;
}

export interface StatusGroup {
    id: string; name: string; color: string; tasks: Task[]; isExpanded: boolean;
}