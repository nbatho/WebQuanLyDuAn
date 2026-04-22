import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import {
    getTagsBySpace,
    getTagById,
    createTag,
    updateTag,
    deleteTag,
    getTaskTags,
    addTagToTask,
    removeTagFromTask,
} from '@/api/tags';

export interface TagData {
    tag_id: number;
    space_id: number;
    name: string;
    color: string | null;
    created_at: string;
    updated_at: string;
}

export interface TagsState {
    listTags: TagData[];
    taskTags: TagData[];
    selectedTag: TagData | null;
    isLoadingTags: boolean;
    errorTags: string | null;
    isCreatingTag: boolean;
    errorCreatingTag: string | null;
    isUpdatingTag: boolean;
    errorUpdatingTag: string | null;
    isDeletingTag: boolean;
    errorDeletingTag: string | null;
}

export const fetchTagsBySpace = createAsyncThunk<TagData[], number>(
    'tags/fetchTagsBySpace',
    async (spaceId, { rejectWithValue }) => {
        try {
            const response = await getTagsBySpace(spaceId);
            return response;
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || 'Failed to fetch tags');
        }
    },
);

export const fetchTagById = createAsyncThunk<TagData, number>(
    'tags/fetchTagById',
    async (tagId, { rejectWithValue }) => {
        try {
            const response = await getTagById(tagId);
            return response;
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || 'Failed to fetch tag');
        }
    },
);

export const fetchCreateTag = createAsyncThunk<
    TagData,
    { spaceId: number; name: string; color?: string }
>(
    'tags/createTag',
    async ({ spaceId, ...body }, { rejectWithValue }) => {
        try {
            const response = await createTag(spaceId, body);
            return response;
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || 'Failed to create tag');
        }
    },
);

export const fetchUpdateTag = createAsyncThunk<
    TagData,
    { tagId: number; name?: string; color?: string }
>(
    'tags/updateTag',
    async ({ tagId, ...body }, { rejectWithValue }) => {
        try {
            const response = await updateTag(tagId, body);
            return response;
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || 'Failed to update tag');
        }
    },
);

export const fetchDeleteTag = createAsyncThunk<number, number>(
    'tags/deleteTag',
    async (tagId, { rejectWithValue }) => {
        try {
            await deleteTag(tagId);
            return tagId;
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || 'Failed to delete tag');
        }
    },
);

export const fetchTaskTags = createAsyncThunk<TagData[], number>(
    'tags/fetchTaskTags',
    async (taskId, { rejectWithValue }) => {
        try {
            const response = await getTaskTags(taskId);
            return response;
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || 'Failed to fetch task tags');
        }
    },
);

export const fetchAddTagToTask = createAsyncThunk<void, { taskId: number; tagId: number }>(
    'tags/addTagToTask',
    async ({ taskId, tagId }, { rejectWithValue }) => {
        try {
            await addTagToTask(taskId, tagId);
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || 'Failed to add tag to task');
        }
    },
);

export const fetchRemoveTagFromTask = createAsyncThunk<number, { taskId: number; tagId: number }>(
    'tags/removeTagFromTask',
    async ({ taskId, tagId }, { rejectWithValue }) => {
        try {
            await removeTagFromTask(taskId, tagId);
            return tagId;
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || 'Failed to remove tag from task');
        }
    },
);

const initialState: TagsState = {
    listTags: [],
    taskTags: [],
    selectedTag: null,
    isLoadingTags: false,
    errorTags: null,
    isCreatingTag: false,
    errorCreatingTag: null,
    isUpdatingTag: false,
    errorUpdatingTag: null,
    isDeletingTag: false,
    errorDeletingTag: null,
};

export const tagsSlice = createSlice({
    name: 'tags',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchTagsBySpace.pending, (state) => {
                state.isLoadingTags = true;
                state.errorTags = null;
            })
            .addCase(fetchTagsBySpace.fulfilled, (state, action) => {
                state.isLoadingTags = false;
                state.listTags = action.payload;
            })
            .addCase(fetchTagsBySpace.rejected, (state, action) => {
                state.isLoadingTags = false;
                state.errorTags = action.payload as string;
            })

            .addCase(fetchTagById.fulfilled, (state, action) => {
                state.selectedTag = action.payload;
            })

            .addCase(fetchCreateTag.pending, (state) => {
                state.isCreatingTag = true;
                state.errorCreatingTag = null;
            })
            .addCase(fetchCreateTag.fulfilled, (state, action) => {
                state.isCreatingTag = false;
                state.listTags.push(action.payload);
            })
            .addCase(fetchCreateTag.rejected, (state, action) => {
                state.isCreatingTag = false;
                state.errorCreatingTag = action.payload as string;
            })

            .addCase(fetchUpdateTag.pending, (state) => {
                state.isUpdatingTag = true;
                state.errorUpdatingTag = null;
            })
            .addCase(fetchUpdateTag.fulfilled, (state, action) => {
                state.isUpdatingTag = false;
                const index = state.listTags.findIndex(t => t.tag_id === action.payload.tag_id);
                if (index !== -1) {
                    state.listTags[index] = action.payload;
                }
            })
            .addCase(fetchUpdateTag.rejected, (state, action) => {
                state.isUpdatingTag = false;
                state.errorUpdatingTag = action.payload as string;
            })

            .addCase(fetchDeleteTag.pending, (state) => {
                state.isDeletingTag = true;
                state.errorDeletingTag = null;
            })
            .addCase(fetchDeleteTag.fulfilled, (state, action) => {
                state.isDeletingTag = false;
                state.listTags = state.listTags.filter(t => t.tag_id !== action.payload);
            })
            .addCase(fetchDeleteTag.rejected, (state, action) => {
                state.isDeletingTag = false;
                state.errorDeletingTag = action.payload as string;
            })

            .addCase(fetchTaskTags.fulfilled, (state, action) => {
                state.taskTags = action.payload;
            })

            .addCase(fetchRemoveTagFromTask.fulfilled, (state, action) => {
                state.taskTags = state.taskTags.filter(t => t.tag_id !== action.payload);
            });
    },
});

export const {} = tagsSlice.actions;

export default tagsSlice.reducer;
