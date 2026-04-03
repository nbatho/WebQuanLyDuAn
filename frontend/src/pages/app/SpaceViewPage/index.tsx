import { useState, useRef, useEffect, type DragEvent } from 'react';
import {
    ChevronDown, ChevronRight, Plus, Calendar, Flag, MessageSquare,
    MoreHorizontal, CheckCircle2, Search, Star, Hash,
    LayoutList, Trello, LayoutDashboard, BookMarked, FolderOpen,
    FileText, BarChart2, AlignLeft, Activity, PenSquare,
    Sparkles, Grid, X, Maximize2, Users, Share2, Zap, Bot, Clock
} from 'lucide-react';
import { Avatar } from 'antd';
import TaskDetailModal from '../../../components/TaskDetailModal';
import CreateTaskModal, { type NewTaskData } from '../../../components/CreateTaskModal';
import ContextMenu from '../../../components/ContextMenu';
import {
    GroupByDropdown,
    SubtasksDropdown,
    FilterPanel,
    CustomizePanel,
} from '../../../components/ToolbarDropdowns';
import './space-view.css';

/* ═══════════════════════════════════════════════
   TYPES
═══════════════════════════════════════════════ */
interface SubTask {
    id: string; title: string; status: string; statusColor: string; assignee?: string;
}
interface Task {
    id: string; title: string; status: string; statusColor: string;
    priority: string; priorityColor: string; dueDate: string | null;
    assignees: string[]; comments: number; subtasks: SubTask[];
    description?: string;
}
interface StatusGroup {
    id: string; name: string; color: string; tasks: Task[]; isExpanded: boolean;
}

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

const avatarColors: Record<string, string> = {
    AR: '#4285F4', MC: '#7c5cfc', SJ: '#0058be', ER: '#e84393'
};

const PRIORITY_COLORS: Record<string, string> = {
    Urgent: '#e74c3c', High: '#f0a220', Normal: '#00b894', Low: '#9aa0a6'
};

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
   OVERVIEW VIEW
═══════════════════════════════════════════════ */
function OverviewView() {
    return (
        <div className="sv-overview">
            <div className="sv-info-banner">
                <span>Get the most out of your Overview! Add, reorder, and resize cards to customize this page <a href="#" className="sv-info-link">Get Started</a></span>
                <button className="sv-info-close"><X size={14} /></button>
            </div>
            <div className="sv-ov-toolbar">
                <button className="sv-filter-btn"><BarChart2 size={14} /> Filters</button>
                <div className="sv-ov-toolbar-right">
                    <span className="sv-refresh-text">🔄 Refreshed: 9 mins ago</span>
                    <span className="sv-auto-refresh">⏰ Auto refresh: On</span>
                    <button className="sv-ov-btn">Customize</button>
                    <button className="sv-ov-btn sv-ov-btn--primary">Add card</button>
                </div>
            </div>
            <div className="sv-ov-cards-row">
                {[1, 2].map(i => (
                    <div key={i} className="sv-ov-card">
                        <div className="sv-ov-card-header">
                            <span className="sv-ov-card-drag">⠿</span>
                            <FileText size={15} className="sv-ov-card-icon" />
                            <span className="sv-ov-card-title">Docs</span>
                            <div className="sv-ov-card-actions">
                                <button className="sv-ov-card-btn"><Maximize2 size={12} /></button>
                                <button className="sv-ov-card-btn"><Plus size={12} /></button>
                                <button className="sv-ov-card-btn"><MoreHorizontal size={12} /></button>
                            </div>
                        </div>
                        <div className="sv-ov-card-empty">
                            <div className="sv-ov-empty-icon">📄</div>
                            <p className="sv-ov-empty-text">There are no Docs in this location yet.</p>
                            <button className="sv-ov-empty-btn">Add a Doc</button>
                        </div>
                    </div>
                ))}
                <div className="sv-ov-card">
                    <div className="sv-ov-card-header">
                        <span className="sv-ov-card-drag">⠿</span>
                        <BookMarked size={15} className="sv-ov-card-icon" />
                        <span className="sv-ov-card-title">Bookmarks</span>
                        <div className="sv-ov-card-actions">
                            <button className="sv-ov-card-btn"><Maximize2 size={12} /></button>
                            <button className="sv-ov-card-btn"><Plus size={12} /></button>
                            <button className="sv-ov-card-btn"><MoreHorizontal size={12} /></button>
                        </div>
                    </div>
                    <div className="sv-ov-card-empty">
                        <div className="sv-ov-empty-icon">🔖</div>
                        <p className="sv-ov-empty-text">Bookmarks make it easy to save items or any URL.</p>
                        <button className="sv-ov-empty-btn">Add Bookmark</button>
                    </div>
                </div>
            </div>
            <div className="sv-ov-section">
                <h3 className="sv-ov-section-title">Folders</h3>
                <div className="sv-ov-folder-row">
                    <div className="sv-ov-folder-item"><FolderOpen size={16} className="sv-ov-folder-icon" /><span>Task Management</span></div>
                </div>
            </div>
        </div>
    );
}

/* ═══════════════════════════════════════════════
   LIST VIEW
═══════════════════════════════════════════════ */
function ListView({
    groups, setGroups, setSelectedTask, showClosed, columns,
    onContextMenu,
}: {
    groups: StatusGroup[];
    setGroups: React.Dispatch<React.SetStateAction<StatusGroup[]>>;
    setSelectedTask: (t: Task | null) => void;
    showClosed: boolean;
    columns: Record<string, boolean>;
    onContextMenu: (e: React.MouseEvent, task: Task) => void;
}) {
    const [expandedTasks, setExpandedTasks] = useState<Record<string, boolean>>({});
    const [inlineGroup, setInlineGroup] = useState<string | null>(null);
    const [inlineText, setInlineText] = useState('');
    const inlineRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        if (inlineGroup) setTimeout(() => inlineRef.current?.focus(), 50);
    }, [inlineGroup]);

    const toggleGroup = (id: string) =>
        setGroups(g => g.map(g2 => g2.id === id ? { ...g2, isExpanded: !g2.isExpanded } : g2));

    const toggleTask = (e: React.MouseEvent, id: string) => {
        e.stopPropagation();
        setExpandedTasks(p => ({ ...p, [id]: !p[id] }));
    };

    const handleInlineCreate = (groupId: string) => {
        if (!inlineText.trim()) { setInlineGroup(null); return; }
        const group = groups.find(g => g.id === groupId);
        if (!group) return;
        const newTask: Task = {
            id: `t${taskIdCounter++}`,
            title: inlineText.trim(),
            status: group.name,
            statusColor: group.color,
            priority: 'Normal',
            priorityColor: '#00b894',
            dueDate: null,
            assignees: [],
            comments: 0,
            subtasks: [],
        };
        setGroups(prev => prev.map(g =>
            g.id === groupId ? { ...g, tasks: [...g.tasks, newTask] } : g
        ));
        setInlineText('');
        setInlineGroup(null);
    };

    const displayGroups = showClosed ? groups : groups.filter(g => g.id !== 'done');

    return (
        <div className="sv-list-view">
            <div className="sv-breadcrumb">Main Space / Task Management</div>
            <div className="sv-table-wrap">
                {displayGroups.map(group => (
                    <div key={group.id} className="sv-group">
                        <div className="sv-group-header" onClick={() => toggleGroup(group.id)}>
                            <button className="sv-group-toggle">
                                {group.isExpanded ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
                            </button>
                            <span className="sv-group-badge" style={{ backgroundColor: group.color }}>{group.name}</span>
                            <span className="sv-group-count">{group.tasks.length}</span>
                            <div className="sv-group-line" />
                            <button className="sv-group-add" onClick={e => { e.stopPropagation(); }}><MoreHorizontal size={14} /></button>
                        </div>

                        {group.isExpanded && (
                            <>
                                <div className="sv-col-header">
                                    <div className="sv-col-name">Name</div>
                                    {columns.assignee && <div className="sv-col-assignee">Assignee</div>}
                                    {columns.dueDate && <div className="sv-col-date">Due date</div>}
                                    {columns.priority && <div className="sv-col-priority">Priority</div>}
                                    <div className="sv-col-more" />
                                </div>

                                <div className="sv-group-tasks">
                                    {group.tasks.map(task => (
                                        <div key={task.id} className="sv-task-wrapper">
                                            <div
                                                className="sv-task-row"
                                                onClick={() => setSelectedTask(task)}
                                                onContextMenu={e => onContextMenu(e, task)}
                                            >
                                                <div className="sv-td-name">
                                                    <div className="sv-task-indicator" style={{ backgroundColor: group.color }} />
                                                    <div className="sv-task-name-content">
                                                        <CheckCircle2 size={16} className="sv-check-icon" />
                                                        <span className="sv-task-title-text">{task.title}</span>
                                                        {task.subtasks.length > 0 && (
                                                            <button className="sv-subtask-toggle" onClick={e => toggleTask(e, task.id)}>
                                                                <span className="sv-subtask-badge">
                                                                    {expandedTasks[task.id] ? <ChevronDown size={10} /> : <ChevronRight size={10} />}
                                                                    {task.subtasks.length}
                                                                </span>
                                                            </button>
                                                        )}
                                                        {task.comments > 0 && (
                                                            <span className="sv-comment-badge"><MessageSquare size={11} /> {task.comments}</span>
                                                        )}
                                                    </div>
                                                </div>
                                                {columns.assignee && (
                                                    <div className="sv-td-assignee">
                                                        {task.assignees.length > 0
                                                            ? task.assignees.map(a => (
                                                                <Avatar key={a} size={22} style={{ backgroundColor: avatarColors[a], fontSize: '9px', fontWeight: 'bold', marginLeft: '-4px' }}>{a}</Avatar>
                                                            ))
                                                            : <span className="sv-empty-assignee">—</span>}
                                                    </div>
                                                )}
                                                {columns.dueDate && (
                                                    <div className="sv-td-date">
                                                        {task.dueDate
                                                            ? <span className={`sv-date-val ${['10/31/23', '11/1/23', '10/3/23'].includes(task.dueDate) ? 'sv-date-val--red' : ''}`}>
                                                                <Calendar size={11} /> {task.dueDate}
                                                            </span>
                                                            : <Calendar size={13} className="sv-empty-icon" />}
                                                    </div>
                                                )}
                                                {columns.priority && (
                                                    <div className="sv-td-priority">
                                                        {task.priority !== 'Normal' ? (
                                                            <span className="sv-priority-flag" style={{ color: task.priorityColor }}>
                                                                <Flag size={11} fill={task.priorityColor} /> {task.priority}
                                                            </span>
                                                        ) : <Flag size={13} className="sv-empty-icon" />}
                                                    </div>
                                                )}
                                                <div className="sv-td-more">
                                                    <button className="sv-row-action" onClick={e => { e.stopPropagation(); onContextMenu(e, task); }}>
                                                        <MoreHorizontal size={14} />
                                                    </button>
                                                </div>
                                            </div>

                                            {/* Subtasks */}
                                            {expandedTasks[task.id] && task.subtasks.map(sub => (
                                                <div key={sub.id} className="sv-task-row sv-subtask-row">
                                                    <div className="sv-td-name">
                                                        <div className="sv-task-indicator" style={{ backgroundColor: sub.statusColor }} />
                                                        <div className="sv-task-name-content sv-subtask-name">
                                                            <span className="sv-subtask-curve-icon">↳</span>
                                                            <CheckCircle2 size={14} className="sv-check-icon" />
                                                            <span className="sv-task-title-text" style={{ fontSize: '12px' }}>{sub.title}</span>
                                                        </div>
                                                    </div>
                                                    {columns.assignee && (
                                                        <div className="sv-td-assignee">
                                                            {sub.assignee
                                                                ? <Avatar size={20} style={{ backgroundColor: avatarColors[sub.assignee], fontSize: '8px' }}>{sub.assignee}</Avatar>
                                                                : <span className="sv-empty-assignee">—</span>}
                                                        </div>
                                                    )}
                                                    {columns.dueDate && <div className="sv-td-date"><Calendar size={13} className="sv-empty-icon" /></div>}
                                                    {columns.priority && <div className="sv-td-priority"><Flag size={13} className="sv-empty-icon" /></div>}
                                                    <div className="sv-td-more" />
                                                </div>
                                            ))}
                                        </div>
                                    ))}

                                    {/* Inline add task */}
                                    {inlineGroup === group.id ? (
                                        <div className="sv-inline-add">
                                            <CheckCircle2 size={16} className="sv-check-icon" />
                                            <input
                                                ref={inlineRef}
                                                className="sv-inline-input"
                                                value={inlineText}
                                                onChange={e => setInlineText(e.target.value)}
                                                placeholder="Task name"
                                                onKeyDown={e => {
                                                    if (e.key === 'Enter') handleInlineCreate(group.id);
                                                    if (e.key === 'Escape') { setInlineGroup(null); setInlineText(''); }
                                                }}
                                                onBlur={() => handleInlineCreate(group.id)}
                                            />
                                        </div>
                                    ) : (
                                        <div className="sv-add-task-inline" onClick={() => setInlineGroup(group.id)}>
                                            <Plus size={13} /> Add Task
                                        </div>
                                    )}
                                </div>
                            </>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
}

/* ═══════════════════════════════════════════════
   BOARD VIEW
═══════════════════════════════════════════════ */
function BoardView({
    groups, setGroups, setSelectedTask, showClosed,
    onContextMenu,
}: {
    groups: StatusGroup[];
    setGroups: React.Dispatch<React.SetStateAction<StatusGroup[]>>;
    setSelectedTask: (t: Task | null) => void;
    showClosed: boolean;
    onContextMenu: (e: React.MouseEvent, task: Task) => void;
}) {
    const dragItem = useRef<{ fromGroupId: string; taskId: string } | null>(null);
    const [dragOverGroup, setDragOverGroup] = useState<string | null>(null);
    const [inlineCol, setInlineCol] = useState<string | null>(null);
    const [inlineText, setInlineText] = useState('');
    const inlineRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        if (inlineCol) setTimeout(() => inlineRef.current?.focus(), 50);
    }, [inlineCol]);

    const displayGroups = showClosed ? groups : groups.filter(g => g.id !== 'done');

    const onDragStart = (e: DragEvent, groupId: string, taskId: string) => {
        dragItem.current = { fromGroupId: groupId, taskId };
        e.dataTransfer.effectAllowed = 'move';
        (e.currentTarget as HTMLElement).style.opacity = '0.5';
    };
    const onDragEnd = (e: DragEvent) => {
        (e.currentTarget as HTMLElement).style.opacity = '1';
        setDragOverGroup(null);
    };
    const onDrop = (e: DragEvent, toGroupId: string) => {
        e.preventDefault(); setDragOverGroup(null);
        if (!dragItem.current) return;
        const { fromGroupId, taskId } = dragItem.current;
        if (fromGroupId === toGroupId) return;
        setGroups(prev => {
            const tgt = prev.find(g => g.id === toGroupId)!;
            const task = prev.find(g => g.id === fromGroupId)!.tasks.find(t => t.id === taskId)!;
            return prev.map(g => {
                if (g.id === fromGroupId) return { ...g, tasks: g.tasks.filter(t => t.id !== taskId) };
                if (g.id === toGroupId) return { ...g, tasks: [...g.tasks, { ...task, status: tgt.name, statusColor: tgt.color }] };
                return g;
            });
        });
        dragItem.current = null;
    };

    const handleInlineCreate = (groupId: string) => {
        if (!inlineText.trim()) { setInlineCol(null); return; }
        const group = groups.find(g => g.id === groupId)!;
        const newTask: Task = {
            id: `t${taskIdCounter++}`, title: inlineText.trim(),
            status: group.name, statusColor: group.color,
            priority: 'Normal', priorityColor: '#00b894',
            dueDate: null, assignees: [], comments: 0, subtasks: [],
        };
        setGroups(prev => prev.map(g => g.id === groupId ? { ...g, tasks: [...g.tasks, newTask] } : g));
        setInlineText(''); setInlineCol(null);
    };

    return (
        <div className="sv-board-view">
            <div className="sv-kanban-columns">
                {displayGroups.map(group => (
                    <div key={group.id}
                        className={`sv-kanban-col ${dragOverGroup === group.id ? 'sv-kanban-col--dragover' : ''}`}
                        onDragOver={e => { e.preventDefault(); setDragOverGroup(group.id); }}
                        onDragLeave={() => setDragOverGroup(null)}
                        onDrop={e => onDrop(e, group.id)}
                    >
                        <div className="sv-kanban-col-header">
                            <div className="sv-kanban-col-title">
                                <span className="sv-kanban-status-dot" style={{ backgroundColor: group.color }} />
                                <span className="sv-kanban-col-name">{group.name}</span>
                                <span className="sv-kanban-col-count">{group.tasks.length}</span>
                            </div>
                            <div className="sv-kanban-col-actions">
                                <button className="sv-kanban-col-btn"><MoreHorizontal size={14} /></button>
                                <button className="sv-kanban-col-btn" onClick={() => setInlineCol(group.id)}><Plus size={14} /></button>
                            </div>
                        </div>
                        <div className="sv-kanban-cards">
                            {group.tasks.map(task => (
                                <div key={task.id} className="sv-kanban-card" draggable
                                    onDragStart={e => onDragStart(e, group.id, task.id)}
                                    onDragEnd={onDragEnd}
                                    onClick={() => setSelectedTask(task)}
                                    onContextMenu={e => onContextMenu(e, task)}
                                >
                                    <div className="sv-kanban-card-title">{task.title}</div>
                                    <div className="sv-kanban-card-marks"><span>≡</span></div>
                                    <div className="sv-kanban-card-meta">
                                        {task.dueDate && (
                                            <span className={`sv-kanban-date ${['10/31/23', '11/1/23', '10/3/23'].includes(task.dueDate) ? 'sv-kanban-date--red' : ''}`}>
                                                <Calendar size={11} /> {task.dueDate}
                                            </span>
                                        )}
                                        {task.priority !== 'Normal' && (
                                            <span className="sv-kanban-priority" style={{ color: task.priorityColor }}>
                                                <Flag size={11} fill={task.priorityColor} /> {task.priority}
                                            </span>
                                        )}
                                        {task.assignees.map(a => (
                                            <Avatar key={a} size={20} style={{ backgroundColor: avatarColors[a], fontSize: '8px', fontWeight: 'bold' }}>{a}</Avatar>
                                        ))}
                                    </div>
                                </div>
                            ))}

                            {inlineCol === group.id ? (
                                <div className="sv-kanban-card sv-kanban-card--inline">
                                    <input
                                        ref={inlineRef}
                                        className="sv-inline-input"
                                        value={inlineText}
                                        onChange={e => setInlineText(e.target.value)}
                                        placeholder="Task name"
                                        onKeyDown={e => {
                                            if (e.key === 'Enter') handleInlineCreate(group.id);
                                            if (e.key === 'Escape') { setInlineCol(null); setInlineText(''); }
                                        }}
                                        onBlur={() => handleInlineCreate(group.id)}
                                    />
                                </div>
                            ) : (
                                <button className="sv-kanban-add-task" onClick={() => setInlineCol(group.id)}>
                                    <Plus size={13} /> Add Task
                                </button>
                            )}
                        </div>
                    </div>
                ))}
                <div className="sv-kanban-add-group"><Plus size={14} /> Add group</div>
            </div>
        </div>
    );
}

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
        <div className="sv-page">
            {/* ═══════ HEADER ═══════ */}
            <header className="sv-header">
                <div className="sv-header-top">
                    <div className="sv-title-area">
                        <div className="sv-space-icon" style={{ backgroundColor: '#0058be' }}>
                            <Hash size={16} color="#fff" />
                        </div>
                        <h1 className="sv-title">Main Space</h1>
                        <button className="sv-title-icon"><ChevronDown size={16} /></button>
                        <button className="sv-title-icon"><Star size={15} /></button>
                    </div>
                    <div className="sv-header-actions">
                        <button className="sv-hdr-btn"><Clock size={14} /> Agents</button>
                        <button className="sv-hdr-btn"><Zap size={14} /> Automate</button>
                        <button className="sv-hdr-btn"><Bot size={14} /> Ask AI</button>
                        <button className="sv-hdr-btn sv-hdr-btn--primary"><Share2 size={14} /> Share</button>
                    </div>
                </div>
                <div className="sv-tab-bar">
                    <button className="sv-tab-item sv-tab-label">Add Channel</button>
                    <button className={`sv-tab-item ${activeView === 'overview' ? 'sv-tab-item--active' : ''}`} onClick={() => setActiveView('overview')}>
                        <LayoutDashboard size={14} /> Overview
                    </button>
                    <button className={`sv-tab-item ${activeView === 'list' ? 'sv-tab-item--active' : ''}`} onClick={() => setActiveView('list')}>
                        <LayoutList size={14} /> List
                    </button>
                    <button className={`sv-tab-item ${activeView === 'board' ? 'sv-tab-item--active' : ''}`} onClick={() => setActiveView('board')}>
                        <Trello size={14} /> Board
                    </button>
                    <div className="sv-view-picker-wrap" ref={pickerRef}>
                        <button className="sv-tab-add" onClick={() => setShowViewPicker(v => !v)}>
                            <Plus size={13} /> View
                        </button>
                        {showViewPicker && (
                            <div className="sv-view-picker">
                                <div className="sv-view-picker-search">
                                    <Search size={14} className="sv-vpc-search-icon" />
                                    <input autoFocus value={viewSearch} onChange={e => setViewSearch(e.target.value)}
                                        placeholder="Search or describe views" className="sv-vpc-search-input" />
                                </div>
                                <div className="sv-vpc-section-label">Popular</div>
                                <div className="sv-vpc-grid">
                                    {popularViews.map(v => (
                                        <button key={v.id} className="sv-vpc-item" onClick={() => {
                                            if (v.id === 'list') setActiveView('list');
                                            if (v.id === 'board') setActiveView('board');
                                            setShowViewPicker(false);
                                        }}>
                                            <div className="sv-vpc-icon" style={{ backgroundColor: v.bg }}>
                                                <v.icon size={18} color={v.color} />
                                            </div>
                                            <div className="sv-vpc-info">
                                                <span className="sv-vpc-label">{v.label}</span>
                                                <span className="sv-vpc-desc">{v.desc}</span>
                                            </div>
                                        </button>
                                    ))}
                                </div>
                                {moreViews.length > 0 && (
                                    <>
                                        <div className="sv-vpc-section-label">More views</div>
                                        <div className="sv-vpc-grid">
                                            {moreViews.map(v => (
                                                <button key={v.id} className="sv-vpc-item" onClick={() => setShowViewPicker(false)}>
                                                    <div className="sv-vpc-icon" style={{ backgroundColor: v.bg }}>
                                                        <v.icon size={18} color={v.color} />
                                                    </div>
                                                    <div className="sv-vpc-info">
                                                        <span className="sv-vpc-label">{v.label}</span>
                                                        <span className="sv-vpc-desc">{v.desc}</span>
                                                    </div>
                                                </button>
                                            ))}
                                        </div>
                                    </>
                                )}
                                <div className="sv-vpc-footer">
                                    <label className="sv-vpc-check"><input type="checkbox" /> Private view</label>
                                    <label className="sv-vpc-check"><input type="checkbox" /> Pin view</label>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </header>

            {/* ═══════ TOOLBAR ═══════ */}
            {activeView !== 'overview' && (
                <div className="sv-list-toolbar">
                    <div className="sv-list-toolbar-left">
                        <GroupByDropdown value={groupBy} onChange={setGroupBy}
                            isOpen={activeDropdown === 'group'} onToggle={() => toggleDropdown('group')} />
                        <SubtasksDropdown value={subtaskMode} onChange={setSubtaskMode}
                            isOpen={activeDropdown === 'subtask'} onToggle={() => toggleDropdown('subtask')} />
                    </div>
                    <div className="sv-list-toolbar-right">
                        {activeView === 'board' && (
                            <button className="sv-chip-icon">Sort</button>
                        )}
                        <FilterPanel isOpen={activeDropdown === 'filter'} onToggle={() => toggleDropdown('filter')}
                            filters={filters} onFiltersChange={setFilters} />
                        <button
                            className={`sv-chip-icon ${showClosed ? 'sv-chip-icon--active-subtle' : ''}`}
                            onClick={() => setShowClosed(v => !v)}
                        >
                            {showClosed ? <CheckCircle2 size={13} /> : null} Closed
                        </button>
                        <button className="sv-chip-icon"><Users size={13} /> Assignee</button>
                        <button className="sv-chip-icon"><Search size={13} /></button>
                        <CustomizePanel isOpen={activeDropdown === 'customize'} onToggle={() => toggleDropdown('customize')}
                            columns={columns} onColumnsChange={setColumns} />
                        <button className="sv-add-task-btn" onClick={() => setShowCreateTask(true)}>
                            <Plus size={14} /> Add Task <ChevronDown size={12} />
                        </button>
                    </div>
                </div>
            )}

            {/* ═══════ CONTENT ═══════ */}
            <main className="sv-content">
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
