import { useState, useEffect, useRef, useCallback, type MouseEvent } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import type { SpaceItem } from '@/types/spaces';
import { useAppDispatch, useAppSelector } from '@/hooks';
import { fetchSpacesForWorkspace, fetchCreateSpace } from '@/store/modules/spaces';
import { deleteSpace } from '@/api/spaces';
import {
    fetchTreeForSpaces,
    createFolder,
    removeFolder,
    createList,
    removeList,
} from '@/store/modules/tree';

export function useSpaceTreeState() {
    const navigate = useNavigate();
    const location = useLocation();
    const dispatch = useAppDispatch();

    const listSpaces = useAppSelector((state) => state.spaces.listSpaces);
    const currentWorkspaceId = useAppSelector((state) => state.workspaces.currentWorkspaceId);
    const spaceTree = useAppSelector((state) => state.tree.data);

    const spaces: SpaceItem[] = listSpaces.map((s) => ({
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

    /* ── Fetch tree when spaces change ── */
    const spaceIdKey = spaces.map((s) => s.id).join(',');

    useEffect(() => {
        if (spaces.length > 0) {
            const numericIds = spaces.map((s) => parseInt(s.id, 10));
            dispatch(fetchTreeForSpaces(numericIds));
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [dispatch, spaceIdKey]);

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

    /* ── Folder CRUD (via Redux) ── */
    const handleCreateFolder = async (name: string) => {
        if (!createFolderTarget) return;
        const { spaceId } = createFolderTarget;
        try {
            await dispatch(createFolder({ spaceId: parseInt(spaceId, 10), name })).unwrap();
        } catch (error) {
            console.error("Failed to create folder:", error);
        }
        setCreateFolderTarget(null);
    };

    const handleDeleteFolder = async (spaceId: string, folderId: string) => {
        try {
            await dispatch(removeFolder({ spaceId, folderId })).unwrap();
        } catch (error) {
            console.error("Failed to delete folder:", error);
        }
    };

    /* ── List CRUD (via Redux) ── */
    const handleCreateList = async (name: string) => {
        if (!createListTarget) return;
        const { spaceId, folderId } = createListTarget;
        try {
            await dispatch(createList({
                spaceId: parseInt(spaceId, 10),
                folderId: folderId ? parseInt(folderId, 10) : null,
                name,
            })).unwrap();
        } catch (error) {
            console.error("Failed to create list:", error);
        }
        setCreateListTarget(null);
    };

    const handleDeleteList = async (spaceId: string, folderId: string | null, listId: string) => {
        try {
            await dispatch(removeList({ spaceId, folderId, listId })).unwrap();
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
