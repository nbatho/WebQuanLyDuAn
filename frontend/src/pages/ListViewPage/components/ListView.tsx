import { useState } from 'react';
import { ChevronDown, ChevronRight, Calendar, Flag, User } from 'lucide-react';
import { Popover, Avatar } from 'antd';
import type { Task } from '@/types/tasks';
import { useTaskView } from '../index';

import InlineCreateTask from '@/pages/ListViewPage/components/InlineCreateTask';
import AssigneePopover from '@/components/Popovers/AssigneePopover';
import DueDatePopover from '@/components/Popovers/DueDatePopover';
import PriorityPopover from '@/components/Popovers/PriorityPopover';
import TaskDetailModal from '@/components/TaskDetailModal';

const getInitials = (name: string) => name.substring(0, 2).toUpperCase();
const formatDate = (dateString: string | null) => dateString ? new Date(dateString).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) : null;

export default function ListView() {
    const { groups, setGroups, columns, updateTask, handleInlineCreate, onContextMenu } = useTaskView();

    const [selectedTask, setSelectedTask] = useState<Task | null>(null);
    const [activePopover, setActivePopover] = useState<{ taskId: number, field: string } | null>(null);
    const [inlineGroup, setInlineGroup] = useState<number | null>(null);
    const [inlineText, setInlineText] = useState('');

    const toggleGroup = (groupId: number) => setGroups(prev => prev.map(g => g.id === groupId ? { ...g, isExpanded: !g.isExpanded } : g));

    return (
        <div className="flex flex-1 flex-col overflow-hidden bg-white font-sans">
            <div className="flex-1 overflow-y-auto p-6">
                {groups.map((group) => (
                    <div key={group.id} className="mb-8">
                        <div className="group flex cursor-pointer items-center gap-2 py-1 mb-2">
                            <button onClick={(e) => { e.stopPropagation(); toggleGroup(group.id); }} className="flex h-5 w-5 items-center justify-center text-[#9ca3af] hover:text-[#5f6368]">{group.isExpanded ? <ChevronDown size={14} /> : <ChevronRight size={14} />}</button>
                            <div className="flex items-center gap-1.5 rounded-md bg-[#f3f4f6] px-2 py-1">
                                <div className="h-3.5 w-3.5 rounded-full border-[1.5px] border-dashed" style={{ borderColor: group.color }} />
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

                                {group.tasks.map((task) => (
                                    <div key={task.task_id} className="group/row flex items-center border-b border-[#f3f4f6] py-1.5 pl-8 pr-4 hover:bg-[#fafbfc] transition-colors cursor-pointer" onClick={() => setSelectedTask(task)} onContextMenu={(e) => onContextMenu(e, task)}>
                                        <div className="flex-1 flex items-center gap-3 pr-4">
                                            <div className="h-3.5 w-3.5 shrink-0 rounded-full border-[1.5px] border-dashed" style={{ borderColor: task.status_color }} />
                                            <span className="text-[13px] font-medium text-[#292d34] truncate hover:text-[#7c68ee]">{task.name}</span>
                                        </div>

                                        {columns.assignee && (
                                            <div className="w-30 shrink-0 pl-2">
                                                <Popover content={<AssigneePopover assignees={task.assignees} onSave={(a) => updateTask(task.task_id, { assignees: a })} onClose={() => setActivePopover(null)} />} trigger="click" open={activePopover?.taskId === task.task_id && activePopover?.field === 'assignee'} onOpenChange={(v) => !v && setActivePopover(null)} placement="bottomLeft" arrow={false} overlayInnerStyle={{ padding: 0 }}>
                                                    <div className="flex min-h-6 items-center px-1 hover:bg-[#f3f4f6]" onClick={(e) => { e.stopPropagation(); setActivePopover({ taskId: task.task_id, field: 'assignee' }); }}>
                                                        {task.assignees.length > 0 ? <div className="flex -space-x-1">{task.assignees.map((a) => <Avatar key={a.user_id} size={24} src={a.avatar_url} style={{ backgroundColor: '#1e1f21', fontSize: '10px' }}>{!a.avatar_url && getInitials(a.name)}</Avatar>)}</div> : <User size={12} className="text-[#9ca3af]" />}
                                                    </div>
                                                </Popover>
                                            </div>
                                        )}

                                        {columns.dueDate && (
                                            <div className="w-32.5 shrink-0 pl-2">
                                                <Popover content={<DueDatePopover date={task.due_date} onSave={(d) => updateTask(task.task_id, { due_date: d })} onClose={() => setActivePopover(null)} />} trigger="click" open={activePopover?.taskId === task.task_id && activePopover?.field === 'dueDate'} onOpenChange={(v) => !v && setActivePopover(null)} placement="bottomLeft" arrow={false} overlayInnerStyle={{ padding: 0 }}>
                                                    <div className="flex min-h-6 items-center px-1 hover:bg-[#f3f4f6]" onClick={(e) => { e.stopPropagation(); setActivePopover({ taskId: task.task_id, field: 'dueDate' }); }}>
                                                        {task.due_date ? <span className="text-[12px] text-[#ef4444] font-medium">{formatDate(task.due_date)}</span> : <Calendar size={14} className="text-[#d1d5db]" />}
                                                    </div>
                                                </Popover>
                                            </div>
                                        )}

                                        {columns.priority && (
                                            <div className="w-27.5 shrink-0 pl-2">
                                                <Popover content={<PriorityPopover priority_id={task.priority_id} onSave={(id, name, color) => updateTask(task.task_id, { priority_id: id, priority_name: name, priority_color: color })} onClose={() => setActivePopover(null)} />} trigger="click" open={activePopover?.taskId === task.task_id && activePopover?.field === 'priority'} onOpenChange={(v) => !v && setActivePopover(null)} placement="bottomLeft" arrow={false} overlayInnerStyle={{ padding: 0 }}>
                                                    <div className="flex min-h-6 items-center px-1 hover:bg-[#f3f4f6]" onClick={(e) => { e.stopPropagation(); setActivePopover({ taskId: task.task_id, field: 'priority' }); }}>
                                                        {task.priority_id ? <Flag size={14} color={task.priority_color ?? '#9ca3af'} fill={task.priority_color ?? 'transparent'} /> : <Flag size={14} className="text-[#d1d5db]" />}
                                                    </div>
                                                </Popover>
                                            </div>
                                        )}
                                        <div className="w-8 shrink-0" />
                                    </div>
                                ))}
                                <InlineCreateTask isActive={inlineGroup === group.id} text={inlineText} onChangeText={setInlineText} onActivate={() => setInlineGroup(group.id)} onCancel={() => { setInlineGroup(null); setInlineText(''); }} onSubmit={(extras) => { handleInlineCreate(group.id, inlineText, extras); setInlineText(''); setInlineGroup(null); }} />
                            </div>
                        )}
                    </div>
                ))}
            </div>

            <TaskDetailModal
                isOpen={!!selectedTask}
                task={selectedTask || null}
                onClose={() => setSelectedTask(null)}
                updateTask={updateTask}
            />
        </div>
    );
}