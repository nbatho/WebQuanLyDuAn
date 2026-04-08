import type { MouseEvent } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
    Home,
    MessageSquare,
    ClipboardList,
    Clock,
    BarChart3,
    Plus,
    Settings,
    Users,
    LogOut,
    ChevronDown,
    ChevronRight,
    Sparkles,
    Grid3X3,
    FolderOpen,
    List,
    MoreHorizontal,
    Trash2,
} from 'lucide-react';
import type { SpaceItem } from './types';
import WorkspaceSwitcher from './workspace/WorkspaceSwitcher';
import { fetchSignOut } from '@/store/modules/auth';
import type { AppDispatch } from '@/store/configureStore';
import { useDispatch } from 'react-redux';
type SpaceTree = {
    spaces: SpaceItem[];
    setIsCreateSpaceOpen: (v: boolean) => void;
    setCreateFolderTarget: (id: string | null) => void;
    setCreateListTarget: (v: { spaceId: string; folderId: string | null } | null) => void;
    actionMenu: { spaceId: string; x: number; y: number } | null;
    setActionMenu: (v: { spaceId: string; x: number; y: number } | null) => void;
    menuRef: React.RefObject<HTMLDivElement | null>;
    toggleSpace: (id: string) => void;
    toggleFolder: (spaceId: string, folderId: string) => void;
    handleSpaceAction: (e: MouseEvent, spaceId: string) => void;
    onDeleteSpace: (spaceId: string) => void;
    onDeleteFolder: (spaceId: string, folderId: string) => void;
    onDeleteList: (spaceId: string, folderId: string | null, listId: string) => void;
    onOpenInvitePeople: () => void;
    onOpenCreateWorkspace: () => void;
};

export default function AppSidebar({
    spaces,
    setIsCreateSpaceOpen,
    setCreateFolderTarget,
    setCreateListTarget,
    actionMenu,
    setActionMenu,
    menuRef,
    toggleSpace,
    toggleFolder,
    handleSpaceAction,
    onDeleteSpace,
    onDeleteFolder,
    onDeleteList,
    onOpenInvitePeople,
    onOpenCreateWorkspace,
}: SpaceTree) {
    const navigate = useNavigate();
    const location = useLocation();
    const dispatch = useDispatch<AppDispatch>();
    const isSpaceActive = (spaceId: string) => location.pathname.startsWith(`/space/${spaceId}`);

    const handleLogout = () => {
        try {
            dispatch(fetchSignOut());
            navigate('/login');
        } catch (error) {
            console.error('Logout failed:', error);
        }
    }
    return (
        <>
            <aside className="flex w-60 shrink-0 flex-col overflow-y-auto border-r border-[#eef0f5] bg-white px-2.5 py-4 max-[900px]:hidden">
                <div
                    className="mb-3 flex cursor-pointer items-center gap-2.5 border-b border-[#eef0f5] px-2 pb-4 pt-1"
                    onClick={() => navigate('/home')}
                >
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#0058be]">
                        <Grid3X3 size={18} color="#fff" />
                    </div>
                    <div className="min-w-0 flex-1">
                        <div className="text-sm font-black text-[#141b2b]">Flowise PM</div>
                        <WorkspaceSwitcher onOpenCreate={onOpenCreateWorkspace} />
                    </div>
                </div>

                <nav className="mb-4 flex flex-col gap-0.5">
                    <div
                        className={`flex cursor-pointer select-none items-center gap-2.5 rounded-lg px-2.5 py-2 text-[13px] font-bold transition-all ${location.pathname === '/home' ? 'bg-[#0058be] text-white' : 'text-[#5f6368] hover:bg-[#f0f4ff] hover:text-[#141b2b]'}`}
                        onClick={() => navigate('/home')}
                    >
                        <Home size={17} />
                        <span>Home</span>
                    </div>
                    <div
                        className={`flex cursor-pointer select-none items-center gap-2.5 rounded-lg px-2.5 py-2 text-[13px] font-bold transition-all ${location.pathname === '/inbox' ? 'bg-[#0058be] text-white' : 'text-[#5f6368] hover:bg-[#f0f4ff] hover:text-[#141b2b]'}`}
                        onClick={() => navigate('/inbox')}
                    >
                        <MessageSquare size={17} />
                        <span>Inbox</span>
                        <span className="ml-auto rounded-[10px] bg-[#e74c3c] px-1.5 py-0.5 text-[10px] font-extrabold leading-none text-white">
                            5
                        </span>
                    </div>
                    <div
                        className={`flex cursor-pointer select-none items-center gap-2.5 rounded-lg px-2.5 py-2 text-[13px] font-bold transition-all ${location.pathname === '/my-tasks' ? 'bg-[#0058be] text-white' : 'text-[#5f6368] hover:bg-[#f0f4ff] hover:text-[#141b2b]'}`}
                        onClick={() => navigate('/my-tasks')}
                    >
                        <ClipboardList size={17} />
                        <span>My Tasks</span>
                    </div>
                </nav>

                <div className="mb-4 flex flex-1 flex-col overflow-y-auto">
                    <div className="flex items-center justify-between px-2.5 py-2 text-[11px] font-extrabold tracking-[0.08em] text-[#9aa0a6]">
                        <span>SPACES</span>
                        <Plus
                            size={14}
                            className="cursor-pointer text-[#c2c9e0] transition-colors hover:text-[#0058be]"
                            onClick={() => setIsCreateSpaceOpen(true)}
                        />
                    </div>

                    {spaces.map((space) => (
                        <div key={space.id} className="mb-0.5">
                            <div
                                className={`group flex cursor-pointer select-none items-center gap-2.5 rounded-lg px-2.5 py-2 text-[13px] font-bold transition-all ${isSpaceActive(space.id) ? 'bg-[#f0f4ff] text-[#0058be]' : 'text-[#5f6368] hover:bg-[#f0f4ff] hover:text-[#141b2b]'}`}
                                onClick={() =>
                                    navigate({ pathname: `/space/${space.id}`, search: '' })
                                }
                            >
                                <span
                                    className="flex shrink-0 items-center text-[#9aa0a6] hover:text-[#141b2b]"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        toggleSpace(space.id);
                                    }}
                                >
                                    {space.expanded ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
                                </span>
                                <span
                                    className="flex h-5.5 w-5.5 shrink-0 items-center justify-center rounded-md"
                                    style={{ backgroundColor: `${space.color}18`, color: space.color }}
                                >
                                    <Grid3X3 size={14} />
                                </span>
                                <span className="flex-1 truncate">{space.name}</span>
                                <div className="ml-auto hidden items-center gap-0.5 group-hover:flex">
                                    <MoreHorizontal
                                        size={13}
                                        className="cursor-pointer rounded p-0.5 text-[#9aa0a6] hover:bg-[#e8edff] hover:text-[#0058be]"
                                        onClick={(e) => handleSpaceAction(e, space.id)}
                                    />
                                    <Plus
                                        size={13}
                                        className="cursor-pointer rounded p-0.5 text-[#9aa0a6] hover:bg-[#e8edff] hover:text-[#0058be]"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            setActionMenu({ spaceId: space.id, x: e.clientX, y: e.clientY });
                                        }}
                                    />
                                </div>
                            </div>

                            {space.expanded && (
                                <div className="pl-3">
                                    {space.folders.map((folder) => (
                                        <div key={folder.id} className="mb-px">
                                            <div className="group/folder flex cursor-pointer items-center gap-1.5 rounded-md px-2 py-1.25 text-xs font-bold text-[#5f6368] transition-all hover:bg-[#f0f4ff] hover:text-[#141b2b]">
                                                <span
                                                    className="flex shrink-0 items-center text-[#b0b5c1]"
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        toggleFolder(space.id, folder.id);
                                                    }}
                                                >
                                                    {folder.expanded ? (
                                                        <ChevronDown size={12} />
                                                    ) : (
                                                        <ChevronRight size={12} />
                                                    )}
                                                </span>
                                                <button
                                                    type="button"
                                                    className="flex min-w-0 flex-1 cursor-pointer items-center gap-1.5 border-none bg-transparent p-0 text-left font-bold text-inherit"
                                                    onClick={() =>
                                                        navigate({
                                                            pathname: `/space/${space.id}`,
                                                            search: `?folder=${encodeURIComponent(folder.id)}`,
                                                        })
                                                    }
                                                >
                                                    <FolderOpen
                                                        size={14}
                                                        className="shrink-0 text-[#f0a220]"
                                                    />
                                                    <span className="truncate">{folder.name}</span>
                                                </button>
                                                <Plus
                                                    size={12}
                                                    className="cursor-pointer text-[#9aa0a6] opacity-0 transition-opacity hover:text-[#0058be] group-hover/folder:opacity-100"
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        setCreateListTarget({
                                                            spaceId: space.id,
                                                            folderId: folder.id,
                                                        });
                                                    }}
                                                />
                                                <Trash2
                                                    size={12}
                                                    className="cursor-pointer text-[#9aa0a6] opacity-0 transition-opacity hover:text-[#e74c3c] group-hover/folder:opacity-100"
                                                    aria-label="Xóa folder"
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        onDeleteFolder(space.id, folder.id);
                                                    }}
                                                />
                                            </div>
                                            {folder.expanded &&
                                                folder.lists.map((list) => (
                                                    <div
                                                        key={list.id}
                                                        className="group/listrow flex cursor-pointer items-center gap-1 rounded-md px-2 py-1.25 pl-7 text-xs font-semibold text-[#9aa0a6] transition-all hover:bg-[#f0f4ff] hover:text-[#5f6368]"
                                                    >
                                                        <div
                                                            className="flex min-w-0 flex-1 items-center gap-1.5"
                                                            onClick={() =>
                                                                navigate({
                                                                    pathname: `/space/${space.id}`,
                                                                    search: `?list=${encodeURIComponent(list.id)}`,
                                                                })
                                                            }
                                                        >
                                                            <List
                                                                size={13}
                                                                className="shrink-0 text-[#b0b5c1]"
                                                            />
                                                            <span className="truncate">{list.name}</span>
                                                        </div>
                                                        <Trash2
                                                            size={12}
                                                            className="shrink-0 cursor-pointer text-[#9aa0a6] opacity-0 transition-opacity hover:text-[#e74c3c] group-hover/listrow:opacity-100"
                                                            aria-label="Xóa list"
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                onDeleteList(space.id, folder.id, list.id);
                                                            }}
                                                        />
                                                    </div>
                                                ))}
                                        </div>
                                    ))}

                                    {space.lists.map((list) => (
                                        <div
                                            key={list.id}
                                            className="group/listrow flex cursor-pointer items-center gap-1 rounded-md px-2 py-1.25 pl-4 text-xs font-semibold text-[#9aa0a6] transition-all hover:bg-[#f0f4ff] hover:text-[#5f6368]"
                                        >
                                            <div
                                                className="flex min-w-0 flex-1 items-center gap-1.5"
                                                onClick={() =>
                                                    navigate({
                                                        pathname: `/space/${space.id}`,
                                                        search: `?list=${encodeURIComponent(list.id)}`,
                                                    })
                                                }
                                            >
                                                <List
                                                    size={13}
                                                    className="shrink-0 text-[#b0b5c1]"
                                                />
                                                <span className="truncate">{list.name}</span>
                                            </div>
                                            <Trash2
                                                size={12}
                                                className="shrink-0 cursor-pointer text-[#9aa0a6] opacity-0 transition-opacity hover:text-[#e74c3c] group-hover/listrow:opacity-100"
                                                aria-label="Xóa list"
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    onDeleteList(space.id, null, list.id);
                                                }}
                                            />
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    ))}
                </div>

                <div className="mb-4 flex flex-col gap-0.5">
                    <div
                        className={`flex cursor-pointer select-none items-center gap-2.5 rounded-lg px-2.5 py-2 text-[13px] font-bold transition-all ${location.pathname === '/time-tracking' ? 'bg-[#0058be] text-white' : 'text-[#5f6368] hover:bg-[#f0f4ff] hover:text-[#141b2b]'}`}
                        onClick={() => navigate('/time-tracking')}
                    >
                        <Clock size={17} />
                        <span>Time Tracking</span>
                    </div>
                    <div
                        className={`flex cursor-pointer select-none items-center gap-2.5 rounded-lg px-2.5 py-2 text-[13px] font-bold transition-all ${location.pathname === '/dashboards' ? 'bg-[#0058be] text-white' : 'text-[#5f6368] hover:bg-[#f0f4ff] hover:text-[#141b2b]'}`}
                        onClick={() => navigate('/dashboards')}
                    >
                        <BarChart3 size={17} />
                        <span>Dashboards</span>
                    </div>
                    <div
                        className={`flex cursor-pointer select-none items-center gap-2.5 rounded-lg border ${location.pathname === '/ai' ? 'border-[#7c5cfc] bg-[linear-gradient(90deg,#7c5cfc_0%,#e84393_100%)] text-white shadow-sm' : 'border-[#e8edff] bg-[linear-gradient(90deg,#f0f4ff_0%,#fff_100%)] text-[#0058be] hover:bg-[#eef2ff]'} px-2.5 py-2 text-[13px] font-bold transition-all`}
                        onClick={() => navigate('/ai')}
                    >
                        <Sparkles size={17} />
                        <span>Flowise AI</span>
                        <span className="ml-auto text-xs">✨🔥</span>
                    </div>
                </div>

                <div className="mt-auto flex flex-col gap-1 border-t border-[#eef0f5] pt-3">
                    <button
                        className="mb-1 flex cursor-pointer items-center justify-center gap-2 rounded-lg border border-dashed border-[#0058be] bg-[#f0f4ff] px-2 py-2 text-xs font-extrabold text-[#0058be] transition-all hover:bg-[#0058be] hover:text-white"
                        onClick={onOpenInvitePeople}
                    >
                        <Users size={16} />
                        <span>Invite People</span>
                    </button>
                    <div
                        className="flex cursor-pointer select-none items-center gap-2.5 rounded-lg px-2.5 py-2 text-[13px] font-bold text-[#5f6368] transition-all hover:bg-[#f0f4ff] hover:text-[#141b2b]"
                        onClick={() => navigate('/settings')}
                    >
                        <Settings size={17} />
                        <span>Settings</span>
                    </div>
                    <div
                        className="flex cursor-pointer select-none items-center gap-2.5 rounded-lg px-2.5 py-2 text-[13px] font-bold text-[#e74c3c] transition-all hover:bg-[#fff1f0] hover:text-[#e74c3c]"
                        onClick={handleLogout}
                    >
                        <LogOut size={17} />
                        <span>Logout</span>
                    </div>
                </div>
            </aside>

            {actionMenu && (
                <div
                    ref={menuRef}
                    className="fixed z-2000 min-w-40 rounded-[10px] bg-white p-1 shadow-[0_4px_24px_rgba(0,0,0,0.14)]"
                    style={{ top: actionMenu.y, left: actionMenu.x }}
                    onClick={(e) => e.stopPropagation()}
                >
                    <button
                        className="flex w-full cursor-pointer items-center gap-2 rounded-md border-none bg-transparent px-3 py-2 text-left text-[13px] font-semibold text-[#5f6368] transition-all hover:bg-[#f0f4ff] hover:text-[#0058be]"
                        onClick={() => {
                            setCreateFolderTarget(actionMenu.spaceId);
                            setActionMenu(null);
                        }}
                    >
                        <FolderOpen size={14} /> New Folder
                    </button>
                    <button
                        className="flex w-full cursor-pointer items-center gap-2 rounded-md border-none bg-transparent px-3 py-2 text-left text-[13px] font-semibold text-[#5f6368] transition-all hover:bg-[#f0f4ff] hover:text-[#0058be]"
                        onClick={() => {
                            setCreateListTarget({ spaceId: actionMenu.spaceId, folderId: null });
                            setActionMenu(null);
                        }}
                    >
                        <List size={14} /> New List
                    </button>
                    <div className="my-1 h-px bg-[#eef0f5]" />
                    <button
                        type="button"
                        className="flex w-full cursor-pointer items-center gap-2 rounded-md border-none bg-transparent px-3 py-2 text-left text-[13px] font-semibold text-[#e74c3c] transition-all hover:bg-[#fff1f0] hover:text-[#c0392b]"
                        onClick={() => onDeleteSpace(actionMenu.spaceId)}
                    >
                        <Trash2 size={14} /> Xóa Space
                    </button>
                </div>
            )}
        </>
    );
}
