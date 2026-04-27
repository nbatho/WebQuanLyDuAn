import { createAsyncThunk, createSlice, type PayloadAction } from "@reduxjs/toolkit";
import {
    getTasksByListIds,
    createTaskInList,
    updateTask,
    deleteTask,
    getSubTasks,
    getAttachmentsByTask,
    createAttachment,
    deleteAttachment,
    addAssignee,
    removeAssignee,
} from "@/api/tasks";
import type { StatusGroup } from "@/types/tasks";


export interface CreateTaskData {
    list_id: number;
    name: string;
    description?: string | null;
    status_id?: number;
    priority_id?: number | null;
    due_date?: string | null;
    assignee_ids?: number[];
}
export interface TaskData {
    task_id: number;
    parent_task_id: number | null;
    space_id: number;
    sprint_id: number | null;
    milestone_id: number | null;
    status_id: number | null;
    priority_id: number | null;
    name: string;
    description: string | null;
    story_points: number | null;
    start_date: string | null;
    due_date: string | null;
    completed_at: string | null;
    position: number;
    is_archived: boolean;
    created_by: number | null;
    created_at: string;
    updated_by: number | null;
    updated_at: string;
    deleted_at: string | null;
}

export interface TaskAssignee {
    user_id: number;
    name: string;
    avatar_url: string | null;
}

export interface TaskTag {
    tag_id: number;
    name: string;
    color: string;
}

export interface TaskAttachment {
    attachment_id: number;
    task_id: number;
    url: string;
    description: string | null;
    created_at: string;
}

export interface TaskWithSpaceData extends TaskData {
    task_id: number; 
    
    space_name?: string;
    space_color?: string;
    space_deleted_at?: string | null;

    status_name?: string | null;
    status_color?: string | null;

    priority_name?: string | null;
    priority_color?: string | null;

    assignees?: TaskAssignee[]; 
    tags?: TaskTag[];
    
    subtask_count?: number;
    comment_count?: number;
}

export interface TasksState {
    listTask: StatusGroup[];
    isLoadingTasks: boolean;
    errorTasks: string | null;

    selectedTask: TaskWithSpaceData | null;
    isLoadingTaskDetail: boolean;
    errorTaskDetail: string | null;

    subTasks: TaskWithSpaceData[];
    isLoadingSubTasks: boolean;
    errorSubTasks: string | null;

    attachments: TaskAttachment[];
    isLoadingAttachments: boolean;
    errorAttachments: string | null;
    isCreatingAttachment: boolean;
    errorCreateAttachment: string | null;
    isDeletingAttachment: boolean;
    errorDeleteAttachment: string | null;

    isCreatingTask: boolean;
    errorCreateTask: string | null;
    isUpdatingTask: boolean;
    errorUpdateTask: string | null;
    isDeletingTask: boolean;
    errorDeleteTask: string | null;

    isAddingAssignee: boolean;
    errorAddAssignee: string | null;
    isRemovingAssignee: boolean;
    errorRemoveAssignee: string | null;
}


export const fetchTasksForList = createAsyncThunk<StatusGroup[], number>(
    'tasks/fetchTasksForList',
    async (list_id, { rejectWithValue }) => {
        try {
            const response = await getTasksByListIds(list_id);
            return response;
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || 'Failed to fetch tasks for list');
        }
    }
);

export const fetchCreateTask = createAsyncThunk<
    TaskWithSpaceData,
    { list_id: number; taskData: CreateTaskData }
>(
    'tasks/createTask',
    async ({ list_id, taskData }, { rejectWithValue }) => {
        try {
            const response = await createTaskInList({
                list_id,
                name: taskData.name || 'Untitled Task', 
                description: taskData.description,
                status_id: taskData.status_id,
                priority_id: taskData.priority_id,
                due_date: taskData.due_date,
                assignee_ids: taskData.assignee_ids
            });
            
            return response as unknown as TaskWithSpaceData;
        } catch (error: any) {
            return rejectWithValue(
                error.response?.data?.error || 
                error.response?.data?.message || 
                'Failed to create task'
            );
        }
    }
);

export const fetchUpdateTask = createAsyncThunk<
    TaskData,
    { task_id: number; updates: Partial<TaskData> }
>(
    'tasks/updateTask',
    async ({ task_id, updates }, { rejectWithValue }) => {
        try {
            const response = await updateTask(task_id, updates);
            return response;
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || 'Failed to update task');
        }
    }
);

export const fetchDeleteTask = createAsyncThunk<number, number>(
    'tasks/deleteTask',
    async (task_id, { rejectWithValue }) => {
        try {
            await deleteTask(task_id);
            return task_id;
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || 'Failed to delete task');
        }
    }
);

// ─────────────────────────────────────────────
// Async Thunks — Subtasks
// ─────────────────────────────────────────────

export const fetchSubTasks = createAsyncThunk<TaskWithSpaceData[], number>(
    'tasks/fetchSubTasks',
    async (task_id, { rejectWithValue }) => {
        try {
            const response = await getSubTasks(task_id);
            return response;
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || 'Failed to fetch subtasks');
        }
    }
);

// ─────────────────────────────────────────────
// Async Thunks — Attachments
// ─────────────────────────────────────────────

export const fetchAttachmentsByTask = createAsyncThunk<TaskAttachment[], number>(
    'tasks/fetchAttachmentsByTask',
    async (task_id, { rejectWithValue }) => {
        try {
            const response = await getAttachmentsByTask(task_id);
            return response;
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || 'Failed to fetch attachments');
        }
    }
);

export const fetchCreateAttachment = createAsyncThunk<
    TaskAttachment,
    { task_id: number; url: string; description?: string }
>(
    'tasks/createAttachment',
    async ({ task_id, url, description }, { rejectWithValue }) => {
        try {
            const response = await createAttachment(task_id, url, description);
            return response;
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || 'Failed to create attachment');
        }
    }
);

export const fetchDeleteAttachment = createAsyncThunk<number, number>(
    'tasks/deleteAttachment',
    async (attachment_id, { rejectWithValue }) => {
        try {
            await deleteAttachment(attachment_id);
            return attachment_id;
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || 'Failed to delete attachment');
        }
    }
);

// ─────────────────────────────────────────────
// Async Thunks — Assignees
// ─────────────────────────────────────────────

export const fetchAddAssignee = createAsyncThunk<
    { task_id: number; userId: string },
    { task_id: number; userId: string }
>(
    'tasks/addAssignee',
    async ({ task_id, userId }, { rejectWithValue }) => {
        try {
            await addAssignee(task_id, userId);
            return { task_id, userId };
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || 'Failed to add assignee');
        }
    }
);

export const fetchRemoveAssignee = createAsyncThunk<
    { task_id: number; userId: string },
    { task_id: number; userId: string }
>(
    'tasks/removeAssignee',
    async ({ task_id, userId }, { rejectWithValue }) => {
        try {
            await removeAssignee(task_id, userId);
            return { task_id, userId };
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || 'Failed to remove assignee');
        }
    }
);

// ─────────────────────────────────────────────
// Initial State
// ─────────────────────────────────────────────

const initialState: TasksState = {
    listTask: [],
    isLoadingTasks: false,
    errorTasks: null,

    selectedTask: null,
    isLoadingTaskDetail: false,
    errorTaskDetail: null,

    subTasks: [],
    isLoadingSubTasks: false,
    errorSubTasks: null,

    attachments: [],
    isLoadingAttachments: false,
    errorAttachments: null,
    isCreatingAttachment: false,
    errorCreateAttachment: null,
    isDeletingAttachment: false,
    errorDeleteAttachment: null,

    isCreatingTask: false,
    errorCreateTask: null,
    isUpdatingTask: false,
    errorUpdateTask: null,
    isDeletingTask: false,
    errorDeleteTask: null,

    isAddingAssignee: false,
    errorAddAssignee: null,
    isRemovingAssignee: false,
    errorRemoveAssignee: null,
};

export const tasksSlice = createSlice({
    name: 'tasks',
    initialState,
    reducers: {
        clearSelectedTask(state) {
            state.selectedTask = null;
            state.subTasks = [];
            state.attachments = [];
        },
        clearTasksError(state) {
            state.errorTasks = null;
            state.errorCreateTask = null;
            state.errorUpdateTask = null;
            state.errorDeleteTask = null;
        },
        setSelectedTask(state, action: PayloadAction<TaskWithSpaceData | null>) {
            state.selectedTask = action.payload;
        },
    },
    extraReducers: (builder) => {
        builder.addCase(fetchTasksForList.pending, (state) => {
            state.isLoadingTasks = true;
            state.errorTasks = null;
        });
        builder.addCase(fetchTasksForList.fulfilled, (state, action) => {
            state.isLoadingTasks = false;
            state.listTask = action.payload;
        });
        builder.addCase(fetchTasksForList.rejected, (state, action) => {
            state.isLoadingTasks = false;
            state.errorTasks = action.payload as string;
        });

        builder.addCase(fetchCreateTask.pending, (state) => {
            state.isCreatingTask = true;
            state.errorCreateTask = null;
        });
        builder.addCase(fetchCreateTask.fulfilled, (state, action) => {
                state.isCreatingTask = false;
                
                const newTask = action.payload; 
                
                const statusGroup = state.listTask.find(group => group.id === newTask.status_id);
                if (statusGroup) {
                    statusGroup.tasks.unshift(newTask);
                } else {
                    state.listTask.push({
                        id: newTask.status_id || 0,
                        name: newTask.status_name || 'No Status',
                        color: newTask.status_color || '#000000',
                        isExpanded: true,
                        tasks: [newTask],
                    });
                }
            });
        builder.addCase(fetchCreateTask.rejected, (state, action) => {
            state.isCreatingTask = false;
            state.errorCreateTask = action.payload as string;
        });
    },
});

export const { clearSelectedTask, clearTasksError, setSelectedTask } = tasksSlice.actions;

export default tasksSlice.reducer;