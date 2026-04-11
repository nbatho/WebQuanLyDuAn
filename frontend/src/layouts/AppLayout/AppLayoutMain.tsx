import { useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import AppSidebar from './sidebar/AppSidebar';
import { SpaceTreeProvider } from './SpaceTreeContext';
import { useSpaceTreeState } from './useSpaceTreeState';
import type { AppDispatch, RootState } from '../../store/configureStore';
import { fetchSpacesForWorkspace } from '@/store/modules/spaces';
import ModalsContainer from './ModalsContainer';
import { fetchWorkspaces } from '@/store/modules/workspaces';

export default function AppLayoutMain() {
    const dispatch = useDispatch<AppDispatch>();
    const tree = useSpaceTreeState();
    const currentWorkspaceId = useSelector((s: RootState) => s.workspaces.currentWorkspaceId);
    const access_token = useSelector((s: RootState) => s.auth.access_token);

    useEffect(() => {
        if (access_token) {
            void dispatch(fetchWorkspaces());
        }
    }, [access_token, dispatch]);

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
