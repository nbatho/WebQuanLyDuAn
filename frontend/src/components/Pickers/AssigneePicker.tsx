import { useState, useRef, useEffect } from 'react';
import { User, ChevronDown } from 'lucide-react';
import { MEMBER_OPTIONS } from '../constants/taskOptions';

export interface AssigneePickerProps {
    value: string[];
    onChange: (ids: string[]) => void;
}

export default function AssigneePicker({ value, onChange }: AssigneePickerProps) {
    const [open, setOpen] = useState(false);
    const ref = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handler = (e: MouseEvent) => {
            if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
        };
        document.addEventListener('mousedown', handler);
        return () => document.removeEventListener('mousedown', handler);
    }, []);

    const toggle = (id: string) => {
        onChange(value.includes(id) ? value.filter((a) => a !== id) : [...value, id]);
    };

    return (
        <div className="relative" ref={ref} onClick={(e) => e.stopPropagation()}>
            <button
                className="flex cursor-pointer items-center gap-1.25 whitespace-nowrap rounded-md border border-[var(--color-border-light)] bg-transparent px-2.5 py-1.25 text-xs font-semibold text-[var(--color-text-secondary)] transition-all hover:border-[var(--color-border)] hover:bg-[var(--color-surface-subtle)]"
                onClick={() => setOpen(!open)}
            >
                <User size={13} />
                {value.length > 0
                    ? `${value.length} member${value.length > 1 ? 's' : ''}`
                    : 'Assignee'}
                <ChevronDown size={11} />
            </button>

            {open && (
                <div className="absolute left-0 top-[calc(100%+4px)] z-20 min-w-55 rounded-lg border border-[var(--color-border-light)] bg-white p-1 shadow-[0_6px_20px_rgba(0,0,0,0.12)]">
                    {MEMBER_OPTIONS.map((m) => (
                        <button
                            key={m.id}
                            className={`flex w-full cursor-pointer items-center gap-2 rounded-md border-none px-2.5 py-1.75 text-left text-xs font-semibold ${
                                value.includes(m.id)
                                    ? 'bg-[var(--color-primary-bg)] text-[var(--color-primary)]'
                                    : 'bg-transparent text-[var(--color-on-surface)] hover:bg-[var(--color-primary-bg)]'
                            }`}
                            onClick={() => toggle(m.id)}
                        >
                            <span
                                className="flex h-5.5 w-5.5 shrink-0 items-center justify-center rounded-full text-[9px] font-bold text-white"
                                style={{ backgroundColor: m.color }}
                            >
                                {m.id}
                            </span>
                            {m.name}
                            {value.includes(m.id) && (
                                <span className="ml-auto text-sm text-[var(--color-primary)]">✓</span>
                            )}
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
}
