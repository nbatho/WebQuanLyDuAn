import { Flag, X } from 'lucide-react';

export interface PriorityPopoverProps {
    priority_id: number | null;
    onSave: (id: number | null, name: string | null, color: string | null) => void;
    onClose: () => void;
}

const PRIORITIES = [
    { id: 2, label: 'Urgent', color: '#f50000' },
    { id: 1, label: 'High', color: '#ffcc00' },
    { id: null, label: 'Normal', color: '#4285f4' },
    { id: 3, label: 'Low', color: '#d1d5db' },
];

export default function PriorityPopover({ priority_id, onSave, onClose }: PriorityPopoverProps) {
    const handleSelect = (id: number | null, label: string | null, color: string | null) => {
        onSave(id, label, color); onClose();
    };

    return (
        <div className="flex w-56 flex-col overflow-hidden rounded-xl bg-white py-2 shadow-[0_8px_32px_rgba(0,0,0,0.14)]">
            <div className="mb-1 px-3 pt-1 text-[11px] font-semibold text-[#9ca3af] uppercase tracking-wide">Priority</div>
            <div className="flex flex-col">
                {PRIORITIES.map((p) => {
                    const isActive = priority_id === p.id;
                    return (
                        <button key={p.label} className={`flex items-center gap-2.5 px-3 py-1.75 text-left text-[13px] hover:bg-[#f5f6f8] ${isActive ? 'bg-[#f5f6f8] font-semibold' : ''}`} onClick={() => handleSelect(p.id, p.label, p.color)}>
                            <Flag size={14} fill={p.label === 'Low' ? 'transparent' : p.color} color={p.color} />
                            <span className="text-[#374151]">{p.label}</span>
                        </button>
                    );
                })}
                <button className="flex items-center gap-2.5 px-3 py-1.75 text-[13px] text-[#374151] hover:bg-[#f5f6f8]" onClick={() => handleSelect(null, null, null)}>
                    <div className="flex h-3.5 w-3.5 items-center justify-center rounded-full border border-[#d1d5db]"><X size={8} className="text-[#9ca3af]" /></div>
                    Clear
                </button>
            </div>
        </div>
    );
}