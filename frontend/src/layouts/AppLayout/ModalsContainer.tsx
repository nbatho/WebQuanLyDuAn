import { useSpaceTree } from './SpaceTreeContext';
import CreateSpaceModal from '../../components/CreateSpaceModal';
import CreateFolderModal from '../../components/CreateFolderModal';
import CreateListModal from '../../components/CreateListModal';
import InvitePeopleModal from '../../components/InvitePeopleModal';
import CreateWorkspaceDialog from './workspace/CreateWorkspaceDialog';

export default function ModalsContainer() {
    const tree = useSpaceTree();

    return (
        <>
            <CreateSpaceModal
                isOpen={tree.isCreateSpaceOpen}
                onClose={() => tree.setIsCreateSpaceOpen(false)}
                onCreate={tree.handleCreateSpace}
            />
            <CreateFolderModal
                isOpen={!!tree.createFolderTarget}
                onClose={() => tree.setCreateFolderTarget(null)}
                onCreate={tree.handleCreateFolder}
                spaceName={tree.createFolderTarget?.spaceName || ''}
            />
            <CreateListModal
                isOpen={!!tree.createListTarget}
                onClose={() => tree.setCreateListTarget(null)}
                onCreate={tree.handleCreateList}
                folderName={tree.createListTarget?.folderName || ''}
            />
            <CreateWorkspaceDialog
                open={tree.isWorkspaceDialogOpen}
                onOpenChange={tree.setIsWorkspaceDialogOpen}
            />
            <InvitePeopleModal
                open={tree.isInviteModalOpen}
                onOpenChange={tree.setIsInviteModalOpen}
            />
        </>
    );
}
