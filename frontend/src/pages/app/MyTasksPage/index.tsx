import { useState } from 'react';
import {
    CheckCircle2, Calendar, Flag, ChevronDown, ChevronRight,
    Plus, Search, LayoutList, Trello, Filter, Star, MoreHorizontal,
    MessageSquare, Clock
} from 'lucide-react';
import { Avatar } from 'antd';
import TaskDetailModal from '../../../components/TaskDetailModal';
import './my-tasks.css';

/* ── Types ── */
interface Task {
    id: string;
    title: string;
    status: string;
    statusColor: string;
    priority: string;
    priorityColor: string;
    dueDate: string | null;
    space: string;
    spaceColor: string;
    comments: number;
    assignees: string[];
    description?: string;
    subtasks: any[];
}

type TabType = 'assigned' | 'mentions' | 'created';

/* ── Mock Data ── */
const allTasks: Task[] = [
    // Today
    { id: 't1', title: 'Finalize Q1 Marketing Roadmap', status: 'IN PROGRESS', statusColor: '#0058be', priority: 'Urgent', priorityColor: '#e74c3c', dueDate: 'Today', space: 'Marketing', spaceColor: '#e84393', comments: 3, assignees: ['AR'], subtasks: [], description: 'Draft due by end of day for the stakeholder meeting.' },
    { id: 't2', title: 'Review UI Components Documentation', status: 'TO DO', statusColor: '#5f6368', priority: 'High', priorityColor: '#f0a220', dueDate: 'Today', space: 'Design', spaceColor: '#00b894', comments: 1, assignees: ['AR', 'MC'], subtasks: [], description: 'Coordinate with the Design Space to align on tokens.' },
    // This week
    { id: 't3', title: 'Setup CI/CD Pipeline', status: 'IN PROGRESS', statusColor: '#0058be', priority: 'High', priorityColor: '#f0a220', dueDate: 'Wed, Oct 25', space: 'Development', spaceColor: '#0984e3', comments: 0, assignees: ['AR'], subtasks: [] },
    { id: 't4', title: 'Review Brand Identity v2', status: 'TO DO', statusColor: '#5f6368', priority: 'Normal', priorityColor: '#00b894', dueDate: 'Thu, Oct 26', space: 'Marketing', spaceColor: '#e84393', comments: 2, assignees: ['AR','SJ'], subtasks: [] },
    { id: 't5', title: 'Security Audit Report Q4', status: 'IN PROGRESS', statusColor: '#0058be', priority: 'Urgent', priorityColor: '#e74c3c', dueDate: 'Fri, Oct 27', space: 'Development', spaceColor: '#0984e3', comments: 1, assignees: ['AR'], subtasks: [] },
    // Next week
    { id: 't6', title: 'Multi-currency Payment Support', status: 'TO DO', statusColor: '#5f6368', priority: 'Normal', priorityColor: '#00b894', dueDate: 'Mon, Oct 30', space: 'Development', spaceColor: '#0984e3', comments: 0, assignees: ['AR','ER'], subtasks: [] },
    { id: 't7', title: 'Database Indexing for Reports', status: 'TO DO', statusColor: '#5f6368', priority: 'Normal', priorityColor: '#00b894', dueDate: 'Tue, Oct 31', space: 'Development', spaceColor: '#0984e3', comments: 0, assignees: ['AR'], subtasks: [] },
    // Completed
    { id: 't8', title: 'SSO Integration with Azure AD', status: 'COMPLETE', statusColor: '#27ae60', priority: 'High', priorityColor: '#f0a220', dueDate: 'Oct 18', space: 'Development', spaceColor: '#0984e3', comments: 4, assignees: ['AR'], subtasks: [] },
    { id: 't9', title: 'Dark Mode Interface Alpha', status: 'COMPLETE', statusColor: '#27ae60', priority: 'Normal', priorityColor: '#00b894', dueDate: 'Oct 21', space: 'Design', spaceColor: '#00b894', comments: 2, assignees: ['AR','ER'], subtasks: [] },
];

const avatarColors: Record<string, string> = {
    AR: '#4285F4', MC: '#7c5cfc', SJ: '#0058be', ER: '#e84393'
};

interface TaskGroup {
    label: string;
    icon?: string;
    tasks: Task[];
}

function groupByDate(tasks: Task[]): TaskGroup[] {
    const today: Task[] = [], thisWeek: Task[] = [], nextWeek: Task[] = [], completed: Task[] = [], noDate: Task[] = [];
    tasks.forEach(t => {
        if (t.status === 'COMPLETE') completed.push(t);
        else if (t.dueDate === 'Today') today.push(t);
        else if (t.dueDate?.includes('Oct 2') || t.dueDate?.includes('Oct 3')) thisWeek.push(t);
        else if (t.dueDate?.includes('Oct 3') || t.dueDate?.includes('Nov') || t.dueDate?.includes('Mon') || t.dueDate?.includes('Tue')) nextWeek.push(t);
        else if (!t.dueDate) noDate.push(t);
        else thisWeek.push(t);
    });
    const groups: TaskGroup[] = [];
    if (today.length) groups.push({ label: '📌 Today', tasks: today });
    if (thisWeek.length) groups.push({ label: '📅 This Week', tasks: thisWeek });
    if (nextWeek.length) groups.push({ label: '📆 Next Week', tasks: nextWeek });
    if (noDate.length) groups.push({ label: '📋 No date', tasks: noDate });
    if (completed.length) groups.push({ label: '✅ Completed', tasks: completed });
    return groups;
}

export default function MyTasksPage() {
    const [activeTab, setActiveTab] = useState<TabType>('assigned');
    const [selectedTask, setSelectedTask] = useState<Task | null>(null);
    const [expandedGroups, setExpandedGroups] = useState<Record<string, boolean>>({ '📌 Today': true, '📅 This Week': true, '📆 Next Week': true, '📋 No date': true, '✅ Completed': false });
    const [searchText, setSearchText] = useState('');
    const [showCompleted, setShowCompleted] = useState(true);

    const filteredTasks = allTasks.filter(t => {
        if (!showCompleted && t.status === 'COMPLETE') return false;
        if (searchText && !t.title.toLowerCase().includes(searchText.toLowerCase())) return false;
        return true;
    });

    const taskGroups = groupByDate(filteredTasks);

    const toggleGroup = (label: string) => {
        setExpandedGroups(prev => ({ ...prev, [label]: !prev[label] }));
    };

    const totalActive = allTasks.filter(t => t.status !== 'COMPLETE').length;
    const totalOverdue = allTasks.filter(t => t.dueDate === 'Today' && t.status !== 'COMPLETE').length;

    return (
        <div className="mt-page">
            {/* ═══════ HEADER ═══════ */}
            <header className="mt-header">
                <div className="mt-header-top">
                    <div className="mt-header-left">
                        <h1 className="mt-title">My Tasks</h1>
                        <div className="mt-task-stats">
                            <span className="mt-stat"><span className="mt-stat-num">{totalActive}</span> active</span>
                            <span className="mt-stat-sep">·</span>
                            <span className="mt-stat mt-stat--overdue"><span className="mt-stat-num">{totalOverdue}</span> due today</span>
                        </div>
                    </div>
                    <div className="mt-header-right">
                        <button className="mt-hdr-btn"><Star size={14} /> Favorites</button>
                        <button className="mt-hdr-btn mt-hdr-btn--primary"><Plus size={14} /> Add Task</button>
                    </div>
                </div>
                <div className="mt-tabs">
                    <button className={`mt-tab ${activeTab === 'assigned' ? 'mt-tab--active' : ''}`}
                        onClick={() => setActiveTab('assigned')}>
                        <CheckCircle2 size={14} /> Assigned to me <span className="mt-tab-count">{totalActive}</span>
                    </button>
                    <button className={`mt-tab ${activeTab === 'mentions' ? 'mt-tab--active' : ''}`}
                        onClick={() => setActiveTab('mentions')}>
                        <MessageSquare size={14} /> Mentions <span className="mt-tab-count">2</span>
                    </button>
                    <button className={`mt-tab ${activeTab === 'created' ? 'mt-tab--active' : ''}`}
                        onClick={() => setActiveTab('created')}>
                        <Clock size={14} /> Created by me
                    </button>
                </div>
            </header>

            {/* ═══════ TOOLBAR ═══════ */}
            <div className="mt-toolbar">
                <div className="mt-toolbar-left">
                    <div className="mt-search-wrap">
                        <Search size={14} className="mt-search-icon" />
                        <input className="mt-search-input" placeholder="Search tasks..." value={searchText} onChange={e => setSearchText(e.target.value)} />
                    </div>
                </div>
                <div className="mt-toolbar-right">
                    <button className="mt-toolbar-btn"><Filter size={13} /> Filter</button>
                    <button className="mt-toolbar-btn" onClick={() => setShowCompleted(!showCompleted)}>
                        {showCompleted ? <CheckCircle2 size={13} /> : null} Completed
                    </button>
                    <button className="mt-toolbar-btn"><LayoutList size={13} /></button>
                </div>
            </div>

            {/* ═══════ TASK LIST ═══════ */}
            <div className="mt-task-list">
                {taskGroups.map(group => (
                    <div key={group.label} className="mt-group">
                        <div className="mt-group-header" onClick={() => toggleGroup(group.label)}>
                            <button className="mt-group-toggle">
                                {expandedGroups[group.label] ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
                            </button>
                            <span className="mt-group-label">{group.label}</span>
                            <span className="mt-group-count">{group.tasks.length}</span>
                            <div className="mt-group-line" />
                        </div>

                        {expandedGroups[group.label] && (
                            <div className="mt-group-tasks">
                                {group.tasks.map(task => (
                                    <div key={task.id} className="mt-task-row" onClick={() => setSelectedTask(task)}>
                                        <div className="mt-td-check">
                                            <CheckCircle2
                                                size={16}
                                                className={`mt-check-icon ${task.status === 'COMPLETE' ? 'mt-check-icon--done' : ''}`}
                                                style={task.status === 'COMPLETE' ? { color: '#27ae60' } : undefined}
                                            />
                                        </div>
                                        <div className="mt-td-main">
                                            <span className={`mt-task-title-text ${task.status === 'COMPLETE' ? 'mt-task-title--done' : ''}`}>
                                                {task.title}
                                            </span>
                                            <div className="mt-task-badges">
                                                <span className="mt-space-badge" style={{ backgroundColor: task.spaceColor + '18', color: task.spaceColor }}>
                                                    {task.space}
                                                </span>
                                                {task.comments > 0 && (
                                                    <span className="mt-comment-badge"><MessageSquare size={11} /> {task.comments}</span>
                                                )}
                                            </div>
                                        </div>
                                        <div className="mt-td-status">
                                            <span className="mt-status-badge" style={{ backgroundColor: task.statusColor }}>
                                                {task.status}
                                            </span>
                                        </div>
                                        <div className="mt-td-date">
                                            {task.dueDate && (
                                                <span className={`mt-date-val ${task.dueDate === 'Today' ? 'mt-date-val--today' : ''}`}>
                                                    <Calendar size={11} /> {task.dueDate}
                                                </span>
                                            )}
                                        </div>
                                        <div className="mt-td-priority">
                                            {task.priority !== 'Normal' && (
                                                <span className="mt-priority-flag" style={{ color: task.priorityColor }}>
                                                    <Flag size={11} fill={task.priorityColor} />
                                                </span>
                                            )}
                                        </div>
                                        <div className="mt-td-assignees">
                                            {task.assignees.map(a => (
                                                <Avatar key={a} size={22} style={{ backgroundColor: avatarColors[a], fontSize: '9px', fontWeight: 'bold', marginLeft: '-4px' }}>{a}</Avatar>
                                            ))}
                                        </div>
                                        <div className="mt-td-more">
                                            <MoreHorizontal size={14} className="mt-more-icon" />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                ))}
            </div>

            <TaskDetailModal isOpen={!!selectedTask} onClose={() => setSelectedTask(null)} task={selectedTask} />
        </div>
    );
}
