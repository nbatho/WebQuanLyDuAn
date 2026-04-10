import { useNavigate, useLocation } from 'react-router-dom';
import {
    Home,
    MessageSquare,
    Clock,
    Plus,
    Settings,
    Users,
    LogOut,
    Sparkles,
    Grid3X3,
    MoreHorizontal,
    Trash2,
} from 'lucide-react';
import type { SpaceItem } from './types';
import WorkspaceSwitcher from './workspace/WorkspaceSwitcher';
import { fetchSignOut } from '@/store/modules/auth';
import type { AppDispatch } from '@/store/configureStore';
import { useDispatch } from 'react-redux';
import { useSpaceTree } from './SpaceTreeContext';

interface SpaceNodeProps {
    space: SpaceItem;
}

const SpaceNode = ({ space }: SpaceNodeProps) => {
    const navigate = useNavigate();
    const location = useLocation();
    const tree = useSpaceTree();
    const isSpaceActive = location.pathname.startsWith(`/space/${space.id}`);

    return (
        <div className="mb-0.5">
            <div
                className={`group flex cursor-pointer select-none items-center gap-2.5 rounded-lg px-2.5 py-2 text-[13px] font-bold transition-all ${isSpaceActive ? 'bg-[#f0f4ff] text-[#0058be]' : 'text-[#5f6368] hover:bg-[#f0f4ff] hover:text-[#141b2b]'}`}
                onClick={() => navigate({ pathname: `/space/${space.id}`, search: '' })}
            >
                <span
                    className="flex h-5.5 w-5.5 shrink-0 items-center justify-center rounded-md"
                    style={{ backgroundColor: `${space.color}18`, color: space.color }}
                >
                    <Grid3X3 size={14} />
                </span>
                <span className="flex-1 truncate">{space.name}</span>
                <div className="ml-auto hidden items-center gap-0.5 group-hover:flex">
                    <MoreHorizontal
                        size={13}
                        className="cursor-pointer rounded p-0.5 text-[#9aa0a6] hover:bg-[#e8edff] hover:text-[#0058be]"
                        onClick={(e) => tree.handleSpaceAction(e, space.id)}
                    />
                </div>
            </div>
        </div>
    );
};

export default function AppSidebar() {
    const navigate = useNavigate();
    const location = useLocation();
    const dispatch = useDispatch<AppDispatch>();
    const tree = useSpaceTree();

    const handleLogout = () => {
        try {
            dispatch(fetchSignOut());
            navigate('/login');
        } catch (error) {
            console.error('Logout failed:', error);
        }
    }
    
    return (
        <>
            <aside className="flex w-60 shrink-0 flex-col overflow-y-auto border-r border-[#eef0f5] bg-white px-2.5 py-4 max-[900px]:hidden">
                <div
                    className="mb-3 flex cursor-pointer items-center gap-2.5 border-b border-[#eef0f5] px-2 pb-4 pt-1"
                    onClick={() => navigate('/home')}
                >
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#0058be]">
                        <Grid3X3 size={18} color="#fff" />
                    </div>
                    <div className="min-w-0 flex-1">
                        <div className="text-sm font-black text-[#141b2b]">Flowise PM</div>
                        <WorkspaceSwitcher onOpenCreate={() => tree.setIsWorkspaceDialogOpen(true)} />
                    </div>
                </div>

                <nav className="mb-4 flex flex-col gap-0.5">
                    <div
                        className={`flex cursor-pointer select-none items-center gap-2.5 rounded-lg px-2.5 py-2 text-[13px] font-bold transition-all ${location.pathname === '/home' ? 'bg-[#0058be] text-white' : 'text-[#5f6368] hover:bg-[#f0f4ff] hover:text-[#141b2b]'}`}
                        onClick={() => navigate('/home')}
                    >
                        <Home size={17} />
                        <span>Home</span>
                    </div>
                    <div
                        className={`flex cursor-pointer select-none items-center gap-2.5 rounded-lg px-2.5 py-2 text-[13px] font-bold transition-all ${location.pathname === '/inbox' ? 'bg-[#0058be] text-white' : 'text-[#5f6368] hover:bg-[#f0f4ff] hover:text-[#141b2b]'}`}
                        onClick={() => navigate('/inbox')}
                    >
                        <MessageSquare size={17} />
                        <span>Inbox</span>
                        <span className="ml-auto rounded-[10px] bg-[#e74c3c] px-1.5 py-0.5 text-[10px] font-extrabold leading-none text-white">
                            5
                        </span>
                    </div>
                    <div className="mb-4 flex flex-col gap-0.5">
                        <div
                            className={`flex cursor-pointer select-none items-center gap-2.5 rounded-lg px-2.5 py-2 text-[13px] font-bold transition-all ${location.pathname === '/time-tracking' ? 'bg-[#0058be] text-white' : 'text-[#5f6368] hover:bg-[#f0f4ff] hover:text-[#141b2b]'}`}
                            onClick={() => navigate('/time-tracking')}
                        >
                            <Clock size={17} />
                            <span>Time Tracking</span>
                        </div>
                        <div
                            className={`flex cursor-pointer select-none items-center gap-2.5 rounded-lg border ${location.pathname === '/ai' ? 'border-[#7c5cfc] bg-[linear-gradient(90deg,#7c5cfc_0%,#e84393_100%)] text-white shadow-sm' : 'border-[#e8edff] bg-[linear-gradient(90deg,#f0f4ff_0%,#fff_100%)] text-[#0058be] hover:bg-[#eef2ff]'} px-2.5 py-2 text-[13px] font-bold transition-all`}
                            onClick={() => navigate('/ai')}
                        >
                            <Sparkles size={17} />
                            <span>Flowise AI</span>
                        </div>
                    </div>
                </nav>

                <div className="mb-4 flex flex-1 flex-col overflow-y-auto">
                    <div className="flex items-center justify-between px-2.5 py-2 text-[11px] font-extrabold tracking-[0.08em] text-[#9aa0a6]">
                        <span>SPACES</span>
                        <Plus
                            size={14}
                            className="cursor-pointer text-[#c2c9e0] transition-colors hover:text-[#0058be]"
                            onClick={() => tree.setIsCreateSpaceOpen(true)}
                        />
                    </div>

                    {tree.spaces.map((space) => (
                        <SpaceNode
                            key={space.id}
                            space={space}
                        />
                    ))}
                </div>

                <div className="mt-auto flex flex-col gap-1 border-t border-[#eef0f5] pt-3">
                    <button
                        className="mb-1 flex cursor-pointer items-center justify-center gap-2 rounded-lg border border-dashed border-[#0058be] bg-[#f0f4ff] px-2 py-2 text-xs font-extrabold text-[#0058be] transition-all hover:bg-[#0058be] hover:text-white"
                        onClick={() => tree.setIsInviteModalOpen(true)}
                    >
                        <Users size={16} />
                        <span>Invite People</span>
                    </button>
                    <div
                        className="flex cursor-pointer select-none items-center gap-2.5 rounded-lg px-2.5 py-2 text-[13px] font-bold text-[#5f6368] transition-all hover:bg-[#f0f4ff] hover:text-[#141b2b]"
                        onClick={() => navigate('/settings')}
                    >
                        <Settings size={17} />
                        <span>Settings</span>
                    </div>
                    <div
                        className="flex cursor-pointer select-none items-center gap-2.5 rounded-lg px-2.5 py-2 text-[13px] font-bold text-[#e74c3c] transition-all hover:bg-[#fff1f0] hover:text-[#e74c3c]"
                        onClick={handleLogout}
                    >
                        <LogOut size={17} />
                        <span>Logout</span>
                    </div>
                </div>
            </aside>

            {tree.actionMenu && (
                <div
                    ref={tree.menuRef}
                    className="fixed z-2000 min-w-40 rounded-[10px] bg-white p-1 shadow-[0_4px_24px_rgba(0,0,0,0.14)]"
                    style={{ top: tree.actionMenu.y, left: tree.actionMenu.x }}
                    onClick={(e) => e.stopPropagation()}
                >
                    <button
                        type="button"
                        className="flex w-full cursor-pointer items-center gap-2 rounded-md border-none bg-transparent px-3 py-2 text-left text-[13px] font-semibold text-[#e74c3c] transition-all hover:bg-[#fff1f0] hover:text-[#c0392b]"
                        onClick={() => tree.handleDeleteSpace(tree.actionMenu!.spaceId)}
                    >
                        <Trash2 size={14} /> Xóa Space
                    </button>
                </div>
            )}
        </>
    );
}
