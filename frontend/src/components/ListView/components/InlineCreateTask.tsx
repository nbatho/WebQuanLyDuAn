import { useEffect, useRef, useState } from 'react';
import {
    Calendar,
    Flag,
    Pencil,
    Plus,
    Tag,
    User,
} from 'lucide-react';
import { Avatar, Popover } from 'antd';
import PriorityPopover from '@/components/Popovers/PriorityPopover';
import AssigneePopover from '@/components/Popovers/AssigneePopover';
import DueDatePopover from '@/components/Popovers/DueDatePopover';
const avatarColors: Record<string, string> = {
    AR: '#4285F4',
    MC: '#7c5cfc',
    SJ: '#0058be',
    ER: '#e84393',
};

const PRIORITY_COLORS: Record<string, string> = {
    Urgent: '#f50000',
    High: '#ffcc00',
    Normal: '#4285f4',
    Low: '#87909e',
};

interface InlineCreateTaskProps {
    isActive: boolean;
    text: string;
    onChangeText: (val: string) => void;
    onActivate: () => void;
    onCancel: () => void;
    onSubmit: (extras?: { assignees?: string[]; dueDate?: string | null; priority?: string }) => void;
    groupColor?: string;
}

export default function InlineCreateTask({
    isActive,
    text,
    onChangeText,
    onActivate,
    onCancel,
    onSubmit,
    groupColor = '#7c68ee',
}: InlineCreateTaskProps) {
    const inlineRef = useRef<HTMLInputElement>(null);

    // Field states for the inline row
    const [assignees, setAssignees] = useState<string[]>([]);
    const [dueDate, setDueDate] = useState<string | null>(null);
    const [priority, setPriority] = useState<string>('');
    const [priorityColor, setPriorityColor] = useState<string>('');
    const [openPopover, setOpenPopover] = useState<'assignee' | 'dueDate' | 'priority' | null>(null);

    useEffect(() => {
        if (isActive) {
            setTimeout(() => inlineRef.current?.focus(), 50);
        } else {
            // reset when closed
            setAssignees([]);
            setDueDate(null);
            setPriority('');
            setPriorityColor('');
            setOpenPopover(null);
        }
    }, [isActive]);

    const handleSubmit = () => {
        onSubmit({ assignees, dueDate, priority });
    };

    /* ── ACTIVE: Inline creation row ─────────────────────────────── */
    if (isActive) {
        return (
            <div className="flex min-h-[38px] items-center bg-white">
                {/* Dashed circle */}
                <div className="flex w-[52px] shrink-0 items-center justify-center">
                    <div className="h-[14px] w-[14px] rounded-full border-[2px] border-dashed border-[#9ca3af]" />
                </div>

                {/* Text input and Badges (Left Side) */}
                <div className="flex min-w-0 flex-1 items-center pr-2">
                    <input
                        ref={inlineRef}
                        className="min-w-0 flex-1 border-none bg-transparent py-2 text-[13px] text-[#292d34] outline-none placeholder:text-[#9ca3af]"
                        value={text}
                        onChange={(e) => onChangeText(e.target.value)}
                        placeholder="Task Name or type '/' for commands"
                        onKeyDown={(e) => {
                            if (e.key === 'Enter') handleSubmit();
                            if (e.key === 'Escape') onCancel();
                        }}
                    />

                    {/* ● Task badge */}
                    <div className="flex shrink-0 items-center gap-1 rounded px-2 py-[3px] text-[11px] font-medium text-[#6b7280] hover:bg-[#f3f4f6] cursor-pointer transition-colors ml-2">
                        <div className="h-[10px] w-[10px] rounded-full border-[2px] border-[#9ca3af]" />
                        <span>Task</span>
                    </div>

                    <div className="mx-2 h-4 w-px shrink-0 bg-[#e5e7eb]" />
                    
                    {/* Save button (since there's space here now) */}
                    <button
                        type="button"
                        className="flex shrink-0 items-center gap-1.5 rounded px-2.5 py-[3px] text-[12px] font-semibold text-white transition-opacity hover:opacity-90 mr-1"
                        style={{ backgroundColor: '#7c68ee' }}
                        onClick={handleSubmit}
                    >
                        Save
                        <span className="flex h-[14px] w-[14px] items-center justify-center rounded bg-white/25 text-[9px] font-bold leading-none">↵</span>
                    </button>
                    <button type="button" className="shrink-0 rounded px-1.5 py-1 text-[12px] font-medium text-[#6b7280] hover:text-[#374151] transition-colors" onClick={onCancel}>
                        Cancel
                    </button>
                </div>

                {/* Right Side Columns aligned exactly with ListHeader / TaskRow */}
                <div className="flex shrink-0 items-center">
                    {/* Assignee */}
                    <div className="flex w-[120px] shrink-0 items-center justify-start px-2">
                        <Popover
                            content={
                                <AssigneePopover
                                    assignees={assignees}
                                    onSave={(a) => setAssignees(a)}
                                    onClose={() => setOpenPopover(null)}
                                />
                            }
                            trigger="click"
                            open={openPopover === 'assignee'}
                            onOpenChange={(v) => !v && setOpenPopover(null)}
                            placement="bottomLeft"
                            arrow={false}
                            overlayInnerStyle={{ padding: 0, borderRadius: '10px', boxShadow: '0 8px 24px rgba(0,0,0,0.14)' }}
                        >
                            <button
                                type="button"
                                className="flex h-[26px] min-w-[26px] items-center justify-center rounded px-1 text-[#9ca3af] hover:bg-[#f3f4f6] hover:text-[#6b7280] transition-colors"
                                title="Assignee"
                                onClick={(e) => { e.stopPropagation(); setOpenPopover('assignee'); }}
                            >
                                {assignees.length > 0 ? (
                                    <div className="flex -space-x-1">
                                        {assignees.map((a) => (
                                            <Avatar key={a} size={20} style={{ backgroundColor: avatarColors[a] ?? '#6b7280', fontSize: '9px', fontWeight: 700 }}>{a}</Avatar>
                                        ))}
                                    </div>
                                ) : (
                                    <User size={14} />
                                )}
                            </button>
                        </Popover>
                    </div>

                    {/* Due Date */}
                    <div className="flex w-[130px] shrink-0 items-center justify-start px-2">
                        <Popover
                            content={
                                <DueDatePopover
                                    date={dueDate}
                                    onSave={(d) => setDueDate(d)}
                                    onClose={() => setOpenPopover(null)}
                                />
                            }
                            trigger="click"
                            open={openPopover === 'dueDate'}
                            onOpenChange={(v) => !v && setOpenPopover(null)}
                            placement="bottomLeft"
                            arrow={false}
                            overlayInnerStyle={{ padding: 0, borderRadius: '10px', boxShadow: '0 8px 24px rgba(0,0,0,0.14)' }}
                        >
                            <button
                                type="button"
                                className="flex h-[26px] min-w-[26px] items-center justify-center rounded px-1.5 text-[#9ca3af] hover:bg-[#f3f4f6] hover:text-[#6b7280] transition-colors"
                                title="Due date"
                                onClick={(e) => { e.stopPropagation(); setOpenPopover('dueDate'); }}
                            >
                                {dueDate ? (
                                    <span className="text-[12px] font-medium text-[#ef4444]">{dueDate}</span>
                                ) : (
                                    <Calendar size={14} />
                                )}
                            </button>
                        </Popover>
                    </div>

                    {/* Priority */}
                    <div className="flex w-[110px] shrink-0 items-center justify-start px-2">
                        <Popover
                            content={
                                <PriorityPopover
                                    priority={priority}
                                    onSave={(p, c) => { setPriority(p); setPriorityColor(c); }}
                                    onClose={() => setOpenPopover(null)}
                                />
                            }
                            trigger="click"
                            open={openPopover === 'priority'}
                            onOpenChange={(v) => !v && setOpenPopover(null)}
                            placement="bottomLeft"
                            arrow={false}
                            overlayInnerStyle={{ padding: 0, borderRadius: '10px', boxShadow: '0 8px 24px rgba(0,0,0,0.14)' }}
                        >
                            <button
                                type="button"
                                className="flex h-[26px] w-[26px] items-center justify-center rounded text-[#9ca3af] hover:bg-[#f3f4f6] hover:text-[#6b7280] transition-colors"
                                title="Priority"
                                onClick={(e) => { e.stopPropagation(); setOpenPopover('priority'); }}
                            >
                                {priority && priority !== 'Normal' ? (
                                    <Flag size={13} fill={PRIORITY_COLORS[priority]} color={PRIORITY_COLORS[priority]} />
                                ) : (
                                    <Flag size={14} />
                                )}
                            </button>
                        </Popover>
                    </div>

                    {/* Spacer matching "Add field" plus sign */}
                    <div className="w-9 shrink-0" />
                </div>
            </div>
        );
    }

    /* ── PASSIVE: "+ Add Task" row ──────────────────────────────── */
    return (
        <div
            className="flex min-h-[34px] cursor-pointer items-center gap-1.5 pl-[34px] text-[13px] text-[#9ca3af] transition-colors hover:text-[#374151]"
            onClick={onActivate}
        >
            <Plus size={14} strokeWidth={2.5} />
            <span>Add Task</span>
        </div>
    );
}
