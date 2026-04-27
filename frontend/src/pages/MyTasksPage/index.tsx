import { useEffect, useMemo, useState } from 'react';
import {
    CheckCircle2, Calendar, Flag, ChevronDown, ChevronRight,
    Plus, Search, LayoutList, Filter, Star, MoreHorizontal,
    MessageSquare, Clock
} from 'lucide-react';
import { Avatar } from 'antd';
import { useDispatch, useSelector } from 'react-redux';
import TaskDetailModal from '../../components/TaskDetailModal';
import groupByDate from './component/groupByDate';
import type { AppDispatch, RootState } from '@/store/configureStore';
import type { TaskWithSpaceData } from '@/store/modules/tasks';
import type { Task } from '@/types/tasks';
type TabType = 'assigned' | 'mentions' | 'created';
const DEFAULT_STATUS = { name: 'TO DO', color: '#5f6368' };
const DEFAULT_PRIORITY = { name: 'Normal', color: '#00b894' };

function getInitials(name: string): string {
    const parts = name.trim().split(/\s+/).filter(Boolean);
    if (parts.length === 0) return 'NA';
    if (parts.length === 1) return parts[0]!.slice(0, 2).toUpperCase();
    return `${parts[0]![0]}${parts[1]![0]}`.toUpperCase();
}

function isCompletedTask(task: TaskWithSpaceData): boolean {
    return (task.status_name ?? '').toUpperCase() === 'COMPLETE' || !!task.completed_at;
}

function isDueToday(rawDueDate: string | null): boolean {
    if (!rawDueDate) return false;
    const parsed = new Date(rawDueDate);
    if (Number.isNaN(parsed.getTime())) return rawDueDate === 'Today';

    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const due = new Date(parsed.getFullYear(), parsed.getMonth(), parsed.getDate());
    return due.getTime() === today.getTime();
}

function toTaskForModal(task: TaskWithSpaceData): Task {
    return {
        task_id: task.task_id,
        space_id: task.space_id,
        parent_task_id: task.parent_task_id,
        name: task.name,
        description: task.description,
        status: task.status_name ?? DEFAULT_STATUS.name,
        statusColor: task.status_color ?? DEFAULT_STATUS.color,
        priority: task.priority_name ?? DEFAULT_PRIORITY.name,
        priorityColor: task.priority_color ?? DEFAULT_PRIORITY.color,
        due_date: task.due_date,
        comment_count: 0,
        assignees: (task.assignees ?? []).map((a) => getInitials(a.name)),
    };
}

const avatarColors: Record<string, string> = {
    AR: '#4285F4', MC: '#7c5cfc', SJ: '#0058be', ER: '#e84393'
};

function toHumanDueLabel(rawDueDate: string | null): string | null {
    if (!rawDueDate) return null;
    if (rawDueDate === 'Today') return 'Today';

    const parsed = new Date(rawDueDate);
    if (Number.isNaN(parsed.getTime())) return rawDueDate;

    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const due = new Date(parsed.getFullYear(), parsed.getMonth(), parsed.getDate());
    const diffDays = Math.round((due.getTime() - today.getTime()) / (24 * 60 * 60 * 1000));

    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Tomorrow';

    return due.toLocaleDateString('en-US', {
        weekday: 'short',
        month: 'short',
        day: 'numeric',
    });
}
export default function MyTasksPage() {
    const dispatch = useDispatch<AppDispatch>();
    const listSpaces = useSelector((state: RootState) => state.spaces.listSpaces);
    const { listTask, isLoadingTasks } = useSelector((state: RootState) => state.tasks);
    const [activeTab, setActiveTab] = useState<TabType>('assigned');
    const [selectedTask, setSelectedTask] = useState<TaskWithSpaceData | null>(null);
    const [expandedGroups, setExpandedGroups] = useState<Record<string, boolean>>({ '📌 Today': true, '📅 This Week': true, '📆 Next Week': true, '📋 No date': true, '✅ Completed': false });
    const [searchText, setSearchText] = useState('');
    const [showCompleted, setShowCompleted] = useState(true);
    const [activeSpaceId, setActiveSpaceId] = useState<number | null>(null);
    useEffect(() => {
        if (listSpaces.length > 0 && activeSpaceId == null) {
            setActiveSpaceId(listSpaces[0]!.spaceId);
        }
    }, [listSpaces, activeSpaceId]);


    const allTasks = useMemo<TaskWithSpaceData[]>(() => listTask, [listTask]);

    const filteredTasks = allTasks.filter((t) => {
        if (t.parent_task_id !== null) return false;
        if (!showCompleted && isCompletedTask(t)) return false;
        if (searchText && !t.name.toLowerCase().includes(searchText.toLowerCase())) return false;
        return true;
    });

    const taskGroups = groupByDate(filteredTasks);

    const toggleGroup = (label: string) => {
        setExpandedGroups(prev => ({ ...prev, [label]: !prev[label] }));
    };

    const totalActive = allTasks.filter((t) => !isCompletedTask(t)).length;
    const totalOverdue = allTasks.filter(
        (t) => t.parent_task_id === null && isDueToday(t.due_date) && !isCompletedTask(t),
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
                        <select
                            className="rounded-md border border-[#eef0f5] bg-white px-2 py-1 text-xs font-semibold text-[#5f6368]"
                            value={activeSpaceId ?? ''}
                            onChange={(e) => setActiveSpaceId(Number(e.target.value))}
                            disabled={listSpaces.length === 0}
                        >
                            {listSpaces.length === 0 ? <option value="">No space</option> : null}
                            {listSpaces.map((space) => (
                                <option key={space.spaceId} value={space.spaceId}>
                                    {space.name}
                                </option>
                            ))}
                        </select>
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
                {isLoadingTasks ? (
                    <div className="px-2 py-6 text-sm font-medium text-[#9aa0a6]">Loading tasks...</div>
                ) : null}

                {!isLoadingTasks && taskGroups.length === 0 ? (
                    <div className="px-2 py-6 text-sm font-medium text-[#9aa0a6]">No tasks found for this space.</div>
                ) : null}

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
                                                className={`${isCompletedTask(task) ? 'text-[#27ae60]' : 'text-[#dcdfe4] transition-colors duration-150 group-hover:text-[#b0b5c1]'}`}
                                                style={isCompletedTask(task) ? { color: '#27ae60' } : undefined}
                                            />
                                        </div>
                                        <div className="flex min-w-0 flex-1 flex-col gap-1">
                                            <span className={`text-[13px] font-semibold ${isCompletedTask(task) ? 'text-[#9aa0a6] line-through' : 'text-[#141b2b]'}`}>
                                                {task.name}
                                            </span>
                                            <div className="flex items-center gap-1.5">
                                                <span className="rounded px-1.5 py-px text-[10px] font-bold tracking-[0.04em]" style={{ backgroundColor: task.space_color + '18', color: task.space_color }}>
                                                    {task.space_name}
                                                </span>
                                            </div>
                                        </div>
                                        <div className="w-25 shrink-0 text-center">
                                            <span className="inline-block rounded px-2 py-0.5 text-[10px] font-extrabold tracking-[0.03em] text-white" style={{ backgroundColor: task.status_color ?? DEFAULT_STATUS.color }}>
                                                {task.status_name ?? DEFAULT_STATUS.name}
                                            </span>
                                        </div>
                                        <div className="w-30 shrink-0">
                                            {task.due_date && (
                                                <span className={`flex items-center gap-1 text-xs font-medium ${isDueToday(task.due_date) ? 'font-bold text-[#e74c3c]' : 'text-[#5f6368]'}`}>
                                                    <Calendar size={11} /> {toHumanDueLabel(task.due_date)}
                                                </span>
                                            )}
                                        </div>
                                        <div className="w-10 shrink-0 text-center">
                                            {(task.priority_name ?? DEFAULT_PRIORITY.name).toUpperCase() !== 'NORMAL' && (
                                                <span className="flex items-center justify-center" style={{ color: task.priority_color ?? DEFAULT_PRIORITY.color }}>
                                                    <Flag size={11} fill={task.priority_color ?? DEFAULT_PRIORITY.color} />
                                                </span>
                                            )}
                                        </div>
                                        <div className="flex w-15 shrink-0 items-center justify-end">
                                            {task.assignees.map((a) => {
                                                const initials = getInitials(a.name);
                                                return (
                                                    <Avatar key={a.user_id} size={22} style={{ backgroundColor: avatarColors[initials] ?? '#9aa0a6', fontSize: '9px', fontWeight: 'bold', marginLeft: '-4px' }}>{initials}</Avatar>
                                                );
                                            })}
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
                task={selectedTask ? toTaskForModal(selectedTask) : null}
                allTasks={allTasks.map(toTaskForModal)}
            />
        </div>
    );
}
