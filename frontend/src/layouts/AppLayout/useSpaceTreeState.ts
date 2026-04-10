import { useState, useEffect, useRef, useCallback, type MouseEvent } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import type { SpaceItem } from './types';
import { useDispatch, useSelector } from 'react-redux';
import type { AppDispatch, RootState } from '../../store/configureStore';
import { fetchSpacesForWorkspace, fetchCreateSpace } from '@/store/modules/spaces';
import { deleteSpace } from '@/api/spaces';

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
    
    const [actionMenu, setActionMenu] = useState<{ spaceId: string; x: number; y: number } | null>(null);
    const menuRef = useRef<HTMLDivElement>(null);

    const [isWorkspaceDialogOpen, setIsWorkspaceDialogOpen] = useState(false);
    const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);

    useEffect(() => {
        const handleClick = () => setActionMenu(null);
        document.addEventListener('click', handleClick);
        return () => document.removeEventListener('click', handleClick);
    }, []);

    const handleCreateSpace = async (name: string, color: string, is_private?: boolean) => {
        if (!currentWorkspaceId) return;
        try {
            await dispatch(fetchCreateSpace({
                workspace_id: currentWorkspaceId,
                name,
                description: '',
                color: color || '#0058be',
                is_private : is_private || false,
            })).unwrap();
        } catch (error) {
            console.error("Failed to create space:", error);
        }
    };

    const handleSpaceAction = (e: MouseEvent, spaceId: string) => {
        e.stopPropagation();
        setActionMenu({ spaceId, x: e.clientX, y: e.clientY });
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

    return {
        spaces,
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
    };
}
