import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import {
    ChevronDown, Star, FolderClosed, Clock, Zap, Bot, Share2,
    LayoutDashboard, LayoutList, Trello, Calendar, BarChart2, Users, Plus,
    FileText, Bookmark, RefreshCw, Settings2, X, MoreHorizontal,
    Pencil, Link2, Palette, Columns3, Copy, Archive, Trash2,
} from 'lucide-react';
import { useSpaceTree } from '../../layouts/AppLayout/SpaceTreeContext';

export default function FolderViewPage() {
    const { folderId } = useParams<{ folderId: string }>();
    const navigate = useNavigate();
    const location = useLocation();
    const { spaces, spaceTree, setCreateListTarget, handleDeleteList } = useSpaceTree();
    const [listMenu, setListMenu] = useState<{ listId: string; x: number; y: number } | null>(null);
    const listMenuRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const esc = (e: KeyboardEvent) => {
            if (e.key === 'Escape') setListMenu(null);
        };
        document.addEventListener('keydown', esc);
        return () => document.removeEventListener('keydown', esc);
    }, []);

    useEffect(() => {
        if (!listMenu) return;
        const close = (e: MouseEvent) => {
            if (listMenuRef.current && !listMenuRef.current.contains(e.target as Node)) {
                setListMenu(null);
            }
        };
        document.addEventListener('mousedown', close);
        return () => document.removeEventListener('mousedown', close);
    }, [listMenu]);

    // Find folder and its parent space
    let parentSpace: { id: string; name: string; color: string } | null = null;
    let folder: { id: string; name: string; lists: { id: string; name: string; count?: number }[] } | null = null;

    for (const space of spaces) {
        const node = spaceTree[space.id];
        if (!node) continue;
        const found = node.folders.find(f => f.id === folderId);
        if (found) {
            parentSpace = space;
            folder = found;
            break;
        }
    }

    if (!parentSpace || !folder) {
        return (
            <div className="flex h-full items-center justify-center text-[#5f6368]">
                <p>Folder not found</p>
            </div>
        );
    }

    const spaceId = parentSpace.id;

    return (
        <div className="flex h-full flex-col overflow-hidden bg-white" style={{ fontFamily: "'Plus Jakarta Sans', 'Inter', sans-serif" }}>
            {/* ═══════ HEADER ═══════ */}
            <header className="shrink-0 border-b border-[#eef0f5] bg-white">
                <div className="flex items-center justify-between px-5 pb-2 pt-2.5">
                    <div className="flex items-center gap-2">
                        {/* Breadcrumb: Space / Folder */}
                        <div
                            className="flex h-5 w-5 items-center justify-center rounded"
                            style={{ backgroundColor: parentSpace.color }}
                        >
                            <span className="text-[9px] font-bold text-white">
                                {parentSpace.name.charAt(0).toUpperCase()}
                            </span>
                        </div>
                        <span
                            className="cursor-pointer text-[13px] font-medium text-[#5f6368] hover:text-[#1a73e8]"
                            onClick={() => navigate(`/space/${parentSpace!.id}`)}
                        >
                            {parentSpace.name}
                        </span>
                        <span className="text-[13px] text-[#9aa0a6]">/</span>
                        <FolderClosed size={16} className="text-[#5f6368]" />
                        <h1 className="m-0 text-base font-bold text-[#141b2b]">{folder.name}</h1>
                        <button className="flex items-center rounded px-1 py-0.5 text-[#9aa0a6] hover:bg-[#f0f4ff] hover:text-[#0058be]">
                            <ChevronDown size={16} />
                        </button>
                        <button className="flex items-center rounded px-1 py-0.5 text-[#9aa0a6] hover:bg-[#f0f4ff] hover:text-[#f0a220]">
                            <Star size={15} />
                        </button>
                    </div>
                    <div className="flex items-center gap-1.5">
                        <button className="flex cursor-pointer items-center gap-1.25 rounded-md border border-[#eef0f5] bg-transparent px-2.5 py-1 text-xs font-semibold text-[#5f6368] transition-all hover:border-[#dcdfe4] hover:bg-[#f8fafc]">
                            <Bot size={14} /> Ask AI
                        </button>
                        <button className="flex cursor-pointer items-center gap-1.25 rounded-md border border-[#0058be] bg-[#0058be] px-2.5 py-1 text-xs font-semibold text-white transition-all hover:bg-[#004aab]">
                            <Share2 size={14} /> Share
                        </button>
                    </div>
                </div>
                {/* Tabs */}
                <div className="flex items-center gap-0.5 px-5">
                    <button className="flex items-center gap-1.25 whitespace-nowrap rounded-t-md border-b-2 border-b-transparent px-3 py-2 text-[13px] font-medium text-[#9aa0a6] hover:bg-[#f8fafc] hover:text-[#5f6368]">
                        Add Channel
                    </button>
                    <button className="flex items-center gap-1.25 whitespace-nowrap rounded-t-md border-b-2 border-b-[#0058be] px-3 py-2 text-[13px] font-semibold text-[#0058be]">
                        <LayoutDashboard size={14} /> Overview
                    </button>
                    <button className="flex items-center gap-1.25 whitespace-nowrap rounded-t-md border-b-2 border-b-transparent px-3 py-2 text-[13px] font-medium text-[#5f6368] hover:bg-[#f8fafc]">
                        <LayoutList size={14} /> List
                    </button>
                    <button className="flex items-center gap-1.25 whitespace-nowrap rounded-t-md border-b-2 border-b-transparent px-3 py-2 text-[13px] font-medium text-[#5f6368] hover:bg-[#f8fafc]">
                        <Trello size={14} /> Board
                    </button>
                    <button className="flex items-center gap-1 whitespace-nowrap rounded-t-md px-2.5 py-2 text-[13px] font-medium text-[#9aa0a6] hover:bg-[#f8fafc] hover:text-[#5f6368]">
                        <Plus size={13} /> View
                    </button>
                </div>
            </header>

            {/* ═══════ BANNER ═══════ */}
            <div className="flex items-center justify-between gap-3 border-b border-[#eef0f5] bg-[#f0f7ff] px-5 py-2">
                <span className="min-w-0 text-[13px] text-[#5f6368]">
                    Get the most out of your Overview! Add, reorder, and resize cards to customize this page.{' '}
                    <span className="cursor-pointer font-semibold text-[#1a73e8] hover:underline">Get Started</span>
                </span>
                <div className="flex shrink-0 items-center gap-2">
                    <button
                        type="button"
                        className="rounded-md border border-[#dcdfe4] bg-white px-2.5 py-1 text-[12px] font-semibold text-[#5f6368] hover:bg-[#f8fafc]"
                    >
                        Customize
                    </button>
                    <button type="button" className="flex text-[#9aa0a6] hover:text-[#5f6368]" aria-label="Dismiss">
                        <X size={14} />
                    </button>
                </div>
            </div>

            {/* ═══════ TOOLBAR ═══════ */}
            <div className="flex items-center justify-between border-b border-[#eef0f5] px-5 py-2">
                <div className="flex items-center gap-2">
                    <Settings2 size={14} className="text-[#9aa0a6]" />
                    <span className="text-[13px] text-[#5f6368]">Filters</span>
                </div>
                <div className="flex items-center gap-3">
                    <div className="flex items-center gap-1.5 text-[12px] text-[#9aa0a6]">
                        <RefreshCw size={12} />
                        <span>Refreshed: Just now</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-[12px] text-[#9aa0a6]">
                        <Clock size={12} />
                        <span>Auto refresh: On</span>
                    </div>
                    <button className="rounded-md border border-[#dcdfe4] bg-transparent px-3 py-1 text-[12px] font-semibold text-[#5f6368] hover:bg-[#f8fafc]">
                        Customize
                    </button>
                    <button className="rounded-md border border-[#0058be] bg-[#0058be] px-3 py-1 text-[12px] font-semibold text-white hover:bg-[#004aab]">
                        Add card
                    </button>
                </div>
            </div>

            {/* ═══════ CONTENT ═══════ */}
            <main className="flex-1 overflow-y-auto bg-[#fafbfc] p-5">
                {/* Overview Cards */}
                <div className="mb-5 grid grid-cols-3 gap-4">
                    {/* Recent */}
                    <div className="rounded-xl border border-[#eef0f5] bg-white p-4 shadow-sm">
                        <div className="mb-3 flex items-center gap-2 text-[14px] font-bold text-[#141b2b]">
                            <Clock size={16} className="text-[#f0a220]" /> Recent
                        </div>
                        {folder.lists.length > 0 ? (
                            <div className="flex flex-col gap-2">
                                {folder.lists.map(list => (
                                    <div
                                        key={list.id}
                                        className="flex cursor-pointer items-center gap-2 rounded-md px-2 py-1.5 text-[13px] text-[#5f6368] hover:bg-[#f3f4f8]"
                                        onClick={() => navigate(`/list/${list.id}`)}
                                    >
                                        <LayoutList size={14} className="text-[#9aa0a6]" />
                                        <span>{list.name}</span>
                                        <span className="text-[11px] text-[#bdc1c6]">• in {folder.name}</span>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <p className="text-[13px] text-[#9aa0a6]">No recent items</p>
                        )}
                    </div>

                    {/* Docs */}
                    <div className="flex flex-col items-center rounded-xl border border-[#eef0f5] bg-white p-4 shadow-sm">
                        <div className="mb-3 flex w-full items-center gap-2 text-[14px] font-bold text-[#141b2b]">
                            <FileText size={16} className="text-[#0058be]" /> Docs
                        </div>
                        <div className="flex flex-1 flex-col items-center justify-center gap-2 py-4">
                            <div className="flex h-14 w-14 items-center justify-center rounded-lg bg-[#f0f4ff]">
                                <FileText size={28} className="text-[#bdc1c6]" />
                            </div>
                            <p className="text-[13px] text-[#9aa0a6]">There are no Docs in this location yet.</p>
                            <button className="rounded-md border border-[#1e1f21] bg-transparent px-4 py-1.5 text-[12px] font-semibold text-[#1e1f21] hover:bg-[#f8fafc]">
                                Add a Doc
                            </button>
                        </div>
                    </div>

                    {/* Bookmarks */}
                    <div className="flex flex-col items-center rounded-xl border border-[#eef0f5] bg-white p-4 shadow-sm">
                        <div className="mb-3 flex w-full items-center gap-2 text-[14px] font-bold text-[#141b2b]">
                            <Bookmark size={16} className="text-[#e74c3c]" /> Bookmarks
                        </div>
                        <div className="flex flex-1 flex-col items-center justify-center gap-2 py-4">
                            <div className="flex h-14 w-14 items-center justify-center rounded-lg bg-[#fff5f5]">
                                <Bookmark size={28} className="text-[#bdc1c6]" />
                            </div>
                            <p className="text-center text-[13px] text-[#9aa0a6]">
                                Bookmarks make it easy to save items or any URL.
                            </p>
                            <button className="rounded-md border border-[#1e1f21] bg-transparent px-4 py-1.5 text-[12px] font-semibold text-[#1e1f21] hover:bg-[#f8fafc]">
                                Add Bookmark
                            </button>
                        </div>
                    </div>
                </div>

                {/* Lists Table (like ClickUp Folder → Lists) */}
                <div className="rounded-xl border border-[#eef0f5] bg-white shadow-sm">
                    <div className="border-b border-[#eef0f5] px-5 py-3">
                        <h2 className="m-0 text-[14px] font-bold text-[#141b2b]">Lists</h2>
                    </div>

                    {/* Table Header */}
                    <div className="grid grid-cols-[1fr_80px_120px_80px_80px_80px_80px_36px] items-center gap-2 border-b border-[#eef0f5] px-5 py-2 text-[11px] font-semibold uppercase tracking-wider text-[#9aa0a6]">
                        <span>Name</span>
                        <span>Color</span>
                        <span>Progress</span>
                        <span>Start</span>
                        <span>End</span>
                        <span>Priority</span>
                        <span>Owner</span>
                        <span />
                    </div>

                    {/* List Rows */}
                    {folder.lists.map((list) => (
                        <div
                            key={list.id}
                            className="group/row grid cursor-pointer grid-cols-[1fr_80px_120px_80px_80px_80px_80px_36px] items-center gap-2 border-b border-[#f5f6f8] px-5 py-2.5 text-[13px] text-[#1e1f21] transition-colors hover:bg-[#f3f4f8]"
                            onClick={() => navigate(`/list/${list.id}`)}
                        >
                            <div className="flex items-center gap-2">
                                <LayoutList size={14} className="text-[#6b6f76]" />
                                <span className="font-medium">{list.name}</span>
                            </div>
                            <span className="text-[#9aa0a6]">-</span>
                            <div className="flex items-center gap-2">
                                <div className="h-1.5 flex-1 rounded-full bg-[#eef0f5]">
                                    <div className="h-full w-0 rounded-full bg-[#27ae60]" />
                                </div>
                                <span className="text-[11px] text-[#9aa0a6]">0/0</span>
                            </div>
                            <span className="text-[#bdc1c6]">📅</span>
                            <span className="text-[#bdc1c6]">📅</span>
                            <span className="text-[#bdc1c6]">🏁</span>
                            <span className="text-[#bdc1c6]">👤</span>
                            <div className="flex justify-end">
                                <button
                                    type="button"
                                    className="flex h-7 w-7 items-center justify-center rounded text-[#6b6f76] opacity-0 hover:bg-[#e2e4e9] hover:text-[#1e1f21] group-hover/row:opacity-100"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        setListMenu((prev) =>
                                            prev?.listId === list.id
                                                ? null
                                                : { listId: list.id, x: e.clientX, y: e.clientY },
                                        );
                                    }}
                                >
                                    <MoreHorizontal size={14} />
                                </button>
                            </div>
                        </div>
                    ))}

                    {/* + New List */}
                    <button
                        type="button"
                        className="flex w-full items-center gap-2 border-none bg-transparent px-5 py-2.5 text-left text-[13px] text-[#9aa0a6] hover:text-[#1a73e8] cursor-pointer"
                        onClick={() =>
                            setCreateListTarget({
                                spaceId,
                                folderId: folder.id,
                                folderName: folder.name,
                            })
                        }
                    >
                        <Plus size={14} />
                        <span>New List</span>
                    </button>
                </div>
            </main>

            {/* List row overflow menu */}
            {listMenu && (
                <div
                    ref={listMenuRef}
                    className="fixed z-9999 w-55 rounded-lg border border-[#e2e4e9] bg-white py-1.5 shadow-[0_4px_24px_rgba(0,0,0,0.15)]"
                    style={{
                        top: Math.min(listMenu.y, typeof window !== 'undefined' ? window.innerHeight - 320 : listMenu.y),
                        left: Math.min(listMenu.x, typeof window !== 'undefined' ? window.innerWidth - 230 : listMenu.x),
                    }}
                    onClick={(e) => e.stopPropagation()}
                >
                    <button
                        type="button"
                        className="flex w-full cursor-pointer items-center gap-2.5 border-none bg-transparent px-3.5 py-1.5 text-left text-[13px] text-[#1e1f21] hover:bg-[#f3f4f8]"
                        onClick={() => setListMenu(null)}
                    >
                        <Pencil size={14} className="text-[#6b6f76]" /> <span className="font-medium">Rename</span>
                    </button>
                    <button
                        type="button"
                        className="flex w-full cursor-pointer items-center gap-2.5 border-none bg-transparent px-3.5 py-1.5 text-left text-[13px] text-[#1e1f21] hover:bg-[#f3f4f8]"
                        onClick={() => setListMenu(null)}
                    >
                        <Link2 size={14} className="text-[#6b6f76]" /> <span className="font-medium">Copy link</span>
                    </button>
                    <div className="my-1 mx-2.5 h-px bg-[#eef0f3]" />
                    <button
                        type="button"
                        className="flex w-full cursor-pointer items-center gap-2.5 border-none bg-transparent px-3.5 py-1.5 text-left text-[13px] text-[#1e1f21] hover:bg-[#f3f4f8]"
                        onClick={() => setListMenu(null)}
                    >
                        <Palette size={14} className="text-[#6b6f76]" /> <span className="font-medium">Color & Icon</span>
                    </button>
                    <button
                        type="button"
                        className="flex w-full cursor-pointer items-center gap-2.5 border-none bg-transparent px-3.5 py-1.5 text-left text-[13px] text-[#1e1f21] hover:bg-[#f3f4f8]"
                        onClick={() => setListMenu(null)}
                    >
                        <Columns3 size={14} className="text-[#6b6f76]" /> <span className="font-medium">Custom Fields</span>
                    </button>
                    <div className="my-1 mx-2.5 h-px bg-[#eef0f3]" />
                    <button
                        type="button"
                        className="flex w-full cursor-pointer items-center gap-2.5 border-none bg-transparent px-3.5 py-1.5 text-left text-[13px] text-[#1e1f21] hover:bg-[#f3f4f8]"
                        onClick={() => setListMenu(null)}
                    >
                        <Copy size={14} className="text-[#6b6f76]" /> <span className="font-medium">Duplicate</span>
                    </button>
                    <button
                        type="button"
                        className="flex w-full cursor-pointer items-center gap-2.5 border-none bg-transparent px-3.5 py-1.5 text-left text-[13px] text-[#1e1f21] hover:bg-[#f3f4f8]"
                        onClick={() => setListMenu(null)}
                    >
                        <Archive size={14} className="text-[#6b6f76]" /> <span className="font-medium">Archive</span>
                    </button>
                    <button
                        type="button"
                        className="flex w-full cursor-pointer items-center gap-2.5 border-none bg-transparent px-3.5 py-1.5 text-left text-[13px] text-[#dc3545] hover:bg-[#fef2f2]"
                        onClick={async () => {
                            const id = listMenu.listId;
                            await handleDeleteList(spaceId, folder.id, id);
                            setListMenu(null);
                            if (location.pathname === `/list/${id}`) navigate('/home');
                        }}
                    >
                        <Trash2 size={14} className="text-[#dc3545]" /> <span className="font-medium">Delete</span>
                    </button>
                </div>
            )}
        </div>
    );
}
