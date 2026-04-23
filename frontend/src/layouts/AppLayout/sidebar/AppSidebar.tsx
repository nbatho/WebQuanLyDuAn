import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useLocation } from 'react-router-dom';
import { Home, MessageSquare, Clock, Plus, Settings, Users, LogOut, Sparkles, Grid3X3, ChevronDown, ChevronRight, RefreshCcw } from 'lucide-react';
import WorkspaceSwitcher from '../workspace/WorkspaceSwitcher';
import { fetchSignOut } from '@/store/modules/auth';
import type { AppDispatch, RootState } from '@/store/configureStore';
import { useSpaceTree } from '../SpaceTreeContext';
import { SpaceNode } from './components/nodes/SpaceNode';
import { fetchSpacesForWorkspace } from '@/store/modules/spaces';
import { fetchWorkspaces } from '@/store/modules/workspaces';

export default function AppSidebar() {
    const navigate = useNavigate();
    const location = useLocation();
    const dispatch = useDispatch<AppDispatch>();
    const tree = useSpaceTree();
    const [spacesCollapsed, setSpacesCollapsed] = useState(false);
    const [isRefreshing, setIsRefreshing] = useState(false);
    const currentWorkspaceId = useSelector((s: RootState) => s.workspaces.currentWorkspaceId);
    const access_token = useSelector((s: RootState) => s.auth.access_token);

    const handleRefreshSpaces = async () => {
        if (currentWorkspaceId != null) {
            setIsRefreshing(true);
            await dispatch(fetchSpacesForWorkspace(currentWorkspaceId));
            setTimeout(() => setIsRefreshing(false), 600);
        }
    };

    const handleLogout = () => {
        try {
            dispatch(fetchSignOut());
            navigate('/login');
        } catch (error) {
            console.error('Logout failed:', error);
        }
    };

    const navItem = (
        path: string,
        icon: React.ReactNode,
        label: string,
        badge?: React.ReactNode,
    ) => {
        const isActive = location.pathname === path;
        return (
            <div
                className={`flex cursor-pointer select-none items-center gap-2.5 rounded-md px-2.5 py-1.75 text-[13.5px] font-medium transition-all ${isActive
                    ? 'bg-[#e8f0fe] text-[#1a73e8] font-semibold'
                    : 'text-[#1e1f21] hover:bg-[#f3f4f8]'
                    }`}
                onClick={() => navigate(path)}
            >
                {icon}
                <span className="flex-1">{label}</span>
                {badge}
            </div>
        );
    };

    useEffect(() => {
        if (access_token) {
            dispatch(fetchWorkspaces());
        }
    }, [access_token, dispatch]);

    useEffect(() => {
        if (currentWorkspaceId != null) {
            dispatch(fetchSpacesForWorkspace(currentWorkspaceId));
        }
    }, [currentWorkspaceId, dispatch]);

    return (
        <aside className="flex w-65 shrink-0 flex-col overflow-y-auto border-r border-[#e2e4e9] bg-white px-2.5 py-3 max-[900px]:hidden">
            <div
                className="mb-2 flex cursor-pointer items-center gap-2.5 rounded-lg px-2 pb-3 pt-1 border-b border-[#e2e4e9]"
                onClick={() => navigate('/home')}
            >
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#1a73e8]">
                    <Grid3X3 size={18} color="#fff" />
                </div>
                <div className="min-w-0 flex-1">
                    <div className="text-[14px] font-bold text-[#1e1f21]">Flowise PM</div>
                    <WorkspaceSwitcher onOpenCreate={() => tree.setIsWorkspaceDialogOpen(true)} />
                </div>
            </div>

            <nav className="mb-1 flex flex-col gap-0.5">
                {navItem('/home', <Home size={18} strokeWidth={1.8} />, 'Home')}
                {navItem(
                    '/inbox',
                    <MessageSquare size={18} strokeWidth={1.8} />,
                    'Inbox',
                    <span className="ml-auto flex h-4.5 min-w-4.5 items-center justify-center rounded-full bg-[#1a73e8] px-1 text-[10px] font-bold leading-none text-white">
                        5
                    </span>,
                )}
                {navItem('/time-tracking', <Clock size={18} strokeWidth={1.8} />, 'Time Tracking')}

                <div
                    className={`flex cursor-pointer select-none items-center gap-2.5 rounded-md px-2.5 py-1.75 text-[13.5px] font-medium transition-all ${location.pathname === '/ai'
                        ? 'bg-linear-to-r from-[#7c5cfc] to-[#e84393] text-white shadow-sm'
                        : 'text-[#1e1f21] hover:bg-[#f3f4f8]'
                        }`}
                    onClick={() => navigate('/ai')}
                >
                    <Sparkles size={18} strokeWidth={1.8} />
                    <span>Flowise AI</span>
                </div>
            </nav>

            <div className="mb-1 mt-2 flex flex-1 flex-col overflow-y-auto">
                <div className="flex items-center justify-between px-2.5 py-1.5">
                    <button
                        type="button"
                        className="flex cursor-pointer items-center gap-1 border-none bg-transparent p-0 text-[11px] font-extrabold tracking-[0.06em] uppercase text-[#6b6f76] hover:text-[#1e1f21] transition-colors"
                        onClick={() => setSpacesCollapsed(!spacesCollapsed)}
                    >
                        {spacesCollapsed ? <ChevronRight size={12} /> : <ChevronDown size={12} />}
                        Spaces
                    </button>
                    <div className="flex items-center gap-2">
                        <RefreshCcw
                            size={14}
                            className={`cursor-pointer text-[#6b6f76] transition-all hover:text-[#1a73e8] ${isRefreshing ? 'animate-spin' : ''}`}
                            onClick={handleRefreshSpaces}
                            title="Refresh list"
                        />
                        <Plus
                            size={15}
                            className="cursor-pointer text-[#6b6f76] transition-colors hover:text-[#1a73e8]"
                            onClick={() => tree.setIsCreateSpaceOpen(true)}
                        />
                    </div>
                </div>

                {!spacesCollapsed && (
                    <div className="mt-0.5 flex flex-col gap-0.5">
                        {tree.spaces.map((space) => (
                            <SpaceNode key={space.id} space={space} />
                        ))}
                    </div>
                )}
            </div>

            <div className="mt-auto flex flex-col gap-0.5 border-t border-[#e2e4e9] pt-2">
                <div
                    className="flex cursor-pointer select-none items-center gap-2.5 rounded-md px-2.5 py-1.75 text-[13.5px] font-medium text-[#1e1f21] transition-all hover:bg-[#f3f4f8]"
                    onClick={() => tree.setIsInviteModalOpen(true)}
                >
                    <Users size={18} strokeWidth={1.8} />
                    <span>Invite People</span>
                </div>
                <div
                    className="flex cursor-pointer select-none items-center gap-2.5 rounded-md px-2.5 py-1.75 text-[13.5px] font-medium text-[#1e1f21] transition-all hover:bg-[#f3f4f8]"
                    onClick={() => navigate('/settings')}
                >
                    <Settings size={18} strokeWidth={1.8} />
                    <span>Settings</span>
                </div>
                <div
                    className="flex cursor-pointer select-none items-center gap-2.5 rounded-md px-2.5 py-1.75 text-[13.5px] font-medium text-[#e74c3c] transition-all hover:bg-[#fef2f2]"
                    onClick={handleLogout}
                >
                    <LogOut size={18} strokeWidth={1.8} />
                    <span>Logout</span>
                </div>
            </div>
        </aside>
    );
}
