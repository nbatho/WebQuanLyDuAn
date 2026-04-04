/* ═══════════════════════════════════════════════
   BOARD VIEW
═══════════════════════════════════════════════ */
import { Calendar, Flag, MoreHorizontal, Plus } from "lucide-react";
import { Avatar } from "antd";
import { useEffect, useRef, useState, type DragEvent } from "react";
import type { Task, StatusGroup } from "../../../../types/tasks";



const avatarColors: Record<string, string> = {
    AR: '#4285F4', MC: '#7c5cfc', SJ: '#0058be', ER: '#e84393'
};

let taskIdCounter = 100;
export default function BoardView({
    groups, setGroups, setSelectedTask, showClosed,
    onContextMenu,
}: {
    groups: StatusGroup[];
    setGroups: React.Dispatch<React.SetStateAction<StatusGroup[]>>;
    setSelectedTask: (t: Task | null) => void;
    showClosed: boolean;
    onContextMenu: (e: React.MouseEvent, task: Task) => void;
}) {
    const dragItem = useRef<{ fromGroupId: string; taskId: string } | null>(null);
    const [dragOverGroup, setDragOverGroup] = useState<string | null>(null);
    const [inlineCol, setInlineCol] = useState<string | null>(null);
    const [inlineText, setInlineText] = useState('');
    const inlineRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        if (inlineCol) setTimeout(() => inlineRef.current?.focus(), 50);
    }, [inlineCol]);

    const displayGroups = showClosed ? groups : groups.filter(g => g.id !== 'done');

    const onDragStart = (e: DragEvent, groupId: string, taskId: string) => {
        dragItem.current = { fromGroupId: groupId, taskId };
        e.dataTransfer.effectAllowed = 'move';
        (e.currentTarget as HTMLElement).style.opacity = '0.5';
    };
    const onDragEnd = (e: DragEvent) => {
        (e.currentTarget as HTMLElement).style.opacity = '1';
        setDragOverGroup(null);
    };
    const onDrop = (e: DragEvent, toGroupId: string) => {
        e.preventDefault(); setDragOverGroup(null);
        if (!dragItem.current) return;
        const { fromGroupId, taskId } = dragItem.current;
        if (fromGroupId === toGroupId) return;
        setGroups(prev => {
            const tgt = prev.find(g => g.id === toGroupId)!;
            const task = prev.find(g => g.id === fromGroupId)!.tasks.find(t => t.id === taskId)!;
            return prev.map(g => {
                if (g.id === fromGroupId) return { ...g, tasks: g.tasks.filter(t => t.id !== taskId) };
                if (g.id === toGroupId) return { ...g, tasks: [...g.tasks, { ...task, status: tgt.name, statusColor: tgt.color }] };
                return g;
            });
        });
        dragItem.current = null;
    };

    const handleInlineCreate = (groupId: string) => {
        if (!inlineText.trim()) { setInlineCol(null); return; }
        const group = groups.find(g => g.id === groupId)!;
        const newTask: Task = {
            id: `t${taskIdCounter++}`, title: inlineText.trim(),
            status: group.name, statusColor: group.color,
            priority: 'Normal', priorityColor: '#00b894',
            dueDate: null, assignees: [], comments: 0, subtasks: [],
        };
        setGroups(prev => prev.map(g => g.id === groupId ? { ...g, tasks: [...g.tasks, newTask] } : g));
        setInlineText(''); setInlineCol(null);
    };

    return (
        <div className="flex-1 flex flex-col overflow-hidden">
            <div className="flex flex-1 items-start gap-3 overflow-x-auto px-5 py-4">
                {displayGroups.map(group => (
                    <div key={group.id}
                        className={`w-70 shrink-0 overflow-hidden rounded-[10px] border-2 transition-colors ${dragOverGroup === group.id
                                ? 'border-[#0058be] bg-[#f0f4ff]'
                                : 'border-transparent bg-[#f8fafb]'
                            }`}
                        onDragOver={e => { e.preventDefault(); setDragOverGroup(group.id); }}
                        onDragLeave={() => setDragOverGroup(null)}
                        onDrop={e => onDrop(e, group.id)}
                    >
                        <div className="flex items-center justify-between px-3.5 py-2.5">
                            <div className="flex items-center gap-1.75">
                                <span className="h-2.5 w-2.5 shrink-0 rounded-full" style={{ backgroundColor: group.color }} />
                                <span className="text-xs font-extrabold uppercase tracking-[0.04em] text-[#141b2b]">{group.name}</span>
                                <span className="rounded-full bg-[#eef0f5] px-1.25 py-px text-[11px] font-bold text-[#5f6368]">{group.tasks.length}</span>
                            </div>
                            <div className="flex gap-0.5">
                                <button className="flex items-center rounded p-0.75 px-1.25 text-[#9aa0a6] hover:bg-[#eef0f5] hover:text-[#5f6368]"><MoreHorizontal size={14} /></button>
                                <button className="flex items-center rounded p-0.75 px-1.25 text-[#9aa0a6] hover:bg-[#eef0f5] hover:text-[#5f6368]" onClick={() => setInlineCol(group.id)}><Plus size={14} /></button>
                            </div>
                        </div>
                        <div className="flex max-h-[calc(100vh-260px)] flex-col gap-1.5 overflow-y-auto px-2 pb-2">
                            {group.tasks.map(task => (
                                <div key={task.id} className="cursor-pointer rounded-lg border border-[#eef0f5] bg-white px-3.5 py-3 shadow-[0_1px_3px_rgba(0,0,0,0.04)] transition-all duration-150 hover:-translate-y-px hover:border-[#dcdfe4] hover:shadow-[0_4px_12px_rgba(0,0,0,0.08)]" draggable
                                    onDragStart={e => onDragStart(e, group.id, task.id)}
                                    onDragEnd={onDragEnd}
                                    onClick={() => setSelectedTask(task)}
                                    onContextMenu={e => onContextMenu(e, task)}
                                >
                                    <div className="mb-1.5 text-[13px] font-semibold leading-[1.4] text-[#141b2b]">{task.title}</div>
                                    <div className="mb-2 text-[15px] text-[#dcdfe4]"><span>≡</span></div>
                                    <div className="flex flex-wrap items-center gap-2">
                                        {task.dueDate && (
                                            <span className={`flex items-center gap-1 rounded px-1.5 py-0.5 text-[11px] font-medium ${['10/31/23', '11/1/23', '10/3/23'].includes(task.dueDate)
                                                    ? 'bg-[#fff3f0] font-bold text-[#e74c3c]'
                                                    : 'bg-[#f8fafb] text-[#5f6368]'
                                                }`}>
                                                <Calendar size={11} /> {task.dueDate}
                                            </span>
                                        )}
                                        {task.priority !== 'Normal' && (
                                            <span className="flex items-center gap-1 text-[11px] font-semibold" style={{ color: task.priorityColor }}>
                                                <Flag size={11} fill={task.priorityColor} /> {task.priority}
                                            </span>
                                        )}
                                        {task.assignees.map(a => (
                                            <Avatar key={a} size={20} style={{ backgroundColor: avatarColors[a], fontSize: '8px', fontWeight: 'bold' }}>{a}</Avatar>
                                        ))}
                                    </div>
                                </div>
                            ))}

                            {inlineCol === group.id ? (
                                <div className="rounded-lg border border-[#0058be] bg-[#f8fbff] px-3.5 py-3 shadow-[0_0_0_2px_rgba(0,88,190,0.15)]">
                                    <input
                                        ref={inlineRef}
                                        className="w-full border-none bg-transparent text-[13px] font-medium text-[#141b2b] outline-none placeholder:text-[#c2c9e0]"
                                        value={inlineText}
                                        onChange={e => setInlineText(e.target.value)}
                                        placeholder="Task name"
                                        onKeyDown={e => {
                                            if (e.key === 'Enter') handleInlineCreate(group.id);
                                            if (e.key === 'Escape') { setInlineCol(null); setInlineText(''); }
                                        }}
                                        onBlur={() => handleInlineCreate(group.id)}
                                    />
                                </div>
                            ) : (
                                <button className="flex w-full cursor-pointer items-center gap-1.5 rounded-md border-none bg-transparent px-1.5 py-1.75 text-left text-xs font-semibold text-[#9aa0a6] transition-all duration-150 hover:bg-[#f0f4ff] hover:text-[#0058be]" onClick={() => setInlineCol(group.id)}>
                                    <Plus size={13} /> Add Task
                                </button>
                            )}
                        </div>
                    </div>
                ))}
                <div className="h-fit cursor-pointer whitespace-nowrap rounded-lg px-3.5 py-2.5 text-[13px] font-semibold text-[#9aa0a6] transition-all duration-150 hover:bg-[#f0f4ff] hover:text-[#0058be]"><Plus size={14} className="mr-1.5 inline" />Add group</div>
            </div>
        </div>
    );
}