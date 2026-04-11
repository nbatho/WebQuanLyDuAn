import { useState, useRef, useEffect } from 'react';
import { User, Calendar, Flag, Clock, Tag, CheckCircle2 } from 'lucide-react';
import { Button, Avatar } from 'antd';
import type { Task } from '@/types/tasks';
import { PRIORITY_OPTIONS, MEMBER_OPTIONS } from '../constants/taskOptions';
import { directChildTasks } from '@/utils/taskFamily';
interface TaskDetailSidebarProps {
    task: Task;
    allTasks: Task[];
    taskPriority: string;
    onPriorityChange: (value: string) => void;
}

export default function TaskDetailSidebar({
    task,
    allTasks,
    taskPriority,
    onPriorityChange,
}: TaskDetailSidebarProps) {
    const [showPriority, setShowPriority] = useState(false);
    const [showAssignee, setShowAssignee] = useState(false);
    const priorityRef = useRef<HTMLDivElement>(null);
    const assigneeRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handler = (e: MouseEvent) => {
            if (priorityRef.current && !priorityRef.current.contains(e.target as Node)) setShowPriority(false);
            if (assigneeRef.current && !assigneeRef.current.contains(e.target as Node)) setShowAssignee(false);
        };
        document.addEventListener('mousedown', handler);
        return () => document.removeEventListener('mousedown', handler);
    }, []);

    const priorityObj = PRIORITY_OPTIONS.find((p) => p.value === taskPriority) || PRIORITY_OPTIONS[2];
    const childTasks = directChildTasks(allTasks, task.task_id);

    return (
        <div className="flex w-65 shrink-0 flex-col gap-4 overflow-y-auto border-l border-(--color-border-light) p-4">
            <div className="flex flex-col gap-1">
                {/* Assignee */}
                <div className="relative flex flex-col gap-0.75 py-1.5" ref={assigneeRef}>
                    <span className="text-[11px] font-bold uppercase tracking-[0.04em] text-(--color-text-tertiary)">Assignee</span>
                    <div
                        className="flex cursor-pointer items-center gap-1.5 rounded-md px-1.5 py-1 text-[13px] font-medium text-(--color-text-secondary) transition-colors hover:bg-(--color-primary-bg)"
                        onClick={() => setShowAssignee(!showAssignee)}
                    >
                        {task.assignees && task.assignees.length > 0 ? (
                            <div className="flex gap-1">
                                {task.assignees.map((a: string) => {
                                    const member = MEMBER_OPTIONS.find((m) => m.id === a);
                                    return (
                                        <Avatar
                                            key={a}
                                            size={24}
                                            style={{
                                                backgroundColor: member?.color || 'var(--color-text-tertiary)',
                                                fontSize: '10px',
                                                fontWeight: 'bold',
                                            }}
                                        >
                                            {a}
                                        </Avatar>
                                    );
                                })}
                            </div>
                        ) : (
                            <>
                                <User size={14} className="shrink-0 text-(--color-text-tertiary)" /> Assign
                            </>
                        )}
                    </div>
                    {showAssignee && (
                        <div className="absolute right-0 top-[calc(100%+4px) z-20 min-w-45 rounded-lg border border-(--color-border-light) bg-white p-1 shadow-[0_6px_20px_rgba(0,0,0,0.12)">
                            {MEMBER_OPTIONS.map((m) => (
                                <button
                                    key={m.id}
                                    className="flex w-full cursor-pointer items-center gap-2 rounded-md border-none px-2.5 py-1.5 text-left text-xs font-semibold text-(--color-on-surface) hover:bg-(--color-primary-bg)"
                                >
                                    <span
                                        className="flex h-5.5 w-5.5 shrink-0 items-center justify-center rounded-full text-[9px] font-bold text-white"
                                        style={{ backgroundColor: m.color }}
                                    >
                                        {m.id}
                                    </span>
                                    {m.name}
                                </button>
                            ))}
                        </div>
                    )}
                </div>

                {/* Due Date */}
                <div className="flex flex-col gap-0.75 py-1.5">
                    <span className="text-[11px] font-bold uppercase tracking-[0.04em] text-(--color-text-tertiary)">Due Date</span>
                    <div className="relative flex cursor-pointer items-center gap-1.5 rounded-md px-1.5 py-1 text-[13px] font-medium text-(--color-text-secondary) transition-colors hover:bg-(--color-primary-bg)">
                        <Calendar size={14} className="shrink-0 text-(--color-text-tertiary)" />
                        <span>{task.due_date || 'Set date'}</span>
                        <input type="date" className="absolute inset-0 h-full w-full cursor-pointer opacity-0" />
                    </div>
                </div>

                {/* Priority */}
                <div className="relative flex flex-col gap-0.75 py-1.5" ref={priorityRef}>
                    <span className="text-[11px] font-bold uppercase tracking-[0.04em] text-var(--color-text-tertiary)">Priority</span>
                    <div
                        className="flex cursor-pointer items-center gap-1.5 rounded-md px-1.5 py-1 text-[13px] font-medium text-[var(--color-text-secondary) transition-colors hover:bg-[var(--color-primary-bg)"
                        onClick={() => setShowPriority(!showPriority)}
                    >
                        <Flag
                            size={14}
                            className="shrink-0"
                            fill={taskPriority !== 'Normal' ? priorityObj.color : 'none'}
                            color={priorityObj.color}
                        />
                        <span style={{ color: priorityObj.color, fontWeight: 600 }}>{taskPriority}</span>
                    </div>
                    {showPriority && (
                        <div className="absolute right-0 top-[calc(100%+4px) z-20 min-w-45 rounded-lg border border-[var(--color-border-light) bg-white p-1 shadow-[0_6px_20px_rgba(0,0,0,0.12)">
                            {PRIORITY_OPTIONS.map((p) => (
                                <button
                                    key={p.value}
                                    className={`flex w-full cursor-pointer items-center gap-2 rounded-md border-none px-2.5 py-1.5 text-left text-xs font-semibold ${taskPriority === p.value
                                            ? 'bg-[var(--color-primary-bg) text-[var(--color-primary)'
                                            : 'bg-transparent text-[var(--color-on-surface) hover:bg-[var(--color-primary-bg)'
                                        }`}
                                    onClick={() => {
                                        onPriorityChange(p.value);
                                        setShowPriority(false);
                                    }}
                                >
                                    <Flag size={13} fill={p.value !== 'Normal' ? p.color : 'none'} color={p.color} />
                                    {p.value}
                                </button>
                            ))}
                        </div>
                    )}
                </div>

                {/* Time Tracked */}
                <div className="flex flex-col gap-0.75 py-1.5">
                    <span className="text-[11px] font-bold uppercase tracking-[0.04em] text-[var(--color-text-tertiary)">Time Tracked</span>
                    <div className="flex items-center gap-2 rounded-md px-1.5 py-1 text-[13px] font-medium text-[var(--color-text-secondary)">
                        <Clock size={14} className="shrink-0 text-[var(--color-text-tertiary)" /> 00:00:00
                        <Button size="small" type="primary" className="text-[11px]">Play</Button>
                    </div>
                </div>

                {/* Tags */}
                <div className="flex flex-col gap-0.75 py-1.5">
                    <span className="text-[11px] font-bold uppercase tracking-[0.04em] text-[var(--color-text-tertiary)">Tags</span>
                    <div className="flex cursor-pointer items-center gap-1.5 rounded-md px-1.5 py-1 text-[13px] font-medium text-[var(--color-text-secondary) transition-colors hover:bg-[var(--color-primary-bg)">
                        <Tag size={14} className="shrink-0 text-[var(--color-text-tertiary)" /> Add Tags
                    </div>
                </div>
            </div>

            {/* Subtasks */}
            <div className="border-t border-[var(--color-surface-hover) pt-2">
                <h4 className="mb-2 text-xs font-bold text-[var(--color-on-surface)">Subtasks</h4>
                {childTasks.length > 0 ? (
                    <div className="mb-2 flex flex-col gap-1">
                        {childTasks.map((sub) => (
                            <div
                                key={sub.task_id}
                                className="flex cursor-pointer items-center gap-1.5 rounded px-1.5 py-1 text-xs font-medium text-[var(--color-on-surface) hover:bg-[var(--color-primary-bg)"
                            >
                                <CheckCircle2 size={14} style={{ color: sub.statusColor || 'var(--color-border)' }} />
                                <span>{sub.name}</span>
                            </div>
                        ))}
                    </div>
                ) : null}
                <Button block type="dashed" icon={<CheckCircle2 size={14} />}>Add Subtask</Button>
            </div>

            {/* Relationships */}
            <div className="border-t border-[var(--color-surface-hover) pt-2">
                <h4 className="mb-2 text-xs font-bold text-[var(--color-on-surface)">Relationships</h4>
                <p className="my-1 text-xs text-[#c2c9e0]">No relationships added.</p>
            </div>
        </div>
    );
}
