import { useState } from 'react';
import { useParams } from 'react-router-dom';
import {
    Plus, ListTodo, Search,
    Users, Settings2, CheckCircle2, ChevronDown,
} from 'lucide-react';
import { useSpaceTree } from '../../layouts/AppLayout/SpaceTreeContext';
import PageHeader, { LIST_TABS } from '../../components/PageHeader';
import { useTasksData } from '../../hooks/useSpaceTasks';
import ContextMenu from '../../components/ContextMenu';
import CreateTaskModal from '../../components/CreateTaskModal';
import ListView from '../SpaceViewPage/components/ListView/listView';
import type { Task } from '../../types/tasks';


export default function ListViewPage() {
    const { listId, spaceId } = useParams<{ listId: string; spaceId: string }>();
    const { spaces, spaceTree } = useSpaceTree();

    let parentSpace: { id: string; name: string; color: string } | null = null;
    let parentFolder: { id: string; name: string } | null = null;
    let listInfo: { id: string; name: string } | null = null;

    for (const space of spaces) {
        const node = spaceTree[space.id];
        if (!node) continue;
        const standalone = node.standaloneLists.find(l => l.id === listId);
        if (standalone) { parentSpace = space; listInfo = standalone; break; }
        for (const folder of node.folders) {
            const found = folder.lists.find(l => l.id === listId);
            if (found) { parentSpace = space; parentFolder = folder; listInfo = found; break; }
        }
        if (listInfo) break;
    }

    const {
        groups,
        setGroups,
        handleCreateTask,
        handleInlineCreate,
        handleContextAction,
    } = useTasksData({ listId, spaceId: parentSpace?.id || spaceId });

    const [, setSelectedTask] = useState<Task | null>(null);
    const [ctxMenu, setCtxMenu] = useState<{ x: number; y: number; task: Task } | null>(null);
    const [isCreateTaskOpen, setIsCreateTaskOpen] = useState(false);

    const onTaskContextMenu = (e: React.MouseEvent, task: Task) => {
        e.preventDefault();
        setCtxMenu({ x: e.clientX, y: e.clientY, task });
    };

    const onContextActionSelect = (action: string) => {
        if (!ctxMenu) return;
        handleContextAction(action, ctxMenu.task);
        setCtxMenu(null);
    };

    const handleCreateTaskModal = () => {
        setIsCreateTaskOpen(true);
    };

    if (!parentSpace || !listInfo) {
        return <div className="flex h-full items-center justify-center text-[#5f6368]"><p>List not found</p></div>;
    }

    return (
        <div className="flex h-full flex-col overflow-hidden bg-white" style={{ fontFamily: "'Plus Jakarta Sans', 'Inter', sans-serif" }}>

            <PageHeader
                parentSpace={parentSpace}
                parentFolder={parentFolder}
                entityIcon={<ListTodo size={16} />}
                entityName={listInfo.name}
                tabs={LIST_TABS}
            />

            <div className="flex shrink-0 items-center justify-between border-b border-[#eef0f5] bg-white px-5 py-2">
                <div className="flex items-center gap-1.5">
                    <button className="flex cursor-pointer items-center gap-1 rounded-md border border-[#27ae60] bg-[#e6f9ef] px-2.5 py-1 text-xs font-semibold text-[#27ae60]">
                        <CheckCircle2 size={13} /> Group: Status
                    </button>
                    <button className="flex cursor-pointer items-center gap-1 rounded-md border border-[#eef0f5] bg-transparent px-2.5 py-1 text-xs font-semibold text-[#5f6368] hover:bg-[#f8fafc]">Subtasks</button>
                    <button className="flex cursor-pointer items-center gap-1 rounded-md border border-[#eef0f5] bg-transparent px-2.5 py-1 text-xs font-semibold text-[#5f6368] hover:bg-[#f8fafc]">Columns</button>
                </div>
                <div className="flex items-center gap-1.5">
                    <button type="button" className="flex cursor-pointer items-center gap-1 rounded-md border-none bg-transparent px-2 py-1 text-xs font-semibold text-[#5f6368] hover:bg-[#f0f4ff] hover:text-[#0058be]"><Search size={13} /> Filter</button>
                    <button type="button" className="flex cursor-pointer items-center gap-1 rounded-md border-none bg-transparent px-2 py-1 text-xs font-semibold text-[#5f6368] hover:bg-[#f0f4ff] hover:text-[#0058be]"><CheckCircle2 size={13} /> Closed</button>
                    <button type="button" className="flex cursor-pointer items-center gap-1.5 rounded-md border-none bg-transparent px-2 py-1 text-xs font-semibold text-[#5f6368] hover:bg-[#f0f4ff] hover:text-[#0058be]">
                        <Users size={13} /> Assignee
                        <span className="flex h-5 w-5 items-center justify-center rounded-full bg-[#e8f0fe] text-[10px] font-bold text-[#0058be]">M</span>
                    </button>
                    <button type="button" className="flex h-7 w-7 cursor-pointer items-center justify-center rounded-md border-none bg-transparent text-[#5f6368] hover:bg-[#f0f4ff] hover:text-[#0058be]" aria-label="Search"><Search size={15} /></button>
                    <button type="button" className="flex cursor-pointer items-center gap-1 rounded-md border-none bg-transparent px-2 py-1 text-xs font-semibold text-[#5f6368] hover:bg-[#f0f4ff] hover:text-[#0058be]"><Settings2 size={13} /> Customize</button>
                    <button type="button" className="flex cursor-pointer items-center gap-1 rounded-md border-none bg-[#1e1f21] px-3 py-1.5 text-xs font-bold text-white transition-colors hover:bg-black"
                        onClick={handleCreateTaskModal}
                    >
                        <Plus size={14} /> Add Task <ChevronDown size={12} />
                    </button>
                </div>
            </div>

            

            <ContextMenu
                x={ctxMenu?.x || 0} y={ctxMenu?.y || 0}
                isOpen={!!ctxMenu} onClose={() => setCtxMenu(null)}
                onAction={onContextActionSelect} taskTitle={ctxMenu?.task.name}
            />

            <CreateTaskModal
                isOpen={isCreateTaskOpen}
                onClose={() => setIsCreateTaskOpen(false)}
                onCreate={handleCreateTask}
                defaultStatus="TO DO"
                lists={[{ id: Number(listInfo.id), name: listInfo.name }]}
                defaultListId={Number(listInfo.id)}
            />
        </div>
    );
}
