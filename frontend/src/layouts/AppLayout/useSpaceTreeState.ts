import { useState, useEffect, useRef, useCallback, type MouseEvent } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import type { SpaceItem } from '@/types/spaces';
import { useDispatch, useSelector } from 'react-redux';
import type { AppDispatch, RootState } from '../../store/configureStore';
import { fetchSpacesForWorkspace, fetchCreateSpace } from '@/store/modules/spaces';
import { deleteSpace } from '@/api/spaces';
import {
    getFoldersForSpace,
    getListsForSpace,
    createFolder as apiCreateFolder,
    createList as apiCreateList,
    deleteFolder as apiDeleteFolder,
    deleteList as apiDeleteList,
    type FolderData,
} from '@/api/folders';

/* ── Types ── */
export interface ListItem {
    id: string;
    name: string;
    count?: number;
}

export interface FolderItem {
    id: string;
    name: string;
    lists: ListItem[];
}

export interface SpaceTreeNode {
    folders: FolderItem[];
    standaloneLists: ListItem[]; // Lists directly in space (no folder)
}

export interface SpaceTreeData {
    [spaceId: string]: SpaceTreeNode;
}

export function useSpaceTreeState() {
    const navigate = useNavigate();
    const location = useLocation();
    const dispatch = useDispatch<AppDispatch>();

    const listSpaces = useSelector((state: RootState) => state.spaces.listSpaces);
    const currentWorkspaceId = useSelector((state: RootState) => state.workspaces.currentWorkspaceId);

    const spaces: SpaceItem[] = listSpaces.map(s => ({
        id: String(s.space_id),
        name: s.name,
        color: s.color || '#0058be',
    }));

    const [isCreateSpaceOpen, setIsCreateSpaceOpen] = useState(false);

    /* ── Context menu (space actions) ── */
    const [actionMenu, setActionMenu] = useState<{
        spaceId: string;
        spaceName: string;
        x: number;
        y: number;
    } | null>(null);
    const menuRef = useRef<HTMLDivElement>(null);

    const [isWorkspaceDialogOpen, setIsWorkspaceDialogOpen] = useState(false);
    const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);

    /* ── Folder & List data (from API) ── */
    const [spaceTree, setSpaceTree] = useState<SpaceTreeData>({});

    /* ── Create Folder modal ── */
    const [createFolderTarget, setCreateFolderTarget] = useState<{ spaceId: string; spaceName: string } | null>(null);

    /* ── Create List modal ── */
    const [createListTarget, setCreateListTarget] = useState<{
        spaceId: string;
        folderId: string | null;
        folderName: string;
    } | null>(null);

    useEffect(() => {
        const handleClick = () => setActionMenu(null);
        document.addEventListener('click', handleClick);
        return () => document.removeEventListener('click', handleClick);
    }, []);

    /* ── Fetch folders+lists for all spaces when spaces change ── */
    const fetchAllFolders = useCallback(async () => {
        const newTree: SpaceTreeData = {};
        await Promise.all(
            spaces.map(async (space) => {
                try {
                    const spaceIdNum = parseInt(space.id, 10);
                    const [folders, allLists] = await Promise.all([
                        getFoldersForSpace(spaceIdNum),
                        getListsForSpace(spaceIdNum),
                    ]);

                    // Build folder items with nested lists
                    const folderItems: FolderItem[] = folders.map((f: FolderData) => ({
                        id: String(f.folder_id),
                        name: f.name,
                        lists: (f.lists || []).map(l => ({
                            id: String(l.list_id),
                            name: l.name,
                            count: 0,
                        })),
                    }));

                    // Standalone lists = lists where folder_id is null
                    const folderIds = new Set(folders.map((f: FolderData) => f.folder_id));
                    const standaloneLists: ListItem[] = allLists
                        .filter(l => !l.folder_id || !folderIds.has(l.folder_id))
                        .map(l => ({
                            id: String(l.list_id),
                            name: l.name,
                            count: 0,
                        }));

                    newTree[space.id] = {
                        folders: folderItems,
                        standaloneLists,
                    };
                } catch {
                    newTree[space.id] = { folders: [], standaloneLists: [] };
                }
            })
        );
        setSpaceTree(newTree);
    }, [spaces.map(s => s.id).join(',')]);

    useEffect(() => {
        if (spaces.length > 0) {
            fetchAllFolders();
        }
    }, [fetchAllFolders, spaces.length]);

    const handleCreateSpace = async (name: string, color: string, is_private?: boolean) => {
        if (!currentWorkspaceId) return;
        try {
            await dispatch(fetchCreateSpace({
                workspace_id: currentWorkspaceId,
                name,
                description: '',
                color: color || '#0058be',
                is_private: is_private || false,
            })).unwrap();
        } catch (error) {
            console.error("Failed to create space:", error);
        }
    };

    const handleSpaceAction = (e: MouseEvent, spaceId: string, spaceName: string) => {
        e.stopPropagation();
        setActionMenu({ spaceId, spaceName, x: e.clientX, y: e.clientY });
    };

    const handleDeleteSpace = useCallback(
        async (spaceId: string) => {
            if (!currentWorkspaceId) return;
            try {
                await deleteSpace(parseInt(spaceId, 10));
                dispatch(fetchSpacesForWorkspace(currentWorkspaceId));
                setActionMenu(null);
                if (location.pathname.startsWith(`/space/${spaceId}`)) {
                    navigate('/home');
                }
            } catch (error) {
                console.error("Failed to delete space:", error);
            }
        },
        [location.pathname, navigate, dispatch, currentWorkspaceId],
    );

    /* ── Folder CRUD (API) ── */
    const handleCreateFolder = async (name: string) => {
        if (!createFolderTarget) return;
        const { spaceId } = createFolderTarget;
        try {
            const newFolder = await apiCreateFolder(parseInt(spaceId, 10), name);
            setSpaceTree(prev => {
                const node = prev[spaceId] || { folders: [], standaloneLists: [] };
                return {
                    ...prev,
                    [spaceId]: {
                        ...node,
                        folders: [
                            ...node.folders,
                            {
                                id: String(newFolder.folder_id),
                                name: newFolder.name,
                                lists: [],
                            },
                        ],
                    },
                };
            });
        } catch (error) {
            console.error("Failed to create folder:", error);
        }
        setCreateFolderTarget(null);
    };

    const handleDeleteFolder = async (spaceId: string, folderId: string) => {
        try {
            await apiDeleteFolder(parseInt(folderId, 10));
            setSpaceTree(prev => {
                const node = prev[spaceId] || { folders: [], standaloneLists: [] };
                return {
                    ...prev,
                    [spaceId]: {
                        ...node,
                        folders: node.folders.filter(f => f.id !== folderId),
                    },
                };
            });
        } catch (error) {
            console.error("Failed to delete folder:", error);
        }
    };

    /* ── List CRUD (API) ── */
    const handleCreateList = async (name: string) => {
        if (!createListTarget) return;
        const { spaceId, folderId } = createListTarget;
        try {
            const newList = await apiCreateList(
                parseInt(spaceId, 10),
                folderId ? parseInt(folderId, 10) : null,
                name,
            );
            const newListItem: ListItem = {
                id: String(newList.list_id),
                name: newList.name,
                count: 0,
            };

            setSpaceTree(prev => {
                const node = prev[spaceId] || { folders: [], standaloneLists: [] };

                if (folderId) {
                    // Add to folder's lists
                    return {
                        ...prev,
                        [spaceId]: {
                            ...node,
                            folders: node.folders.map(f =>
                                f.id === folderId
                                    ? { ...f, lists: [...f.lists, newListItem] }
                                    : f,
                            ),
                        },
                    };
                } else {
                    // Add as standalone list in space
                    return {
                        ...prev,
                        [spaceId]: {
                            ...node,
                            standaloneLists: [...node.standaloneLists, newListItem],
                        },
                    };
                }
            });
        } catch (error) {
            console.error("Failed to create list:", error);
        }
        setCreateListTarget(null);
    };

    const handleDeleteList = async (spaceId: string, folderId: string | null, listId: string) => {
        try {
            await apiDeleteList(parseInt(listId, 10));
            setSpaceTree(prev => {
                const node = prev[spaceId] || { folders: [], standaloneLists: [] };

                if (folderId) {
                    return {
                        ...prev,
                        [spaceId]: {
                            ...node,
                            folders: node.folders.map(f =>
                                f.id === folderId
                                    ? { ...f, lists: f.lists.filter(l => l.id !== listId) }
                                    : f,
                            ),
                        },
                    };
                } else {
                    return {
                        ...prev,
                        [spaceId]: {
                            ...node,
                            standaloneLists: node.standaloneLists.filter(l => l.id !== listId),
                        },
                    };
                }
            });
        } catch (error) {
            console.error("Failed to delete list:", error);
        }
    };

    return {
        spaces,
        spaceTree,
        isCreateSpaceOpen,
        setIsCreateSpaceOpen,
        actionMenu,
        setActionMenu,
        menuRef,
        handleCreateSpace,
        handleSpaceAction,
        handleDeleteSpace,
        isWorkspaceDialogOpen,
        setIsWorkspaceDialogOpen,
        isInviteModalOpen,
        setIsInviteModalOpen,
        /* folder/list */
        createFolderTarget,
        setCreateFolderTarget,
        createListTarget,
        setCreateListTarget,
        handleCreateFolder,
        handleCreateList,
        handleDeleteFolder,
        handleDeleteList,
    };
}
