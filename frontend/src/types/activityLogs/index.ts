export interface ActivityLog {
    activity_id: number;
    task_id: number;
    user_id: number | null;
    action: ActivityAction;
    old_value: unknown;
    new_value: unknown;
    created_at: string;
    // Joined fields from BE query
    username: string | null;
    user_name: string | null;
    avatar_url: string | null;
}

export type ActivityAction =
    | 'created'
    | 'updated'
    | 'deleted'
    | 'status_changed'
    | 'priority_changed'
    | 'assigned'
    | 'unassigned'
    | 'commented'
    | 'attachment_added'
    | 'attachment_removed'
    | 'due_date_changed'
    | 'start_date_changed'
    | 'moved'
    | 'archived'
    | 'restored'
    | 'timer_started'
    | 'timer_stopped'
    | 'sprint_assigned'
    | 'milestone_assigned'
    | 'tag_added'
    | 'tag_removed'
    | 'subtask_added'
    | 'story_points_changed';
