/* ═══════════════════════════════════════════════
   LIST VIEW  —  Exact ClickUp match
═══════════════════════════════════════════════ */
import {
    ChevronDown,
    ChevronRight,
    MoreHorizontal,
    Plus,
    Trash2,
    Settings
} from 'lucide-react';
import { Dropdown, Popover } from 'antd';
import { useState } from 'react';
import type { Task, StatusGroup } from '../../../../types/tasks';
import { directChildCount, directChildTasks, rootTasks } from '../../../../utils/taskFamily';
import ListHeader from './components/ListHeader';
import TaskRow from './components/TaskRow';
import InlineCreateTask from './components/InlineCreateTask';

export default function ListView({
    groups,
    setGroups,
    setSelectedTask,
    showClosed,
    columns,
    onContextMenu,
    onCreateTask,
    onCreateStatus,
    onRequestCreateModal,
    listId,
    spaceTitle = 'Space',
    breadcrumbContext = null,
}: {
    groups: StatusGroup[];
    setGroups: React.Dispatch<React.SetStateAction<StatusGroup[]>>;
    setSelectedTask: (t: Task | null) => void;
    showClosed: boolean;
    columns: { assignee: boolean; dueDate: boolean; priority: boolean };
    onContextMenu?: (e: React.MouseEvent, task: Task) => void;
    onCreateTask?: (groupId: string, name: string, listId?: number, extras?: { assignees?: string[]; dueDate?: string | null; priority?: string }) => void;
    onCreateStatus?: (name: string, color: string) => void;
    onRequestCreateModal?: (listId?: number) => void;
    listId?: number;
    spaceTitle?: string;
    breadcrumbContext?: string | null;
}) {
    const [expandedTasks, setExpandedTasks] = useState<Record<number, boolean>>({});
    const [inlineGroup, setInlineGroup] = useState<string | null>(null);
    const [inlineText, setInlineText] = useState('');
    const [isAddingStatus, setIsAddingStatus] = useState(false);
    const [newStatusName, setNewStatusName] = useState('');
    const [newStatusColor, setNewStatusColor] = useState('#d3d3d3');
    const [isColorPickerOpen, setIsColorPickerOpen] = useState(false);

    const STATUS_COLORS = [
        '#7c68ee', '#2563eb', '#0ea5e9', '#0d9488', '#10b981', '#f59e0b', '#f97316', '#ef4444',
        '#ec4899', '#8b5cf6', '#8b4513', '#6b7280'
    ];

    const updateTask = (taskId: number, updates: Partial<Task>) => {
        setGroups((prev) =>
            prev.map((g) => {
                const rIdx = g.tasks.findIndex((t) => t.task_id === taskId);
                if (rIdx !== -1) {
                    const newTasks = [...g.tasks];
                    newTasks[rIdx] = { ...newTasks[rIdx], ...updates };
                    return { ...g, tasks: newTasks };
                }
                return g;
            })
        );
    };

    const toggleGroup = (id: string) =>
        setGroups((g) =>
            g.map((g2) => (g2.id === id ? { ...g2, isExpanded: !g2.isExpanded } : g2)),
        );

    const toggleTask = (e: React.MouseEvent, taskId: number) => {
        e.stopPropagation();
        setExpandedTasks((p) => ({ ...p, [taskId]: !p[taskId] }));
    };

    const handleInlineCreate = (groupId: string, extras?: { assignees?: string[]; dueDate?: string | null; priority?: string }) => {
        const trimmed = inlineText.trim();
        setInlineText('');
        setInlineGroup(null);
        if (!trimmed) return;

        if (listId) {
            onCreateTask(groupId, trimmed, listId, extras);
        } else if (onRequestCreateModal) {
            onRequestCreateModal(groupId, trimmed, extras);
        }
    };

    const displayGroups = showClosed ? groups : groups.filter((g) => g.id !== 'done');

    return (
        <div className="flex flex-1 flex-col overflow-hidden bg-[#f5f6f8]">
            {/* Breadcrumb */}
            <div className="shrink-0 px-5 pb-1 pt-2 text-[11px] text-[#9499a5]">
                {breadcrumbContext ? `${spaceTitle} / ${breadcrumbContext}` : spaceTitle}
            </div>

            <div className="flex-1 overflow-y-auto px-4 pb-10">
                {displayGroups.map((group) => {
                    const roots = rootTasks(group.tasks);

                    return (
                        <div key={group.id} className="mb-6">
                            {/* ── Group Header ─────────────────────────────── */}
                            <div
                                className="group/header mb-1 flex cursor-pointer select-none items-center gap-2 py-1"
                                onClick={() => toggleGroup(group.id)}
                            >
                                {/* Chevron — matches ClickUp (right=collapsed, down=expanded) */}
                                <button className="flex items-center text-[#9499a5] transition-colors hover:text-[#5f6368]">
                                    {group.isExpanded
                                        ? <ChevronDown size={13} />
                                        : <ChevronRight size={13} />}
                                </button>

                                {/* Status icon — outline circle with dot (ClickUp style) */}
                                <div
                                    className="flex h-[15px] w-[15px] shrink-0 items-center justify-center rounded-full border-[2px]"
                                    style={{ borderColor: group.color }}
                                >
                                    <div
                                        className="h-[5px] w-[5px] rounded-full"
                                        style={{ backgroundColor: group.color }}
                                    />
                                </div>

                                {/* Group name — no background, just colored text */}
                                <span
                                    className="text-[12px] font-semibold uppercase tracking-wide"
                                    style={{ color: group.color }}
                                >
                                    {group.name}
                                </span>

                                {/* Task count */}
                                <span className="text-[12px] font-medium text-[#9499a5]">
                                    {roots.length}
                                </span>

                                {/* Hidden actions (... and +) that appear on hover */}
                                <div className="flex items-center gap-1 opacity-0 transition-opacity group-hover/header:opacity-100">
                                    <Dropdown
                                        trigger={['click']}
                                        menu={{
                                            items: [
                                                {
                                                    key: 'delete',
                                                    label: 'Delete Status',
                                                    danger: true,
                                                    icon: <Trash2 size={13} />,
                                                },
                                            ],
                                            onClick: ({ key, domEvent }) => {
                                                domEvent.stopPropagation();
                                                if (key === 'delete') {
                                                    setGroups((prev) => prev.filter((g) => g.id !== group.id));
                                                }
                                            },
                                        }}
                                    >
                                        <button
                                            className="flex h-5 w-5 items-center justify-center rounded text-[#9499a5] hover:bg-[#e3e5e8] hover:text-[#5f6368] transition-colors"
                                            onClick={(e) => e.stopPropagation()}
                                        >
                                            <MoreHorizontal size={13} />
                                        </button>
                                    </Dropdown>

                                    <button
                                        className="flex h-5 w-5 items-center justify-center rounded text-[#9499a5] hover:bg-[#e3e5e8] hover:text-[#5f6368] transition-colors"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            setInlineGroup(group.id);
                                        }}
                                        title="Add task"
                                    >
                                        <Plus size={13} />
                                    </button>
                                </div>

                                {/* Spacer line after count */}
                                <div className="mx-1 h-px flex-1 bg-[#e3e5e8]" />
                            </div>

                            {/* ── Tasks Table ─────────────────────────────── */}
                            {group.isExpanded && (
                                <div className="overflow-hidden rounded-[6px] border border-[#e3e5e8] bg-white">
                                    {/* Column header row */}
                                    <ListHeader columns={columns} />

                                    {/* Task rows */}
                                    {roots.map((task) => {
                                        const childCount = directChildCount(group.tasks, task.task_id);
                                        const subs = directChildTasks(group.tasks, task.task_id);
                                        return (
                                            <div key={task.task_id}>
                                                <TaskRow
                                                    task={task}
                                                    columns={columns}
                                                    groupColor={group.color}
                                                    hasChildren={childCount > 0}
                                                    isExpanded={expandedTasks[task.task_id]}
                                                    childrenCount={childCount}
                                                    onToggle={(e) => toggleTask(e, task.task_id)}
                                                    onSelect={setSelectedTask}
                                                    onContextMenu={onContextMenu}
                                                    onUpdate={updateTask}
                                                />

                                                {expandedTasks[task.task_id] &&
                                                    subs.map((sub) => (
                                                        <TaskRow
                                                            key={sub.task_id}
                                                            task={sub}
                                                            isSubtask
                                                            columns={columns}
                                                            groupColor={group.color}
                                                            onSelect={setSelectedTask}
                                                            onContextMenu={onContextMenu}
                                                            onUpdate={updateTask}
                                                        />
                                                    ))}
                                            </div>
                                        );
                                    })}

                                    {/* Inline Add Task row */}
                                    <InlineCreateTask
                                        isActive={inlineGroup === group.id}
                                        text={inlineText}
                                        onChangeText={setInlineText}
                                        onActivate={() => setInlineGroup(group.id)}
                                        onCancel={() => {
                                            setInlineGroup(null);
                                            setInlineText('');
                                        }}
                                        onSubmit={(extras) => handleInlineCreate(group.id, extras)}
                                        groupColor={group.color}
                                    />
                                </div>
                            )}
                        </div>
                    );
                })}

                {/* Add Status Group button */}
                <div className="group/addstatus pt-2 pb-4">
                    {isAddingStatus ? (
                        <div className="flex w-[240px] items-center gap-2 rounded-md border border-[#7c68ee] bg-white px-2 py-[5px] shadow-[0_2px_8px_rgba(124,104,238,0.2)]">
                            <Popover
                                content={
                                    <div className="w-[180px] p-1" onMouseDown={(e) => e.preventDefault()}>
                                        <div className="flex flex-wrap gap-[6px] p-2">
                                            {STATUS_COLORS.map(color => (
                                                <button
                                                    key={color}
                                                    type="button"
                                                    className="h-4 w-4 rounded-full border border-black/10 hover:scale-110 transition-transform"
                                                    style={{ backgroundColor: color }}
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        setNewStatusColor(color);
                                                        setIsColorPickerOpen(false);
                                                    }}
                                                />
                                            ))}
                                            <button 
                                                type="button" 
                                                className="flex h-4 w-4 items-center justify-center rounded-full hover:bg-[#f3f4f6] text-[#6b7280]"
                                            >
                                                <Plus size={12} />
                                            </button>
                                        </div>
                                        <div className="h-px w-full bg-[#e5e7eb] my-1" />
                                        <div className="flex items-center gap-2 px-2 py-1.5 cursor-pointer hover:bg-[#f3f4f6] rounded text-[#6b7280] text-[12px]">
                                            <Settings size={13} />
                                            Advanced settings
                                        </div>
                                    </div>
                                }
                                trigger="click"
                                open={isColorPickerOpen}
                                onOpenChange={setIsColorPickerOpen}
                                placement="bottomLeft"
                                arrow={false}
                                overlayInnerStyle={{ padding: 0, borderRadius: '8px', boxShadow: '0 4px 20px rgba(0,0,0,0.1)' }}
                            >
                                <div 
                                    className="h-3 w-3 shrink-0 rounded-[3px] cursor-pointer hover:opacity-80" 
                                    style={{ backgroundColor: newStatusColor }} 
                                    onMouseDown={(e) => e.preventDefault()}
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        setIsColorPickerOpen(true);
                                    }}
                                />
                            </Popover>
                            <input
                                autoFocus
                                value={newStatusName}
                                onChange={(e) => setNewStatusName(e.target.value)}
                                placeholder="Status name"
                                className="flex-1 bg-transparent text-[13px] font-medium text-[#292d34] outline-none placeholder:text-[#9ca3af] placeholder:font-normal"
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter') {
                                        const trimmed = newStatusName.trim();
                                        if (trimmed) {
                                            // Gọi API lưu status
                                            onCreateStatus?.(trimmed.toUpperCase(), newStatusColor);
                                            
                                            // Tạm thời update local để UI phản hồi ngay lập tức (optimistic UI)
                                            setGroups([...groups, {
                                                id: trimmed.toLowerCase().replace(/ /g, ''),
                                                name: trimmed.toUpperCase(),
                                                color: newStatusColor,
                                                isExpanded: true,
                                                tasks: []
                                            }]);
                                        }
                                        setIsAddingStatus(false);
                                        setNewStatusName('');
                                    } else if (e.key === 'Escape') {
                                        setIsAddingStatus(false);
                                        setNewStatusName('');
                                    }
                                }}
                                onBlur={(e) => {
                                    // With mousedown preventDefault, blur won't fire when clicking the color picker.
                                    // It only fires when clicking elsewhere.
                                    if (!isColorPickerOpen) {
                                        setIsAddingStatus(false);
                                        setNewStatusName('');
                                    }
                                }}
                            />
                        </div>
                    ) : (
                        <div 
                            className="inline-flex cursor-pointer items-center gap-1.5 rounded-md px-2 py-1 text-[12px] font-medium text-[#9ca3af] transition-colors hover:bg-[#e8eaed] hover:text-[#5f6368]"
                            onClick={() => setIsAddingStatus(true)}
                        >
                            <Plus size={13} />
                            New status
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
