import { useState, useEffect } from 'react';
import type { ViewType } from '@/pages/SpaceViewPage/components/SpaceHeader';
import type { Task } from '@/types/tasks';
export function useSpaceViewState(
    spaceId?: string,
    listParam?: string | null,
    folderParam?: string | null
) {
    const [activeView, setActiveView] = useState<ViewType>('overview');
    const [selectedTask, setSelectedTask] = useState<Task | null>(null);
    const [showCreateTask, setShowCreateTask] = useState(false);
    const [ctxMenu, setCtxMenu] = useState<{ x: number; y: number; task: Task } | null>(null);

    const [groupBy, setGroupBy] = useState('status');
    const [subtaskMode, setSubtaskMode] = useState('collapsed');
    const [showClosed, setShowClosed] = useState(true);
    const [columns, setColumns] = useState<Record<string, boolean>>({
        assignee: true,
        dueDate: true,
        priority: true,
        tags: false,
    });

    useEffect(() => {
        setSelectedTask(null);
        setCtxMenu(null);
        setShowCreateTask(false);
    }, [spaceId, listParam, folderParam]);

    useEffect(() => {
        setActiveView('overview');
    }, [spaceId]);

    const handleContextMenu = (e: React.MouseEvent, task: Task) => {
        e.preventDefault();
        e.stopPropagation();
        setCtxMenu({ x: e.clientX, y: e.clientY, task });
    };

    return {
        activeView,
        setActiveView,
        selectedTask,
        setSelectedTask,
        showCreateTask,
        setShowCreateTask,
        ctxMenu,
        setCtxMenu,
        groupBy,
        setGroupBy,
        subtaskMode,
        setSubtaskMode,
        showClosed,
        setShowClosed,
        columns,
        setColumns,
        handleContextMenu,
    };
}
