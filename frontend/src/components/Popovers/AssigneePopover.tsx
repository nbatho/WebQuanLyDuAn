import { useState } from 'react';
import { Search, Users } from 'lucide-react';
import { Avatar } from 'antd';

export interface AssigneePopoverProps {
    assignees: string[];
    onSave: (newAssignees: string[]) => void;
    onClose: () => void;
}

const mockPeople = [
    { id: 'Me', name: 'Me', initials: 'M', color: '#1a1a1a' },
    { id: 'AR', name: 'Alina R', initials: 'AR', color: '#0058be' },
    { id: 'MC', name: 'Marcus Chen', initials: 'MC', color: '#f0a220' },
    { id: 'Fadasd', name: 'fadasd', initials: 'F', color: '#0058be' },
    { id: 'SJ', name: 'Steve Jobs', initials: 'SJ', color: '#7c5cfc' },
    { id: 'ER', name: 'Emily', initials: 'ER', color: '#e84393' },
];

export default function AssigneePopover({ assignees, onSave, onClose }: AssigneePopoverProps) {
    const [search, setSearch] = useState('');

    const toggleAssignee = (id: string) => {
        if (assignees.includes(id)) {
            onSave(assignees.filter(a => a !== id));
        } else {
            onSave([...assignees, id]);
        }
        // Remove onClose() here so we can select/deselect multiple people without reopening
    };

    const filtered = mockPeople.filter(p => p.name.toLowerCase().includes(search.toLowerCase()));

    const assignedPeople = filtered.filter(p => assignees.includes(p.id));
    const unassignedPeople = filtered.filter(p => !assignees.includes(p.id));

    return (
        <div className="flex w-65 flex-col rounded-xl bg-white p-2 text-[#141b2b] shadow-sm">
            <div className="relative mb-2">
                <Search size={14} className="absolute left-2.5 top-2.5 text-[#9aa0a6]" />
                <input
                    type="text"
                    placeholder="Search or enter email..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="w-full rounded border border-[#dcdfe4] bg-white pb-1.5 pl-8 pr-2 pt-1.5 text-[13px] outline-none transition-colors hover:border-[#b0b5c1] focus:border-[#0058be]"
                    autoFocus
                />
            </div>

            <div className="flex flex-col gap-0.5 mb-1">
                {assignedPeople.length > 0 && (
                    <>
                        <div className="mb-0.5 px-2 pb-1 pt-2 text-[11px] font-bold text-[#5f6368]">
                            Assignees
                        </div>
                        {assignedPeople.map(p => (
                            <div
                                key={p.id}
                                className="group flex w-full items-center justify-between gap-2 rounded-md px-2 py-1.5 text-[13px] transition-colors hover:bg-[#f8fafb]"
                            >
                                <div className="flex items-center gap-2 min-w-0 flex-1">
                                    <div className="relative cursor-pointer" onClick={() => toggleAssignee(p.id)}>
                                        <Avatar size={24} style={{ backgroundColor: p.color, fontSize: '10px' }}>
                                            {p.initials}
                                        </Avatar>
                                        <div className="absolute -bottom-0.5 -right-0.5 flex h-4 w-4 items-center justify-center rounded-full border-2 border-white bg-[#e74c3c] text-white opacity-0 group-hover:opacity-100 transition-opacity">
                                            <span style={{ fontSize: '10px', lineHeight: '10px', height: '10px' }}>×</span>
                                        </div>
                                    </div>
                                    <span className="flex-1 truncate">{p.name}</span>
                                </div>
                            </div>
                        ))}
                    </>
                )}

                <div className="mb-0.5 px-2 pb-1 pt-2 text-[11px] font-bold text-[#5f6368]">
                    People
                </div>
                {unassignedPeople.map(p => (
                    <button
                        key={p.id}
                        className="flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-left text-[13px] transition-colors hover:bg-[#f8fafb]"
                        onClick={() => toggleAssignee(p.id)}
                    >
                        <Avatar size={24} style={{ backgroundColor: p.color, fontSize: '10px' }}>
                            {p.initials}
                        </Avatar>
                        <span className="flex-1 truncate">{p.name}</span>
                    </button>
                ))}

                <button className="mt-1 flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-left text-[13px] text-[#5f6368] transition-colors hover:bg-[#f8fafb]">
                    <div className="flex h-6 w-6 items-center justify-center rounded-full border border-dashed border-[#b0b5c1] bg-[#f8fbff]">
                        <Users size={12} color="#9aa0a6" />
                    </div>
                    <span>Invite people via email</span>
                </button>
            </div>
        </div>
    );
}
