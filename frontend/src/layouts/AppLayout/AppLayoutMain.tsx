import { Outlet } from 'react-router-dom';
import AppSidebar from './sidebar/AppSidebar';
import { SpaceTreeProvider } from './SpaceTreeContext';
import { useSpaceTreeState } from './useSpaceTreeState';
import ModalsContainer from './ModalsContainer';


export default function AppLayoutMain() {
    const tree = useSpaceTreeState();

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
