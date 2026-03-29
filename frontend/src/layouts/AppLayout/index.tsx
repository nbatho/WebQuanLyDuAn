import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { Home, MessageSquare, ClipboardList, Clock, BarChart3, Plus, Settings, Users, LogOut, ChevronDown, ChevronRight, Sparkles, Grid3X3 } from 'lucide-react';
import './app-layout.css';
import { useState } from 'react';
import CreateSpaceModal from '../../components/CreateSpaceModal';

const initialSpaces = [
    {
        name: 'Marketing Space',
        icon: <Grid3X3 size={16} />,
        expanded: true,
        lists: ['Q1 Campaign', 'Brand Identity'],
        color: '#e84393'
    },
    {
        name: 'Development Space',
        icon: <Grid3X3 size={16} />,
        expanded: false,
        lists: [],
        color: '#0984e3'
    },
    {
        name: 'Design Space',
        icon: <Grid3X3 size={16} />,
        expanded: false,
        lists: [],
        color: '#00b894'
    },
];

export default function AppLayout() {
    const navigate = useNavigate();
    const location = useLocation();
    const [spaces, setSpaces] = useState(initialSpaces);
    const [isCreateSpaceOpen, setIsCreateSpaceOpen] = useState(false);

    const handleCreateSpace = (name: string, color: string) => {
        setSpaces([...spaces, {
            name,
            icon: <Grid3X3 size={16} />,
            expanded: true,
            lists: [],
            color
        }]);
    };

    return (
        <div className="al-container">
            {/* ═══════ Unified Sidebar ═══════ */}
            <aside className="al-sidebar">
                {/* Logo */}
                <div className="al-sb-logo">
                    <div className="al-sb-logo-icon">
                        <Grid3X3 size={18} color="#fff" />
                    </div>
                    <div>
                        <div className="al-sb-logo-name">Flowise PM</div>
                        <div className="al-sb-logo-sub">VECTOR LOGIC<br />WORKSPACE</div>
                    </div>
                </div>

                {/* Main Nav */}
                <nav className="al-sb-nav">
                    <div 
                        className={`al-sb-item ${location.pathname === '/home' ? 'al-sb-item--active' : ''}`}
                        onClick={() => navigate('/home')}
                    >
                        <Home size={17} />
                        <span>Home</span>
                    </div>
                    <div 
                        className={`al-sb-item ${location.pathname === '/inbox' ? 'al-sb-item--active' : ''}`}
                        onClick={() => navigate('/inbox')}
                    >
                        <MessageSquare size={17} />
                        <span>Inbox</span>
                        <span className="al-sb-badge">5</span>
                    </div>
                    <div 
                        className={`al-sb-item ${location.pathname === '/my-tasks' ? 'al-sb-item--active' : ''}`}
                        onClick={() => navigate('/my-tasks')}
                    >
                        <ClipboardList size={17} />
                        <span>My Tasks</span>
                    </div>
                </nav>

                {/* Spaces */}
                <div className="al-sb-section">
                    <div className="al-sb-section-header">
                        <span>SPACES</span>
                        <Plus 
                            size={14} 
                            className="al-sb-section-add" 
                            onClick={() => setIsCreateSpaceOpen(true)}
                            style={{ cursor: 'pointer' }}
                        />
                    </div>
                    {spaces.map((s) => (
                        <div key={s.name}>
                            <div className="al-sb-item">
                                {s.expanded ? <ChevronDown size={14} className="al-sb-chevron" /> : <ChevronRight size={14} className="al-sb-chevron" />}
                                <span className="al-sb-space-icon" style={{ color: s.color }}>{s.icon}</span>
                                <span>{s.name}</span>
                            </div>
                            {s.expanded && s.lists.map((l) => (
                                <div key={l} className="al-sb-subitem">{l}</div>
                            ))}
                        </div>
                    ))}
                </div>

                {/* Extra Nav */}
                <div className="al-sb-extra">
                    <div className="al-sb-item">
                        <Clock size={17} />
                        <span>Time Tracking</span>
                    </div>
                    <div className="al-sb-item">
                        <BarChart3 size={17} />
                        <span>Dashboards</span>
                    </div>
                    <div className="al-sb-item al-sb-item--ai">
                        <Sparkles size={17} />
                        <span>Flowise AI</span>
                        <span className="al-sb-ai-sparkle">✨🔥</span>
                    </div>
                </div>

                {/* Bottom */}
                <div className="al-sb-bottom">
                    <button className="al-sb-invite-btn" onClick={() => navigate('/invite-team')}>
                        <Users size={16} />
                        <span>Invite People</span>
                    </button>
                    <div className="al-sb-item">
                        <Settings size={17} />
                        <span>Settings</span>
                    </div>
                    <div className="al-sb-item al-sb-item--logout" onClick={() => navigate('/login')}>
                        <LogOut size={17} />
                        <span>Logout</span>
                    </div>
                </div>
            </aside>

            {/* ═══════ Main Content Outlet ═══════ */}
            <main className="al-main">
                <Outlet />
            </main>

            <CreateSpaceModal 
                isOpen={isCreateSpaceOpen} 
                onClose={() => setIsCreateSpaceOpen(false)}
                onCreate={handleCreateSpace}
            />
        </div>
    );
}
