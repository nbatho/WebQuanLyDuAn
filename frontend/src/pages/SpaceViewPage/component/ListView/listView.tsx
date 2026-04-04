/* ═══════════════════════════════════════════════
   LIST VIEW
═══════════════════════════════════════════════ */
import { Calendar, CheckCircle2, ChevronDown, ChevronRight, Flag, MessageSquare, MoreHorizontal, Plus } from "lucide-react";
import { Avatar } from "antd";
import { useEffect, useRef, useState } from "react";
import type { Task, StatusGroup } from "../../../../types/tasks";
const avatarColors: Record<string, string> = {
    AR: '#4285F4', MC: '#7c5cfc', SJ: '#0058be', ER: '#e84393'
};

let taskIdCounter = 100;
export default function ListView({
    groups, setGroups, setSelectedTask, showClosed, columns,
    onContextMenu,
}: {
    groups: StatusGroup[];
    setGroups: React.Dispatch<React.SetStateAction<StatusGroup[]>>;
    setSelectedTask: (t: Task | null) => void;
    showClosed: boolean;
    columns: Record<string, boolean>;
    onContextMenu: (e: React.MouseEvent, task: Task) => void;
}) {
    const [expandedTasks, setExpandedTasks] = useState<Record<string, boolean>>({});
    const [inlineGroup, setInlineGroup] = useState<string | null>(null);
    const [inlineText, setInlineText] = useState('');
    const inlineRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        if (inlineGroup) setTimeout(() => inlineRef.current?.focus(), 50);
    }, [inlineGroup]);

    const toggleGroup = (id: string) =>
        setGroups(g => g.map(g2 => g2.id === id ? { ...g2, isExpanded: !g2.isExpanded } : g2));

    const toggleTask = (e: React.MouseEvent, id: string) => {
        e.stopPropagation();
        setExpandedTasks(p => ({ ...p, [id]: !p[id] }));
    };

    const handleInlineCreate = (groupId: string) => {
        if (!inlineText.trim()) { setInlineGroup(null); return; }
        const group = groups.find(g => g.id === groupId);
        if (!group) return;
        const newTask: Task = {
            id: `t${taskIdCounter++}`,
            title: inlineText.trim(),
            status: group.name,
            statusColor: group.color,
            priority: 'Normal',
            priorityColor: '#00b894',
            dueDate: null,
            assignees: [],
            comments: 0,
            subtasks: [],
        };
        setGroups(prev => prev.map(g =>
            g.id === groupId ? { ...g, tasks: [...g.tasks, newTask] } : g
        ));
        setInlineText('');
        setInlineGroup(null);
    };

    const displayGroups = showClosed ? groups : groups.filter(g => g.id !== 'done');

    return (
        <div className="flex-1 flex flex-col overflow-hidden">
            <div className="shrink-0 px-5 pt-1.5 text-[11px] font-medium text-[#9aa0a6]">Main Space / Task Management</div>
            <div className="flex-1 overflow-y-auto px-5 pt-3 pb-6">
                {displayGroups.map(group => (
                    <div key={group.id} className="mb-6">
                        <div className="mb-1 flex cursor-pointer items-center gap-1.5 py-1" onClick={() => toggleGroup(group.id)}>
                            <button className="flex items-center rounded p-0.5 text-[#5f6368] hover:bg-[#eef0f5]">
                                {group.isExpanded ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
                            </button>
                            <span className="rounded px-2 py-0.5 text-[11px] font-extrabold tracking-[0.04em] text-white" style={{ backgroundColor: group.color }}>{group.name}</span>
                            <span className="text-xs font-semibold text-[#9aa0a6]">{group.tasks.length}</span>
                            <div className="mx-2 h-px flex-1 bg-[#eef0f5]" />
                            <button className="rounded text-[#9aa0a6] hover:bg-[#eef0f5] hover:text-[#5f6368]" onClick={e => { e.stopPropagation(); }}><MoreHorizontal size={14} /></button>
                        </div>

                        {group.isExpanded && (
                            <>
                                <div className="mb-0.5 flex items-center border-b border-[#eef0f5] py-1">
                                    <div className="min-w-65 flex-1 pl-9 text-[11px] font-bold uppercase tracking-[0.05em] text-[#9aa0a6]">Name</div>
                                    {columns.assignee && <div className="w-27.5 text-center text-[11px] font-bold uppercase tracking-[0.05em] text-[#9aa0a6]">Assignee</div>}
                                    {columns.dueDate && <div className="w-30 text-[11px] font-bold uppercase tracking-[0.05em] text-[#9aa0a6]">Due date</div>}
                                    {columns.priority && <div className="w-27.5 text-[11px] font-bold uppercase tracking-[0.05em] text-[#9aa0a6]">Priority</div>}
                                    <div className="w-9" />
                                </div>

                                <div className="flex flex-col">
                                    {group.tasks.map(task => (
                                        <div key={task.id} className="flex flex-col">
                                            <div
                                                className="group relative flex min-h-9 cursor-pointer items-stretch border border-transparent border-b-[#f0f2f5] bg-white transition-colors hover:border-[#eef0f5] hover:bg-[#f8fafb]"
                                                onClick={() => setSelectedTask(task)}
                                                onContextMenu={e => onContextMenu(e, task)}
                                            >
                                                <div className="relative flex min-w-65 flex-1 items-center border-l-[3px] border-l-transparent px-2 py-1.5 pl-3.5">
                                                    <div className="absolute bottom-0 left-0 top-0 w-0.75" style={{ backgroundColor: group.color }} />
                                                    <div className="flex items-center gap-2 pl-1.5">
                                                        <CheckCircle2 size={16} className="shrink-0 text-[#dcdfe4] group-hover:text-[#b0b5c1]" />
                                                        <span className="text-[13px] font-medium text-[#141b2b]">{task.title}</span>
                                                        {task.subtasks.length > 0 && (
                                                            <button className="p-0" onClick={e => toggleTask(e, task.id)}>
                                                                <span className="flex items-center gap-0.5 rounded-full bg-[#f0f4ff] px-1.5 py-0.5 text-[10px] font-extrabold text-[#0058be]">
                                                                    {expandedTasks[task.id] ? <ChevronDown size={10} /> : <ChevronRight size={10} />}
                                                                    {task.subtasks.length}
                                                                </span>
                                                            </button>
                                                        )}
                                                        {task.comments > 0 && (
                                                            <span className="flex items-center gap-1 text-[11px] text-[#9aa0a6]"><MessageSquare size={11} /> {task.comments}</span>
                                                        )}
                                                    </div>
                                                </div>
                                                {columns.assignee && (
                                                    <div className="flex w-27.5 items-center px-2 py-1.5">
                                                        {task.assignees.length > 0
                                                            ? task.assignees.map(a => (
                                                                <Avatar key={a} size={22} style={{ backgroundColor: avatarColors[a], fontSize: '9px', fontWeight: 'bold', marginLeft: '-4px' }}>{a}</Avatar>
                                                            ))
                                                            : <span className="text-xs text-[#d0d3db]">—</span>}
                                                    </div>
                                                )}
                                                {columns.dueDate && (
                                                    <div className="flex w-30 items-center px-2 py-1.5">
                                                        {task.dueDate
                                                            ? <span className={`flex items-center gap-1 text-xs font-medium ${['10/31/23', '11/1/23', '10/3/23'].includes(task.dueDate) ? 'font-bold text-[#e74c3c]' : 'text-[#5f6368]'}`}>
                                                                <Calendar size={11} /> {task.dueDate}
                                                            </span>
                                                            : <Calendar size={13} className="text-[#d0d3db]" />}
                                                    </div>
                                                )}
                                                {columns.priority && (
                                                    <div className="flex w-27.5 items-center px-2 py-1.5">
                                                        {task.priority !== 'Normal' ? (
                                                            <span className="flex items-center gap-1 text-xs font-semibold" style={{ color: task.priorityColor }}>
                                                                <Flag size={11} fill={task.priorityColor} /> {task.priority}
                                                            </span>
                                                        ) : <Flag size={13} className="text-[#d0d3db]" />}
                                                    </div>
                                                )}
                                                <div className="flex w-9 items-center justify-center px-0 py-1.5">
                                                    <button className="cursor-pointer rounded p-0.5 text-[#9aa0a6] opacity-0 hover:bg-[#eef0f5] group-hover:opacity-100" onClick={e => { e.stopPropagation(); onContextMenu(e, task); }}>
                                                        <MoreHorizontal size={14} />
                                                    </button>
                                                </div>
                                            </div>

                                            {/* Subtasks */}
                                            {expandedTasks[task.id] && task.subtasks.map(sub => (
                                                <div key={sub.id} className="relative flex min-h-9 items-stretch border border-transparent border-b-[#f0f2f5] bg-[#fafbfc] hover:bg-[#f5f7fa]">
                                                    <div className="relative flex min-w-65 flex-1 items-center border-l-[3px] border-l-transparent px-2 py-1.5 pl-3.5">
                                                        <div className="absolute bottom-0 left-0 top-0 w-0.75" style={{ backgroundColor: sub.statusColor }} />
                                                        <div className="flex items-center gap-2 pl-7">
                                                            <span className="text-[13px] text-[#c2c9e0]">↳</span>
                                                            <CheckCircle2 size={14} className="shrink-0 text-[#dcdfe4]" />
                                                            <span className="text-xs font-medium text-[#141b2b]">{sub.title}</span>
                                                        </div>
                                                    </div>
                                                    {columns.assignee && (
                                                        <div className="flex w-27.5 items-center px-2 py-1.5">
                                                            {sub.assignee
                                                                ? <Avatar size={20} style={{ backgroundColor: avatarColors[sub.assignee], fontSize: '8px' }}>{sub.assignee}</Avatar>
                                                                : <span className="text-xs text-[#d0d3db]">—</span>}
                                                        </div>
                                                    )}
                                                    {columns.dueDate && <div className="flex w-30 items-center px-2 py-1.5"><Calendar size={13} className="text-[#d0d3db]" /></div>}
                                                    {columns.priority && <div className="flex w-27.5 items-center px-2 py-1.5"><Flag size={13} className="text-[#d0d3db]" /></div>}
                                                    <div className="w-9" />
                                                </div>
                                            ))}
                                        </div>
                                    ))}

                                    {/* Inline add task */}
                                    {inlineGroup === group.id ? (
                                        <div className="mt-0.5 flex items-center gap-2 rounded-md border border-[#0058be] bg-[#f8fbff] px-3.5 py-1.5">
                                            <CheckCircle2 size={16} className="shrink-0 text-[#dcdfe4]" />
                                            <input
                                                ref={inlineRef}
                                                className="flex-1 border-none bg-transparent text-[13px] font-medium text-[#141b2b] outline-none placeholder:text-[#c2c9e0]"
                                                value={inlineText}
                                                onChange={e => setInlineText(e.target.value)}
                                                placeholder="Task name"
                                                onKeyDown={e => {
                                                    if (e.key === 'Enter') handleInlineCreate(group.id);
                                                    if (e.key === 'Escape') { setInlineGroup(null); setInlineText(''); }
                                                }}
                                                onBlur={() => handleInlineCreate(group.id)}
                                            />
                                        </div>
                                    ) : (
                                        <div className="flex cursor-pointer items-center gap-1.5 rounded px-3.5 py-2 text-xs font-semibold text-[#9aa0a6] transition-all duration-150 hover:bg-[#f0f4ff] hover:text-[#0058be]" onClick={() => setInlineGroup(group.id)}>
                                            <Plus size={13} /> Add Task
                                        </div>
                                    )}
                                </div>
                            </>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
}