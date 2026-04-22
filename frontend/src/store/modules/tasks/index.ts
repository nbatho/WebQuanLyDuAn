import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import {
    getTasksForSpace,
    getTaskById,
    createTask,
    updateTask,
    deleteTask,
} from "@/api/tasks";
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
    listTask: TaskWithSpaceData[];
    selectedTask: TaskWithSpaceData | null;
    isLoadingTasks: boolean;
    errorTasks: string | null;
    isCreatingTask: boolean;
    errorCreateTask: string | null;
    isUpdatingTask: boolean;
    errorUpdateTask: string | null;
    isDeletingTask: boolean;
    errorDeleteTask: string | null;
}

export const fetchTasksForSpace = createAsyncThunk<TaskWithSpaceData[], number>(
    'tasks/fetchTasksForSpace',
    async (space_id: number, { rejectWithValue }) => {
        try {
            const response = await getTasksForSpace(space_id);
            return response;
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || 'Failed to fetch tasks');
        }
    }
);
export const fetchCreateTask = createAsyncThunk<TaskData, { space_id: number; taskData: TaskData }>(
    'tasks/createTask',
    async ({ space_id, taskData }, { rejectWithValue }) => {
        try {

            const response = await createTask(space_id, taskData);
            return response;
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || 'Failed to create task');
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

export const fetchUpdateTask = createAsyncThunk<TaskData, { task_id: number; updates: Partial<TaskData> }>(
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

const initialState: TasksState = {
    listTask: [],
    selectedTask: null,
    isLoadingTasks: false,
    errorTasks: null,
    isCreatingTask: false,
    errorCreateTask: null,
    isUpdatingTask: false,
    errorUpdateTask: null,
    isDeletingTask: false,
    errorDeleteTask: null,
};

export const tasksSlice = createSlice({
    name : 'tasks',
    initialState,
    reducers : {
    },
    extraReducers : (builder) => {
        builder.addCase(fetchTasksForSpace.pending, (state) => {
            state.isLoadingTasks = true;
            state.errorTasks = null;
        });
        builder.addCase(fetchTasksForSpace.fulfilled, (state, action) => {
            state.listTask = action.payload;
            state.isLoadingTasks = false;
            state.errorTasks = null;
        });
        builder.addCase(fetchTasksForSpace.rejected, (state, action) => {
            state.isLoadingTasks = false;
            state.errorTasks = action.payload as string;
        });
        builder.addCase(fetchCreateTask.pending, (state) => {
            state.isCreatingTask = true;
            state.errorCreateTask = null;
        });
        builder.addCase(fetchCreateTask.fulfilled, (state) => {
            state.isCreatingTask = false;
            state.errorCreateTask = null;
        });
        builder.addCase(fetchCreateTask.rejected, (state, action) => {
            state.isCreatingTask = false;
            state.errorCreateTask = action.payload as string;
        });

        builder.addCase(fetchTaskById.fulfilled, (state, action) => {
            state.selectedTask = action.payload;
        });

        builder.addCase(fetchUpdateTask.pending, (state) => {
            state.isUpdatingTask = true;
            state.errorUpdateTask = null;
        });
        builder.addCase(fetchUpdateTask.fulfilled, (state, action) => {
            state.isUpdatingTask = false;
            const index = state.listTask.findIndex(t => t.task_id === action.payload.task_id);
            if (index !== -1) {
                state.listTask[index] = { ...state.listTask[index], ...action.payload };
            }
        });
        builder.addCase(fetchUpdateTask.rejected, (state, action) => {
            state.isUpdatingTask = false;
            state.errorUpdateTask = action.payload as string;
        });

        builder.addCase(fetchDeleteTask.pending, (state) => {
            state.isDeletingTask = true;
            state.errorDeleteTask = null;
        });
        builder.addCase(fetchDeleteTask.fulfilled, (state, action) => {
            state.isDeletingTask = false;
            state.listTask = state.listTask.filter(t => t.task_id !== action.payload);
        });
        builder.addCase(fetchDeleteTask.rejected, (state, action) => {
            state.isDeletingTask = false;
            state.errorDeleteTask = action.payload as string;
        });
    }
});

export const {} = tasksSlice.actions;

export default tasksSlice.reducer;  