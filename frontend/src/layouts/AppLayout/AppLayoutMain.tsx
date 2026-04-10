import { useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import AppSidebar from './AppSidebar';
import { SpaceTreeProvider } from './SpaceTreeContext';
import { useBootstrapWorkspaces } from './workspace/useBootstrapWorkspaces';
import { useSpaceTreeState } from './useSpaceTreeState';
import type { AppDispatch, RootState } from '../../store/configureStore';
import { fetchSpacesForWorkspace } from '@/store/modules/spaces';
import ModalsContainer from './ModalsContainer';

export default function AppLayoutMain() {
    useBootstrapWorkspaces();
    const dispatch = useDispatch<AppDispatch>();
    const tree = useSpaceTreeState();
    
    const currentWorkspaceId = useSelector((s: RootState) => s.workspaces.currentWorkspaceId);
    
    useEffect(() => {
        if (currentWorkspaceId != null) {
            dispatch(fetchSpacesForWorkspace(currentWorkspaceId));
        }
    }, [currentWorkspaceId, dispatch]);

    return (
        <SpaceTreeProvider value={tree}>
            <div className="flex h-screen overflow-hidden bg-[#f5f7ff] font-['Plus_Jakarta_Sans',sans-serif]">
                <AppSidebar />

                <main className="flex min-w-0 flex-1 flex-col overflow-y-auto bg-[#f5f7ff]">
                    <Outlet />
                </main>

                <ModalsContainer />
            </div>
        </SpaceTreeProvider>
    );
}
