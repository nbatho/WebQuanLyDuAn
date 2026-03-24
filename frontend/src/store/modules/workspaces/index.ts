import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { getWorkspaces, createWorkspace, updateWorkspace, deleteWorkspace, getWorkspaceById, getWorkspaceMembers } from "../../../api/workspaces";

export const fetchWorkspaces = createAsyncThunk<WorkspacesData[], void, { rejectValue: string }>(
    "workspaces/fetchWorkspaces",
    async (_, { rejectWithValue }) => {
        try {
            const response = await getWorkspaces();
            return response.data;
        } catch (error: any) {
            return rejectWithValue(error?.message || "Failed to fetch workspaces");
        }
    }
);

export const addWorkspace = createAsyncThunk<WorkspacesData, { name: string; slug: string; description: string }, { rejectValue: string }>(
    "workspaces/addWorkspace",
    async ({ name, slug, description }, { rejectWithValue }) => {
        try {
            const response = await createWorkspace(name, slug, description);
            return response.data;
        } catch (error: any) {
            return rejectWithValue(error?.message || "Failed to create workspace");
        }   
    }
);

export const editWorkspace = createAsyncThunk<WorkspacesData, { workspace_id: number; name: string; slug: string; description: string }, { rejectValue: string }>(
    "workspaces/editWorkspace",
    async ({ workspace_id, name, slug, description }, { rejectWithValue }) => {
        try {
            const response = await updateWorkspace(workspace_id, name, slug, description);
            return response.data;
        } catch (error: any) {
            return rejectWithValue(error?.message || "Failed to update workspace");
        }
    }
);
export const removeWorkspace = createAsyncThunk<number, { workspace_id: number; owner_id: number }, { rejectValue: string }>(
    "workspaces/removeWorkspace",
    async ({ workspace_id, owner_id }, { rejectWithValue }) => {
        try {
            await deleteWorkspace(workspace_id, owner_id);
            return workspace_id;
        } catch (error: any) {
            return rejectWithValue(error?.message || "Failed to delete workspace");
        }
    }
);
export const fetchWorkspaceById = createAsyncThunk<WorkspacesData, number, { rejectValue: string }>(
    "workspaces/fetchWorkspaceById",
    async (workspace_id, { rejectWithValue }) => {
        try {
            const response = await getWorkspaceById(workspace_id);
            return response.data;
        } catch (error: any) {
            return rejectWithValue(error?.message || "Failed to fetch workspace details");
        }
    }
);
export const fetchWorkspaceMembers = createAsyncThunk<WorkspaceMemberData[], number, { rejectValue: string }>(
    "workspaces/fetchWorkspaceMembers",
    async (workspace_id, { rejectWithValue }) => {
        try {
            const response = await getWorkspaceMembers(workspace_id);
            return response.data;
        } catch (error: any) {
            return rejectWithValue(error?.message || "Failed to fetch workspace members");
        }       
    }
);
export interface WorkspaceMemberData {
    user_id: number;
    username: string;
    email: string;
    role: string;
    avatar_url: string;
    role_name: string;
}
export interface WorkspacesData {
    workspace_id: number;
    name: string;
    slug: string;
    description: string;
    plan : string;
    created_by: number;
    createdAt: string;
    updatedAt: string;
}
export interface WorkspacesState {
    listWorkspaces: WorkspacesData[];
    isLoadingWorkspaces: boolean;
    error: string | null;
}
const initialState: WorkspacesState = {
    listWorkspaces: [],
    isLoadingWorkspaces: false,
    error: null,
};

const workspacesSlice = createSlice({
    name: "workspaces",
    initialState,
    reducers: {

    },
    extraReducers: (builder) => {
        builder.addCase(fetchWorkspaces.pending, (state) => {
            state.isLoadingWorkspaces = true;
            state.error = null;
        });
        builder.addCase(fetchWorkspaces.fulfilled, (state, action) => {
            state.isLoadingWorkspaces = false;
            state.listWorkspaces = action.payload;
        });
        builder.addCase(fetchWorkspaces.rejected, (state, action) => {
            state.isLoadingWorkspaces = false;
            state.error = action.payload || action.error.message || "Failed to fetch workspaces";
        });
    },
});
export const {
    
} = workspacesSlice.actions;
export default workspacesSlice.reducer;

