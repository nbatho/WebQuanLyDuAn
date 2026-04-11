import { X, ChevronRight, Minimize2, Maximize2, MoreHorizontal } from 'lucide-react';
import { Tooltip } from 'antd';
import { StatusPicker } from '../Pickers';


interface TaskDetailHeaderProps {
    taskStatus: string;
    onStatusChange: (value: string, color: string) => void;
    isMaximized: boolean;
    onToggleMaximize: () => void;
    onClose: () => void;
}

export default function TaskDetailHeader({
    taskStatus,
    onStatusChange,
    isMaximized,
    onToggleMaximize,
    onClose,
}: TaskDetailHeaderProps) {
    return (
        <div className="shrink-0 border-b border-[var(--color-border-light)] px-4.5 py-3">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                    <div className="flex items-center gap-1 text-xs text-[var(--color-text-tertiary)]">
                        <span>Main Space</span>
                        <ChevronRight size={12} />
                        <span>Task Management</span>
                    </div>
                    <StatusPicker value={taskStatus} onChange={onStatusChange} variant="badge" />
                </div>
                <div className="flex items-center gap-1">
                    <Tooltip title={isMaximized ? 'Minimize' : 'Maximize'}>
                        <button
                            className="flex cursor-pointer items-center rounded-md border-none bg-transparent p-1 text-[var(--color-text-tertiary)] hover:bg-[var(--color-surface-hover)] hover:text-[var(--color-text-secondary)]"
                            onClick={onToggleMaximize}
                        >
                            {isMaximized ? <Minimize2 size={16} /> : <Maximize2 size={16} />}
                        </button>
                    </Tooltip>
                    <Tooltip title="Options">
                        <button className="flex cursor-pointer items-center rounded-md border-none bg-transparent p-1 text-[var(--color-text-tertiary)] hover:bg-[var(--color-surface-hover)] hover:text-[var(--color-text-secondary)]">
                            <MoreHorizontal size={16} />
                        </button>
                    </Tooltip>
                    <button
                        className="flex cursor-pointer items-center rounded-md border-none bg-transparent p-1 text-[var(--color-text-tertiary)] hover:bg-[#fff5f5] hover:text-[var(--color-error)]"
                        onClick={onClose}
                    >
                        <X size={18} />
                    </button>
                </div>
            </div>
        </div>
    );
}
