import { useState, useRef, useEffect } from 'react';
import {
    ChevronDown, Filter, X, Eye, EyeOff,
    Calendar, Flag, CheckCircle2, ArrowUpDown, User, Tag
} from 'lucide-react';

/* ═══════════════════════════════════════════
   GROUP BY DROPDOWN
═══════════════════════════════════════════ */
export interface GroupByDropdownProps {
    value: string;
    onChange: (val: string) => void;
    isOpen: boolean;
    onToggle: () => void;
}

const GROUP_OPTIONS = [
    { value: 'status', label: 'Status', icon: CheckCircle2 },
    { value: 'assignee', label: 'Assignee', icon: User },
    { value: 'priority', label: 'Priority', icon: Flag },
    { value: 'dueDate', label: 'Due Date', icon: Calendar },
    { value: 'none', label: 'None', icon: X },
];

export function GroupByDropdown({ value, onChange, isOpen, onToggle }: GroupByDropdownProps) {
    const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
    const ref = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!isOpen) return;
        const h = (e: MouseEvent) => { if (ref.current && !ref.current.contains(e.target as Node)) onToggle(); };
        document.addEventListener('mousedown', h);
        return () => document.removeEventListener('mousedown', h);
    }, [isOpen, onToggle]);

    return (
        <div className="relative inline-flex" ref={ref}>
            <button
                className="flex cursor-pointer items-center gap-1 whitespace-nowrap rounded-[20px] border border-[#0058be] bg-[#f0f4ff] px-2.5 py-1 text-xs font-semibold text-[#0058be] transition-all hover:border-[#0058be] hover:bg-[#f0f4ff]"
                onClick={onToggle}
            >
                <CheckCircle2 size={13} />
                <span>Group: {GROUP_OPTIONS.find(g => g.value === value)?.label || 'Status'}</span>
                <ChevronDown size={12} />
            </button>
            {isOpen && (
                <div className="absolute left-0 top-[calc(100%+6px)] z-500 min-w-50 rounded-[10px] border border-[#eef0f5] bg-white p-1.5 shadow-[0_8px_28px_rgba(0,0,0,0.13)]">
                    <div className="px-2.5 pb-1 pt-1.5 text-[10px] font-bold uppercase tracking-[0.06em] text-[#9aa0a6]">Group by</div>
                    {GROUP_OPTIONS.map(opt => (
                        <button
                            key={opt.value}
                            className={`flex w-full cursor-pointer items-center gap-2 rounded-md border-none px-2.5 py-1.5 text-left text-xs font-semibold ${value === opt.value ? 'bg-[#f0f4ff] text-[#0058be]' : 'bg-transparent text-[#141b2b] hover:bg-[#f0f4ff]'
                                }`}
                            onClick={() => { onChange(opt.value); onToggle(); }}
                        >
                            <opt.icon size={14} />
                            <span>{opt.label}</span>
                            {value === opt.value && <span className="ml-auto text-[13px] font-bold text-[#0058be]">✓</span>}
                        </button>
                    ))}
                    <div className="mx-1.5 my-1 h-px bg-[#eef0f5]" />
                    <div className="px-2.5 pb-1 pt-1.5 text-[10px] font-bold uppercase tracking-[0.06em] text-[#9aa0a6]">Sort order</div>
                    <button
                        className={`flex w-full cursor-pointer items-center gap-2 rounded-md border-none px-2.5 py-1.5 text-left text-xs font-semibold ${sortOrder === 'asc' ? 'bg-[#f0f4ff] text-[#0058be]' : 'bg-transparent text-[#141b2b] hover:bg-[#f0f4ff]'
                            }`}
                        onClick={() => setSortOrder('asc')}>
                        <ArrowUpDown size={14} /> Ascending
                        {sortOrder === 'asc' && <span className="ml-auto text-[13px] font-bold text-[#0058be]">✓</span>}
                    </button>
                    <button
                        className={`flex w-full cursor-pointer items-center gap-2 rounded-md border-none px-2.5 py-1.5 text-left text-xs font-semibold ${sortOrder === 'desc' ? 'bg-[#f0f4ff] text-[#0058be]' : 'bg-transparent text-[#141b2b] hover:bg-[#f0f4ff]'
                            }`}
                        onClick={() => setSortOrder('desc')}>
                        <ArrowUpDown size={14} style={{ transform: 'scaleY(-1)' }} /> Descending
                        {sortOrder === 'desc' && <span className="ml-auto text-[13px] font-bold text-[#0058be]">✓</span>}
                    </button>
                </div>
            )}
        </div>
    );
}

/* ═══════════════════════════════════════════
   SUBTASKS DROPDOWN
═══════════════════════════════════════════ */
interface SubtasksDropdownProps {
    value: string;
    onChange: (val: string) => void;
    isOpen: boolean;
    onToggle: () => void;
}

const SUBTASK_OPTIONS = [
    { value: 'collapsed', label: 'Collapsed' },
    { value: 'expanded', label: 'Expanded' },
    { value: 'separate', label: 'As separate tasks' },
];

export function SubtasksDropdown({ value, onChange, isOpen, onToggle }: SubtasksDropdownProps) {
    const ref = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!isOpen) return;
        const h = (e: MouseEvent) => { if (ref.current && !ref.current.contains(e.target as Node)) onToggle(); };
        document.addEventListener('mousedown', h);
        return () => document.removeEventListener('mousedown', h);
    }, [isOpen, onToggle]);

    return (
        <div className="relative inline-flex" ref={ref}>
            <button
                className="flex cursor-pointer items-center gap-1 whitespace-nowrap rounded-[20px] border border-[#eef0f5] bg-transparent px-2.5 py-1 text-xs font-semibold text-[#5f6368] transition-all hover:border-[#0058be] hover:bg-[#f0f4ff] hover:text-[#0058be]"
                onClick={onToggle}
            >
                <Tag size={13} />
                <span>Subtasks</span>
                <ChevronDown size={12} />
            </button>
            {isOpen && (
                <div className="absolute left-0 top-[calc(100%+6px)] z-500 min-w-50 rounded-[10px] border border-[#eef0f5] bg-white p-1.5 shadow-[0_8px_28px_rgba(0,0,0,0.13)]">
                    <div className="px-2.5 pb-1 pt-1.5 text-[10px] font-bold uppercase tracking-[0.06em] text-[#9aa0a6]">Show subtasks</div>
                    {SUBTASK_OPTIONS.map(opt => (
                        <button
                            key={opt.value}
                            className={`flex w-full cursor-pointer items-center gap-2 rounded-md border-none px-2.5 py-1.5 text-left text-xs font-semibold ${value === opt.value ? 'bg-[#f0f4ff] text-[#0058be]' : 'bg-transparent text-[#141b2b] hover:bg-[#f0f4ff]'
                                }`}
                            onClick={() => { onChange(opt.value); onToggle(); }}
                        >
                            <span>{opt.label}</span>
                            {value === opt.value && <span className="ml-auto text-[13px] font-bold text-[#0058be]">✓</span>}
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
}

/* ═══════════════════════════════════════════
   FILTER PANEL
═══════════════════════════════════════════ */
interface FilterPanelProps {
    isOpen: boolean;
    onToggle: () => void;
    filters: { status: string[]; priority: string[]; assignee: string[] };
    onFiltersChange: (filters: { status: string[]; priority: string[]; assignee: string[] }) => void;
}

const FILTER_STATUS = ['TO DO', 'IN PROGRESS', 'COMPLETE'];
const FILTER_PRIORITY = ['Urgent', 'High', 'Normal', 'Low'];
const FILTER_MEMBERS = ['AR', 'MC', 'SJ', 'ER'];

export function FilterPanel({ isOpen, onToggle, filters, onFiltersChange }: FilterPanelProps) {
    const ref = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!isOpen) return;
        const h = (e: MouseEvent) => { if (ref.current && !ref.current.contains(e.target as Node)) onToggle(); };
        document.addEventListener('mousedown', h);
        return () => document.removeEventListener('mousedown', h);
    }, [isOpen, onToggle]);

    const toggle = (key: 'status' | 'priority' | 'assignee', val: string) => {
        const arr = filters[key];
        const next = arr.includes(val) ? arr.filter(v => v !== val) : [...arr, val];
        onFiltersChange({ ...filters, [key]: next });
    };

    const activeCount = filters.status.length + filters.priority.length + filters.assignee.length;

    return (
        <div className="relative inline-flex" ref={ref}>
            <button
                className={`flex cursor-pointer items-center gap-1 whitespace-nowrap rounded-md border-none px-2 py-1 text-xs font-semibold ${activeCount > 0
                        ? 'bg-[#f0f4ff] text-[#0058be]'
                        : 'bg-transparent text-[#5f6368] hover:bg-[#f0f4ff] hover:text-[#0058be]'
                    }`}
                onClick={onToggle}
            >
                <Filter size={13} /> Filter
                {activeCount > 0 && <span className="inline-flex h-4 min-w-4 items-center justify-center rounded-lg bg-[#0058be] px-1 text-[10px] font-extrabold text-white">{activeCount}</span>}
            </button>
            {isOpen && (
                <div className="absolute left-0 top-[calc(100%+6px)] z-500 min-w-70 rounded-[10px] border border-[#eef0f5] bg-white p-1.5 shadow-[0_8px_28px_rgba(0,0,0,0.13)]">
                    <div className="mb-1 flex items-center justify-between border-b border-[#f0f2f5] px-2.5 py-1.5 text-[13px] font-bold text-[#141b2b]">
                        <span>Filters</span>
                        {activeCount > 0 && (
                            <button
                                className="cursor-pointer border-none bg-transparent text-[11px] font-semibold text-[#e74c3c] hover:underline"
                                onClick={() => onFiltersChange({ status: [], priority: [], assignee: [] })}
                            >
                                Clear All
                            </button>
                        )}
                    </div>

                    <div className="px-2.5 pb-1 pt-1.5 text-[10px] font-bold uppercase tracking-[0.06em] text-[#9aa0a6]">Status</div>
                    <div className="flex flex-wrap gap-1 px-2.5 pb-2 pt-0.5">
                        {FILTER_STATUS.map(s => (
                            <button key={s}
                                className={`cursor-pointer rounded-[14px] border px-2.5 py-0.75 text-[11px] font-semibold transition-all ${filters.status.includes(s)
                                        ? 'border-[#0058be] bg-[#0058be] text-white'
                                        : 'border-[#eef0f5] bg-[#f8fafb] text-[#5f6368] hover:border-[#0058be] hover:text-[#0058be]'
                                    }`}
                                onClick={() => toggle('status', s)}>{s}
                            </button>
                        ))}
                    </div>

                    <div className="px-2.5 pb-1 pt-1.5 text-[10px] font-bold uppercase tracking-[0.06em] text-[#9aa0a6]">Priority</div>
                    <div className="flex flex-wrap gap-1 px-2.5 pb-2 pt-0.5">
                        {FILTER_PRIORITY.map(p => (
                            <button key={p}
                                className={`cursor-pointer rounded-[14px] border px-2.5 py-0.75 text-[11px] font-semibold transition-all ${filters.priority.includes(p)
                                        ? 'border-[#0058be] bg-[#0058be] text-white'
                                        : 'border-[#eef0f5] bg-[#f8fafb] text-[#5f6368] hover:border-[#0058be] hover:text-[#0058be]'
                                    }`}
                                onClick={() => toggle('priority', p)}>{p}
                            </button>
                        ))}
                    </div>

                    <div className="px-2.5 pb-1 pt-1.5 text-[10px] font-bold uppercase tracking-[0.06em] text-[#9aa0a6]">Assignee</div>
                    <div className="flex flex-wrap gap-1 px-2.5 pb-2 pt-0.5">
                        {FILTER_MEMBERS.map(m => (
                            <button key={m}
                                className={`cursor-pointer rounded-[14px] border px-2.5 py-0.75 text-[11px] font-semibold transition-all ${filters.assignee.includes(m)
                                        ? 'border-[#0058be] bg-[#0058be] text-white'
                                        : 'border-[#eef0f5] bg-[#f8fafb] text-[#5f6368] hover:border-[#0058be] hover:text-[#0058be]'
                                    }`}
                                onClick={() => toggle('assignee', m)}>{m}
                            </button>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}

/* ═══════════════════════════════════════════
   CUSTOMIZE PANEL
═══════════════════════════════════════════ */
interface CustomizePanelProps {
    isOpen: boolean;
    onToggle: () => void;
    columns: Record<string, boolean>;
    onColumnsChange: (cols: Record<string, boolean>) => void;
}

const COLUMN_OPTIONS = [
    { key: 'assignee', label: 'Assignee', icon: User },
    { key: 'dueDate', label: 'Due Date', icon: Calendar },
    { key: 'priority', label: 'Priority', icon: Flag },
    { key: 'tags', label: 'Tags', icon: Tag },
];

export function CustomizePanel({ isOpen, onToggle, columns, onColumnsChange }: CustomizePanelProps) {
    const ref = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!isOpen) return;
        const h = (e: MouseEvent) => { if (ref.current && !ref.current.contains(e.target as Node)) onToggle(); };
        document.addEventListener('mousedown', h);
        return () => document.removeEventListener('mousedown', h);
    }, [isOpen, onToggle]);

    return (
        <div className="relative inline-flex" ref={ref}>
            <button
                className="flex cursor-pointer items-center gap-1 whitespace-nowrap rounded-md border-none bg-transparent px-2 py-1 text-xs font-semibold text-[#5f6368] hover:bg-[#f0f4ff] hover:text-[#0058be]"
                onClick={onToggle}
            >
                Customize
            </button>
            {isOpen && (
                <div className="absolute right-0 top-[calc(100%+6px)] z-500 min-w-50 rounded-[10px] border border-[#eef0f5] bg-white p-1.5 shadow-[0_8px_28px_rgba(0,0,0,0.13)]">
                    <div className="px-2.5 pb-1 pt-1.5 text-[10px] font-bold uppercase tracking-[0.06em] text-[#9aa0a6]">Visible columns</div>
                    {COLUMN_OPTIONS.map(col => (
                        <button key={col.key}
                            className="flex w-full cursor-pointer items-center gap-2 rounded-md border-none px-2.5 py-1.5 text-left text-xs font-semibold text-[#141b2b] hover:bg-[#f0f4ff]"
                            onClick={() => onColumnsChange({ ...columns, [col.key]: !columns[col.key] })}>
                            <col.icon size={14} />
                            <span>{col.label}</span>
                            {columns[col.key]
                                ? <Eye size={14} className="ml-auto text-[#0058be]" />
                                : <EyeOff size={14} className="ml-auto text-[#c2c9e0]" />}
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
}
