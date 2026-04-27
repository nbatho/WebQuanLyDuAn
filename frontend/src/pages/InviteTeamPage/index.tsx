import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Input, Select } from 'antd';
import { Trash2, PlusCircle, Grid3X3, Users, CheckCircle } from 'lucide-react';
import type { InviteRow } from '../../types/team';


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
        navigate('/home');
    };

    return (
        <div className="flex h-screen overflow-hidden font-['Plus_Jakarta_Sans',sans-serif]">
            {/* ── Left Sidebar ── */}
            <aside className="flex w-52.5 shrink-0 flex-col border-r border-[#e8edf5] bg-[#f5f7ff] px-3.5 py-5">
                <div className="mb-7 flex items-center gap-2.5">
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[#0058be]">
                        <Grid3X3 size={18} color="#fff" />
                    </div>
                    <div>
                        <div className="text-[15px] font-extrabold text-[#141b2b]">Onboarding</div>
                        <div className="text-[10px] font-bold uppercase tracking-[0.08em] text-[#0058be]">STEP 3 OF 3</div>
                    </div>
                </div>

                <nav className="flex flex-col gap-0.75">
                    <div className="flex cursor-pointer items-center gap-2.5 rounded-lg border-l-[3px] border-transparent px-3 py-2.5 text-[11px] font-bold tracking-[0.04em] text-[#6b7280] transition-all hover:bg-[#e8edff]">
                        <Grid3X3 size={15} className="text-[#9aa0a6]" />
                        <span>WORKSPACE SETUP</span>
                    </div>
                    <div className="flex cursor-pointer items-center gap-2.5 rounded-lg border-l-[3px] border-[#0058be] bg-[#0058be] px-3 py-2.5 text-[11px] font-bold tracking-[0.04em] text-white transition-all">
                        <Users size={15} className="text-white" />
                        <span>INVITE TEAM</span>
                    </div>
                    <div className="flex cursor-pointer items-center gap-2.5 rounded-lg border-l-[3px] border-transparent px-3 py-2.5 text-[11px] font-bold tracking-[0.04em] text-[#6b7280] transition-all hover:bg-[#e8edff]">
                        <CheckCircle size={15} className="text-[#9aa0a6]" />
                        <span>FINALIZE</span>
                    </div>
                </nav>

                <div className="mt-auto">
                    <button className="w-full rounded-lg border-none bg-[#e2e6f0] p-2.5 text-[11px] font-extrabold uppercase tracking-[0.08em] text-[#141b2b] transition-colors hover:bg-[#d2d8e8]">VIEW GUIDE</button>
                </div>
            </aside>

            {/* ── Main Area ── */}
            <div className="flex min-w-0 flex-1 flex-col">
                {/* Top Nav */}
                <nav className="flex h-12.5 shrink-0 items-center justify-between border-b border-[#eef0f5] px-7">
                    <span className="text-base font-extrabold text-[#141b2b]">Workspace</span>
                    <div className="flex items-center gap-4">
                        <a href="#" className="text-[13px] font-semibold text-[#5f6368] no-underline transition-colors hover:text-[#141b2b]">Onboarding</a>
                        <a href="#" className="text-[13px] font-semibold text-[#5f6368] no-underline transition-colors hover:text-[#141b2b]">Support</a>
                        <button className="border-none bg-transparent text-[13px] font-semibold text-[#5f6368]" onClick={() => navigate('/workspace-branding')}>Back</button>
                        <Button type="primary" className="h-8.5 rounded-lg text-[13px] font-bold" onClick={() => navigate('/home')}>
                            Next
                        </Button>
                    </div>
                </nav>

                <div className="flex min-h-0 flex-1 overflow-hidden">
                    {/* ── Content ── */}
                    <section className="flex-1 overflow-y-auto px-10 py-7">
                        <h1 className="mb-2 text-[34px] font-black leading-[1.1] tracking-[-0.03em] text-[#141b2b]">Invite your team</h1>
                        <p className="mb-6 max-w-115 text-sm font-medium leading-[1.6] text-[#6b7280]">
                            Collaborative workspaces are 40% more productive. Add your
                            teammates now to start building workflows together and
                            streamline your operations.
                        </p>

                        {/* Invite Rows */}
                        <div className="max-w-130">
                            <div className="mb-2 flex gap-2.5 pr-9.5">
                                <span className="flex-1 text-[11px] font-extrabold uppercase tracking-[0.06em] text-[#141b2b]">EMAIL ADDRESS</span>
                                <span className="w-32.5 text-[11px] font-extrabold uppercase tracking-[0.06em] text-[#141b2b]">ROLE</span>
                                <span className="w-7 text-[11px] font-extrabold uppercase tracking-[0.06em] text-[#141b2b]" />
                            </div>

                            {invites.map((row) => (
                                <div key={row.id} className="mb-2 flex items-center gap-2.5">
                                    <Input
                                        size="large"
                                        placeholder="name@company.com"
                                        value={row.email}
                                        onChange={(e) => updateInvite(row.id, 'email', e.target.value)}
                                        className="flex-1"
                                        style={{ height: '42px', borderRadius: '8px', border: '2px solid #e2e6f0', fontSize: '14px', fontWeight: 500 }}
                                    />
                                    <Select
                                        size="large"
                                        value={row.role}
                                        onChange={(val) => updateInvite(row.id, 'role', val)}
                                        options={roleOptions}
                                        className="w-32.5"
                                    />
                                    <button className="flex h-8.5 w-8.5 shrink-0 items-center justify-center rounded-lg border-none bg-transparent text-[#9aa0a6] transition-all hover:bg-[#fee2e2] hover:text-[#e74c3c]" onClick={() => removeInvite(row.id)}>
                                        <Trash2 size={16} />
                                    </button>
                                </div>
                            ))}

                            <button className="mt-1 flex items-center gap-2 border-none bg-transparent py-2 text-sm font-bold text-[#0058be] transition-opacity hover:opacity-80" onClick={addInvite}>
                                <PlusCircle size={18} className="text-[#0058be]" />
                                <span>Add another member</span>
                            </button>
                        </div>

                        {/* Divider + Actions */}
                        <div className="my-5 h-px max-w-130 bg-[#e8eaed]" />
                        <div className="flex items-center gap-3">
                            <button className="border-none bg-transparent px-1 py-2 text-sm font-bold text-[#6b7280] transition-colors hover:text-[#141b2b]" onClick={() => navigate('/home')}>Skip for now</button>
                            <button className="rounded-[10px] border-2 border-[#e2e6f0] bg-white px-6 py-2.5 text-sm font-bold text-[#5f6368] transition-all hover:border-[#141b2b] hover:text-[#141b2b]" onClick={() => navigate('/workspace-branding')}>Back</button>
                            <Button type="primary" size="large" onClick={handleSendInvites} className="h-11 min-w-35 rounded-[10px] text-[15px] font-extrabold">
                                Send Invites
                            </Button>
                        </div>
                    </section>

                    {/* ── Right Preview ── */}
                    <aside className="flex w-75 shrink-0 flex-col gap-4 overflow-y-auto border-l border-[#eef0f5] bg-[#f5f7ff] p-5">
                        {/* Member Preview Card */}
                        <div className="rounded-[14px] bg-white p-4 shadow-[0_1px_4px_rgba(0,0,0,0.04)]">
                            <div className="mb-3.5 flex items-center gap-2.5">
                                <div className="flex h-8.5 w-8.5 shrink-0 items-center justify-center rounded-lg bg-[#0058be] text-base font-extrabold text-white">F</div>
                                <span className="text-sm font-extrabold text-[#141b2b]">Flowise Workspace</span>
                            </div>

                            <div className="mb-2.5 text-[10px] font-extrabold uppercase tracking-[0.08em] text-[#9aa0a6]">LIVE PREVIEW</div>

                            <div className="mb-3.5 flex flex-col gap-2.5">
                                {/* Owner */}
                                <div className="flex items-center gap-2.5">
                                    <img
                                        src="https://ui-avatars.com/api/?name=You&background=4285F4&color=fff&size=32&bold=true"
                                        alt=""
                                        className="h-8 w-8 rounded-full object-cover"
                                    />
                                    <div className="min-w-0">
                                        <span className="block overflow-hidden text-ellipsis whitespace-nowrap text-[13px] font-bold text-[#141b2b]">You (Owner)</span>
                                        <span className="text-xs font-semibold text-[#27ae60]">Active</span>
                                    </div>
                                </div>

                                {/* Dynamic invites */}
                                {invites
                                    .filter((r) => r.email.trim())
                                    .map((r) => (
                                        <div key={r.id} className="flex items-center gap-2.5">
                                            <img
                                                src={`https://ui-avatars.com/api/?name=${encodeURIComponent(r.email.charAt(0))}&background=e8edf5&color=5f6368&size=32&bold=true`}
                                                alt=""
                                                className="h-8 w-8 rounded-full object-cover"
                                            />
                                            <div className="min-w-0">
                                                <span className="block overflow-hidden text-ellipsis whitespace-nowrap text-[13px] font-bold text-[#141b2b]">
                                                    {r.email.length > 16 ? r.email.slice(0, 16) + '…' : r.email}
                                                </span>
                                                <span className="text-xs font-semibold text-[#f0a220]">
                                                    ● PENDING {r.role.toUpperCase()}
                                                </span>
                                            </div>
                                        </div>
                                    ))}

                                {/* Empty slot */}
                                {invites.some((r) => !r.email.trim()) && (
                                    <div className="flex items-center gap-2.5 opacity-70">
                                        <div className="h-8 w-8 rounded-full bg-[#eef0f5]" />
                                        <div className="min-w-0">
                                            <span className="block overflow-hidden text-ellipsis whitespace-nowrap text-[13px] font-bold text-[#9aa0a6]">Invite pending…</span>
                                            <span className="text-xs font-semibold text-[#c2c9e0]">Waiting for input</span>
                                        </div>
                                    </div>
                                )}
                            </div>

                            <div className="rounded-lg bg-[#f8fafc] p-2.5 text-xs font-medium leading-normal text-[#6b7280]">
                                Members will receive an email invitation to join this
                                workspace. You can manage permissions at any
                                time in Workspace Settings.
                            </div>
                        </div>

                        {/* Promo Card */}
                        <div className="relative overflow-hidden rounded-[14px] bg-[#0f766e] p-5">
                            <div className="absolute -right-2 -top-2 opacity-20">
                                <Users size={60} className="text-white" />
                            </div>
                            <h3 className="relative mb-1.5 text-lg font-extrabold text-white">Better Together</h3>
                            <p className="relative m-0 text-xs font-medium leading-normal text-white/90">
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
