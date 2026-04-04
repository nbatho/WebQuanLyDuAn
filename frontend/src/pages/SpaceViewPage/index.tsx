import { useState, useRef, useEffect } from 'react';
import {
    ChevronDown, Plus, Calendar, CheckCircle2, Search, Star, Hash,
    LayoutList, Trello, LayoutDashboard,
    FileText, BarChart2, AlignLeft, Activity, PenSquare,
    Sparkles, Grid, Users, Share2, Zap, Bot, Clock
} from 'lucide-react';
import TaskDetailModal from '../../components/TaskDetailModal';
import CreateTaskModal, { type NewTaskData } from '../../components/CreateTaskModal';
import ContextMenu from '../../components/ContextMenu';
import {
    GroupByDropdown,
    SubtasksDropdown,
    FilterPanel,
    CustomizePanel,
} from '../../components/ToolbarDropdowns';
import type { StatusGroup, Task } from '../../types/tasks';
import OverviewView from './component/OverviewView/overviewView';
import ListView from './component/ListView/listView';
import BoardView from './component/BoardView/boardView';
type ViewType = 'overview' | 'list' | 'board';

/* ═══════════════════════════════════════════════
   MOCK DATA
═══════════════════════════════════════════════ */
const initialGroups: StatusGroup[] = [
    {
        id: 'inprogress', name: 'IN PROGRESS', color: '#0058be', isExpanded: true,
        tasks: [
            { id: 't1', title: 'Finalize Budget', status: 'IN PROGRESS', statusColor: '#0058be', priority: 'Urgent', priorityColor: '#e74c3c', dueDate: '10/31/23', assignees: ['AR'], comments: 2, subtasks: [{ id: 's1', title: 'Review Q3 spend', status: 'IN PROGRESS', statusColor: '#0058be', assignee: 'AR' }], description: 'Review and finalize the budget for Q4.' },
            { id: 't2', title: 'Review Proposal', status: 'IN PROGRESS', statusColor: '#0058be', priority: 'High', priorityColor: '#f0a220', dueDate: '11/7/23', assignees: ['MC'], comments: 0, subtasks: [], description: 'Review the client proposal and provide feedback.' },
            { id: 't3', title: 'Send Project Update', status: 'IN PROGRESS', statusColor: '#0058be', priority: 'High', priorityColor: '#f0a220', dueDate: '11/16/23', assignees: ['SJ'], comments: 1, subtasks: [], description: 'Send weekly project status update.' },
        ]
    },
    {
        id: 'todo', name: 'TO DO', color: '#5f6368', isExpanded: true,
        tasks: [
            { id: 't4', title: 'Schedule Team Meeting', status: 'TO DO', statusColor: '#5f6368', priority: 'Urgent', priorityColor: '#e74c3c', dueDate: '11/1/23', assignees: ['AR', 'MC'], comments: 3, subtasks: [], description: 'Schedule the weekly team sync meeting.' },
            { id: 't5', title: 'Update Website Content', status: 'TO DO', statusColor: '#5f6368', priority: 'Normal', priorityColor: '#00b894', dueDate: '12/1/23', assignees: ['ER'], comments: 0, subtasks: [], description: 'Update the homepage and product pages.' },
            { id: 't6', title: 'Revise Handbook', status: 'TO DO', statusColor: '#5f6368', priority: 'Normal', priorityColor: '#00b894', dueDate: '12/13/23', assignees: ['SJ'], comments: 0, subtasks: [] },
            { id: 't7', title: 'Conduct Audit', status: 'TO DO', statusColor: '#5f6368', priority: 'Normal', priorityColor: '#00b894', dueDate: '11/29/23', assignees: ['AR'], comments: 5, subtasks: [] },
        ]
    },
    {
        id: 'done', name: 'COMPLETE', color: '#27ae60', isExpanded: true,
        tasks: [
            { id: 't8', title: 'Order Supplies', status: 'COMPLETE', statusColor: '#27ae60', priority: 'Urgent', priorityColor: '#e74c3c', dueDate: '10/3/23', assignees: ['MC'], comments: 0, subtasks: [] },
        ]
    },
];

const VIEW_OPTIONS = [
    { id: 'list', icon: LayoutList, label: 'List', desc: 'Track tasks, bugs, people & more', color: '#5f6368', bg: '#f0f0f0' },
    { id: 'gantt', icon: BarChart2, label: 'Gantt', desc: 'Plan dependencies & time', color: '#fff', bg: '#e74c3c' },
    { id: 'calendar', icon: Calendar, label: 'Calendar', desc: 'Plan, schedule, & delegate', color: '#fff', bg: '#f0a220' },
    { id: 'doc', icon: FileText, label: 'Doc', desc: 'Collaborate & document anything', color: '#fff', bg: '#0058be' },
    { id: 'board', icon: Trello, label: 'Board – Kanban', desc: 'Move tasks between columns', color: '#fff', bg: '#7c5cfc' },
    { id: 'form', icon: PenSquare, label: 'Form', desc: 'Collect, track, & report data', color: '#fff', bg: '#7c5cfc' },
    { id: 'ai', icon: Sparkles, label: 'Create with AI', desc: 'Your perfect solution', color: '#9aa0a6', bg: '#f8f8f8' },
    { id: 'table', icon: Grid, label: 'Table', desc: 'Structured table format', color: '#fff', bg: '#27ae60' },
    { id: 'dashboard', icon: LayoutDashboard, label: 'Dashboard', desc: 'Track metrics & insights', color: '#fff', bg: '#7c5cfc' },
    { id: 'timeline', icon: AlignLeft, label: 'Timeline', desc: 'See tasks by start & due date', color: '#fff', bg: '#5f6368' },
    { id: 'activity', icon: Activity, label: 'Activity', desc: 'Real-time activity feed', color: '#fff', bg: '#0058be' },
    { id: 'workload', icon: Users, label: 'Workload', desc: 'Balance team capacity', color: '#fff', bg: '#27ae60' },
];

let taskIdCounter = 100;

/* ═══════════════════════════════════════════════
   MAIN COMPONENT
═══════════════════════════════════════════════ */
export default function SpaceViewPage() {
    const [activeView, setActiveView] = useState<ViewType>('list');
    const [groups, setGroups] = useState<StatusGroup[]>(initialGroups);
    const [selectedTask, setSelectedTask] = useState<Task | null>(null);
    const [showViewPicker, setShowViewPicker] = useState(false);
    const [viewSearch, setViewSearch] = useState('');
    const pickerRef = useRef<HTMLDivElement>(null);

    // Create Task Modal
    const [showCreateTask, setShowCreateTask] = useState(false);

    // Context Menu
    const [ctxMenu, setCtxMenu] = useState<{ x: number; y: number; task: Task } | null>(null);

    // Toolbar states
    const [groupBy, setGroupBy] = useState('status');
    const [subtaskMode, setSubtaskMode] = useState('collapsed');
    const [showClosed, setShowClosed] = useState(true);
    const [filters, setFilters] = useState<{ status: string[]; priority: string[]; assignee: string[] }>({ status: [], priority: [], assignee: [] });
    const [columns, setColumns] = useState<Record<string, boolean>>({ assignee: true, dueDate: true, priority: true, tags: false });

    // Active dropdown tracker (only one open at a time)
    const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
    const toggleDropdown = (id: string) => setActiveDropdown(prev => prev === id ? null : id);

    // Close picker on outside click
    useEffect(() => {
        const handler = (e: MouseEvent) => {
            if (pickerRef.current && !pickerRef.current.contains(e.target as Node)) setShowViewPicker(false);
        };
        document.addEventListener('mousedown', handler);
        return () => document.removeEventListener('mousedown', handler);
    }, []);

    // Apply filters to groups
    const filteredGroups = groups.map(g => {
        let tasks = g.tasks;
        if (filters.status.length > 0) tasks = tasks.filter(t => filters.status.includes(t.status));
        if (filters.priority.length > 0) tasks = tasks.filter(t => filters.priority.includes(t.priority));
        if (filters.assignee.length > 0) tasks = tasks.filter(t => t.assignees.some(a => filters.assignee.includes(a)));
        return { ...g, tasks };
    });

    const handleCreateTask = (data: NewTaskData) => {
        const statusMap: Record<string, string> = { 'TO DO': 'todo', 'IN PROGRESS': 'inprogress', 'COMPLETE': 'done' };
        const groupId = statusMap[data.status] || 'todo';
        const newTask: Task = {
            id: `t${taskIdCounter++}`,
            title: data.title,
            status: data.status,
            statusColor: data.statusColor,
            priority: data.priority,
            priorityColor: data.priorityColor,
            dueDate: data.dueDate ? new Date(data.dueDate).toLocaleDateString('en-US', { month: '2-digit', day: '2-digit', year: '2-digit' }) : null,
            assignees: data.assignees,
            comments: 0,
            subtasks: [],
            description: data.description,
        };
        setGroups(prev => prev.map(g =>
            g.id === groupId ? { ...g, tasks: [...g.tasks, newTask] } : g
        ));
    };

    const handleContextAction = (action: string) => {
        if (!ctxMenu) return;
        const { task } = ctxMenu;
        switch (action) {
            case 'delete':
                setGroups(prev => prev.map(g => ({
                    ...g, tasks: g.tasks.filter(t => t.id !== task.id)
                })));
                break;
            case 'duplicate':
                setGroups(prev => prev.map(g => {
                    const idx = g.tasks.findIndex(t => t.id === task.id);
                    if (idx === -1) return g;
                    const clone = { ...task, id: `t${taskIdCounter++}`, title: `${task.title} (copy)` };
                    const newTasks = [...g.tasks];
                    newTasks.splice(idx + 1, 0, clone);
                    return { ...g, tasks: newTasks };
                }));
                break;
            case 'copy-link':
                navigator.clipboard?.writeText(`task/${task.id}`);
                break;
            case 'rename':
                setSelectedTask(task);
                break;
            case 'archive':
                setGroups(prev => prev.map(g => ({
                    ...g, tasks: g.tasks.filter(t => t.id !== task.id)
                })));
                break;
            default:
                break;
        }
    };

    const handleContextMenu = (e: React.MouseEvent, task: Task) => {
        e.preventDefault();
        e.stopPropagation();
        setCtxMenu({ x: e.clientX, y: e.clientY, task });
    };

    const filteredViews = VIEW_OPTIONS.filter(v =>
        v.label.toLowerCase().includes(viewSearch.toLowerCase()) ||
        v.desc.toLowerCase().includes(viewSearch.toLowerCase())
    );
    const popularViews = filteredViews.slice(0, 7);
    const moreViews = filteredViews.slice(7);

    return (
        <div className="flex h-full flex-col overflow-hidden bg-white" style={{ fontFamily: "'Plus Jakarta Sans', 'Inter', sans-serif" }}>
            {/* ═══════ HEADER ═══════ */}
            <header className="shrink-0 border-b border-[#eef0f5] bg-white">
                <div className="flex items-center justify-between px-5 pb-2 pt-2.5">
                    <div className="flex items-center gap-2">
                        <div className="flex h-6 w-6 items-center justify-center rounded-md" style={{ backgroundColor: '#0058be' }}>
                            <Hash size={16} color="#fff" />
                        </div>
                        <h1 className="m-0 text-base font-bold text-[#141b2b]">Main Space</h1>
                        <button className="flex items-center rounded px-1 py-0.5 text-[#9aa0a6] hover:bg-[#f0f4ff] hover:text-[#0058be]"><ChevronDown size={16} /></button>
                        <button className="flex items-center rounded px-1 py-0.5 text-[#9aa0a6] hover:bg-[#f0f4ff] hover:text-[#0058be]"><Star size={15} /></button>
                    </div>
                    <div className="flex items-center gap-1.5">
                        <button className="flex cursor-pointer items-center gap-1.25 rounded-md border border-[#eef0f5] bg-transparent px-2.5 py-1 text-xs font-semibold text-[#5f6368] transition-all duration-150 hover:border-[#dcdfe4] hover:bg-[#f8fafc]"><Clock size={14} /> Agents</button>
                        <button className="flex cursor-pointer items-center gap-1.25 rounded-md border border-[#eef0f5] bg-transparent px-2.5 py-1 text-xs font-semibold text-[#5f6368] transition-all duration-150 hover:border-[#dcdfe4] hover:bg-[#f8fafc]"><Zap size={14} /> Automate</button>
                        <button className="flex cursor-pointer items-center gap-1.25 rounded-md border border-[#eef0f5] bg-transparent px-2.5 py-1 text-xs font-semibold text-[#5f6368] transition-all duration-150 hover:border-[#dcdfe4] hover:bg-[#f8fafc]"><Bot size={14} /> Ask AI</button>
                        <button className="flex cursor-pointer items-center gap-1.25 rounded-md border border-[#0058be] bg-[#0058be] px-2.5 py-1 text-xs font-semibold text-white transition-all duration-150 hover:bg-[#004aab]"><Share2 size={14} /> Share</button>
                    </div>
                </div>
                <div className="flex items-center gap-0.5 px-5">
                    <button className="flex items-center gap-1.25 whitespace-nowrap rounded-t-md border-b-2 border-b-transparent px-3 py-2 text-[13px] font-medium text-[#9aa0a6] transition-all duration-150 hover:bg-[#f8fafc] hover:text-[#5f6368]">Add Channel</button>
                    <button className={`flex items-center gap-1.25 whitespace-nowrap rounded-t-md border-b-2 px-3 py-2 text-[13px] font-semibold transition-all duration-150 hover:bg-[#f8fafc] hover:text-[#141b2b] ${activeView === 'overview' ? 'border-b-[#0058be] text-[#0058be]' : 'border-b-transparent text-[#5f6368]'}`} onClick={() => setActiveView('overview')}>
                        <LayoutDashboard size={14} /> Overview
                    </button>
                    <button className={`flex items-center gap-1.25 whitespace-nowrap rounded-t-md border-b-2 px-3 py-2 text-[13px] font-semibold transition-all duration-150 hover:bg-[#f8fafc] hover:text-[#141b2b] ${activeView === 'list' ? 'border-b-[#0058be] text-[#0058be]' : 'border-b-transparent text-[#5f6368]'}`} onClick={() => setActiveView('list')}>
                        <LayoutList size={14} /> List
                    </button>
                    <button className={`flex items-center gap-1.25 whitespace-nowrap rounded-t-md border-b-2 px-3 py-2 text-[13px] font-semibold transition-all duration-150 hover:bg-[#f8fafc] hover:text-[#141b2b] ${activeView === 'board' ? 'border-b-[#0058be] text-[#0058be]' : 'border-b-transparent text-[#5f6368]'}`} onClick={() => setActiveView('board')}>
                        <Trello size={14} /> Board
                    </button>
                    <div className="relative" ref={pickerRef}>
                        <button className="flex items-center gap-1 whitespace-nowrap rounded-t-md px-2.5 py-2 text-[13px] font-semibold text-[#9aa0a6] transition-all duration-150 hover:bg-[#f8fafc] hover:text-[#5f6368]" onClick={() => setShowViewPicker(v => !v)}>
                            <Plus size={13} /> View
                        </button>
                        {showViewPicker && (
                            <div className="absolute left-0 top-[calc(100%+4px)] z-1000 w-125 rounded-xl border border-[#eef0f5] bg-white p-3 shadow-[0_8px_32px_rgba(0,0,0,0.14)]">
                                <div className="mb-3.5 flex items-center gap-2 rounded-lg border border-[#dcdfe4] px-3 py-1.5">
                                    <Search size={14} className="shrink-0 text-[#9aa0a6]" />
                                    <input autoFocus value={viewSearch} onChange={e => setViewSearch(e.target.value)}
                                        placeholder="Search or describe views" className="flex-1 border-none bg-transparent text-[13px] text-[#141b2b] outline-none" />
                                </div>
                                <div className="mb-2 mt-1 text-[11px] font-bold uppercase tracking-[0.06em] text-[#9aa0a6]">Popular</div>
                                <div className="mb-3 grid grid-cols-2 gap-1">
                                    {popularViews.map(v => (
                                        <button key={v.id} className="flex cursor-pointer items-center gap-2.5 rounded-lg border-none bg-transparent px-2.5 py-2 text-left transition-colors duration-150 hover:bg-[#f8fafc]" onClick={() => {
                                            if (v.id === 'list') setActiveView('list');
                                            if (v.id === 'board') setActiveView('board');
                                            setShowViewPicker(false);
                                        }}>
                                            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg" style={{ backgroundColor: v.bg }}>
                                                <v.icon size={18} color={v.color} />
                                            </div>
                                            <div className="flex flex-col gap-0.5">
                                                <span className="text-[13px] font-bold text-[#141b2b]">{v.label}</span>
                                                <span className="text-[11px] text-[#9aa0a6]">{v.desc}</span>
                                            </div>
                                        </button>
                                    ))}
                                </div>
                                {moreViews.length > 0 && (
                                    <>
                                        <div className="mb-2 mt-1 text-[11px] font-bold uppercase tracking-[0.06em] text-[#9aa0a6]">More views</div>
                                        <div className="mb-3 grid grid-cols-2 gap-1">
                                            {moreViews.map(v => (
                                                <button key={v.id} className="flex cursor-pointer items-center gap-2.5 rounded-lg border-none bg-transparent px-2.5 py-2 text-left transition-colors duration-150 hover:bg-[#f8fafc]" onClick={() => setShowViewPicker(false)}>
                                                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg" style={{ backgroundColor: v.bg }}>
                                                        <v.icon size={18} color={v.color} />
                                                    </div>
                                                    <div className="flex flex-col gap-0.5">
                                                        <span className="text-[13px] font-bold text-[#141b2b]">{v.label}</span>
                                                        <span className="text-[11px] text-[#9aa0a6]">{v.desc}</span>
                                                    </div>
                                                </button>
                                            ))}
                                        </div>
                                    </>
                                )}
                                <div className="mt-1 flex gap-5 border-t border-[#eef0f5] pt-2.5">
                                    <label className="flex cursor-pointer items-center gap-1.5 text-xs text-[#5f6368]"><input type="checkbox" /> Private view</label>
                                    <label className="flex cursor-pointer items-center gap-1.5 text-xs text-[#5f6368]"><input type="checkbox" /> Pin view</label>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </header>

            {/* ═══════ TOOLBAR ═══════ */}
            {activeView !== 'overview' && (
                <div className="flex shrink-0 items-center justify-between border-b border-[#eef0f5] bg-white px-5 py-2">
                    <div className="flex items-center gap-1.5">
                        <GroupByDropdown value={groupBy} onChange={setGroupBy}
                            isOpen={activeDropdown === 'group'} onToggle={() => toggleDropdown('group')} />
                        <SubtasksDropdown value={subtaskMode} onChange={setSubtaskMode}
                            isOpen={activeDropdown === 'subtask'} onToggle={() => toggleDropdown('subtask')} />
                    </div>
                    <div className="flex items-center gap-1.5">
                        {activeView === 'board' && (
                            <button className="flex cursor-pointer items-center gap-1 rounded-md border-none bg-transparent px-2 py-1 text-xs font-semibold whitespace-nowrap text-[#5f6368] hover:bg-[#f0f4ff] hover:text-[#0058be]">Sort</button>
                        )}
                        <FilterPanel isOpen={activeDropdown === 'filter'} onToggle={() => toggleDropdown('filter')}
                            filters={filters} onFiltersChange={setFilters} />
                        <button
                            className={`flex cursor-pointer items-center gap-1 rounded-md border-none bg-transparent px-2 py-1 text-xs font-semibold whitespace-nowrap hover:bg-[#f0f4ff] hover:text-[#0058be] ${showClosed ? 'text-[#0058be]' : 'text-[#5f6368]'}`}
                            onClick={() => setShowClosed(v => !v)}
                        >
                            {showClosed ? <CheckCircle2 size={13} /> : null} Closed
                        </button>
                        <button className="flex cursor-pointer items-center gap-1 rounded-md border-none bg-transparent px-2 py-1 text-xs font-semibold whitespace-nowrap text-[#5f6368] hover:bg-[#f0f4ff] hover:text-[#0058be]"><Users size={13} /> Assignee</button>
                        <button className="flex cursor-pointer items-center gap-1 rounded-md border-none bg-transparent px-2 py-1 text-xs font-semibold whitespace-nowrap text-[#5f6368] hover:bg-[#f0f4ff] hover:text-[#0058be]"><Search size={13} /></button>
                        <CustomizePanel isOpen={activeDropdown === 'customize'} onToggle={() => toggleDropdown('customize')}
                            columns={columns} onColumnsChange={setColumns} />
                        <button className="flex cursor-pointer items-center gap-1 rounded-md border-none bg-[#0058be] px-3 py-1.25 text-xs font-bold text-white transition-colors duration-150 hover:bg-[#004aab]" onClick={() => setShowCreateTask(true)}>
                            <Plus size={14} /> Add Task <ChevronDown size={12} />
                        </button>
                    </div>
                </div>
            )}

            {/* ═══════ CONTENT ═══════ */}
            <main className="flex flex-1 flex-col overflow-hidden">
                {activeView === 'overview' && <OverviewView />}
                {activeView === 'list' && (
                    <ListView groups={filteredGroups} setGroups={setGroups}
                        setSelectedTask={setSelectedTask} showClosed={showClosed}
                        columns={columns} onContextMenu={handleContextMenu} />
                )}
                {activeView === 'board' && (
                    <BoardView groups={filteredGroups} setGroups={setGroups}
                        setSelectedTask={setSelectedTask} showClosed={showClosed}
                        onContextMenu={handleContextMenu} />
                )}
            </main>

            {/* ═══════ MODALS & OVERLAYS ═══════ */}
            <TaskDetailModal isOpen={!!selectedTask} onClose={() => setSelectedTask(null)} task={selectedTask} />
            <CreateTaskModal isOpen={showCreateTask} onClose={() => setShowCreateTask(false)} onCreate={handleCreateTask} />
            <ContextMenu
                x={ctxMenu?.x || 0} y={ctxMenu?.y || 0}
                isOpen={!!ctxMenu}
                onClose={() => setCtxMenu(null)}
                onAction={handleContextAction}
                taskTitle={ctxMenu?.task.title}
            />
        </div>
    );
}
