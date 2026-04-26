import React, { useState } from 'react';
import {
    Calendar,
    ChevronDown,
    ChevronRight,
    Flag,
    MessageSquare,
    MoreHorizontal,
    Plus,
    User,
} from 'lucide-react';
import { Avatar, Popover } from 'antd';
import AssigneePopover from '@/components/Popovers/AssigneePopover';
import DueDatePopover from '@/components/Popovers/DueDatePopover';
import PriorityPopover from '@/components/Popovers/PriorityPopover';
import type { Task } from '@/types/tasks';

const avatarColors: Record<string, string> = {
    AR: '#4285F4',
    MC: '#7c5cfc',
    SJ: '#0058be',
    ER: '#e84393',
};

interface TaskRowProps {
    task: Task;
    isSubtask?: boolean;
    columns: Record<string, boolean>;
    groupColor: string;
    hasChildren?: boolean;
    isExpanded?: boolean;
    onToggle?: (e: React.MouseEvent) => void;
    childrenCount?: number;
    onContextMenu: (e: React.MouseEvent, task: Task) => void;
    onSelect: (task: Task) => void;
    onUpdate: (taskId: number, updates: Partial<Task>) => void;
}

export default function TaskRow({
    task,
    isSubtask = false,
    columns,
    groupColor,
    hasChildren = false,
    isExpanded = false,
    onToggle,
    childrenCount = 0,
    onContextMenu,
    onSelect,
    onUpdate,
}: TaskRowProps) {
    const [popoverField, setPopoverField] = useState<'assignee' | 'dueDate' | 'priority' | null>(null);

    const updateTask = (updates: Partial<Task>) => onUpdate(task.task_id, updates);
    const statusColor = task.statusColor ?? groupColor;

    return (
        <div
            className={`group relative flex min-h-[38px] cursor-pointer items-stretch border-b border-[#f3f4f6] transition-colors hover:bg-[#f9fafb] ${isSubtask ? 'bg-[#fafafa]' : 'bg-white'}`}
            onClick={() => onSelect(task)}
            onContextMenu={(e) => onContextMenu(e, task)}
        >
            {/* Name column */}
            <div className={`flex min-w-0 flex-1 items-center gap-2 py-[7px] pr-2 ${isSubtask ? 'pl-14' : 'pl-3'}`}>

                {/* Status circle — outline only, like ClickUp */}
                <div
                    className="flex shrink-0 h-[14px] w-[14px] items-center justify-center rounded-full border-2 transition-colors cursor-pointer hover:opacity-70"
                    style={{ borderColor: statusColor }}
                    onClick={(e) => e.stopPropagation()}
                    title={task.status}
                />

                {/* Subtask indent */}
                {isSubtask && (
                    <span className="shrink-0 text-[11px] text-[#d1d5db]">↳</span>
                )}

                {/* Children toggle */}
                {!isSubtask && hasChildren && onToggle && (
                    <button type="button" className="shrink-0" onClick={onToggle}>
                        <span className="flex items-center gap-0.5 rounded px-1 py-[1px] text-[10px] font-semibold text-[#6b7280] bg-[#f3f4f6] hover:bg-[#e5e7eb] transition-colors">
                            {isExpanded ? <ChevronDown size={9} /> : <ChevronRight size={9} />}
                            {childrenCount}
                        </span>
                    </button>
                )}

                {/* Task name */}
                <span className={`min-w-0 truncate text-[#111827] ${isSubtask ? 'text-[12px]' : 'text-[13px]'}`}>
                    {task.name}
                </span>

                {/* Comment count */}
                {task.comment_count > 0 && (
                    <span className="flex shrink-0 items-center gap-0.5 text-[11px] text-[#9ca3af]">
                        <MessageSquare size={11} />
                        {task.comment_count}
                    </span>
                )}

                {/* More button — appears on hover */}
                <button
                    type="button"
                    className="ml-auto flex h-5 w-5 shrink-0 items-center justify-center rounded text-[#9ca3af] opacity-0 transition-all hover:bg-[#e5e7eb] hover:text-[#6b7280] group-hover:opacity-100"
                    onClick={(e) => {
                        e.stopPropagation();
                        onContextMenu(e, task);
                    }}
                >
                    <MoreHorizontal size={13} />
                </button>
            </div>

            {/* Assignee Column */}
            {columns.assignee !== false && (
                <div
                    className="flex w-[120px] shrink-0 cursor-pointer items-center justify-start px-2 py-[7px] hover:bg-[#f3f4f6] transition-colors"
                    onClick={(e) => {
                        e.stopPropagation();
                        setPopoverField('assignee');
                    }}
                >
                    <Popover
                        content={
                            <AssigneePopover
                                assignees={task.assignees}
                                onSave={(assignees) => updateTask({ assignees })}
                                onClose={() => setPopoverField(null)}
                            />
                        }
                        trigger="click"
                        open={popoverField === 'assignee'}
                        onOpenChange={(v) => !v && setPopoverField(null)}
                        placement="bottom"
                        arrow={false}
                        overlayInnerStyle={{ padding: 0, borderRadius: '8px' }}
                    >
                        <div className="flex min-h-[22px] items-center">
                            {task.assignees.length > 0 ? (
                                task.assignees.map((a) => (
                                    <Avatar
                                        key={a}
                                        size={24}
                                        style={{
                                            backgroundColor: avatarColors[a] ?? '#6b7280',
                                            fontSize: '10px',
                                            fontWeight: 700,
                                            marginLeft: '-4px',
                                        }}
                                    >
                                        {a}
                                    </Avatar>
                                ))
                            ) : (
                                <User size={16} className="text-[#d1d5db] group-hover:text-[#9ca3af] transition-colors" />
                            )}
                        </div>
                    </Popover>
                </div>
            )}

            {/* Due Date Column */}
            {columns.dueDate !== false && (
                <div
                    className="flex w-[130px] shrink-0 cursor-pointer items-center justify-start px-2 py-[7px] hover:bg-[#f3f4f6] transition-colors"
                    onClick={(e) => {
                        e.stopPropagation();
                        setPopoverField('dueDate');
                    }}
                >
                    <Popover
                        content={
                            <DueDatePopover
                                date={task.due_date}
                                onSave={(due_date) => updateTask({ due_date })}
                                onClose={() => setPopoverField(null)}
                            />
                        }
                        trigger="click"
                        open={popoverField === 'dueDate'}
                        onOpenChange={(v) => !v && setPopoverField(null)}
                        placement="bottom"
                        arrow={false}
                        overlayInnerStyle={{ padding: 0, borderRadius: '8px' }}
                    >
                        <div className="flex min-h-[22px] items-center">
                            {task.due_date ? (
                                <span className="flex items-center gap-1 text-[12px] font-medium text-[#ef4444]">
                                    <Calendar size={13} />
                                    {task.due_date}
                                </span>
                            ) : (
                                <Calendar size={15} className="text-[#d1d5db] group-hover:text-[#9ca3af] transition-colors" />
                            )}
                        </div>
                    </Popover>
                </div>
            )}

            {/* Priority Column */}
            {columns.priority !== false && (
                <div
                    className="flex w-[110px] shrink-0 cursor-pointer items-center justify-start px-2 py-[7px] hover:bg-[#f3f4f6] transition-colors"
                    onClick={(e) => {
                        e.stopPropagation();
                        setPopoverField('priority');
                    }}
                >
                    <Popover
                        content={
                            <PriorityPopover
                                priority={task.priority}
                                onSave={(priority, priorityColor) => updateTask({ priority, priorityColor })}
                                onClose={() => setPopoverField(null)}
                            />
                        }
                        trigger="click"
                        open={popoverField === 'priority'}
                        onOpenChange={(v) => !v && setPopoverField(null)}
                        placement="bottom"
                        arrow={false}
                        overlayInnerStyle={{ padding: 0, borderRadius: '8px' }}
                    >
                        <div className="flex min-h-[22px] items-center">
                            {task.priority && task.priority !== 'Normal' ? (
                                <span
                                    className="flex items-center gap-1.5 text-[12px] font-semibold"
                                    style={{ color: task.priorityColor }}
                                >
                                    <Flag size={13} fill={task.priorityColor} />
                                    {task.priority}
                                </span>
                            ) : (
                                <Flag size={15} className="text-[#d1d5db] group-hover:text-[#9ca3af] transition-colors" />
                            )}
                        </div>
                    </Popover>
                </div>
            )}

            {/* Add field spacer */}
            <div className="w-9 shrink-0" />
        </div>
    );
}
