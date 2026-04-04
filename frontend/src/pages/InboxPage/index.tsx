import { useState } from 'react';
import { Search, Filter, AtSign, CornerUpLeft, Bell, Paperclip, Smile, Image, Download } from 'lucide-react';

const messages = [
    {
        id: 1,
        sender: 'Sarah Jenkins',
        avatar: 'SJ',
        avatarBg: '#0058be',
        subject: 'Review Q4 Brand Guidelines',
        preview: "I've attached the latest drafts for the visual...",
        time: '10:24 AM',
        priority: true,
        section: 'NEEDS ACTION • TODAY',
    },
    {
        id: 2,
        sender: 'Marcus Chen',
        avatar: 'MC',
        avatarBg: '#7c5cfc',
        subject: 'Architecture Review: API v3',
        preview: 'Can we hop on a quick call to discuss the rate...',
        time: '09:15 AM',
        priority: false,
        section: '',
    },
    {
        id: 3,
        sender: 'System Bot',
        avatar: '🤖',
        avatarBg: '#e8edf5',
        subject: 'Monthly Usage Report',
        preview: 'Your team has reached 85% of storage quot...',
        time: 'Yesterday',
        priority: false,
        section: 'OTHER UPDATES',
    },
];



export default function InboxPage() {
    const [activeMsg, setActiveMsg] = useState(1);
    const [activeFilter, setActiveFilter] = useState('all');

    return (
        <div className="flex h-screen overflow-hidden bg-white font-['Plus_Jakarta_Sans',sans-serif]">
            {/* ═══════ Filter Column ═══════ */}
            <div className="w-40 shrink-0 border-r border-[#eef0f5] px-3 py-4 max-[1100px]:hidden">
                <h2 className="mb-3.5 text-[20px] font-black text-[#141b2b]">Inbox</h2>
                <div className="mb-4 flex flex-col gap-0.5">
                    {[
                        { id: 'all', label: 'All', count: 12 },
                        { id: 'unread', label: 'Unread', count: 4 },
                        { id: 'assigned', label: 'Assigned', count: null },
                    ].map((f) => (
                        <button
                            key={f.id}
                            className={`flex items-center justify-between rounded-lg border-none bg-transparent px-2.5 py-1.75 text-left text-[13px] font-semibold text-[#5f6368] transition-all duration-150 hover:bg-[#f0f4ff] ${activeFilter === f.id ? 'font-bold text-[#0058be]' : ''
                                }`}
                            onClick={() => setActiveFilter(f.id)}
                        >
                            <span>{f.label}</span>
                            {f.count && <span className="text-[11px] font-bold text-[#9aa0a6]">{f.count}</span>}
                        </button>
                    ))}
                </div>

                <div className="px-2.5 py-1.5 text-[10px] font-extrabold tracking-[0.08em] text-[#9aa0a6]">CATEGORIES</div>
                <div className="flex flex-col gap-0.5">
                    <button className="flex items-center gap-2.25 rounded-lg border-none bg-transparent px-2.5 py-1.75 text-[13px] font-semibold text-[#5f6368] transition-colors duration-150 hover:bg-[#f0f4ff]"><AtSign size={15} /><span>Mentions</span></button>
                    <button className="flex items-center gap-2.25 rounded-lg border-none bg-transparent px-2.5 py-1.75 text-[13px] font-semibold text-[#5f6368] transition-colors duration-150 hover:bg-[#f0f4ff]"><CornerUpLeft size={15} /><span>Replies</span></button>
                    <button className="flex items-center gap-2.25 rounded-lg border-none bg-transparent px-2.5 py-1.75 text-[13px] font-semibold text-[#5f6368] transition-colors duration-150 hover:bg-[#f0f4ff]"><Bell size={15} /><span>System Updates</span></button>
                </div>
            </div>

            {/* ═══════ Message List ═══════ */}
            <div className="flex w-70 shrink-0 flex-col border-r border-[#eef0f5] max-[700px]:hidden">
                <div className="flex items-center gap-2 border-b border-[#eef0f5] px-3 py-2.5">
                    <div className="flex h-8.5 flex-1 items-center gap-2 rounded-lg bg-[#f5f7ff] px-2.5">
                        <Search size={16} className="shrink-0 text-[#9aa0a6]" />
                        <input type="text" placeholder="Search messages..." className="w-full border-none bg-transparent font-['Plus_Jakarta_Sans',sans-serif] text-xs font-medium text-[#141b2b] outline-none" />
                    </div>
                    <Filter size={16} className="cursor-pointer text-[#9aa0a6]" />
                </div>

                <div className="flex-1 overflow-y-auto py-1.5">
                    {messages.map((msg) => (
                        <div key={msg.id}>
                            {msg.section && (
                                <div className="flex items-center gap-1.5 px-3.5 pb-1 pt-2 text-[10px] font-extrabold tracking-[0.06em] text-[#9aa0a6]">
                                    {msg.section.includes('NEEDS') && <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-[#e74c3c]" />}
                                    {msg.section}
                                </div>
                            )}
                            <div
                                className={`flex cursor-pointer items-start gap-2.5 border-l-[3px] px-3.5 py-2.5 transition-colors duration-100 ${activeMsg === msg.id
                                        ? 'border-l-[#0058be] bg-[#e8edff]'
                                        : 'border-l-transparent hover:bg-[#f5f7ff]'
                                    }`}
                                onClick={() => setActiveMsg(msg.id)}
                            >
                                <div className={`flex h-8.5 w-8.5 shrink-0 items-center justify-center rounded-full text-xs font-extrabold ${msg.avatarBg === '#e8edf5' ? 'text-[#5f6368]' : 'text-white'}`} style={{ backgroundColor: msg.avatarBg }}>
                                    {msg.avatar.length > 2 ? msg.avatar : msg.avatar}
                                </div>
                                <div className="min-w-0 flex-1">
                                    <div className="mb-0.5 flex items-center justify-between">
                                        <span className="text-xs font-bold text-[#141b2b]">{msg.sender}</span>
                                        <span className="text-[10px] font-semibold text-[#c2c9e0]">{msg.time}</span>
                                    </div>
                                    <span className="mb-0.5 block overflow-hidden text-ellipsis whitespace-nowrap text-xs font-bold text-[#141b2b]">{msg.subject}</span>
                                    <span className="flex items-center gap-1 overflow-hidden text-ellipsis whitespace-nowrap text-[11px] font-medium text-[#9aa0a6]">
                                        {msg.priority && <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-[#0058be]" />}
                                        {msg.preview}
                                    </span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* ═══════ Conversation Detail ═══════ */}
            <div className="flex min-w-0 flex-1 flex-col bg-[#fafbff]">
                <div className="flex items-center justify-between border-b border-[#eef0f5] px-5 py-3">
                    <h2 className="m-0 text-lg font-extrabold text-[#141b2b]">Review Q4 Brand Guidelines</h2>
                    <div className="flex items-center gap-1.5">
                        <span className="rounded-[5px] bg-[#eef0f5] px-2 py-0.5 text-[10px] font-extrabold tracking-[0.04em] text-[#9aa0a6]">FLOW-829</span>
                        <button className="flex h-7.5 w-7.5 items-center justify-center rounded-md border-none bg-transparent text-sm hover:bg-[#e8edf5]">📎</button>
                        <button className="flex h-7.5 w-7.5 items-center justify-center rounded-md border-none bg-transparent text-sm hover:bg-[#e8edf5]">🗑</button>
                        <button className="flex h-7.5 w-7.5 items-center justify-center rounded-md border-none bg-transparent text-sm hover:bg-[#e8edf5]">⋮</button>
                    </div>
                </div>

                <div className="flex flex-1 flex-col gap-4 overflow-y-auto px-5 py-4">
                    {/* Message 1 */}
                    <div className="flex gap-2.5">
                        <img
                            src="https://ui-avatars.com/api/?name=Sarah+Jenkins&background=0058be&color=fff&size=36&bold=true"
                            alt="Sarah Jenkins"
                            className="h-9 w-9 shrink-0 rounded-full object-cover"
                        />
                        <div className="min-w-0 flex-1">
                            <div className="mb-1.5 flex items-center gap-2">
                                <span className="text-[13px] font-bold text-[#141b2b]">Sarah Jenkins</span>
                                <span className="text-[11px] font-semibold text-[#c2c9e0]">10:24 AM</span>
                            </div>
                            <div className="rounded-[0_12px_12px_12px] border border-[#eef0f5] bg-white px-3.5 py-3">
                                <p className="m-0 text-[13px] font-medium leading-[1.55] text-[#3a3f47]">Hi team! I've just finalized the initial draft for the Q4 Brand Guidelines. We need to focus specifically on the "Reductive Geometry" section. @Marcus Chen, could you take a look at the color palette accessibility?</p>
                                <div className="mt-2.5 flex items-center gap-2.5 rounded-lg bg-[#f5f7ff] px-3 py-2">
                                    <div className="text-[22px]">📄</div>
                                    <div className="flex-1">
                                        <span className="block text-xs font-bold text-[#141b2b]">Brand_Guidelines_V1.pdf</span>
                                        <span className="text-[10px] font-semibold text-[#9aa0a6]">4.2 MB</span>
                                    </div>
                                    <Download size={16} className="cursor-pointer text-[#9aa0a6] hover:text-[#0058be]" />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Message 2 */}
                    <div className="flex gap-2.5">
                        <img
                            src="https://ui-avatars.com/api/?name=Marcus+Chen&background=7c5cfc&color=fff&size=36&bold=true"
                            alt="Marcus Chen"
                            className="h-9 w-9 shrink-0 rounded-full object-cover"
                        />
                        <div className="min-w-0 flex-1">
                            <div className="mb-1.5 flex items-center gap-2">
                                <span className="text-[13px] font-bold text-[#141b2b]">Marcus Chen</span>
                                <span className="text-[11px] font-semibold text-[#c2c9e0]">11:05 AM</span>
                            </div>
                            <div className="rounded-[0_12px_12px_12px] border border-[#eef0f5] bg-white px-3.5 py-3">
                                <p className="m-0 text-[13px] font-medium leading-[1.55] text-[#3a3f47]">On it, Sarah. The geometric shapes look great. Checking the contrast ratios for the primary blue (#0058be) against the container backgrounds now.</p>
                            </div>
                        </div>
                    </div>

                    {/* Linked Task */}
                    <div className="mt-2 rounded-xl border border-[#eef0f5] bg-white px-3.5 py-3">
                        <div className="mb-1.5 flex flex-wrap items-center gap-2">
                            <span className="text-[10px] font-extrabold tracking-[0.06em] text-[#9aa0a6]">LINKED TASK</span>
                            <span className="rounded bg-[#e8edff] px-2 py-0.5 text-[10px] font-extrabold text-[#0058be]">In Review</span>
                            <span className="text-[10px] font-bold text-[#5f6368]">65% Complete</span>
                            <span className="ml-auto text-[10px] font-extrabold tracking-[0.06em] text-[#9aa0a6]">STAKEHOLDERS</span>
                        </div>
                        <div className="mb-2 flex items-center justify-between">
                            <span className="text-sm font-extrabold text-[#141b2b]">Finalize Styleguide</span>
                            <div className="flex items-center">
                                <img src="https://ui-avatars.com/api/?name=S+J&background=0058be&color=fff&size=24&bold=true" alt="" className="ml-0 h-6 w-6 rounded-full border-2 border-white" />
                                <img src="https://ui-avatars.com/api/?name=M+C&background=7c5cfc&color=fff&size=24&bold=true" alt="" className="-ml-1.5 h-6 w-6 rounded-full border-2 border-white" />
                                <span className="-ml-1.5 flex h-6 w-6 items-center justify-center rounded-full border-2 border-white bg-[#e2e6f0] text-[9px] font-extrabold text-[#5f6368]">+4</span>
                            </div>
                        </div>
                        <div className="h-1.25 rounded bg-[#e8edf5]">
                            <div className="h-full rounded bg-[#0058be]" style={{ width: '65%' }} />
                        </div>
                    </div>
                </div>

                {/* Reply Box */}
                <div className="border-t border-[#eef0f5] bg-white px-5 py-3">
                    <input type="text" placeholder="Write a reply..." className="mb-2 w-full rounded-[10px] border border-[#e2e6f0] px-3.5 py-2.5 font-['Plus_Jakarta_Sans',sans-serif] text-[13px] font-medium text-[#141b2b] outline-none focus:border-[#0058be]" />
                    <div className="flex items-center justify-between">
                        <div className="flex gap-2.5">
                            <Paperclip size={16} className="cursor-pointer text-[#9aa0a6] hover:text-[#0058be]" />
                            <Smile size={16} className="cursor-pointer text-[#9aa0a6] hover:text-[#0058be]" />
                            <Image size={16} className="cursor-pointer text-[#9aa0a6] hover:text-[#0058be]" />
                        </div>
                        <button className="rounded-lg border-none bg-[#0058be] px-6 py-2 text-[13px] font-bold text-white transition-colors duration-150 hover:bg-[#004aa0]">Reply</button>
                    </div>
                </div>
            </div>
        </div>
    );
}
