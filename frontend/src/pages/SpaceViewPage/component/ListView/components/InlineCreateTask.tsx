import React, { useEffect, useRef } from 'react';
import { CheckCircle2, Plus } from 'lucide-react';

interface InlineCreateTaskProps {
    isActive: boolean;
    text: string;
    onChangeText: (val: string) => void;
    onActivate: () => void;
    onCancel: () => void;
    onSubmit: () => void;
    color?: string;
}

export default function InlineCreateTask({
    isActive,
    text,
    onChangeText,
    onActivate,
    onCancel,
    onSubmit,
    color = '#0058be',
}: InlineCreateTaskProps) {
    const inlineRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        if (isActive) {
            setTimeout(() => inlineRef.current?.focus(), 50);
        }
    }, [isActive]);

    if (isActive) {
        return (
            <div 
                className="mt-0.5 flex items-center gap-2 rounded-md border bg-[#f8fbff] px-3.5 py-1.5"
                style={{ borderColor: color }}
            >
                <CheckCircle2 size={16} className="shrink-0 text-[#dcdfe4]" />
                <input
                    ref={inlineRef}
                    className="flex-1 border-none bg-transparent text-[13px] font-medium text-[#141b2b] outline-none placeholder:text-[#c2c9e0]"
                    value={text}
                    onChange={(e) => onChangeText(e.target.value)}
                    placeholder="Task name"
                    onKeyDown={(e) => {
                        if (e.key === 'Enter') onSubmit();
                        if (e.key === 'Escape') onCancel();
                    }}
                    onBlur={onSubmit}
                />
            </div>
        );
    }

    return (
        <div
            className="flex cursor-pointer items-center gap-1.5 rounded px-3.5 py-2 text-xs font-semibold text-[#9aa0a6] transition-all duration-150 hover:bg-[#f0f4ff] hover:text-[#0058be]"
            onClick={onActivate}
        >
            <Plus size={13} /> Add Task
        </div>
    );
}
