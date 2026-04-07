import { useState } from 'react';
import {
    CheckCircle2, Calendar, Flag, ChevronDown, ChevronRight,
    Plus, Search, LayoutList, Filter, Star, MoreHorizontal,
    MessageSquare, Clock
} from 'lucide-react';
import { Avatar } from 'antd';
import TaskDetailModal from '../../components/TaskDetailModal';
import type { MyTaskRow } from '../../types/myTasks';
import groupByDate from './component/groupByDate';

type TabType = 'assigned' | 'mentions' | 'created';

const allTasks: MyTaskRow[] = [
    {
        task_id: 101,
        space_id: 1,
        parent_task_id: null,
        name: 'Finalize Q1 Marketing Roadmap',
        description: 'Draft due by end of day for the stakeholder meeting.',
        status: 'IN PROGRESS',
        statusColor: '#0058be',
        priority: 'Urgent',
        priorityColor: '#e74c3c',
        due_date: 'Today',
        comment_count: 3,
        assignees: ['AR'],
        space_name: 'Marketing',
        space_color: '#e84393',
    },
    {
        task_id: 102,
        space_id: 2,
        parent_task_id: null,
        name: 'Review UI Components Documentation',
        description: 'Coordinate with the Design Space to align on tokens.',
        status: 'TO DO',
        statusColor: '#5f6368',
        priority: 'High',
        priorityColor: '#f0a220',
        due_date: 'Today',
        comment_count: 1,
        assignees: ['AR', 'MC'],
        space_name: 'Design',
        space_color: '#00b894',
    },
    {
        task_id: 103,
        space_id: 3,
        parent_task_id: null,
        name: 'Setup CI/CD Pipeline',
        description: null,
        status: 'IN PROGRESS',
        statusColor: '#0058be',
        priority: 'High',
        priorityColor: '#f0a220',
        due_date: 'Wed, Oct 25',
        comment_count: 0,
        assignees: ['AR'],
        space_name: 'Development',
        space_color: '#0984e3',
    },
    {
        task_id: 104,
        space_id: 1,
        parent_task_id: null,
        name: 'Review Brand Identity v2',
        description: null,
        status: 'TO DO',
        statusColor: '#5f6368',
        priority: 'Normal',
        priorityColor: '#00b894',
        due_date: 'Thu, Oct 26',
        comment_count: 2,
        assignees: ['AR', 'SJ'],
        space_name: 'Marketing',
        space_color: '#e84393',
    },
    {
        task_id: 105,
        space_id: 3,
        parent_task_id: null,
        name: 'Security Audit Report Q4',
        description: null,
        status: 'IN PROGRESS',
        statusColor: '#0058be',
        priority: 'Urgent',
        priorityColor: '#e74c3c',
        due_date: 'Fri, Oct 27',
        comment_count: 1,
        assignees: ['AR'],
        space_name: 'Development',
        space_color: '#0984e3',
    },
    {
        task_id: 106,
        space_id: 3,
        parent_task_id: null,
        name: 'Multi-currency Payment Support',
        description: null,
        status: 'TO DO',
        statusColor: '#5f6368',
        priority: 'Normal',
        priorityColor: '#00b894',
        due_date: 'Mon, Oct 30',
        comment_count: 0,
        assignees: ['AR', 'ER'],
        space_name: 'Development',
        space_color: '#0984e3',
    },
    {
        task_id: 107,
        space_id: 3,
        parent_task_id: null,
        name: 'Database Indexing for Reports',
        description: null,
        status: 'TO DO',
        statusColor: '#5f6368',
        priority: 'Normal',
        priorityColor: '#00b894',
        due_date: 'Tue, Oct 31',
        comment_count: 0,
        assignees: ['AR'],
        space_name: 'Development',
        space_color: '#0984e3',
    },
    {
        task_id: 108,
        space_id: 3,
        parent_task_id: null,
        name: 'SSO Integration with Azure AD',
        description: null,
        status: 'COMPLETE',
        statusColor: '#27ae60',
        priority: 'High',
        priorityColor: '#f0a220',
        due_date: 'Oct 18',
        comment_count: 4,
        assignees: ['AR'],
        space_name: 'Development',
        space_color: '#0984e3',
    },
    {
        task_id: 109,
        space_id: 2,
        parent_task_id: null,
        name: 'Dark Mode Interface Alpha',
        description: null,
        status: 'COMPLETE',
        statusColor: '#27ae60',
        priority: 'Normal',
        priorityColor: '#00b894',
        due_date: 'Oct 21',
        comment_count: 2,
        assignees: ['AR', 'ER'],
        space_name: 'Design',
        space_color: '#00b894',
    },
];

const avatarColors: Record<string, string> = {
    AR: '#4285F4', MC: '#7c5cfc', SJ: '#0058be', ER: '#e84393'
};

export default function MyTasksPage() {
    const [activeTab, setActiveTab] = useState<TabType>('assigned');
    const [selectedTask, setSelectedTask] = useState<MyTaskRow | null>(null);
    const [expandedGroups, setExpandedGroups] = useState<Record<string, boolean>>({ '📌 Today': true, '📅 This Week': true, '📆 Next Week': true, '📋 No date': true, '✅ Completed': false });
    const [searchText, setSearchText] = useState('');
    const [showCompleted, setShowCompleted] = useState(true);

    const filteredTasks = allTasks.filter((t) => {
        if (t.parent_task_id !== null) return false;
        if (!showCompleted && t.status === 'COMPLETE') return false;
        if (searchText && !t.name.toLowerCase().includes(searchText.toLowerCase())) return false;
        return true;
    });

    const taskGroups = groupByDate(filteredTasks);

    const toggleGroup = (label: string) => {
        setExpandedGroups(prev => ({ ...prev, [label]: !prev[label] }));
    };

    const totalActive = allTasks.filter(t => t.status !== 'COMPLETE').length;
    const totalOverdue = allTasks.filter(
        (t) => t.parent_task_id === null && t.due_date === 'Today' && t.status !== 'COMPLETE',
    ).length;

    return (
        <div className="flex h-full flex-col overflow-hidden bg-white font-['Plus_Jakarta_Sans','Inter',sans-serif]">
            {/* ═══════ HEADER ═══════ */}
            <header className="shrink-0 border-b border-[#eef0f5] bg-white">
                <div className="flex items-center justify-between px-6 pb-2 pt-3.5">
                    <div className="flex items-center gap-3.5">
                        <h1 className="m-0 text-lg font-extrabold text-[#141b2b]">My Tasks</h1>
                        <div className="flex items-center gap-1.5">
                            <span className="text-xs font-semibold text-[#9aa0a6]"><span className="font-extrabold text-[#5f6368]">{totalActive}</span> active</span>
                            <span className="text-[#dcdfe4]">·</span>
                            <span className="text-xs font-semibold text-[#9aa0a6]"><span className="font-extrabold text-[#e74c3c]">{totalOverdue}</span> due today</span>
                        </div>
                    </div>
                    <div className="flex items-center gap-1.5">
                        <button className="flex cursor-pointer items-center gap-1.5 rounded-md border border-[#eef0f5] bg-transparent px-3 py-1.25 text-xs font-semibold text-[#5f6368] transition-all duration-150 hover:border-[#dcdfe4] hover:bg-[#f8fafc]"><Star size={14} /> Favorites</button>
                        <button className="flex cursor-pointer items-center gap-1.5 rounded-md border border-[#0058be] bg-[#0058be] px-3 py-1.25 text-xs font-semibold text-white transition-colors duration-150 hover:bg-[#004aab]"><Plus size={14} /> Add Task</button>
                    </div>
                </div>
                <div className="flex gap-1 px-6">
                    <button className={`flex items-center gap-1.25 whitespace-nowrap border-x-0 border-b-2 border-t-0 border-solid px-3 py-2 text-[13px] font-semibold transition-all duration-150 ${activeTab === 'assigned' ? 'border-b-[#0058be] text-[#0058be]' : 'border-b-transparent text-[#5f6368] hover:text-[#141b2b]'
                        }`}
                        onClick={() => setActiveTab('assigned')}>
                        <CheckCircle2 size={14} /> Assigned to me <span className={`rounded-lg px-1.5 py-px text-[10px] font-extrabold ${activeTab === 'assigned' ? 'bg-[#0058be20] text-[#0058be]' : 'bg-[#eef0f5] text-[#5f6368]'}`}>{totalActive}</span>
                    </button>
                    <button className={`flex items-center gap-1.25 whitespace-nowrap border-x-0 border-b-2 border-t-0 border-solid px-3 py-2 text-[13px] font-semibold transition-all duration-150 ${activeTab === 'mentions' ? 'border-b-[#0058be] text-[#0058be]' : 'border-b-transparent text-[#5f6368] hover:text-[#141b2b]'
                        }`}
                        onClick={() => setActiveTab('mentions')}>
                        <MessageSquare size={14} /> Mentions <span className={`rounded-lg px-1.5 py-px text-[10px] font-extrabold ${activeTab === 'mentions' ? 'bg-[#0058be20] text-[#0058be]' : 'bg-[#eef0f5] text-[#5f6368]'}`}>2</span>
                    </button>
                    <button className={`flex items-center gap-1.25 whitespace-nowrap border-x-0 border-b-2 border-t-0 border-solid px-3 py-2 text-[13px] font-semibold transition-all duration-150 ${activeTab === 'created' ? 'border-b-[#0058be] text-[#0058be]' : 'border-b-transparent text-[#5f6368] hover:text-[#141b2b]'
                        }`}
                        onClick={() => setActiveTab('created')}>
                        <Clock size={14} /> Created by me
                    </button>
                </div>
            </header>

            {/* ═══════ TOOLBAR ═══════ */}
            <div className="flex shrink-0 items-center justify-between border-b border-[#eef0f5] px-6 py-2">
                <div className="flex items-center gap-2">
                    <div className="flex min-w-50 items-center gap-1.5 rounded-md border border-[#eef0f5] bg-[#f8fafb] px-2.5 py-1">
                        <Search size={14} className="shrink-0 text-[#9aa0a6]" />
                        <input className="flex-1 border-none bg-transparent text-xs text-[#141b2b] outline-none" placeholder="Search tasks..." value={searchText} onChange={e => setSearchText(e.target.value)} />
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    <button className="flex cursor-pointer items-center gap-1 rounded-md border-none bg-transparent px-2 py-1 text-xs font-semibold whitespace-nowrap text-[#5f6368] hover:bg-[#f0f4ff] hover:text-[#0058be]"><Filter size={13} /> Filter</button>
                    <button className="flex cursor-pointer items-center gap-1 rounded-md border-none bg-transparent px-2 py-1 text-xs font-semibold whitespace-nowrap text-[#5f6368] hover:bg-[#f0f4ff] hover:text-[#0058be]" onClick={() => setShowCompleted(!showCompleted)}>
                        {showCompleted ? <CheckCircle2 size={13} /> : null} Completed
                    </button>
                    <button className="flex cursor-pointer items-center gap-1 rounded-md border-none bg-transparent px-2 py-1 text-xs font-semibold whitespace-nowrap text-[#5f6368] hover:bg-[#f0f4ff] hover:text-[#0058be]"><LayoutList size={13} /></button>
                </div>
            </div>

            {/* ═══════ TASK LIST ═══════ */}
            <div className="flex-1 overflow-y-auto px-6 pb-6 pt-3">
                {taskGroups.map(group => (
                    <div key={group.label} className="mb-5">
                        <div className="mb-1.5 flex cursor-pointer items-center gap-1.5 py-1" onClick={() => toggleGroup(group.label)}>
                            <button className="flex cursor-pointer items-center rounded border-none bg-transparent p-0.5 text-[#5f6368] hover:bg-[#eef0f5]">
                                {expandedGroups[group.label] ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
                            </button>
                            <span className="text-[13px] font-extrabold text-[#141b2b]">{group.label}</span>
                            <span className="rounded-lg bg-[#f0f2f5] px-1.5 py-px text-[11px] font-bold text-[#9aa0a6]">{group.tasks.length}</span>
                            <div className="ml-2 h-px flex-1 bg-[#eef0f5]" />
                        </div>

                        {expandedGroups[group.label] && (
                            <div className="flex flex-col">
                                {group.tasks.map(task => (
                                    <div key={task.task_id} className="group flex cursor-pointer items-center rounded-md border-b border-[#f5f7fa] px-2 py-2 transition-colors duration-100 hover:bg-[#f8fafb]" onClick={() => setSelectedTask(task)}>
                                        <div className="flex w-8 shrink-0 justify-center">
                                            <CheckCircle2
                                                size={16}
                                                className={`${task.status === 'COMPLETE' ? 'text-[#27ae60]' : 'text-[#dcdfe4] transition-colors duration-150 group-hover:text-[#b0b5c1]'}`}
                                                style={task.status === 'COMPLETE' ? { color: '#27ae60' } : undefined}
                                            />
                                        </div>
                                        <div className="flex min-w-0 flex-1 flex-col gap-1">
                                            <span className={`text-[13px] font-semibold ${task.status === 'COMPLETE' ? 'text-[#9aa0a6] line-through' : 'text-[#141b2b]'}`}>
                                                {task.name}
                                            </span>
                                            <div className="flex items-center gap-1.5">
                                                <span className="rounded px-1.5 py-px text-[10px] font-bold tracking-[0.04em]" style={{ backgroundColor: task.space_color + '18', color: task.space_color }}>
                                                    {task.space_name}
                                                </span>
                                                {task.comment_count > 0 && (
                                                    <span className="flex items-center gap-0.75 text-[11px] text-[#9aa0a6]"><MessageSquare size={11} /> {task.comment_count}</span>
                                                )}
                                            </div>
                                        </div>
                                        <div className="w-25 shrink-0 text-center">
                                            <span className="inline-block rounded px-2 py-0.5 text-[10px] font-extrabold tracking-[0.03em] text-white" style={{ backgroundColor: task.statusColor }}>
                                                {task.status}
                                            </span>
                                        </div>
                                        <div className="w-30 shrink-0">
                                            {task.due_date && (
                                                <span className={`flex items-center gap-1 text-xs font-medium ${task.due_date === 'Today' ? 'font-bold text-[#e74c3c]' : 'text-[#5f6368]'}`}>
                                                    <Calendar size={11} /> {task.due_date}
                                                </span>
                                            )}
                                        </div>
                                        <div className="w-10 shrink-0 text-center">
                                            {task.priority !== 'Normal' && (
                                                <span className="flex items-center justify-center" style={{ color: task.priorityColor }}>
                                                    <Flag size={11} fill={task.priorityColor} />
                                                </span>
                                            )}
                                        </div>
                                        <div className="flex w-15 shrink-0 items-center justify-end">
                                            {task.assignees.map(a => (
                                                <Avatar key={a} size={22} style={{ backgroundColor: avatarColors[a], fontSize: '9px', fontWeight: 'bold', marginLeft: '-4px' }}>{a}</Avatar>
                                            ))}
                                        </div>
                                        <div className="flex w-8 shrink-0 justify-center">
                                            <MoreHorizontal size={14} className="opacity-0 transition-opacity duration-150 group-hover:opacity-100 text-[#dcdfe4]" />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                ))}
            </div>

            <TaskDetailModal
                isOpen={!!selectedTask}
                onClose={() => setSelectedTask(null)}
                task={selectedTask}
                allTasks={allTasks}
            />
        </div>
    );
}
