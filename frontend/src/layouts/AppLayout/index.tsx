import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import {
    Home, MessageSquare, ClipboardList, Clock, BarChart3,
    Plus, Settings, Users, LogOut, ChevronDown, ChevronRight,
    Sparkles, Grid3X3, FolderOpen, List, MoreHorizontal
} from 'lucide-react';
import { useState, useRef, useEffect } from 'react';
import CreateSpaceModal from '../../components/CreateSpaceModal';
import CreateFolderModal from '../../components/CreateFolderModal';
import CreateListModal from '../../components/CreateListModal';

/* ══ Types ══ */
interface ListItem {
    id: string;
    name: string;
}
interface FolderItem {
    id: string;
    name: string;
    expanded: boolean;
    lists: ListItem[];
}
interface SpaceItem {
    id: string;
    name: string;
    expanded: boolean;
    folders: FolderItem[];
    lists: ListItem[]; // lists directly in space (not in a folder)
    color: string;
}

/* ══ Initial Data ══ */
const initialSpaces: SpaceItem[] = [
    {
        id: 'marketing-space',
        name: 'Marketing Space',
        expanded: true,
        color: '#e84393',
        folders: [
            {
                id: 'q1-campaign',
                name: 'Q1 Campaign',
                expanded: true,
                lists: [
                    { id: 'social-media', name: 'Social Media' },
                    { id: 'email-marketing', name: 'Email Marketing' },
                ]
            },
        ],
        lists: [
            { id: 'brand-identity', name: 'Brand Identity' },
        ]
    },
    {
        id: 'development-space',
        name: 'Development Space',
        expanded: false,
        color: '#0984e3',
        folders: [
            {
                id: 'sprint-1',
                name: 'Sprint 1',
                expanded: false,
                lists: [
                    { id: 'frontend-tasks', name: 'Frontend Tasks' },
                    { id: 'backend-tasks', name: 'Backend Tasks' },
                ]
            },
        ],
        lists: []
    },
    {
        id: 'design-space',
        name: 'Design Space',
        expanded: false,
        color: '#00b894',
        folders: [],
        lists: [
            { id: 'ui-components', name: 'UI Components' },
            { id: 'research', name: 'Research' },
        ]
    },
];

export default function AppLayout() {
    const navigate = useNavigate();
    const location = useLocation();
    const [spaces, setSpaces] = useState<SpaceItem[]>(initialSpaces);
    const [isCreateSpaceOpen, setIsCreateSpaceOpen] = useState(false);

    // Folder/List creation
    const [createFolderTarget, setCreateFolderTarget] = useState<string | null>(null);
    const [createListTarget, setCreateListTarget] = useState<{ spaceId: string; folderId: string | null } | null>(null);

    // Action menu
    const [actionMenu, setActionMenu] = useState<{ spaceId: string; x: number; y: number } | null>(null);
    const menuRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClick = () => setActionMenu(null);
        document.addEventListener('click', handleClick);
        return () => document.removeEventListener('click', handleClick);
    }, []);

    const toggleSpace = (id: string) => {
        setSpaces(prev => prev.map(s => s.id === id ? { ...s, expanded: !s.expanded } : s));
    };

    const toggleFolder = (spaceId: string, folderId: string) => {
        setSpaces(prev => prev.map(s => {
            if (s.id !== spaceId) return s;
            return { ...s, folders: s.folders.map(f => f.id === folderId ? { ...f, expanded: !f.expanded } : f) };
        }));
    };

    const handleCreateSpace = (name: string, color: string) => {
        const id = name.toLowerCase().replace(/\s+/g, '-');
        setSpaces([...spaces, {
            id, name, expanded: true, folders: [], lists: [], color
        }]);
    };

    const handleCreateFolder = (name: string) => {
        if (!createFolderTarget) return;
        const folderId = name.toLowerCase().replace(/\s+/g, '-') + '-' + Date.now();
        setSpaces(prev => prev.map(s => {
            if (s.id !== createFolderTarget) return s;
            return { ...s, folders: [...s.folders, { id: folderId, name, expanded: true, lists: [] }] };
        }));
    };

    const handleCreateList = (name: string) => {
        if (!createListTarget) return;
        const listId = name.toLowerCase().replace(/\s+/g, '-') + '-' + Date.now();
        const { spaceId, folderId } = createListTarget;
        setSpaces(prev => prev.map(s => {
            if (s.id !== spaceId) return s;
            if (folderId) {
                return {
                    ...s,
                    folders: s.folders.map(f => {
                        if (f.id !== folderId) return f;
                        return { ...f, lists: [...f.lists, { id: listId, name }] };
                    })
                };
            }
            return { ...s, lists: [...s.lists, { id: listId, name }] };
        }));
    };

    const isSpaceActive = (spaceId: string) => location.pathname.startsWith(`/space/${spaceId}`);

    const handleSpaceAction = (e: React.MouseEvent, spaceId: string) => {
        e.stopPropagation();
        setActionMenu({ spaceId, x: e.clientX, y: e.clientY });
    };

    const targetSpace = createFolderTarget ? spaces.find(s => s.id === createFolderTarget) : null;
    const targetListFolder = createListTarget ? (() => {
        const sp = spaces.find(s => s.id === createListTarget.spaceId);
        if (!sp) return null;
        if (createListTarget.folderId) {
            const f = sp.folders.find(f => f.id === createListTarget.folderId);
            return f ? f.name : sp.name;
        }
        return sp.name;
    })() : null;

    return (
        <div className="flex h-screen overflow-hidden bg-[#f5f7ff] font-['Plus_Jakarta_Sans',sans-serif]">
            <aside className="flex w-60 shrink-0 flex-col overflow-y-auto border-r border-[#eef0f5] bg-white px-2.5 py-4 max-[900px]:hidden">
                {/* Logo */}
                <div className="mb-3 flex cursor-pointer items-center gap-2.5 border-b border-[#eef0f5] px-2 pb-4 pt-1" onClick={() => navigate('/home')}>
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#0058be]">
                        <Grid3X3 size={18} color="#fff" />
                    </div>
                    <div>
                        <div className="text-sm font-black text-[#141b2b]">Flowise PM</div>
                        <div className="text-[9px] font-extrabold leading-[1.1] tracking-[0.08em] text-[#0058be]">VECTOR LOGIC<br />WORKSPACE</div>
                    </div>
                </div>

                {/* Main Nav */}
                <nav className="mb-4 flex flex-col gap-0.5">
                    <div className={`flex cursor-pointer select-none items-center gap-2.5 rounded-lg px-2.5 py-2 text-[13px] font-bold transition-all ${location.pathname === '/home' ? 'bg-[#0058be] text-white' : 'text-[#5f6368] hover:bg-[#f0f4ff] hover:text-[#141b2b]'}`}
                        onClick={() => navigate('/home')}>
                        <Home size={17} /><span>Home</span>
                    </div>
                    <div className={`flex cursor-pointer select-none items-center gap-2.5 rounded-lg px-2.5 py-2 text-[13px] font-bold transition-all ${location.pathname === '/inbox' ? 'bg-[#0058be] text-white' : 'text-[#5f6368] hover:bg-[#f0f4ff] hover:text-[#141b2b]'}`}
                        onClick={() => navigate('/inbox')}>
                        <MessageSquare size={17} /><span>Inbox</span>
                        <span className="ml-auto rounded-[10px] bg-[#e74c3c] px-1.5 py-0.5 text-[10px] font-extrabold leading-none text-white">5</span>
                    </div>
                    <div className={`flex cursor-pointer select-none items-center gap-2.5 rounded-lg px-2.5 py-2 text-[13px] font-bold transition-all ${location.pathname === '/my-tasks' ? 'bg-[#0058be] text-white' : 'text-[#5f6368] hover:bg-[#f0f4ff] hover:text-[#141b2b]'}`}
                        onClick={() => navigate('/my-tasks')}>
                        <ClipboardList size={17} /><span>My Tasks</span>
                    </div>
                </nav>

                {/* Spaces */}
                <div className="mb-4 flex flex-1 flex-col overflow-y-auto">
                    <div className="flex items-center justify-between px-2.5 py-2 text-[11px] font-extrabold tracking-[0.08em] text-[#9aa0a6]">
                        <span>SPACES</span>
                        <Plus size={14} className="cursor-pointer text-[#c2c9e0] transition-colors hover:text-[#0058be]"
                            onClick={() => setIsCreateSpaceOpen(true)} />
                    </div>

                    {spaces.map((space) => (
                        <div key={space.id} className="mb-0.5">
                            {/* Space Row */}
                            <div
                                className={`group flex cursor-pointer select-none items-center gap-2.5 rounded-lg px-2.5 py-2 text-[13px] font-bold transition-all ${isSpaceActive(space.id) ? 'bg-[#f0f4ff] text-[#0058be]' : 'text-[#5f6368] hover:bg-[#f0f4ff] hover:text-[#141b2b]'}`}
                                onClick={() => navigate(`/space/${space.id}`)}
                            >
                                <span className="flex shrink-0 items-center text-[#9aa0a6] hover:text-[#141b2b]"
                                    onClick={(e) => { e.stopPropagation(); toggleSpace(space.id); }}>
                                    {space.expanded ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
                                </span>
                                <span className="flex h-5.5 w-5.5 shrink-0 items-center justify-center rounded-md" style={{ backgroundColor: space.color + '18', color: space.color }}>
                                    <Grid3X3 size={14} />
                                </span>
                                <span className="flex-1 truncate">{space.name}</span>
                                <div className="ml-auto hidden items-center gap-0.5 group-hover:flex">
                                    <MoreHorizontal size={13} className="cursor-pointer rounded p-0.5 text-[#9aa0a6] hover:bg-[#e8edff] hover:text-[#0058be]"
                                        onClick={(e) => handleSpaceAction(e, space.id)} />
                                    <Plus size={13} className="cursor-pointer rounded p-0.5 text-[#9aa0a6] hover:bg-[#e8edff] hover:text-[#0058be]"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            setActionMenu({ spaceId: space.id, x: e.clientX, y: e.clientY });
                                        }} />
                                </div>
                            </div>

                            {/* Expanded: Folders + Lists */}
                            {space.expanded && (
                                <div className="pl-3">
                                    {/* Folders */}
                                    {space.folders.map(folder => (
                                        <div key={folder.id} className="mb-px">
                                            <div className="group/folder flex cursor-pointer items-center gap-1.5 rounded-md px-2 py-1.25 text-xs font-bold text-[#5f6368] transition-all hover:bg-[#f0f4ff] hover:text-[#141b2b]"
                                                onClick={() => toggleFolder(space.id, folder.id)}>
                                                <span className="flex shrink-0 items-center text-[#b0b5c1]">
                                                    {folder.expanded ? <ChevronDown size={12} /> : <ChevronRight size={12} />}
                                                </span>
                                                <FolderOpen size={14} className="shrink-0 text-[#f0a220]" />
                                                <span className="flex-1 truncate">{folder.name}</span>
                                                <Plus size={12} className="cursor-pointer text-[#9aa0a6] opacity-0 transition-opacity hover:text-[#0058be] group-hover/folder:opacity-100"
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        setCreateListTarget({ spaceId: space.id, folderId: folder.id });
                                                    }} />
                                            </div>
                                            {folder.expanded && folder.lists.map(list => (
                                                <div key={list.id} className="flex cursor-pointer items-center gap-1.5 rounded-md px-2 py-1.25 pl-7 text-xs font-semibold text-[#9aa0a6] transition-all hover:bg-[#f0f4ff] hover:text-[#5f6368]"
                                                    onClick={() => navigate(`/space/${space.id}`)}>
                                                    <List size={13} className="shrink-0 text-[#b0b5c1]" />
                                                    <span className="flex-1 truncate">{list.name}</span>
                                                </div>
                                            ))}
                                        </div>
                                    ))}

                                    {/* Lists directly in space */}
                                    {space.lists.map(list => (
                                        <div key={list.id} className="flex cursor-pointer items-center gap-1.5 rounded-md px-2 py-1.25 pl-4 text-xs font-semibold text-[#9aa0a6] transition-all hover:bg-[#f0f4ff] hover:text-[#5f6368]"
                                            onClick={() => navigate(`/space/${space.id}`)}>
                                            <List size={13} className="shrink-0 text-[#b0b5c1]" />
                                            <span className="flex-1 truncate">{list.name}</span>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    ))}
                </div>

                {/* Extra Nav */}
                <div className="mb-4 flex flex-col gap-0.5">
                    <div className={`flex cursor-pointer select-none items-center gap-2.5 rounded-lg px-2.5 py-2 text-[13px] font-bold transition-all ${location.pathname === '/time-tracking' ? 'bg-[#0058be] text-white' : 'text-[#5f6368] hover:bg-[#f0f4ff] hover:text-[#141b2b]'}`}
                        onClick={() => navigate('/time-tracking')}>
                        <Clock size={17} /><span>Time Tracking</span>
                    </div>
                    <div className={`flex cursor-pointer select-none items-center gap-2.5 rounded-lg px-2.5 py-2 text-[13px] font-bold transition-all ${location.pathname === '/dashboards' ? 'bg-[#0058be] text-white' : 'text-[#5f6368] hover:bg-[#f0f4ff] hover:text-[#141b2b]'}`}
                        onClick={() => navigate('/dashboards')}>
                        <BarChart3 size={17} /><span>Dashboards</span>
                    </div>
                    <div className="flex cursor-pointer select-none items-center gap-2.5 rounded-lg border border-[#e8edff] bg-[linear-gradient(90deg,#f0f4ff_0%,#fff_100%)] px-2.5 py-2 text-[13px] font-bold text-[#0058be] transition-all hover:bg-[#eef2ff]">
                        <Sparkles size={17} /><span>Flowise AI</span>
                        <span className="ml-auto text-xs">✨🔥</span>
                    </div>
                </div>

                {/* Bottom */}
                <div className="mt-auto flex flex-col gap-1 border-t border-[#eef0f5] pt-3">
                    <button className="mb-1 flex cursor-pointer items-center justify-center gap-2 rounded-lg border border-dashed border-[#0058be] bg-[#f0f4ff] px-2 py-2 text-xs font-extrabold text-[#0058be] transition-all hover:bg-[#0058be] hover:text-white" onClick={() => navigate('/invite-team')}>
                        <Users size={16} /><span>Invite People</span>
                    </button>
                    <div className="flex cursor-pointer select-none items-center gap-2.5 rounded-lg px-2.5 py-2 text-[13px] font-bold text-[#5f6368] transition-all hover:bg-[#f0f4ff] hover:text-[#141b2b]" onClick={() => navigate('/settings')}>
                        <Settings size={17} /><span>Settings</span>
                    </div>
                    <div className="flex cursor-pointer select-none items-center gap-2.5 rounded-lg px-2.5 py-2 text-[13px] font-bold text-[#e74c3c] transition-all hover:bg-[#fff1f0] hover:text-[#e74c3c]" onClick={() => navigate('/login')}>
                        <LogOut size={17} /><span>Logout</span>
                    </div>
                </div>
            </aside>

            {/* Action Menu */}
            {actionMenu && (
                <div
                    ref={menuRef}
                    className="fixed z-2000 min-w-40 rounded-[10px] bg-white p-1 shadow-[0_4px_24px_rgba(0,0,0,0.14)]"
                    style={{ top: actionMenu.y, left: actionMenu.x }}
                    onClick={e => e.stopPropagation()}
                >
                    <button className="flex w-full cursor-pointer items-center gap-2 rounded-md border-none bg-transparent px-3 py-2 text-left text-[13px] font-semibold text-[#5f6368] transition-all hover:bg-[#f0f4ff] hover:text-[#0058be]" onClick={() => {
                        setCreateFolderTarget(actionMenu.spaceId);
                        setActionMenu(null);
                    }}>
                        <FolderOpen size={14} /> New Folder
                    </button>
                    <button className="flex w-full cursor-pointer items-center gap-2 rounded-md border-none bg-transparent px-3 py-2 text-left text-[13px] font-semibold text-[#5f6368] transition-all hover:bg-[#f0f4ff] hover:text-[#0058be]" onClick={() => {
                        setCreateListTarget({ spaceId: actionMenu.spaceId, folderId: null });
                        setActionMenu(null);
                    }}>
                        <List size={14} /> New List
                    </button>
                </div>
            )}

            {/* Main Content */}
            <main className="flex min-w-0 flex-1 flex-col overflow-y-auto bg-[#f5f7ff]">
                <Outlet />
            </main>

            {/* Modals */}
            <CreateSpaceModal
                isOpen={isCreateSpaceOpen}
                onClose={() => setIsCreateSpaceOpen(false)}
                onCreate={handleCreateSpace}
            />
            <CreateFolderModal
                isOpen={!!createFolderTarget}
                onClose={() => setCreateFolderTarget(null)}
                onCreate={handleCreateFolder}
                spaceName={targetSpace?.name || ''}
            />
            <CreateListModal
                isOpen={!!createListTarget}
                onClose={() => setCreateListTarget(null)}
                onCreate={handleCreateList}
                folderName={targetListFolder || ''}
            />
        </div>
    );
}
