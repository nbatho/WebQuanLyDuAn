/* ═══════════════════════════════════════════════
   LIST VIEW
═══════════════════════════════════════════════ */
import {
    ChevronDown,
    ChevronRight,
    MoreHorizontal,
    Plus,
    Trash2,
} from 'lucide-react';
import { Dropdown } from 'antd';
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
    spaceTitle = 'Space',
    breadcrumbContext = null,
}: {
    groups: StatusGroup[];
    setGroups: React.Dispatch<React.SetStateAction<StatusGroup[]>>;
    setSelectedTask: (t: Task | null) => void;
    showClosed: boolean;
    columns: Record<string, boolean>;
    onContextMenu: (e: React.MouseEvent, task: Task) => void;
    spaceTitle?: string;
    breadcrumbContext?: string | null;
}) {
    const [expandedTasks, setExpandedTasks] = useState<Record<number, boolean>>({});
    const [inlineGroup, setInlineGroup] = useState<string | null>(null);
    const [inlineText, setInlineText] = useState('');

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

    const handleInlineCreate = (groupId: string) => {
        if (!inlineText.trim()) {
            setInlineGroup(null);
            return;
        }
        const group = groups.find((g) => g.id === groupId);
        if (!group) return;
        const spaceNumeric =
            groups.flatMap((g) => g.tasks)[0]?.space_id ?? 1;
        const newTask: Task = {
            task_id: Math.floor(Math.random() * 999999),
            space_id: spaceNumeric,
            parent_task_id: null,
            name: inlineText.trim(),
            description: null,
            status: group.name,
            statusColor: group.color,
            priority: 'Normal',
            priorityColor: '#00b894',
            due_date: null,
            assignees: [],
            comment_count: 0,
        };
        setGroups((prev) =>
            prev.map((g) => (g.id === groupId ? { ...g, tasks: [...g.tasks, newTask] } : g)),
        );
        setInlineText('');
        setInlineGroup(null);
    };

    const displayGroups = showClosed ? groups : groups.filter((g) => g.id !== 'done');

    return (
        <div className="flex flex-1 flex-col overflow-hidden">
            <div className="shrink-0 px-5 pt-1.5 text-[11px] font-medium text-[#9aa0a6]">
                {breadcrumbContext ? `${spaceTitle} / ${breadcrumbContext}` : spaceTitle}
            </div>
            <div className="flex-1 overflow-y-auto px-5 pb-6 pt-3">
                {displayGroups.map((group) => {
                    const roots = rootTasks(group.tasks);
                    return (
                        <div key={group.id} className="mb-6">
                            <div
                                className="mb-1 flex cursor-pointer items-center gap-1.5 py-1"
                                onClick={() => toggleGroup(group.id)}
                            >
                                <button className="flex items-center rounded p-0.5 text-[#5f6368] hover:bg-[#eef0f5]">
                                    {group.isExpanded ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
                                </button>
                                <span
                                    className="rounded px-2 py-0.5 text-[11px] font-extrabold tracking-[0.04em] text-white"
                                    style={{ backgroundColor: group.color }}
                                >
                                    {group.name}
                                </span>
                                <span className="text-xs font-semibold text-[#9aa0a6]">
                                    {roots.length}
                                </span>
                                <div className="mx-2 h-px flex-1 bg-[#eef0f5]" />
                                <Dropdown
                                    trigger={['click']}
                                    menu={{
                                        items: [
                                            {
                                                key: 'delete',
                                                label: 'Delete List',
                                                danger: true,
                                                icon: <Trash2 size={14} />,
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
                                        className="rounded text-[#9aa0a6] hover:bg-[#eef0f5] hover:text-[#5f6368]"
                                        onClick={(e) => e.stopPropagation()}
                                    >
                                        <MoreHorizontal size={14} />
                                    </button>
                                </Dropdown>
                            </div>

                            {group.isExpanded && (
                                <>
                                    <ListHeader columns={columns} />

                                    <div className="flex flex-col">
                                        {roots.map((task) => {
                                            const childCount = directChildCount(group.tasks, task.task_id);
                                            const subs = directChildTasks(group.tasks, task.task_id);
                                            return (
                                                <div key={task.task_id} className="flex flex-col">
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

                                        <InlineCreateTask
                                            isActive={inlineGroup === group.id}
                                            text={inlineText}
                                            onChangeText={setInlineText}
                                            onActivate={() => setInlineGroup(group.id)}
                                            onCancel={() => {
                                                setInlineGroup(null);
                                                setInlineText('');
                                            }}
                                            onSubmit={() => handleInlineCreate(group.id)}
                                            color="#0058be"
                                        />
                                    </div>
                                </>
                            )}
                        </div>
                    );
                })}

                {/* Create New List Button at the very bottom */}
                <div className="group/newlist mx-1 mt-4 pb-12 pt-4 flex">
                    <div className="inline-flex cursor-pointer items-center gap-1.5 rounded-md bg-[#f0f1f3] px-3 py-1.5 text-[13px] font-semibold text-[#5f6368] opacity-0 transition-opacity duration-300 hover:bg-[#e4e6ea] group-hover/newlist:opacity-100">
                        <Plus size={14} /> Create List
                    </div>
                </div>
            </div>
        </div>
    );
}
