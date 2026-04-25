import { Flag, Sparkles, User, X } from 'lucide-react';

export interface PriorityPopoverProps {
    priority: string;
    onSave: (prio: string, color: string) => void;
    onClose: () => void;
}

const PRIORITIES = [
    { label: 'Urgent', color: '#f50000' },
    { label: 'High',   color: '#ffaa00' },
    { label: 'Normal', color: '#4285f4' },
    { label: 'Low',    color: '#d1d5db' },
];

// Mock "personal priorities" avatars (same as ClickUp's MD, NT, TB)
const PERSONAL_AVATARS = [
    { initials: 'MD', color: '#1a1a1a' },
    { initials: 'NT', color: '#374151' },
    { initials: 'TB', color: '#7c68ee' },
];

export default function PriorityPopover({ priority, onSave, onClose }: PriorityPopoverProps) {
    const handleSelect = (label: string, color: string) => {
        onSave(label, color);
        onClose();
    };

    return (
        <div className="flex w-56 flex-col overflow-hidden rounded-xl bg-white py-2 shadow-[0_8px_32px_rgba(0,0,0,0.14)]">
            {/* Section label */}
            <div className="mb-1 px-3 pt-1 text-[11px] font-semibold text-[#9ca3af] uppercase tracking-wide">
                Priority
            </div>

            {/* Priority options */}
            <div className="flex flex-col">
                {PRIORITIES.map((p) => {
                    const isActive = priority === p.label;
                    return (
                        <button
                            key={p.label}
                            className={`flex items-center gap-2.5 px-3 py-[7px] text-left text-[13px] font-medium transition-colors hover:bg-[#f5f6f8] ${isActive ? 'bg-[#f5f6f8]' : ''}`}
                            onClick={() => handleSelect(p.label, p.color)}
                        >
                            <Flag
                                size={14}
                                fill={p.label === 'Low' ? 'transparent' : p.color}
                                color={p.color}
                            />
                            <span className={`text-[#374151] ${isActive ? 'font-semibold' : ''}`}>
                                {p.label}
                            </span>
                        </button>
                    );
                })}

                {/* Clear */}
                <button
                    className="flex items-center gap-2.5 px-3 py-[7px] text-left text-[13px] font-medium text-[#374151] transition-colors hover:bg-[#f5f6f8]"
                    onClick={() => { onSave('', ''); onClose(); }}
                >
                    <div className="flex h-[14px] w-[14px] items-center justify-center rounded-full border border-[#d1d5db]">
                        <X size={8} className="text-[#9ca3af]" />
                    </div>
                    Clear
                </button>
            </div>

            <div className="my-1.5 h-px bg-[#f0f1f3]" />

            {/* Prioritize with AI */}
            <button
                className="mx-2 mb-1.5 flex items-center justify-center gap-1.5 rounded-md py-[6px] text-[12px] font-medium text-[#6b7280] transition-colors hover:bg-[#f5f6f8]"
                onClick={onClose}
            >
                <Sparkles size={13} color="#7c68ee" />
                Prioritize with AI
            </button>

            <div className="mx-3 h-px bg-[#f0f1f3]" />

            {/* Add to Personal Priorities */}
            <div className="px-3 pt-2 pb-1">
                <div className="mb-2 text-[11px] font-semibold text-[#9ca3af]">
                    Add to Personal Priorities
                </div>
                <div className="flex items-center gap-1.5">
                    {PERSONAL_AVATARS.map((a) => (
                        <button
                            key={a.initials}
                            className="flex h-7 w-7 items-center justify-center rounded-full text-[10px] font-bold text-white hover:ring-2 hover:ring-[#7c68ee] hover:ring-offset-1 transition-all"
                            style={{ backgroundColor: a.color }}
                            title={a.initials}
                        >
                            {a.initials}
                        </button>
                    ))}
                    {/* Add more */}
                    <button className="flex h-7 w-7 items-center justify-center rounded-full border border-dashed border-[#d1d5db] text-[#9ca3af] hover:border-[#7c68ee] hover:text-[#7c68ee] transition-colors">
                        <User size={13} />
                    </button>
                </div>
            </div>
        </div>
    );
}
