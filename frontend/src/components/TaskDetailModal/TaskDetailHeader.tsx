import { X, ChevronRight, Minimize2, Maximize2, MoreHorizontal } from 'lucide-react';
import { Tooltip } from 'antd';
import StatusPicker from '../Pickers/StatusPicker'; // Chỉnh lại đường dẫn nếu cần
import type { Task } from '@/types/tasks';

// ĐỊNH NGHĨA LẠI PROPS CHO CHUẨN XÁC
interface TaskDetailHeaderProps {
    task: Task;
    updateTask: (taskId: number, updates: Partial<Task>) => void;
    statusOptions: { id: number; name: string; color: string }[];
    isMaximized: boolean;
    onToggleMaximize: () => void;
    onOpenShare: () => void;
    onClose: () => void;
}

export default function TaskDetailHeader({
    task,
    updateTask,
    statusOptions,
    isMaximized,
    onToggleMaximize,
    onOpenShare,
    onClose,
}: TaskDetailHeaderProps) {
    return (
        <div className="shrink-0 border-b border-[#e5e7eb] px-4.5 py-3">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                    <div className="flex items-center gap-1 text-xs text-[#9ca3af]">
                        <span>Main Space</span>
                        <ChevronRight size={12} />
                        <span>Task Management</span>
                    </div>

                    <StatusPicker
                        variant="badge"
                        value={task.status_id ?? 0}
                        options={statusOptions}
                        onChange={(newId) => {
                            updateTask(task.task_id, { status_id: newId });
                        }}
                    />
                </div>
                <div className="flex items-center gap-1">
                    <Tooltip title={isMaximized ? 'Minimize' : 'Maximize'}>
                        <button
                            className="flex cursor-pointer items-center rounded-md border-none bg-transparent p-1 text-[#9ca3af] hover:bg-[#f3f4f6] hover:text-[#374151]"
                            onClick={onToggleMaximize}
                        >
                            {isMaximized ? <Minimize2 size={16} /> : <Maximize2 size={16} />}
                        </button>
                    </Tooltip>
                    <Tooltip title="Share">
                        <button 
                            className="flex cursor-pointer items-center rounded-md border-none bg-transparent p-1 text-[#9ca3af] hover:bg-[#f3f4f6] hover:text-[#374151]"
                            onClick={onOpenShare}
                        >
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="18" cy="5" r="3"></circle><circle cx="6" cy="12" r="3"></circle><circle cx="18" cy="19" r="3"></circle><line x1="8.59" y1="13.51" x2="15.42" y2="17.49"></line><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"></line></svg>
                        </button>
                    </Tooltip>
                    <Tooltip title="Options">
                        <button className="flex cursor-pointer items-center rounded-md border-none bg-transparent p-1 text-[#9ca3af] hover:bg-[#f3f4f6] hover:text-[#374151]">
                            <MoreHorizontal size={16} />
                        </button>
                    </Tooltip>
                    <button
                        className="flex cursor-pointer items-center rounded-md border-none bg-transparent p-1 text-[#9ca3af] hover:bg-[#fff5f5] hover:text-[#ef4444]"
                        onClick={onClose}
                    >
                        <X size={18} />
                    </button>
                </div>
            </div>
        </div>
    );
}