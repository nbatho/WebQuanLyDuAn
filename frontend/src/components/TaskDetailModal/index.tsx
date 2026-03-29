import { useState } from 'react';
import { 
    X, CheckCircle2, User, Calendar, Flag, Clock, 
    MoreHorizontal, Paperclip, Minimize2, Maximize2,
    MessageSquare, Activity, ChevronRight, Tag
} from 'lucide-react';
import { Button, Input, Avatar, Tooltip } from 'antd';
import './task-detail-modal.css';

interface TaskDetailModalProps {
    isOpen: boolean;
    onClose: () => void;
    task: any; // Using generic any for mockup purposes
}

export default function TaskDetailModal({ isOpen, onClose, task }: TaskDetailModalProps) {
    const [isMaximized, setIsMaximized] = useState(false);
    const [activeTab, setActiveTab] = useState<'comments' | 'activity'>('comments');

    if (!isOpen || !task) return null;

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
                            <span>Marketing Space</span>
                            <ChevronRight size={12} />
                            <span>Q1 Campaign</span>
                        </div>
                        <div className="tdm-status-badge" style={{ backgroundColor: task.statusColor || '#0984e3' }}>
                            {task.status || 'TO DO'}
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
                    
                    {/* LEFT COLUMN: Main Content */}
                    <div className="tdm-main-col">
                        <input 
                            className="tdm-task-title" 
                            defaultValue={task.title}
                            placeholder="Task name"
                        />
                        
                        <div className="tdm-section">
                            <h3 className="tdm-section-title">Description</h3>
                            <textarea 
                                className="tdm-desc-editor"
                                placeholder="Add a more detailed description..."
                                defaultValue={task.description || ''}
                            />
                        </div>

                        <div className="tdm-section">
                            <h3 className="tdm-section-title">Attachments</h3>
                            <div className="tdm-attachment-dropzone">
                                <Paperclip size={20} className="tdm-drop-icon" />
                                <p>Drag & drop files or click to upload</p>
                            </div>
                        </div>

                        {/* Activity / Comments 
                            In ClickUp, there's a seamless activity thread at the bottom.
                        */}
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
                                        {/* Mock Comment */}
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
                                            <p><strong>Sarah Chen</strong> changed status from <em>To Do</em> to <em>In Progress</em> <br/><span>4 hours ago</span></p>
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
                            <div className="tdm-meta-item">
                                <span className="tdm-meta-label">Assignee</span>
                                <div className="tdm-meta-value">
                                    <User size={14} className="tdm-meta-icon" /> Assign
                                </div>
                            </div>

                            <div className="tdm-meta-item">
                                <span className="tdm-meta-label">Due Date</span>
                                <div className="tdm-meta-value">
                                    <Calendar size={14} className="tdm-meta-icon" /> {task.dueDate || 'Set date'}
                                </div>
                            </div>

                            <div className="tdm-meta-item">
                                <span className="tdm-meta-label">Priority</span>
                                <div className="tdm-meta-value">
                                    <Flag size={14} className="tdm-meta-icon" /> {task.priority || 'Clear'}
                                </div>
                            </div>

                            <div className="tdm-meta-item">
                                <span className="tdm-meta-label">Time Tracked</span>
                                <div className="tdm-meta-value tdm-meta-value--timer">
                                    <Clock size={14} className="tdm-meta-icon" /> 00:00:00 <Button size="small" type="primary" className="tdm-timer-btn">Play</Button>
                                </div>
                            </div>
                            
                            <div className="tdm-meta-item">
                                <span className="tdm-meta-label">Tags</span>
                                <div className="tdm-meta-value">
                                    <Tag size={14} className="tdm-meta-icon" /> Add Tags
                                </div>
                            </div>
                        </div>

                        <div className="tdm-meta-section">
                            <h4>Subtasks</h4>
                            <Button block type="dashed" icon={<CheckCircle2 size={14}/>}>Add Subtask</Button>
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
