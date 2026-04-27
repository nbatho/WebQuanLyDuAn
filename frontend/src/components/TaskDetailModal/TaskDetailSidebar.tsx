import { useState } from 'react';
import { User, Calendar, Flag } from 'lucide-react';
import { Popover, Avatar } from 'antd';
import type { Task } from '@/types/tasks';
import AssigneePopover from '../Popovers/AssigneePopover';
import DueDatePopover from '../Popovers/DueDatePopover';
import PriorityPopover from '../Popovers/PriorityPopover';

interface TaskDetailSidebarProps {
    task: Task;
    updateTask: (taskId: number, updates: Partial<Task>) => void;
}

export default function TaskDetailSidebar({ task, updateTask }: TaskDetailSidebarProps) {
    const [openPopover, setOpenPopover] = useState<'assignee' | 'dueDate' | 'priority' | null>(null);
    const getInitials = (name: string) => name.substring(0, 2).toUpperCase();
    const formatDate = (date: string | null) => date ? new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) : 'Set date';

    return (
        <div className="flex w-65 shrink-0 flex-col gap-4 overflow-y-auto border-l border-[#e5e7eb] p-4 bg-[#f9fafb]">
            <div className="flex flex-col gap-3">

                <div className="flex flex-col gap-1">
                    <span className="text-[11px] font-bold uppercase tracking-[0.04em] text-[#9ca3af]">Assignee</span>
                    <Popover content={<AssigneePopover assignees={task.assignees} onSave={(a) => updateTask(task.task_id, { assignees: a })} onClose={() => setOpenPopover(null)} />} trigger="click" open={openPopover === 'assignee'} onOpenChange={(v) => !v && setOpenPopover(null)} placement="bottomLeft" arrow={false} overlayInnerStyle={{ padding: 0 }} getPopupContainer={(trigger) => trigger.parentElement!}>
                        <div className="flex cursor-pointer items-center gap-2 rounded-md px-2 py-1.5 transition-colors hover:bg-[#e5e7eb]" onClick={() => setOpenPopover('assignee')}>
                            {task.assignees.length > 0 ? (
                                <div className="flex -space-x-1">
                                    {task.assignees.map((a) => (
                                        <Avatar key={a.user_id} size={24} src={a.avatar_url} style={{ backgroundColor: '#7c68ee', fontSize: '10px', fontWeight: 'bold', border: '2px solid white' }}>{!a.avatar_url && getInitials(a.name)}</Avatar>
                                    ))}
                                </div>
                            ) : <><User size={14} className="text-[#9ca3af]" /> <span className="text-[13px] font-medium text-[#6b7280]">Assign</span></>}
                        </div>
                    </Popover>
                </div>

                <div className="flex flex-col gap-1">
                    <span className="text-[11px] font-bold uppercase tracking-[0.04em] text-[#9ca3af]">Due Date</span>
                    <Popover content={<DueDatePopover date={task.due_date} onSave={(d) => updateTask(task.task_id, { due_date: d })} onClose={() => setOpenPopover(null)} />} trigger="click" open={openPopover === 'dueDate'} onOpenChange={(v) => !v && setOpenPopover(null)} placement="bottomLeft" arrow={false} overlayInnerStyle={{ padding: 0 }} getPopupContainer={(trigger) => trigger.parentElement!}>
                        <div className="flex cursor-pointer items-center gap-2 rounded-md px-2 py-1.5 transition-colors hover:bg-[#e5e7eb]" onClick={() => setOpenPopover('dueDate')}>
                            <Calendar size={14} className={task.due_date ? "text-[#ef4444]" : "text-[#9ca3af]"} />
                            <span className={`text-[13px] font-medium ${task.due_date ? 'text-[#ef4444]' : 'text-[#6b7280]'}`}>{formatDate(task.due_date)}</span>
                        </div>
                    </Popover>
                </div>

                <div className="flex flex-col gap-1">
                    <span className="text-[11px] font-bold uppercase tracking-[0.04em] text-[#9ca3af]">Priority</span>
                    <Popover content={<PriorityPopover priority_id={task.priority_id} onSave={(id, name, color) => updateTask(task.task_id, { priority_id: id, priority_name: name, priority_color: color })} onClose={() => setOpenPopover(null)} />} trigger="click" open={openPopover === 'priority'} onOpenChange={(v) => !v && setOpenPopover(null)} placement="bottomLeft" arrow={false} overlayInnerStyle={{ padding: 0 }} getPopupContainer={(trigger) => trigger.parentElement!}>
                        <div className="flex cursor-pointer items-center gap-2 rounded-md px-2 py-1.5 transition-colors hover:bg-[#e5e7eb]" onClick={() => setOpenPopover('priority')}>
                            <Flag size={14} fill={task.priority_color ?? 'transparent'} color={task.priority_color ?? '#9ca3af'} />
                            <span className="text-[13px] font-medium" style={{ color: task.priority_color ?? '#6b7280' }}>{task.priority_name || 'Normal'}</span>
                        </div>
                    </Popover>
                </div>

            </div>
        </div>
    );
}