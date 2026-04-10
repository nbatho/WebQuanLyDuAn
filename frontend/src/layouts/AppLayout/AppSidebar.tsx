import { useState, useRef, useEffect, type MouseEvent as ReactMouseEvent } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
    Home,
    MessageSquare,
    Clock,
    Plus,
    Settings,
    Users,
    LogOut,
    Sparkles,
    Grid3X3,
    MoreHorizontal,
    Trash2,
    ChevronDown,
    ChevronRight,
    FolderClosed,
    ListTodo,
    Pencil,
    Link2,
    Star,
    Palette,
    Copy,
    Archive,
    EyeOff,
    Zap,
    Columns3,
    MoreHorizontalIcon,
    FileText,
    LayoutDashboard,
    PenTool,
    FileSpreadsheet,
    Import,
    LayoutTemplate,
    Shield,
    ChevronRightIcon,
} from 'lucide-react';
import type { SpaceItem } from './types';
import type { FolderItem } from './useSpaceTreeState';
import WorkspaceSwitcher from './workspace/WorkspaceSwitcher';
import { fetchSignOut } from '@/store/modules/auth';
import type { AppDispatch } from '@/store/configureStore';
import { useDispatch } from 'react-redux';
import { useSpaceTree } from './SpaceTreeContext';

/* ════════════════════════════════════════════════════ */
/*  ClickUp-style Context Menu                          */
/* ════════════════════════════════════════════════════ */

interface MenuItem {
    icon: React.ReactNode;
    label: string;
    sublabel?: string;
    onClick?: () => void;
    danger?: boolean;
    hasSubmenu?: boolean;
    submenuItems?: MenuItem[];
}

type MenuEntry = MenuItem | 'divider';

interface ContextMenuProps {
    items: MenuEntry[];
    position: { x: number; y: number };
    onClose: () => void;
    footer?: React.ReactNode;
}

const ContextMenu = ({ items, position, onClose, footer }: ContextMenuProps) => {
    const ref = useRef<HTMLDivElement>(null);
    const [hoveredSubmenu, setHoveredSubmenu] = useState<number | null>(null);

    useEffect(() => {
        const handleClick = (e: MouseEvent) => {
            if (ref.current && !ref.current.contains(e.target as Node)) {
                onClose();
            }
        };
        const handleEsc = (e: KeyboardEvent) => {
            if (e.key === 'Escape') onClose();
        };
        document.addEventListener('mousedown', handleClick);
        document.addEventListener('keydown', handleEsc);
        return () => {
            document.removeEventListener('mousedown', handleClick);
            document.removeEventListener('keydown', handleEsc);
        };
    }, [onClose]);

    // keep menu in viewport
    const top = Math.min(position.y, window.innerHeight - 520);
    const left = Math.min(position.x, window.innerWidth - 260);

    return (
        <div
            ref={ref}
            className="fixed z-[9999] w-[240px] rounded-lg bg-white py-1.5 shadow-[0_4px_24px_rgba(0,0,0,0.15)] border border-[#e2e4e9]"
            style={{ top, left }}
            onClick={(e) => e.stopPropagation()}
        >
            {items.map((entry, i) => {
                if (entry === 'divider') {
                    return <div key={`d-${i}`} className="my-1 mx-2.5 h-px bg-[#eef0f3]" />;
                }

                const item = entry;
                return (
                    <div key={i} className="relative">
                        <button
                            type="button"
                            className={`flex w-full cursor-pointer items-center gap-2.5 border-none bg-transparent px-3.5 py-[6px] text-left text-[13px] transition-all ${
                                item.danger
                                    ? 'text-[#dc3545] hover:bg-[#fef2f2]'
                                    : 'text-[#1e1f21] hover:bg-[#f3f4f8]'
                            }`}
                            onClick={() => {
                                if (!item.hasSubmenu) {
                                    item.onClick?.();
                                    onClose();
                                }
                            }}
                            onMouseEnter={() => item.hasSubmenu && setHoveredSubmenu(i)}
                            onMouseLeave={() => item.hasSubmenu && setHoveredSubmenu(null)}
                        >
                            <span className={`shrink-0 ${item.danger ? 'text-[#dc3545]' : 'text-[#6b6f76]'}`}>
                                {item.icon}
                            </span>
                            <div className="flex flex-1 flex-col min-w-0">
                                <span className="font-medium">{item.label}</span>
                                {item.sublabel && (
                                    <span className="text-[11px] leading-tight text-[#6b6f76] font-normal mt-0.5">
                                        {item.sublabel}
                                    </span>
                                )}
                            </div>
                            {item.hasSubmenu && (
                                <ChevronRightIcon size={13} className="shrink-0 text-[#9b9ea4]" />
                            )}
                        </button>

                        {/* Submenu flyout */}
                        {item.hasSubmenu && hoveredSubmenu === i && item.submenuItems && (
                            <div
                                className="absolute left-full top-0 z-10 ml-0.5 w-[220px] rounded-lg bg-white py-1.5 shadow-[0_4px_24px_rgba(0,0,0,0.15)] border border-[#e2e4e9]"
                                onMouseEnter={() => setHoveredSubmenu(i)}
                                onMouseLeave={() => setHoveredSubmenu(null)}
                            >
                                {item.submenuItems.map((sub, si) => (
                                    <button
                                        key={si}
                                        type="button"
                                        className="flex w-full cursor-pointer items-center gap-2.5 border-none bg-transparent px-3.5 py-[6px] text-left text-[13px] text-[#1e1f21] transition-all hover:bg-[#f3f4f8]"
                                        onClick={() => {
                                            sub.onClick?.();
                                            onClose();
                                        }}
                                    >
                                        <span className="shrink-0 text-[#6b6f76]">{sub.icon}</span>
                                        <div className="flex flex-col min-w-0">
                                            <span className="font-medium">{sub.label}</span>
                                            {sub.sublabel && (
                                                <span className="text-[11px] leading-tight text-[#6b6f76] font-normal mt-0.5">
                                                    {sub.sublabel}
                                                </span>
                                            )}
                                        </div>
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>
                );
            })}

            {/* Footer button (e.g., Sharing & Permissions) */}
            {footer && (
                <div className="mx-2.5 mt-1.5 mb-1">
                    {footer}
                </div>
            )}
        </div>
    );
};

/* ────────────── "+" Create Menu (like ClickUp) ────────────── */
interface CreateMenuProps {
    position: { x: number; y: number };
    onClose: () => void;
    spaceId: string;
    spaceName: string;
}

const CreateMenu = ({ position, onClose, spaceId, spaceName }: CreateMenuProps) => {
    const ref = useRef<HTMLDivElement>(null);
    const tree = useSpaceTree();

    useEffect(() => {
        const handleClick = (e: MouseEvent) => {
            if (ref.current && !ref.current.contains(e.target as Node)) {
                onClose();
            }
        };
        const handleEsc = (e: KeyboardEvent) => {
            if (e.key === 'Escape') onClose();
        };
        document.addEventListener('mousedown', handleClick);
        document.addEventListener('keydown', handleEsc);
        return () => {
            document.removeEventListener('mousedown', handleClick);
            document.removeEventListener('keydown', handleEsc);
        };
    }, [onClose]);

    const top = Math.min(position.y, window.innerHeight - 350);
    const left = Math.min(position.x, window.innerWidth - 260);

    const items: { icon: React.ReactNode; label: string; sublabel?: string; onClick: () => void }[] = [
        {
            icon: <ListTodo size={16} />,
            label: 'List',
            sublabel: 'Track tasks, projects, people & more',
            onClick: () => {
                tree.setCreateListTarget({ spaceId, folderId: null, folderName: spaceName });
                onClose();
            },
        },
        {
            icon: <FolderClosed size={16} />,
            label: 'Folder',
            sublabel: 'Group Lists, Docs & more',
            onClick: () => {
                tree.setCreateFolderTarget({ spaceId, spaceName });
                onClose();
            },
        },
    ];

    const extraItems: { icon: React.ReactNode; label: string; onClick?: () => void }[] = [
        { icon: <FileText size={16} />, label: 'Doc' },
        { icon: <LayoutDashboard size={16} />, label: 'Dashboard' },
        { icon: <PenTool size={16} />, label: 'Whiteboard' },
        { icon: <FileSpreadsheet size={16} />, label: 'Form' },
    ];

    return (
        <div
            ref={ref}
            className="fixed z-[9999] w-[250px] rounded-lg bg-white py-1.5 shadow-[0_4px_24px_rgba(0,0,0,0.15)] border border-[#e2e4e9]"
            style={{ top, left }}
            onClick={(e) => e.stopPropagation()}
        >
            {/* Header */}
            <div className="px-3.5 py-1.5 text-[11px] font-semibold text-[#6b6f76] uppercase tracking-wide">
                Create
            </div>

            {/* Main items: List & Folder */}
            {items.map((item, i) => (
                <button
                    key={i}
                    type="button"
                    className="flex w-full cursor-pointer items-center gap-2.5 border-none bg-transparent px-3.5 py-[7px] text-left text-[13px] text-[#1e1f21] transition-all hover:bg-[#f3f4f8]"
                    onClick={item.onClick}
                >
                    <span className="shrink-0 text-[#6b6f76]">{item.icon}</span>
                    <div className="flex flex-col min-w-0">
                        <span className="font-medium">{item.label}</span>
                        {item.sublabel && (
                            <span className="text-[11px] leading-tight text-[#6b6f76] font-normal mt-0.5">
                                {item.sublabel}
                            </span>
                        )}
                    </div>
                </button>
            ))}

            <div className="my-1 mx-2.5 h-px bg-[#eef0f3]" />

            {/* Extra items: Doc, Dashboard, etc. */}
            {extraItems.map((item, i) => (
                <button
                    key={i}
                    type="button"
                    className="flex w-full cursor-pointer items-center gap-2.5 border-none bg-transparent px-3.5 py-[6px] text-left text-[13px] text-[#1e1f21] transition-all hover:bg-[#f3f4f8]"
                    onClick={item.onClick}
                >
                    <span className="shrink-0 text-[#6b6f76]">{item.icon}</span>
                    <span className="font-medium">{item.label}</span>
                </button>
            ))}

            <div className="my-1 mx-2.5 h-px bg-[#eef0f3]" />

            {/* Bottom: Imports & Templates */}
            <button className="flex w-full cursor-pointer items-center gap-2.5 border-none bg-transparent px-3.5 py-[6px] text-left text-[13px] text-[#1e1f21] transition-all hover:bg-[#f3f4f8]">
                <Import size={15} className="text-[#6b6f76]" />
                <span className="flex-1 font-medium">Imports</span>
                <ChevronRightIcon size={13} className="text-[#9b9ea4]" />
            </button>
            <button className="flex w-full cursor-pointer items-center gap-2.5 border-none bg-transparent px-3.5 py-[6px] text-left text-[13px] text-[#1e1f21] transition-all hover:bg-[#f3f4f8]">
                <LayoutTemplate size={15} className="text-[#6b6f76]" />
                <span className="flex-1 font-medium">Templates</span>
                <ChevronRightIcon size={13} className="text-[#9b9ea4]" />
            </button>
        </div>
    );
};

/* ─────────── List Node (Level 2) ─────────── */
const ListNode = ({
    list,
    spaceId,
    spaceName,
    folderId,
    folderNameForList,
}: {
    list: { id: string; name: string; count?: number };
    spaceId: string;
    spaceName: string;
    folderId: string | null;
    /** Tên folder cha hoặc tên space (list độc lập) — dùng cho Create List */
    folderNameForList: string;
}) => {
    const navigate = useNavigate();
    const location = useLocation();
    const tree = useSpaceTree();
    const [listMenu, setListMenu] = useState<{ x: number; y: number } | null>(null);
    const [listCreateMenu, setListCreateMenu] = useState<{ x: number; y: number } | null>(null);
    const isActive = location.pathname === `/list/${list.id}`;

    const listMenuItems: MenuEntry[] = [
        { icon: <Pencil size={14} />, label: 'Rename', onClick: () => {} },
        { icon: <Link2 size={14} />, label: 'Copy link', onClick: () => {} },
        'divider',
        { icon: <Palette size={14} />, label: 'Color & Icon', onClick: () => {} },
        { icon: <Columns3 size={14} />, label: 'Custom Fields', onClick: () => {} },
        'divider',
        { icon: <Copy size={14} />, label: 'Duplicate', onClick: () => {} },
        { icon: <Archive size={14} />, label: 'Archive', onClick: () => {} },
        {
            icon: <Trash2 size={14} />,
            label: 'Delete',
            danger: true,
            onClick: async () => {
                await tree.handleDeleteList(spaceId, folderId, list.id);
                if (location.pathname === `/list/${list.id}`) {
                    navigate('/home');
                }
            },
        },
    ];

    const listCreateItems: MenuEntry[] = [
        {
            icon: <ListTodo size={15} />,
            label: 'List',
            sublabel: 'Track tasks, projects & more',
            onClick: () => {
                tree.setCreateListTarget({
                    spaceId,
                    folderId,
                    folderName: folderNameForList,
                });
            },
        },
        {
            icon: <FolderClosed size={15} />,
            label: 'Folder',
            sublabel: 'Group Lists, Docs & more',
            onClick: () => {
                tree.setCreateFolderTarget({ spaceId, spaceName });
            },
        },
    ];

    return (
        <div
            className={`group relative flex cursor-pointer items-center gap-2 rounded-md px-2 py-[5px] text-[12.5px] transition-all ${
                isActive ? 'bg-[#e8f0fe] text-[#1a73e8] font-semibold' : 'text-[#1e1f21] hover:bg-[#f3f4f8]'
            }`}
            onClick={() => navigate(`/list/${list.id}`)}
        >
            <ListTodo size={14} className="shrink-0 text-[#6b6f76]" />
            <span className="min-w-0 flex-1 truncate">{list.name}</span>
            {list.count !== undefined && list.count > 0 && (
                <span className="shrink-0 text-[11px] text-[#9b9ea4] font-medium">{list.count}</span>
            )}
            <div className="ml-auto hidden shrink-0 items-center gap-0.5 group-hover:flex">
                <span
                    className="flex h-5 w-5 cursor-pointer items-center justify-center rounded text-[#6b6f76] hover:bg-[#e2e4e9] hover:text-[#1e1f21] transition-all"
                    onClick={(e) => {
                        e.stopPropagation();
                        setListCreateMenu(null);
                        setListMenu(listMenu ? null : { x: e.clientX, y: e.clientY });
                    }}
                >
                    <MoreHorizontal size={14} />
                </span>
                <span
                    className="flex h-5 w-5 cursor-pointer items-center justify-center rounded text-[#6b6f76] hover:bg-[#e2e4e9] hover:text-[#1a73e8] transition-all"
                    onClick={(e) => {
                        e.stopPropagation();
                        setListMenu(null);
                        setListCreateMenu(listCreateMenu ? null : { x: e.clientX, y: e.clientY });
                    }}
                >
                    <Plus size={14} />
                </span>
            </div>

            {listMenu && (
                <ContextMenu items={listMenuItems} position={listMenu} onClose={() => setListMenu(null)} />
            )}
            {listCreateMenu && (
                <ContextMenu items={listCreateItems} position={listCreateMenu} onClose={() => setListCreateMenu(null)} />
            )}
        </div>
    );
};

/* ─────────── Folder Node (Level 1) ─────────── */
const FolderNode = ({ folder, spaceId, spaceName }: { folder: FolderItem; spaceId: string; spaceName: string }) => {
    const navigate = useNavigate();
    const location = useLocation();
    const [expanded, setExpanded] = useState(true);
    const tree = useSpaceTree();
    const [folderMenu, setFolderMenu] = useState<{ x: number; y: number } | null>(null);
    const [folderCreateMenu, setFolderCreateMenu] = useState<{ x: number; y: number } | null>(null);

    const isFolderActive = location.pathname === `/folder/${folder.id}`;

    useEffect(() => {
        if (isFolderActive) setExpanded(true);
    }, [isFolderActive]);

    const folderMenuItems: MenuEntry[] = [
        { icon: <Pencil size={14} />, label: 'Rename', onClick: () => {} },
        { icon: <Link2 size={14} />, label: 'Copy link', onClick: () => {} },
        'divider',
        {
            icon: <ListTodo size={14} />,
            label: 'Add List',
            onClick: () => {
                tree.setCreateListTarget({ spaceId, folderId: folder.id, folderName: folder.name });
            },
        },
        {
            icon: <FolderClosed size={14} />,
            label: 'Add Folder',
            onClick: () => {
                tree.setCreateFolderTarget({ spaceId, spaceName });
            },
        },
        'divider',
        { icon: <Copy size={14} />, label: 'Duplicate', onClick: () => {} },
        { icon: <Archive size={14} />, label: 'Archive', onClick: () => {} },
        {
            icon: <Trash2 size={14} />,
            label: 'Delete',
            danger: true,
            onClick: () => tree.handleDeleteFolder(spaceId, folder.id),
        },
    ];

    const folderCreateItems: MenuEntry[] = [
        {
            icon: <ListTodo size={15} />,
            label: 'List',
            sublabel: 'Track tasks, projects & more',
            onClick: () => {
                tree.setCreateListTarget({ spaceId, folderId: folder.id, folderName: folder.name });
            },
        },
        {
            icon: <FolderClosed size={15} />,
            label: 'Folder',
            sublabel: 'Group Lists, Docs & more',
            onClick: () => {
                tree.setCreateFolderTarget({ spaceId, spaceName });
            },
        },
    ];

    return (
        <div className="mb-0.5">
            <div
                className={`group flex items-center gap-0.5 rounded-md px-2 py-[5px] text-[12.5px] font-medium transition-all ${
                    isFolderActive
                        ? 'bg-[#e8f0fe] text-[#1a73e8]'
                        : 'text-[#1e1f21] hover:bg-[#f3f4f8]'
                }`}
            >
                <span
                    role="button"
                    tabIndex={0}
                    className="flex h-5 w-5 shrink-0 cursor-pointer items-center justify-center rounded text-[#6b6f76] hover:bg-[#e2e4e9]"
                    onClick={(e) => {
                        e.stopPropagation();
                        setExpanded((v) => !v);
                    }}
                    onKeyDown={(e) => {
                        if (e.key === 'Enter' || e.key === ' ') {
                            e.preventDefault();
                            setExpanded((v) => !v);
                        }
                    }}
                >
                    {expanded ? (
                        <ChevronDown size={13} />
                    ) : (
                        <ChevronRight size={13} />
                    )}
                </span>
                <div
                    className="flex min-w-0 flex-1 cursor-pointer items-center gap-1.5"
                    onClick={() => navigate(`/folder/${folder.id}`)}
                >
                    <FolderClosed size={14} className={`shrink-0 ${isFolderActive ? 'text-[#1a73e8]' : 'text-[#6b6f76]'}`} />
                    <span className={`truncate ${isFolderActive ? 'font-semibold' : 'font-medium'}`}>{folder.name}</span>
                </div>

                {/* Hover actions */}
                <div className="ml-auto hidden shrink-0 items-center gap-0.5 group-hover:flex">
                    <span
                        className="flex h-5 w-5 cursor-pointer items-center justify-center rounded text-[#6b6f76] hover:bg-[#e2e4e9] hover:text-[#1e1f21] transition-all"
                        onClick={(e) => {
                            e.stopPropagation();
                            setFolderCreateMenu(null);
                            setFolderMenu(folderMenu ? null : { x: e.clientX, y: e.clientY });
                        }}
                    >
                        <MoreHorizontal size={14} />
                    </span>
                    <span
                        className="flex h-5 w-5 cursor-pointer items-center justify-center rounded text-[#6b6f76] hover:bg-[#e2e4e9] hover:text-[#1a73e8] transition-all"
                        onClick={(e) => {
                            e.stopPropagation();
                            setFolderMenu(null);
                            setFolderCreateMenu(folderCreateMenu ? null : { x: e.clientX, y: e.clientY });
                        }}
                    >
                        <Plus size={14} />
                    </span>
                </div>
            </div>

            {expanded && folder.lists.length > 0 && (
                <div className="ml-[18px] border-l border-[#e2e4e9] pl-2">
                    {folder.lists.map((list) => (
                        <ListNode
                            key={list.id}
                            list={list}
                            spaceId={spaceId}
                            spaceName={spaceName}
                            folderId={folder.id}
                            folderNameForList={folder.name}
                        />
                    ))}
                </div>
            )}

            {/* Folder "..." context menu */}
            {folderMenu && (
                <ContextMenu
                    items={folderMenuItems}
                    position={folderMenu}
                    onClose={() => setFolderMenu(null)}
                />
            )}

            {/* Folder "+" create menu */}
            {folderCreateMenu && (
                <ContextMenu
                    items={folderCreateItems}
                    position={folderCreateMenu}
                    onClose={() => setFolderCreateMenu(null)}
                />
            )}
        </div>
    );
};

/* ─────────── Space Node (Level 0) ─────────── */
const SpaceNode = ({ space }: { space: SpaceItem }) => {
    const navigate = useNavigate();
    const location = useLocation();
    const tree = useSpaceTree();
    const isSpaceActive = location.pathname.startsWith(`/space/${space.id}`);
    const [expanded, setExpanded] = useState(isSpaceActive);
    const treeNode = tree.spaceTree[space.id] || { folders: [], standaloneLists: [] };
    const { folders, standaloneLists } = treeNode;
    const initial = space.name.charAt(0).toUpperCase();

    /* Menu states */
    const [settingsMenu, setSettingsMenu] = useState<{ x: number; y: number } | null>(null);
    const [createMenuPos, setCreateMenuPos] = useState<{ x: number; y: number } | null>(null);

    /* ── "..." menu items — matches ClickUp exactly ── */
    const settingsItems: MenuEntry[] = [
        {
            icon: <Star size={15} />,
            label: 'Favorite',
            hasSubmenu: true,
            submenuItems: [],
            onClick: () => {},
        },
        { icon: <Pencil size={15} />, label: 'Rename', onClick: () => {} },
        { icon: <Link2 size={15} />, label: 'Copy link', onClick: () => {} },
        'divider',
        {
            icon: <Plus size={15} />,
            label: 'Create new',
            hasSubmenu: true,
            submenuItems: [
                {
                    icon: <ListTodo size={15} />,
                    label: 'List',
                    sublabel: 'Track tasks, projects & more',
                    onClick: () => {
                        tree.setCreateListTarget({ spaceId: space.id, folderId: null, folderName: space.name });
                    },
                },
                {
                    icon: <FolderClosed size={15} />,
                    label: 'Folder',
                    sublabel: 'Group Lists, Docs & more',
                    onClick: () => {
                        tree.setCreateFolderTarget({ spaceId: space.id, spaceName: space.name });
                    },
                },
                { icon: <FileText size={15} />, label: 'Doc', onClick: () => {} },
                { icon: <LayoutDashboard size={15} />, label: 'Dashboard', onClick: () => {} },
                { icon: <PenTool size={15} />, label: 'Whiteboard', onClick: () => {} },
                { icon: <FileSpreadsheet size={15} />, label: 'Form', onClick: () => {} },
            ],
        },
        {
            icon: <Palette size={15} />,
            label: 'Color & Icon',
            hasSubmenu: true,
            submenuItems: [],
            onClick: () => {},
        },
        { icon: <Zap size={15} />, label: 'Automations', onClick: () => {} },
        { icon: <Columns3 size={15} />, label: 'Custom Fields', onClick: () => {} },
        {
            icon: <MoreHorizontalIcon size={15} />,
            label: 'More',
            hasSubmenu: true,
            submenuItems: [],
            onClick: () => {},
        },
        'divider',
        {
            icon: <EyeOff size={15} />,
            label: 'Hide Space',
            sublabel: "You'll retain access to this Space, but it won't show in your sidebar",
            onClick: () => {},
        },
        'divider',
        { icon: <Copy size={15} />, label: 'Duplicate', onClick: () => {} },
        { icon: <Archive size={15} />, label: 'Archive', onClick: () => {} },
        {
            icon: <Trash2 size={15} />,
            label: 'Delete',
            danger: true,
            onClick: () => tree.handleDeleteSpace(space.id),
        },
    ];

    return (
        <div className="mb-0.5">
            {/* Space header */}
            <div
                className={`group flex cursor-pointer select-none items-center gap-2 rounded-md px-2 py-[6px] text-[13px] font-semibold transition-all ${
                    isSpaceActive
                        ? 'bg-[#e8f0fe] text-[#1a73e8]'
                        : 'text-[#1e1f21] hover:bg-[#f3f4f8]'
                }`}
                onClick={() => {
                    navigate(`/space/${space.id}`);
                    if (!expanded) setExpanded(true);
                }}
            >
                {/* Expand/collapse chevron */}
                <span
                    className="flex shrink-0 cursor-pointer items-center justify-center"
                    onClick={(e) => {
                        e.stopPropagation();
                        setExpanded(!expanded);
                    }}
                >
                    {expanded ? (
                        <ChevronDown size={14} className="text-[#6b6f76]" />
                    ) : (
                        <ChevronRight size={14} className="text-[#6b6f76]" />
                    )}
                </span>

                {/* Color avatar */}
                <span
                    className="flex h-[22px] w-[22px] shrink-0 items-center justify-center rounded-md text-[11px] font-bold text-white"
                    style={{ backgroundColor: space.color }}
                >
                    {initial}
                </span>

                <span className="flex-1 truncate">{space.name}</span>

                {/* Hover actions: ... and + */}
                <div className="ml-auto hidden items-center gap-0.5 group-hover:flex">
                    <span
                        className="flex h-6 w-6 cursor-pointer items-center justify-center rounded text-[#6b6f76] hover:bg-[#e2e4e9] hover:text-[#1e1f21] transition-all"
                        onClick={(e) => {
                            e.stopPropagation();
                            setCreateMenuPos(null);
                            setSettingsMenu(settingsMenu ? null : { x: e.clientX, y: e.clientY });
                        }}
                    >
                        <MoreHorizontal size={15} />
                    </span>
                    <span
                        className="flex h-6 w-6 cursor-pointer items-center justify-center rounded text-[#6b6f76] hover:bg-[#e2e4e9] hover:text-[#1a73e8] transition-all"
                        onClick={(e) => {
                            e.stopPropagation();
                            setSettingsMenu(null);
                            setCreateMenuPos(createMenuPos ? null : { x: e.clientX, y: e.clientY });
                        }}
                    >
                        <Plus size={15} />
                    </span>
                </div>
            </div>

            {/* Children: folders & standalone lists */}
            {expanded && (
                <div className="ml-[14px] border-l border-[#e2e4e9] pl-1.5 mt-0.5">
                    {folders.map((folder) => (
                        <FolderNode key={folder.id} folder={folder} spaceId={space.id} spaceName={space.name} />
                    ))}
                    {standaloneLists.map((list) => (
                        <ListNode
                            key={list.id}
                            list={list}
                            spaceId={space.id}
                            spaceName={space.name}
                            folderId={null}
                            folderNameForList={space.name}
                        />
                    ))}
                </div>
            )}

            {/* ── "..." context menu ── */}
            {settingsMenu && (
                <ContextMenu
                    items={settingsItems}
                    position={settingsMenu}
                    onClose={() => setSettingsMenu(null)}
                    footer={
                        <button className="flex w-full cursor-pointer items-center justify-center gap-2 rounded-md border-none bg-[#7b68ee] px-4 py-2 text-[13px] font-semibold text-white transition-all hover:bg-[#6c5ce7]">
                            <Shield size={14} />
                            Sharing & Permissions
                        </button>
                    }
                />
            )}

            {/* ── "+" create menu ── */}
            {createMenuPos && (
                <CreateMenu
                    position={createMenuPos}
                    onClose={() => setCreateMenuPos(null)}
                    spaceId={space.id}
                    spaceName={space.name}
                />
            )}
        </div>
    );
};

/* ═══════════════════════════════════════════════════ */
/*           Main Sidebar Component                    */
/* ═══════════════════════════════════════════════════ */
export default function AppSidebar() {
    const navigate = useNavigate();
    const location = useLocation();
    const dispatch = useDispatch<AppDispatch>();
    const tree = useSpaceTree();
    const [spacesCollapsed, setSpacesCollapsed] = useState(false);

    const handleLogout = () => {
        try {
            dispatch(fetchSignOut());
            navigate('/login');
        } catch (error) {
            console.error('Logout failed:', error);
        }
    };

    const navItem = (
        path: string,
        icon: React.ReactNode,
        label: string,
        badge?: React.ReactNode,
    ) => {
        const isActive = location.pathname === path;
        return (
            <div
                className={`flex cursor-pointer select-none items-center gap-2.5 rounded-md px-2.5 py-[7px] text-[13.5px] font-medium transition-all ${
                    isActive
                        ? 'bg-[#e8f0fe] text-[#1a73e8] font-semibold'
                        : 'text-[#1e1f21] hover:bg-[#f3f4f8]'
                }`}
                onClick={() => navigate(path)}
            >
                {icon}
                <span className="flex-1">{label}</span>
                {badge}
            </div>
        );
    };

    return (
        <aside className="flex w-[260px] shrink-0 flex-col overflow-y-auto border-r border-[#e2e4e9] bg-white px-2.5 py-3 max-[900px]:hidden">
            {/* ── Header / Workspace ── */}
            <div
                className="mb-2 flex cursor-pointer items-center gap-2.5 rounded-lg px-2 pb-3 pt-1 border-b border-[#e2e4e9]"
                onClick={() => navigate('/home')}
            >
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#1a73e8]">
                    <Grid3X3 size={18} color="#fff" />
                </div>
                <div className="min-w-0 flex-1">
                    <div className="text-[14px] font-bold text-[#1e1f21]">Flowise PM</div>
                    <WorkspaceSwitcher onOpenCreate={() => tree.setIsWorkspaceDialogOpen(true)} />
                </div>
            </div>

            {/* ── Global Navigation ── */}
            <nav className="mb-1 flex flex-col gap-0.5">
                {navItem('/home', <Home size={18} strokeWidth={1.8} />, 'Home')}
                {navItem(
                    '/inbox',
                    <MessageSquare size={18} strokeWidth={1.8} />,
                    'Inbox',
                    <span className="ml-auto flex h-[18px] min-w-[18px] items-center justify-center rounded-full bg-[#1a73e8] px-1 text-[10px] font-bold leading-none text-white">
                        5
                    </span>,
                )}
                {navItem('/time-tracking', <Clock size={18} strokeWidth={1.8} />, 'Time Tracking')}

                {/* Flowise AI */}
                <div
                    className={`flex cursor-pointer select-none items-center gap-2.5 rounded-md px-2.5 py-[7px] text-[13.5px] font-medium transition-all ${
                        location.pathname === '/ai'
                            ? 'bg-gradient-to-r from-[#7c5cfc] to-[#e84393] text-white shadow-sm'
                            : 'text-[#1e1f21] hover:bg-[#f3f4f8]'
                    }`}
                    onClick={() => navigate('/ai')}
                >
                    <Sparkles size={18} strokeWidth={1.8} />
                    <span>Flowise AI</span>
                </div>
            </nav>

            {/* ── Spaces Section ── */}
            <div className="mb-1 mt-2 flex flex-1 flex-col overflow-y-auto">
                {/* Spaces header */}
                <div className="flex items-center justify-between px-2.5 py-[6px]">
                    <button
                        className="flex cursor-pointer items-center gap-1 border-none bg-transparent p-0 text-[11px] font-extrabold tracking-[0.06em] uppercase text-[#6b6f76] hover:text-[#1e1f21] transition-colors"
                        onClick={() => setSpacesCollapsed(!spacesCollapsed)}
                    >
                        {spacesCollapsed ? <ChevronRight size={12} /> : <ChevronDown size={12} />}
                        Spaces
                    </button>
                    <Plus
                        size={15}
                        className="cursor-pointer text-[#6b6f76] transition-colors hover:text-[#1a73e8]"
                        onClick={() => tree.setIsCreateSpaceOpen(true)}
                    />
                </div>

                {!spacesCollapsed && (
                    <div className="mt-0.5 flex flex-col gap-0.5">
                        {tree.spaces.map((space) => (
                            <SpaceNode key={space.id} space={space} />
                        ))}
                    </div>
                )}
            </div>

            {/* ── Bottom Actions ── */}
            <div className="mt-auto flex flex-col gap-0.5 border-t border-[#e2e4e9] pt-2">
                <div
                    className="flex cursor-pointer select-none items-center gap-2.5 rounded-md px-2.5 py-[7px] text-[13.5px] font-medium text-[#1e1f21] transition-all hover:bg-[#f3f4f8]"
                    onClick={() => tree.setIsInviteModalOpen(true)}
                >
                    <Users size={18} strokeWidth={1.8} />
                    <span>Invite People</span>
                </div>
                <div
                    className="flex cursor-pointer select-none items-center gap-2.5 rounded-md px-2.5 py-[7px] text-[13.5px] font-medium text-[#1e1f21] transition-all hover:bg-[#f3f4f8]"
                    onClick={() => navigate('/settings')}
                >
                    <Settings size={18} strokeWidth={1.8} />
                    <span>Settings</span>
                </div>
                <div
                    className="flex cursor-pointer select-none items-center gap-2.5 rounded-md px-2.5 py-[7px] text-[13.5px] font-medium text-[#e74c3c] transition-all hover:bg-[#fef2f2]"
                    onClick={handleLogout}
                >
                    <LogOut size={18} strokeWidth={1.8} />
                    <span>Logout</span>
                </div>
            </div>
        </aside>
    );
}
