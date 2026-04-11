import { useState, useEffect, useMemo, useCallback } from 'react';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import TaskDetailModal from '../../components/TaskDetailModal';
import CreateTaskModal from '../../components/CreateTaskModal';
import ContextMenu from '../../components/ContextMenu';
import type { StatusGroup, Task } from '../../types/tasks';
import { useSpaceTree } from '../../layouts/AppLayout/SpaceTreeContext';
import { resolveSpaceBreadcrumbSegment } from '../../layouts/AppLayout/lib/resolveSpaceBreadcrumb';
import { cloneInitialGroupsForSpace } from './lib/cloneInitialGroups';
import { familyTaskIds, visibleRootsWithFamily } from './lib/taskFamily';
import { nextTaskId } from './lib/nextTaskId';
import SpaceHeader from './components/SpaceHeader';
import SpaceToolbar from './components/SpaceToolbar';
import type { ViewType } from './components/SpaceHeader';
import OverviewView from './components/OverviewView/overviewView';
import ListView from './components/ListView/listView';
import BoardView from './components/BoardView/boardView';

export default function SpaceViewPage() {
    const { spaceId } = useParams<{ spaceId: string }>();
    const navigate = useNavigate();
    const [searchParams, setSearchParams] = useSearchParams();
    const { spaces } = useSpaceTree();

    const currentSpace = spaceId ? spaces.find((s) => s.id === spaceId) : undefined;
    const listParam = searchParams.get('list');
    const folderParam = searchParams.get('folder');

    const breadcrumbContext =
        spaceId != null && spaceId !== ''
            ? resolveSpaceBreadcrumbSegment(spaces, spaceId)
            : null;

    useEffect(() => {
        if (!spaceId || (!listParam && !folderParam)) return;
        const resolved = resolveSpaceBreadcrumbSegment(spaces, spaceId);
        if (resolved != null) return;
        setSearchParams(
            (prev) => {
                const next = new URLSearchParams(prev);
                next.delete('list');
                next.delete('folder');
                return next;
            },
            { replace: true },
        );
    }, [spaceId, listParam, folderParam, spaces, setSearchParams]);

    /* ── Task state (local — per space) ── */
    const [tasksBySpace, setTasksBySpace] = useState<Record<string, StatusGroup[]>>({});

    useEffect(() => {
        setTasksBySpace((prev) => {
            const next = { ...prev };
            let changed = false;
            for (const s of spaces) {
                if (!next[s.id]) {
                    next[s.id] = cloneInitialGroupsForSpace(s.id);
                    changed = true;
                }
            }
            for (const id of Object.keys(next)) {
                if (!spaces.some((s) => s.id === id)) {
                    delete next[id];
                    changed = true;
                }
            }
            return changed ? next : prev;
        });
    }, [spaces]);

    useEffect(() => {
        if (spaceId && !spaces.some((s) => s.id === spaceId)) {
            navigate('/home', { replace: true });
        }
    }, [spaceId, spaces, navigate]);

    const groups = spaceId ? tasksBySpace[spaceId] ?? [] : [];
    const setGroups = useCallback(
        (updater: React.SetStateAction<StatusGroup[]>) => {
            if (!spaceId) return;
            setTasksBySpace((prev) => {
                const current = prev[spaceId];
                if (!current) return prev;
                const next = typeof updater === 'function' ? (updater as (g: StatusGroup[]) => StatusGroup[])(current) : updater;
                return { ...prev, [spaceId]: next };
            });
        },
        [spaceId],
    );

    /* ── View & UI state ── */
    const [activeView, setActiveView] = useState<ViewType>('overview');
    const [selectedTask, setSelectedTask] = useState<Task | null>(null);
    const [showCreateTask, setShowCreateTask] = useState(false);
    const [ctxMenu, setCtxMenu] = useState<{ x: number; y: number; task: Task } | null>(null);

    /* Toolbar state */
    const [groupBy, setGroupBy] = useState('status');
    const [subtaskMode, setSubtaskMode] = useState('collapsed');
    const [showClosed, setShowClosed] = useState(true);
    const [filters, setFilters] = useState<{ status: string[]; priority: string[]; assignee: string[] }>({ status: [], priority: [], assignee: [] });
    const [columns, setColumns] = useState<Record<string, boolean>>({ assignee: true, dueDate: true, priority: true, tags: false });

    useEffect(() => {
        setSelectedTask(null);
        setCtxMenu(null);
        setShowCreateTask(false);
    }, [spaceId, listParam, folderParam]);

    useEffect(() => {
        setActiveView('overview');
    }, [spaceId]);

    /* ── Derived data ── */
    const filteredGroups = useMemo(
        () =>
            groups.map((g) => {
                const matches = (t: Task) => {
                    if (filters.status.length > 0 && !filters.status.includes(t.status)) return false;
                    if (filters.priority.length > 0 && !filters.priority.includes(t.priority)) return false;
                    if (filters.assignee.length > 0 && !t.assignees.some((a) => filters.assignee.includes(a))) return false;
                    return true;
                };
                const roots = visibleRootsWithFamily(g.tasks, matches);
                const keep = new Set(roots.flatMap((r) => familyTaskIds(g.tasks, r.task_id)));
                return { ...g, tasks: g.tasks.filter((t) => keep.has(t.task_id)) };
            }),
        [groups, filters],
    );
    const flatTasks = useMemo(() => groups.flatMap((g) => g.tasks), [groups]);

    /* ── Handlers ── */
    const handleCreateTask = (data: { name: string; status: string; statusColor: string; priority: string; priorityColor: string; due_date: string | null; assignees: string[]; description: string; listName: string }) => {
        const statusMap: Record<string, string> = { 'TO DO': 'todo', 'IN PROGRESS': 'inprogress', COMPLETE: 'done' };
        const groupId = statusMap[data.status] || 'todo';
        const spaceNumericId = groups.flatMap((g) => g.tasks)[0]?.space_id ?? 1;
        const newTask: Task = {
            task_id: nextTaskId(),
            space_id: spaceNumericId,
            parent_task_id: null,
            name: data.name,
            description: data.description || null,
            status: data.status,
            statusColor: data.statusColor,
            priority: data.priority,
            priorityColor: data.priorityColor,
            due_date: data.due_date
                ? new Date(data.due_date).toLocaleDateString('en-US', { month: '2-digit', day: '2-digit', year: '2-digit' })
                : null,
            assignees: data.assignees,
            comment_count: 0,
        };
        setGroups((prev) => prev.map((g) => (g.id === groupId ? { ...g, tasks: [...g.tasks, newTask] } : g)));
    };

    const handleContextAction = (action: string) => {
        if (!ctxMenu) return;
        const { task } = ctxMenu;
        switch (action) {
            case 'delete': {
                const isRoot = task.parent_task_id === null;
                setGroups((prev) =>
                    prev.map((g) => {
                        if (isRoot) {
                            const drop = new Set(familyTaskIds(g.tasks, task.task_id));
                            return { ...g, tasks: g.tasks.filter((t) => !drop.has(t.task_id)) };
                        }
                        return { ...g, tasks: g.tasks.filter((t) => t.task_id !== task.task_id) };
                    }),
                );
                break;
            }
            case 'duplicate':
                setGroups((prev) =>
                    prev.map((g) => {
                        const idx = g.tasks.findIndex((t) => t.task_id === task.task_id);
                        if (idx === -1) return g;
                        const clone: Task = { ...task, task_id: nextTaskId(), name: `${task.name} (copy)` };
                        const newTasks = [...g.tasks];
                        newTasks.splice(idx + 1, 0, clone);
                        return { ...g, tasks: newTasks };
                    }),
                );
                break;
            case 'copy-link':
                navigator.clipboard?.writeText(`task/${task.task_id}`);
                break;
            case 'rename':
                setSelectedTask(task);
                break;
            case 'archive':
                setGroups((prev) => prev.map((g) => ({ ...g, tasks: g.tasks.filter((t) => t.task_id !== task.task_id) })));
                break;
        }
    };

    const handleContextMenu = (e: React.MouseEvent, task: Task) => {
        e.preventDefault();
        e.stopPropagation();
        setCtxMenu({ x: e.clientX, y: e.clientY, task });
    };

    /* ── Render ── */
    return (
        <div className="flex h-full flex-col overflow-hidden bg-white" style={{ fontFamily: "'Plus Jakarta Sans', 'Inter', sans-serif" }}>
            <SpaceHeader currentSpace={currentSpace} activeView={activeView} onViewChange={setActiveView} />

            {activeView !== 'overview' && (
                <SpaceToolbar
                    activeView={activeView}
                    groupBy={groupBy} setGroupBy={setGroupBy}
                    subtaskMode={subtaskMode} setSubtaskMode={setSubtaskMode}
                    showClosed={showClosed} setShowClosed={setShowClosed}
                    filters={filters} setFilters={setFilters}
                    columns={columns} setColumns={setColumns}
                    onCreateTask={() => setShowCreateTask(true)}
                />
            )}

            <main className="flex flex-1 flex-col overflow-hidden">
                {activeView === 'overview' && <OverviewView />}
                {activeView === 'list' && (
                    <ListView
                        groups={filteredGroups} setGroups={setGroups}
                        setSelectedTask={setSelectedTask} showClosed={showClosed}
                        columns={columns} onContextMenu={handleContextMenu}
                        spaceTitle={currentSpace?.name ?? 'Space'}
                        breadcrumbContext={breadcrumbContext}
                    />
                )}
                {activeView === 'board' && (
                    <BoardView
                        groups={filteredGroups} setGroups={setGroups}
                        setSelectedTask={setSelectedTask} showClosed={showClosed}
                        onContextMenu={handleContextMenu}
                    />
                )}
            </main>

            <TaskDetailModal isOpen={!!selectedTask} onClose={() => setSelectedTask(null)} task={selectedTask} allTasks={flatTasks} />
            <CreateTaskModal isOpen={showCreateTask} onClose={() => setShowCreateTask(false)} onCreate={handleCreateTask} />
            <ContextMenu
                x={ctxMenu?.x || 0} y={ctxMenu?.y || 0}
                isOpen={!!ctxMenu} onClose={() => setCtxMenu(null)}
                onAction={handleContextAction} taskTitle={ctxMenu?.task.name}
            />
        </div>
    );
}
