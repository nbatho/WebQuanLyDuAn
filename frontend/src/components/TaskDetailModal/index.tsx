import { useState, useEffect } from 'react';
import { Paperclip, MessageSquare, Activity } from 'lucide-react';
import { Button, Input, Avatar } from 'antd';
import type { TaskDetailModalProps } from '@/types/modal';
import TaskDetailHeader from './TaskDetailHeader';
import TaskDetailSidebar from './TaskDetailSidebar';

export default function TaskDetailModal({
    isOpen,
    onClose,
    task,
    allTasks = [],
}: TaskDetailModalProps) {
    const [isMaximized, setIsMaximized] = useState(false);
    const [activeTab, setActiveTab] = useState<'comments' | 'activity'>('comments');
    const [taskTitle, setTaskTitle] = useState('');
    const [taskDesc, setTaskDesc] = useState('');
    const [taskStatus, setTaskStatus] = useState('TO DO');
    const [taskPriority, setTaskPriority] = useState('Normal');

    useEffect(() => {
        if (task) {
            setTaskTitle(task.name || '');
            setTaskDesc(task.description || '');
            setTaskStatus(task.status || 'TO DO');
            setTaskPriority(task.priority || 'Normal');
        }
    }, [task]);

    if (!isOpen || !task) return null;

    const tabClass = (tab: 'comments' | 'activity') =>
        `flex cursor-pointer items-center gap-1.25 border-x-0 border-t-0 border-b-2 bg-transparent px-1 py-2 text-[13px] font-semibold transition-all ${
            activeTab === tab
                ? 'border-b-[var(--color-primary)] text-[var(--color-primary)]'
                : 'border-b-transparent text-[var(--color-text-tertiary)] hover:text-[var(--color-text-secondary)]'
        }`;

    return (
        <div className="fixed inset-0 z-1500 flex items-center justify-center bg-[rgba(20,27,43,0.5)]" onClick={onClose}>
            <div
                className={`${
                    isMaximized
                        ? 'h-screen max-h-screen w-screen max-w-screen rounded-none'
                        : 'max-h-[88vh] w-220 max-w-[95vw] rounded-[14px]'
                } flex flex-col overflow-hidden bg-white shadow-[0_20px_60px_rgba(0,0,0,0.25)]`}
                onClick={(e) => e.stopPropagation()}
            >
                <TaskDetailHeader
                    taskStatus={taskStatus}
                    onStatusChange={(value) => setTaskStatus(value)}
                    isMaximized={isMaximized}
                    onToggleMaximize={() => setIsMaximized(!isMaximized)}
                    onClose={onClose}
                />

                <div className="flex flex-1 overflow-hidden">
                    {/* Main content */}
                    <div className="flex flex-1 flex-col gap-4 overflow-y-auto px-6 py-5">
                        <input
                            className="w-full border-x-0 border-t-0 border-b-2 border-b-transparent p-0 text-[22px] font-extrabold text-[var(--color-on-surface)] outline-none transition-colors placeholder:text-[#c2c9e0] focus:border-b-[var(--color-primary)]"
                            value={taskTitle}
                            onChange={(e) => setTaskTitle(e.target.value)}
                            placeholder="Task name"
                        />

                        <div className="mt-1">
                            <h3 className="mb-2 text-[13px] font-bold uppercase tracking-[0.04em] text-[var(--color-text-secondary)]">Description</h3>
                            <textarea
                                className="min-h-20 w-full resize-y rounded-lg border border-[var(--color-border-light)] p-3 text-[13px] leading-6 text-[var(--color-on-surface)] outline-none transition-colors placeholder:text-[#c2c9e0] focus:border-[var(--color-primary)]"
                                placeholder="Add a more detailed description..."
                                value={taskDesc}
                                onChange={(e) => setTaskDesc(e.target.value)}
                            />
                        </div>

                        <div className="mt-1">
                            <h3 className="mb-2 text-[13px] font-bold uppercase tracking-[0.04em] text-[var(--color-text-secondary)]">Attachments</h3>
                            <div className="flex cursor-pointer flex-col items-center gap-1.5 rounded-[10px] border-2 border-dashed border-[var(--color-border-light)] p-6 text-center text-[13px] text-[#c2c9e0] transition-all hover:border-[var(--color-primary)] hover:bg-[var(--color-primary-bg)] hover:text-[var(--color-text-secondary)]">
                                <Paperclip size={20} className="opacity-50" />
                                <p>Drag & drop files or click to upload</p>
                            </div>
                        </div>

                        {/* Comments / Activity tabs */}
                        <div className="mt-2">
                            <div className="mb-3 flex gap-3 border-b border-[var(--color-border-light)]">
                                <button className={tabClass('comments')} onClick={() => setActiveTab('comments')}>
                                    <MessageSquare size={14} /> Comments
                                </button>
                                <button className={tabClass('activity')} onClick={() => setActiveTab('activity')}>
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
                                                    <strong className="text-[13px] text-[var(--color-on-surface)]">Alex Rivera</strong>
                                                    <span className="text-xs text-[var(--color-text-tertiary)]">2 hours ago</span>
                                                </div>
                                                <p className="m-0 text-[13px] leading-6 text-[var(--color-text-secondary)]">I have started working on the initial drafts. Will upload soon.</p>
                                            </div>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="flex flex-col gap-3">
                                        <div className="flex items-start gap-2.5">
                                            <Avatar size={24} src="https://i.pravatar.cc/150?u=a04258a2462d826712d" />
                                            <p className="m-0 text-[13px] leading-[1.4] text-[var(--color-text-secondary)]">
                                                <strong>Sarah Chen</strong> changed status from <em className="font-semibold not-italic text-[var(--color-primary)]">To Do</em> to <em className="font-semibold not-italic text-[var(--color-primary)]">In Progress</em> <br />
                                                <span className="text-[11px] text-[var(--color-text-tertiary)]">4 hours ago</span>
                                            </p>
                                        </div>
                                    </div>
                                )}
                            </div>

                            <div className="mt-3.5 flex gap-2.5 border-t border-[var(--color-border-light)] pt-3.5">
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

                    {/* Sidebar */}
                    <TaskDetailSidebar
                        task={task}
                        allTasks={allTasks}
                        taskPriority={taskPriority}
                        onPriorityChange={setTaskPriority}
                    />
                </div>
            </div>
        </div>
    );
}
