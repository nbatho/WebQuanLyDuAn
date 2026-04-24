import { createAsyncThunk, createSlice, type PayloadAction } from "@reduxjs/toolkit";
import {
    getTasksForSpace,
    getTaskById,
    createTask,
    updateTask,
    deleteTask,
    getSubTasks,
    getAttachmentsByTask,
    createAttachment,
    deleteAttachment,
    addAssignee,
    removeAssignee,
} from "@/api/tasks";

// ─────────────────────────────────────────────
// Interfaces / Types
// ─────────────────────────────────────────────

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
    space_name: string;
    space_color: string;
    space_deleted_at?: string | null;

    status_name: string | null;
    status_color: string | null;

    priority_name: string | null;
    priority_color: string | null;

    assignees: TaskAssignee[];
    tags: TaskTag[];
}

export interface TasksState {
    // Task list
    listTask: TaskWithSpaceData[];
    isLoadingTasks: boolean;
    errorTasks: string | null;

    // Selected task detail
    selectedTask: TaskWithSpaceData | null;
    isLoadingTaskDetail: boolean;
    errorTaskDetail: string | null;

    // Subtasks
    subTasks: TaskWithSpaceData[];
    isLoadingSubTasks: boolean;
    errorSubTasks: string | null;

    // Attachments
    attachments: TaskAttachment[];
    isLoadingAttachments: boolean;
    errorAttachments: string | null;
    isCreatingAttachment: boolean;
    errorCreateAttachment: string | null;
    isDeletingAttachment: boolean;
    errorDeleteAttachment: string | null;

    // Create / Update / Delete task
    isCreatingTask: boolean;
    errorCreateTask: string | null;
    isUpdatingTask: boolean;
    errorUpdateTask: string | null;
    isDeletingTask: boolean;
    errorDeleteTask: string | null;

    // Assignees
    isAddingAssignee: boolean;
    errorAddAssignee: string | null;
    isRemovingAssignee: boolean;
    errorRemoveAssignee: string | null;
}

// ─────────────────────────────────────────────
// Async Thunks — Task CRUD
// ─────────────────────────────────────────────

export const fetchTasksForSpace = createAsyncThunk<TaskWithSpaceData[], number>(
    'tasks/fetchTasksForSpace',
    async (space_id, { rejectWithValue }) => {
        try {
            const response = await getTasksForSpace(space_id);
            return response;
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || 'Failed to fetch tasks');
        }
    }
);

export const fetchTaskById = createAsyncThunk<TaskWithSpaceData, number>(
    'tasks/fetchTaskById',
    async (task_id, { rejectWithValue }) => {
        try {
            const response = await getTaskById(task_id);
            return response;
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || 'Failed to fetch task');
        }
    }
);

export const fetchCreateTask = createAsyncThunk<
    TaskWithSpaceData,
    { space_id: number; taskData: Partial<TaskData> }
>(
    'tasks/createTask',
    async ({ space_id, taskData }, { rejectWithValue }) => {
        try {
            const response = await createTask(space_id, taskData);
            return response as unknown as TaskWithSpaceData;
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || 'Failed to create task');
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

// ─────────────────────────────────────────────
// Slice
// ─────────────────────────────────────────────

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
        // ── fetchTasksForSpace ──────────────────────
        builder
            .addCase(fetchTasksForSpace.pending, (state) => {
                state.isLoadingTasks = true;
                state.errorTasks = null;
            })
            .addCase(fetchTasksForSpace.fulfilled, (state, action) => {
                state.isLoadingTasks = false;
                state.listTask = action.payload;
            })
            .addCase(fetchTasksForSpace.rejected, (state, action) => {
                state.isLoadingTasks = false;
                state.errorTasks = action.payload as string;
            });

        // ── fetchTaskById ───────────────────────────
        builder
            .addCase(fetchTaskById.pending, (state) => {
                state.isLoadingTaskDetail = true;
                state.errorTaskDetail = null;
            })
            .addCase(fetchTaskById.fulfilled, (state, action) => {
                state.isLoadingTaskDetail = false;
                state.selectedTask = action.payload;
            })
            .addCase(fetchTaskById.rejected, (state, action) => {
                state.isLoadingTaskDetail = false;
                state.errorTaskDetail = action.payload as string;
            });

        // ── fetchCreateTask ─────────────────────────
        builder
            .addCase(fetchCreateTask.pending, (state) => {
                state.isCreatingTask = true;
                state.errorCreateTask = null;
            })
            .addCase(fetchCreateTask.fulfilled, (state, action) => {
                state.isCreatingTask = false;
                state.listTask.push(action.payload);
            })
            .addCase(fetchCreateTask.rejected, (state, action) => {
                state.isCreatingTask = false;
                state.errorCreateTask = action.payload as string;
            });

        // ── fetchUpdateTask ─────────────────────────
        builder
            .addCase(fetchUpdateTask.pending, (state) => {
                state.isUpdatingTask = true;
                state.errorUpdateTask = null;
            })
            .addCase(fetchUpdateTask.fulfilled, (state, action) => {
                state.isUpdatingTask = false;
                const index = state.listTask.findIndex(t => t.task_id === action.payload.task_id);
                if (index !== -1) {
                    state.listTask[index] = { ...state.listTask[index], ...action.payload };
                }
                if (state.selectedTask?.task_id === action.payload.task_id) {
                    state.selectedTask = { ...state.selectedTask, ...action.payload };
                }
            })
            .addCase(fetchUpdateTask.rejected, (state, action) => {
                state.isUpdatingTask = false;
                state.errorUpdateTask = action.payload as string;
            });

        // ── fetchDeleteTask ─────────────────────────
        builder
            .addCase(fetchDeleteTask.pending, (state) => {
                state.isDeletingTask = true;
                state.errorDeleteTask = null;
            })
            .addCase(fetchDeleteTask.fulfilled, (state, action) => {
                state.isDeletingTask = false;
                state.listTask = state.listTask.filter(t => t.task_id !== action.payload);
                if (state.selectedTask?.task_id === action.payload) {
                    state.selectedTask = null;
                }
            })
            .addCase(fetchDeleteTask.rejected, (state, action) => {
                state.isDeletingTask = false;
                state.errorDeleteTask = action.payload as string;
            });

        // ── fetchSubTasks ───────────────────────────
        builder
            .addCase(fetchSubTasks.pending, (state) => {
                state.isLoadingSubTasks = true;
                state.errorSubTasks = null;
            })
            .addCase(fetchSubTasks.fulfilled, (state, action) => {
                state.isLoadingSubTasks = false;
                state.subTasks = action.payload;
            })
            .addCase(fetchSubTasks.rejected, (state, action) => {
                state.isLoadingSubTasks = false;
                state.errorSubTasks = action.payload as string;
            });

        // ── fetchAttachmentsByTask ──────────────────
        builder
            .addCase(fetchAttachmentsByTask.pending, (state) => {
                state.isLoadingAttachments = true;
                state.errorAttachments = null;
            })
            .addCase(fetchAttachmentsByTask.fulfilled, (state, action) => {
                state.isLoadingAttachments = false;
                state.attachments = action.payload;
            })
            .addCase(fetchAttachmentsByTask.rejected, (state, action) => {
                state.isLoadingAttachments = false;
                state.errorAttachments = action.payload as string;
            });

        // ── fetchCreateAttachment ───────────────────
        builder
            .addCase(fetchCreateAttachment.pending, (state) => {
                state.isCreatingAttachment = true;
                state.errorCreateAttachment = null;
            })
            .addCase(fetchCreateAttachment.fulfilled, (state, action) => {
                state.isCreatingAttachment = false;
                state.attachments.push(action.payload);
            })
            .addCase(fetchCreateAttachment.rejected, (state, action) => {
                state.isCreatingAttachment = false;
                state.errorCreateAttachment = action.payload as string;
            });

        // ── fetchDeleteAttachment ───────────────────
        builder
            .addCase(fetchDeleteAttachment.pending, (state) => {
                state.isDeletingAttachment = true;
                state.errorDeleteAttachment = null;
            })
            .addCase(fetchDeleteAttachment.fulfilled, (state, action) => {
                state.isDeletingAttachment = false;
                state.attachments = state.attachments.filter(a => a.attachment_id !== action.payload);
            })
            .addCase(fetchDeleteAttachment.rejected, (state, action) => {
                state.isDeletingAttachment = false;
                state.errorDeleteAttachment = action.payload as string;
            });

        // ── fetchAddAssignee ────────────────────────
        builder
            .addCase(fetchAddAssignee.pending, (state) => {
                state.isAddingAssignee = true;
                state.errorAddAssignee = null;
            })
            .addCase(fetchAddAssignee.fulfilled, (state) => {
                state.isAddingAssignee = false;
            })
            .addCase(fetchAddAssignee.rejected, (state, action) => {
                state.isAddingAssignee = false;
                state.errorAddAssignee = action.payload as string;
            });

        // ── fetchRemoveAssignee ─────────────────────
        builder
            .addCase(fetchRemoveAssignee.pending, (state) => {
                state.isRemovingAssignee = true;
                state.errorRemoveAssignee = null;
            })
            .addCase(fetchRemoveAssignee.fulfilled, (state, action) => {
                state.isRemovingAssignee = false;
                // Cập nhật assignees trong selectedTask nếu đang mở
                if (state.selectedTask) {
                    state.selectedTask.assignees = state.selectedTask.assignees.filter(
                        a => String(a.user_id) !== action.payload.userId
                    );
                }
            })
            .addCase(fetchRemoveAssignee.rejected, (state, action) => {
                state.isRemovingAssignee = false;
                state.errorRemoveAssignee = action.payload as string;
            });
    },
});

export const { clearSelectedTask, clearTasksError, setSelectedTask } = tasksSlice.actions;

export default tasksSlice.reducer;