import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import {
    getTasksForSpace,
    createTask,
    updateTask,
    deleteTask
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
    listTask : TaskWithSpaceData[];
    isLoadingTasks : boolean;
    errorTasks : string | null;
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

const initialState : TasksState = {
    listTask : [],
    isLoadingTasks : false,
    errorTasks : null

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
    }
});

export const {} = tasksSlice.actions;

export default tasksSlice.reducer;  