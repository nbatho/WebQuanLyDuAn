import { Calendar, Flag, MoreHorizontal, Plus } from 'lucide-react';
import { Avatar, Tooltip } from 'antd';
import { useEffect, useRef, useState, type DragEvent } from 'react';
import type { Task } from '@/types/tasks';
import { familyTaskIds, rootTasks } from '@/utils/taskFamily';

import { useTaskView } from '../index';

export default function BoardView({
    showClosed
}: {
    showClosed: boolean
}) {
    const {
        groups,
        setGroups,
        handleInlineCreate,
        updateTask,      
        onContextMenu,
    } = useTaskView();

    const dragItem = useRef<{ fromGroupId: number; taskId: number } | null>(null);
    const [dragOverGroup, setDragOverGroup] = useState<number | null>(null);
    const [inlineCol, setInlineCol] = useState<number | null>(null);
    const [inlineText, setInlineText] = useState('');
    const inlineRef = useRef<HTMLInputElement>(null);

    // Xử lý auto focus cho ô input
    useEffect(() => {
        if (inlineCol !== null) setTimeout(() => inlineRef.current?.focus(), 50);
    }, [inlineCol]);

    // Lọc các cột đã đóng
    const displayGroups = showClosed ? groups : groups.filter((g) => g.name?.toLowerCase() !== 'done');

    const onDragStart = (e: DragEvent, groupId: number, taskId: number) => {
        dragItem.current = { fromGroupId: groupId, taskId };
        e.dataTransfer.effectAllowed = 'move';
        (e.currentTarget as HTMLElement).style.opacity = '0.5';
    };

    const onDragEnd = (e: DragEvent) => {
        (e.currentTarget as HTMLElement).style.opacity = '1';
        setDragOverGroup(null);
    };

    const onDrop = (e: DragEvent, toGroupId: number) => {
        e.preventDefault();
        setDragOverGroup(null);
        if (!dragItem.current) return;

        const { fromGroupId, taskId } = dragItem.current;
        if (fromGroupId === toGroupId) {
            dragItem.current = null;
            return;
        }

        // Cập nhật UI ngay lập tức (Optimistic UI)
        setGroups((prev) => {
            const fromG = prev.find((g) => g.id === fromGroupId);
            const toG = prev.find((g) => g.id === toGroupId);
            if (!fromG || !toG) return prev;

            const moveIds = new Set(familyTaskIds(fromG.tasks, taskId));
            const moving = fromG.tasks.filter((t) => moveIds.has(t.task_id));
            const restFrom = fromG.tasks.filter((t) => !moveIds.has(t.task_id));

            const updatedMoving = moving.map((t) => ({
                ...t,
                status_id: toG.id,
                status_name: toG.name,
                status_color: toG.color,
            }));

            return prev.map((g) => {
                if (g.id === fromGroupId) return { ...g, tasks: restFrom };
                if (g.id === toGroupId) return { ...g, tasks: [...g.tasks, ...updatedMoving] };
                return g;
            });
        });

        // 2. GỌI API BẰNG HÀM TỪ HOOK
        // Gọn gàng và nhất quán với ListView!
        updateTask(taskId, { status_id: toGroupId });

        dragItem.current = null;
    };

    const onInlineSubmit = (groupId: number) => {
        if (!inlineText.trim()) {
            setInlineCol(null);
            return;
        }

        // Tạo task cũng dùng hàm từ Hook
        handleInlineCreate(groupId, inlineText.trim());

        setInlineText('');
        setInlineCol(null);
    };

    const handleTaskClick = (task: Task) => {
        console.log('Clicked task:', task);
        // setSelectedTask(task); 
    };

    return (
        <div className="flex flex-1 flex-col overflow-hidden">
            <div className="flex flex-1 items-start gap-3 overflow-x-auto px-5 py-4">
                {displayGroups.map((group) => {
                    const columnRoots = rootTasks(group.tasks);
                    return (
                        <div
                            key={group.id}
                            className={`w-70 shrink-0 overflow-hidden rounded-[10px] border-2 transition-colors ${dragOverGroup === group.id ? 'border-[#0058be] bg-[#f0f4ff]' : 'border-transparent bg-[#f8fafb]'
                                }`}
                            onDragOver={(e) => { e.preventDefault(); setDragOverGroup(group.id); }}
                            onDragLeave={() => setDragOverGroup(null)}
                            onDrop={(e) => onDrop(e, group.id)}
                        >
                            <div className="flex items-center justify-between px-3.5 py-2.5">
                                <div className="flex items-center gap-1.75">
                                    <span className="h-2.5 w-2.5 shrink-0 rounded-full" style={{ backgroundColor: group.color || '#ccc' }} />
                                    <span className="text-xs font-extrabold uppercase tracking-[0.04em] text-[#141b2b]">{group.name}</span>
                                    <span className="rounded-full bg-[#eef0f5] px-1.25 py-px text-[11px] font-bold text-[#5f6368]">{columnRoots.length}</span>
                                </div>
                                <div className="flex gap-0.5">
                                    <button className="rounded p-0.75 text-[#9aa0a6] hover:bg-[#eef0f5]"><MoreHorizontal size={14} /></button>
                                    <button className="rounded p-0.75 text-[#9aa0a6] hover:bg-[#eef0f5]" onClick={() => setInlineCol(group.id)}><Plus size={14} /></button>
                                </div>
                            </div>

                            <div className="flex max-h-[calc(100vh-260px)] flex-col gap-1.5 overflow-y-auto px-2 pb-2">
                                {columnRoots.map((task) => (
                                    <div
                                        key={task.task_id}
                                        className="cursor-pointer rounded-lg border border-[#eef0f5] bg-white px-3.5 py-3 shadow-[0_1px_3px_rgba(0,0,0,0.04)] hover:shadow-[0_4px_12px_rgba(0,0,0,0.08)]"
                                        draggable
                                        onDragStart={(e) => onDragStart(e, group.id, task.task_id)}
                                        onDragEnd={onDragEnd}
                                        onClick={() => handleTaskClick(task)}
                                        onContextMenu={(e) => onContextMenu(e, task)}
                                    >
                                        <div className="mb-1.5 text-[13px] font-semibold text-[#141b2b]">{task.name}</div>
                                        <div className="mb-2 text-[15px] text-[#dcdfe4]"><span>≡</span></div>

                                        <div className="flex flex-wrap items-center gap-2">
                                            {task.due_date && (
                                                <span className="flex items-center gap-1 rounded bg-[#f8fafb] px-1.5 py-0.5 text-[11px] text-[#5f6368]">
                                                    <Calendar size={11} /> {new Date(task.due_date).toLocaleDateString()}
                                                </span>
                                            )}
                                            {task.priority_name && task.priority_name !== 'Normal' && (
                                                <span className="flex items-center gap-1 text-[11px] font-semibold" >
                                                    <Flag size={11} /> {task.priority_name}
                                                </span>
                                            )}
                                            {task.assignees?.map((a: any) => (
                                                <Tooltip key={a.id || a.user_id} title={a.name}>
                                                    <Avatar size={20} src={a.avatar_url} style={{ backgroundColor: a.color }}>
                                                        {a.name?.charAt(0).toUpperCase()}
                                                    </Avatar>
                                                </Tooltip>
                                            ))}
                                        </div>
                                    </div>
                                ))}

                                {inlineCol === group.id ? (
                                    <div className="rounded-lg border border-[#0058be] bg-[#f8fbff] px-3.5 py-3 shadow-[0_0_0_2px_rgba(0,88,190,0.15)]">
                                        <input
                                            ref={inlineRef}
                                            className="w-full bg-transparent text-[13px] outline-none"
                                            value={inlineText}
                                            onChange={(e) => setInlineText(e.target.value)}
                                            placeholder="Tên công việc..."
                                            onKeyDown={(e) => {
                                                if (e.key === 'Enter') onInlineSubmit(group.id);
                                                if (e.key === 'Escape') setInlineCol(null);
                                            }}
                                            onBlur={() => onInlineSubmit(group.id)}
                                        />
                                    </div>
                                ) : (
                                    <button className="flex items-center gap-1.5 rounded-md px-1.5 py-1.75 text-xs font-semibold text-[#9aa0a6] hover:bg-[#f0f4ff] hover:text-[#0058be]" onClick={() => setInlineCol(group.id)}>
                                        <Plus size={13} /> Add Task
                                    </button>
                                )}
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}