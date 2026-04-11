import { useState, useRef, useEffect } from 'react';
import { Flag, ChevronDown } from 'lucide-react';
import { PRIORITY_OPTIONS } from '../constants/taskOptions';

export interface PriorityPickerProps {
    value: string;
    onChange: (value: string, color: string) => void;
}

export default function PriorityPicker({ value, onChange }: PriorityPickerProps) {
    const [open, setOpen] = useState(false);
    const ref = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handler = (e: MouseEvent) => {
            if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
        };
        document.addEventListener('mousedown', handler);
        return () => document.removeEventListener('mousedown', handler);
    }, []);

    const current = PRIORITY_OPTIONS.find((p) => p.value === value) || PRIORITY_OPTIONS[2];

    return (
        <div className="relative" ref={ref} onClick={(e) => e.stopPropagation()}>
            <button
                className="flex cursor-pointer items-center gap-1.25 whitespace-nowrap rounded-md border border-[var(--color-border-light)] bg-transparent px-2.5 py-1.25 text-xs font-semibold transition-all hover:border-[var(--color-border)] hover:bg-[var(--color-surface-subtle)]"
                onClick={() => setOpen(!open)}
                style={{ color: current.color }}
            >
                <Flag size={13} fill={value !== 'Normal' ? current.color : 'none'} />
                {value} <ChevronDown size={11} />
            </button>

            {open && (
                <div className="absolute left-0 top-[calc(100%+4px)] z-20 min-w-45 rounded-lg border border-[var(--color-border-light)] bg-white p-1 shadow-[0_6px_20px_rgba(0,0,0,0.12)]">
                    {PRIORITY_OPTIONS.map((p) => (
                        <button
                            key={p.value}
                            className={`flex w-full cursor-pointer items-center gap-2 rounded-md border-none px-2.5 py-1.5 text-left text-xs font-semibold ${
                                value === p.value
                                    ? 'bg-[var(--color-primary-bg)] text-[var(--color-primary)]'
                                    : 'bg-transparent text-[var(--color-on-surface)] hover:bg-[var(--color-primary-bg)]'
                            }`}
                            onClick={() => {
                                onChange(p.value, p.color);
                                setOpen(false);
                            }}
                        >
                            <Flag size={13} fill={p.value !== 'Normal' ? p.color : 'none'} color={p.color} />
                            {p.value}
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
}
