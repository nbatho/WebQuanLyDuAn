import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Input, Select } from 'antd';
import { Trash2, PlusCircle, Grid3X3, Users, CheckCircle } from 'lucide-react';
import './invite-team.css';

interface InviteRow {
    id: number;
    email: string;
    role: string;
}

const roleOptions = [
    { value: 'member', label: 'Member' },
    { value: 'admin', label: 'Admin' },
    { value: 'manager', label: 'Manager' },
    { value: 'guest', label: 'Guest' },
];

let nextId = 3;

export default function InviteTeamPage() {
    const navigate = useNavigate();
    const [invites, setInvites] = useState<InviteRow[]>([
        { id: 1, email: 'colleague@company.com', role: 'member' },
        { id: 2, email: 'sarah.design@flowise.io', role: 'admin' },
    ]);

    const updateInvite = (id: number, field: keyof InviteRow, value: string) => {
        setInvites((prev) => prev.map((r) => (r.id === id ? { ...r, [field]: value } : r)));
    };

    const removeInvite = (id: number) => {
        setInvites((prev) => prev.filter((r) => r.id !== id));
    };

    const addInvite = () => {
        setInvites((prev) => [...prev, { id: nextId++, email: '', role: 'member' }]);
    };

    const handleSendInvites = () => {
        const validInvites = invites.filter((r) => r.email.trim());
        console.log('Send invites:', validInvites);
        navigate('/home');
    };

    return (
        <div className="it-page">
            {/* ── Left Sidebar ── */}
            <aside className="it-sidebar">
                <div className="it-sidebar-header">
                    <div className="it-sidebar-icon">
                        <Grid3X3 size={18} color="#fff" />
                    </div>
                    <div>
                        <div className="it-sidebar-title">Onboarding</div>
                        <div className="it-sidebar-step">STEP 3 OF 3</div>
                    </div>
                </div>

                <nav className="it-sidebar-nav">
                    <div className="it-nav-item">
                        <Grid3X3 size={15} className="it-nav-icon" />
                        <span>WORKSPACE SETUP</span>
                    </div>
                    <div className="it-nav-item it-nav-item--active">
                        <Users size={15} className="it-nav-icon" />
                        <span>INVITE TEAM</span>
                    </div>
                    <div className="it-nav-item">
                        <CheckCircle size={15} className="it-nav-icon" />
                        <span>FINALIZE</span>
                    </div>
                </nav>

                <div className="it-sidebar-bottom">
                    <button className="it-guide-btn">VIEW GUIDE</button>
                </div>
            </aside>

            {/* ── Main Area ── */}
            <div className="it-main">
                {/* Top Nav */}
                <nav className="it-topnav">
                    <span className="it-topnav-title">Workspace</span>
                    <div className="it-topnav-links">
                        <a href="#" className="it-topnav-link">Onboarding</a>
                        <a href="#" className="it-topnav-link">Support</a>
                        <button className="it-topnav-back" onClick={() => navigate('/workspace-branding')}>Back</button>
                        <Button type="primary" className="it-topnav-next" onClick={() => navigate('/home')}>
                            Next
                        </Button>
                    </div>
                </nav>

                <div className="it-content-wrap">
                    {/* ── Content ── */}
                    <section className="it-content">
                        <h1 className="it-heading">Invite your team</h1>
                        <p className="it-subheading">
                            Collaborative workspaces are 40% more productive. Add your
                            teammates now to start building workflows together and
                            streamline your operations.
                        </p>

                        {/* Invite Rows */}
                        <div className="it-invite-list">
                            <div className="it-invite-header">
                                <span className="it-invite-label it-invite-label--email">EMAIL ADDRESS</span>
                                <span className="it-invite-label it-invite-label--role">ROLE</span>
                                <span className="it-invite-label it-invite-label--action" />
                            </div>

                            {invites.map((row) => (
                                <div key={row.id} className="it-invite-row">
                                    <Input
                                        size="large"
                                        placeholder="name@company.com"
                                        value={row.email}
                                        onChange={(e) => updateInvite(row.id, 'email', e.target.value)}
                                        className="it-invite-email"
                                    />
                                    <Select
                                        size="large"
                                        value={row.role}
                                        onChange={(val) => updateInvite(row.id, 'role', val)}
                                        options={roleOptions}
                                        className="it-invite-role"
                                    />
                                    <button className="it-invite-delete" onClick={() => removeInvite(row.id)}>
                                        <Trash2 size={16} />
                                    </button>
                                </div>
                            ))}

                            <button className="it-add-btn" onClick={addInvite}>
                                <PlusCircle size={18} className="it-add-icon" />
                                <span>Add another member</span>
                            </button>
                        </div>

                        {/* Divider + Actions */}
                        <div className="it-divider" />
                        <div className="it-actions">
                            <button className="it-skip-btn" onClick={() => navigate('/home')}>Skip for now</button>
                            <button className="it-back-btn" onClick={() => navigate('/workspace-branding')}>Back</button>
                            <Button type="primary" size="large" onClick={handleSendInvites} className="it-send-btn">
                                Send Invites
                            </Button>
                        </div>
                    </section>

                    {/* ── Right Preview ── */}
                    <aside className="it-preview">
                        {/* Member Preview Card */}
                        <div className="it-preview-card">
                            <div className="it-pc-header">
                                <div className="it-pc-avatar">F</div>
                                <span className="it-pc-name">Flowise Workspace</span>
                            </div>

                            <div className="it-pc-label">LIVE PREVIEW</div>

                            <div className="it-pc-members">
                                {/* Owner */}
                                <div className="it-pc-member">
                                    <img
                                        src="https://ui-avatars.com/api/?name=You&background=4285F4&color=fff&size=32&bold=true"
                                        alt=""
                                        className="it-pc-member-img"
                                    />
                                    <div className="it-pc-member-info">
                                        <span className="it-pc-member-name">You (Owner)</span>
                                        <span className="it-pc-member-status it-pc-member-status--active">Active</span>
                                    </div>
                                </div>

                                {/* Dynamic invites */}
                                {invites
                                    .filter((r) => r.email.trim())
                                    .map((r) => (
                                        <div key={r.id} className="it-pc-member">
                                            <img
                                                src={`https://ui-avatars.com/api/?name=${encodeURIComponent(r.email.charAt(0))}&background=e8edf5&color=5f6368&size=32&bold=true`}
                                                alt=""
                                                className="it-pc-member-img"
                                            />
                                            <div className="it-pc-member-info">
                                                <span className="it-pc-member-name">
                                                    {r.email.length > 16 ? r.email.slice(0, 16) + '…' : r.email}
                                                </span>
                                                <span className="it-pc-member-status it-pc-member-status--pending">
                                                    ● PENDING {r.role.toUpperCase()}
                                                </span>
                                            </div>
                                        </div>
                                    ))}

                                {/* Empty slot */}
                                {invites.some((r) => !r.email.trim()) && (
                                    <div className="it-pc-member it-pc-member--ghost">
                                        <div className="it-pc-member-ghost-avatar" />
                                        <div className="it-pc-member-info">
                                            <span className="it-pc-member-name" style={{ color: '#9aa0a6' }}>Invite pending…</span>
                                            <span className="it-pc-member-status" style={{ color: '#c2c9e0' }}>Waiting for input</span>
                                        </div>
                                    </div>
                                )}
                            </div>

                            <div className="it-pc-info-box">
                                Members will receive an email invitation to join this
                                workspace. You can manage permissions at any
                                time in Workspace Settings.
                            </div>
                        </div>

                        {/* Promo Card */}
                        <div className="it-promo-card">
                            <div className="it-promo-deco">
                                <Users size={60} className="it-promo-icon" />
                            </div>
                            <h3 className="it-promo-title">Better Together</h3>
                            <p className="it-promo-text">
                                Teams using Flowise report a 2.5x increase in
                                deployment velocity.
                            </p>
                        </div>
                    </aside>
                </div>
            </div>
        </div>
    );
}
