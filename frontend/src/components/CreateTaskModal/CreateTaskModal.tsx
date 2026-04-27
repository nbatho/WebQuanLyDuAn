import { useState, useRef, useEffect } from 'react';
import {
    X, ChevronDown, Calendar, Flag, User, AlignLeft,
    Paperclip, FolderOpen, Hash
} from 'lucide-react';
import type { NewTaskData } from '@/types/tasks';
import { useSelector } from 'react-redux';
import type { RootState } from '@/store/configureStore';

interface CreateTaskModalProps {
    isOpen: boolean;
    onClose: () => void;
    onCreate: (data: NewTaskData) => void;

    groups: { id: number; name: string; color: string }[];

    lists: { id: number; name: string }[];
    defaultListId?: number;
}

const PRIORITY_OPTIONS = [
    { value: 'Urgent', label: 'Urgent', color: '#ef4444' },
    { value: 'High', label: 'High', color: '#f59e0b' },
    { value: 'Normal', label: 'Normal', color: '#3b82f6' },
    { value: 'Low', label: 'Low', color: '#8b5cf6' },
    { value: 'Clear', label: 'Clear', color: '#9ca3af' },
];

export default function CreateTaskModal({
    isOpen, onClose, onCreate,
    groups = [], 
    lists = [],
    defaultListId
}: CreateTaskModalProps) {

    const [name, setName] = useState('');
    const [description, setDescription] = useState('');

    const [statusId, setStatusId] = useState<number>(0);

    const [priority, setPriority] = useState<string>('Normal');
    const [dueDate, setDueDate] = useState<string | null>(null);
    const [assigneeIds, setAssigneeIds] = useState<number[]>([]);
    const [listId, setListId] = useState<number | undefined>(defaultListId);

    const [activeDropdown, setActiveDropdown] = useState<'status' | 'priority' | 'assignee' | 'list' | null>(null);

    const titleRef = useRef<HTMLInputElement>(null);
    const listMembers = useSelector((state: RootState) => state.workspaces.listWorkspaceMembers);

    useEffect(() => {
        if (isOpen) {
            setName('');
            setDescription('');
            setStatusId(groups.length > 0 ? groups[0].id : 0);
            setPriority('Normal');
            setDueDate(null);
            setAssigneeIds([]);
            setListId(defaultListId || (lists.length > 0 ? lists[0].id : undefined));
            setTimeout(() => titleRef.current?.focus(), 100);
        }
    }, [isOpen, defaultListId, lists, groups]);

    if (!isOpen) return null;

    const currentStatus = groups.find(s => s.id === statusId) || groups[0] || { id: 0, name: 'No Status', color: '#ccc' };
    const currentPriority = PRIORITY_OPTIONS.find(p => p.value === priority) || PRIORITY_OPTIONS[2];

    const handleCreate = () => {
        if (!name.trim() || !listId || !statusId) return;

        onCreate({
            name: name.trim(),
            description: description.trim() || null,
            list_id: listId,
            status_id: statusId,
            priority: priority,
            due_date: dueDate ? new Date(dueDate).toISOString() : null,
            assignee_ids: assigneeIds,
        });

        onClose();
    };

    const toggleAssignee = (id: number) => {
        setAssigneeIds(prev => prev.includes(id) ? prev.filter(a => a !== id) : [...prev, id]);
    };

    return (
        <div className="fixed inset-0 z-2000 flex items-center justify-center bg-black/50 backdrop-blur-sm" onClick={onClose}>
            <div className="flex w-145 max-w-[95vw] flex-col rounded-xl bg-white shadow-2xl" onClick={e => { e.stopPropagation(); setActiveDropdown(null); }}>
                <div className="flex items-center justify-between border-b border-[#eef0f5] px-5 py-4">
                    <div className="flex items-center gap-2">
                        <div className="flex h-6 w-6 items-center justify-center rounded bg-[#f0f4ff] text-[#0058be]">
                            <Hash size={14} />
                        </div>
                        <span className="text-sm font-bold text-[#141b2b]">Tạo Task Mới</span>
                    </div>
                    <button onClick={onClose} className="text-[#9aa0a6] hover:text-[#5f6368] cursor-pointer"><X size={20} /></button>
                </div>

                <div className="flex items-center gap-2 border-b border-[#f8f9fc] bg-[#fcfdfe] px-5 py-2.5">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-[#9aa0a6]">Danh mục:</span>
                    <div className="relative" onClick={e => e.stopPropagation()}>
                        <button className="flex items-center gap-1.5 rounded-md border border-[#eef0f5] bg-white px-2.5 py-1 text-xs font-semibold text-[#141b2b] hover:border-[#dcdfe4]" onClick={() => setActiveDropdown(activeDropdown === 'list' ? null : 'list')}>
                            <FolderOpen size={13} className="text-[#0058be]" />
                            {lists.find(l => l.id === listId)?.name || 'Chọn danh sách'}
                            <ChevronDown size={12} />
                        </button>
                        {activeDropdown === 'list' && (
                            <div className="absolute left-0 top-full z-20 mt-1 w-48 rounded-lg border border-[#eef0f5] bg-white p-1 shadow-xl">
                                {lists.map(l => (
                                    <button key={l.id} className={`flex w-full items-center gap-2 rounded-md px-2.5 py-2 text-left text-xs font-medium hover:bg-[#f0f4ff] ${listId === l.id ? 'bg-[#f0f4ff] text-[#0058be]' : ''}`} onClick={() => { setListId(l.id); setActiveDropdown(null); }}>
                                        {l.name}
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>
                </div>

                <div className="px-6 py-4">
                    <input ref={titleRef} className="mb-2 w-full border-none text-xl font-bold text-[#141b2b] outline-none placeholder:text-[#c2c9e0]" value={name} onChange={e => setName(e.target.value)} placeholder="Tên công việc..." />
                    <div className="flex items-start gap-2">
                        <AlignLeft size={16} className="mt-1 text-[#c2c9e0]" />
                        <textarea className="w-full resize-none border-none text-[13px] leading-6 text-[#5f6368] outline-none placeholder:text-[#c2c9e0]" value={description} onChange={e => setDescription(e.target.value)} placeholder="Thêm mô tả chi tiết..." rows={3} />
                    </div>
                </div>

                <div className="flex flex-wrap items-center gap-2 border-t border-[#f8f9fc] px-6 py-3">
                    <div className="relative" onClick={e => e.stopPropagation()}>
                        <button className="flex items-center gap-1.5 rounded-full border border-[#eef0f5] px-3 py-1.5 text-xs font-semibold text-[#5f6368] hover:bg-[#f8fafb]" onClick={() => setActiveDropdown('status')}>
                            <div className="h-2 w-2 rounded-full" style={{ backgroundColor: currentStatus.color }} />
                            {currentStatus.name}
                        </button>
                        {activeDropdown === 'status' && (
                            <div className="absolute bottom-full left-0 mb-1 w-40 rounded-lg border border-[#eef0f5] bg-white p-1 shadow-xl">
                                {groups.map(s => (
                                    <button key={s.id} className="flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-left text-xs font-medium hover:bg-[#f0f4ff]" onClick={() => { setStatusId(s.id); setActiveDropdown(null); }}>
                                        <div className="h-2 w-2 rounded-full" style={{ backgroundColor: s.color }} /> {s.name}
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>

                    <div className="relative" onClick={e => e.stopPropagation()}>
                        <button className="flex items-center gap-1.5 rounded-full border border-[#eef0f5] px-3 py-1.5 text-xs font-semibold text-[#5f6368] hover:bg-[#f8fafb]" onClick={() => setActiveDropdown('assignee')}>
                            <User size={14} /> {assigneeIds.length > 0 ? `${assigneeIds.length} người` : 'Giao cho'}
                        </button>
                        {activeDropdown === 'assignee' && (
                            <div className="absolute bottom-full left-0 mb-1 w-52 rounded-lg border border-[#eef0f5] bg-white p-1 shadow-xl">
                                {listMembers.map(m => (
                                    <button key={m.user_id} className="flex w-full items-center gap-2 rounded-md px-2 py-2 text-left text-xs font-medium hover:bg-[#f0f4ff]" onClick={() => toggleAssignee(m.user_id)}>
                                        <span className="flex h-5 w-5 items-center justify-center rounded-full text-[9px] text-white" style={{ backgroundColor: 'black' }}>{m.user_id}</span>
                                        {m.username} {assigneeIds.includes(m.user_id) && <span className="ml-auto text-[#0058be]">✓</span>}
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>

                    <div className="relative" onClick={e => e.stopPropagation()}>
                        <button className="flex items-center gap-1.5 rounded-full border border-[#eef0f5] px-3 py-1.5 text-xs font-semibold hover:bg-[#f8fafb]" style={{ color: currentPriority.color }} onClick={() => setActiveDropdown('priority')}>
                            <Flag size={14} fill={priority !== 'Clear' ? currentPriority.color : 'none'} /> {currentPriority.label}
                        </button>
                        {activeDropdown === 'priority' && (
                            <div className="absolute bottom-full left-0 mb-1 w-40 rounded-lg border border-[#eef0f5] bg-white p-1 shadow-xl">
                                {PRIORITY_OPTIONS.map(p => (
                                    <button key={p.value} className="flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-left text-xs font-medium hover:bg-[#f0f4ff]" onClick={() => { setPriority(p.value); setActiveDropdown(null); }}>
                                        <Flag size={13} color={p.color} fill={p.value !== 'Clear' ? p.color : 'none'} /> {p.label}
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>

                    <div className="relative flex items-center gap-1.5 rounded-full border border-[#eef0f5] px-3 py-1.5 text-xs font-semibold text-[#5f6368] hover:bg-[#f8fafb]">
                        <Calendar size={14} />
                        <input type="date" className="absolute inset-0 opacity-0 cursor-pointer" onChange={e => setDueDate(e.target.value)} />
                        {dueDate || 'Hạn chót'}
                    </div>
                </div>

                <div className="flex items-center justify-between border-t border-[#eef0f5] bg-[#fcfdfe] px-6 py-4">
                    <button className="flex items-center gap-1.5 text-xs font-bold text-[#9aa0a6] hover:text-[#5f6368] cursor-pointer">
                        <Paperclip size={14} /> Đính kèm file
                    </button>
                    <div className="flex gap-2">
                        <button onClick={onClose} className="rounded-md border border-[#eef0f5] px-4 py-2 text-[13px] font-bold text-[#5f6368] hover:bg-[#f8fafb] cursor-pointer">Hủy</button>
                        <button onClick={handleCreate} disabled={!name.trim() || !listId || !statusId} className="rounded-md bg-[#0058be] px-6 py-2 text-[13px] font-bold text-white shadow-lg shadow-blue-100 hover:bg-[#004aab] disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer">
                            Tạo công việc
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}