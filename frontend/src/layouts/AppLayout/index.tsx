import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import {
    Home, MessageSquare, ClipboardList, Clock, BarChart3,
    Plus, Settings, Users, LogOut, ChevronDown, ChevronRight,
    Sparkles, Grid3X3, FolderOpen, List, MoreHorizontal
} from 'lucide-react';
import './app-layout.css';
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
        <div className="al-container">
            <aside className="al-sidebar">
                {/* Logo */}
                <div className="al-sb-logo" onClick={() => navigate('/home')} style={{ cursor: 'pointer' }}>
                    <div className="al-sb-logo-icon">
                        <Grid3X3 size={18} color="#fff" />
                    </div>
                    <div>
                        <div className="al-sb-logo-name">Flowise PM</div>
                        <div className="al-sb-logo-sub">VECTOR LOGIC<br />WORKSPACE</div>
                    </div>
                </div>

                {/* Main Nav */}
                <nav className="al-sb-nav">
                    <div className={`al-sb-item ${location.pathname === '/home' ? 'al-sb-item--active' : ''}`}
                        onClick={() => navigate('/home')}>
                        <Home size={17} /><span>Home</span>
                    </div>
                    <div className={`al-sb-item ${location.pathname === '/inbox' ? 'al-sb-item--active' : ''}`}
                        onClick={() => navigate('/inbox')}>
                        <MessageSquare size={17} /><span>Inbox</span>
                        <span className="al-sb-badge">5</span>
                    </div>
                    <div className={`al-sb-item ${location.pathname === '/my-tasks' ? 'al-sb-item--active' : ''}`}
                        onClick={() => navigate('/my-tasks')}>
                        <ClipboardList size={17} /><span>My Tasks</span>
                    </div>
                </nav>

                {/* Spaces */}
                <div className="al-sb-section">
                    <div className="al-sb-section-header">
                        <span>SPACES</span>
                        <Plus size={14} className="al-sb-section-add"
                            onClick={() => setIsCreateSpaceOpen(true)} />
                    </div>

                    {spaces.map((space) => (
                        <div key={space.id} className="al-sb-space-tree">
                            {/* Space Row */}
                            <div
                                className={`al-sb-item al-sb-space-row ${isSpaceActive(space.id) ? 'al-sb-item--space-active' : ''}`}
                                onClick={() => navigate(`/space/${space.id}`)}
                            >
                                <span className="al-sb-chevron"
                                    onClick={(e) => { e.stopPropagation(); toggleSpace(space.id); }}>
                                    {space.expanded ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
                                </span>
                                <span className="al-sb-space-icon" style={{ backgroundColor: space.color + '18', color: space.color }}>
                                    <Grid3X3 size={14} />
                                </span>
                                <span className="al-sb-space-name">{space.name}</span>
                                <div className="al-sb-space-actions">
                                    <MoreHorizontal size={13} className="al-sb-act-btn"
                                        onClick={(e) => handleSpaceAction(e, space.id)} />
                                    <Plus size={13} className="al-sb-act-btn"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            setActionMenu({ spaceId: space.id, x: e.clientX, y: e.clientY });
                                        }} />
                                </div>
                            </div>

                            {/* Expanded: Folders + Lists */}
                            {space.expanded && (
                                <div className="al-sb-children">
                                    {/* Folders */}
                                    {space.folders.map(folder => (
                                        <div key={folder.id} className="al-sb-folder-tree">
                                            <div className="al-sb-folder-row"
                                                onClick={() => toggleFolder(space.id, folder.id)}>
                                                <span className="al-sb-chevron-sm">
                                                    {folder.expanded ? <ChevronDown size={12} /> : <ChevronRight size={12} />}
                                                </span>
                                                <FolderOpen size={14} className="al-sb-folder-icon" />
                                                <span className="al-sb-folder-name">{folder.name}</span>
                                                <Plus size={12} className="al-sb-folder-add"
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        setCreateListTarget({ spaceId: space.id, folderId: folder.id });
                                                    }} />
                                            </div>
                                            {folder.expanded && folder.lists.map(list => (
                                                <div key={list.id} className="al-sb-list-row"
                                                    onClick={() => navigate(`/space/${space.id}`)}>
                                                    <List size={13} className="al-sb-list-icon" />
                                                    <span className="al-sb-list-name">{list.name}</span>
                                                </div>
                                            ))}
                                        </div>
                                    ))}

                                    {/* Lists directly in space */}
                                    {space.lists.map(list => (
                                        <div key={list.id} className="al-sb-list-row al-sb-list-row--direct"
                                            onClick={() => navigate(`/space/${space.id}`)}>
                                            <List size={13} className="al-sb-list-icon" />
                                            <span className="al-sb-list-name">{list.name}</span>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    ))}
                </div>

                {/* Extra Nav */}
                <div className="al-sb-extra">
                    <div className={`al-sb-item ${location.pathname === '/time-tracking' ? 'al-sb-item--active' : ''}`}
                        onClick={() => navigate('/time-tracking')}>
                        <Clock size={17} /><span>Time Tracking</span>
                    </div>
                    <div className={`al-sb-item ${location.pathname === '/dashboards' ? 'al-sb-item--active' : ''}`}
                        onClick={() => navigate('/dashboards')}>
                        <BarChart3 size={17} /><span>Dashboards</span>
                    </div>
                    <div className="al-sb-item al-sb-item--ai">
                        <Sparkles size={17} /><span>Flowise AI</span>
                        <span className="al-sb-ai-sparkle">✨🔥</span>
                    </div>
                </div>

                {/* Bottom */}
                <div className="al-sb-bottom">
                    <button className="al-sb-invite-btn" onClick={() => navigate('/invite-team')}>
                        <Users size={16} /><span>Invite People</span>
                    </button>
                    <div className="al-sb-item" onClick={() => navigate('/settings')}>
                        <Settings size={17} /><span>Settings</span>
                    </div>
                    <div className="al-sb-item al-sb-item--logout" onClick={() => navigate('/login')}>
                        <LogOut size={17} /><span>Logout</span>
                    </div>
                </div>
            </aside>

            {/* Action Menu */}
            {actionMenu && (
                <div
                    ref={menuRef}
                    className="al-action-menu"
                    style={{ position: 'fixed', top: actionMenu.y, left: actionMenu.x, zIndex: 2000 }}
                    onClick={e => e.stopPropagation()}
                >
                    <button className="al-am-item" onClick={() => {
                        setCreateFolderTarget(actionMenu.spaceId);
                        setActionMenu(null);
                    }}>
                        <FolderOpen size={14} /> New Folder
                    </button>
                    <button className="al-am-item" onClick={() => {
                        setCreateListTarget({ spaceId: actionMenu.spaceId, folderId: null });
                        setActionMenu(null);
                    }}>
                        <List size={14} /> New List
                    </button>
                </div>
            )}

            {/* Main Content */}
            <main className="al-main">
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
