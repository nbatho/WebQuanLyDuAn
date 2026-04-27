import React, { useState, createContext, useContext, useCallback, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import {
    Plus, ListTodo, Search,
    Users, Settings2, CheckCircle2, ChevronDown,
} from 'lucide-react';

import { useSpaceTree } from '../../layouts/AppLayout/SpaceTreeContext';
import PageHeader, { LIST_TABS } from '../../components/PageHeader';
import ContextMenu from '../../components/ContextMenu';
import CreateTaskModal from '../../components/CreateTaskModal/CreateTaskModal';
import BoardView from './components/BoardView';
import ListView from './components/ListView';
import { useDispatch, useSelector } from 'react-redux';
import type { AppDispatch, RootState } from '@/store/configureStore';
import { fetchTasksForList, fetchCreateTask } from '@/store/modules/tasks';
// import { useAppDispatch, useAppSelector } from '@/hooks/index'; 

export interface Assignee {
    user_id: number;
    name: string;
    avatar_url: string | null;
}
export interface StatusGroup {
    id: number;
    name: string;
    color: string;
    isExpanded: boolean;
    tasks: Task[];
}

export interface Task {
    task_id: number;
    parent_task_id: number | null;
    list_id: number;
    space_id: number;
    folder_id: number | null;
    name: string;
    description: string | null;
    status_id: number;
    status_name: string;
    status_color: string;

    priority_name: string | null;
    priority_color: string | null;

    due_date: string | null;
    position: number;
    subtask_count: number;
    subtask_done_count: number;
    comment_count: number;
    attachment_count: number;
    assignees: Assignee[];
}

export interface NewTaskData {
    name: string;
    description?: string | null;
    list_id: number;
    parent_task_id?: number | null;
    status_id?: number;

    priority?: string;

    due_date?: string | null;
    assignee_ids?: number[];
}


interface TaskViewContextType {
    groups: StatusGroup[];
    setGroups: React.Dispatch<React.SetStateAction<StatusGroup[]>>;
    listId: number;
    showClosed: boolean;
    columns: { assignee: boolean; dueDate: boolean; priority: boolean };
    setSelectedTask: (t: Task | null) => void;
    onContextMenu: (e: React.MouseEvent, task: Task) => void;
    updateTask: (taskId: number, updates: Partial<Task>) => void;
    handleInlineCreate: (groupId: number, name: string, extras?: any) => void;
    handleCreateStatus: (name: string, color: string) => void;
}

export const TaskViewContext = createContext<TaskViewContextType | null>(null);

export const useTaskView = () => {
    const context = useContext(TaskViewContext);
    if (!context) throw new Error('useTaskView must be used within TaskViewProvider');
    return context;
};

export default function ListViewPage() {
    const { listId, spaceId } = useParams<{ listId: string; spaceId: string }>();
    const { spaces, spaceTree } = useSpaceTree();
    const dispatch = useDispatch<AppDispatch>();
    const listTasks = useSelector((state: RootState) => state.tasks.listTask);
    const [groups, setGroups] = useState<StatusGroup[]>([]);
    const [, setSelectedTask] = useState<Task | null>(null);
    const [ctxMenu, setCtxMenu] = useState<{ x: number; y: number; task: Task } | null>(null);
    const [isCreateTaskOpen, setIsCreateTaskOpen] = useState(false);
    const [showClosed, setShowClosed] = useState(false);
    const [activeTab, setActiveTab] = useState<'list' | 'board'>('list');

    const columns = { assignee: true, dueDate: true, priority: true };

    let parentSpace: { id: string; name: string; color: string } | null = null;
    let parentFolder: { id: string; name: string } | null = null;
    let listInfo: { id: string; name: string } | null = null;

    for (const space of spaces) {
        const node = spaceTree[space.id];
        if (!node) continue;
        const standalone = node.standaloneLists.find(l => l.id === listId);
        if (standalone) { parentSpace = space; listInfo = standalone; break; }
        for (const folder of node.folders) {
            const found = folder.lists.find(l => l.id === listId);
            if (found) { parentSpace = space; parentFolder = folder; listInfo = found; break; }
        }
        if (listInfo) break;
    }

    const updateTask = useCallback((taskId: number, updates: Partial<Task>) => {
        setGroups((prevGroups) => {
            let taskToMove: Task | null = null;
            const newGroups = prevGroups.map((group) => {
                const tIdx = group.tasks.findIndex((t) => t.task_id === taskId);
                if (tIdx !== -1) {
                    const updatedTask = { ...group.tasks[tIdx], ...updates };
                    if (updates.status_id && updates.status_id !== group.id) {
                        taskToMove = updatedTask;
                        return { ...group, tasks: group.tasks.filter((t) => t.task_id !== taskId) };
                    }
                    const newTasks = [...group.tasks];
                    newTasks[tIdx] = updatedTask;
                    return { ...group, tasks: newTasks };
                }
                return group;
            });

            if (taskToMove && updates.status_id) {
                return newGroups.map((g) =>
                    g.id === updates.status_id ? { ...g, tasks: [...g.tasks, taskToMove!] } : g
                );
            }
            return newGroups;
        });

        // TODO: dispatch(fetchUpdateTask(...))
    }, []);

    const handleInlineCreate = useCallback((groupId: number, name: string, extras?: any) => {
        const payload: NewTaskData = {
            name,
            list_id: Number(listId),
            status_id: groupId,
            priority: extras?.priority || 'Normal',
            due_date: extras?.due_date || null,
            assignee_ids: extras?.assignees?.map((a: Assignee) => a.user_id) || []
        };


        const tempId = Math.floor(Math.random() * 100000);
        const newTask: Task = {
            task_id: tempId,
            parent_task_id: null,
            list_id: Number(listId),
            space_id: Number(spaceId) || 0,
            folder_id: parentFolder ? Number(parentFolder.id) : null,
            name: name,
            description: null,
            status_id: groupId,
            status_name: groups.find(g => g.id === groupId)?.name || '',
            status_color: groups.find(g => g.id === groupId)?.color || '#ccc',

            priority_name: payload.priority || 'Normal',
            priority_color: extras?.priority_color || '#3b82f6',

            due_date: payload.due_date || null,
            position: 0,
            subtask_count: 0,
            subtask_done_count: 0,
            comment_count: 0,
            attachment_count: 0,
            assignees: extras?.assignees || []
        };

        setGroups(prev => prev.map(g => g.id === groupId ? { ...g, tasks: [...g.tasks, newTask] } : g));

        dispatch(fetchCreateTask({
            list_id: payload.list_id,
            taskData: payload
        }));
    }, [listId, spaceId, parentFolder, groups, dispatch]);

    const handleCreateTask = useCallback((payload: NewTaskData) => {

        dispatch(fetchCreateTask({
            list_id: payload.list_id,
            taskData: payload
        }));

        setIsCreateTaskOpen(false);

    }, [dispatch]);
    const handleCreateStatus = useCallback((name: string, color: string) => {
        console.log("Create Status:", { name, color });
        // TODO: Gọi API tạo status
    }, []);

    const onTaskContextMenu = (e: React.MouseEvent, task: Task) => {
        e.preventDefault();
        setCtxMenu({ x: e.clientX, y: e.clientY, task });
    };

    const onContextActionSelect = (action: string) => {
        if (!ctxMenu) return;
        if (action === 'delete') {
            setGroups(prev => prev.map(g => ({ ...g, tasks: g.tasks.filter(t => t.task_id !== ctxMenu.task.task_id) })));
        }
        setCtxMenu(null);
    };

    useEffect(() => {
        dispatch(fetchTasksForList(Number(listId)));
    }, [dispatch, listId]);

    useEffect(() => {
        if (listTasks.length > 0) {
            setGroups(listTasks);
        } else {
            setGroups([]);
        }
    }, [listTasks]);

    if (!parentSpace || !listInfo) {
        return <div className="flex h-full items-center justify-center text-[#5f6368]"><p>List not found</p></div>;
    }

    const contextValue: TaskViewContextType = {
        groups, setGroups,
        listId: Number(listId),
        showClosed, columns,
        setSelectedTask, onContextMenu: onTaskContextMenu,
        updateTask, handleInlineCreate, handleCreateStatus
    };

    return (
        <TaskViewContext.Provider value={contextValue}>
            <div className="flex h-full flex-col overflow-hidden bg-white" style={{ fontFamily: "'Plus Jakarta Sans', 'Inter', sans-serif" }}>

                <PageHeader
                    parentSpace={parentSpace}
                    parentFolder={parentFolder}
                    entityIcon={<ListTodo size={16} />}
                    entityName={listInfo.name}
                    tabs={[
                        { ...LIST_TABS[0], active: activeTab === 'list', onClick: () => setActiveTab('list') },
                        { ...LIST_TABS[1], active: activeTab === 'board', onClick: () => setActiveTab('board') }
                    ]}
                />

                <div className="flex shrink-0 items-center justify-between border-b border-[#eef0f5] bg-white px-5 py-2">
                    <div className="flex items-center gap-1.5">
                        <button className="flex cursor-pointer items-center gap-1 rounded-md border border-[#27ae60] bg-[#e6f9ef] px-2.5 py-1 text-xs font-semibold text-[#27ae60]">
                            <CheckCircle2 size={13} /> Group: Status
                        </button>
                        <button className="flex cursor-pointer items-center gap-1 rounded-md border border-[#eef0f5] bg-transparent px-2.5 py-1 text-xs font-semibold text-[#5f6368] hover:bg-[#f8fafc]">Subtasks</button>
                        <button className="flex cursor-pointer items-center gap-1 rounded-md border border-[#eef0f5] bg-transparent px-2.5 py-1 text-xs font-semibold text-[#5f6368] hover:bg-[#f8fafc]">Columns</button>
                    </div>
                    <div className="flex items-center gap-1.5">
                        <button type="button" className="flex cursor-pointer items-center gap-1 rounded-md border-none bg-transparent px-2 py-1 text-xs font-semibold text-[#5f6368] hover:bg-[#f0f4ff] hover:text-[#0058be]"><Search size={13} /> Filter</button>
                        <button type="button" className="flex cursor-pointer items-center gap-1 rounded-md border-none bg-transparent px-2 py-1 text-xs font-semibold text-[#5f6368] hover:bg-[#f0f4ff] hover:text-[#0058be]"><CheckCircle2 size={13} /> Closed</button>
                        <button type="button" className="flex cursor-pointer items-center gap-1.5 rounded-md border-none bg-transparent px-2 py-1 text-xs font-semibold text-[#5f6368] hover:bg-[#f0f4ff] hover:text-[#0058be]">
                            <Users size={13} /> Assignee
                            <span className="flex h-5 w-5 items-center justify-center rounded-full bg-[#e8f0fe] text-[10px] font-bold text-[#0058be]">M</span>
                        </button>
                        <button type="button" className="flex h-7 w-7 cursor-pointer items-center justify-center rounded-md border-none bg-transparent text-[#5f6368] hover:bg-[#f0f4ff] hover:text-[#0058be]" aria-label="Search"><Search size={15} /></button>
                        <button type="button" className="flex cursor-pointer items-center gap-1 rounded-md border-none bg-transparent px-2 py-1 text-xs font-semibold text-[#5f6368] hover:bg-[#f0f4ff] hover:text-[#0058be]"><Settings2 size={13} /> Customize</button>
                        <button type="button" className="flex cursor-pointer items-center gap-1 rounded-md border-none bg-[#1e1f21] px-3 py-1.5 text-xs font-bold text-white transition-colors hover:bg-black"
                            onClick={() => setIsCreateTaskOpen(true)}
                        >
                            <Plus size={14} /> Add Task <ChevronDown size={12} />
                        </button>
                    </div>
                </div>

                <main className="flex flex-1 flex-col overflow-hidden">
                    {activeTab === 'list' ?
                        <ListView />
                        :
                        <BoardView showClosed={true} />
                    }
                </main>

                <ContextMenu
                    x={ctxMenu?.x || 0} y={ctxMenu?.y || 0}
                    isOpen={!!ctxMenu} onClose={() => setCtxMenu(null)}
                    onAction={onContextActionSelect} taskTitle={ctxMenu?.task.name}
                />

                <CreateTaskModal
                    isOpen={isCreateTaskOpen}
                    onClose={() => setIsCreateTaskOpen(false)}
                    onCreate={handleCreateTask}

                    groups={groups.map(g => ({ id: g.id, name: g.name, color: g.color }))}

                    lists={[{ id: Number(listInfo.id), name: listInfo.name }]}
                    defaultListId={Number(listInfo.id)}
                />
            </div>
        </TaskViewContext.Provider>
    );
}