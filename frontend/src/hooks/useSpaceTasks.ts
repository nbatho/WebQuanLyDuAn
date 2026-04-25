import { useState, useEffect, useCallback } from 'react';
import type { StatusGroup, Task } from '@/types/tasks';
import { useAppDispatch, useAppSelector } from '@/hooks/index';

import {
    fetchTasksForSpace,
    fetchTasksForList,
    fetchTasksForFolder,
    fetchCreateTask,
    fetchDeleteTask,
} from '@/store/modules/tasks';

import {
    fetchStatusesBySpace,
    fetchCreateStatus,
} from '@/store/modules/statuses';

export function useTasksData({ spaceId, listId, folderId }: { spaceId?: string; listId?: string; folderId?: string }) {
    const dispatch = useAppDispatch();
    const { listTask } = useAppSelector((state) => state.tasks);
    const { listStatuses } = useAppSelector((state) => state.statuses);

    const [groups, setGroups] = useState<StatusGroup[]>([]);

    // ── 1. Fetch tasks dựa theo ngữ cảnh ───────────────────────────
    useEffect(() => {
        if (listId) {
            dispatch(fetchTasksForList(Number(listId)));
        } else if (folderId) {
            dispatch(fetchTasksForFolder(Number(folderId)));
        } else if (spaceId) {
            dispatch(fetchTasksForSpace(Number(spaceId)));
        }
        
        if (spaceId) {
            dispatch(fetchStatusesBySpace(Number(spaceId)));
        }
    }, [spaceId, listId, folderId, dispatch]);

    // ── 2. Map listTask từ Redux → UI StatusGroup[] ──────────────────
    useEffect(() => {
        // listTask === undefined = chưa fetch xong → không làm gì
        if (listTask === undefined || listTask === null) return;

        const groupsMap: Record<string, StatusGroup> = {};

        // 1. Dựng sẵn các groups từ listStatuses (dù chưa có task nào)
        if (listStatuses && listStatuses.length > 0) {
            listStatuses.forEach((apiStatus) => {
                const groupId = apiStatus.status_name.toLowerCase().replace(/ /g, '');
                groupsMap[groupId] = {
                    id: groupId,
                    name: apiStatus.status_name,
                    color: apiStatus.color || '#8e9196',
                    isExpanded: true,
                    tasks: [],
                };
            });
        }

        // 2. Nhồi tasks vào đúng group (tạo group mới nếu status chưa có trong listStatuses)
        listTask.forEach((apiTask) => {
            const statusName = apiTask.status_name || 'TO DO';
            const groupId = statusName.toLowerCase().replace(/ /g, '');

            if (!groupsMap[groupId]) {
                groupsMap[groupId] = {
                    id: groupId,
                    name: statusName,
                    color: apiTask.status_color || '#8e9196',
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
                folder_id: apiTask.folder_id,
                list_id: apiTask.list_id,
                parent_task_id: apiTask.parent_task_id,
                name: apiTask.name,
                description: apiTask.description,
                status: statusName,
                statusColor: apiTask.status_color || '#8e9196',
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

        // List mới tạo hoặc chưa có task → hiển thị group "TO DO" mặc định (giống ClickUp)
        if (Object.keys(groupsMap).length === 0) {
            groupsMap['todo'] = {
                id: 'todo',
                name: 'TO DO',
                color: '#8e9196',
                isExpanded: true,
                tasks: [],
            };
        }

        setGroups(Object.values(groupsMap));
    }, [listTask, listStatuses]);

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
            listId: number;
        }) => {
            if (!spaceId || !data.listId) return;

            dispatch(
                fetchCreateTask({
                    list_id: data.listId,
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
        (groupId: string, name: string, listId: number, extras?: { assignees?: string[]; dueDate?: string | null; priority?: string }) => {
            if (!name || !listId) return;

            // Tìm status_id tương ứng với group đang chọn (nếu backend hỗ trợ map string -> status ID thì truyền, hiện tại chưa)
            // const targetGroup = groups.find((g) => g.id === groupId);

            dispatch(
                fetchCreateTask({
                    list_id: listId,
                    taskData: {
                        name,
                        due_date: extras?.dueDate ? new Date(extras.dueDate).toISOString() : undefined,
                        priority_name: extras?.priority || 'Normal',
                        assignees: extras?.assignees || [],
                    } as any,
                })
            )
                .unwrap()
                .then(() => {
                    if (listId) {
                        dispatch(fetchTasksForList(Number(listId)));
                    } else if (folderId) {
                        dispatch(fetchTasksForFolder(Number(folderId)));
                    } else if (spaceId) {
                        dispatch(fetchTasksForSpace(Number(spaceId)));
                    }
                })
                .catch((err) => {
                    console.error('[handleInlineCreate] Failed:', err);
                });

            // Không thêm task vào local state — đợi re-fetch từ Redux
            void targetGroup; // tránh warning unused variable
        },
        [spaceId, folderId, dispatch, groups]
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
                            list_id: task.list_id,
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

    // ── 6. Tạo status mới ──────────────────────────────────────────
    const handleCreateStatus = useCallback(
        (statusName: string, color: string) => {
            if (!spaceId) return;
            dispatch(
                fetchCreateStatus({
                    spaceId: Number(spaceId),
                    statusName,
                    color,
                    isDoneState: false, // Default is not done
                })
            )
                .unwrap()
                .then(() => {
                    dispatch(fetchStatusesBySpace(Number(spaceId)));
                })
                .catch((err) => {
                    console.error('[handleCreateStatus] Failed:', err);
                });
        },
        [spaceId, dispatch]
    );

    return {
        groups,
        setGroups,
        handleCreateTask,
        handleInlineCreate,
        handleContextAction,
        handleCreateStatus,
    };
}
