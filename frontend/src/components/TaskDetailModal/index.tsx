import { useState, useEffect, useMemo } from 'react';
import { Paperclip, MessageSquare, Activity, Save, Clock, User, Tag, Flag, Calendar } from 'lucide-react';
import { Button, Input, Avatar, Spin } from 'antd';
import { useDispatch, useSelector } from 'react-redux';
import type { AppDispatch, RootState } from '@/store/configureStore';
import type { Task } from '@/types/tasks';
import type { ActivityAction } from '@/types/activityLogs';
import TaskDetailHeader from './TaskDetailHeader';
import TaskDetailSidebar from './TaskDetailSidebar';
import { fetchCommentsByTask, fetchCreateComment } from '@/store/modules/comments';
import { fetchActivitiesByTask, clearActivities } from '@/store/modules/activityLogs';
import ShareTaskModal from '../ShareTaskModal';

export interface TaskDetailModalProps {
    isOpen: boolean;
    onClose: () => void;
    task: Task | null;
    updateTask: (taskId: number, updates: Partial<Task>) => void;
}

// ── Helpers ───────────────────────────────────────────────────────────────────

const ACTION_META: Record<ActivityAction, { label: string; icon: React.ReactNode; color: string }> = {
    created:             { label: 'đã tạo task',             icon: <Clock size={13} />,    color: '#7c68ee' },
    updated:             { label: 'đã cập nhật task',        icon: <Clock size={13} />,    color: '#52a7f9' },
    deleted:             { label: 'đã xóa task',             icon: <Clock size={13} />,    color: '#ef4444' },
    status_changed:      { label: 'đã thay đổi trạng thái', icon: <Clock size={13} />,    color: '#f59e0b' },
    priority_changed:    { label: 'đã thay đổi độ ưu tiên', icon: <Flag size={13} />,     color: '#f97316' },
    assigned:            { label: 'đã giao cho',             icon: <User size={13} />,     color: '#10b981' },
    unassigned:          { label: 'đã bỏ giao',              icon: <User size={13} />,     color: '#6b7280' },
    commented:           { label: 'đã bình luận',            icon: <MessageSquare size={13} />, color: '#7c68ee' },
    attachment_added:    { label: 'đã thêm tệp đính kèm',   icon: <Paperclip size={13} />, color: '#52a7f9' },
    attachment_removed:  { label: 'đã xóa tệp đính kèm',    icon: <Paperclip size={13} />, color: '#ef4444' },
    due_date_changed:    { label: 'đã thay đổi hạn chót',   icon: <Calendar size={13} />, color: '#f59e0b' },
    start_date_changed:  { label: 'đã thay đổi ngày bắt đầu', icon: <Calendar size={13} />, color: '#f59e0b' },
    moved:               { label: 'đã di chuyển task',       icon: <Clock size={13} />,    color: '#8b5cf6' },
    archived:            { label: 'đã lưu trữ task',         icon: <Clock size={13} />,    color: '#6b7280' },
    restored:            { label: 'đã khôi phục task',       icon: <Clock size={13} />,    color: '#10b981' },
    timer_started:       { label: 'đã bắt đầu tính giờ',    icon: <Clock size={13} />,    color: '#10b981' },
    timer_stopped:       { label: 'đã dừng tính giờ',        icon: <Clock size={13} />,    color: '#6b7280' },
    sprint_assigned:     { label: 'đã gắn vào sprint',       icon: <Tag size={13} />,      color: '#7c68ee' },
    milestone_assigned:  { label: 'đã gắn milestone',        icon: <Tag size={13} />,      color: '#f97316' },
    tag_added:           { label: 'đã thêm nhãn',            icon: <Tag size={13} />,      color: '#10b981' },
    tag_removed:         { label: 'đã xóa nhãn',             icon: <Tag size={13} />,      color: '#ef4444' },
    subtask_added:       { label: 'đã thêm công việc con',   icon: <Clock size={13} />,    color: '#52a7f9' },
    story_points_changed:{ label: 'đã thay đổi story points',icon: <Flag size={13} />,     color: '#8b5cf6' },
};

function formatRelativeTime(dateStr: string): string {
    const diff = Date.now() - new Date(dateStr).getTime();
    const mins = Math.floor(diff / 60000);
    if (mins < 1) return 'vừa xong';
    if (mins < 60) return `${mins} phút trước`;
    const hours = Math.floor(mins / 60);
    if (hours < 24) return `${hours} giờ trước`;
    const days = Math.floor(hours / 24);
    if (days < 30) return `${days} ngày trước`;
    return new Date(dateStr).toLocaleDateString('vi-VN');
}

function parseJsonValue(raw: unknown): string {
    if (raw == null || raw === '') return '';

    // PostgreSQL JSONB: axios đã parse sẵn thành object
    if (typeof raw === 'object') {
        const obj = raw as Record<string, unknown>;
        const named = obj.name ?? obj.title ?? obj.label ?? obj.value;
        if (named != null) return String(named);
        // Fallback: lấy giá trị đầu tiên có trong object (vd: { status_id: 5 } → '5')
        const firstVal = Object.values(obj)[0];
        return firstVal != null ? String(firstVal) : JSON.stringify(raw);
    }

    // TEXT column: vẫn là string JSON
    if (typeof raw === 'string') {
        try {
            const parsed = JSON.parse(raw);
            if (typeof parsed === 'object' && parsed !== null) {
                const obj = parsed as Record<string, unknown>;
                const named = obj.name ?? obj.title ?? obj.label ?? obj.value;
                if (named != null) return String(named);
                const firstVal = Object.values(obj)[0];
                return firstVal != null ? String(firstVal) : JSON.stringify(parsed);
            }
            return String(parsed);
        } catch {
            return raw;
        }
    }

    return String(raw);
}

// ── Component ─────────────────────────────────────────────────────────────────

export default function TaskDetailModal({ isOpen, onClose, task, updateTask }: TaskDetailModalProps) {
    const dispatch = useDispatch<AppDispatch>();
    const [isMaximized, setIsMaximized] = useState(false);
    const [activeTab, setActiveTab] = useState<'comments' | 'activity'>('comments');
    const [taskTitle, setTaskTitle] = useState('');
    const [taskDesc, setTaskDesc] = useState('');
    const [commentContent, setCommentContent] = useState('');
    const [isShareModalOpen, setIsShareModalOpen] = useState(false);

    const groups = useSelector((state: RootState) => state.tasks.listTask);
    const listComments = useSelector((state: RootState) => state.comments.listComments);

    // Activity selectors
    const listActivities = useSelector((state: RootState) => state.activityLogs.listActivities);
    const isLoadingActivities = useSelector((state: RootState) => state.activityLogs.isLoadingActivities);

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

    // Fetch comments when task opens
    useEffect(() => {
        if (task?.task_id) {
            dispatch(fetchCommentsByTask(task.task_id));
        }
    }, [task?.task_id, dispatch]);

    // Fetch activities when switching to activity tab or when task changes
    useEffect(() => {
        if (task?.task_id && activeTab === 'activity') {
            dispatch(fetchActivitiesByTask(task.task_id));
        }
    }, [task?.task_id, activeTab, dispatch]);

    // Clear activities when modal closes
    useEffect(() => {
        if (!isOpen) {
            dispatch(clearActivities());
        }
    }, [isOpen, dispatch]);

    if (!isOpen || !task) return null;

    const handleUpdate = () => {
        if (!isChanged) return;
        updateTask(task.task_id, {
            name: taskTitle,
            description: taskDesc,
        });
    };

    const handleCommentSubmit = async () => {
        if (!commentContent.trim() || !task?.task_id) return;
        await dispatch(fetchCreateComment({
            taskId: task.task_id,
            content: commentContent
        }));
        setCommentContent('');
    };

    return (
        <div className="fixed inset-0 z-1500 flex items-center justify-center bg-[rgba(20,27,43,0.5)]" onClick={onClose}>
            <div
                className={`${isMaximized
                    ? 'h-screen max-h-screen w-screen max-w-screen rounded-none'
                    : 'max-h-[88vh] w-220 max-w-[95vw] rounded-[14px]'
                    } flex flex-col overflow-hidden bg-[var(--color-surface-container-lowest)] shadow-2xl transition-all duration-300`}
                onClick={(e) => e.stopPropagation()}
            >
                <TaskDetailHeader
                    task={task}
                    updateTask={updateTask}
                    statusOptions={statusOptions}
                    isMaximized={isMaximized}
                    onToggleMaximize={() => setIsMaximized(!isMaximized)}
                    onOpenShare={() => setIsShareModalOpen(true)}
                    onClose={onClose}
                />

                <div className="flex flex-1 overflow-hidden">
                    <div className="flex flex-1 flex-col gap-4 overflow-y-auto px-6 py-5">
                        {isChanged && (
                            <div className="flex items-center justify-between rounded-lg bg-[var(--color-primary-bg)] p-3 border border-[#d6e4ff]">
                                <span className="text-[13px] font-medium text-[var(--color-primary)]">Bạn có thay đổi chưa lưu</span>
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
                                <p>Drag &amp; drop files or click to upload</p>
                            </div>
                        </div>


                        <div className="mt-2">
                            {/* Tab bar */}
                            <div className="mb-3 flex gap-0 border-b border-[#e5e7eb]">
                                <button
                                    onClick={() => setActiveTab('comments')}
                                    className={`flex items-center gap-1.5 px-3 pb-2.5 text-[13px] font-medium transition-colors ${activeTab === 'comments'
                                        ? 'border-b-2 border-[#7c68ee] text-[#7c68ee]'
                                        : 'text-[#6b7280] hover:text-[#292d34]'
                                        }`}
                                >
                                    <MessageSquare size={14} /> Comments
                                </button>
                                <button
                                    onClick={() => setActiveTab('activity')}
                                    className={`flex items-center gap-1.5 px-3 pb-2.5 text-[13px] font-medium transition-colors ${activeTab === 'activity'
                                        ? 'border-b-2 border-[#7c68ee] text-[#7c68ee]'
                                        : 'text-[#6b7280] hover:text-[#292d34]'
                                        }`}
                                >
                                    <Activity size={14} /> Activity
                                </button>
                            </div>

                            <div className="min-h-15">
                                {/* ── Comments Tab ── */}
                                {activeTab === 'comments' ? (
                                    <div className="flex flex-col gap-3">
                                        {listComments && listComments.length > 0 ? (
                                            listComments.map((comment) => (
                                                <div key={comment.comment_id} className="flex gap-2.5">
                                                    <Avatar src={comment.author_avatar} />
                                                    <div className="flex-1">
                                                        <div className="mb-1 flex items-center gap-2">
                                                            <strong className="text-[13px] text-[#292d34]">{comment.author_name}</strong>
                                                            <span className="text-xs text-[#9ca3af]">{comment.created_at}</span>
                                                        </div>
                                                        <p className="m-0 text-[13px] leading-6 text-[#374151]">{comment.content}</p>
                                                    </div>
                                                </div>
                                            ))
                                        ) : (
                                            <p className="text-gray-400 text-sm">Chưa có bình luận nào.</p>
                                        )}
                                    </div>
                                ) : (
                                    /* ── Activity Tab ── */
                                    <div className="flex flex-col gap-0">
                                        {isLoadingActivities ? (
                                            <div className="flex items-center justify-center py-8">
                                                <Spin size="small" />
                                            </div>
                                        ) : listActivities.length === 0 ? (
                                            <p className="text-gray-400 text-sm py-4 text-center">Chưa có hoạt động nào.</p>
                                        ) : (
                                            listActivities.map((activity) => {
                                                const meta = ACTION_META[activity.action] ?? {
                                                    label: activity.action,
                                                    icon: <Clock size={13} />,
                                                    color: '#6b7280',
                                                };
                                                const oldVal = parseJsonValue(activity.old_value);
                                                const newVal = parseJsonValue(activity.new_value);
                                                const displayName = activity.user_name ?? activity.username ?? 'Hệ thống';

                                                return (
                                                    <div
                                                        key={activity.activity_id}
                                                        className="relative flex items-start gap-3 py-3 pl-1 group"
                                                    >
                                                        {/* Timeline dot + line */}
                                                        <div className="flex flex-col items-center">
                                                            <div
                                                                className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-white"
                                                                style={{ backgroundColor: meta.color }}
                                                            >
                                                                {meta.icon}
                                                            </div>
                                                            <div className="mt-1 w-px flex-1 bg-[#e5e7eb] group-last:hidden" style={{ minHeight: 16 }} />
                                                        </div>

                                                        {/* Content */}
                                                        <div className="flex-1 pt-0.5">
                                                            <p className="m-0 text-[13px] leading-[1.5] text-[#374151]">
                                                                <span className="font-semibold text-[#292d34]">{displayName}</span>
                                                                {' '}
                                                                <span>{meta.label}</span>
                                                                {oldVal && newVal && (
                                                                    <>
                                                                        {' '}từ{' '}
                                                                        <em className="not-italic font-semibold" style={{ color: '#6b7280' }}>
                                                                            {oldVal}
                                                                        </em>
                                                                        {' '}sang{' '}
                                                                        <em className="not-italic font-semibold" style={{ color: meta.color }}>
                                                                            {newVal}
                                                                        </em>
                                                                    </>
                                                                )}
                                                                {!oldVal && newVal && (
                                                                    <>
                                                                        {': '}
                                                                        <em className="not-italic font-semibold" style={{ color: meta.color }}>
                                                                            {newVal}
                                                                        </em>
                                                                    </>
                                                                )}
                                                            </p>
                                                            <span className="text-[11px] text-[#9ca3af]">
                                                                {formatRelativeTime(activity.created_at)}
                                                            </span>
                                                        </div>
                                                    </div>
                                                );
                                            })
                                        )}
                                    </div>
                                )}
                            </div>

                            {/* Comment input — only shown on comments tab */}
                            {activeTab === 'comments' && (
                                <div className="mt-3.5 flex gap-2.5 border-t border-[#e5e7eb] pt-3.5">
                                    <Avatar src="https://i.pravatar.cc/150?u=fake@pravatar.com" />
                                    <div className="flex flex-1 flex-col gap-1.5">
                                        <Input.TextArea
                                            placeholder="Write a comment..."
                                            autoSize={{ minRows: 2, maxRows: 6 }}
                                            className="text-[13px] focus:border-[#7c68ee] hover:border-[#a798ff]"
                                            value={commentContent}
                                            onChange={(e) => setCommentContent(e.target.value)}
                                        />
                                        <div className="flex justify-end">
                                            <Button type="primary" size="small" className="bg-[#7c68ee] hover:bg-[#6b56db] border-none text-[12px]"
                                                onClick={handleCommentSubmit}
                                            >Comment</Button>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    <TaskDetailSidebar
                        task={task}
                        updateTask={updateTask}
                    />
                </div>
            </div>

            {isShareModalOpen && (
                <ShareTaskModal
                    taskId={task.task_id}
                    taskName={taskTitle || task.name || ''}
                    isOpen={isShareModalOpen}
                    onClose={() => setIsShareModalOpen(false)}
                />
            )}
        </div>
    );
}