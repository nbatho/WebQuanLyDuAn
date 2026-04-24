import { useEffect } from 'react';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import TaskDetailModal from '../../components/TaskDetailModal';
import CreateTaskModal from '../../components/CreateTaskModal';
import ContextMenu from '../../components/ContextMenu';
import { useSpaceTree } from '../../layouts/AppLayout/SpaceTreeContext';
import { resolveSpaceBreadcrumbSegment } from '../../layouts/AppLayout/lib/resolveSpaceBreadcrumb';

import { useSpaceViewState } from '@/hooks/useSpaceViewState';
import { useSpaceTasks } from '@/hooks/useSpaceTasks';
import { useTaskFilters } from '../../hooks/useTaskFilters';

import SpaceHeader from './components/SpaceHeader';
import SpaceToolbar from './components/SpaceToolbar';
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
            { replace: true }
        );
    }, [spaceId, listParam, folderParam, spaces, setSearchParams]);

    useEffect(() => {
        if (spaceId && !spaces.some((s) => s.id === spaceId)) {
            navigate('/home', { replace: true });
        }
    }, [spaceId, spaces, navigate]);

    // Custom Hooks
    const viewState = useSpaceViewState(spaceId, listParam, folderParam);
    const { groups, setGroups, handleCreateTask, handleInlineCreate, handleContextAction } = useSpaceTasks(spaceId);
    const { filters, setFilters, filteredGroups, flatTasks } = useTaskFilters(groups);

    const onContextActionSelect = (action: string) => {
        if (!viewState.ctxMenu) return;
        const { task } = viewState.ctxMenu;
        if (action === 'rename') {
            viewState.setSelectedTask(task);
        } else {
            handleContextAction(action, task);
        }
        viewState.setCtxMenu(null);
    };

    /* ── Render ── */
    return (
        <div className="flex h-full flex-col overflow-hidden bg-white" style={{ fontFamily: "'Plus Jakarta Sans', 'Inter', sans-serif" }}>
            <SpaceHeader currentSpace={currentSpace} activeView={viewState.activeView} onViewChange={viewState.setActiveView} />

            {viewState.activeView !== 'overview' && (
                <SpaceToolbar
                    activeView={viewState.activeView}
                    groupBy={viewState.groupBy} setGroupBy={viewState.setGroupBy}
                    subtaskMode={viewState.subtaskMode} setSubtaskMode={viewState.setSubtaskMode}
                    showClosed={viewState.showClosed} setShowClosed={viewState.setShowClosed}
                    filters={filters} setFilters={setFilters}
                    columns={viewState.columns} setColumns={viewState.setColumns}
                    onCreateTask={() => viewState.setShowCreateTask(true)}
                />
            )}

            <main className="flex flex-1 flex-col overflow-hidden">
                {viewState.activeView === 'overview' && <OverviewView />}
                {viewState.activeView === 'list' && (
                    <ListView
                        groups={filteredGroups} setGroups={setGroups}
                        setSelectedTask={viewState.setSelectedTask} showClosed={viewState.showClosed}
                        columns={viewState.columns} onContextMenu={viewState.handleContextMenu}
                        onCreateTask={handleInlineCreate}
                        spaceTitle={currentSpace?.name ?? 'Space'}
                        breadcrumbContext={breadcrumbContext}
                    />
                )}
                {viewState.activeView === 'board' && (
                    <BoardView
                        groups={filteredGroups} setGroups={setGroups}
                        setSelectedTask={viewState.setSelectedTask} showClosed={viewState.showClosed}
                        onContextMenu={viewState.handleContextMenu}
                    />
                )}
            </main>

            <TaskDetailModal isOpen={!!viewState.selectedTask} onClose={() => viewState.setSelectedTask(null)} task={viewState.selectedTask} allTasks={flatTasks} />
            <CreateTaskModal
                isOpen={viewState.showCreateTask}
                onClose={() => viewState.setShowCreateTask(false)}
                onCreate={(data) => {
                    console.log('Creating task with data:', data);
                    handleCreateTask(data);
                    viewState.setShowCreateTask(false);
                }}
            />
            <ContextMenu
                x={viewState.ctxMenu?.x || 0} y={viewState.ctxMenu?.y || 0}
                isOpen={!!viewState.ctxMenu} onClose={() => viewState.setCtxMenu(null)}
                onAction={onContextActionSelect} taskTitle={viewState.ctxMenu?.task.name}
            />
        </div>
    );
}
