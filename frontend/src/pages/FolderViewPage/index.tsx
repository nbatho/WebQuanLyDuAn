import { useState, useMemo } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import {
    Clock, FolderClosed, FileText, Bookmark,
    LayoutList, Plus, RefreshCw, Settings2, MoreHorizontal,
} from 'lucide-react';
import { useSpaceTree } from '../../layouts/AppLayout/SpaceTreeContext';
import PageHeader, { FOLDER_TABS } from '../../components/PageHeader';
import ListContextMenu from '../../components/ListContextMenu';
import { useTasksData } from '../../hooks/useSpaceTasks';
import type { StatusGroup } from '../../types/tasks';
export default function FolderViewPage() {
    const { folderId } = useParams<{ folderId: string }>();
    const navigate = useNavigate();
    const location = useLocation();
    const { spaces, spaceTree, setCreateListTarget, handleDeleteList } = useSpaceTree();

    const [listMenu, setListMenu] = useState<{ listId: string; x: number; y: number } | null>(null);

    let parentSpace: { id: string; name: string; color: string } | null = null;
    let folder: { id: string; name: string; lists: { id: string; name: string; count?: number }[] } | null = null;

    for (const space of spaces) {
        const node = spaceTree[space.id];
        if (!node) continue;
        const found = node.folders.find(f => f.id === folderId);
        if (found) { parentSpace = space; folder = found; break; }
    }

    if (!parentSpace || !folder) {
        return <div className="flex h-full items-center justify-center text-[#5f6368]"><p>Folder not found</p></div>;
    }

    const spaceId = parentSpace.id;

    const { groups } = useTasksData({ folderId });

    const listGroups = useMemo(() => {
        if (!folder) return [];
        const listMap: Record<number, { listId: number; listName: string; statusGroups: StatusGroup[] }> = {};

        folder.lists.forEach(l => {
            listMap[Number(l.id)] = { listId: Number(l.id), listName: l.name, statusGroups: [] };
        });

        const taskByListAndStatus: Record<number, Record<string, StatusGroup>> = {};

        groups.forEach((group) => {
            group.tasks.forEach((task) => {
                const listId = (task as any).list_id;
                if (!listId || !listMap[listId]) return;

                if (!taskByListAndStatus[listId]) taskByListAndStatus[listId] = {};
                const statusMap = taskByListAndStatus[listId];

                const statusName = task.status || 'TO DO';
                const statusId = statusName.toLowerCase().replace(/ /g, '');

                if (!statusMap[statusId]) {
                    statusMap[statusId] = {
                        id: statusId,
                        name: statusName,
                        color: task.statusColor || '#5f6368',
                        isExpanded: true,
                        tasks: []
                    };
                    listMap[listId].statusGroups.push(statusMap[statusId]);
                }

                statusMap[statusId].tasks.push(task);
            });
        });

        // Ensure every list at least has a TO DO group if empty
        return Object.values(listMap).map(list => {
            if (list.statusGroups.length === 0) {
                list.statusGroups.push({
                    id: 'todo',
                    name: 'TO DO',
                    color: '#5f6368',
                    isExpanded: true,
                    tasks: []
                });
            }
            return list;
        });
    }, [groups, folder]);

    const handleDeleteListItem = async (listId: string) => {
        await handleDeleteList(spaceId, folder!.id, listId);
        if (location.pathname === `/list/${listId}`) navigate('/home');
    };

    return (
        <div className="flex h-full flex-col overflow-hidden bg-white" style={{ fontFamily: "'Plus Jakarta Sans', 'Inter', sans-serif" }}>

            <PageHeader
                parentSpace={parentSpace}
                entityIcon={<FolderClosed size={16} />}
                entityName={folder.name}
                tabs={FOLDER_TABS}
            />
            {/* TOOLBAR */}
            <div className="flex items-center justify-between border-b border-[#eef0f5] px-5 py-2">
                <div className="flex items-center gap-2">
                    <Settings2 size={14} className="text-[#9aa0a6]" />
                    <span className="text-[13px] text-[#5f6368]">Filters</span>
                </div>
                <div className="flex items-center gap-3">
                    <div className="flex items-center gap-1.5 text-[12px] text-[#9aa0a6]"><RefreshCw size={12} /><span>Refreshed: Just now</span></div>
                    <div className="flex items-center gap-1.5 text-[12px] text-[#9aa0a6]"><Clock size={12} /><span>Auto refresh: On</span></div>
                    <button className="rounded-md border border-[#dcdfe4] bg-transparent px-3 py-1 text-[12px] font-semibold text-[#5f6368] hover:bg-[#f8fafc]">Customize</button>
                    <button className="rounded-md border border-[#0058be] bg-[#0058be] px-3 py-1 text-[12px] font-semibold text-white hover:bg-[#004aab]">Add card</button>
                </div>
            </div>

            {/* CONTENT */}
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
                                    <div key={list.id} className="flex cursor-pointer items-center gap-2 rounded-md px-2 py-1.5 text-[13px] text-[#5f6368] hover:bg-[#f3f4f8]" onClick={() => navigate(`/list/${list.id}`)}>
                                        <LayoutList size={14} className="text-[#9aa0a6]" />
                                        <span>{list.name}</span>
                                        <span className="text-[11px] text-[#bdc1c6]">• in {folder!.name}</span>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <p className="text-[13px] text-[#9aa0a6]">No recent items</p>
                        )}
                    </div>
                    {/* Docs */}
                    <div className="flex flex-col items-center rounded-xl border border-[#eef0f5] bg-white p-4 shadow-sm">
                        <div className="mb-3 flex w-full items-center gap-2 text-[14px] font-bold text-[#141b2b]"><FileText size={16} className="text-[#0058be]" /> Docs</div>
                        <div className="flex flex-1 flex-col items-center justify-center gap-2 py-4">
                            <div className="flex h-14 w-14 items-center justify-center rounded-lg bg-[#f0f4ff]"><FileText size={28} className="text-[#bdc1c6]" /></div>
                            <p className="text-[13px] text-[#9aa0a6]">There are no Docs in this location yet.</p>
                            <button className="rounded-md border border-[#1e1f21] bg-transparent px-4 py-1.5 text-[12px] font-semibold text-[#1e1f21] hover:bg-[#f8fafc]">Add a Doc</button>
                        </div>
                    </div>
                    {/* Bookmarks */}
                    <div className="flex flex-col items-center rounded-xl border border-[#eef0f5] bg-white p-4 shadow-sm">
                        <div className="mb-3 flex w-full items-center gap-2 text-[14px] font-bold text-[#141b2b]"><Bookmark size={16} className="text-[#e74c3c]" /> Bookmarks</div>
                        <div className="flex flex-1 flex-col items-center justify-center gap-2 py-4">
                            <div className="flex h-14 w-14 items-center justify-center rounded-lg bg-[#fff5f5]"><Bookmark size={28} className="text-[#bdc1c6]" /></div>
                            <p className="text-center text-[13px] text-[#9aa0a6]">Bookmarks make it easy to save items or any URL.</p>
                            <button className="rounded-md border border-[#1e1f21] bg-transparent px-4 py-1.5 text-[12px] font-semibold text-[#1e1f21] hover:bg-[#f8fafc]">Add Bookmark</button>
                        </div>
                    </div>
                </div>

                {/* Lists Table (Refactored to ListCards) */}
                <div className="flex flex-col gap-6">
                    {listGroups.map(list => (
                        <div key={list.listId} className="overflow-hidden rounded-xl border border-[#eef0f5] bg-white shadow-sm">
                            <div
                                className="flex cursor-pointer items-center justify-between border-b border-[#eef0f5] bg-[#f8fafc] px-5 py-3 transition-colors hover:bg-[#f0f4ff]"
                                onClick={() => navigate(`/list/${list.listId}`)}
                            >
                                <div className="flex items-center gap-2">
                                    <LayoutList size={16} className="text-[#0058be]" />
                                    <h2 className="m-0 text-[15px] font-bold text-[#141b2b]">{list.listName}</h2>
                                </div>
                                <button
                                    type="button"
                                    className="flex h-7 w-7 items-center justify-center rounded text-[#6b6f76] hover:bg-[#e2e4e9] hover:text-[#1e1f21]"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        setListMenu(prev => prev?.listId === String(list.listId) ? null : { listId: String(list.listId), x: e.clientX, y: e.clientY });
                                    }}
                                >
                                    <MoreHorizontal size={16} />
                                </button>
                            </div>
                            <div className="p-4">
                                {list.statusGroups.map(group => (
                                    <div key={group.id} className="mb-4 last:mb-0">
                                        <div className="mb-2 inline-flex items-center gap-2 rounded-md px-2 py-1 text-[11px] font-bold tracking-[0.03em] text-white" style={{ backgroundColor: group.color }}>
                                            <span>{group.name}</span>
                                            <span>{group.tasks.length}</span>
                                        </div>
                                        <div className="space-y-1">
                                            {group.tasks.length === 0 ? (
                                                <p className="m-0 text-[12px] text-[#9aa0a6]">No tasks</p>
                                            ) : (
                                                group.tasks.map(task => (
                                                    <div key={task.task_id} className="flex items-center justify-between rounded-md border border-[#eef0f5] px-3 py-2 text-[13px]">
                                                        <span className="font-medium text-[#1e1f21]">{task.name}</span>
                                                        <span className="text-[11px] text-[#9aa0a6]">#{task.task_id}</span>
                                                    </div>
                                                ))
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}

                    <button
                        type="button"
                        className="flex w-full cursor-pointer items-center justify-center gap-2 rounded-xl border border-dashed border-[#dcdfe4] bg-transparent px-5 py-4 text-[14px] font-semibold text-[#9aa0a6] hover:border-[#0058be] hover:text-[#0058be] transition-colors"
                        onClick={() => setCreateListTarget({ spaceId, folderId: folder!.id, folderName: folder!.name })}
                    >
                        <Plus size={16} /><span>Create New List in {folder!.name}</span>
                    </button>
                </div>
            </main>

            {listMenu && (
                <ListContextMenu
                    listId={listMenu.listId}
                    position={{ x: listMenu.x, y: listMenu.y }}
                    onClose={() => setListMenu(null)}
                    onDelete={handleDeleteListItem}
                />
            )}
        </div>
    );
}
