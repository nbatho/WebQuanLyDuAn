import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import {
    getPrioritiesBySpace,
    getPriorityById,
    createTaskPriority,
    updateTaskPriority,
    deleteTaskPriority,
    reorderPriority,
} from '@/api/priorities';

export interface PriorityData {
    priority_id: number;
    space_id: number;
    priority_name: string;
    color: string | null;
    position: number;
    created_at: string;
    updated_at: string;
}

export interface PrioritiesState {
    listPriorities: PriorityData[];
    selectedPriority: PriorityData | null;
    isLoadingPriorities: boolean;
    errorPriorities: string | null;
    isCreatingPriority: boolean;
    errorCreatingPriority: string | null;
    isUpdatingPriority: boolean;
    errorUpdatingPriority: string | null;
    isDeletingPriority: boolean;
    errorDeletingPriority: string | null;
}

export const fetchPrioritiesBySpace = createAsyncThunk<PriorityData[], number>(
    'priorities/fetchPrioritiesBySpace',
    async (spaceId, { rejectWithValue }) => {
        try {
            const response = await getPrioritiesBySpace(spaceId);
            return response;
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || 'Failed to fetch priorities');
        }
    },
);

export const fetchPriorityById = createAsyncThunk<PriorityData, number>(
    'priorities/fetchPriorityById',
    async (priorityId, { rejectWithValue }) => {
        try {
            const response = await getPriorityById(priorityId);
            return response;
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || 'Failed to fetch priority');
        }
    },
);

export const fetchCreatePriority = createAsyncThunk<
    PriorityData,
    { spaceId: number; priorityName: string; color?: string; position?: number }
>(
    'priorities/createPriority',
    async ({ spaceId, ...body }, { rejectWithValue }) => {
        try {
            const response = await createTaskPriority(spaceId, body);
            return response;
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || 'Failed to create priority');
        }
    },
);

export const fetchUpdatePriority = createAsyncThunk<
    PriorityData,
    { priorityId: number; priorityName?: string; color?: string }
>(
    'priorities/updatePriority',
    async ({ priorityId, ...body }, { rejectWithValue }) => {
        try {
            const response = await updateTaskPriority(priorityId, body);
            return response;
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || 'Failed to update priority');
        }
    },
);

export const fetchDeletePriority = createAsyncThunk<number, number>(
    'priorities/deletePriority',
    async (priorityId, { rejectWithValue }) => {
        try {
            await deleteTaskPriority(priorityId);
            return priorityId;
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || 'Failed to delete priority');
        }
    },
);

export const fetchReorderPriority = createAsyncThunk<
    PriorityData,
    { priorityId: number; position: number }
>(
    'priorities/reorderPriority',
    async ({ priorityId, position }, { rejectWithValue }) => {
        try {
            const response = await reorderPriority(priorityId, position);
            return response;
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || 'Failed to reorder priority');
        }
    },
);

const initialState: PrioritiesState = {
    listPriorities: [],
    selectedPriority: null,
    isLoadingPriorities: false,
    errorPriorities: null,
    isCreatingPriority: false,
    errorCreatingPriority: null,
    isUpdatingPriority: false,
    errorUpdatingPriority: null,
    isDeletingPriority: false,
    errorDeletingPriority: null,
};

export const prioritiesSlice = createSlice({
    name: 'priorities',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchPrioritiesBySpace.pending, (state) => {
                state.isLoadingPriorities = true;
                state.errorPriorities = null;
            })
            .addCase(fetchPrioritiesBySpace.fulfilled, (state, action) => {
                state.isLoadingPriorities = false;
                state.listPriorities = action.payload;
            })
            .addCase(fetchPrioritiesBySpace.rejected, (state, action) => {
                state.isLoadingPriorities = false;
                state.errorPriorities = action.payload as string;
            })

            .addCase(fetchPriorityById.fulfilled, (state, action) => {
                state.selectedPriority = action.payload;
            })

            .addCase(fetchCreatePriority.pending, (state) => {
                state.isCreatingPriority = true;
                state.errorCreatingPriority = null;
            })
            .addCase(fetchCreatePriority.fulfilled, (state, action) => {
                state.isCreatingPriority = false;
                state.listPriorities.push(action.payload);
            })
            .addCase(fetchCreatePriority.rejected, (state, action) => {
                state.isCreatingPriority = false;
                state.errorCreatingPriority = action.payload as string;
            })

            .addCase(fetchUpdatePriority.pending, (state) => {
                state.isUpdatingPriority = true;
                state.errorUpdatingPriority = null;
            })
            .addCase(fetchUpdatePriority.fulfilled, (state, action) => {
                state.isUpdatingPriority = false;
                const index = state.listPriorities.findIndex(p => p.priority_id === action.payload.priority_id);
                if (index !== -1) {
                    state.listPriorities[index] = action.payload;
                }
            })
            .addCase(fetchUpdatePriority.rejected, (state, action) => {
                state.isUpdatingPriority = false;
                state.errorUpdatingPriority = action.payload as string;
            })

            .addCase(fetchDeletePriority.pending, (state) => {
                state.isDeletingPriority = true;
                state.errorDeletingPriority = null;
            })
            .addCase(fetchDeletePriority.fulfilled, (state, action) => {
                state.isDeletingPriority = false;
                state.listPriorities = state.listPriorities.filter(p => p.priority_id !== action.payload);
            })
            .addCase(fetchDeletePriority.rejected, (state, action) => {
                state.isDeletingPriority = false;
                state.errorDeletingPriority = action.payload as string;
            })

            .addCase(fetchReorderPriority.fulfilled, (state, action) => {
                const index = state.listPriorities.findIndex(p => p.priority_id === action.payload.priority_id);
                if (index !== -1) {
                    state.listPriorities[index] = action.payload;
                }
                state.listPriorities.sort((a, b) => a.position - b.position);
            });
    },
});

export const {} = prioritiesSlice.actions;

export default prioritiesSlice.reducer;
