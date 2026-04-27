import { useState, useEffect, useMemo } from 'react';
import { Paperclip, MessageSquare, Activity, Save } from 'lucide-react';
import { Button, Input, Avatar } from 'antd';
import { useSelector } from 'react-redux';
import type { RootState } from '@/store/configureStore';
import type { Task } from '@/types/tasks';
import TaskDetailHeader from './TaskDetailHeader';
import TaskDetailSidebar from './TaskDetailSidebar';

export interface TaskDetailModalProps {
    isOpen: boolean;
    onClose: () => void;
    task: Task | null;
    updateTask: (taskId: number, updates: Partial<Task>) => void;
}

export default function TaskDetailModal({ isOpen, onClose, task, updateTask }: TaskDetailModalProps) {
    const [isMaximized, setIsMaximized] = useState(false);
    const [activeTab, setActiveTab] = useState<'comments' | 'activity'>('comments');

    const [taskTitle, setTaskTitle] = useState('');
    const [taskDesc, setTaskDesc] = useState('');

    // LẤY DANH SÁCH STATUS ĐỘNG TỪ REDUX
    const groups = useSelector((state: RootState) => state.tasks.listTask);
    const statusOptions = useMemo(() => {
        return groups.map(g => ({ id: g.id, name: g.name, color: g.color }));
    }, [groups]);

    useEffect(() => {
        if (task) {
            setTaskTitle(task.name || '');
            setTaskDesc(task.description || '');
        }
    }, [task]);

    const isChanged = useMemo(() => {
        if (!task) return false;
        return taskTitle !== task.name || taskDesc !== (task.description || '');
    }, [taskTitle, taskDesc, task]);

    if (!isOpen || !task) return null;

    const handleUpdate = () => {
        if (!isChanged) return;
        updateTask(task.task_id, {
            name: taskTitle,
            description: taskDesc,
        });
    };

    const tabClass = (tab: 'comments' | 'activity') =>
        `flex cursor-pointer items-center gap-1.5 pb-2 text-[13px] font-semibold transition-all ${activeTab === tab
            ? 'border-b-2 border-[#7c68ee] text-[#7c68ee]'
            : 'border-b-2 border-transparent text-[#9ca3af] hover:text-[#374151]'
        }`;

    return (
        <div className="fixed inset-0 z-1500 flex items-center justify-center bg-[rgba(20,27,43,0.5)]" onClick={onClose}>
            <div
                className={`${isMaximized
                    ? 'h-screen max-h-screen w-screen max-w-screen rounded-none'
                    : 'max-h-[88vh] w-220 max-w-[95vw] rounded-[14px]'
                    } flex flex-col overflow-hidden bg-white shadow-2xl transition-all duration-300`}
                onClick={(e) => e.stopPropagation()}
            >
                {/* TRUYỀN PROPS CHUẨN XÁC CHO HEADER */}
                <TaskDetailHeader
                    task={task}
                    updateTask={updateTask}
                    statusOptions={statusOptions}
                    isMaximized={isMaximized}
                    onToggleMaximize={() => setIsMaximized(!isMaximized)}
                    onClose={onClose}
                />

                <div className="flex flex-1 overflow-hidden">
                    <div className="flex flex-1 flex-col gap-4 overflow-y-auto px-6 py-5">
                        {isChanged && (
                            <div className="flex items-center justify-between rounded-lg bg-[#f0f4ff] p-3 border border-[#d6e4ff]">
                                <span className="text-[13px] font-medium text-[#0058be]">Bạn có thay đổi chưa lưu</span>
                                <Button type="primary" size="small" icon={<Save size={14} />} onClick={handleUpdate} className="bg-[#7c68ee] hover:bg-[#6b56db] border-none">
                                    Update
                                </Button>
                            </div>
                        )}

                        <input
                            className="w-full border-b-2 border-transparent p-0 text-[22px] font-extrabold text-[#292d34] outline-none transition-colors placeholder:text-[#c2c9e0] focus:border-[#7c68ee]"
                            value={taskTitle}
                            onChange={(e) => setTaskTitle(e.target.value)}
                            placeholder="Task name"
                        />

                        <div className="mt-1">
                            <h3 className="mb-2 text-[13px] font-bold uppercase tracking-[0.04em] text-[#6b7280]">Description</h3>
                            <textarea
                                className="min-h-25 w-full resize-y rounded-lg border border-[#e5e7eb] p-3 text-[13px] leading-6 text-[#292d34] outline-none transition-colors placeholder:text-[#c2c9e0] focus:border-[#7c68ee]"
                                placeholder="Add a more detailed description..."
                                value={taskDesc}
                                onChange={(e) => setTaskDesc(e.target.value)}
                            />
                        </div>

                        {/* Attachments */}
                        <div className="mt-1">
                            <h3 className="mb-2 text-[13px] font-bold uppercase tracking-[0.04em] text-[#6b7280]">Attachments</h3>
                            <div className="flex cursor-pointer flex-col items-center gap-1.5 rounded-[10px] border-2 border-dashed border-[#e5e7eb] p-6 text-center text-[13px] text-[#9ca3af] transition-all hover:border-[#7c68ee] hover:bg-[#f0f0ff] hover:text-[#6b7280]">
                                <Paperclip size={20} className="opacity-50" />
                                <p>Drag & drop files or click to upload</p>
                            </div>
                        </div>

                        {/* Comments / Activity tabs */}
                        <div className="mt-2">
                            <div className="mb-3 flex gap-4 border-b border-[#e5e7eb]">
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
                                                <div className="mb-1 flex items-center gap-2">
                                                    <strong className="text-[13px] text-[#292d34]">Alex Rivera</strong>
                                                    <span className="text-xs text-[#9ca3af]">2 hours ago</span>
                                                </div>
                                                <p className="m-0 text-[13px] leading-6 text-[#374151]">I have started working on the initial drafts. Will upload soon.</p>
                                            </div>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="flex flex-col gap-3">
                                        <div className="flex items-start gap-2.5">
                                            <Avatar size={24} src="https://i.pravatar.cc/150?u=a04258a2462d826712d" />
                                            <p className="m-0 text-[13px] leading-[1.4] text-[#374151]">
                                                <strong>Sarah Chen</strong> changed status from <em className="font-semibold not-italic text-[#7c68ee]">To Do</em> to <em className="font-semibold not-italic text-[#7c68ee]">In Progress</em> <br />
                                                <span className="text-[11px] text-[#9ca3af]">4 hours ago</span>
                                            </p>
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Ô nhập Comment */}
                            <div className="mt-3.5 flex gap-2.5 border-t border-[#e5e7eb] pt-3.5">
                                <Avatar src="https://i.pravatar.cc/150?u=fake@pravatar.com" />
                                <div className="flex flex-1 flex-col gap-1.5">
                                    <Input.TextArea
                                        placeholder="Write a comment..."
                                        autoSize={{ minRows: 2, maxRows: 6 }}
                                        className="text-[13px] focus:border-[#7c68ee] hover:border-[#a798ff]"
                                    />
                                    <div className="flex justify-end">
                                        <Button type="primary" size="small" className="bg-[#7c68ee] hover:bg-[#6b56db] border-none text-[12px]">Comment</Button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <TaskDetailSidebar
                        task={task}
                        updateTask={updateTask}
                    />
                </div>
            </div>
        </div>
    );
}