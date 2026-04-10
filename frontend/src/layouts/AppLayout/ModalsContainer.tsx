import { useSpaceTree } from './SpaceTreeContext';
import CreateSpaceModal from '../../components/CreateSpaceModal';
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
