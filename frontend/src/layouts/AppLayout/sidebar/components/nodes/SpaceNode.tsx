import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
    ChevronDown,
    ChevronRight,
    Star,
    Pencil,
    Link2,
    Plus,
    ListTodo,
    FolderClosed,
    FileText,
    LayoutDashboard,
    PenTool,
    FileSpreadsheet,
    Palette,
    Zap,
    Columns3,
    MoreHorizontalIcon,
    EyeOff,
    Copy,
    Archive,
    Trash2,
    MoreHorizontal,
    Shield,
} from 'lucide-react';
import { useSpaceTree } from '../../../SpaceTreeContext';
import { ContextMenu } from '../ContextMenu';
import { CreateMenu } from '../CreateMenu';
import { FolderNode } from './FolderNode';
import { ListNode } from './ListNode';
import type { SpaceItem } from '@/types/spaces';
import type { MenuEntry } from '../../types';

export const SpaceNode = ({ space }: { space: SpaceItem }) => {
    const navigate = useNavigate();
    const location = useLocation();
    const tree = useSpaceTree();
    const isSpaceActive = location.pathname.startsWith(`/space/${space.id}`);
    const [expanded, setExpanded] = useState(isSpaceActive);
    const treeNode = tree.spaceTree[space.id] || { folders: [], standaloneLists: [] };
    const { folders, standaloneLists } = treeNode;
    const initial = space?.name ? space.name.charAt(0).toUpperCase() : '?';

    const [settingsMenu, setSettingsMenu] = useState<{ x: number; y: number } | null>(null);
    const [createMenuPos, setCreateMenuPos] = useState<{ x: number; y: number } | null>(null);

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
            <div
                className={`group flex cursor-pointer select-none items-center gap-2 rounded-md px-2 py-1.5 text-[13px] font-semibold transition-all ${
                    isSpaceActive
                        ? 'bg-[#e8f0fe] text-[#1a73e8]'
                        : 'text-[#1e1f21] hover:bg-[#f3f4f8]'
                }`}
                onClick={() => {
                    navigate(`/space/${space.id}`);
                    if (!expanded) setExpanded(true);
                }}
            >
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
                <span
                    className="flex h-5.5 w-5.5 shrink-0 items-center justify-center rounded-md text-[11px] font-bold text-white"
                    style={{ backgroundColor: space.color }}
                >
                    {initial ? initial : <FileText size={12} color="#fff" />}
                </span>

                <span className="flex-1 truncate">{space.name}</span>

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

            {expanded && (
                <div className="ml-3.5 border-l border-[#e2e4e9] pl-1.5 mt-0.5">
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

            {settingsMenu && (
                <ContextMenu
                    items={settingsItems}
                    position={settingsMenu}
                    onClose={() => setSettingsMenu(null)}
                    footer={
                        <button type="button" className="flex w-full cursor-pointer items-center justify-center gap-2 rounded-md border-none bg-[#7b68ee] px-4 py-2 text-[13px] font-semibold text-white transition-all hover:bg-[#6c5ce7]">
                            <Shield size={14} />
                            Sharing & Permissions
                        </button>
                    }
                />
            )}

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
