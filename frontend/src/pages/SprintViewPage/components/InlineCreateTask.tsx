import { useEffect, useRef, useState } from 'react';
import { Calendar, Flag, Plus, User } from 'lucide-react';
import { Avatar, Popover } from 'antd';
import PriorityPopover from '@/components/Popovers/PriorityPopover';
import AssigneePopover from '@/components/Popovers/AssigneePopover';
import DueDatePopover from '@/components/Popovers/DueDatePopover';
import type { Assignee } from '@/types/tasks';
import type { RootState } from '@/store/configureStore';
import { useSelector } from 'react-redux';

interface InlineCreateTaskProps {
    isActive: boolean; text: string; onChangeText: (val: string) => void;
    onActivate: () => void; onCancel: () => void;
    onSubmit: (extras?: { assignees?: Assignee[]; due_date?: string | null; priority_id?: number | null; priority_name?: string | null; priority_color?: string | null }) => void;
}

export default function InlineCreateTask({ isActive, text, onChangeText, onActivate, onCancel, onSubmit }: InlineCreateTaskProps) {
    const inlineRef = useRef<HTMLInputElement>(null);
    const [assignees, setAssignees] = useState<Assignee[]>([]);
    const [dueDate, setDueDate] = useState<string | null>(null);
    const [priorityId, setPriorityId] = useState<number | null>(null);
    const [priorityName, setPriorityName] = useState<string | null>('Normal');
    const [priorityColor, setPriorityColor] = useState<string | null>('#9ca3af');
    const [openPopover, setOpenPopover] = useState<'assignee' | 'dueDate' | 'priority' | null>(null);
    const listMembers = useSelector((state: RootState) => state.workspaces.listWorkspaceMembers);
    useEffect(() => {
        if (isActive) setTimeout(() => inlineRef.current?.focus(), 50);
        else { setAssignees([]); setDueDate(null); setPriorityId(null); setPriorityName('Normal'); setPriorityColor('#9ca3af'); setOpenPopover(null); }
    }, [isActive]);

    const handleSubmit = () => onSubmit({ assignees, due_date: dueDate, priority_id: priorityId, priority_name: priorityName, priority_color: priorityColor });
    const getInitials = (name: string) => name.substring(0, 2).toUpperCase();

    if (isActive) {
        return (
            <div className="flex min-h-9.5 items-center bg-white border-b border-[#f3f4f6]">
                <div className="flex w-13 shrink-0 items-center justify-center"><div className="h-3.5 w-3.5 rounded-full border-2 border-dashed border-[#9ca3af]" /></div>
                <div className="flex min-w-0 flex-1 items-center pr-2">
                    <input ref={inlineRef} className="min-w-0 flex-1 border-none bg-transparent py-2 text-[13px] outline-none" value={text} onChange={(e) => onChangeText(e.target.value)} placeholder="Task Name..." onKeyDown={(e) => { if (e.key === 'Enter') handleSubmit(); if (e.key === 'Escape') onCancel(); }} />
                    <button type="button" className="flex shrink-0 items-center gap-1.5 rounded px-2.5 py-0.75 text-[12px] font-semibold text-white bg-[#7c68ee] mr-1" onClick={handleSubmit}>Save ↵</button>
                    <button type="button" className="shrink-0 rounded px-1.5 py-1 text-[12px] font-medium text-[#6b7280] hover:text-[#374151]" onClick={onCancel}>Cancel</button>
                </div>
                <div className="flex shrink-0 items-center">
                    <div className="flex w-30 shrink-0 items-center justify-start px-2">
                        <Popover content={<AssigneePopover allMembers= {listMembers} assignees={assignees} onSave={setAssignees} onClose={() => setOpenPopover(null)} />} trigger="click" open={openPopover === 'assignee'} onOpenChange={(v) => !v && setOpenPopover(null)} placement="bottomLeft" arrow={false} >
                            <button type="button" className="flex h-6.5 min-w-6.5 items-center justify-center rounded px-1 text-[#9ca3af] hover:bg-[#f3f4f6]" onClick={(e) => { e.stopPropagation(); setOpenPopover('assignee'); }}>
                                {assignees.length > 0 ? <div className="flex -space-x-1">{assignees.map((a) => <Avatar key={a.user_id} size={20} src={a.avatar_url} style={{ backgroundColor: '#1e1f21', fontSize: '9px', fontWeight: 700 }}>{!a.avatar_url && getInitials(a.name)}</Avatar>)}</div> : <User size={14} />}
                            </button>
                        </Popover>
                    </div>
                    <div className="flex w-32 shrink-0 items-center justify-start px-2">
                        <Popover content={<DueDatePopover date={dueDate} onSave={setDueDate} onClose={() => setOpenPopover(null)} />} trigger="click" open={openPopover === 'dueDate'} onOpenChange={(v) => !v && setOpenPopover(null)} placement="bottomLeft" arrow={false} >
                            <button type="button" className="flex h-6.5 min-w-6.5 items-center justify-center rounded px-1.5 text-[#9ca3af] hover:bg-[#f3f4f6]" onClick={(e) => { e.stopPropagation(); setOpenPopover('dueDate'); }}>
                                {dueDate ? <span className="text-[12px] font-medium text-[#ef4444]">Selected</span> : <Calendar size={14} />}
                            </button>
                        </Popover>
                    </div>
                    <div className="flex w-30 shrink-0 items-center justify-start px-2">
                        <Popover content={<PriorityPopover priority_name={priorityName} onSave={(id, name, color) => { setPriorityId(id); setPriorityName(name); setPriorityColor(color); }} onClose={() => setOpenPopover(null)} />} trigger="click" open={openPopover === 'priority'} onOpenChange={(v) => !v && setOpenPopover(null)} placement="bottomLeft" arrow={false} >
                            <button type="button" className="flex h-6.5 w-6.5 items-center justify-center rounded text-[#9ca3af] hover:bg-[#f3f4f6]" onClick={(e) => { e.stopPropagation(); setOpenPopover('priority'); }}>
                                {priorityName ? <Flag size={13} fill={priorityColor ?? 'transparent'} color={priorityColor ?? '#9ca3af'} /> : <Flag size={14} />}
                            </button>
                        </Popover>
                    </div>
                    <div className="w-9 shrink-0" />
                </div>
            </div>
        );
    }
    return <div className="flex min-h-8.5 cursor-pointer items-center gap-1.5 pl-8.5 text-[13px] text-[#9ca3af] hover:text-[#374151]" onClick={onActivate}><Plus size={14} strokeWidth={2.5} /><span>Add Task</span></div>;
}