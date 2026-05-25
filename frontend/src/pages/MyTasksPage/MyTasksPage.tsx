import { useEffect, useMemo, useState } from 'react';
import {
    Calendar, ChevronDown, ChevronRight,
    Plus, Search, Flag, User
} from 'lucide-react';
import { Avatar, Popover, message } from 'antd';
import { useDispatch, useSelector } from 'react-redux';

import TaskDetailModal from '@/components/TaskDetailModal';
import CreateTaskModal from '@/components/Modal/CreateTaskModal/CreateTaskModal';
import AssigneePopover from '@/components/Popovers/AssigneePopover';
import DueDatePopover from '@/components/Popovers/DueDatePopover';
import PriorityPopover from '@/components/Popovers/PriorityPopover';

import type { AppDispatch, RootState } from '@/store/configureStore';
import type { Task, NewTaskData, TabType } from '@/types/tasks';
import { fetchTasksForUser, fetchUpdateTask, fetchCreateTask } from '@/store/modules/tasks';
import { useSpaceTree } from '@/layouts/AppLayout/SpaceTreeContext';

/** --- HELPERS --- **/
const getInitials = (name: string) => name ? name.substring(0, 2).toUpperCase() : 'NA';
const formatDate = (dateString: string | null) => dateString ? new Date(dateString).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) : null;

function isCompletedTask(task: any): boolean {
    return (task.status_name ?? '').toUpperCase() === 'COMPLETE' || !!task.completed_at;
}

function isDueToday(rawDueDate: string | null): boolean {
    if (!rawDueDate) return false;
    const parsed = new Date(rawDueDate);
    if (Number.isNaN(parsed.getTime())) return rawDueDate === 'Today';
    const today = new Date();
    return parsed.getDate() === today.getDate() && parsed.getMonth() === today.getMonth() && parsed.getFullYear() === today.getFullYear();
}

export default function MyTasksPage() {
    const dispatch = useDispatch<AppDispatch>();
    const { spaces: treeSpaces, spaceTree } = useSpaceTree();

    const listTasks = useSelector((state: RootState) => state.tasks.listTaskByUserId) || [];
    const listMembers = useSelector((state: RootState) => state.workspaces.listWorkspaceMembers) || [];
    const listSpaces = useSelector((state: RootState) => state.spaces.listSpaces) || [];
    const currentUserId = useSelector((state: RootState) => state.auth.signIn?.user?.user_id);

    const [activeTab, setActiveTab] = useState<TabType>('assigned');
    const [selectedTask, setSelectedTask] = useState<Task | null>(null);
    const [searchText, setSearchText] = useState('');
    const [showCompleted, setShowCompleted] = useState(true);
    const [activeSpaceId, setActiveSpaceId] = useState<number | null>(null);
    const [activePopover, setActivePopover] = useState<{ taskId: number, field: string } | null>(null);
    const [expandedGroups, setExpandedGroups] = useState<Record<string, boolean>>({});
    const [isCreateTaskOpen, setIsCreateTaskOpen] = useState(false);

    const columns = { assignee: true, dueDate: true, priority: true };

    // Gather all lists from the space tree for the CreateTaskModal
    const allLists = useMemo(() => {
        const result: { id: number; name: string }[] = [];
        for (const space of treeSpaces) {
            const node = spaceTree[space.id];
            if (!node) continue;
            node.standaloneLists.forEach(l => result.push({ id: Number(l.id), name: `${space.name} / ${l.name}` }));
            node.folders.forEach(f => f.lists.forEach(l => result.push({ id: Number(l.id), name: `${space.name} / ${f.name} / ${l.name}` })));
        }
        return result;
    }, [treeSpaces, spaceTree]);

    // Gather status groups for the modal
    const modalGroups = useMemo(() => {
        if (!Array.isArray(listTasks)) return [];
        return listTasks.map((g: any) => ({ id: g.id, name: g.name, color: g.color }));
    }, [listTasks]);

    useEffect(() => {
        dispatch(fetchTasksForUser());
    }, [dispatch]);

    useEffect(() => {
        if (listSpaces.length > 0 && activeSpaceId == null) {
            setActiveSpaceId(listSpaces[0].spaceId);
        }
    }, [listSpaces, activeSpaceId]);

    const flatTasks = useMemo(() => {
        if (!Array.isArray(listTasks)) return [];
        return listTasks.reduce((acc: any[], group: any) => acc.concat(group.tasks || []), []);
    }, [listTasks]);

    const totalActive = flatTasks.filter((t: any) => !isCompletedTask(t)).length;
    const totalOverdue = flatTasks.filter((t: any) => t.parent_task_id === null && isDueToday(t.due_date) && !isCompletedTask(t)).length;

    const taskGroups = useMemo(() => {
        if (!Array.isArray(listTasks)) return [];

        return listTasks.map((group: any) => {
            const filteredTasksInGroup = (group.tasks || []).filter((t: any) => {
                if (t.parent_task_id !== null) return false;
                if (!showCompleted && isCompletedTask(t)) return false;
                if (searchText && !t.name.toLowerCase().includes(searchText.toLowerCase())) return false;
                if (activeTab === 'assigned' && currentUserId) {
                    const isAssigned = (t.assignees || []).some((a: any) => Number(a.user_id) === Number(currentUserId));
                    if (!isAssigned) return false;
                }
                if (activeTab === 'created' && currentUserId) {
                    if (Number(t.created_by) !== Number(currentUserId)) return false;
                }
                if (activeTab === 'mentions') {
                    // Mentions: chưa có hệ thống @mention, tạm thời không hiện task nào
                    return false;
                }
                return true;
            });

            return {
                ...group,
                isExpanded: expandedGroups[group.id] ?? group.isExpanded ?? true,
                tasks: filteredTasksInGroup
            };
        }).filter((group: any) => group.tasks.length > 0);
    }, [listTasks, showCompleted, searchText, expandedGroups, activeTab, currentUserId]);

    const toggleGroup = (groupId: number) => {
        setExpandedGroups(prev => ({ ...prev, [groupId]: prev[groupId] !== undefined ? !prev[groupId] : false }));
    };

    const handleUpdateTask = (taskId: number, updates: Partial<Task>) => {
        // Build API payload - map frontend field names to backend field names
        const apiPayload: Record<string, any> = {};
        if (updates.name !== undefined) apiPayload.name = updates.name;
        if (updates.description !== undefined) apiPayload.description = updates.description;
        if (updates.due_date !== undefined) apiPayload.due_date = updates.due_date;
        if (updates.status_id !== undefined) apiPayload.status_id = updates.status_id;
        if (updates.priority_name !== undefined) apiPayload.priority = updates.priority_name;
        if (updates.position !== undefined) apiPayload.position = updates.position;

        // Call API if there are valid fields to update
        if (Object.keys(apiPayload).length > 0) {
            dispatch(fetchUpdateTask({ task_id: taskId, updates: apiPayload }));
        }

        // Optimistic UI update for selectedTask
        if (selectedTask?.task_id === taskId) {
            setSelectedTask(prev => prev ? { ...prev, ...updates } : null);
        }
    };

    const handleCreateTask = (payload: NewTaskData) => {
        dispatch(fetchCreateTask({ list_id: payload.list_id, taskData: payload }))
            .unwrap()
            .then(() => {
                message.success('Đã tạo task!');
                dispatch(fetchTasksForUser());
            })
            .catch(() => message.error('Tạo task thất bại'));
        setIsCreateTaskOpen(false);
    };

    return (
        <div className="flex h-full flex-col overflow-hidden bg-white font-sans">
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
                        <button
                            className="flex items-center gap-1.5 rounded-md border border-[#0058be] bg-[#0058be] px-3 py-1 text-xs font-semibold text-white hover:bg-[#004aab] transition-colors cursor-pointer"
                            onClick={() => setIsCreateTaskOpen(true)}
                        >
                            <Plus size={14} /> Add Task
                        </button>
                    </div>
                </div>
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
                    <button className="text-xs font-semibold text-[#5f6368] hover:text-[#141b2b]" onClick={() => setShowCompleted(!showCompleted)}>
                        {showCompleted ? 'Hide Completed' : 'Show Completed'}
                    </button>
                </div>
            </div>

            <div className="flex-1 overflow-y-auto p-6">
                {activeTab === 'mentions' ? (
                    <div className="flex flex-col items-center justify-center py-16 text-[#9aa0a6]">
                        <div className="mb-3 flex h-14 w-14 items-center justify-center rounded-full bg-[#f0f4ff]">
                            <span className="text-2xl">💬</span>
                        </div>
                        <p className="text-sm font-semibold text-[#5f6368]">Chưa có lượt mention nào</p>
                        <p className="mt-1 text-xs text-[#9aa0a6]">Khi ai đó @mention bạn trong comment, task sẽ hiện ở đây.</p>
                    </div>
                ) : taskGroups.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-16 text-[#9aa0a6]">
                        <div className="mb-3 flex h-14 w-14 items-center justify-center rounded-full bg-[#f0f4ff]">
                            <span className="text-2xl">{activeTab === 'assigned' ? '📋' : '✏️'}</span>
                        </div>
                        <p className="text-sm font-semibold text-[#5f6368]">
                            {activeTab === 'assigned' ? 'Không có task nào được giao cho bạn' : 'Bạn chưa tạo task nào'}
                        </p>
                        <p className="mt-1 text-xs text-[#9aa0a6]">
                            {activeTab === 'assigned' ? 'Các task được giao (assign) cho bạn sẽ xuất hiện ở đây.' : 'Những task do bạn tạo sẽ xuất hiện ở đây.'}
                        </p>
                    </div>
                ) : null}

                {taskGroups.map((group) => (
                    <div key={group.id} className="mb-8">
                        <div
                            className="group flex cursor-pointer items-center gap-2 py-1 mb-2 select-none"
                            onClick={() => toggleGroup(group.id)}
                        >
                            <button className="flex h-5 w-5 items-center justify-center text-[#9ca3af] hover:text-[#5f6368] transition-colors">
                                {group.isExpanded ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
                            </button>
                            <div className="flex items-center gap-1.5 rounded-md bg-[#f3f4f6] px-2 py-1">
                                <div className="h-3.5 w-3.5 rounded-full border-[1.5px] border-dashed" style={{ borderColor: group.color || '#d3d3d3' }} />
                                <span className="text-[12px] font-semibold text-[#292d34]">{group.name}</span>
                            </div>
                            <span className="text-[12px] text-[#9ca3af] ml-1">{group.tasks.length}</span>
                        </div>

                        {group.isExpanded && (
                            <div className="flex flex-col">
                                <div className="flex items-center border-b border-[#e5e7eb] py-2 pl-8 pr-4">
                                    <div className="flex-1 pr-4"><span className="text-[12px] font-semibold text-[#7c828d]">Name</span></div>
                                    {columns.assignee && <div className="w-30 shrink-0 pl-2"><span className="text-[12px] font-semibold text-[#7c828d]">Assignee</span></div>}
                                    {columns.dueDate && <div className="w-32.5 shrink-0 pl-2"><span className="text-[12px] font-semibold text-[#7c828d]">Due date</span></div>}
                                    {columns.priority && <div className="w-27.5 shrink-0 pl-2"><span className="text-[12px] font-semibold text-[#7c828d]">Priority</span></div>}
                                </div>

                                {group.tasks.map((task: any) => (
                                    <div
                                        key={task.task_id}
                                        className="group/row flex items-center border-b border-[#f3f4f6] py-1.5 pl-8 pr-4 hover:bg-[#fafbfc] transition-colors cursor-pointer"
                                        onClick={() => setSelectedTask(task)}
                                    >
                                        <div className="flex-1 flex items-center gap-3 pr-4">
                                            <div className="h-3.5 w-3.5 shrink-0 rounded-full border-[1.5px] border-dashed" style={{ borderColor: task.status_color || group.color || '#9ca3af' }} />
                                            <div className="flex flex-col min-w-0">
                                                <span className={`text-[13px] font-medium truncate hover:text-[#7c68ee] ${isCompletedTask(task) ? 'line-through text-gray-400' : 'text-[#292d34]'}`}>
                                                    {task.name}
                                                </span>
                                                <span className="text-[10px] font-bold" style={{ color: task.space_color || '#9ca3af' }}>
                                                    {task.space_name || 'No Project'}
                                                </span>
                                            </div>
                                        </div>

                                        {columns.assignee && (
                                            <div className="w-30 shrink-0 pl-2">
                                                <Popover content={<AssigneePopover allMembers={listMembers} assignees={task.assignees || []} onSave={(a) => handleUpdateTask(task.task_id, { assignees: a })} onClose={() => setActivePopover(null)} />} trigger="click" open={activePopover?.taskId === task.task_id && activePopover?.field === 'assignee'} onOpenChange={(v) => !v && setActivePopover(null)} placement="bottomLeft" arrow={false} >
                                                    <div className="flex min-h-6 items-center px-1 rounded hover:bg-[#eef0f5] transition-colors" onClick={(e) => { e.stopPropagation(); setActivePopover({ taskId: task.task_id, field: 'assignee' }); }}>
                                                        {task.assignees?.length > 0 ? (
                                                            <div className="flex -space-x-1">
                                                                {task.assignees.map((a: any) => (
                                                                    <Avatar key={a.user_id} size={24} src={a.avatar_url} style={{ backgroundColor: '#1e1f21', fontSize: '10px' }} className="border-2 border-white">
                                                                        {!a.avatar_url && getInitials(a.name)}
                                                                    </Avatar>
                                                                ))}
                                                            </div>
                                                        ) : <User size={12} className="text-[#9ca3af]" />}
                                                    </div>
                                                </Popover>
                                            </div>
                                        )}

                                        {columns.dueDate && (
                                            <div className="w-32.5 shrink-0 pl-2">
                                                <Popover content={<DueDatePopover date={task.due_date} onSave={(d) => handleUpdateTask(task.task_id, { due_date: d })} onClose={() => setActivePopover(null)} />} trigger="click" open={activePopover?.taskId === task.task_id && activePopover?.field === 'dueDate'} onOpenChange={(v) => !v && setActivePopover(null)} placement="bottomLeft" arrow={false} >
                                                    <div className="flex min-h-6 items-center px-1 rounded hover:bg-[#eef0f5] transition-colors" onClick={(e) => { e.stopPropagation(); setActivePopover({ taskId: task.task_id, field: 'dueDate' }); }}>
                                                        {task.due_date ? (
                                                            <span className={`text-[12px] font-medium ${isDueToday(task.due_date) ? 'text-[#ef4444]' : 'text-[#5f6368]'}`}>
                                                                {formatDate(task.due_date)}
                                                            </span>
                                                        ) : <Calendar size={14} className="text-[#d1d5db]" />}
                                                    </div>
                                                </Popover>
                                            </div>
                                        )}

                                        {columns.priority && (
                                            <div className="w-27.5 shrink-0 pl-2">
                                                <Popover content={<PriorityPopover priority_name={task.priority_name} onSave={(_id: number | null, name: string | null, color: string | null) => handleUpdateTask(task.task_id, { priority_name: name, priority_color: color })} onClose={() => setActivePopover(null)} />} trigger="click" open={activePopover?.taskId === task.task_id && activePopover?.field === 'priority'} onOpenChange={(v) => !v && setActivePopover(null)} placement="bottomLeft" arrow={false} >
                                                    <div className="flex min-h-6 items-center px-1 rounded hover:bg-[#eef0f5] transition-colors" onClick={(e) => { e.stopPropagation(); setActivePopover({ taskId: task.task_id, field: 'priority' }); }}>
                                                        {task.priority_name && task.priority_name !== 'Clear' ? (
                                                            <Flag size={14} color={task.priority_color ?? '#9ca3af'} fill={task.priority_color ?? 'transparent'} />
                                                        ) : <Flag size={14} className="text-[#d1d5db]" />}
                                                    </div>
                                                </Popover>
                                            </div>
                                        )}
                                        <div className="w-8 shrink-0" />
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
                task={selectedTask || null}
                updateTask={handleUpdateTask}
            />

            <CreateTaskModal
                isOpen={isCreateTaskOpen}
                onClose={() => setIsCreateTaskOpen(false)}
                onCreate={handleCreateTask}
                groups={modalGroups}
                lists={allLists}
                defaultListId={allLists.length > 0 ? allLists[0].id : undefined}
            />
        </div>
    );
}