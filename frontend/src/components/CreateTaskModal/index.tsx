import { useState, useRef, useEffect } from 'react';
import {
    X, ChevronDown, Calendar, Flag, User, AlignLeft,
    Paperclip, FolderOpen, Hash
} from 'lucide-react';
import './create-task-modal.css';

export interface NewTaskData {
    title: string;
    status: string;
    statusColor: string;
    priority: string;
    priorityColor: string;
    dueDate: string | null;
    assignees: string[];
    description: string;
    listName: string;
}

interface CreateTaskModalProps {
    isOpen: boolean;
    onClose: () => void;
    onCreate: (task: NewTaskData) => void;
    defaultStatus?: string;
}

const STATUS_OPTIONS = [
    { value: 'TO DO', color: '#5f6368', label: 'TO DO' },
    { value: 'IN PROGRESS', color: '#0058be', label: 'IN PROGRESS' },
    { value: 'COMPLETE', color: '#27ae60', label: 'COMPLETE' },
];

const PRIORITY_OPTIONS = [
    { value: 'Urgent', color: '#e74c3c', icon: '🔴' },
    { value: 'High', color: '#f0a220', icon: '🟠' },
    { value: 'Normal', color: '#00b894', icon: '🟢' },
    { value: 'Low', color: '#9aa0a6', icon: '⚪' },
];

const MEMBER_OPTIONS = [
    { id: 'AR', name: 'Alex Rivera', color: '#4285F4' },
    { id: 'MC', name: 'Marcus Chen', color: '#7c5cfc' },
    { id: 'SJ', name: 'Sarah Jenkins', color: '#0058be' },
    { id: 'ER', name: 'Elena Rodriguez', color: '#e84393' },
];

const LIST_OPTIONS = ['Action Items', 'Backlog', 'Ideas'];

export default function CreateTaskModal({ isOpen, onClose, onCreate, defaultStatus }: CreateTaskModalProps) {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [status, setStatus] = useState(defaultStatus || 'TO DO');
    const [priority, setPriority] = useState('Normal');
    const [dueDate, setDueDate] = useState('');
    const [assignees, setAssignees] = useState<string[]>([]);
    const [listName, setListName] = useState('Action Items');

    // Dropdown states
    const [showStatus, setShowStatus] = useState(false);
    const [showPriority, setShowPriority] = useState(false);
    const [showAssignee, setShowAssignee] = useState(false);
    const [showList, setShowList] = useState(false);

    const titleRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        if (isOpen) {
            setTitle('');
            setDescription('');
            setStatus(defaultStatus || 'TO DO');
            setPriority('Normal');
            setDueDate('');
            setAssignees([]);
            setListName('Action Items');
            setTimeout(() => titleRef.current?.focus(), 100);
        }
    }, [isOpen, defaultStatus]);

    if (!isOpen) return null;

    const statusObj = STATUS_OPTIONS.find(s => s.value === status) || STATUS_OPTIONS[0];
    const priorityObj = PRIORITY_OPTIONS.find(p => p.value === priority) || PRIORITY_OPTIONS[2];

    const handleCreate = () => {
        if (!title.trim()) return;
        onCreate({
            title: title.trim(),
            status,
            statusColor: statusObj.color,
            priority,
            priorityColor: priorityObj.color,
            dueDate: dueDate || null,
            assignees,
            description,
            listName,
        });
        onClose();
    };

    const toggleAssignee = (id: string) => {
        setAssignees(prev => prev.includes(id) ? prev.filter(a => a !== id) : [...prev, id]);
    };

    const closeAllDropdowns = () => {
        setShowStatus(false);
        setShowPriority(false);
        setShowAssignee(false);
        setShowList(false);
    };

    return (
        <div className="ctm-overlay" onClick={onClose}>
            <div className="ctm-modal" onClick={e => { e.stopPropagation(); closeAllDropdowns(); }}>
                {/* Header */}
                <div className="ctm-header">
                    <div className="ctm-header-left">
                        <Hash size={16} className="ctm-header-icon" />
                        <span className="ctm-header-title">Create Task</span>
                    </div>
                    <button className="ctm-close-btn" onClick={onClose}><X size={18} /></button>
                </div>

                {/* List selector */}
                <div className="ctm-list-row">
                    <FolderOpen size={14} />
                    <span className="ctm-list-label">in</span>
                    <div className="ctm-dropdown-wrap" onClick={e => e.stopPropagation()}>
                        <button className="ctm-list-btn" onClick={() => { closeAllDropdowns(); setShowList(!showList); }}>
                            {listName} <ChevronDown size={12} />
                        </button>
                        {showList && (
                            <div className="ctm-dropdown">
                                {LIST_OPTIONS.map(l => (
                                    <button key={l} className={`ctm-dropdown-item ${listName === l ? 'ctm-dropdown-item--active' : ''}`}
                                        onClick={() => { setListName(l); setShowList(false); }}>
                                        <FolderOpen size={13} /> {l}
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>
                </div>

                {/* Title input */}
                <div className="ctm-title-area">
                    <input
                        ref={titleRef}
                        className="ctm-title-input"
                        value={title}
                        onChange={e => setTitle(e.target.value)}
                        placeholder="Task name"
                        onKeyDown={e => { if (e.key === 'Enter' && title.trim()) handleCreate(); }}
                    />
                </div>

                {/* Description */}
                <div className="ctm-desc-area">
                    <AlignLeft size={14} className="ctm-desc-icon" />
                    <textarea
                        className="ctm-desc-input"
                        value={description}
                        onChange={e => setDescription(e.target.value)}
                        placeholder="Add description..."
                        rows={3}
                    />
                </div>

                {/* Fields row */}
                <div className="ctm-fields-row">
                    {/* Status */}
                    <div className="ctm-dropdown-wrap" onClick={e => e.stopPropagation()}>
                        <button
                            className="ctm-field-btn"
                            onClick={() => { closeAllDropdowns(); setShowStatus(!showStatus); }}
                            style={{ '--field-color': statusObj.color } as React.CSSProperties}
                        >
                            <span className="ctm-status-dot" style={{ backgroundColor: statusObj.color }} />
                            {status} <ChevronDown size={11} />
                        </button>
                        {showStatus && (
                            <div className="ctm-dropdown">
                                {STATUS_OPTIONS.map(s => (
                                    <button key={s.value}
                                        className={`ctm-dropdown-item ${status === s.value ? 'ctm-dropdown-item--active' : ''}`}
                                        onClick={() => { setStatus(s.value); setShowStatus(false); }}>
                                        <span className="ctm-status-dot" style={{ backgroundColor: s.color }} />
                                        {s.label}
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Assignee */}
                    <div className="ctm-dropdown-wrap" onClick={e => e.stopPropagation()}>
                        <button className="ctm-field-btn" onClick={() => { closeAllDropdowns(); setShowAssignee(!showAssignee); }}>
                            <User size={13} />
                            {assignees.length > 0 ? `${assignees.length} member${assignees.length > 1 ? 's' : ''}` : 'Assignee'}
                            <ChevronDown size={11} />
                        </button>
                        {showAssignee && (
                            <div className="ctm-dropdown ctm-dropdown--wide">
                                {MEMBER_OPTIONS.map(m => (
                                    <button key={m.id}
                                        className={`ctm-dropdown-item ${assignees.includes(m.id) ? 'ctm-dropdown-item--active' : ''}`}
                                        onClick={() => toggleAssignee(m.id)}>
                                        <span className="ctm-member-avatar" style={{ backgroundColor: m.color }}>{m.id}</span>
                                        {m.name}
                                        {assignees.includes(m.id) && <span className="ctm-check">✓</span>}
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Due Date */}
                    <div className="ctm-field-btn ctm-date-field">
                        <Calendar size={13} />
                        <input
                            type="date"
                            className="ctm-date-input"
                            value={dueDate}
                            onChange={e => setDueDate(e.target.value)}
                        />
                        {!dueDate && <span className="ctm-date-placeholder">Due date</span>}
                    </div>

                    {/* Priority */}
                    <div className="ctm-dropdown-wrap" onClick={e => e.stopPropagation()}>
                        <button className="ctm-field-btn" onClick={() => { closeAllDropdowns(); setShowPriority(!showPriority); }}
                            style={{ color: priorityObj.color }}>
                            <Flag size={13} fill={priority !== 'Normal' ? priorityObj.color : 'none'} />
                            {priority} <ChevronDown size={11} />
                        </button>
                        {showPriority && (
                            <div className="ctm-dropdown">
                                {PRIORITY_OPTIONS.map(p => (
                                    <button key={p.value}
                                        className={`ctm-dropdown-item ${priority === p.value ? 'ctm-dropdown-item--active' : ''}`}
                                        onClick={() => { setPriority(p.value); setShowPriority(false); }}>
                                        <Flag size={13} fill={p.value !== 'Normal' ? p.color : 'none'} color={p.color} />
                                        {p.value}
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>
                </div>

                {/* Footer */}
                <div className="ctm-footer">
                    <div className="ctm-footer-left">
                        <button className="ctm-attach-btn"><Paperclip size={14} /> Attach</button>
                    </div>
                    <div className="ctm-footer-right">
                        <button className="ctm-cancel-btn" onClick={onClose}>Cancel</button>
                        <button className="ctm-create-btn" onClick={handleCreate} disabled={!title.trim()}>
                            Create Task
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
