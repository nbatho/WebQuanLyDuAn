import { createSlice, createAsyncThunk, type PayloadAction } from '@reduxjs/toolkit';
import {
    getWorkspaces,
    createWorkspace,
    updateWorkspace,
    deleteWorkspace,
    getWorkspaceById,
    getWorkspaceMembers,
} from '../../../api/workspaces';
import type { WorkspacesData, WorkspaceMemberData, WorkspacesState } from '../../../types/workspaces';
import {
    persistCurrentWorkspaceId,
    readStoredWorkspaceId,
} from '../../../utils/workspaceStorage';

export const fetchWorkspaces = createAsyncThunk<WorkspacesData[], void, { rejectValue: string }>(
    'workspaces/fetchWorkspaces',
    async (_, { rejectWithValue }) => {
        try {
            const response = await getWorkspaces();
            return Array.isArray(response) ? response : [];
        } catch (error: unknown) {
            const msg = error instanceof Error ? error.message : 'Failed to fetch workspaces';
            return rejectWithValue(msg);
        }
    },
);

export const addWorkspace = createAsyncThunk<
    WorkspacesData,
    { name: string; slug: string; description: string },
    { rejectValue: string }
>('workspaces/addWorkspace', async (body, { rejectWithValue }) => {
    try {
        const response = await createWorkspace(body.name, body.slug, body.description);
        return response;
    } catch (error: unknown) {
        const msg =
            (error as { response?: { data?: { error?: string } } })?.response?.data?.error ||
            (error instanceof Error ? error.message : 'Failed to create workspace');
        return rejectWithValue(typeof msg === 'string' ? msg : 'Failed to create workspace');
    }
});

export const editWorkspace = createAsyncThunk<
    WorkspacesData,
    { workspace_id: number; name: string; slug: string; description: string },
    { rejectValue: string }
>('workspaces/editWorkspace', async (body, { rejectWithValue }) => {
    try {
        const response = await updateWorkspace(
            body.workspace_id,
            body.name,
            body.slug,
            body.description,
        );
        return response;
    } catch (error: unknown) {
        const msg = error instanceof Error ? error.message : 'Failed to update workspace';
        return rejectWithValue(msg);
    }
});

export const removeWorkspace = createAsyncThunk<number, { workspace_id: number; owner_id: number }, { rejectValue: string }>(
    'workspaces/removeWorkspace',
    async ({ workspace_id, owner_id }, { rejectWithValue }) => {
        try {
            await deleteWorkspace(workspace_id, owner_id);
            return workspace_id;
        } catch (error: unknown) {
            const msg = error instanceof Error ? error.message : 'Failed to delete workspace';
            return rejectWithValue(msg);
        }
    },
);

export const fetchWorkspaceById = createAsyncThunk<WorkspacesData, number, { rejectValue: string }>(
    'workspaces/fetchWorkspaceById',
    async (workspace_id, { rejectWithValue }) => {
        try {
            const response = await getWorkspaceById(workspace_id);
            return response;
        } catch (error: unknown) {
            const msg = error instanceof Error ? error.message : 'Failed to fetch workspace details';
            return rejectWithValue(msg);
        }
    },
);

export const fetchWorkspaceMembers = createAsyncThunk<
    WorkspaceMemberData[],
    number,
    { rejectValue: string }
>('workspaces/fetchWorkspaceMembers', async (workspace_id, { rejectWithValue }) => {
    try {
        const response = await getWorkspaceMembers(workspace_id);
        return Array.isArray(response) ? response : [];
    } catch (error: unknown) {
        const msg = error instanceof Error ? error.message : 'Failed to fetch workspace members';
        return rejectWithValue(msg);
    }
});



const initialState: WorkspacesState = {
    listWorkspaces: [],
    currentWorkspaceId: readStoredWorkspaceId(),
    isLoadingWorkspaces: false,
    error: null,
};

const workspacesSlice = createSlice({
    name: 'workspaces',
    initialState,
    reducers: {
        setCurrentWorkspaceId(state, action: PayloadAction<number | null>) {
            state.currentWorkspaceId = action.payload;
            persistCurrentWorkspaceId(action.payload);
        },
        clearWorkspacesError(state) {
            state.error = null;
        },
    },
    extraReducers: (builder) => {
        builder.addCase(fetchWorkspaces.pending, (state) => {
            state.isLoadingWorkspaces = true;
            state.error = null;
        });
        builder.addCase(fetchWorkspaces.fulfilled, (state, action) => {
            state.isLoadingWorkspaces = false;
            state.listWorkspaces = action.payload;
            const ids = action.payload.map((w) => w.workspace_id);
            if (ids.length === 0) {
                state.currentWorkspaceId = null;
                persistCurrentWorkspaceId(null);
                return;
            }
            if (
                state.currentWorkspaceId != null &&
                !ids.includes(state.currentWorkspaceId)
            ) {
                state.currentWorkspaceId = ids[0]!;
                persistCurrentWorkspaceId(ids[0]!);
            }
            if (state.currentWorkspaceId == null) {
                state.currentWorkspaceId = ids[0]!;
                persistCurrentWorkspaceId(ids[0]!);
            }
        });
        builder.addCase(fetchWorkspaces.rejected, (state, action) => {
            state.isLoadingWorkspaces = false;
            state.error = action.payload || action.error.message || 'Failed to fetch workspaces';
        });

        builder.addCase(addWorkspace.pending, (state) => {
            state.error = null;
        });
        builder.addCase(addWorkspace.fulfilled, (state, action) => {
            state.listWorkspaces.push(action.payload);
            state.currentWorkspaceId = action.payload.workspace_id;
            persistCurrentWorkspaceId(action.payload.workspace_id);
        });
        builder.addCase(addWorkspace.rejected, (state, action) => {
            state.error = action.payload || action.error.message || 'Failed to create workspace';
        });

        builder.addCase(removeWorkspace.fulfilled, (state, action) => {
            state.listWorkspaces = state.listWorkspaces.filter(
                (w) => w.workspace_id !== action.payload,
            );
            if (state.currentWorkspaceId === action.payload) {
                const next = state.listWorkspaces[0]?.workspace_id ?? null;
                state.currentWorkspaceId = next;
                persistCurrentWorkspaceId(next);
            }
        });
    },
});

export const { setCurrentWorkspaceId, clearWorkspacesError } = workspacesSlice.actions;
export default workspacesSlice.reducer;
