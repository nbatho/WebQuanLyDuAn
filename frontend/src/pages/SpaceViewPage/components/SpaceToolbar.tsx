import { useState } from 'react';
import { Plus, ChevronDown, CheckCircle2, Users, Search } from 'lucide-react';
import {
    GroupByDropdown,
    SubtasksDropdown,
    FilterPanel,
    CustomizePanel,
} from '../../../components/ToolbarDropdowns';
import type { ViewType } from './SpaceHeader';

interface SpaceToolbarProps {
    activeView: ViewType;
    groupBy: string;
    setGroupBy: (v: string) => void;
    subtaskMode: string;
    setSubtaskMode: (v: string) => void;
    showClosed: boolean;
    setShowClosed: (v: boolean | ((prev: boolean) => boolean)) => void;
    filters: { status: string[]; priority: string[]; assignee: string[] };
    setFilters: (v: { status: string[]; priority: string[]; assignee: string[] }) => void;
    columns: Record<string, boolean>;
    setColumns: (v: Record<string, boolean>) => void;
    onCreateTask: () => void;
}

export default function SpaceToolbar({
    activeView,
    groupBy,
    setGroupBy,
    subtaskMode,
    setSubtaskMode,
    showClosed,
    setShowClosed,
    filters,
    setFilters,
    columns,
    setColumns,
    onCreateTask,
}: SpaceToolbarProps) {
    const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
    const toggleDropdown = (id: string) => setActiveDropdown((prev) => (prev === id ? null : id));

    return (
        <div className="flex shrink-0 items-center justify-between border-b border-[var(--color-border-light)] bg-white px-5 py-2">
            <div className="flex items-center gap-1.5">
                <GroupByDropdown
                    value={groupBy}
                    onChange={setGroupBy}
                    isOpen={activeDropdown === 'group'}
                    onToggle={() => toggleDropdown('group')}
                />
                <SubtasksDropdown
                    value={subtaskMode}
                    onChange={setSubtaskMode}
                    isOpen={activeDropdown === 'subtask'}
                    onToggle={() => toggleDropdown('subtask')}
                />
            </div>
            <div className="flex items-center gap-1.5">
                {activeView === 'board' && (
                    <button className="flex cursor-pointer items-center gap-1 rounded-md border-none bg-transparent px-2 py-1 text-xs font-semibold whitespace-nowrap text-[var(--color-text-secondary)] hover:bg-[var(--color-primary-bg)] hover:text-[var(--color-primary)]">
                        Sort
                    </button>
                )}
                <FilterPanel
                    isOpen={activeDropdown === 'filter'}
                    onToggle={() => toggleDropdown('filter')}
                    filters={filters}
                    onFiltersChange={setFilters}
                />
                <button
                    className={`flex cursor-pointer items-center gap-1 rounded-md border-none bg-transparent px-2 py-1 text-xs font-semibold whitespace-nowrap hover:bg-[var(--color-primary-bg)] hover:text-[var(--color-primary)] ${
                        showClosed ? 'text-[var(--color-primary)]' : 'text-[var(--color-text-secondary)]'
                    }`}
                    onClick={() => setShowClosed((v) => !v)}
                >
                    {showClosed ? <CheckCircle2 size={13} /> : null} Closed
                </button>
                <button className="flex cursor-pointer items-center gap-1 rounded-md border-none bg-transparent px-2 py-1 text-xs font-semibold whitespace-nowrap text-[var(--color-text-secondary)] hover:bg-[var(--color-primary-bg)] hover:text-[var(--color-primary)]">
                    <Users size={13} /> Assignee
                </button>
                <button className="flex cursor-pointer items-center gap-1 rounded-md border-none bg-transparent px-2 py-1 text-xs font-semibold whitespace-nowrap text-[var(--color-text-secondary)] hover:bg-[var(--color-primary-bg)] hover:text-[var(--color-primary)]">
                    <Search size={13} />
                </button>
                <CustomizePanel
                    isOpen={activeDropdown === 'customize'}
                    onToggle={() => toggleDropdown('customize')}
                    columns={columns}
                    onColumnsChange={setColumns}
                />
                <button
                    className="flex cursor-pointer items-center gap-1 rounded-md border-none bg-[var(--color-primary)] px-3 py-1.25 text-xs font-bold text-white transition-colors duration-150 hover:bg-[var(--color-primary-hover)]"
                    onClick={onCreateTask}
                >
                    <Plus size={14} /> Add Task <ChevronDown size={12} />
                </button>
            </div>
        </div>
    );
}
