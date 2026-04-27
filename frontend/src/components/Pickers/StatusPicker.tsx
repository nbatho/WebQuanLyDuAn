import { useState, useRef, useEffect } from 'react';
import { ChevronDown } from 'lucide-react';
import { STATUS_OPTIONS } from '../constants/taskOptions';

export interface StatusPickerProps {
    value: string;
    onChange: (value: string, color: string) => void;
    /** Render as compact badge (TaskDetail header) or pill button (CreateTask toolbar) */
    variant?: 'badge' | 'pill';
}

export default function StatusPicker({ value, onChange, variant = 'pill' }: StatusPickerProps) {
    const [open, setOpen] = useState(false);
    const ref = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handler = (e: MouseEvent) => {
            if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
        };
        document.addEventListener('mousedown', handler);
        return () => document.removeEventListener('mousedown', handler);
    }, []);

    const current = STATUS_OPTIONS.find((s) => s.value === value) || STATUS_OPTIONS[0];

    return (
        <div className="relative" ref={ref} onClick={(e) => e.stopPropagation()}>
            {variant === 'badge' ? (
                <button
                    className="flex cursor-pointer items-center gap-1 rounded px-2.5 py-0.75 text-[11px] font-extrabold tracking-[0.03em] text-white transition-opacity hover:opacity-85"
                    style={{ backgroundColor: current.color }}
                    onClick={() => setOpen(!open)}
                >
                    {value} <ChevronDown size={11} />
                </button>
            ) : (
                <button
                    className="flex cursor-pointer items-center gap-1.25 whitespace-nowrap rounded-md border border-(--color-border-light) bg-transparent px-2.5 py-1.25 text-xs font-semibold text-(--color-text-secondary) transition-all hover:border-(--color-border) hover:bg-(--color-surface-subtle)"
                    onClick={() => setOpen(!open)}
                >
                    <span className="h-2 w-2 shrink-0 rounded-full" style={{ backgroundColor: current.color }} />
                    {value} <ChevronDown size={11} />
                </button>
            )}

            {open && (
                <div className="absolute left-0 top-[calc(100%+4px) z-20 min-w-45 rounded-lg border border-(--color-border-light) bg-white p-1 shadow-[0_6px_20px_rgba(0,0,0,0.12)">
                    {STATUS_OPTIONS.map((s) => (
                        <button
                            key={s.value}
                            className={`flex w-full cursor-pointer items-center gap-2 rounded-md border-none px-2.5 py-1.5 text-left text-xs font-semibold ${
                                value === s.value
                                    ? 'bg-(--color-primary-bg) text-(--color-primary)'
                                    : 'bg-transparent text-(--color-on-surface) hover:bg-(--color-primary-bg)'
                            }`}
                            onClick={() => {
                                onChange(s.value, s.color);
                                setOpen(false);
                            }}
                        >
                            <span className="h-2 w-2 shrink-0 rounded-full" style={{ backgroundColor: s.color }} />
                            {s.label}
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
}
