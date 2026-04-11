import { useState, useCallback, useEffect, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
    ChevronDown, Star, FolderClosed, Clock, Bot, Share2,
    LayoutList, Trello, Calendar, BarChart2, Users, Plus,
    Search, CheckCircle2, ListTodo, Circle, Settings2,
    CircleDashed, Box, Wand2, Flag, Tag, CornerDownLeft
} from 'lucide-react';
import { useSpaceTree } from '../../layouts/AppLayout/SpaceTreeContext';
import { getTasksForList, createTaskInList, deleteTask as apiDeleteTask } from '../../api/tasks';
import { getStatusesBySpace, createTaskStatus, type SpaceStatusRow } from '../../api/statuses';

/** Task row shape from list API (normalized for UI) */
type ListViewTask = {
    task_id: number;
    name: string;
    status?: string;
    priority?: string;
    due_date?: string | null;
    assignee_name?: string;
};

/* Status config */
const STATUS_CONFIG: Record<string, { label: string; color: string; bg: string }> = {
    'TO DO': { label: 'TO DO', color: '#5f6368', bg: '#f0f2f5' },
    'IN PROGRESS': { label: 'IN PROGRESS', color: '#0058be', bg: '#e8f0fe' },
    'REVIEW': { label: 'REVIEW', color: '#f0a220', bg: '#fff7e6' },
    'DONE': { label: 'DONE', color: '#27ae60', bg: '#e6f9ef' },
    'COMPLETE': { label: 'COMPLETE', color: '#27ae60', bg: '#e6f9ef' },
};

const PRIORITY_CONFIG: Record<string, { label: string; color: string }> = {
    'urgent': { label: '🔴 Urgent', color: '#e74c3c' },
    'high': { label: '🟠 High', color: '#f0a220' },
    'medium': { label: '🟡 Medium', color: '#f1c40f' },
    'low': { label: '🔵 Low', color: '#3498db' },
    'none': { label: '— None', color: '#bdc1c6' },
};

function normalizeListTask(raw: Record<string, unknown>): ListViewTask {
    const taskId = Number(raw.task_id ?? raw.taskId);
    return {
        task_id: Number.isFinite(taskId) ? taskId : 0,
        name: String(raw.name ?? ''),
        status:
            raw.status != null
                ? String(raw.status)
                : raw.status_name != null
                  ? String(raw.status_name)
                  : undefined,
        priority: raw.priority != null ? String(raw.priority) : undefined,
        due_date: raw.due_date != null ? String(raw.due_date) : null,
        assignee_name:
            raw.assignee_name != null
                ? String(raw.assignee_name)
                : raw.assigneeName != null
                  ? String(raw.assigneeName)
                  : undefined,
    };
}

export default function ListViewPage() {
    const { listId } = useParams<{ listId: string }>();
    const navigate = useNavigate();
    const { spaces, spaceTree } = useSpaceTree();

    // Find list, folder, and space
    let parentSpace: { id: string; name: string; color: string } | null = null;
    let parentFolder: { id: string; name: string } | null = null;
    let listInfo: { id: string; name: string } | null = null;

    for (const space of spaces) {
        const node = spaceTree[space.id];
        if (!node) continue;

        // Check standalone lists
        const standaloneList = node.standaloneLists.find(l => l.id === listId);
        if (standaloneList) {
            parentSpace = space;
            listInfo = standaloneList;
            break;
        }

        // Check folder lists
        for (const folder of node.folders) {
            const found = folder.lists.find(l => l.id === listId);
            if (found) {
                parentSpace = space;
                parentFolder = folder;
                listInfo = found;
                break;
            }
        }
        if (listInfo) break;
    }

    // Tasks state
    const [tasks, setTasks] = useState<ListViewTask[]>([]);
    const [loading, setLoading] = useState(true);
    const [spaceStatuses, setSpaceStatuses] = useState<SpaceStatusRow[]>([]);
    const [collapsedGroups, setCollapsedGroups] = useState<Set<string>>(new Set());
    const [inlineAddStatus, setInlineAddStatus] = useState<string | null>(null);
    const [inlineTaskName, setInlineTaskName] = useState('');
    const [newStatusOpen, setNewStatusOpen] = useState(false);
    const [newStatusName, setNewStatusName] = useState('');
    const [newStatusColor, setNewStatusColor] = useState('#8B7355');

    const spaceIdNum = useMemo(() => {
        if (!parentSpace?.id) return NaN;
        const n = parseInt(parentSpace.id, 10);
        return Number.isFinite(n) ? n : NaN;
    }, [parentSpace?.id]);

    const fetchTasks = useCallback(async () => {
        if (!listId) return;
        try {
            setLoading(true);
            const data = await getTasksForList(parseInt(listId, 10));
            setTasks((data as ListViewTask[]).map(normalizeListTask));
        } catch (error) {
            console.error('Failed to fetch tasks:', error);
        } finally {
            setLoading(false);
        }
    }, [listId]);

    useEffect(() => {
        fetchTasks();
    }, [fetchTasks]);

    useEffect(() => {
        if (!Number.isFinite(spaceIdNum)) return;
        getStatusesBySpace(spaceIdNum)
            .then(setSpaceStatuses)
            .catch(() => setSpaceStatuses([]));
    }, [spaceIdNum]);

    const groupedTasks = useMemo(() => {
        const acc = tasks.reduce<Record<string, ListViewTask[]>>((a, task) => {
            const status = task.status || 'TO DO';
            if (!a[status]) a[status] = [];
            a[status].push(task);
            return a;
        }, {});
        if (!acc['TO DO']) acc['TO DO'] = [];
        return acc;
    }, [tasks]);

    const orderedStatusColumns = useMemo(() => {
        const apiOrder = [...spaceStatuses]
            .sort((a, b) => (a.position ?? 0) - (b.position ?? 0))
            .map((s) => s.status_name);
        const fromTasks = Object.keys(groupedTasks);
        const seen = new Set<string>();
        const out: string[] = [];
        for (const name of apiOrder) {
            if (!seen.has(name)) {
                seen.add(name);
                out.push(name);
            }
        }
        for (const name of fromTasks) {
            if (!seen.has(name)) {
                seen.add(name);
                out.push(name);
            }
        }
        if (out.length === 0) return ['TO DO'];
        return out;
    }, [spaceStatuses, groupedTasks]);

    const resolveStatusConfig = useCallback(
        (status: string) => {
            if (STATUS_CONFIG[status]) return STATUS_CONFIG[status];
            const row = spaceStatuses.find((s) => s.status_name === status);
            const color = row?.color || '#5f6368';
            return { label: row?.status_name ?? status, color, bg: '#f0f2f5' };
        },
        [spaceStatuses],
    );

    const handleCreateStatus = useCallback(async () => {
        const name = newStatusName.trim();
        if (!name || !Number.isFinite(spaceIdNum)) return;
        try {
            const created = await createTaskStatus(spaceIdNum, {
                statusName: name,
                color: newStatusColor,
                position: spaceStatuses.length,
            });
            setSpaceStatuses((prev) =>
                [...prev, created].sort((a, b) => (a.position ?? 0) - (b.position ?? 0)),
            );
            setNewStatusName('');
            setNewStatusColor('#8B7355');
            setNewStatusOpen(false);
        } catch (error) {
            console.error('Failed to create status:', error);
        }
    }, [newStatusName, newStatusColor, spaceIdNum, spaceStatuses.length]);

    const toggleGroup = (status: string) => {
        setCollapsedGroups(prev => {
            const next = new Set(prev);
            if (next.has(status)) next.delete(status);
            else next.add(status);
            return next;
        });
    };

    const handleInlineAdd = async (status: string) => {
        if (!inlineTaskName.trim() || !listId) return;
        try {
            const created = await createTaskInList({
                list_id: parseInt(listId, 10),
                name: inlineTaskName.trim(),
                status,
            });
            const row = normalizeListTask(created as Record<string, unknown>);
            if (!row.status) row.status = status;
            setTasks((prev) => [...prev, row]);
            setInlineTaskName('');
            setInlineAddStatus(null);
        } catch (error) {
            console.error('Failed to create task:', error);
        }
    };

    const handleDeleteTask = async (taskId: number) => {
        try {
            await apiDeleteTask(taskId);
            setTasks(prev => prev.filter(t => t.task_id !== taskId));
        } catch (error) {
            console.error('Failed to delete task:', error);
        }
    };

    if (!parentSpace || !listInfo) {
        return (
            <div className="flex h-full items-center justify-center text-[#5f6368]">
                <p>List not found</p>
            </div>
        );
    }

    return (
        <div className="flex h-full flex-col overflow-hidden bg-white" style={{ fontFamily: "'Plus Jakarta Sans', 'Inter', sans-serif" }}>
            {/* ═══════ HEADER ═══════ */}
            <header className="shrink-0 border-b border-[#eef0f5] bg-white">
                <div className="flex items-center justify-between px-5 pb-2 pt-2.5">
                    <div className="flex items-center gap-2">
                        {/* Breadcrumb */}
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

                        {parentFolder && (
                            <>
                                <span className="text-[13px] text-[#9aa0a6]">/</span>
                                <FolderClosed size={14} className="text-[#5f6368]" />
                                <span
                                    className="cursor-pointer text-[13px] font-medium text-[#5f6368] hover:text-[#1a73e8]"
                                    onClick={() => navigate(`/folder/${parentFolder!.id}`)}
                                >
                                    {parentFolder.name}
                                </span>
                            </>
                        )}

                        <span className="text-[13px] text-[#9aa0a6]">/</span>
                        <ListTodo size={16} className="text-[#5f6368]" />
                        <h1 className="m-0 text-base font-bold text-[#141b2b]">{listInfo.name}</h1>
                        <button className="flex items-center rounded px-1 py-0.5 text-[#9aa0a6] hover:bg-[#f0f4ff] hover:text-[#0058be]">
                            <ChevronDown size={16} />
                        </button>
                        <button className="flex items-center rounded px-1 py-0.5 text-[#9aa0a6] hover:bg-[#f0f4ff] hover:text-[#f0a220]">
                            <Star size={15} />
                        </button>
                    </div>
                    <div className="flex items-center gap-1.5">
                        <button className="flex cursor-pointer items-center gap-1.25 rounded-md border border-[#eef0f5] bg-transparent px-2.5 py-1 text-xs font-semibold text-[#5f6368] transition-all hover:border-[#dcdfe4] hover:bg-[#f8fafc]">
                            <Clock size={14} /> Agents
                        </button>
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
                        <LayoutList size={14} /> List
                    </button>
                    <button className="flex items-center gap-1.25 whitespace-nowrap rounded-t-md border-b-2 border-b-transparent px-3 py-2 text-[13px] font-medium text-[#5f6368] hover:bg-[#f8fafc]">
                        <Trello size={14} /> Board
                    </button>
                    <button className="flex items-center gap-1.25 whitespace-nowrap rounded-t-md border-b-2 border-b-transparent px-3 py-2 text-[13px] font-medium text-[#5f6368] hover:bg-[#f8fafc]">
                        <Calendar size={14} /> Calendar
                    </button>
                    <button className="flex items-center gap-1.25 whitespace-nowrap rounded-t-md border-b-2 border-b-transparent px-3 py-2 text-[13px] font-medium text-[#5f6368] hover:bg-[#f8fafc]">
                        <BarChart2 size={14} /> Gantt
                    </button>
                    <button className="flex items-center gap-1.25 whitespace-nowrap rounded-t-md border-b-2 border-b-transparent px-3 py-2 text-[13px] font-medium text-[#5f6368] hover:bg-[#f8fafc]">
                        <Users size={14} /> Team
                    </button>
                    <button className="flex items-center gap-1 whitespace-nowrap rounded-t-md px-2.5 py-2 text-[13px] font-medium text-[#9aa0a6] hover:bg-[#f8fafc] hover:text-[#5f6368]">
                        <Plus size={13} /> View
                    </button>
                </div>
            </header>

            {/* ═══════ TOOLBAR ═══════ */}
            <div className="flex shrink-0 items-center justify-between border-b border-[#eef0f5] bg-white px-5 py-2">
                <div className="flex items-center gap-1.5">
                    <button className="flex cursor-pointer items-center gap-1 rounded-md border border-[#27ae60] bg-[#e6f9ef] px-2.5 py-1 text-xs font-semibold text-[#27ae60]">
                        <CheckCircle2 size={13} /> Group: Status
                    </button>
                    <button className="flex cursor-pointer items-center gap-1 rounded-md border border-[#eef0f5] bg-transparent px-2.5 py-1 text-xs font-semibold text-[#5f6368] hover:bg-[#f8fafc]">
                        Subtasks
                    </button>
                    <button className="flex cursor-pointer items-center gap-1 rounded-md border border-[#eef0f5] bg-transparent px-2.5 py-1 text-xs font-semibold text-[#5f6368] hover:bg-[#f8fafc]">
                        Columns
                    </button>
                </div>
                <div className="flex items-center gap-1.5">
                    <button
                        type="button"
                        className="flex cursor-pointer items-center gap-1 rounded-md border-none bg-transparent px-2 py-1 text-xs font-semibold text-[#5f6368] hover:bg-[#f0f4ff] hover:text-[#0058be]"
                    >
                        <Search size={13} /> Filter
                    </button>
                    <button
                        type="button"
                        className="flex cursor-pointer items-center gap-1 rounded-md border-none bg-transparent px-2 py-1 text-xs font-semibold text-[#5f6368] hover:bg-[#f0f4ff] hover:text-[#0058be]"
                    >
                        <CheckCircle2 size={13} /> Closed
                    </button>
                    <button
                        type="button"
                        className="flex cursor-pointer items-center gap-1.5 rounded-md border-none bg-transparent px-2 py-1 text-xs font-semibold text-[#5f6368] hover:bg-[#f0f4ff] hover:text-[#0058be]"
                    >
                        <Users size={13} /> Assignee
                        <span className="flex h-5 w-5 items-center justify-center rounded-full bg-[#e8f0fe] text-[10px] font-bold text-[#0058be]">
                            M
                        </span>
                    </button>
                    <button
                        type="button"
                        className="flex h-7 w-7 cursor-pointer items-center justify-center rounded-md border-none bg-transparent text-[#5f6368] hover:bg-[#f0f4ff] hover:text-[#0058be]"
                        aria-label="Search"
                    >
                        <Search size={15} />
                    </button>
                    <button
                        type="button"
                        className="flex cursor-pointer items-center gap-1 rounded-md border-none bg-transparent px-2 py-1 text-xs font-semibold text-[#5f6368] hover:bg-[#f0f4ff] hover:text-[#0058be]"
                    >
                        <Settings2 size={13} /> Customize
                    </button>
                    <button
                        type="button"
                        className="flex cursor-pointer items-center gap-1 rounded-md border-none bg-[#1e1f21] px-3 py-1.5 text-xs font-bold text-white transition-colors hover:bg-black"
                    >
                        <Plus size={14} /> Add Task <ChevronDown size={12} />
                    </button>
                </div>
            </div>

            {/* ═══════ TASK TABLE ═══════ */}
            <main className="flex-1 overflow-y-auto">
                {loading ? (
                    <div className="flex h-40 items-center justify-center text-[#9aa0a6]">Loading tasks...</div>
                ) : (
                    <div>
                        {orderedStatusColumns.map((status) => {
                            const statusTasks = groupedTasks[status] ?? [];
                            const isCollapsed = collapsedGroups.has(status);
                            const config = resolveStatusConfig(status);

                            return (
                                <div key={status}>
                                    {/* Status Group Header */}
                                    <div
                                        className="flex cursor-pointer items-center gap-2 border-b border-[#eef0f5] px-5 py-2 hover:bg-[#fafbfc]"
                                        onClick={() => toggleGroup(status)}
                                    >
                                        <ChevronDown
                                            size={14}
                                            className={`text-[#9aa0a6] transition-transform ${isCollapsed ? '-rotate-90' : ''}`}
                                        />
                                        <div
                                            className="flex max-w-[min(100%,280px)] items-center gap-1.5 rounded-md px-2 py-0.5 text-[12px] font-bold tracking-wide"
                                            style={{ color: config.color, backgroundColor: config.bg }}
                                        >
                                            <CheckCircle2 size={12} className="shrink-0" />
                                            <span className="truncate">{config.label}</span>
                                        </div>
                                        <span className="text-[12px] text-[#bdc1c6]">{statusTasks.length}</span>
                                    </div>

                                    {/* Table Header */}
                                    {!isCollapsed && (
                                        <>
                                            <div className="grid grid-cols-[1fr_140px_120px_100px_32px] items-center gap-2 border-b border-[#f5f6f8] px-5 py-1 text-[11px] font-semibold uppercase tracking-wider text-[#9aa0a6]">
                                                <span>Name</span>
                                                <span>Assignee</span>
                                                <span>Due date</span>
                                                <span>Priority</span>
                                                <span className="flex justify-end">
                                                    <button
                                                        type="button"
                                                        className="flex h-6 w-6 items-center justify-center rounded text-[#bdc1c6] hover:bg-[#f3f4f8] hover:text-[#5f6368]"
                                                        title="Add column"
                                                    >
                                                        <Plus size={14} />
                                                    </button>
                                                </span>
                                            </div>

                                            {/* Task Rows */}
                                            {statusTasks.map(task => (
                                                <div
                                                    key={task.task_id}
                                                    className="group grid cursor-pointer grid-cols-[1fr_140px_120px_100px_32px] items-center gap-2 border-b border-[#f5f6f8] px-5 py-2 text-[13px] text-[#1e1f21] transition-colors hover:bg-[#f3f4f8]"
                                                >
                                                    <div className="flex items-center gap-2">
                                                        <CheckCircle2

                                                            size={16}
                                                            className="shrink-0"
                                                            style={{ color: config.color }}
                                                        />
                                                        <span className="truncate">{task.name}</span>
                                                    </div>
                                                    <span className="text-[12px] text-[#bdc1c6]">
                                                        {task.assignee_name || '—'}
                                                    </span>
                                                    <span className="text-[12px] text-[#bdc1c6]">
                                                        {task.due_date
                                                            ? new Date(task.due_date).toLocaleDateString()
                                                            : '—'}
                                                    </span>
                                                    <span className="text-[12px]" style={{ color: PRIORITY_CONFIG[task.priority || 'none']?.color }}>
                                                        {PRIORITY_CONFIG[task.priority || 'none']?.label || '—'}
                                                    </span>
                                                    <button
                                                        className="hidden h-5 w-5 items-center justify-center rounded text-[#bdc1c6] hover:bg-[#fee] hover:text-[#e74c3c] group-hover:flex cursor-pointer border-none bg-transparent"
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            handleDeleteTask(task.task_id);
                                                        }}
                                                        title="Delete task"
                                                    >
                                                        ✕
                                                    </button>
                                                </div>
                                            ))}

                                            {/* Inline Add Task (ClickUp V3 Style) */}
                                            {inlineAddStatus === status ? (
                                                <div className="flex flex-col border-b border-[#f5f6f8] bg-white transition-all shadow-[inset_0_1px_2px_rgba(0,0,0,0.05)]">
                                                    <div className="flex items-center gap-2 px-5 py-2.5">
                                                        <CircleDashed size={16} className="text-[#9aa0a6] shrink-0" strokeWidth={1.5} />
                                                        <input
                                                            autoFocus
                                                            className="flex-1 border-none bg-transparent text-[13px] text-[#141b2b] outline-none placeholder:text-[#9aa0a6] font-medium"
                                                            placeholder="Task Name or type '/' for commands"
                                                            value={inlineTaskName}
                                                            onChange={e => setInlineTaskName(e.target.value)}
                                                            onKeyDown={e => {
                                                                if (e.key === 'Enter') handleInlineAdd(status);
                                                                if (e.key === 'Escape') {
                                                                    setInlineAddStatus(null);
                                                                    setInlineTaskName('');
                                                                }
                                                            }}
                                                        />
                                                        
                                                        {/* Action Toolbar */}
                                                        <div className="flex items-center gap-1 text-[#9aa0a6]">
                                                            <button title="Space" className="p-1 hover:bg-[#f0f2f5] hover:text-[#5f6368] rounded transition-colors"><Box size={14} /></button>
                                                            <button title="AI" className="p-1 hover:bg-[#f0f2f5] hover:text-[#5f6368] rounded transition-colors"><Wand2 size={14} /></button>
                                                            <div className="h-4 w-px bg-[#eef0f5] mx-1" />
                                                            <button title="Assignee" className="p-1 hover:bg-[#f0f2f5] hover:text-[#5f6368] rounded transition-colors"><Users size={14} /></button>
                                                            <button title="Due Date" className="p-1 hover:bg-[#f0f2f5] hover:text-[#5f6368] rounded transition-colors"><Calendar size={14} /></button>
                                                            <button title="Priority" className="p-1 hover:bg-[#f0f2f5] hover:text-[#5f6368] rounded transition-colors"><Flag size={14} /></button>
                                                            <button title="Tags" className="p-1 hover:bg-[#f0f2f5] hover:text-[#5f6368] rounded transition-colors"><Tag size={14} /></button>
                                                            
                                                            <button 
                                                                className="ml-2 flex items-center gap-1.5 rounded bg-[#1e1f21] px-3 py-1.5 text-[11.5px] font-bold text-white hover:bg-black transition-all shadow-sm group/btn"
                                                                onClick={() => handleInlineAdd(status)}
                                                            >
                                                                Save <CornerDownLeft size={11} strokeWidth={2.5} className="opacity-70 group-hover/btn:opacity-100" />
                                                            </button>
                                                        </div>
                                                    </div>
                                                </div>
                                            ) : (
                                                <div
                                                    className="flex cursor-pointer items-center gap-2.5 px-5 py-3 text-[13px] text-[#9aa0a6] hover:text-[#1a73e8] border-b border-[#f5f6f8] transition-colors group"
                                                    onClick={() => setInlineAddStatus(status)}
                                                >
                                                    <Plus size={14} className="shrink-0 text-[#bdc1c6] group-hover:text-[#1a73e8]" />
                                                    <span className="font-medium">Add Task</span>
                                                </div>
                                            )}
                                        </>
                                    )}
                                </div>
                            );
                        })}

                        {/* + New status */}
                        {newStatusOpen ? (
                            <div className="mx-5 mb-2 flex items-center gap-2 rounded-lg border border-[#1e1f21] bg-white px-3 py-2 shadow-sm">
                                <input
                                    type="color"
                                    className="h-7 w-7 shrink-0 cursor-pointer overflow-hidden rounded border border-[#dcdfe4] bg-white p-0"
                                    value={newStatusColor}
                                    onChange={(e) => setNewStatusColor(e.target.value)}
                                    aria-label="Màu status"
                                />
                                <input
                                    className="min-w-0 flex-1 border-none bg-transparent text-[13px] text-[#141b2b] outline-none placeholder:text-[#9aa0a6]"
                                    placeholder="Status name"
                                    value={newStatusName}
                                    autoFocus
                                    onChange={(e) => setNewStatusName(e.target.value)}
                                    onKeyDown={(e) => {
                                        if (e.key === 'Enter') void handleCreateStatus();
                                        if (e.key === 'Escape') {
                                            setNewStatusOpen(false);
                                            setNewStatusName('');
                                            setNewStatusColor('#8B7355');
                                        }
                                    }}
                                />
                            </div>
                        ) : (
                            /* + New status (compact) */
                            <div className="px-5 py-4">
                                <button
                                    type="button"
                                    className="flex items-center gap-1.5 border-none bg-transparent p-0 text-[12px] font-medium text-[#9aa0a6] hover:text-[#1a73e8] cursor-pointer transition-colors"
                                    onClick={() => setNewStatusOpen(true)}
                                >
                                    <Plus size={13} />
                                    <span>New status</span>
                                </button>
                            </div>
                        )}
                    </div>
                )}
            </main>
        </div>
    );
}
