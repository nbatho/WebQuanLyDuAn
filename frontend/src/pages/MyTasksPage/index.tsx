import { useEffect, useMemo, useState } from 'react';
import {
    CheckCircle2, Calendar, ChevronDown, ChevronRight,
    Plus, Search
} from 'lucide-react';
import { Avatar } from 'antd';
import { useDispatch, useSelector } from 'react-redux';
import TaskDetailModal from '../../components/TaskDetailModal';
import groupByDate from './component/groupByDate';
import type { AppDispatch, RootState } from '@/store/configureStore';
import type { TaskWithSpaceData } from '@/store/modules/tasks';
import type { Task } from '@/types/tasks';

// Giả sử bạn có action cập nhật task từ store
// import { fetchUpdateTask } from '@/store/modules/tasks';

type TabType = 'assigned' | 'mentions' | 'created';
const DEFAULT_STATUS = { name: 'TO DO', color: '#5f6368' };
const DEFAULT_PRIORITY = { name: 'Normal', color: '#00b894' };

const avatarColors: Record<string, string> = {
    AR: '#4285F4', MC: '#7c5cfc', SJ: '#0058be', ER: '#e84393'
};

/** --- HELPERS --- **/
function getInitials(name: string): string {
    const parts = name?.trim().split(/\s+/).filter(Boolean) || [];
    if (parts.length === 0) return 'NA';
    if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
    return `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase();
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
    return due.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
}

// Chuyển đổi dữ liệu sang format Modal yêu cầu
function toTaskForModal(task: TaskWithSpaceData): Task {
    return {
        task_id: task.task_id,
        space_id: task.space_id,
        parent_task_id: task.parent_task_id,
        name: task.name,
        description: task.description || '',
        status: task.status_name ?? DEFAULT_STATUS.name,
        statusColor: task.status_color ?? DEFAULT_STATUS.color,
        priority_name: task.priority_name ?? DEFAULT_PRIORITY.name,
        priority_color: task.priority_color ?? DEFAULT_PRIORITY.color,
        due_date: task.due_date,
        comment_count: 0,
        assignees: task.assignees || [], // Giữ nguyên object để Sidebar xử lý được logic chọn người
    };
}

/** --- MAIN COMPONENT --- **/
export default function MyTasksPage() {
    const dispatch = useDispatch<AppDispatch>();
    const listSpaces = useSelector((state: RootState) => state.spaces.listSpaces);
    const { listTask, isLoadingTasks } = useSelector((state: RootState) => state.tasks);

    const [activeTab, setActiveTab] = useState<TabType>('assigned');
    const [selectedTask, setSelectedTask] = useState<TaskWithSpaceData | null>(null);
    const [expandedGroups, setExpandedGroups] = useState<Record<string, boolean>>({
        '📌 Today': true, '📅 This Week': true, '📆 Next Week': true, '📋 No date': true, '✅ Completed': false
    });
    const [searchText, setSearchText] = useState('');
    const [showCompleted, setShowCompleted] = useState(true);
    const [activeSpaceId, setActiveSpaceId] = useState<number | null>(null);

    useEffect(() => {
        if (listSpaces.length > 0 && activeSpaceId == null) {
            setActiveSpaceId(listSpaces[0].spaceId);
        }
    }, [listSpaces, activeSpaceId]);

    const filteredTasks = useMemo(() => {
        return listTask.filter((t) => {
            if (t.parent_task_id !== null) return false;
            if (!showCompleted && isCompletedTask(t)) return false;
            if (searchText && !t.name.toLowerCase().includes(searchText.toLowerCase())) return false;
            return true;
        });
    }, [listTask, showCompleted, searchText]);

    const taskGroups = useMemo(() => groupByDate(filteredTasks), [filteredTasks]);

    const toggleGroup = (label: string) => {
        setExpandedGroups(prev => ({ ...prev, [label]: !prev[label] }));
    };

    // Hàm cập nhật Task truyền xuống Modal
    const handleUpdateTask = (taskId: number, updates: Partial<Task>) => {
        console.log("Dispatching update for task:", taskId, updates);
        // dispatch(fetchUpdateTask({ taskId, updates }));

        // Cập nhật state cục bộ để UI phản hồi nhanh
        if (selectedTask?.task_id === taskId) {
            setSelectedTask(prev => prev ? { ...prev, ...updates } : null);
        }
    };

    const totalActive = listTask.filter((t) => !isCompletedTask(t)).length;
    const totalOverdue = listTask.filter(
        (t) => t.parent_task_id === null && isDueToday(t.due_date) && !isCompletedTask(t)
    ).length;

    return (
        <div className="flex h-full flex-col overflow-hidden bg-white font-sans">
            {/* HEADER */}
            <header className="shrink-0 border-b border-[#eef0f5] bg-white">
                <div className="flex items-center justify-between px-6 pb-2 pt-3.5">
                    <div className="flex items-center gap-3.5">
                        <h1 className="m-0 text-lg font-extrabold text-[#141b2b]">My Tasks</h1>
                        <div className="flex items-center gap-1.5 text-xs font-semibold text-[#9aa0a6]">
                            <span><b className="text-[#5f6368]">{totalActive}</b> active</span>
                            <span className="text-[#dcdfe4]">·</span>
                            <span><b className="text-[#e74c3c]">{totalOverdue}</b> due today</span>
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        <select
                            className="rounded-md border border-[#eef0f5] bg-white px-2 py-1 text-xs font-semibold text-[#5f6368] outline-none"
                            value={activeSpaceId ?? ''}
                            onChange={(e) => setActiveSpaceId(Number(e.target.value))}
                        >
                            {listSpaces.map((space) => (
                                <option key={space.spaceId} value={space.spaceId}>{space.name}</option>
                            ))}
                        </select>
                        <button className="flex items-center gap-1.5 rounded-md border border-[#0058be] bg-[#0058be] px-3 py-1.25 text-xs font-semibold text-white hover:bg-[#004aab]">
                            <Plus size={14} /> Add Task
                        </button>
                    </div>
                </div>
                {/* TABS */}
                <div className="flex gap-1 px-6">
                    {(['assigned', 'mentions', 'created'] as TabType[]).map((tab) => (
                        <button
                            key={tab}
                            className={`px-3 py-2 text-[13px] font-semibold border-b-2 transition-all ${activeTab === tab ? 'border-[#0058be] text-[#0058be]' : 'border-transparent text-[#5f6368]'}`}
                            onClick={() => setActiveTab(tab)}
                        >
                            {tab === 'assigned' ? 'Assigned to me' : tab === 'mentions' ? 'Mentions' : 'Created by me'}
                        </button>
                    ))}
                </div>
            </header>

            {/* TOOLBAR */}
            <div className="flex items-center justify-between border-b border-[#eef0f5] px-6 py-2">
                <div className="flex min-w-50 items-center gap-1.5 rounded-md border border-[#eef0f5] bg-[#f8fafb] px-2.5 py-1">
                    <Search size={14} className="text-[#9aa0a6]" />
                    <input
                        className="bg-transparent text-xs outline-none w-full"
                        placeholder="Search tasks..."
                        value={searchText}
                        onChange={e => setSearchText(e.target.value)}
                    />
                </div>
                <div className="flex items-center gap-2">
                    <button className="text-xs font-semibold text-[#5f6368]" onClick={() => setShowCompleted(!showCompleted)}>
                        {showCompleted ? 'Hide Completed' : 'Show Completed'}
                    </button>
                </div>
            </div>

            {/* TASK LIST */}
            <div className="flex-1 overflow-y-auto px-6 pb-6 pt-3">
                {isLoadingTasks ? <div className="py-4 text-[#9aa0a6]">Loading...</div> : null}

                {taskGroups.map(group => (
                    <div key={group.label} className="mb-5">
                        <div className="flex items-center gap-2 py-1 cursor-pointer" onClick={() => toggleGroup(group.label)}>
                            {expandedGroups[group.label] ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
                            <span className="text-[13px] font-extrabold">{group.label}</span>
                            <span className="text-[11px] text-[#9aa0a6] bg-[#f0f2f5] px-1.5 rounded-full">{group.tasks.length}</span>
                        </div>

                        {expandedGroups[group.label] && (
                            <div className="flex flex-col mt-1">
                                {group.tasks.map(task => (
                                    <div
                                        key={task.task_id}
                                        className="group flex items-center rounded-md border-b border-[#f5f7fa] px-2 py-2 hover:bg-[#f8fafb] cursor-pointer"
                                        onClick={() => setSelectedTask(task)}
                                    >
                                        <div className="w-8 flex justify-center">
                                            <CheckCircle2 size={16} className={isCompletedTask(task) ? 'text-green-500' : 'text-gray-200'} />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <div className={`text-[13px] font-semibold truncate ${isCompletedTask(task) ? 'line-through text-gray-400' : ''}`}>
                                                {task.name}
                                            </div>
                                            <span className="text-[10px] font-bold" style={{ color: task.space_color }}>{task.space_name}</span>
                                        </div>
                                        <div className="w-24 shrink-0">
                                            {task.due_date && (
                                                <span className="text-[11px] flex items-center gap-1 text-gray-500">
                                                    <Calendar size={10} /> {toHumanDueLabel(task.due_date)}
                                                </span>
                                            )}
                                        </div>
                                        <div className="flex -space-x-1">
                                            {task.assignees?.map((a: any) => (
                                                <Avatar key={a.user_id} size={22} src={a.avatar_url} className="border-2 border-white">
                                                    {getInitials(a.name)}
                                                </Avatar>
                                            ))}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                ))}
            </div>

            {/* MODAL CHI TIẾT */}
            <TaskDetailModal
                isOpen={!!selectedTask}
                onClose={() => setSelectedTask(null)}
                task={selectedTask ? toTaskForModal(selectedTask) : null}
                updateTask={handleUpdateTask}
            />
        </div>
    );
}