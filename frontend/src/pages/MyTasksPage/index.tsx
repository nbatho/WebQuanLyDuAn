import { useState, useRef, type DragEvent } from 'react';
import {
    Plus, MoreHorizontal,
    Calendar, MessageCircle, Bell, HelpCircle, Share2
} from 'lucide-react';
import TaskDetailModal from '../../components/TaskDetailModal';
import './my-tasks.css';

/* ── Types ── */
interface Task {
    id: string;
    title: string;
    tag: string;
    tagColor: string;
    date?: string;
    comments?: number;
    assignees: string[];
    progress?: number;
    progressColor?: string;
}

type ColumnId = 'todo' | 'inprogress' | 'review' | 'done';

interface Column {
    id: ColumnId;
    title: string;
    color: string;
}

const columns: Column[] = [
    { id: 'todo', title: 'TO DO', color: '#5f6368' },
    { id: 'inprogress', title: 'IN PROGRESS', color: '#0058be' },
    { id: 'review', title: 'REVIEW', color: '#f0a220' },
    { id: 'done', title: 'DONE', color: '#27ae60' },
];

const initialTasks: Record<ColumnId, Task[]> = {
    todo: [
        {
            id: 't1',
            title: 'Refactor Authentication Middleware',
            tag: 'URGENT',
            tagColor: '#e74c3c',
            date: 'Oct 24',
            comments: 3,
            assignees: ['AR'],
            progress: 40,
            progressColor: '#f0a220',
        },
        {
            id: 't2',
            title: 'Multi-currency Payment Support',
            tag: 'FEATURE',
            tagColor: '#0058be',
            date: 'Oct 30',
            comments: undefined,
            assignees: ['ER'],
            progress: 20,
            progressColor: '#0058be',
        },
        {
            id: 't3',
            title: 'Update API Rate Limiting Config',
            tag: 'OPTIMIZATION',
            tagColor: '#27ae60',
            date: 'Nov 2',
            comments: 1,
            assignees: ['MC'],
            progress: undefined,
        },
        {
            id: 't4',
            title: 'Write Integration Tests for Auth',
            tag: 'TESTING',
            tagColor: '#7c5cfc',
            date: 'Nov 5',
            comments: undefined,
            assignees: ['SJ'],
            progress: undefined,
        },
    ],
    inprogress: [
        {
            id: 't5',
            title: 'Setup CI/CD Pipeline',
            tag: 'OPTIMIZATION',
            tagColor: '#27ae60',
            date: undefined,
            comments: undefined,
            assignees: ['AR', 'MC'],
            progress: 65,
            progressColor: '#27ae60',
        },
        {
            id: 't6',
            title: 'Database Indexing for Reports',
            tag: 'OPTIMIZATION',
            tagColor: '#27ae60',
            date: 'Oct 28',
            comments: undefined,
            assignees: ['SJ'],
            progress: 45,
            progressColor: '#0058be',
        },
    ],
    review: [
        {
            id: 't7',
            title: 'Dark Mode Interface Alpha',
            tag: 'FEATURE',
            tagColor: '#0058be',
            date: undefined,
            comments: 2,
            assignees: ['ER'],
            progress: 90,
            progressColor: '#0058be',
        },
        {
            id: 't8',
            title: 'Mobile Responsive Dashboard',
            tag: 'FEATURE',
            tagColor: '#0058be',
            date: 'Oct 22',
            comments: 5,
            assignees: ['AR', 'ER'],
            progress: 80,
            progressColor: '#7c5cfc',
        },
        {
            id: 't9',
            title: 'Security Audit Report Q4',
            tag: 'URGENT',
            tagColor: '#e74c3c',
            date: 'Oct 26',
            comments: 1,
            assignees: ['MC'],
            progress: 95,
            progressColor: '#27ae60',
        },
    ],
    done: [
        {
            id: 't10',
            title: 'SSO Integration with Azure AD',
            tag: 'FEATURE',
            tagColor: '#0058be',
            date: 'Oct 18',
            comments: 4,
            assignees: ['AR'],
            progress: 100,
            progressColor: '#27ae60',
        },
    ],
};

const avatarColors: Record<string, string> = {
    AR: '#4285F4',
    MC: '#7c5cfc',
    SJ: '#0058be',
    ER: '#e84393',
};



export default function MyTasksPage() {
    const [tasksByCol, setTasksByCol] = useState(initialTasks);
    const dragItem = useRef<{ colId: ColumnId; taskId: string } | null>(null);
    const [dragOverCol, setDragOverCol] = useState<ColumnId | null>(null);
    const [selectedTask, setSelectedTask] = useState<Task | null>(null);

    const onDragStart = (e: DragEvent, colId: ColumnId, taskId: string) => {
        dragItem.current = { colId, taskId };
        e.dataTransfer.effectAllowed = 'move';
        // Make drag image slightly transparent
        const el = e.currentTarget as HTMLElement;
        el.style.opacity = '0.5';
    };

    const onDragEnd = (e: DragEvent) => {
        const el = e.currentTarget as HTMLElement;
        el.style.opacity = '1';
        setDragOverCol(null);
    };

    const onDragOver = (e: DragEvent, colId: ColumnId) => {
        e.preventDefault();
        e.dataTransfer.dropEffect = 'move';
        setDragOverCol(colId);
    };

    const onDragLeave = () => {
        setDragOverCol(null);
    };

    const onDrop = (e: DragEvent, targetColId: ColumnId) => {
        e.preventDefault();
        setDragOverCol(null);
        if (!dragItem.current) return;
        const { colId: srcCol, taskId } = dragItem.current;
        if (srcCol === targetColId) return;

        setTasksByCol((prev) => {
            const srcTasks = [...prev[srcCol]];
            const idx = srcTasks.findIndex((t) => t.id === taskId);
            if (idx === -1) return prev;
            const [task] = srcTasks.splice(idx, 1);
            const destTasks = [...prev[targetColId], task];
            return { ...prev, [srcCol]: srcTasks, [targetColId]: destTasks };
        });
        dragItem.current = null;
    };

    return (
        <div className="kt-page">
            {/* ═══════ Main ═══════ */}
            <main className="kt-main">
                {/* Top bar */}
                <header className="kt-topbar">
                    <div className="kt-breadcrumb">
                        <span>Spaces</span><span className="kt-bc-sep">›</span>
                        <span>MainSpace</span><span className="kt-bc-sep">›</span>
                        <strong>Product Roadmap Q4</strong>
                    </div>
                    <div className="kt-topbar-right">
                        <div className="kt-view-tabs">
                            <button className="kt-view-tab">List</button>
                            <button className="kt-view-tab kt-view-tab--active">Kanban</button>
                            <button className="kt-view-tab">Calendar</button>
                        </div>
                        <button className="kt-topbar-icon"><Bell size={18} /></button>
                        <button className="kt-topbar-icon"><HelpCircle size={18} /></button>
                        <img
                            src="https://ui-avatars.com/api/?name=John+Doe&background=1a1a2e&color=fff&size=32&bold=true"
                            alt="" className="kt-topbar-avatar"
                        />
                    </div>
                </header>

                {/* Title Row */}
                <div className="kt-title-row">
                    <div>
                        <h1 className="kt-title">Product Roadmap Q4</h1>
                        <p className="kt-subtitle">Coordinate the final engineering push for the yearly release cycle.</p>
                    </div>
                    <div className="kt-title-right">
                        <div className="kt-member-avatars">
                            {['AR', 'MC', 'SJ'].map((n) => (
                                <img
                                    key={n}
                                    src={`https://ui-avatars.com/api/?name=${n}&background=${avatarColors[n]?.replace('#', '')}&color=fff&size=28&bold=true`}
                                    alt="" className="kt-member-av"
                                />
                            ))}
                            <span className="kt-member-more">+12</span>
                        </div>
                        <button className="kt-share-btn">
                            <Share2 size={14} /><span>Share</span>
                        </button>
                    </div>
                </div>

                {/* ═══════ Kanban Board ═══════ */}
                <div className="kt-board">
                    {columns.map((col) => (
                        <div
                            key={col.id}
                            className={`kt-column ${dragOverCol === col.id ? 'kt-column--dragover' : ''}`}
                            onDragOver={(e) => onDragOver(e, col.id)}
                            onDragLeave={onDragLeave}
                            onDrop={(e) => onDrop(e, col.id)}
                        >
                            <div className="kt-col-header">
                                <span className="kt-col-title">{col.title}</span>
                                <span className="kt-col-count" style={{ backgroundColor: col.color + '20', color: col.color }}>
                                    {tasksByCol[col.id].length}
                                </span>
                                <Plus size={16} className="kt-col-add" />
                            </div>

                            <div className="kt-col-cards">
                                {tasksByCol[col.id].map((task) => (
                                    <div
                                        key={task.id}
                                        className="kt-card"
                                        draggable
                                        onDragStart={(e) => onDragStart(e, col.id, task.id)}
                                        onDragEnd={onDragEnd}
                                        onClick={() => setSelectedTask(task)}
                                    >
                                        <div className="kt-card-top">
                                            <span className="kt-card-tag" style={{ backgroundColor: task.tagColor + '18', color: task.tagColor }}>
                                                {task.tag}
                                            </span>
                                            <MoreHorizontal size={16} className="kt-card-menu" />
                                        </div>
                                        <h4 className="kt-card-title">{task.title}</h4>
                                        <div className="kt-card-meta">
                                            {task.date && (
                                                <span className="kt-card-date">
                                                    <Calendar size={12} />{task.date}
                                                </span>
                                            )}
                                            {task.comments && (
                                                <span className="kt-card-comments">
                                                    <MessageCircle size={12} />{task.comments}
                                                </span>
                                            )}
                                        </div>
                                        <div className="kt-card-bottom">
                                            <div className="kt-card-assignees">
                                                {task.assignees.map((a) => (
                                                    <img
                                                        key={a}
                                                        src={`https://ui-avatars.com/api/?name=${a}&background=${(avatarColors[a] || '#5f6368').replace('#', '')}&color=fff&size=24&bold=true`}
                                                        alt="" className="kt-card-av"
                                                    />
                                                ))}
                                            </div>
                                            {task.progress !== undefined && (
                                                <div className="kt-card-progress-bg">
                                                    <div
                                                        className="kt-card-progress-fill"
                                                        style={{ width: `${task.progress}%`, backgroundColor: task.progressColor || '#0058be' }}
                                                    />
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
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
