import { useState, useRef, useEffect } from 'react';
import {
    ChevronDown, ChevronUp, Filter, X, Users, Eye, EyeOff,
    Calendar, Flag, CheckCircle2, ArrowUpDown, User, Tag
} from 'lucide-react';
import './toolbar-dropdowns.css';

/* ═══════════════════════════════════════════
   GROUP BY DROPDOWN
═══════════════════════════════════════════ */
interface GroupByDropdownProps {
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
        <div className="tbd-wrap" ref={ref}>
            <button className="tbd-chip tbd-chip--active" onClick={onToggle}>
                <CheckCircle2 size={13} />
                <span>Group: {GROUP_OPTIONS.find(g => g.value === value)?.label || 'Status'}</span>
                <ChevronDown size={12} />
            </button>
            {isOpen && (
                <div className="tbd-dropdown">
                    <div className="tbd-dropdown-label">Group by</div>
                    {GROUP_OPTIONS.map(opt => (
                        <button
                            key={opt.value}
                            className={`tbd-dropdown-item ${value === opt.value ? 'tbd-dropdown-item--active' : ''}`}
                            onClick={() => { onChange(opt.value); onToggle(); }}
                        >
                            <opt.icon size={14} />
                            <span>{opt.label}</span>
                            {value === opt.value && <span className="tbd-check">✓</span>}
                        </button>
                    ))}
                    <div className="tbd-divider" />
                    <div className="tbd-dropdown-label">Sort order</div>
                    <button className={`tbd-dropdown-item ${sortOrder === 'asc' ? 'tbd-dropdown-item--active' : ''}`}
                        onClick={() => setSortOrder('asc')}>
                        <ArrowUpDown size={14} /> Ascending
                        {sortOrder === 'asc' && <span className="tbd-check">✓</span>}
                    </button>
                    <button className={`tbd-dropdown-item ${sortOrder === 'desc' ? 'tbd-dropdown-item--active' : ''}`}
                        onClick={() => setSortOrder('desc')}>
                        <ArrowUpDown size={14} style={{ transform: 'scaleY(-1)' }} /> Descending
                        {sortOrder === 'desc' && <span className="tbd-check">✓</span>}
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
        <div className="tbd-wrap" ref={ref}>
            <button className="tbd-chip" onClick={onToggle}>
                <Tag size={13} />
                <span>Subtasks</span>
                <ChevronDown size={12} />
            </button>
            {isOpen && (
                <div className="tbd-dropdown">
                    <div className="tbd-dropdown-label">Show subtasks</div>
                    {SUBTASK_OPTIONS.map(opt => (
                        <button
                            key={opt.value}
                            className={`tbd-dropdown-item ${value === opt.value ? 'tbd-dropdown-item--active' : ''}`}
                            onClick={() => { onChange(opt.value); onToggle(); }}
                        >
                            <span>{opt.label}</span>
                            {value === opt.value && <span className="tbd-check">✓</span>}
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
        <div className="tbd-wrap" ref={ref}>
            <button className={`tbd-chip-icon ${activeCount > 0 ? 'tbd-chip-icon--active' : ''}`} onClick={onToggle}>
                <Filter size={13} /> Filter
                {activeCount > 0 && <span className="tbd-badge">{activeCount}</span>}
            </button>
            {isOpen && (
                <div className="tbd-dropdown tbd-dropdown--filter">
                    <div className="tbd-filter-header">
                        <span>Filters</span>
                        {activeCount > 0 && (
                            <button className="tbd-clear-btn" onClick={() => onFiltersChange({ status: [], priority: [], assignee: [] })}>
                                Clear All
                            </button>
                        )}
                    </div>

                    <div className="tbd-dropdown-label">Status</div>
                    <div className="tbd-filter-chips">
                        {FILTER_STATUS.map(s => (
                            <button key={s}
                                className={`tbd-filter-chip ${filters.status.includes(s) ? 'tbd-filter-chip--active' : ''}`}
                                onClick={() => toggle('status', s)}>{s}
                            </button>
                        ))}
                    </div>

                    <div className="tbd-dropdown-label">Priority</div>
                    <div className="tbd-filter-chips">
                        {FILTER_PRIORITY.map(p => (
                            <button key={p}
                                className={`tbd-filter-chip ${filters.priority.includes(p) ? 'tbd-filter-chip--active' : ''}`}
                                onClick={() => toggle('priority', p)}>{p}
                            </button>
                        ))}
                    </div>

                    <div className="tbd-dropdown-label">Assignee</div>
                    <div className="tbd-filter-chips">
                        {FILTER_MEMBERS.map(m => (
                            <button key={m}
                                className={`tbd-filter-chip ${filters.assignee.includes(m) ? 'tbd-filter-chip--active' : ''}`}
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
        <div className="tbd-wrap" ref={ref}>
            <button className="tbd-chip-icon" onClick={onToggle}>
                Customize
            </button>
            {isOpen && (
                <div className="tbd-dropdown tbd-dropdown--right">
                    <div className="tbd-dropdown-label">Visible columns</div>
                    {COLUMN_OPTIONS.map(col => (
                        <button key={col.key}
                            className="tbd-dropdown-item"
                            onClick={() => onColumnsChange({ ...columns, [col.key]: !columns[col.key] })}>
                            <col.icon size={14} />
                            <span>{col.label}</span>
                            {columns[col.key]
                                ? <Eye size={14} className="tbd-toggle-icon tbd-toggle-icon--on" />
                                : <EyeOff size={14} className="tbd-toggle-icon" />}
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
}
