import React, { useState } from 'react';
import {
    Calendar,
    CheckCircle2,
    ChevronDown,
    ChevronRight,
    Flag,
    MessageSquare,
    MoreHorizontal,
    Plus,
} from 'lucide-react';
import { Avatar, Popover } from 'antd';
import AssigneePopover from '../../../../../components/Popovers/AssigneePopover';
import PriorityPopover from '../../../../../components/Popovers/PriorityPopover';
import DueDatePopover from '../../../../../components/Popovers/DueDatePopover';
import type { Task } from '../../../../../types/tasks';

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

    return (
        <div
            className={`group relative flex min-h-9 cursor-pointer items-stretch border border-transparent border-b-[#f0f2f5] transition-colors hover:border-[#eef0f5] ${isSubtask ? 'bg-[#fafbfc] hover:bg-[#f5f7fa]' : 'bg-white hover:bg-[#f8fafb]'}`}
            onClick={() => onSelect(task)}
            onContextMenu={(e) => onContextMenu(e, task)}
        >
            <div className={`relative flex min-w-65 flex-1 items-center border-l-[3px] border-l-transparent px-2 py-1.5 ${isSubtask ? 'pl-3.5' : 'pl-3.5'}`}>
                <div
                    className="absolute bottom-0 left-0 top-0 w-0.75"
                    style={{ backgroundColor: isSubtask ? task.statusColor : groupColor }}
                />
                <div className={`flex items-center gap-2 ${isSubtask ? 'pl-7' : 'pl-1.5'}`}>
                    {isSubtask && <span className="text-[13px] text-[#c2c9e0]">↳</span>}
                    <CheckCircle2
                        size={isSubtask ? 14 : 16}
                        className={`shrink-0 text-[#dcdfe4] ${!isSubtask && 'group-hover:text-[#b0b5c1]'}`}
                    />
                    <span className={`font-medium text-[#141b2b] ${isSubtask ? 'text-xs' : 'text-[13px]'}`}>
                        {task.name}
                    </span>
                    {!isSubtask && hasChildren && onToggle && (
                        <button
                            type="button"
                            className="p-0"
                            onClick={onToggle}
                        >
                            <span className="flex items-center gap-0.5 rounded-full bg-[#f0f4ff] px-1.5 py-0.5 text-[10px] font-extrabold text-[#0058be]">
                                {isExpanded ? <ChevronDown size={10} /> : <ChevronRight size={10} />}
                                {childrenCount}
                            </span>
                        </button>
                    )}
                    {!isSubtask && task.comment_count > 0 && (
                        <span className="flex items-center gap-1 text-[11px] text-[#9aa0a6]">
                            <MessageSquare size={11} /> {task.comment_count}
                        </span>
                    )}
                </div>
            </div>

            {/* Assignee Column */}
            {columns.assignee && (
                <div
                    className="flex w-27.5 items-center px-1.5 py-1.5 hover:bg-[#f8fafc] cursor-pointer group/cell transition-colors border border-transparent hover:border-[#eef0f5]"
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
                        overlayInnerStyle={{ padding: 0, borderRadius: '12px' }}
                    >
                        <div className="flex w-full items-center min-h-[24px]">
                            {task.assignees.length > 0 ? (
                                task.assignees.map((a) => (
                                    <Avatar
                                        key={a}
                                        size={isSubtask ? 20 : 22}
                                        style={{
                                            backgroundColor: avatarColors[a],
                                            fontSize: isSubtask ? '8px' : '9px',
                                            fontWeight: 'bold',
                                            marginLeft: '-4px',
                                        }}
                                    >
                                        {a}
                                    </Avatar>
                                ))
                            ) : (
                                <div className={`flex items-center justify-center rounded-full border border-dashed border-[#b0b5c1] text-[#b0b5c1] opacity-0 group-hover/cell:opacity-100 transition-opacity ${isSubtask ? 'h-4.5 w-4.5' : 'h-5 w-5'}`}>
                                    <Plus size={isSubtask ? 10 : 11} />
                                </div>
                            )}
                        </div>
                    </Popover>
                </div>
            )}

            {/* Due Date Column */}
            {columns.dueDate && (
                <div
                    className="flex w-30 items-center px-2 py-1.5 hover:bg-[#f8fafc] cursor-pointer group/cell transition-colors border border-transparent hover:border-[#eef0f5]"
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
                        overlayInnerStyle={{ padding: 0, borderRadius: '12px' }}
                    >
                        <div className="flex w-full items-center min-h-[24px]">
                            {task.due_date ? (
                                <span
                                    className={`flex items-center gap-1.5 text-xs font-medium ${
                                        ['10/31/23', '11/1/23', '10/3/23'].includes(task.due_date)
                                            ? 'font-bold text-[#e74c3c]'
                                            : 'text-[#5f6368]'
                                    }`}
                                >
                                    <Calendar size={isSubtask ? 11 : 12} /> {task.due_date}
                                </span>
                            ) : (
                                <Calendar
                                    size={isSubtask ? 13 : 14}
                                    className="text-[#d0d3db] group-hover/cell:text-[#9aa0a6] transition-colors"
                                />
                            )}
                        </div>
                    </Popover>
                </div>
            )}

            {/* Priority Column */}
            {columns.priority && (
                <div
                    className="flex w-27.5 items-center px-2 py-1.5 hover:bg-[#f8fafc] cursor-pointer group/cell transition-colors border border-transparent hover:border-[#eef0f5]"
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
                        overlayInnerStyle={{ padding: 0, borderRadius: '12px' }}
                    >
                        <div className="flex w-full items-center min-h-[24px]">
                            {task.priority !== 'Normal' ? (
                                <span
                                    className="flex items-center gap-1.5 text-xs font-semibold"
                                    style={{ color: task.priorityColor }}
                                >
                                    <Flag size={isSubtask ? 11 : 12} fill={task.priorityColor} />{' '}
                                    {task.priority === 'Urgent' ? <span className="text-[11px]">Urgent</span> : task.priority}
                                </span>
                            ) : (
                                <Flag
                                    size={isSubtask ? 13 : 14}
                                    className="text-[#d0d3db] group-hover/cell:text-[#9aa0a6] transition-colors"
                                />
                            )}
                        </div>
                    </Popover>
                </div>
            )}

            <div className="flex w-9 items-center justify-center px-0 py-1.5">
                <button
                    type="button"
                    className="cursor-pointer rounded p-0.5 text-[#9aa0a6] opacity-0 hover:bg-[#eef0f5] group-hover:opacity-100"
                    onClick={(e) => {
                        e.stopPropagation();
                        onContextMenu(e, task);
                    }}
                >
                    <MoreHorizontal size={14} />
                </button>
            </div>
        </div>
    );
}
