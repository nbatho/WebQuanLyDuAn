import { useState, useEffect, useCallback } from 'react';
import type { StatusGroup,Task } from '@/types/tasks';
import { familyTaskIds } from '@/utils/taskFamily';
import { useAppDispatch, useAppSelector } from '@/hooks/index';

import { fetchTasksForSpace, fetchCreateTask } from '@/store/modules/tasks';
export function useSpaceTasks(spaceId: string | undefined) {
    const dispatch = useAppDispatch();
    const { listTask } = useAppSelector((state) => state.tasks);
    
    const [groups, setGroups] = useState<StatusGroup[]>([]);

    // 1. Fetch tasks when space changes
    useEffect(() => {
        if (spaceId) {
            dispatch(fetchTasksForSpace(Number(spaceId)));
        }
    }, [spaceId, dispatch]);

    // 2. Map backend listTask array into UI StatusGroup[] array
    useEffect(() => {
        if (!listTask) return;

        const groupsMap: Record<string, StatusGroup> = {};
        
        listTask.forEach(apiTask => {
            const statusName = apiTask.status_name || 'TO DO';
            const groupId = statusName.toLowerCase().replace(/ /g, '');
            
            if (!groupsMap[groupId]) {
                groupsMap[groupId] = {
                    id: groupId,
                    name: statusName,
                    color: apiTask.status_color || '#5f6368', // default color if null
                    isExpanded: true,
                    tasks: []
                };
            }

            // Fallback mapper for UI requirements until Redux is perfectly typed
            const initialsAssignees = apiTask.assignees 
                ? apiTask.assignees.map(a => a.name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase() || '?') 
                : [];

            groupsMap[groupId].tasks.push({
                task_id: apiTask.task_id,
                space_id: apiTask.space_id,
                parent_task_id: apiTask.parent_task_id,
                name: apiTask.name,
                description: apiTask.description,
                status: statusName,
                statusColor: apiTask.status_color || '#5f6368',
                priority: apiTask.priority_name || 'Normal',
                priorityColor: apiTask.priority_color || '#00b894',
                due_date: apiTask.due_date ? new Date(apiTask.due_date).toLocaleDateString('en-US', { month: '2-digit', day: '2-digit', year: '2-digit' }) : null,
                comment_count: 0,
                assignees: initialsAssignees,
            });
        });

        // Ensure basic columns exist even if no tasks are returned
        if (Object.keys(groupsMap).length === 0) {
            groupsMap['todo'] = { id: 'todo', name: 'TO DO', color: '#5f6368', isExpanded: true, tasks: [] };
            groupsMap['inprogress'] = { id: 'inprogress', name: 'IN PROGRESS', color: '#0058be', isExpanded: true, tasks: [] };
            groupsMap['done'] = { id: 'done', name: 'COMPLETE', color: '#27ae60', isExpanded: true, tasks: [] };
        }

        setGroups(Object.values(groupsMap));
    }, [listTask]);

    const handleCreateTask = useCallback(
        (data: { name: string; status: string; statusColor: string; priority: string; priorityColor: string; due_date: string | null; assignees: string[]; description: string; listName: string }) => {
            if (!spaceId) return;

            const statusMap: Record<string, string> = { 'TO DO': 'todo', 'IN PROGRESS': 'inprogress', COMPLETE: 'done' };
            const groupId = statusMap[data.status] || 'todo';
            
            // 1. Optimistic UI update
            const tempTask: Task = {
                task_id: Math.floor(Math.random() * 999999), // Temp ID
                space_id: Number(spaceId),
                parent_task_id: null,
                name: data.name,
                description: data.description || null,
                status: data.status,
                statusColor: data.statusColor,
                priority: data.priority,
                priorityColor: data.priorityColor,
                due_date: data.due_date
                    ? new Date(data.due_date).toLocaleDateString('en-US', { month: '2-digit', day: '2-digit', year: '2-digit' })
                    : null,
                assignees: data.assignees,
                comment_count: 0,
            };
            setGroups((prev) => prev.map((g) => (g.id === groupId ? { ...g, tasks: [...g.tasks, tempTask] } : g)));

            // 2. Dispatch to Backend
            dispatch(fetchCreateTask({ 
                space_id: Number(spaceId), 
                taskData: {
                    name: data.name,
                    description: data.description,
                    priority_id: data.priority === 'Urgent' ? 1 : data.priority === 'High' ? 2 : 3, // Basic mock back-mapping mapping
                    // Add other properties required by your Tasks backend
                } as any
            })).unwrap().then(() => {
                // Refresh list to grab true DB IDs and values
                dispatch(fetchTasksForSpace(Number(spaceId)));
            });
        },
        [spaceId, dispatch]
    );

    const handleContextAction = useCallback(
        (action: string, task: Task) => {
            switch (action) {
                case 'delete': {
                    const isRoot = task.parent_task_id === null;
                    setGroups((prev) =>
                        prev.map((g) => {
                            if (isRoot) {
                                const drop = new Set(familyTaskIds(g.tasks, task.task_id));
                                return { ...g, tasks: g.tasks.filter((t) => !drop.has(t.task_id)) };
                            }
                            return { ...g, tasks: g.tasks.filter((t) => t.task_id !== task.task_id) };
                        })
                    );
                    // TODO: dispatch(deleteTaskThunk(task.task_id));
                    break;
                }
                case 'duplicate':
                    setGroups((prev) =>
                        prev.map((g) => {
                            const idx = g.tasks.findIndex((t) => t.task_id === task.task_id);
                            if (idx === -1) return g;
                            const clone: Task = { ...task, task_id: Math.floor(Math.random() * 999999), name: `${task.name} (copy)` };
                            const newTasks = [...g.tasks];
                            newTasks.splice(idx + 1, 0, clone);
                            return { ...g, tasks: newTasks };
                        })
                    );
                     // TODO: dispatch(createTaskThunk(...));
                    break;
                case 'copy-link':
                    navigator.clipboard?.writeText(`task/${task.task_id}`);
                    break;
                case 'archive':
                    setGroups((prev) => prev.map((g) => ({ ...g, tasks: g.tasks.filter((t) => t.task_id !== task.task_id) })));
                    break;
            }
        },
        []
    );

    return {
        groups,
        setGroups,
        handleCreateTask,
        handleContextAction,
    };
}
