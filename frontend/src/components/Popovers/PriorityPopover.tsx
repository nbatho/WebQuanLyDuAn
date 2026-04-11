import { Flag, Sparkles } from 'lucide-react';

export interface PriorityPopoverProps {
    priority: string;
    onSave: (prio: string, color: string) => void;
    onClose: () => void;
}

const PRIORITIES = [
    { label: 'Urgent', color: '#f50000', bgColor: '#fff0f0' },
    { label: 'High', color: '#ffcc00', bgColor: '#fffce6' },
    { label: 'Normal', color: '#4285f4', bgColor: '#f0f4ff' },
    { label: 'Low', color: '#87909e', bgColor: '#f6f7f9' },
];

export default function PriorityPopover({ priority, onSave, onClose }: PriorityPopoverProps) {
    const handleSelect = (label: string, color: string, isClear = false) => {
        if (isClear) {
            onSave('Normal', '#00b894'); // Default back to Flowise green or clear
        } else {
            onSave(label, color);
        }
        onClose();
    };

    return (
        <div className="flex w-52.5 flex-col rounded-xl bg-white p-2">
            <div className="mb-1 px-2 pt-1 text-[11px] font-semibold text-[#9aa0a6]">
                Priority
            </div>
            
            <div className="flex flex-col gap-0.5">
                {PRIORITIES.map(p => {
                    const isActive = priority === p.label;
                    return (
                        <button
                            key={p.label}
                            className="flex w-full items-center gap-3 rounded-md px-2 py-1.5 text-left text-[13px] font-medium transition-colors hover:bg-[#f8fafb]"
                            onClick={() => handleSelect(p.label, p.color)}
                        >
                            <Flag size={14} fill={p.color} color={p.color} />
                            <span className={isActive ? 'font-bold' : ''}>{p.label}</span>
                        </button>
                    );
                })}
            </div>

            <div className="my-1 h-px bg-[#eef0f5]" />

            <button
                className="flex w-full items-center gap-3 rounded-md px-2 py-1.5 text-left text-[13px] text-[#5f6368] hover:bg-[#f8fafb]"
                onClick={() => handleSelect('Clear', '#dcdfe4', true)}
            >
                <div className="flex h-3.5 w-3.5 items-center justify-center rounded-full border border-[#9aa0a6]">
                    <div className="h-0.5 w-2 rotate-45 bg-[#9aa0a6]" />
                </div>
                <span>Clear</span>
            </button>

            <div className="mt-2 text-center">
                <button className="flex w-full cursor-pointer items-center justify-center gap-1.5 rounded-md border border-[#eef0f5] bg-transparent py-1.5 text-[13px] font-semibold text-[#5f6368] hover:bg-[#f8fafb]" onClick={onClose}>
                    <Sparkles size={14} color="#7c5cfc" /> Prioritize with AI
                </button>
            </div>
        </div>
    );
}
