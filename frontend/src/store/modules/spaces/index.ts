import { createSlice , createAsyncThunk } from '@reduxjs/toolkit';
import {
    getSpacesForWorkspace,
    createSpace,
    updateSpace,
    deleteSpace
} from "@/api/spaces";

export interface SpaceData {
    space_id : number;
    workspace_id : number;
    name : string;
    description : string;
    color : string;
    is_private : boolean;
    create_by : number | null;
    create_at : string;
    update_by : number | null;
    update_at : string;
    deleted_at : string | null;
}

export interface SpacesState {
    listSpaces : SpaceData[];
    isLoadingSpaces : boolean;
    errorSpaces : string | null;
    isCreatingSpaces : boolean;
    errorCreating: string | null;
    isUpdatingSpaces : boolean;
    errorUpdating : string | null;
}


export const fetchSpacesForWorkspace = createAsyncThunk<SpaceData[], number>(
    'spaces/fetchSpacesForWorkspace',
    async (workspace_id: number, { rejectWithValue }) => {
        try {
            const response = await getSpacesForWorkspace(workspace_id);
            return response;
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || 'Failed to fetch spaces');
        }
    }
);

export const fetchCreateSpace = createAsyncThunk<SpaceData, { workspace_id: number; name: string; description: string; color: string; is_private?: boolean }>(
    'spaces/createSpace',
    async ({ workspace_id, name, description, color, is_private }, { rejectWithValue }) => {
        try {
            const respone = await createSpace(workspace_id, name, description, color, is_private);
            return respone;
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || 'Failed to create space');
        }
    }
);

export const fetchUpdateSpace = createAsyncThunk<SpaceData, { space_id: number; name: string; description: string; color: string }>( 
    'spaces/updateSpace',
    async ({ space_id, name, description, color }, { rejectWithValue }) => {
        try {
            const response = await updateSpace(space_id, name, description, color);
            return response;
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || 'Failed to update space');
        }
    }
);


const initialState : SpacesState = {
    listSpaces : [],
    isLoadingSpaces : false,
    errorSpaces : null,
    isCreatingSpaces : false,
    errorCreating : null,
    isUpdatingSpaces : false,
    errorUpdating : null,
};

export const spacesSlice = createSlice({
    name : 'spaces',
    initialState,
    reducers : {
    },
    extraReducers : (builder) => {
        builder
            .addCase(fetchSpacesForWorkspace.pending, (state) => {
                state.isLoadingSpaces = true;
                state.errorSpaces = null;
            })
            .addCase(fetchSpacesForWorkspace.fulfilled, (state, action) => {
                state.isLoadingSpaces = false;
                state.listSpaces = action.payload;
            })
            .addCase(fetchSpacesForWorkspace.rejected, (state, action) => {
                state.isLoadingSpaces = false;
                state.errorSpaces = action.payload as string;
            })
            .addCase(fetchCreateSpace.pending, (state) => {
                state.isCreatingSpaces = true;
                state.errorCreating = null;
            })
            .addCase(fetchCreateSpace.fulfilled, (state, action) => {
                state.isCreatingSpaces = false;
                state.listSpaces.push(action.payload);
            })
            .addCase(fetchCreateSpace.rejected, (state, action) => {
                state.isCreatingSpaces = false;
                state.errorCreating = action.payload as string;
            })
            .addCase(fetchUpdateSpace.pending, (state) => { 
                state.isUpdatingSpaces = true;
                state.errorUpdating = null;
            })
            .addCase(fetchUpdateSpace.fulfilled, (state, action) => {
                const index = state.listSpaces.findIndex(space => space.space_id === action.payload.space_id);
                if (index !== -1) {
                    state.listSpaces[index] = action.payload;
                }
            })
            .addCase(fetchUpdateSpace.rejected, (state, action) => {
                state.isUpdatingSpaces = false;
                state.errorUpdating = action.payload as string;
            })

    }
});

export const {} = spacesSlice.actions;

export default spacesSlice.reducer;