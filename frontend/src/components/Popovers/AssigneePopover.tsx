import { useState } from 'react';
import { Search } from 'lucide-react';
import { Avatar } from 'antd';
import type { Assignee } from '@/types/tasks';

export interface AssigneePopoverProps {
    assignees: Assignee[];
    onSave: (newAssignees: Assignee[]) => void;
    onClose: () => void;
}

const MOCK_PEOPLE: Assignee[] = [
    { user_id: 1, name: 'Nguyễn Văn A', avatar_url: null },
    { user_id: 2, name: 'Trần Thị B', avatar_url: null },
    { user_id: 3, name: 'Lê Văn C', avatar_url: null },
];

export default function AssigneePopover({ assignees, onSave }: AssigneePopoverProps) {
    const [search, setSearch] = useState('');

    const toggleAssignee = (person: Assignee) => {
        const isExists = assignees.some(a => a.user_id === person.user_id);
        if (isExists) {
            onSave(assignees.filter(a => a.user_id !== person.user_id));
        } else {
            onSave([...assignees, person]);
        }
    };

    const filtered = MOCK_PEOPLE.filter(p => p.name.toLowerCase().includes(search.toLowerCase()));

    const getInitials = (name: string) => {
        const parts = name.split(' ');
        return parts.length >= 2 ? (parts[0][0] + parts[parts.length - 1][0]).toUpperCase() : name.substring(0, 2).toUpperCase();
    };

    return (
        <div className="flex w-60 flex-col overflow-hidden rounded-xl bg-white shadow-[0_8px_32px_rgba(0,0,0,0.14)]">
            <div className="p-2 pb-1">
                <div className="relative">
                    <Search size={13} className="absolute left-2.5 top-2.5 text-[#9ca3af]" />
                    <input type="text" placeholder="Search..." value={search} onChange={(e) => setSearch(e.target.value)} className="w-full rounded-md border border-[#e5e7eb] py-2 pl-8 pr-2 text-[12px] outline-none focus:border-[#7c68ee]" autoFocus />
                </div>
            </div>
            <div className="px-1 py-1">
                <div className="px-2 pb-1 pt-0.5 text-[11px] font-semibold text-[#9ca3af]">People</div>
                {filtered.map((p) => {
                    const isSelected = assignees.some(a => a.user_id === p.user_id);
                    return (
                        <button key={p.user_id} className={`flex w-full items-center gap-2.5 rounded-md px-2 py-1.75text-left hover:bg-[#f5f6f8] ${isSelected ? 'bg-[#f5f6f8]' : ''}`} onClick={() => toggleAssignee(p)}>
                            <Avatar size={24} src={p.avatar_url} style={{ backgroundColor: '#7c68ee', fontSize: '10px', fontWeight: 700 }}>
                                {!p.avatar_url && getInitials(p.name)}
                            </Avatar>
                            <span className={`flex-1 truncate text-[13px] ${isSelected ? 'font-semibold text-[#374151]' : 'text-[#374151]'}`}>{p.name}</span>
                            {isSelected && <div className="h-1.75w-1.75rounded-full bg-[#7c68ee]" />}
                        </button>
                    );
                })}
            </div>
        </div>
    );
}