import { useState, useEffect, useRef, useCallback, type MouseEvent } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import type { SpaceItem } from './types';
import { initialSpaces } from './data/initialSpaces';

export function useSpaceTreeState() {
    const navigate = useNavigate();
    const location = useLocation();
    const [spaces, setSpaces] = useState<SpaceItem[]>(initialSpaces);
    const [isCreateSpaceOpen, setIsCreateSpaceOpen] = useState(false);
    const [createFolderTarget, setCreateFolderTarget] = useState<string | null>(null);
    const [createListTarget, setCreateListTarget] = useState<{
        spaceId: string;
        folderId: string | null;
    } | null>(null);
    const [actionMenu, setActionMenu] = useState<{ spaceId: string; x: number; y: number } | null>(
        null,
    );
    const menuRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClick = () => setActionMenu(null);
        document.addEventListener('click', handleClick);
        return () => document.removeEventListener('click', handleClick);
    }, []);

    const toggleSpace = (id: string) => {
        setSpaces((prev) => prev.map((s) => (s.id === id ? { ...s, expanded: !s.expanded } : s)));
    };

    const toggleFolder = (spaceId: string, folderId: string) => {
        setSpaces((prev) =>
            prev.map((s) => {
                if (s.id !== spaceId) return s;
                return {
                    ...s,
                    folders: s.folders.map((f) =>
                        f.id === folderId ? { ...f, expanded: !f.expanded } : f,
                    ),
                };
            }),
        );
    };

    const handleCreateSpace = (name: string, color: string) => {
        const id = name.toLowerCase().replace(/\s+/g, '-');
        setSpaces((prev) => [
            ...prev,
            { id, name, expanded: true, folders: [], lists: [], color },
        ]);
    };

    const handleCreateFolder = (name: string) => {
        if (!createFolderTarget) return;
        const folderId = `${name.toLowerCase().replace(/\s+/g, '-')}-${Date.now()}`;
        setSpaces((prev) =>
            prev.map((s) => {
                if (s.id !== createFolderTarget) return s;
                return {
                    ...s,
                    folders: [...s.folders, { id: folderId, name, expanded: true, lists: [] }],
                };
            }),
        );
    };

    const handleCreateList = (name: string) => {
        if (!createListTarget) return;
        const listId = `${name.toLowerCase().replace(/\s+/g, '-')}-${Date.now()}`;
        const { spaceId, folderId } = createListTarget;
        setSpaces((prev) =>
            prev.map((s) => {
                if (s.id !== spaceId) return s;
                if (folderId) {
                    return {
                        ...s,
                        folders: s.folders.map((f) => {
                            if (f.id !== folderId) return f;
                            return { ...f, lists: [...f.lists, { id: listId, name }] };
                        }),
                    };
                }
                return { ...s, lists: [...s.lists, { id: listId, name }] };
            }),
        );
    };

    const handleSpaceAction = (e: MouseEvent, spaceId: string) => {
        e.stopPropagation();
        setActionMenu({ spaceId, x: e.clientX, y: e.clientY });
    };

    const handleDeleteSpace = useCallback(
        (spaceId: string) => {
            setSpaces((prev) => prev.filter((s) => s.id !== spaceId));
            setCreateFolderTarget((t) => (t === spaceId ? null : t));
            setCreateListTarget((t) => (t?.spaceId === spaceId ? null : t));
            setActionMenu(null);
            if (location.pathname.startsWith(`/space/${spaceId}`)) {
                navigate('/home');
            }
        },
        [location.pathname, navigate],
    );

    const handleDeleteFolder = useCallback(
        (spaceId: string, folderId: string) => {
            const folder = spaces
                .find((s) => s.id === spaceId)
                ?.folders.find((f) => f.id === folderId);
            const listIdsInFolder = new Set(folder?.lists.map((l) => l.id) ?? []);

            setSpaces((prev) =>
                prev.map((s) =>
                    s.id === spaceId
                        ? { ...s, folders: s.folders.filter((f) => f.id !== folderId) }
                        : s,
                ),
            );

            setCreateListTarget((t) =>
                t?.spaceId === spaceId && t.folderId === folderId ? null : t,
            );

            if (location.pathname === `/space/${spaceId}`) {
                const params = new URLSearchParams(location.search);
                const folderQ = params.get('folder');
                const listQ = params.get('list');
                if (
                    folderQ === folderId ||
                    (listQ != null && listIdsInFolder.has(listQ))
                ) {
                    navigate({ pathname: `/space/${spaceId}`, search: '' }, { replace: true });
                }
            }
        },
        [spaces, location.pathname, location.search, navigate],
    );

    const handleDeleteList = useCallback(
        (spaceId: string, folderId: string | null, listId: string) => {
            setSpaces((prev) =>
                prev.map((s) => {
                    if (s.id !== spaceId) return s;
                    if (folderId) {
                        return {
                            ...s,
                            folders: s.folders.map((f) =>
                                f.id === folderId
                                    ? { ...f, lists: f.lists.filter((l) => l.id !== listId) }
                                    : f,
                            ),
                        };
                    }
                    return { ...s, lists: s.lists.filter((l) => l.id !== listId) };
                }),
            );

            if (
                location.pathname === `/space/${spaceId}` &&
                new URLSearchParams(location.search).get('list') === listId
            ) {
                navigate({ pathname: `/space/${spaceId}`, search: '' }, { replace: true });
            }
        },
        [location.pathname, location.search, navigate],
    );

    const targetSpace = createFolderTarget
        ? spaces.find((s) => s.id === createFolderTarget)
        : null;

    const targetListFolder = createListTarget
        ? (() => {
              const sp = spaces.find((s) => s.id === createListTarget.spaceId);
              if (!sp) return null;
              if (createListTarget.folderId) {
                  const f = sp.folders.find((x) => x.id === createListTarget.folderId);
                  return f ? f.name : sp.name;
              }
              return sp.name;
          })()
        : null;

    return {
        spaces,
        isCreateSpaceOpen,
        setIsCreateSpaceOpen,
        createFolderTarget,
        setCreateFolderTarget,
        createListTarget,
        setCreateListTarget,
        actionMenu,
        setActionMenu,
        menuRef,
        toggleSpace,
        toggleFolder,
        handleCreateSpace,
        handleCreateFolder,
        handleCreateList,
        handleSpaceAction,
        handleDeleteSpace,
        handleDeleteFolder,
        handleDeleteList,
        targetSpace,
        targetListFolder,
    };
}
