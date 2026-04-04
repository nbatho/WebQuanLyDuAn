import {
    BarChart3, Users, CheckCircle2,
    Clock, AlertTriangle, ArrowUpRight, MoreHorizontal, Plus
} from 'lucide-react';
import { Avatar } from 'antd';

const avatarColors: Record<string, string> = {
    AR: '#4285F4', MC: '#7c5cfc', SJ: '#0058be', ER: '#e84393'
};

const teamWorkload = [
    { name: 'Alex Rivera', initials: 'AR', completed: 12, inProgress: 4, total: 20 },
    { name: 'Marcus Chen', initials: 'MC', completed: 8, inProgress: 6, total: 18 },
    { name: 'Sarah Jenkins', initials: 'SJ', completed: 15, inProgress: 2, total: 20 },
    { name: 'Elena Rodriguez', initials: 'ER', completed: 10, inProgress: 5, total: 17 },
];

const recentActivity = [
    { user: 'AR', action: 'completed', task: 'SSO Integration with Azure AD', time: '2h ago' },
    { user: 'MC', action: 'commented on', task: 'Architecture Review: API v3', time: '3h ago' },
    { user: 'SJ', action: 'changed status of', task: 'Brand Identity Revision', time: '4h ago' },
    { user: 'ER', action: 'created', task: 'Dark Mode Interface Alpha', time: '5h ago' },
    { user: 'AR', action: 'assigned', task: 'Database Indexing for Reports', time: '6h ago' },
];

export default function DashboardsPage() {
    return (
        <div className="flex h-full flex-col overflow-hidden bg-[#f5f7ff] font-['Plus_Jakarta_Sans','Inter',sans-serif]">
            {/* Header */}
            <header className="flex shrink-0 items-center justify-between border-b border-[#eef0f5] bg-white px-6 py-3.5">
                <div className="flex items-center gap-2.5">
                    <BarChart3 size={20} className="text-[#7c5cfc]" />
                    <h1 className="m-0 text-lg font-extrabold text-[#141b2b]">Dashboards</h1>
                </div>
                <div className="flex gap-2">
                    <button className="flex cursor-pointer items-center gap-1.25 rounded-lg border-none bg-[#7c5cfc] px-3.5 py-1.75 text-xs font-bold text-white transition-colors duration-150 hover:bg-[#6b4ce0]"><Plus size={14} /> Add Widget</button>
                </div>
            </header>

            {/* Summary Cards */}
            <div className="grid shrink-0 grid-cols-1 gap-4 px-6 py-5 lg:grid-cols-4">
                <div className="rounded-xl border border-[#eef0f5] bg-white px-5 py-4.5 transition duration-150 hover:-translate-y-0.5 hover:shadow-[0_4px_16px_rgba(0,0,0,0.06)]">
                    <div className="mb-2 flex items-center justify-between text-[#0058be]">
                        <CheckCircle2 size={20} />
                        <ArrowUpRight size={16} className="text-[#27ae60]" />
                    </div>
                    <div className="text-[32px] font-black leading-none text-[#141b2b]">45</div>
                    <div className="mt-1 text-[13px] font-bold text-[#5f6368]">Tasks Completed</div>
                    <div className="mt-0.5 text-[11px] font-semibold text-[#9aa0a6]">+12% from last week</div>
                </div>
                <div className="rounded-xl border border-[#eef0f5] bg-white px-5 py-4.5 transition duration-150 hover:-translate-y-0.5 hover:shadow-[0_4px_16px_rgba(0,0,0,0.06)]">
                    <div className="mb-2 flex items-center justify-between text-[#7c5cfc]">
                        <Clock size={20} />
                        <ArrowUpRight size={16} className="text-[#27ae60]" />
                    </div>
                    <div className="text-[32px] font-black leading-none text-[#141b2b]">17</div>
                    <div className="mt-1 text-[13px] font-bold text-[#5f6368]">In Progress</div>
                    <div className="mt-0.5 text-[11px] font-semibold text-[#9aa0a6]">Across 3 spaces</div>
                </div>
                <div className="rounded-xl border border-[#eef0f5] bg-white px-5 py-4.5 transition duration-150 hover:-translate-y-0.5 hover:shadow-[0_4px_16px_rgba(0,0,0,0.06)]">
                    <div className="mb-2 flex items-center justify-between text-[#e74c3c]">
                        <AlertTriangle size={20} />
                    </div>
                    <div className="text-[32px] font-black leading-none text-[#141b2b]">4</div>
                    <div className="mt-1 text-[13px] font-bold text-[#5f6368]">Overdue</div>
                    <div className="mt-0.5 text-[11px] font-semibold text-[#9aa0a6]">Need attention</div>
                </div>
                <div className="rounded-xl border border-[#eef0f5] bg-white px-5 py-4.5 transition duration-150 hover:-translate-y-0.5 hover:shadow-[0_4px_16px_rgba(0,0,0,0.06)]">
                    <div className="mb-2 flex items-center justify-between text-[#27ae60]">
                        <Users size={20} />
                    </div>
                    <div className="text-[32px] font-black leading-none text-[#141b2b]">12</div>
                    <div className="mt-1 text-[13px] font-bold text-[#5f6368]">Team Members</div>
                    <div className="mt-0.5 text-[11px] font-semibold text-[#9aa0a6]">8 active now</div>
                </div>
            </div>

            {/* Main Content */}
            <div className="grid flex-1 grid-cols-1 gap-4 overflow-y-auto px-6 pb-6 lg:grid-cols-2">
                {/* Workload Chart */}
                <div className="rounded-xl border border-[#eef0f5] bg-white px-5 py-4.5 lg:col-start-1 lg:row-start-1">
                    <div className="mb-4 flex items-center justify-between">
                        <h3 className="m-0 text-sm font-extrabold text-[#141b2b]">Team Workload</h3>
                        <MoreHorizontal size={16} className="cursor-pointer text-[#9aa0a6] hover:text-[#5f6368]" />
                    </div>
                    <div className="flex flex-col gap-3">
                        {teamWorkload.map(member => {
                            const completedPct = (member.completed / member.total) * 100;
                            const inProgressPct = (member.inProgress / member.total) * 100;
                            return (
                                <div key={member.initials} className="flex items-center gap-3">
                                    <div className="flex min-w-45 items-center gap-2">
                                        <Avatar size={28} style={{ backgroundColor: avatarColors[member.initials], fontSize: '10px', fontWeight: 'bold' }}>
                                            {member.initials}
                                        </Avatar>
                                        <div className="flex flex-col">
                                            <span className="text-[13px] font-bold text-[#141b2b]">{member.name}</span>
                                            <span className="text-[11px] text-[#9aa0a6]">{member.completed} done · {member.inProgress} active</span>
                                        </div>
                                    </div>
                                    <div className="flex flex-1 items-center gap-2">
                                        <div className="flex h-2 flex-1 overflow-hidden rounded bg-[#eef0f5]">
                                            <div className="bg-[#27ae60] transition-[width] duration-400" style={{ width: `${completedPct}%` }} />
                                            <div className="bg-[#0058be] transition-[width] duration-400" style={{ width: `${inProgressPct}%` }} />
                                        </div>
                                        <span className="min-w-6 text-right text-xs font-extrabold text-[#5f6368]">{member.total}</span>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                    <div className="mt-3 flex gap-4 border-t border-[#f0f2f5] pt-2.5">
                        <span className="flex items-center gap-1.5 text-[11px] font-semibold text-[#5f6368]"><span className="h-2 w-2 rounded-full bg-[#27ae60]" /> Completed</span>
                        <span className="flex items-center gap-1.5 text-[11px] font-semibold text-[#5f6368]"><span className="h-2 w-2 rounded-full bg-[#0058be]" /> In Progress</span>
                    </div>
                </div>

                {/* Activity Feed */}
                <div className="rounded-xl border border-[#eef0f5] bg-white px-5 py-4.5 lg:col-start-2 lg:row-span-2 lg:row-start-1">
                    <div className="mb-4 flex items-center justify-between">
                        <h3 className="m-0 text-sm font-extrabold text-[#141b2b]">Recent Activity</h3>
                        <MoreHorizontal size={16} className="cursor-pointer text-[#9aa0a6] hover:text-[#5f6368]" />
                    </div>
                    <div className="flex flex-col gap-0.5">
                        {recentActivity.map((act, i) => (
                            <div key={i} className="flex items-start gap-2.5 rounded-lg px-2 py-2.5 transition-colors duration-100 hover:bg-[#f8fafb]">
                                <Avatar size={28} style={{ backgroundColor: avatarColors[act.user], fontSize: '10px', fontWeight: 'bold' }}>
                                    {act.user}
                                </Avatar>
                                <div className="min-w-0 flex-1">
                                    <p className="m-0 text-[13px] leading-[1.4] text-[#5f6368]">
                                        <strong className="text-[#141b2b]">{teamWorkload.find(m => m.initials === act.user)?.name || act.user}</strong>
                                        {' '}{act.action}{' '}
                                        <span className="cursor-pointer font-semibold text-[#0058be] hover:underline">{act.task}</span>
                                    </p>
                                    <span className="text-[11px] text-[#9aa0a6]">{act.time}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Status Distribution */}
                <div className="rounded-xl border border-[#eef0f5] bg-white px-5 py-4.5 lg:col-start-1 lg:row-start-2">
                    <div className="mb-4 flex items-center justify-between">
                        <h3 className="m-0 text-sm font-extrabold text-[#141b2b]">Task Status</h3>
                        <MoreHorizontal size={16} className="cursor-pointer text-[#9aa0a6] hover:text-[#5f6368]" />
                    </div>
                    <div className="flex justify-center py-4">
                        <div className="relative h-35 w-35">
                            <svg viewBox="0 0 36 36" className="h-full w-full -rotate-90">
                                <path className="fill-none stroke-3 stroke-linecap-round stroke-[#eef0f5]" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
                                <path className="fill-none stroke-3 stroke-linecap-round stroke-[#27ae60]" strokeDasharray="58, 100" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
                                <path className="fill-none stroke-3 stroke-linecap-round stroke-[#0058be]" strokeDasharray="22, 100" strokeDashoffset="-58" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
                                <path className="fill-none stroke-3 stroke-linecap-round stroke-[#5f6368]" strokeDasharray="15, 100" strokeDashoffset="-80" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
                            </svg>
                            <div className="absolute inset-0 flex flex-col items-center justify-center">
                                <span className="text-[28px] font-black text-[#141b2b]">76</span>
                                <span className="text-xs font-semibold text-[#9aa0a6]">Total</span>
                            </div>
                        </div>
                    </div>
                    <div className="mt-2 flex justify-center gap-5">
                        <div className="flex items-center gap-1.5 text-xs text-[#5f6368]"><span className="h-2 w-2 rounded-full bg-[#27ae60]" />Completed <strong className="ml-1 text-[#141b2b]">45</strong></div>
                        <div className="flex items-center gap-1.5 text-xs text-[#5f6368]"><span className="h-2 w-2 rounded-full bg-[#0058be]" />In Progress <strong className="ml-1 text-[#141b2b]">17</strong></div>
                        <div className="flex items-center gap-1.5 text-xs text-[#5f6368]"><span className="h-2 w-2 rounded-full bg-[#5f6368]" />To Do <strong className="ml-1 text-[#141b2b]">14</strong></div>
                    </div>
                </div>
            </div>
        </div>
    );
}
