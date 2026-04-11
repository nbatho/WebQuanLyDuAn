import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import type { SpaceTreeData, FolderItem, ListItem } from '@/types/tree';
import {
    getFoldersForSpace,
    getListsForSpace,
    createFolder as apiCreateFolder,
    createList as apiCreateList,
    deleteFolder as apiDeleteFolder,
    deleteList as apiDeleteList,
    type FolderData,
} from '@/api/folders';

/* ── State ── */
interface TreeState {
    data: SpaceTreeData;
    loading: boolean;
    error: string | null;
}

const initialState: TreeState = {
    data: {},
    loading: false,
    error: null,
};

/* ── Thunks ── */

/** Fetch folders + lists for all given spaces in parallel */
export const fetchTreeForSpaces = createAsyncThunk(
    'tree/fetchTreeForSpaces',
    async (spaceIds: number[]) => {
        const newTree: SpaceTreeData = {};

        await Promise.all(
            spaceIds.map(async (spaceId) => {
                try {
                    const [folders, allLists] = await Promise.all([
                        getFoldersForSpace(spaceId),
                        getListsForSpace(spaceId),
                    ]);

                    const folderItems: FolderItem[] = folders.map((f: FolderData) => ({
                        id: String(f.folder_id),
                        name: f.name,
                        lists: (f.lists || []).map((l) => ({
                            id: String(l.list_id),
                            name: l.name,
                            count: 0,
                        })),
                    }));

                    const folderIds = new Set(folders.map((f: FolderData) => f.folder_id));
                    const standaloneLists: ListItem[] = allLists
                        .filter((l) => !l.folder_id || !folderIds.has(l.folder_id))
                        .map((l) => ({
                            id: String(l.list_id),
                            name: l.name,
                            count: 0,
                        }));

                    newTree[String(spaceId)] = { folders: folderItems, standaloneLists };
                } catch {
                    newTree[String(spaceId)] = { folders: [], standaloneLists: [] };
                }
            }),
        );

        return newTree;
    },
);

export const createFolder = createAsyncThunk(
    'tree/createFolder',
    async ({ spaceId, name }: { spaceId: number; name: string }) => {
        const newFolder = await apiCreateFolder(spaceId, name);
        return {
            spaceId: String(spaceId),
            folder: {
                id: String(newFolder.folder_id),
                name: newFolder.name,
                lists: [],
            } as FolderItem,
        };
    },
);

export const removeFolder = createAsyncThunk(
    'tree/removeFolder',
    async ({ spaceId, folderId }: { spaceId: string; folderId: string }) => {
        await apiDeleteFolder(parseInt(folderId, 10));
        return { spaceId, folderId };
    },
);

export const createList = createAsyncThunk(
    'tree/createList',
    async ({
        spaceId,
        folderId,
        name,
    }: {
        spaceId: number;
        folderId: number | null;
        name: string;
    }) => {
        const newList = await apiCreateList(spaceId, folderId, name);
        return {
            spaceId: String(spaceId),
            folderId: folderId ? String(folderId) : null,
            list: {
                id: String(newList.list_id),
                name: newList.name,
                count: 0,
            } as ListItem,
        };
    },
);

export const removeList = createAsyncThunk(
    'tree/removeList',
    async ({
        spaceId,
        folderId,
        listId,
    }: {
        spaceId: string;
        folderId: string | null;
        listId: string;
    }) => {
        await apiDeleteList(parseInt(listId, 10));
        return { spaceId, folderId, listId };
    },
);

/* ── Slice ── */
const treeSlice = createSlice({
    name: 'tree',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            /* fetchTreeForSpaces */
            .addCase(fetchTreeForSpaces.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchTreeForSpaces.fulfilled, (state, action) => {
                state.loading = false;
                state.data = { ...state.data, ...action.payload };
            })
            .addCase(fetchTreeForSpaces.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message || 'Failed to fetch tree';
            })

            /* createFolder */
            .addCase(createFolder.fulfilled, (state, action) => {
                const { spaceId, folder } = action.payload;
                const node = state.data[spaceId] || { folders: [], standaloneLists: [] };
                node.folders.push(folder);
                state.data[spaceId] = node;
            })

            /* removeFolder */
            .addCase(removeFolder.fulfilled, (state, action) => {
                const { spaceId, folderId } = action.payload;
                const node = state.data[spaceId];
                if (node) {
                    node.folders = node.folders.filter((f) => f.id !== folderId);
                }
            })

            /* createList */
            .addCase(createList.fulfilled, (state, action) => {
                const { spaceId, folderId, list } = action.payload;
                const node = state.data[spaceId] || { folders: [], standaloneLists: [] };
                if (folderId) {
                    const folder = node.folders.find((f) => f.id === folderId);
                    if (folder) folder.lists.push(list);
                } else {
                    node.standaloneLists.push(list);
                }
                state.data[spaceId] = node;
            })

            /* removeList */
            .addCase(removeList.fulfilled, (state, action) => {
                const { spaceId, folderId, listId } = action.payload;
                const node = state.data[spaceId];
                if (!node) return;
                if (folderId) {
                    const folder = node.folders.find((f) => f.id === folderId);
                    if (folder) folder.lists = folder.lists.filter((l) => l.id !== listId);
                } else {
                    node.standaloneLists = node.standaloneLists.filter((l) => l.id !== listId);
                }
            });
    },
});

export default treeSlice.reducer;
