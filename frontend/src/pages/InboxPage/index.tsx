import { useState } from 'react';
import {
    Hash, AtSign, Bell, Plus, Search,
    Paperclip, Smile, Image, Mic, Send, MoreHorizontal,
    Video, Phone, Pin
} from 'lucide-react';

const channels = [
    { id: 'announcements', name: 'announcements', unread: 2 },
    { id: 'general', name: 'general', unread: 0 },
    { id: 'launchpad', name: 'launchpad', unread: 0 },
    { id: 'marketing', name: 'marketing', unread: 5 },
];

const directMessages = [
    { id: 'user-1', name: 'Sarah Jenkins', avatarBg: '#0058be', unread: 1 },
    { id: 'user-2', name: 'Marcus Chen', avatarBg: '#7c5cfc', unread: 0 },
    { id: 'user-3', name: 'Elena Rodriguez', avatarBg: '#00b894', unread: 0 },
];

const mockMessages = [
    {
        id: 1,
        sender: 'Sarah Jenkins',
        avatar: 'SJ',
        avatarBg: '#0058be',
        time: '10:24 AM',
        content: `Welcome to the Launchpad! Let's track our Q4 deliverables here. Make sure to ping me if you need access to the Figma files.`,
        isSystem: false,
    },
    {
        id: 2,
        sender: 'Marcus Chen',
        avatar: 'MC',
        avatarBg: '#7c5cfc',
        time: '11:05 AM',
        content: `Awesome. I'm working on the new API endpoints right now. Should be ready for review by tomorrow morning.`,
        isSystem: false,
    },
    {
        id: 3,
        sender: 'System',
        time: '11:30 AM',
        content: `Marcus Chen updated the due date of "API Endpoints" to Tomorrow.`,
        isSystem: true,
    },
    {
        id: 4,
        sender: 'Elena Rodriguez',
        avatar: 'ER',
        avatarBg: '#00b894',
        time: '2:15 PM',
        content: `Can someone review the updated color palette? I've attached it below.`,
        isSystem: false,
        attachment: { name: 'Brand_Colors_V2.pdf', size: '2.4 MB' }
    },
];

export default function InboxPage() {
    const [activeChannel, setActiveChannel] = useState('launchpad');
    const [messageInput, setMessageInput] = useState('');

    return (
        <div className="flex h-screen overflow-hidden bg-white font-['Plus_Jakarta_Sans',sans-serif]">
            {/* ═══════ Sidebar (Chat Navigation) ═══════ */}
            <div className="flex w-64 shrink-0 flex-col border-r border-[#eef0f5] bg-[#fafbfc] max-[1100px]:hidden">
                <div className="flex items-center justify-between border-b border-[#eef0f5] px-4 py-4">
                    <h2 className="m-0 text-xl font-black text-[#141b2b]">Chat</h2>
                    <div className="flex h-7 w-7 cursor-pointer items-center justify-center rounded-md hover:bg-[#e8edf5]">
                        <Search size={16} className="text-[#5f6368]" />
                    </div>
                </div>

                <div className="flex flex-1 flex-col overflow-y-auto px-2 py-4">
                    {/* Common Filters */}
                    <div className="mb-6 flex flex-col gap-0.5">
                        <button className="flex items-center gap-2.5 rounded-lg border-none bg-transparent px-3 py-2 text-[13px] font-bold text-[#5f6368] transition-all hover:bg-[#f0f4ff] hover:text-[#141b2b]">
                            <AtSign size={16} className="text-[#b0b5c1]" /> Activity
                        </button>
                        <button className="flex items-center gap-2.5 rounded-lg border-none bg-transparent px-3 py-2 text-[13px] font-bold text-[#5f6368] transition-all hover:bg-[#f0f4ff] hover:text-[#141b2b]">
                            <Bell size={16} className="text-[#b0b5c1]" /> Notifications
                        </button>
                    </div>

                    {/* Channels */}
                    <div className="mb-2 flex items-center justify-between px-3 text-[11px] font-extrabold tracking-[0.06em] text-[#9aa0a6]">
                        <span>CHANNELS</span>
                        <Plus size={14} className="cursor-pointer transition-colors hover:text-[#0058be]" />
                    </div>
                    <div className="mb-6 flex flex-col gap-0.5">
                        {channels.map(ch => (
                            <button
                                key={ch.id}
                                onClick={() => setActiveChannel(ch.id)}
                                className={`group flex items-center justify-between rounded-lg border-none bg-transparent px-3 py-2 text-[13px] font-bold transition-all ${activeChannel === ch.id ? 'bg-[#f0f4ff] text-[#0058be]' : 'text-[#5f6368] hover:bg-[#f0f4ff] hover:text-[#141b2b]'}`}
                            >
                                <div className="flex items-center gap-2.5">
                                    <Hash size={15} className={activeChannel === ch.id ? 'text-[#0058be]' : 'text-[#b0b5c1] group-hover:text-[#5f6368]'} />
                                    <span>{ch.name}</span>
                                </div>
                                {ch.unread > 0 && (
                                    <span className="flex h-5 w-5 items-center justify-center rounded-md bg-[#e74c3c] text-[10px] font-extrabold text-white">
                                        {ch.unread}
                                    </span>
                                )}
                            </button>
                        ))}
                    </div>

                    {/* Direct Messages */}
                    <div className="mb-2 flex items-center justify-between px-3 text-[11px] font-extrabold tracking-[0.06em] text-[#9aa0a6]">
                        <span>DIRECT MESSAGES</span>
                        <Plus size={14} className="cursor-pointer transition-colors hover:text-[#0058be]" />
                    </div>
                    <div className="flex flex-col gap-0.5">
                        {directMessages.map(dm => (
                            <button
                                key={dm.id}
                                onClick={() => setActiveChannel(dm.id)}
                                className={`group flex items-center justify-between rounded-lg border-none bg-transparent px-3 py-1.5 text-[13px] font-bold transition-all ${activeChannel === dm.id ? 'bg-[#f0f4ff] text-[#0058be]' : 'text-[#5f6368] hover:bg-[#f0f4ff] hover:text-[#141b2b]'}`}
                            >
                                <div className="flex items-center gap-2.5">
                                    <div className="flex h-6 w-6 items-center justify-center rounded-full text-[10px] font-bold text-white" style={{ backgroundColor: dm.avatarBg }}>
                                        {dm.name.split(' ').map(n => n[0]).join('')}
                                    </div>
                                    <span>{dm.name}</span>
                                </div>
                                {dm.unread > 0 && (
                                    <span className="flex h-5 w-5 items-center justify-center rounded-md bg-[#e74c3c] text-[10px] font-extrabold text-white">
                                        {dm.unread}
                                    </span>
                                )}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {/* ═══════ Main Chat View ═══════ */}
            <div className="flex min-w-0 flex-1 flex-col bg-white">
                
                {/* Chat Header */}
                <div className="flex h-16 shrink-0 items-center justify-between border-b border-[#eef0f5] px-6">
                    <div className="flex items-center gap-3">
                        <div className="flex h-8 w-8 items-center justify-center rounded bg-[#f0f4ff]">
                            <Hash size={18} className="text-[#0058be]" />
                        </div>
                        <div>
                            <h3 className="m-0 text-base font-extrabold text-[#141b2b]"># launchpad</h3>
                            <div className="text-[11px] font-semibold text-[#9aa0a6]">General updates and track planning.</div>
                        </div>
                    </div>
                    
                    <div className="flex items-center gap-4">
                        <div className="hidden items-center md:flex">
                            <div className="-mr-2 flex h-7 w-7 items-center justify-center rounded-full border-2 border-white bg-[#0058be] text-[10px] font-bold text-white">SJ</div>
                            <div className="-mr-2 flex h-7 w-7 items-center justify-center rounded-full border-2 border-white bg-[#7c5cfc] text-[10px] font-bold text-white">MC</div>
                            <div className="flex h-7 w-7 items-center justify-center rounded-full border-2 border-white bg-[#00b894] text-[10px] font-bold text-white">ER</div>
                        </div>
                        <div className="h-4 w-px bg-[#eef0f5]" />
                        <div className="flex gap-1">
                            <button className="flex h-8 w-8 items-center justify-center rounded hover:bg-[#f0f4ff]"><Video size={16} className="text-[#5f6368]" /></button>
                            <button className="flex h-8 w-8 items-center justify-center rounded hover:bg-[#f0f4ff]"><Phone size={16} className="text-[#5f6368]" /></button>
                            <button className="flex h-8 w-8 items-center justify-center rounded hover:bg-[#f0f4ff]"><Pin size={16} className="text-[#5f6368]" /></button>
                            <button className="flex h-8 w-8 items-center justify-center rounded hover:bg-[#f0f4ff]"><MoreHorizontal size={16} className="text-[#5f6368]" /></button>
                        </div>
                    </div>
                </div>

                {/* Chat Messages */}
                <div className="flex-1 overflow-y-auto px-6 py-6 space-y-6">
                    <div className="flex justify-center">
                        <div className="rounded-full bg-[#f0f2f5] px-3 py-1 text-[11px] font-bold text-[#5f6368]">
                            Today
                        </div>
                    </div>

                    {mockMessages.map((msg) => (
                        <div key={msg.id} className={`group flex gap-3 ${msg.isSystem ? 'items-center justify-center' : ''}`}>
                            {msg.isSystem ? (
                                <div className="text-[12px] font-semibold text-[#9aa0a6] flex items-center gap-2">
                                    <div className="h-px w-8 bg-[#eef0f5]" />
                                    <span>{msg.content}</span>
                                    <div className="h-px w-8 bg-[#eef0f5]" />
                                </div>
                            ) : (
                                <>
                                    <div 
                                        className="mt-1 flex h-9 w-9 shrink-0 items-center justify-center rounded-md font-bold text-white text-[12px]" 
                                        style={{ backgroundColor: msg.avatarBg }}
                                    >
                                        {msg.avatar}
                                    </div>
                                    <div className="min-w-0 flex-1">
                                        <div className="flex items-baseline gap-2 mb-1">
                                            <span className="text-[14px] font-bold text-[#141b2b]">{msg.sender}</span>
                                            <span className="text-[11px] font-semibold text-[#9aa0a6]">{msg.time}</span>
                                        </div>
                                        <div className="text-[14px] font-medium leading-normal text-[#3a3f47]">
                                            {msg.content}
                                        </div>
                                        {msg.attachment && (
                                            <div className="mt-3 inline-flex items-center gap-3 rounded-lg border border-[#eef0f5] p-3 hover:bg-[#fafbfc] cursor-pointer transition-colors">
                                                <div className="flex h-8 w-8 items-center justify-center rounded bg-[#e8edff] text-[#0058be]">
                                                    <Paperclip size={16} />
                                                </div>
                                                <div>
                                                    <div className="text-[13px] font-bold text-[#141b2b]">{msg.attachment.name}</div>
                                                    <div className="text-[11px] font-semibold text-[#9aa0a6]">{msg.attachment.size}</div>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                    
                                    {/* Message Actions (Visible on Hover) */}
                                    <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity bg-white border border-[#eef0f5] rounded-md shadow-sm h-9 px-1 -mt-4">
                                        <button className="p-1.5 rounded hover:bg-[#f0f2f5] text-[#5f6368]"><Smile size={14} /></button>
                                        <button className="p-1.5 rounded hover:bg-[#f0f2f5] text-[#5f6368]">Reply</button>
                                        <button className="p-1.5 rounded hover:bg-[#f0f2f5] text-[#5f6368]"><MoreHorizontal size={14} /></button>
                                    </div>
                                </>
                            )}
                        </div>
                    ))}
                </div>

                {/* Composer */}
                <div className="px-6 pb-6 pt-2">
                    <div className="rounded-xl border border-[#dcdfe4] bg-white shadow-sm focus-within:border-[#b0b5c1] focus-within:shadow-md transition-all">
                        <textarea 
                            value={messageInput}
                            onChange={(e) => setMessageInput(e.target.value)}
                            placeholder="Message #launchpad..."
                            className="w-full resize-none bg-transparent px-4 py-3 text-[14px] font-medium text-[#141b2b] outline-none min-h-15"
                            rows={1}
                        />
                        <div className="flex items-center justify-between rounded-b-xl bg-[#fafbfc] px-2 py-2 border-t border-[#eef0f5]">
                            <div className="flex items-center gap-1">
                                <button className="flex h-8 w-8 items-center justify-center rounded hover:bg-[#eef0f5]"><Plus size={16} className="text-[#5f6368]" /></button>
                                <div className="h-4 w-px bg-[#dcdfe4] mx-1" />
                                <button className="flex h-8 w-8 items-center justify-center rounded hover:bg-[#eef0f5]"><AtSign size={16} className="text-[#5f6368]" /></button>
                                <button className="flex h-8 w-8 items-center justify-center rounded hover:bg-[#eef0f5]"><Smile size={16} className="text-[#5f6368]" /></button>
                                <button className="flex h-8 w-8 items-center justify-center rounded hover:bg-[#eef0f5]"><Image size={16} className="text-[#5f6368]" /></button>
                                <button className="flex h-8 w-8 items-center justify-center rounded hover:bg-[#eef0f5]"><Mic size={16} className="text-[#5f6368]" /></button>
                            </div>
                            <button className={`flex items-center gap-1.5 rounded-lg px-4 py-1.5 text-[13px] font-bold transition-all ${messageInput ? 'bg-[#0058be] text-white hover:bg-[#004aa0]' : 'bg-[#e2e6f0] text-[#9aa0a6] pointer-events-none'}`}>
                                Send <Send size={14} />
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
