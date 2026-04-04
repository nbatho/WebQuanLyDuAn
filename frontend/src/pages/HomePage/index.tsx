import { Clock, Calendar, AlertTriangle, ArrowRight, Target } from 'lucide-react';

export default function HomePage() {
    return (
        <div className="flex h-screen overflow-hidden bg-[#f5f7fa] font-['Plus_Jakarta_Sans',sans-serif]">

            {/* ═══════ Main Content ═══════ */}
            <main className="min-w-0 flex-1 overflow-y-auto px-7 py-6">
                {/* Welcome */}
                <h1 className="mb-2.5 text-[32px] font-black leading-[1.1] tracking-[-0.03em] text-[#141b2b]">Welcome back, John!</h1>
                <div className="mb-5.5 border-l-[3px] border-[#0058be] pl-3">
                    <p className="m-0 text-sm font-medium text-[#5f6368]">You have <strong className="text-[#141b2b]">3 tasks</strong> that need your attention today.</p>
                </div>

                {/* Needs Action */}
                <div className="mb-2.5 flex items-center gap-2 text-[11px] font-extrabold tracking-widest text-[#5f6368]">
                    <span className="flex size-5 items-center justify-center rounded-full bg-[#e74c3c] text-[11px] font-black text-white">!</span>
                    <span>NEEDS ACTION</span>
                </div>

                <div className="mb-5.5 flex flex-col gap-2 border-l-[3px] border-[#0058be] pl-3.5">
                    {/* Action 1 */}
                    <div className="flex items-start gap-3 rounded-[10px] border border-[#eef0f5] bg-white px-3.5 py-3">
                        <img
                            src="https://ui-avatars.com/api/?name=Sarah+Chen&background=e8edff&color=0058be&size=44&bold=true"
                            alt="Sarah Chen"
                            className="h-10 w-10 shrink-0 rounded-full object-cover"
                        />
                        <div className="min-w-0 flex-1">
                            <p className="mb-0.75 text-[13px] font-medium leading-[1.4] text-[#141b2b]">
                                <strong className="font-bold">Sarah Chen</strong> mentioned you in{' '}
                                <a href="#" className="font-bold text-[#0058be] hover:underline">Brand Identity Revision</a>
                            </p>
                            <p className="m-0 text-xs italic leading-[1.4] text-[#6b7280]">
                                "John, can you review the color hex codes for the new guidelines?"
                            </p>
                        </div>
                        <span className="shrink-0 whitespace-nowrap text-[10px] font-bold text-[#c2c9e0]">2M AGO</span>
                    </div>

                    {/* Action 2 */}
                    <div className="flex items-start gap-3 rounded-[10px] border border-[#eef0f5] bg-white px-3.5 py-3">
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#fef3e2] text-[#f0a220]">
                            <AlertTriangle size={20} />
                        </div>
                        <div className="min-w-0 flex-1">
                            <p className="mb-0.75 text-[13px] font-medium leading-[1.4] text-[#141b2b]">
                                <strong className="font-bold">Server Alert:</strong> Latency spike detected in{' '}
                                <a href="#" className="font-bold text-[#0058be] hover:underline">US-East Node</a>
                            </p>
                            <p className="m-0 text-xs italic leading-[1.4] text-[#6b7280]">
                                The development team is investigating. Estimated fix: 30 mins.
                            </p>
                        </div>
                        <span className="shrink-0 whitespace-nowrap text-[10px] font-bold text-[#c2c9e0]">14M AGO</span>
                    </div>
                </div>

                {/* What Do I Do Next */}
                <div className="mb-2.5 flex items-center gap-2 text-[11px] font-extrabold tracking-widest text-[#5f6368]">
                    <span className="flex size-5 items-center justify-center rounded-full bg-[#27ae60] text-[11px] font-black text-white">✓</span>
                    <span>WHAT DO I DO NEXT?</span>
                </div>

                <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                    <div className="cursor-pointer rounded-xl border border-[#eef0f5] bg-white p-4 transition duration-200 hover:-translate-y-px hover:shadow-[0_4px_16px_rgba(0,88,190,0.08)]">
                        <div className="mb-2.5 flex items-center justify-between">
                            <span className="rounded-[5px] bg-[#fce8e8] px-2.5 py-0.75 text-[10px] font-extrabold tracking-[0.06em] text-[#e74c3c]">HIGH PRIORITY</span>
                            <ArrowRight size={16} className="text-[#c2c9e0]" />
                        </div>
                        <h3 className="mb-1 text-[15px] font-extrabold leading-[1.3] text-[#141b2b]">Finalize Q1 Marketing Roadmap</h3>
                        <p className="mb-2.5 text-xs font-medium leading-[1.4] text-[#6b7280]">Draft due by end of day for the stakeholder meeting.</p>
                        <div className="flex items-center gap-1.5 text-[10px] font-extrabold tracking-[0.04em] text-[#9aa0a6]">
                            <Calendar size={13} />
                            <span>DUE TODAY</span>
                        </div>
                    </div>

                    <div className="cursor-pointer rounded-xl border border-[#eef0f5] bg-white p-4 transition duration-200 hover:-translate-y-px hover:shadow-[0_4px_16px_rgba(0,88,190,0.08)]">
                        <div className="mb-2.5 flex items-center justify-between">
                            <span className="rounded-[5px] bg-[#e8edff] px-2.5 py-0.75 text-[10px] font-extrabold tracking-[0.06em] text-[#0058be]">DEVELOPMENT</span>
                            <ArrowRight size={16} className="text-[#c2c9e0]" />
                        </div>
                        <h3 className="mb-1 text-[15px] font-extrabold leading-[1.3] text-[#141b2b]">Review UI Components Documentation</h3>
                        <p className="mb-2.5 text-xs font-medium leading-[1.4] text-[#6b7280]">Coordinate with the Design Space to align on tokens.</p>
                        <div className="flex items-center gap-1.5 text-[10px] font-extrabold tracking-[0.04em] text-[#9aa0a6]">
                            <Clock size={13} />
                            <span>STARTS AT 2:00 PM</span>
                        </div>
                    </div>
                </div>
            </main>

            {/* ═══════ Right Panel ═══════ */}
            <aside className="hidden w-65 shrink-0 flex-col gap-3 overflow-y-auto px-3.5 py-5 lg:flex">
                {/* Sprint Progress */}
                <div className="rounded-[14px] bg-linear-to-br from-[#0058be] to-[#003d82] p-4.5 text-white">
                    <span className="text-[10px] font-extrabold tracking-widest opacity-80">SPRINT PROGRESS</span>
                    <div className="my-2 flex items-baseline gap-2">
                        <span className="text-[40px] font-black leading-none tracking-[-0.03em]">64%</span>
                        <span className="text-xs font-bold tracking-[0.06em] opacity-80">COMPLETE</span>
                    </div>
                    <div className="mb-2 h-2 rounded bg-white/20">
                        <div className="h-full rounded bg-white transition-[width] duration-500" style={{ width: '64%' }} />
                    </div>
                    <span className="text-[10px] font-bold tracking-[0.06em] opacity-70">4 DAYS REMAINING</span>
                </div>

                {/* Team */}
                <div className="rounded-[14px] border border-[#eef0f5] bg-white p-4">
                    <span className="mb-3 block text-[10px] font-extrabold tracking-[0.08em] text-[#9aa0a6]">WHERE IS THE TEAM?</span>
                    <div className="mb-2.5 flex items-center gap-2.5">
                        <img
                            src="https://ui-avatars.com/api/?name=Alex+Rivera&background=4285F4&color=fff&size=36&bold=true"
                            alt="Alex Rivera"
                            className="h-9 w-9 shrink-0 rounded-full object-cover"
                        />
                        <div className="min-w-0 flex-1">
                            <span className="block text-[13px] font-bold text-[#141b2b]">Alex Rivera</span>
                            <span className="text-[9px] font-bold tracking-[0.06em] text-[#9aa0a6]">ENGINEERING</span>
                        </div>
                        <span className="whitespace-nowrap rounded-[5px] bg-[#e8f8ef] px-2 py-0.75 text-[9px] font-extrabold tracking-[0.04em] text-[#27ae60]">ACTIVE</span>
                    </div>
                    <div className="flex items-center gap-2.5">
                        <img
                            src="https://ui-avatars.com/api/?name=Elena+Rodriguez&background=e84393&color=fff&size=36&bold=true"
                            alt="Elena Rodriguez"
                            className="h-9 w-9 shrink-0 rounded-full object-cover"
                        />
                        <div className="min-w-0 flex-1">
                            <span className="block text-[13px] font-bold text-[#141b2b]">Elena Rodriguez</span>
                            <span className="text-[9px] font-bold tracking-[0.06em] text-[#9aa0a6]">MARKETING</span>
                        </div>
                        <span className="whitespace-nowrap rounded-[5px] bg-[#fef3e2] px-2 py-0.75 text-[9px] font-extrabold tracking-[0.04em] text-[#f0a220]">MEETING</span>
                    </div>
                </div>

                {/* Milestones */}
                <div className="rounded-[14px] border border-[#eef0f5] bg-white p-4">
                    <span className="mb-3 block text-[10px] font-extrabold tracking-[0.08em] text-[#9aa0a6]">UPCOMING MILESTONES</span>
                    <div className="mb-2.5 flex items-center gap-2.5">
                        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-[10px] bg-[#e8edff] text-[#0058be]">
                            <Target size={18} />
                        </div>
                        <div className="flex-1">
                            <span className="block text-[13px] font-bold text-[#141b2b]">Beta V2 Launch Phase</span>
                            <span className="text-[11px] font-medium text-[#9aa0a6]">Scheduled for next Friday, 10:00 AM</span>
                        </div>
                    </div>
                    <a href="#" className="text-[11px] font-extrabold tracking-[0.04em] text-[#0058be] hover:underline">VIEW ROADMAP {'>'}</a>
                </div>
            </aside>
        </div>
    );
}
