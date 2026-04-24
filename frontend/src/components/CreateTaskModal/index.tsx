import { useState, useRef, useEffect } from 'react';
import {
    X, ChevronDown, Calendar, Flag, User, AlignLeft,
    Paperclip, FolderOpen, Hash
} from 'lucide-react';
import type { CreateTaskModalProps } from '@/types/modal';
import { STATUS_OPTIONS, PRIORITY_OPTIONS, MEMBER_OPTIONS } from '../constants/taskOptions';



export default function CreateTaskModal({ isOpen, onClose, onCreate, defaultStatus, lists = [], defaultListId }: CreateTaskModalProps) {
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [status, setStatus] = useState(defaultStatus || 'TO DO');
    const [priority, setPriority] = useState('Normal');
    const [dueDate, setDueDate] = useState('');
    const [assignees, setAssignees] = useState<string[]>([]);
    const [listId, setListId] = useState<number | undefined>(defaultListId || (lists.length > 0 ? lists[0].id : undefined));

    // Dropdown states
    const [showStatus, setShowStatus] = useState(false);
    const [showPriority, setShowPriority] = useState(false);
    const [showAssignee, setShowAssignee] = useState(false);
    const [showList, setShowList] = useState(false);

    const titleRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        if (isOpen) {
            setName('');
            setDescription('');
            setStatus(defaultStatus || 'TO DO');
            setPriority('Normal');
            setDueDate('');
            setAssignees([]);
            setListId(defaultListId || (lists.length > 0 ? lists[0].id : undefined));
            setTimeout(() => titleRef.current?.focus(), 100);
        }
    }, [isOpen, defaultStatus, defaultListId, lists]);

    if (!isOpen) return null;

    const statusObj = STATUS_OPTIONS.find(s => s.value === status) || STATUS_OPTIONS[0];
    const priorityObj = PRIORITY_OPTIONS.find(p => p.value === priority) || PRIORITY_OPTIONS[2];

    const handleCreate = () => {
        if (!name.trim() || !listId) return;
        onCreate({
            name: name.trim(),
            status,
            statusColor: statusObj.color,
            priority,
            priorityColor: priorityObj.color,
            due_date: dueDate || null,
            assignees,
            description,
            listId,
        });
        onClose();
    };

    const toggleAssignee = (id: string) => {
        setAssignees(prev => prev.includes(id) ? prev.filter(a => a !== id) : [...prev, id]);
    };

    const closeAllDropdowns = () => {
        setShowStatus(false);
        setShowPriority(false);
        setShowAssignee(false);
        setShowList(false);
    };

    return (
        <div className="fixed inset-0 z-2000 flex items-center justify-center bg-[rgba(20,27,43,0.5)]" onClick={onClose}>
            <div
                className="flex w-145 max-w-[95vw] flex-col rounded-xl bg-white shadow-[0_16px_48px_rgba(0,0,0,0.2)]"
                onClick={e => { e.stopPropagation(); closeAllDropdowns(); }}
            >
                {/* Header */}
                <div className="flex items-center justify-between border-b border-[#eef0f5] px-4.5 py-3.5">
                    <div className="flex items-center gap-2">
                        <Hash size={16} className="text-[#0058be]" />
                        <span className="text-sm font-bold text-[#141b2b]">Create Task</span>
                    </div>
                    <button
                        className="flex cursor-pointer items-center rounded-md border-none bg-transparent p-1 text-[#9aa0a6] hover:bg-[#f0f2f5] hover:text-[#5f6368]"
                        onClick={onClose}
                    >
                        <X size={18} />
                    </button>
                </div>

                {/* List selector */}
                <div className="flex items-center gap-1.5 border-b border-[#f8f9fc] px-4.5 py-2.5 text-xs text-[#9aa0a6]">
                    <FolderOpen size={14} />
                    <span className="font-medium">in</span>
                    <div className="relative" onClick={e => e.stopPropagation()}>
                        <button
                            className="flex cursor-pointer items-center gap-1 rounded-md border border-[#eef0f5] bg-transparent px-2.5 py-0.75 text-xs font-semibold text-[#141b2b] hover:border-[#dcdfe4] hover:bg-[#f8fafb]"
                            onClick={() => { closeAllDropdowns(); setShowList(!showList); }}
                        >
                            {lists.find(l => l.id === listId)?.name || 'Select List'} <ChevronDown size={12} />
                        </button>
                        {showList && (
                            <div className="absolute left-0 top-[calc(100%+4px)] z-10 min-w-45 rounded-lg border border-[#eef0f5] bg-white p-1 shadow-[0_6px_20px_rgba(0,0,0,0.12)]">
                                {lists.length > 0 ? lists.map(l => (
                                    <button
                                        key={l.id}
                                        className={`flex w-full cursor-pointer items-center gap-2 rounded-md border-none px-2.5 py-1.75 text-left text-xs font-semibold ${listId === l.id ? 'bg-[#f0f4ff] text-[#0058be]' : 'bg-transparent text-[#141b2b] hover:bg-[#f0f4ff]'
                                            }`}
                                        onClick={() => { setListId(l.id); setShowList(false); }}>
                                        <FolderOpen size={13} /> {l.name}
                                    </button>
                                )) : (
                                    <div className="px-2.5 py-1.75 text-xs text-[#9aa0a6]">No lists available</div>
                                )}
                            </div>
                        )}
                    </div>
                </div>

                {/* Title input */}
                <div className="px-4.5 pb-2 pt-4">
                    <input
                        ref={titleRef}
                        className="w-full border-none text-lg font-bold text-[#141b2b] outline-none"
                        value={name}
                        onChange={e => setName(e.target.value)}
                        placeholder="Task name"
                        onKeyDown={e => { if (e.key === 'Enter' && name.trim()) handleCreate(); }}
                    />
                </div>

                {/* Description */}
                <div className="flex items-start gap-2 px-4.5 pb-3 pt-1">
                    <AlignLeft size={14} className="mt-1.5 shrink-0 text-[#c2c9e0]" />
                    <textarea
                        className="min-h-10 flex-1 resize-y border-none text-[13px] leading-6 text-[#5f6368] outline-none"
                        value={description}
                        onChange={e => setDescription(e.target.value)}
                        placeholder="Add description..."
                        rows={3}
                    />
                </div>

                {/* Fields row */}
                <div className="flex flex-wrap items-center gap-1.5 border-t border-[#f8f9fc] px-4.5 py-2.5">
                    {/* Status */}
                    <div className="relative" onClick={e => e.stopPropagation()}>
                        <button
                            className="flex cursor-pointer items-center gap-1.25 whitespace-nowrap rounded-md border border-[#eef0f5] bg-transparent px-2.5 py-1.25 text-xs font-semibold text-[#5f6368] transition-all hover:border-[#dcdfe4] hover:bg-[#f8fafb]"
                            onClick={() => { closeAllDropdowns(); setShowStatus(!showStatus); }}
                        >
                            <span className="h-2 w-2 shrink-0 rounded-full" style={{ backgroundColor: statusObj.color }} />
                            {status} <ChevronDown size={11} />
                        </button>
                        {showStatus && (
                            <div className="absolute left-0 top-[calc(100%+4px)] z-10 min-w-45 rounded-lg border border-[#eef0f5] bg-white p-1 shadow-[0_6px_20px_rgba(0,0,0,0.12)]">
                                {STATUS_OPTIONS.map(s => (
                                    <button key={s.value}
                                        className={`flex w-full cursor-pointer items-center gap-2 rounded-md border-none px-2.5 py-1.75 text-left text-xs font-semibold ${status === s.value ? 'bg-[#f0f4ff] text-[#0058be]' : 'bg-transparent text-[#141b2b] hover:bg-[#f0f4ff]'
                                            }`}
                                        onClick={() => { setStatus(s.value); setShowStatus(false); }}>
                                        <span className="h-2 w-2 shrink-0 rounded-full" style={{ backgroundColor: s.color }} />
                                        {s.label}
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Assignee */}
                    <div className="relative" onClick={e => e.stopPropagation()}>
                        <button
                            className="flex cursor-pointer items-center gap-1.25 whitespace-nowrap rounded-md border border-[#eef0f5] bg-transparent px-2.5 py-1.25 text-xs font-semibold text-[#5f6368] transition-all hover:border-[#dcdfe4] hover:bg-[#f8fafb]"
                            onClick={() => { closeAllDropdowns(); setShowAssignee(!showAssignee); }}
                        >
                            <User size={13} />
                            {assignees.length > 0 ? `${assignees.length} member${assignees.length > 1 ? 's' : ''}` : 'Assignee'}
                            <ChevronDown size={11} />
                        </button>
                        {showAssignee && (
                            <div className="absolute left-0 top-[calc(100%+4px)] z-10 min-w-55 rounded-lg border border-[#eef0f5] bg-white p-1 shadow-[0_6px_20px_rgba(0,0,0,0.12)]">
                                {MEMBER_OPTIONS.map(m => (
                                    <button key={m.id}
                                        className={`flex w-full cursor-pointer items-center gap-2 rounded-md border-none px-2.5 py-1.75 text-left text-xs font-semibold ${assignees.includes(m.id) ? 'bg-[#f0f4ff] text-[#0058be]' : 'bg-transparent text-[#141b2b] hover:bg-[#f0f4ff]'
                                            }`}
                                        onClick={() => toggleAssignee(m.id)}>
                                        <span
                                            className="flex h-5.5 w-5.5 shrink-0 items-center justify-center rounded-full text-[9px] font-bold text-white"
                                            style={{ backgroundColor: m.color }}
                                        >
                                            {m.id}
                                        </span>
                                        {m.name}
                                        {assignees.includes(m.id) && <span className="ml-auto text-sm text-[#0058be]">✓</span>}
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Due Date */}
                    <div className="relative flex items-center gap-1.25 whitespace-nowrap rounded-md border border-[#eef0f5] bg-transparent px-2.5 py-1.25 text-xs font-semibold text-[#5f6368] transition-all hover:border-[#dcdfe4] hover:bg-[#f8fafb]">
                        <Calendar size={13} />
                        <input
                            type="date"
                            className="absolute inset-0 h-full w-full cursor-pointer opacity-0"
                            value={dueDate}
                            onChange={e => setDueDate(e.target.value)}
                        />
                        {!dueDate && <span className="text-[#9aa0a6]">Due date</span>}
                    </div>

                    {/* Priority */}
                    <div className="relative" onClick={e => e.stopPropagation()}>
                        <button
                            className="flex cursor-pointer items-center gap-1.25 whitespace-nowrap rounded-md border border-[#eef0f5] bg-transparent px-2.5 py-1.25 text-xs font-semibold transition-all hover:border-[#dcdfe4] hover:bg-[#f8fafb]"
                            onClick={() => { closeAllDropdowns(); setShowPriority(!showPriority); }}
                            style={{ color: priorityObj.color }}
                        >
                            <Flag size={13} fill={priority !== 'Normal' ? priorityObj.color : 'none'} />
                            {priority} <ChevronDown size={11} />
                        </button>
                        {showPriority && (
                            <div className="absolute left-0 top-[calc(100%+4px)] z-10 min-w-45 rounded-lg border border-[#eef0f5] bg-white p-1 shadow-[0_6px_20px_rgba(0,0,0,0.12)]">
                                {PRIORITY_OPTIONS.map(p => (
                                    <button key={p.value}
                                        className={`flex w-full cursor-pointer items-center gap-2 rounded-md border-none px-2.5 py-1.75 text-left text-xs font-semibold ${priority === p.value ? 'bg-[#f0f4ff] text-[#0058be]' : 'bg-transparent text-[#141b2b] hover:bg-[#f0f4ff]'
                                            }`}
                                        onClick={() => { setPriority(p.value); setShowPriority(false); }}>
                                        <Flag size={13} fill={p.value !== 'Normal' ? p.color : 'none'} color={p.color} />
                                        {p.value}
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>
                </div>

                {/* Footer */}
                <div className="flex items-center justify-between border-t border-[#eef0f5] px-4.5 py-3">
                    <div className="flex gap-1.5">
                        <button className="flex cursor-pointer items-center gap-1.25 rounded-md border-none bg-transparent px-2 py-1 text-xs font-semibold text-[#9aa0a6] hover:bg-[#f0f2f5] hover:text-[#5f6368]">
                            <Paperclip size={14} /> Attach
                        </button>
                    </div>
                    <div className="flex gap-2">
                        <button
                            className="cursor-pointer rounded-md border border-[#eef0f5] bg-transparent px-4 py-1.5 text-[13px] font-semibold text-[#5f6368] hover:bg-[#f8fafb]"
                            onClick={onClose}
                        >
                            Cancel
                        </button>
                        <button
                            className="cursor-pointer rounded-md border-none bg-[#0058be] px-4.5 py-1.5 text-[13px] font-bold text-white transition-colors hover:bg-[#004aab] disabled:cursor-not-allowed disabled:bg-[#b0c4de]"
                            onClick={handleCreate}
                            disabled={!name.trim() || !listId}
                        >
                            Create Task
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
