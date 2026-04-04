import { useState, useRef, useEffect } from 'react';
import {
    X, CheckCircle2, User, Calendar, Flag, Clock,
    MoreHorizontal, Paperclip, Minimize2, Maximize2,
    MessageSquare, Activity, ChevronRight, ChevronDown, Tag
} from 'lucide-react';
import { Button, Input, Avatar, Tooltip } from 'antd';

export interface TaskDetailModalProps {
    isOpen: boolean;
    onClose: () => void;
    task: any;
}

const STATUS_OPTIONS = [
    { value: 'TO DO', color: '#5f6368' },
    { value: 'IN PROGRESS', color: '#0058be' },
    { value: 'COMPLETE', color: '#27ae60' },
];

const PRIORITY_OPTIONS = [
    { value: 'Urgent', color: '#e74c3c' },
    { value: 'High', color: '#f0a220' },
    { value: 'Normal', color: '#00b894' },
    { value: 'Low', color: '#9aa0a6' },
];

const MEMBER_OPTIONS = [
    { id: 'AR', name: 'Alex Rivera', color: '#4285F4' },
    { id: 'MC', name: 'Marcus Chen', color: '#7c5cfc' },
    { id: 'SJ', name: 'Sarah Jenkins', color: '#0058be' },
    { id: 'ER', name: 'Elena Rodriguez', color: '#e84393' },
];

export default function TaskDetailModal({ isOpen, onClose, task }: TaskDetailModalProps) {
    const [isMaximized, setIsMaximized] = useState(false);
    const [activeTab, setActiveTab] = useState<'comments' | 'activity'>('comments');
    const [taskTitle, setTaskTitle] = useState('');
    const [taskDesc, setTaskDesc] = useState('');
    const [taskStatus, setTaskStatus] = useState('TO DO');
    const [taskPriority, setTaskPriority] = useState('Normal');

    // Dropdown states
    const [showStatus, setShowStatus] = useState(false);
    const [showPriority, setShowPriority] = useState(false);
    const [showAssignee, setShowAssignee] = useState(false);

    const statusRef = useRef<HTMLDivElement>(null);
    const priorityRef = useRef<HTMLDivElement>(null);
    const assigneeRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (task) {
            setTaskTitle(task.title || '');
            setTaskDesc(task.description || '');
            setTaskStatus(task.status || 'TO DO');
            setTaskPriority(task.priority || 'Normal');
        }
    }, [task]);

    // Close dropdowns on outside click
    useEffect(() => {
        const handler = (e: MouseEvent) => {
            if (statusRef.current && !statusRef.current.contains(e.target as Node)) setShowStatus(false);
            if (priorityRef.current && !priorityRef.current.contains(e.target as Node)) setShowPriority(false);
            if (assigneeRef.current && !assigneeRef.current.contains(e.target as Node)) setShowAssignee(false);
        };
        document.addEventListener('mousedown', handler);
        return () => document.removeEventListener('mousedown', handler);
    }, []);

    if (!isOpen || !task) return null;

    const statusObj = STATUS_OPTIONS.find(s => s.value === taskStatus) || STATUS_OPTIONS[0];
    const priorityObj = PRIORITY_OPTIONS.find(p => p.value === taskPriority) || PRIORITY_OPTIONS[2];

    return (
        <div className="fixed inset-0 z-1500 flex items-center justify-center bg-[rgba(20,27,43,0.5)]" onClick={onClose}>
            <div
                className={`${isMaximized
                        ? 'h-screen max-h-screen w-screen max-w-screen rounded-none'
                        : 'max-h-[88vh] w-220 max-w-[95vw] rounded-[14px]'
                    } flex flex-col overflow-hidden bg-white shadow-[0_20px_60px_rgba(0,0,0,0.25)]`}
                onClick={e => e.stopPropagation()}
            >
                <div className="shrink-0 border-b border-[#eef0f5] px-4.5 py-3">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2.5">
                            <div className="flex items-center gap-1 text-xs text-[#9aa0a6]">
                                <span>Main Space</span>
                                <ChevronRight size={12} />
                                <span>Task Management</span>
                            </div>
                            <div className="relative" ref={statusRef}>
                                <button
                                    className="flex cursor-pointer items-center gap-1 rounded px-2.5 py-0.75 text-[11px] font-extrabold tracking-[0.03em] text-white transition-opacity hover:opacity-85"
                                    style={{ backgroundColor: statusObj.color }}
                                    onClick={() => setShowStatus(!showStatus)}
                                >
                                    {taskStatus} <ChevronDown size={11} />
                                </button>
                                {showStatus && (
                                    <div className="absolute left-0 top-[calc(100%+4px)] z-20 min-w-45 rounded-lg border border-[#eef0f5] bg-white p-1 shadow-[0_6px_20px_rgba(0,0,0,0.12)]">
                                        {STATUS_OPTIONS.map(s => (
                                            <button
                                                key={s.value}
                                                className={`flex w-full cursor-pointer items-center gap-2 rounded-md border-none px-2.5 py-1.5 text-left text-xs font-semibold ${taskStatus === s.value
                                                        ? 'bg-[#f0f4ff] text-[#0058be]'
                                                        : 'bg-transparent text-[#141b2b] hover:bg-[#f0f4ff]'
                                                    }`}
                                                onClick={() => { setTaskStatus(s.value); setShowStatus(false); }}
                                            >
                                                <span className="h-2 w-2 shrink-0 rounded-full" style={{ backgroundColor: s.color }} />
                                                {s.value}
                                            </button>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>
                        <div className="flex items-center gap-1">
                            <Tooltip title={isMaximized ? 'Minimize' : 'Maximize'}>
                                <button
                                    className="flex cursor-pointer items-center rounded-md border-none bg-transparent p-1 text-[#9aa0a6] hover:bg-[#f0f2f5] hover:text-[#5f6368]"
                                    onClick={() => setIsMaximized(!isMaximized)}
                                >
                                    {isMaximized ? <Minimize2 size={16} /> : <Maximize2 size={16} />}
                                </button>
                            </Tooltip>
                            <Tooltip title="Options">
                                <button className="flex cursor-pointer items-center rounded-md border-none bg-transparent p-1 text-[#9aa0a6] hover:bg-[#f0f2f5] hover:text-[#5f6368]">
                                    <MoreHorizontal size={16} />
                                </button>
                            </Tooltip>
                            <button
                                className="flex cursor-pointer items-center rounded-md border-none bg-transparent p-1 text-[#9aa0a6] hover:bg-[#fff5f5] hover:text-[#e74c3c]"
                                onClick={onClose}
                            >
                                <X size={18} />
                            </button>
                        </div>
                    </div>
                </div>

                <div className="flex flex-1 overflow-hidden">
                    <div className="flex flex-1 flex-col gap-4 overflow-y-auto px-6 py-5">
                        <input
                            className="w-full border-x-0 border-t-0 border-b-2 border-b-transparent p-0 text-[22px] font-extrabold text-[#141b2b] outline-none transition-colors placeholder:text-[#c2c9e0] focus:border-b-[#0058be]"
                            value={taskTitle}
                            onChange={e => setTaskTitle(e.target.value)}
                            placeholder="Task name"
                        />

                        <div className="mt-1">
                            <h3 className="mb-2 text-[13px] font-bold uppercase tracking-[0.04em] text-[#5f6368]">Description</h3>
                            <textarea
                                className="min-h-20 w-full resize-y rounded-lg border border-[#eef0f5] p-3 text-[13px] leading-6 text-[#141b2b] outline-none transition-colors placeholder:text-[#c2c9e0] focus:border-[#0058be]"
                                placeholder="Add a more detailed description..."
                                value={taskDesc}
                                onChange={e => setTaskDesc(e.target.value)}
                            />
                        </div>

                        <div className="mt-1">
                            <h3 className="mb-2 text-[13px] font-bold uppercase tracking-[0.04em] text-[#5f6368]">Attachments</h3>
                            <div className="flex cursor-pointer flex-col items-center gap-1.5 rounded-[10px] border-2 border-dashed border-[#eef0f5] p-6 text-center text-[13px] text-[#c2c9e0] transition-all hover:border-[#0058be] hover:bg-[#f8fbff] hover:text-[#5f6368]">
                                <Paperclip size={20} className="opacity-50" />
                                <p>Drag & drop files or click to upload</p>
                            </div>
                        </div>

                        <div className="mt-2">
                            <div className="mb-3 flex gap-3 border-b border-[#eef0f5]">
                                <button
                                    className={`flex cursor-pointer items-center gap-1.25 border-x-0 border-t-0 border-b-2 bg-transparent px-1 py-2 text-[13px] font-semibold transition-all ${activeTab === 'comments'
                                            ? 'border-b-[#0058be] text-[#0058be]'
                                            : 'border-b-transparent text-[#9aa0a6] hover:text-[#5f6368]'
                                        }`}
                                    onClick={() => setActiveTab('comments')}
                                >
                                    <MessageSquare size={14} /> Comments
                                </button>
                                <button
                                    className={`flex cursor-pointer items-center gap-1.25 border-x-0 border-t-0 border-b-2 bg-transparent px-1 py-2 text-[13px] font-semibold transition-all ${activeTab === 'activity'
                                            ? 'border-b-[#0058be] text-[#0058be]'
                                            : 'border-b-transparent text-[#9aa0a6] hover:text-[#5f6368]'
                                        }`}
                                    onClick={() => setActiveTab('activity')}
                                >
                                    <Activity size={14} /> Activity
                                </button>
                            </div>

                            <div className="min-h-15">
                                {activeTab === 'comments' ? (
                                    <div className="flex flex-col gap-3">
                                        <div className="flex gap-2.5">
                                            <Avatar src="https://i.pravatar.cc/150?u=a042581f4e29026024d" />
                                            <div className="flex-1">
                                                <div className="mb-1 flex gap-2">
                                                    <strong className="text-[13px] text-[#141b2b]">Alex Rivera</strong>
                                                    <span className="text-xs text-[#9aa0a6]">2 hours ago</span>
                                                </div>
                                                <p className="m-0 text-[13px] leading-6 text-[#5f6368]">I have started working on the initial drafts. Will upload soon.</p>
                                            </div>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="flex flex-col gap-3">
                                        <div className="flex items-start gap-2.5">
                                            <Avatar size={24} src="https://i.pravatar.cc/150?u=a04258a2462d826712d" />
                                            <p className="m-0 text-[13px] leading-[1.4] text-[#5f6368]">
                                                <strong>Sarah Chen</strong> changed status from <em className="font-semibold not-italic text-[#0058be]">To Do</em> to <em className="font-semibold not-italic text-[#0058be]">In Progress</em> <br />
                                                <span className="text-[11px] text-[#9aa0a6]">4 hours ago</span>
                                            </p>
                                        </div>
                                    </div>
                                )}
                            </div>

                            <div className="mt-3.5 flex gap-2.5 border-t border-[#eef0f5] pt-3.5">
                                <Avatar src="https://i.pravatar.cc/150?u=fake@pravatar.com" />
                                <div className="flex flex-1 flex-col gap-1.5">
                                    <Input.TextArea placeholder="Write a comment..." autoSize={{ minRows: 2, maxRows: 6 }} />
                                    <div className="flex justify-end">
                                        <Button type="primary" size="small">Comment</Button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="flex w-65 shrink-0 flex-col gap-4 overflow-y-auto border-l border-[#eef0f5] p-4">
                        <div className="flex flex-col gap-1">
                            <div className="relative flex flex-col gap-0.75 py-1.5" ref={assigneeRef}>
                                <span className="text-[11px] font-bold uppercase tracking-[0.04em] text-[#9aa0a6]">Assignee</span>
                                <div
                                    className="flex cursor-pointer items-center gap-1.5 rounded-md px-1.5 py-1 text-[13px] font-medium text-[#5f6368] transition-colors hover:bg-[#f0f4ff]"
                                    onClick={() => setShowAssignee(!showAssignee)}
                                >
                                    {task.assignees && task.assignees.length > 0 ? (
                                        <div className="flex gap-1">
                                            {task.assignees.map((a: string) => {
                                                const member = MEMBER_OPTIONS.find(m => m.id === a);
                                                return (
                                                    <Avatar
                                                        key={a}
                                                        size={24}
                                                        style={{
                                                            backgroundColor: member?.color || '#9aa0a6',
                                                            fontSize: '10px',
                                                            fontWeight: 'bold',
                                                        }}
                                                    >
                                                        {a}
                                                    </Avatar>
                                                );
                                            })}
                                        </div>
                                    ) : (
                                        <>
                                            <User size={14} className="shrink-0 text-[#9aa0a6]" /> Assign
                                        </>
                                    )}
                                </div>
                                {showAssignee && (
                                    <div className="absolute right-0 top-[calc(100%+4px)] z-20 min-w-45 rounded-lg border border-[#eef0f5] bg-white p-1 shadow-[0_6px_20px_rgba(0,0,0,0.12)]">
                                        {MEMBER_OPTIONS.map(m => (
                                            <button
                                                key={m.id}
                                                className="flex w-full cursor-pointer items-center gap-2 rounded-md border-none px-2.5 py-1.5 text-left text-xs font-semibold text-[#141b2b] hover:bg-[#f0f4ff]"
                                            >
                                                <span
                                                    className="flex h-5.5 w-5.5 shrink-0 items-center justify-center rounded-full text-[9px] font-bold text-white"
                                                    style={{ backgroundColor: m.color }}
                                                >
                                                    {m.id}
                                                </span>
                                                {m.name}
                                            </button>
                                        ))}
                                    </div>
                                )}
                            </div>

                            <div className="flex flex-col gap-0.75 py-1.5">
                                <span className="text-[11px] font-bold uppercase tracking-[0.04em] text-[#9aa0a6]">Due Date</span>
                                <div className="relative flex cursor-pointer items-center gap-1.5 rounded-md px-1.5 py-1 text-[13px] font-medium text-[#5f6368] transition-colors hover:bg-[#f0f4ff]">
                                    <Calendar size={14} className="shrink-0 text-[#9aa0a6]" />
                                    <span>{task.dueDate || 'Set date'}</span>
                                    <input type="date" className="absolute inset-0 h-full w-full cursor-pointer opacity-0" />
                                </div>
                            </div>

                            <div className="relative flex flex-col gap-0.75 py-1.5" ref={priorityRef}>
                                <span className="text-[11px] font-bold uppercase tracking-[0.04em] text-[#9aa0a6]">Priority</span>
                                <div
                                    className="flex cursor-pointer items-center gap-1.5 rounded-md px-1.5 py-1 text-[13px] font-medium text-[#5f6368] transition-colors hover:bg-[#f0f4ff]"
                                    onClick={() => setShowPriority(!showPriority)}
                                >
                                    <Flag
                                        size={14}
                                        className="shrink-0"
                                        fill={taskPriority !== 'Normal' ? priorityObj.color : 'none'}
                                        color={priorityObj.color}
                                    />
                                    <span style={{ color: priorityObj.color, fontWeight: 600 }}>{taskPriority}</span>
                                </div>
                                {showPriority && (
                                    <div className="absolute right-0 top-[calc(100%+4px)] z-20 min-w-45 rounded-lg border border-[#eef0f5] bg-white p-1 shadow-[0_6px_20px_rgba(0,0,0,0.12)]">
                                        {PRIORITY_OPTIONS.map(p => (
                                            <button
                                                key={p.value}
                                                className={`flex w-full cursor-pointer items-center gap-2 rounded-md border-none px-2.5 py-1.5 text-left text-xs font-semibold ${taskPriority === p.value
                                                        ? 'bg-[#f0f4ff] text-[#0058be]'
                                                        : 'bg-transparent text-[#141b2b] hover:bg-[#f0f4ff]'
                                                    }`}
                                                onClick={() => { setTaskPriority(p.value); setShowPriority(false); }}
                                            >
                                                <Flag size={13} fill={p.value !== 'Normal' ? p.color : 'none'} color={p.color} />
                                                {p.value}
                                            </button>
                                        ))}
                                    </div>
                                )}
                            </div>

                            <div className="flex flex-col gap-0.75 py-1.5">
                                <span className="text-[11px] font-bold uppercase tracking-[0.04em] text-[#9aa0a6]">Time Tracked</span>
                                <div className="flex items-center gap-2 rounded-md px-1.5 py-1 text-[13px] font-medium text-[#5f6368]">
                                    <Clock size={14} className="shrink-0 text-[#9aa0a6]" /> 00:00:00
                                    <Button size="small" type="primary" className="text-[11px]">Play</Button>
                                </div>
                            </div>

                            <div className="flex flex-col gap-0.75 py-1.5">
                                <span className="text-[11px] font-bold uppercase tracking-[0.04em] text-[#9aa0a6]">Tags</span>
                                <div className="flex cursor-pointer items-center gap-1.5 rounded-md px-1.5 py-1 text-[13px] font-medium text-[#5f6368] transition-colors hover:bg-[#f0f4ff]">
                                    <Tag size={14} className="shrink-0 text-[#9aa0a6]" /> Add Tags
                                </div>
                            </div>
                        </div>

                        <div className="border-t border-[#f0f2f5] pt-2">
                            <h4 className="mb-2 text-xs font-bold text-[#141b2b]">Subtasks</h4>
                            {task.subtasks && task.subtasks.length > 0 ? (
                                <div className="mb-2 flex flex-col gap-1">
                                    {task.subtasks.map((sub: any) => (
                                        <div
                                            key={sub.id}
                                            className="flex cursor-pointer items-center gap-1.5 rounded px-1.5 py-1 text-xs font-medium text-[#141b2b] hover:bg-[#f0f4ff]"
                                        >
                                            <CheckCircle2 size={14} style={{ color: sub.statusColor || '#dcdfe4' }} />
                                            <span>{sub.title}</span>
                                        </div>
                                    ))}
                                </div>
                            ) : null}
                            <Button block type="dashed" icon={<CheckCircle2 size={14} />}>Add Subtask</Button>
                        </div>

                        <div className="border-t border-[#f0f2f5] pt-2">
                            <h4 className="mb-2 text-xs font-bold text-[#141b2b]">Relationships</h4>
                            <p className="my-1 text-xs text-[#c2c9e0]">No relationships added.</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
