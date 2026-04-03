import { useState, useRef, useEffect } from 'react';
import {
    X, CheckCircle2, User, Calendar, Flag, Clock,
    MoreHorizontal, Paperclip, Minimize2, Maximize2,
    MessageSquare, Activity, ChevronRight, ChevronDown, Tag
} from 'lucide-react';
import { Button, Input, Avatar, Tooltip } from 'antd';
import './task-detail-modal.css';

interface TaskDetailModalProps {
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
        <div className="tdm-overlay" onClick={onClose}>
            <div
                className={`tdm-modal ${isMaximized ? 'tdm-modal--maximized' : ''}`}
                onClick={e => e.stopPropagation()}
            >
                {/* ═══════ HEADER ═══════ */}
                <div className="tdm-header">
                    <div className="tdm-header-left">
                        <div className="tdm-breadcrumbs">
                            <span>Main Space</span>
                            <ChevronRight size={12} />
                            <span>Task Management</span>
                        </div>
                        {/* Status dropdown */}
                        <div className="tdm-status-wrap" ref={statusRef}>
                            <button
                                className="tdm-status-badge"
                                style={{ backgroundColor: statusObj.color }}
                                onClick={() => setShowStatus(!showStatus)}
                            >
                                {taskStatus} <ChevronDown size={11} />
                            </button>
                            {showStatus && (
                                <div className="tdm-mini-dropdown">
                                    {STATUS_OPTIONS.map(s => (
                                        <button key={s.value}
                                            className={`tdm-dd-item ${taskStatus === s.value ? 'tdm-dd-item--active' : ''}`}
                                            onClick={() => { setTaskStatus(s.value); setShowStatus(false); }}>
                                            <span className="tdm-dd-dot" style={{ backgroundColor: s.color }} />
                                            {s.value}
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                    <div className="tdm-header-right">
                        <Tooltip title={isMaximized ? "Minimize" : "Maximize"}>
                            <button className="tdm-icon-btn" onClick={() => setIsMaximized(!isMaximized)}>
                                {isMaximized ? <Minimize2 size={16} /> : <Maximize2 size={16} />}
                            </button>
                        </Tooltip>
                        <Tooltip title="Options">
                            <button className="tdm-icon-btn"><MoreHorizontal size={16} /></button>
                        </Tooltip>
                        <button className="tdm-icon-btn tdm-close-btn" onClick={onClose}><X size={18} /></button>
                    </div>
                </div>

                {/* ═══════ BODY ═══════ */}
                <div className="tdm-body">

                    {/* LEFT COLUMN */}
                    <div className="tdm-main-col">
                        <input
                            className="tdm-task-title"
                            value={taskTitle}
                            onChange={e => setTaskTitle(e.target.value)}
                            placeholder="Task name"
                        />

                        <div className="tdm-section">
                            <h3 className="tdm-section-title">Description</h3>
                            <textarea
                                className="tdm-desc-editor"
                                placeholder="Add a more detailed description..."
                                value={taskDesc}
                                onChange={e => setTaskDesc(e.target.value)}
                            />
                        </div>

                        <div className="tdm-section">
                            <h3 className="tdm-section-title">Attachments</h3>
                            <div className="tdm-attachment-dropzone">
                                <Paperclip size={20} className="tdm-drop-icon" />
                                <p>Drag & drop files or click to upload</p>
                            </div>
                        </div>

                        {/* Activity / Comments */}
                        <div className="tdm-activity-section">
                            <div className="tdm-activity-tabs">
                                <button
                                    className={`tdm-tab ${activeTab === 'comments' ? 'tdm-tab--active' : ''}`}
                                    onClick={() => setActiveTab('comments')}
                                >
                                    <MessageSquare size={14} /> Comments
                                </button>
                                <button
                                    className={`tdm-tab ${activeTab === 'activity' ? 'tdm-tab--active' : ''}`}
                                    onClick={() => setActiveTab('activity')}
                                >
                                    <Activity size={14} /> Activity
                                </button>
                            </div>

                            <div className="tdm-activity-content">
                                {activeTab === 'comments' ? (
                                    <div className="tdm-comments-list">
                                        <div className="tdm-comment">
                                            <Avatar src="https://i.pravatar.cc/150?u=a042581f4e29026024d" />
                                            <div className="tdm-comment-body">
                                                <div className="tdm-comment-header">
                                                    <strong>Alex Rivera</strong> <span>2 hours ago</span>
                                                </div>
                                                <p>I have started working on the initial drafts. Will upload soon.</p>
                                            </div>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="tdm-activity-list">
                                        <div className="tdm-activity-item">
                                            <Avatar size={24} src="https://i.pravatar.cc/150?u=a04258a2462d826712d" />
                                            <p><strong>Sarah Chen</strong> changed status from <em>To Do</em> to <em>In Progress</em> <br /><span>4 hours ago</span></p>
                                        </div>
                                    </div>
                                )}
                            </div>

                            <div className="tdm-comment-input-area">
                                <Avatar src="https://i.pravatar.cc/150?u=fake@pravatar.com" />
                                <div className="tdm-comment-box">
                                    <Input.TextArea placeholder="Write a comment..." autoSize={{ minRows: 2, maxRows: 6 }} />
                                    <div className="tdm-comment-actions">
                                        <Button type="primary" size="small">Comment</Button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* RIGHT COLUMN: Metadata */}
                    <div className="tdm-meta-col">
                        <div className="tdm-meta-group">
                            {/* Assignee */}
                            <div className="tdm-meta-item" ref={assigneeRef}>
                                <span className="tdm-meta-label">Assignee</span>
                                <div className="tdm-meta-value tdm-meta-clickable" onClick={() => setShowAssignee(!showAssignee)}>
                                    {task.assignees && task.assignees.length > 0 ? (
                                        <div className="tdm-assignee-avatars">
                                            {task.assignees.map((a: string) => {
                                                const member = MEMBER_OPTIONS.find(m => m.id === a);
                                                return (
                                                    <Avatar key={a} size={24} style={{
                                                        backgroundColor: member?.color || '#9aa0a6',
                                                        fontSize: '10px', fontWeight: 'bold'
                                                    }}>{a}</Avatar>
                                                );
                                            })}
                                        </div>
                                    ) : (
                                        <><User size={14} className="tdm-meta-icon" /> Assign</>
                                    )}
                                </div>
                                {showAssignee && (
                                    <div className="tdm-mini-dropdown tdm-dd-right">
                                        {MEMBER_OPTIONS.map(m => (
                                            <button key={m.id} className="tdm-dd-item">
                                                <span className="tdm-dd-avatar" style={{ backgroundColor: m.color }}>{m.id}</span>
                                                {m.name}
                                            </button>
                                        ))}
                                    </div>
                                )}
                            </div>

                            {/* Due Date */}
                            <div className="tdm-meta-item">
                                <span className="tdm-meta-label">Due Date</span>
                                <div className="tdm-meta-value tdm-meta-clickable tdm-date-wrap">
                                    <Calendar size={14} className="tdm-meta-icon" />
                                    <span>{task.dueDate || 'Set date'}</span>
                                    <input type="date" className="tdm-hidden-date" />
                                </div>
                            </div>

                            {/* Priority dropdown */}
                            <div className="tdm-meta-item" ref={priorityRef}>
                                <span className="tdm-meta-label">Priority</span>
                                <div className="tdm-meta-value tdm-meta-clickable" onClick={() => setShowPriority(!showPriority)}>
                                    <Flag size={14} className="tdm-meta-icon"
                                        fill={taskPriority !== 'Normal' ? priorityObj.color : 'none'}
                                        color={priorityObj.color} />
                                    <span style={{ color: priorityObj.color, fontWeight: 600 }}>{taskPriority}</span>
                                </div>
                                {showPriority && (
                                    <div className="tdm-mini-dropdown tdm-dd-right">
                                        {PRIORITY_OPTIONS.map(p => (
                                            <button key={p.value}
                                                className={`tdm-dd-item ${taskPriority === p.value ? 'tdm-dd-item--active' : ''}`}
                                                onClick={() => { setTaskPriority(p.value); setShowPriority(false); }}>
                                                <Flag size={13} fill={p.value !== 'Normal' ? p.color : 'none'} color={p.color} />
                                                {p.value}
                                            </button>
                                        ))}
                                    </div>
                                )}
                            </div>

                            {/* Time Tracked */}
                            <div className="tdm-meta-item">
                                <span className="tdm-meta-label">Time Tracked</span>
                                <div className="tdm-meta-value tdm-meta-value--timer">
                                    <Clock size={14} className="tdm-meta-icon" /> 00:00:00 <Button size="small" type="primary" className="tdm-timer-btn">Play</Button>
                                </div>
                            </div>

                            {/* Tags */}
                            <div className="tdm-meta-item">
                                <span className="tdm-meta-label">Tags</span>
                                <div className="tdm-meta-value tdm-meta-clickable">
                                    <Tag size={14} className="tdm-meta-icon" /> Add Tags
                                </div>
                            </div>
                        </div>

                        <div className="tdm-meta-section">
                            <h4>Subtasks</h4>
                            {task.subtasks && task.subtasks.length > 0 ? (
                                <div className="tdm-subtask-list">
                                    {task.subtasks.map((sub: any) => (
                                        <div key={sub.id} className="tdm-subtask-item">
                                            <CheckCircle2 size={14} style={{ color: sub.statusColor || '#dcdfe4' }} />
                                            <span>{sub.title}</span>
                                        </div>
                                    ))}
                                </div>
                            ) : null}
                            <Button block type="dashed" icon={<CheckCircle2 size={14} />}>Add Subtask</Button>
                        </div>

                        <div className="tdm-meta-section">
                            <h4>Relationships</h4>
                            <p className="tdm-empty-text">No relationships added.</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
