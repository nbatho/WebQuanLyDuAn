import { useState } from 'react';
import { 
    ChevronDown, ChevronRight, Plus, Calendar, Flag, MessageSquare, 
    MoreHorizontal, CheckCircle2, Search, Filter, Hash, User
} from 'lucide-react';
import { Avatar } from 'antd';
import TaskDetailModal from '../../components/TaskDetailModal';
import './space-view.css';

// Reusing similar types as MyTasks (mockup)
interface SubTask {
    id: string;
    title: string;
    status: string;
    statusColor: string;
    assignee?: string;
}

interface Task {
    id: string;
    title: string;
    status: string;
    statusColor: string;
    priority: string;
    priorityColor: string;
    dueDate: string | null;
    assignees: string[];
    comments: number;
    subtasks: SubTask[];
}

interface StatusGroup {
    id: string;
    name: string;
    color: string;
    tasks: Task[];
    isExpanded: boolean;
}

const mockGroups: StatusGroup[] = [
    {
        id: 'todo',
        name: 'TO DO',
        color: '#dcdfe4', // Gray for To Do
        isExpanded: true,
        tasks: [
            {
                id: 't1', title: 'Draft Marketing Materials', status: 'TO DO', statusColor: '#dcdfe4',
                priority: 'High', priorityColor: '#f0a220', dueDate: 'Nov 12', assignees: ['AR'], comments: 2,
                subtasks: [{ id: 's1', title: 'Write copy', status: 'TO DO', statusColor: '#dcdfe4', assignee: 'AR' }]
            },
            {
                id: 't2', title: 'Finalize Budget Q4', status: 'TO DO', statusColor: '#dcdfe4',
                priority: 'Urgent', priorityColor: '#e74c3c', dueDate: 'Oct 30', assignees: ['MC', 'SJ'], comments: 5,
                subtasks: []
            }
        ]
    },
    {
        id: 'inprogress',
        name: 'IN PROGRESS',
        color: '#0058be',
        isExpanded: true,
        tasks: [
            {
                id: 't3', title: 'Social Media Campaign Setup', status: 'IN PROGRESS', statusColor: '#0058be',
                priority: 'Normal', priorityColor: '#00b894', dueDate: 'Nov 5', assignees: ['AR', 'ER'], comments: 12,
                subtasks: []
            }
        ]
    },
    {
        id: 'done',
        name: 'DONE',
        color: '#27ae60',
        isExpanded: false,
        tasks: [
            {
                id: 't4', title: 'Kickoff Meeting Preparation', status: 'DONE', statusColor: '#27ae60',
                priority: 'Normal', priorityColor: '#00b894', dueDate: 'Oct 15', assignees: ['SJ'], comments: 0,
                subtasks: []
            }
        ]
    }
];

const avatarColors: Record<string, string> = {
    AR: '#4285F4', MC: '#7c5cfc', SJ: '#0058be', ER: '#e84393'
};

export default function SpaceViewPage() {
    const [groups, setGroups] = useState<StatusGroup[]>(mockGroups);
    const [expandedTasks, setExpandedTasks] = useState<Record<string, boolean>>({});
    const [selectedTask, setSelectedTask] = useState<Task | null>(null);

    const toggleGroup = (groupId: string) => {
        setGroups(groups.map(g => g.id === groupId ? { ...g, isExpanded: !g.isExpanded } : g));
    };

    const toggleTask = (e: React.MouseEvent, taskId: string) => {
        e.stopPropagation();
        setExpandedTasks(prev => ({ ...prev, [taskId]: !prev[taskId] }));
    };

    return (
        <div className="sv-page">
            {/* ═══════ HEADER ═══════ */}
            <header className="sv-header">
                <div className="sv-header-top">
                    <div className="sv-title-area">
                        <div className="sv-space-icon" style={{ backgroundColor: '#e84393' }}>
                            <Hash size={18} color="#fff" />
                        </div>
                        <h1 className="sv-title">Marketing Space</h1>
                    </div>
                    <div className="sv-header-actions">
                        <div className="sv-avatars">
                            {['AR', 'MC', 'SJ', 'ER'].map(a => (
                                <Avatar 
                                    key={a} size={28} 
                                    style={{ backgroundColor: avatarColors[a], border: '2px solid #fff' }}
                                >
                                    <span style={{ fontSize: '11px', fontWeight: 600 }}>{a}</span>
                                </Avatar>
                            ))}
                        </div>
                        <button className="sv-btn sv-btn-outline"><User size={14}/> Share</button>
                    </div>
                </div>

                <div className="sv-toolbar">
                    <div className="sv-tabs">
                        <button className="sv-tab sv-tab--active">List</button>
                        <button className="sv-tab">Board</button>
                        <button className="sv-tab">Calendar</button>
                        <button className="sv-tab-add"><Plus size={14} /> View</button>
                    </div>
                    <div className="sv-filters">
                        <button className="sv-filter-btn"><Search size={14} /> Search</button>
                        <button className="sv-filter-btn"><Filter size={14} /> Filter</button>
                    </div>
                </div>
            </header>

            {/* ═══════ LIST VIEW CONTENT ═══════ */}
            <main className="sv-main">
                {/* Table Header Row */}
                <div className="sv-table-header">
                    <div className="sv-th-cell sv-th-name">Task Name</div>
                    <div className="sv-th-cell sv-th-assignee">Assignee</div>
                    <div className="sv-th-cell sv-th-date">Due Date</div>
                    <div className="sv-th-cell sv-th-priority">Priority</div>
                    <div className="sv-th-cell sv-th-add"><Plus size={14} /></div>
                </div>

                {/* Groups */}
                <div className="sv-groups">
                    {groups.map(group => (
                        <div key={group.id} className="sv-group">
                            {/* Group Header */}
                            <div className="sv-group-header" onClick={() => toggleGroup(group.id)}>
                                <button className="sv-group-toggle">
                                    {group.isExpanded ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
                                </button>
                                <span className="sv-group-badge" style={{ backgroundColor: group.color }}>
                                    {group.name} 
                                </span>
                                <span className="sv-group-count">{group.tasks.length} tasks</span>
                                <div className="sv-group-line" />
                                <button className="sv-group-add"><Plus size={14} /></button>
                            </div>

                            {/* Group Tasks */}
                            {group.isExpanded && (
                                <div className="sv-group-tasks">
                                    {group.tasks.map(task => (
                                        <div key={task.id} className="sv-task-wrapper">
                                            {/* Main Task Row */}
                                            <div className="sv-task-row" onClick={() => setSelectedTask(task)}>
                                                <div className="sv-td-cell sv-td-name" style={{ borderLeftColor: group.color }}>
                                                    <div className="sv-task-indicator" style={{ backgroundColor: group.color }}></div>
                                                    <div className="sv-task-name-content">
                                                        <CheckCircle2 size={16} className="sv-check-icon" />
                                                        <span className="sv-task-title-text">{task.title}</span>
                                                        {task.subtasks.length > 0 && (
                                                            <button 
                                                                className="sv-subtask-toggle" 
                                                                onClick={(e) => toggleTask(e, task.id)}
                                                            >
                                                                <span className="sv-subtask-badge">
                                                                    {expandedTasks[task.id] ? <ChevronDown size={10}/> : <ChevronRight size={10}/>}
                                                                    {task.subtasks.length}
                                                                </span>
                                                            </button>
                                                        )}
                                                        {task.comments > 0 && (
                                                            <span className="sv-comment-badge"><MessageSquare size={12}/> {task.comments}</span>
                                                        )}
                                                    </div>
                                                </div>
                                                <div className="sv-td-cell sv-td-assignee">
                                                    {task.assignees.map(a => (
                                                        <Avatar key={a} size={24} style={{ backgroundColor: avatarColors[a], fontSize: '10px', fontWeight: 'bold' }}>{a}</Avatar>
                                                    ))}
                                                </div>
                                                <div className="sv-td-cell sv-td-date">
                                                    {task.dueDate ? <span><Calendar size={12}/> {task.dueDate}</span> : <span className="sv-empty-value">-</span>}
                                                </div>
                                                <div className="sv-td-cell sv-td-priority">
                                                    {task.priority !== 'Normal' ? (
                                                        <span className="sv-priority-flag" style={{ color: task.priorityColor }}>
                                                            <Flag size={12} fill={task.priorityColor} /> {task.priority}
                                                        </span>
                                                    ) : (
                                                        <span className="sv-empty-value"><Flag size={12}/></span>
                                                    )}
                                                </div>
                                                <div className="sv-td-cell sv-td-add">
                                                    <button className="sv-row-action"><MoreHorizontal size={14} /></button>
                                                </div>
                                            </div>

                                            {/* Subtasks Rows */}
                                            {expandedTasks[task.id] && task.subtasks.map(sub => (
                                                <div key={sub.id} className="sv-task-row sv-subtask-row" onClick={(e) => { e.stopPropagation(); setSelectedTask(sub as any); }}>
                                                    <div className="sv-td-cell sv-td-name" style={{ borderLeftColor: group.color }}>
                                                        <div className="sv-subtask-indent">
                                                            <div className="sv-subtask-curve"></div>
                                                        </div>
                                                        <div className="sv-task-indicator" style={{ backgroundColor: sub.statusColor }}></div>
                                                        <div className="sv-task-name-content">
                                                            <CheckCircle2 size={16} className="sv-check-icon" />
                                                            <span className="sv-task-title-text">{sub.title}</span>
                                                        </div>
                                                    </div>
                                                    <div className="sv-td-cell sv-td-assignee">
                                                        {sub.assignee ? <Avatar size={24} style={{ backgroundColor: avatarColors[sub.assignee], fontSize: '10px' }}>{sub.assignee}</Avatar> : <User size={14} className="sv-empty-user"/>}
                                                    </div>
                                                    <div className="sv-td-cell sv-td-date"><span className="sv-empty-value">-</span></div>
                                                    <div className="sv-td-cell sv-td-priority"><span className="sv-empty-value">-</span></div>
                                                    <div className="sv-td-cell sv-td-add"></div>
                                                </div>
                                            ))}
                                        </div>
                                    ))}
                                    
                                    {/* Add Task Row */}
                                    <div className="sv-add-task-row">
                                        <Plus size={14} /> <span>New Task</span>
                                    </div>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </main>

            <TaskDetailModal 
                isOpen={!!selectedTask}
                onClose={() => setSelectedTask(null)}
                task={selectedTask}
            />
        </div>
    );
}
