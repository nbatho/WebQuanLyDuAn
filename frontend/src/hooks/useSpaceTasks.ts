import { useState, useEffect, useCallback } from 'react';
import type { StatusGroup, Task } from '@/types/tasks';
import { familyTaskIds } from '@/utils/taskFamily';
import { useAppDispatch, useAppSelector } from '@/hooks/index';

import {
    fetchTasksForSpace,
    fetchCreateTask,
    fetchDeleteTask,
} from '@/store/modules/tasks';

export function useSpaceTasks(spaceId: string | undefined) {
    const dispatch = useAppDispatch();
    const { listTask } = useAppSelector((state) => state.tasks);

    const [groups, setGroups] = useState<StatusGroup[]>([]);

    // ── 1. Fetch tasks khi space thay đổi ───────────────────────────
    useEffect(() => {
        if (spaceId) {
            dispatch(fetchTasksForSpace(Number(spaceId)));
        }
    }, [spaceId, dispatch]);

    // ── 2. Map listTask từ Redux → UI StatusGroup[] ──────────────────
    useEffect(() => {
        if (!listTask) return;

        const groupsMap: Record<string, StatusGroup> = {};

        listTask.forEach((apiTask) => {
            const statusName = apiTask.status_name || 'TO DO';
            const groupId = statusName.toLowerCase().replace(/ /g, '');

            if (!groupsMap[groupId]) {
                groupsMap[groupId] = {
                    id: groupId,
                    name: statusName,
                    color: apiTask.status_color || '#5f6368',
                    isExpanded: true,
                    tasks: [],
                };
            }

            const initialsAssignees = apiTask.assignees
                ? apiTask.assignees.map((a) =>
                      a.name
                          .split(' ')
                          .map((n) => n[0])
                          .join('')
                          .substring(0, 2)
                          .toUpperCase() || '?'
                  )
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
                due_date: apiTask.due_date
                    ? new Date(apiTask.due_date).toLocaleDateString('en-US', {
                          month: '2-digit',
                          day: '2-digit',
                          year: '2-digit',
                      })
                    : null,
                comment_count: 0,
                assignees: initialsAssignees,
            });
        });

        // Đảm bảo luôn có các cột mặc định khi chưa có task nào
        if (Object.keys(groupsMap).length === 0) {
            groupsMap['todo'] = { id: 'todo', name: 'TO DO', color: '#5f6368', isExpanded: true, tasks: [] };
            groupsMap['inprogress'] = { id: 'inprogress', name: 'IN PROGRESS', color: '#0058be', isExpanded: true, tasks: [] };
            groupsMap['done'] = { id: 'done', name: 'COMPLETE', color: '#27ae60', isExpanded: true, tasks: [] };
        }

        setGroups(Object.values(groupsMap));
    }, [listTask]);

    // ── 3. Tạo task từ modal CreateTask (đầy đủ thông tin) ──────────
    const handleCreateTask = useCallback(
        (data: {
            name: string;
            status: string;
            statusColor: string;
            priority: string;
            priorityColor: string;
            due_date: string | null;
            assignees: string[];
            description: string;
            listName: string;
        }) => {
            if (!spaceId) return;

            dispatch(
                fetchCreateTask({
                    space_id: Number(spaceId),
                    taskData: {
                        name: data.name,
                        description: data.description || null,
                        priority_id:
                            data.priority === 'Urgent'
                                ? 1
                                : data.priority === 'High'
                                ? 2
                                : 3,
                    } as any,
                })
            )
                .unwrap()
                .then(() => {
                    // Re-fetch để lấy data thực từ DB (ID thật, status đúng, v.v.)
                    dispatch(fetchTasksForSpace(Number(spaceId)));
                })
                .catch((err) => {
                    console.error('[handleCreateTask] Failed:', err);
                });
        },
        [spaceId, dispatch]
    );

    // ── 4. Tạo task nhanh từ inline input trong ListView ────────────
    //       groupId: id của status group (vd: 'todo', 'inprogress')
    //       name   : tên task đã trim
    const handleInlineCreate = useCallback(
        (groupId: string, name: string) => {
            if (!spaceId || !name) return;

            // Tìm status_id tương ứng với group đang chọn
            const targetGroup = groups.find((g) => g.id === groupId);

            dispatch(
                fetchCreateTask({
                    space_id: Number(spaceId),
                    taskData: {
                        name,
                        // Nếu muốn truyền status_id cụ thể, cần mapping từ group sang status_id
                        // Hiện tại để backend dùng default status
                    } as any,
                })
            )
                .unwrap()
                .then(() => {
                    dispatch(fetchTasksForSpace(Number(spaceId)));
                })
                .catch((err) => {
                    console.error('[handleInlineCreate] Failed:', err);
                });

            // Không thêm task vào local state — đợi re-fetch từ Redux
            void targetGroup; // tránh warning unused variable
        },
        [spaceId, dispatch, groups]
    );

    // ── 5. Xử lý context menu actions ───────────────────────────────
    const handleContextAction = useCallback(
        (action: string, task: Task) => {
            switch (action) {
                case 'delete': {
                    // Gọi Redux thunk xoá thật, UI tự cập nhật qua listTask effect
                    dispatch(fetchDeleteTask(task.task_id))
                        .unwrap()
                        .then(() => {
                            if (spaceId) dispatch(fetchTasksForSpace(Number(spaceId)));
                        })
                        .catch((err) => {
                            console.error('[handleContextAction:delete] Failed:', err);
                        });
                    break;
                }
                case 'duplicate': {
                    if (!spaceId) break;
                    dispatch(
                        fetchCreateTask({
                            space_id: Number(spaceId),
                            taskData: {
                                name: `${task.name} (copy)`,
                                description: task.description,
                            } as any,
                        })
                    )
                        .unwrap()
                        .then(() => dispatch(fetchTasksForSpace(Number(spaceId))))
                        .catch((err) => console.error('[duplicate] Failed:', err));
                    break;
                }
                case 'copy-link':
                    navigator.clipboard?.writeText(`task/${task.task_id}`);
                    break;
                case 'archive':
                    // TODO: dispatch archive thunk khi BE hỗ trợ
                    console.warn('Archive not yet implemented on backend');
                    break;
            }
        },
        [spaceId, dispatch]
    );

    return {
        groups,
        setGroups,
        handleCreateTask,
        handleInlineCreate,
        handleContextAction,
    };
}
