export interface WorkspaceMemberData {
    user_id: number;
    username: string;
    email: string;
    role: string;
    avatar_url: string;
    role_name: string;
}

/** Mirrors PostgreSQL `workspaces` columns (snake_case). */
export interface WorkspacesData {
    workspace_id: number;
    name: string;
    slug: string;
    description: string | null;
    plan?: string;
    created_by: number | null;
    created_at?: string;
    updated_at?: string;
}

export interface WorkspacesState {
    listWorkspaces: WorkspacesData[];
    currentWorkspaceId: number | null;
    isLoadingWorkspaces: boolean;
    isSendingInvitations: boolean;
    error: string | null;
}