import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import CreateSpaceModal from '../../components/CreateSpaceModal';
import CreateFolderModal from '../../components/CreateFolderModal';
import CreateListModal from '../../components/CreateListModal';
import InvitePeopleModal from '../../components/InvitePeopleModal';
import AppSidebar from './AppSidebar';
import { SpaceTreeProvider } from './SpaceTreeContext';
import CreateWorkspaceDialog from './workspace/CreateWorkspaceDialog';
import { useBootstrapWorkspaces } from './workspace/useBootstrapWorkspaces';
import { useSpaceTreeState } from './useSpaceTreeState';
import { clearWorkspacesError } from '../../store/modules/workspaces';
import type { AppDispatch } from '../../store/configureStore';

export default function AppLayoutMain() {
    useBootstrapWorkspaces();
    const dispatch = useDispatch<AppDispatch>();
    const tree = useSpaceTreeState();
    const [workspaceDialogOpen, setWorkspaceDialogOpen] = useState(false);
    const [inviteModalOpen, setInviteModalOpen] = useState(false);

    const openWorkspaceDialog = () => {
        dispatch(clearWorkspacesError());
        setWorkspaceDialogOpen(true);
    };

    return (
        <SpaceTreeProvider value={tree}>
        <div className="flex h-screen overflow-hidden bg-[#f5f7ff] font-['Plus_Jakarta_Sans',sans-serif]">
            <AppSidebar
                spaces={tree.spaces}
                setIsCreateSpaceOpen={tree.setIsCreateSpaceOpen}
                setCreateFolderTarget={tree.setCreateFolderTarget}
                setCreateListTarget={tree.setCreateListTarget}
                actionMenu={tree.actionMenu}
                setActionMenu={tree.setActionMenu}
                menuRef={tree.menuRef}
                toggleSpace={tree.toggleSpace}
                toggleFolder={tree.toggleFolder}
                handleSpaceAction={tree.handleSpaceAction}
                onDeleteSpace={tree.handleDeleteSpace}
                onDeleteFolder={tree.handleDeleteFolder}
                onDeleteList={tree.handleDeleteList}
                onOpenInvitePeople={() => setInviteModalOpen(true)}
                onOpenCreateWorkspace={openWorkspaceDialog}
            />

            <main className="flex min-w-0 flex-1 flex-col overflow-y-auto bg-[#f5f7ff]">
                <Outlet />
            </main>

            <CreateSpaceModal
                isOpen={tree.isCreateSpaceOpen}
                onClose={() => tree.setIsCreateSpaceOpen(false)}
                onCreate={tree.handleCreateSpace}
            />
            <CreateFolderModal
                isOpen={!!tree.createFolderTarget}
                onClose={() => tree.setCreateFolderTarget(null)}
                onCreate={tree.handleCreateFolder}
                spaceName={tree.targetSpace?.name || ''}
            />
            <CreateListModal
                isOpen={!!tree.createListTarget}
                onClose={() => tree.setCreateListTarget(null)}
                onCreate={tree.handleCreateList}
                folderName={tree.targetListFolder || ''}
            />
            <CreateWorkspaceDialog
                open={workspaceDialogOpen}
                onOpenChange={setWorkspaceDialogOpen}
            />
            <InvitePeopleModal
                open={inviteModalOpen}
                onOpenChange={setInviteModalOpen}
            />
        </div>
        </SpaceTreeProvider>
    );
}
