import { useState } from 'react';
import { Search, Sparkles, UserPlus, Users } from 'lucide-react';
import { Avatar } from 'antd';

export interface AssigneePopoverProps {
    assignees: string[];
    onSave: (newAssignees: string[]) => void;
    onClose: () => void;
}

const mockPeople = [
    { id: 'MD', name: 'Me',              initials: 'MD', color: '#1a1a1a' },
    { id: 'NT', name: 'Nguyễn Bá Thọ',  initials: 'NT', color: '#374151' },
    { id: 'TB', name: 'Thọ Bá',         initials: 'TB', color: '#7c68ee' },
];

export default function AssigneePopover({ assignees, onSave }: AssigneePopoverProps) {
    const [search, setSearch] = useState('');

    const toggleAssignee = (id: string) => {
        if (assignees.includes(id)) {
            onSave(assignees.filter(a => a !== id));
        } else {
            onSave([...assignees, id]);
        }
    };

    const filtered = mockPeople.filter(p =>
        p.name.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <div className="flex w-[240px] flex-col overflow-hidden rounded-xl bg-white shadow-[0_8px_32px_rgba(0,0,0,0.14)]">
            {/* Search */}
            <div className="p-2 pb-1">
                <div className="relative">
                    <Search size={13} className="absolute left-2.5 top-2.5 text-[#9ca3af]" />
                    <input
                        type="text"
                        placeholder="Search or enter email..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="w-full rounded-md border border-[#e5e7eb] bg-white py-2 pl-8 pr-2 text-[12px] text-[#374151] outline-none placeholder:text-[#9ca3af] focus:border-[#7c68ee]"
                        autoFocus
                    />
                </div>
            </div>

            {/* People section */}
            <div className="px-1 py-1">
                <div className="px-2 pb-1 pt-0.5 text-[11px] font-semibold text-[#9ca3af]">
                    People
                </div>

                {filtered.map((p) => {
                    const isSelected = assignees.includes(p.id);
                    return (
                        <button
                            key={p.id}
                            className={`flex w-full items-center gap-2.5 rounded-md px-2 py-[7px] text-left transition-colors hover:bg-[#f5f6f8] ${isSelected ? 'bg-[#f5f6f8]' : ''}`}
                            onClick={() => toggleAssignee(p.id)}
                        >
                            <Avatar
                                size={24}
                                style={{ backgroundColor: p.color, fontSize: '10px', fontWeight: 700, flexShrink: 0 }}
                            >
                                {p.initials}
                            </Avatar>
                            <span className={`flex-1 truncate text-[13px] ${isSelected ? 'font-semibold text-[#374151]' : 'text-[#374151]'}`}>
                                {p.name}
                            </span>
                            {isSelected && (
                                <div className="h-[7px] w-[7px] rounded-full bg-[#7c68ee]" />
                            )}
                        </button>
                    );
                })}

                {filtered.length === 0 && (
                    <div className="px-2 py-3 text-center text-[12px] text-[#9ca3af]">
                        No results found
                    </div>
                )}

                {/* Invite via email */}
                <button className="flex w-full items-center gap-2.5 rounded-md px-2 py-[7px] text-left transition-colors hover:bg-[#f5f6f8]">
                    <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full border border-dashed border-[#d1d5db]">
                        <UserPlus size={11} className="text-[#9ca3af]" />
                    </div>
                    <span className="text-[13px] text-[#374151]">Invite people via email</span>
                </button>
            </div>

            {/* Agents section */}
            <div className="border-t border-[#f0f1f3] px-1 py-1">
                <div className="px-2 pb-1 pt-0.5 text-[11px] font-semibold text-[#9ca3af]">
                    Agents
                </div>
                <button className="flex w-full items-center gap-2.5 rounded-md px-2 py-[7px] text-left transition-colors hover:bg-[#f5f6f8]">
                    <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full border border-dashed border-[#d1d5db]">
                        <Users size={11} className="text-[#9ca3af]" />
                    </div>
                    <span className="text-[13px] font-medium text-[#374151]">Create Agent</span>
                </button>
            </div>

            {/* Assign with AI */}
            <div className="border-t border-[#f0f1f3] p-2">
                <button className="flex w-full items-center justify-center gap-1.5 rounded-md py-[7px] text-[12px] font-medium text-[#6b7280] transition-colors hover:bg-[#f5f6f8]">
                    <Sparkles size={13} color="#7c68ee" />
                    Assign with AI
                </button>
            </div>
        </div>
    );
}
