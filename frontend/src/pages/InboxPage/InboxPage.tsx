import { useState, useEffect, useRef, useCallback } from 'react';
import { Hash, Plus, Send, MessageSquare, X, FileText, Cloud } from 'lucide-react';
import useDrivePicker from 'react-google-drive-picker';
import { message } from 'antd';
import { useAppSelector } from '../../hooks';
import * as msgApi from '../../api/messages';
import type { ConversationData, MessageData } from '../../api/messages';
import { fetchWorkspaceMembers } from '../../store/modules/workspaces';
import { useAppDispatch } from '../../hooks';

function timeAgo(iso: string) {
    const d = new Date(iso);
    const now = new Date();
    if (d.toDateString() === now.toDateString()) return d.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' });
    const y = new Date(now); y.setDate(y.getDate() - 1);
    if (d.toDateString() === y.toDateString()) return 'Hôm qua';
    return d.toLocaleDateString('vi-VN', { day: 'numeric', month: 'short' });
}

function initials(name: string) {
    return name?.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2) || '?';
}

const COLORS = ['#0058be', '#7c5cfc', '#00b894', '#e84393', '#fdcb6e', '#e74c3c', '#00cec9', '#6c5ce7'];
function colorFor(id: number) { return COLORS[id % COLORS.length]; }

export default function InboxPage() {
    const dispatch = useAppDispatch();
    const currentWsId = useAppSelector(s => s.workspaces.currentWorkspaceId);
    const wsMembers = useAppSelector(s => s.workspaces.listWorkspaceMembers);
    const currentUser = useAppSelector(s => s.auth.signIn?.user);
    const spaces = useAppSelector(s => s.spaces.listSpaces);

    const [convos, setConvos] = useState<ConversationData[]>([]);
    const [activeId, setActiveId] = useState<number | null>(null);
    const [messages, setMessages] = useState<MessageData[]>([]);
    const [input, setInput] = useState('');
    const [driveFile, setDriveFile] = useState<{url: string, name: string, mimeType: string} | null>(null);
    const [openPicker] = useDrivePicker();

    // Modals
    const [showNewDM, setShowNewDM] = useState(false);
    const [showNewChannel, setShowNewChannel] = useState(false);
    const [channelName, setChannelName] = useState('');
    const [selectedMembers, setSelectedMembers] = useState<number[]>([]);

    const msgEndRef = useRef<HTMLDivElement>(null);
    const pollRef = useRef<ReturnType<typeof setInterval> | null>(null);

    // Load conversations
    const loadConvos = useCallback(async () => {
        if (!currentWsId) return;
        try {
            const data = await msgApi.getConversations(currentWsId);
            setConvos(data);
        } catch { /* ignore */ }
    }, [currentWsId]);

    useEffect(() => {
        loadConvos();
        if (currentWsId) dispatch(fetchWorkspaceMembers(currentWsId));
    }, [currentWsId, loadConvos, dispatch]);

    // Load messages for active conversation
    const loadMessages = useCallback(async () => {
        if (!activeId) return;
        try {
            const data = await msgApi.getMessages(activeId);
            setMessages(data);
        } catch { /* ignore */ }
    }, [activeId]);

    useEffect(() => {
        loadMessages();
        // Poll every 3s
        if (pollRef.current) clearInterval(pollRef.current);
        if (activeId) {
            pollRef.current = setInterval(loadMessages, 3000);
        }
        return () => { if (pollRef.current) clearInterval(pollRef.current); };
    }, [activeId, loadMessages]);

    // Auto-scroll
    useEffect(() => { msgEndRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [messages]);

    // Send message
    const handleSend = async () => {
        if ((!input.trim() && !driveFile) || !activeId) return;
        try {
            const msg = await msgApi.sendMessage(activeId, input.trim(), driveFile);
            setMessages(prev => [...prev, msg]);
            setInput('');
            setDriveFile(null);
            loadConvos(); // refresh sidebar last_message
        } catch { message.error('Gửi thất bại'); }
    };

    // Google Drive Picker
    const handleOpenDrive = () => {
        openPicker({
            clientId: import.meta.env.VITE_GOOGLE_CLIENT_ID,
            developerKey: import.meta.env.VITE_GOOGLE_API_KEY,
            viewId: 'DOCS',
            showUploadView: true,
            showUploadFolders: true,
            supportDrives: true,
            multiselect: false,
            callbackFunction: (data) => {
                if (data.action === 'picked' && data.docs.length > 0) {
                    const doc = data.docs[0];
                    setDriveFile({
                        url: doc.url,
                        name: doc.name,
                        mimeType: doc.mimeType
                    });
                }
            },
        });
    };

    // Start DM
    const handleStartDM = async (targetId: number) => {
        if (!currentWsId) return;
        try {
            const { conversation_id } = await msgApi.startDirect(currentWsId, targetId);
            setShowNewDM(false);
            await loadConvos();
            setActiveId(conversation_id);
        } catch { message.error('Không thể tạo cuộc trò chuyện'); }
    };

    // Create channel
    const handleCreateChannel = async () => {
        if (!currentWsId || !channelName.trim()) return;
        try {
            await msgApi.createChannel(currentWsId, channelName.trim(), selectedMembers);
            setShowNewChannel(false);
            setChannelName('');
            setSelectedMembers([]);
            await loadConvos();
            message.success('Đã tạo kênh');
        } catch { message.error('Không thể tạo kênh'); }
    };

    // Helpers
    const activeConvo = convos.find(c => c.conversation_id === activeId);
    const channels = convos.filter(c => c.type === 'CHANNEL');
    const directs = convos.filter(c => c.type === 'DIRECT');
    const spaceChats = convos.filter(c => c.type === 'SPACE');

    function convoName(c: ConversationData): string {
        if (c.type === 'CHANNEL' || c.type === 'SPACE') return c.name || 'Chat';
        const other = c.members?.find(m => m.user_id !== currentUser?.user_id);
        return other?.name || 'Direct Message';
    }

    return (
        <div className="flex h-full overflow-hidden bg-white font-['Plus_Jakarta_Sans',sans-serif]">
            {/* ═══ Sidebar ═══ */}
            <div className="flex w-64 shrink-0 flex-col border-r border-[#eef0f5] bg-[#fafbfc]">
                <div className="flex items-center justify-between border-b border-[#eef0f5] px-4 py-4">
                    <h2 className="m-0 text-xl font-black text-[#141b2b]">Chat</h2>
                </div>
                <div className="flex-1 overflow-y-auto px-2 py-3">
                    {/* Space Chats */}
                    {spaceChats.length > 0 && (
                        <>
                            <div className="mb-1 flex items-center justify-between px-3 text-[11px] font-extrabold tracking-widest text-[#9aa0a6]">SPACES</div>
                            {spaceChats.map(c => (
                                <button key={c.conversation_id} onClick={() => setActiveId(c.conversation_id)}
                                    className={`flex w-full cursor-pointer items-center gap-2.5 rounded-lg border-none px-3 py-2 text-[13px] font-bold transition-all ${activeId === c.conversation_id ? 'bg-[#f0f4ff] text-[#0058be]' : 'bg-transparent text-[#5f6368] hover:bg-[#f0f4ff]'}`}>
                                    <Hash size={15} className={activeId === c.conversation_id ? 'text-[#0058be]' : 'text-[#b0b5c1]'} />
                                    <span className="truncate">{c.name}</span>
                                </button>
                            ))}
                        </>
                    )}

                    {/* Channels */}
                    <div className="mb-1 mt-4 flex items-center justify-between px-3 text-[11px] font-extrabold tracking-widest text-[#9aa0a6]">
                        <span>CHANNELS</span>
                        <Plus size={14} className="cursor-pointer hover:text-[#0058be]" onClick={() => setShowNewChannel(true)} />
                    </div>
                    {channels.length === 0 && <div className="px-3 py-2 text-[12px] text-[#b0b5c1]">Chưa có kênh</div>}
                    {channels.map(c => (
                        <button key={c.conversation_id} onClick={() => setActiveId(c.conversation_id)}
                            className={`flex w-full cursor-pointer items-center gap-2.5 rounded-lg border-none px-3 py-2 text-[13px] font-bold transition-all ${activeId === c.conversation_id ? 'bg-[#f0f4ff] text-[#0058be]' : 'bg-transparent text-[#5f6368] hover:bg-[#f0f4ff]'}`}>
                            <Hash size={15} className={activeId === c.conversation_id ? 'text-[#0058be]' : 'text-[#b0b5c1]'} />
                            <span className="truncate">{c.name}</span>
                            {(c.message_count || 0) > 0 && <span className="ml-auto text-[10px] text-[#9aa0a6]">{c.message_count}</span>}
                        </button>
                    ))}

                    {/* Direct Messages */}
                    <div className="mb-1 mt-4 flex items-center justify-between px-3 text-[11px] font-extrabold tracking-widest text-[#9aa0a6]">
                        <span>DIRECT MESSAGES</span>
                        <Plus size={14} className="cursor-pointer hover:text-[#0058be]" onClick={() => setShowNewDM(true)} />
                    </div>
                    {directs.length === 0 && <div className="px-3 py-2 text-[12px] text-[#b0b5c1]">Chưa có tin nhắn</div>}
                    {directs.map(c => {
                        const other = c.members?.find(m => m.user_id !== currentUser?.user_id);
                        const name = other?.name || 'User';
                        return (
                            <button key={c.conversation_id} onClick={() => setActiveId(c.conversation_id)}
                                className={`flex w-full cursor-pointer items-center gap-2.5 rounded-lg border-none px-3 py-1.5 text-[13px] font-bold transition-all ${activeId === c.conversation_id ? 'bg-[#f0f4ff] text-[#0058be]' : 'bg-transparent text-[#5f6368] hover:bg-[#f0f4ff]'}`}>
                                <div className="flex h-6 w-6 items-center justify-center rounded-full text-[10px] font-bold text-white" style={{ backgroundColor: colorFor(other?.user_id || 0) }}>
                                    {initials(name)}
                                </div>
                                <span className="truncate flex-1">{name}</span>
                                {c.last_message && <span className="text-[10px] text-[#b0b5c1]">{timeAgo(c.last_message.created_at)}</span>}
                            </button>
                        );
                    })}

                    {/* Init space chats */}
                    {spaces && spaces.length > 0 && spaceChats.length === 0 && currentWsId && (
                        <button className="mt-4 flex w-full cursor-pointer items-center gap-2 rounded-lg border border-dashed border-[#d0d4d9] bg-transparent px-3 py-2 text-[12px] font-semibold text-[#9aa0a6] hover:border-[#0058be] hover:text-[#0058be]"
                            onClick={async () => {
                                for (const sp of spaces as any[]) {
                                    await msgApi.getOrCreateSpaceChat(currentWsId, sp.space_id, sp.name);
                                }
                                loadConvos();
                            }}>
                            <Hash size={14} /> Tạo chat cho Spaces
                        </button>
                    )}
                </div>
            </div>

            {/* ═══ Main Chat ═══ */}
            <div className="flex min-w-0 flex-1 flex-col bg-white">
                {!activeConvo ? (
                    <div className="flex flex-1 items-center justify-center">
                        <div className="text-center">
                            <MessageSquare size={48} className="mx-auto mb-3 text-[#d0d4d9]" />
                            <p className="text-[15px] font-bold text-[#5f6368]">Chọn cuộc trò chuyện</p>
                            <p className="mt-1 text-[13px] text-[#9aa0a6]">Chọn từ sidebar hoặc tạo mới</p>
                        </div>
                    </div>
                ) : (
                    <>
                        {/* Header */}
                        <div className="flex h-14 shrink-0 items-center justify-between border-b border-[#eef0f5] px-6">
                            <div className="flex items-center gap-3">
                                {activeConvo.type === 'DIRECT' ? (
                                    <div className="flex h-8 w-8 items-center justify-center rounded-full text-[11px] font-bold text-white" style={{ backgroundColor: colorFor(activeConvo.conversation_id) }}>
                                        {initials(convoName(activeConvo))}
                                    </div>
                                ) : (
                                    <div className="flex h-8 w-8 items-center justify-center rounded bg-[#f0f4ff]"><Hash size={18} className="text-[#0058be]" /></div>
                                )}
                                <div>
                                    <h3 className="m-0 text-[15px] font-extrabold text-[#141b2b]">{activeConvo.type === 'DIRECT' ? convoName(activeConvo) : `# ${activeConvo.name}`}</h3>
                                    <div className="text-[11px] font-semibold text-[#9aa0a6]">{activeConvo.members?.length || 0} thành viên</div>
                                </div>
                            </div>
                            <div className="flex items-center gap-1">
                                <div className="flex -space-x-1.5">
                                    {activeConvo.members?.slice(0, 4).map(m => (
                                        <div key={m.user_id} className="flex h-6 w-6 items-center justify-center rounded-full border-2 border-white text-[9px] font-bold text-white" style={{ backgroundColor: colorFor(m.user_id) }}>
                                            {initials(m.name)}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Messages */}
                        <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4">
                            {messages.length === 0 && (
                                <div className="flex items-center justify-center py-20 text-[13px] text-[#9aa0a6]">Chưa có tin nhắn. Hãy gửi tin nhắn đầu tiên!</div>
                            )}
                            {messages.map((msg, i) => {
                                const showAvatar = i === 0 || messages[i - 1].sender_id !== msg.sender_id;
                                return (
                                    <div key={msg.message_id} className={`group flex gap-3 ${showAvatar ? 'mt-3' : 'mt-0.5'}`}>
                                        {showAvatar ? (
                                            <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-[11px] font-bold text-white" style={{ backgroundColor: colorFor(msg.sender_id) }}>
                                                {initials(msg.sender_name)}
                                            </div>
                                        ) : <div className="w-8" />}
                                        <div className="min-w-0 flex-1">
                                            {showAvatar && (
                                                <div className="mb-0.5 flex items-baseline gap-2">
                                                    <span className="text-[13px] font-bold text-[#141b2b]">{msg.sender_name}</span>
                                                    <span className="text-[11px] font-semibold text-[#9aa0a6]">{timeAgo(msg.created_at)}</span>
                                                </div>
                                            )}
                                            {msg.content && <div className="text-[14px] font-medium leading-relaxed text-[#3a3f47] whitespace-pre-wrap">{msg.content}</div>}
                                            {msg.file_url && (
                                                <div className="mt-2">
                                                    {(() => {
                                                        const isExternal = msg.file_url.startsWith('http');
                                                        const fileUrl = isExternal ? msg.file_url : `http://localhost:5001${msg.file_url}`;
                                                        const isImage = msg.file_type?.startsWith('image/') && !isExternal; // Drive files are usually documents even if image
                                                        
                                                        return isImage ? (
                                                            <a href={fileUrl} target="_blank" rel="noreferrer">
                                                                <img src={fileUrl} alt={msg.file_name || 'image'} className="max-w-[300px] max-h-[250px] object-cover rounded-lg border border-[#eef0f5]" />
                                                            </a>
                                                        ) : (
                                                            <a href={fileUrl} target="_blank" rel="noreferrer" className="flex items-center gap-2 w-max rounded-lg border border-[#eef0f5] bg-[#fafbfc] px-3 py-2 text-[#0058be] hover:bg-[#f0f4ff] no-underline">
                                                                {isExternal ? <Cloud size={18} /> : <FileText size={18} />}
                                                                <span className="text-[13px] font-semibold max-w-[200px] truncate">{msg.file_name}</span>
                                                            </a>
                                                        );
                                                    })()}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                );
                            })}
                            <div ref={msgEndRef} />
                        </div>

                        {/* Composer */}
                        <div className="px-6 pb-5 pt-2">
                            <div className="rounded-xl border border-[#dcdfe4] bg-white shadow-sm transition-all focus-within:border-[#0058be] focus-within:shadow-md">
                                <textarea
                                    value={input}
                                    onChange={e => setInput(e.target.value)}
                                    onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend(); } }}
                                    placeholder={`Nhắn tin ${activeConvo.type === 'DIRECT' ? convoName(activeConvo) : '#' + activeConvo.name}...`}
                                    className="w-full resize-none bg-transparent px-4 py-3 text-[14px] font-medium text-[#141b2b] outline-none min-h-[44px]"
                                    rows={1}
                                />
                                <div className="flex items-center justify-between rounded-b-xl bg-[#fafbfc] px-3 py-2 border-t border-[#eef0f5]">
                                    <div className="flex items-center gap-2">
                                        <button 
                                            className="cursor-pointer border-none bg-transparent p-1.5 text-[#5f6368] hover:bg-[#e2e6f0] hover:text-[#0058be] rounded-md transition-colors"
                                            onClick={handleOpenDrive}
                                            title="Đính kèm từ Google Drive"
                                        >
                                            <Cloud size={18} />
                                        </button>

                                        {driveFile && (
                                            <div className="flex items-center gap-1.5 px-3 py-1 bg-[#f0f4ff] rounded-full text-[12px] font-semibold text-[#0058be] border border-[#d8e2ff]">
                                                <Cloud size={12} />
                                                <span className="max-w-[150px] truncate">{driveFile.name}</span>
                                                <X size={14} className="cursor-pointer hover:text-red-500" onClick={() => setDriveFile(null)} />
                                            </div>
                                        )}
                                    </div>
                                    <button onClick={handleSend}
                                        className={`flex cursor-pointer items-center gap-1.5 rounded-lg border-none px-4 py-1.5 text-[13px] font-bold transition-all ${(input.trim() || driveFile) ? 'bg-[#0058be] text-white hover:bg-[#004aa0]' : 'bg-[#e2e6f0] text-[#9aa0a6] pointer-events-none'}`}>
                                        Gửi <Send size={14} />
                                    </button>
                                </div>
                            </div>
                        </div>
                    </>
                )}
            </div>

            {/* ═══ Modal: New DM ═══ */}
            {showNewDM && (
                <div className="fixed inset-0 z-[2000] flex items-center justify-center bg-black/30" onClick={() => setShowNewDM(false)}>
                    <div className="w-96 rounded-xl bg-white p-5 shadow-2xl" onClick={e => e.stopPropagation()}>
                        <div className="mb-4 flex items-center justify-between">
                            <h3 className="m-0 text-[15px] font-bold text-[#141b2b]">Tin nhắn mới</h3>
                            <button className="cursor-pointer border-none bg-transparent text-[#9aa0a6] hover:text-[#141b2b]" onClick={() => setShowNewDM(false)}><X size={18} /></button>
                        </div>
                        <p className="mb-3 text-[13px] text-[#5f6368]">Chọn thành viên để nhắn tin:</p>
                        <div className="max-h-60 overflow-y-auto space-y-1">
                            {(wsMembers || []).filter(m => m.user_id !== currentUser?.user_id).map(m => (
                                <button key={m.user_id} onClick={() => handleStartDM(m.user_id)}
                                    className="flex w-full cursor-pointer items-center gap-3 rounded-lg border-none bg-transparent px-3 py-2.5 text-left transition-colors hover:bg-[#f0f4ff]">
                                    <div className="flex h-8 w-8 items-center justify-center rounded-full text-[11px] font-bold text-white" style={{ backgroundColor: colorFor(m.user_id) }}>
                                        {initials(m.name)}
                                    </div>
                                    <div>
                                        <div className="text-[13px] font-semibold text-[#141b2b]">{m.name}</div>
                                        <div className="text-[11px] text-[#9aa0a6]">{m.email}</div>
                                    </div>
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            )}

            {/* ═══ Modal: New Channel ═══ */}
            {showNewChannel && (
                <div className="fixed inset-0 z-[2000] flex items-center justify-center bg-black/30" onClick={() => setShowNewChannel(false)}>
                    <div className="w-[420px] rounded-xl bg-white p-5 shadow-2xl" onClick={e => e.stopPropagation()}>
                        <div className="mb-4 flex items-center justify-between">
                            <h3 className="m-0 text-[15px] font-bold text-[#141b2b]">Tạo kênh mới</h3>
                            <button className="cursor-pointer border-none bg-transparent text-[#9aa0a6] hover:text-[#141b2b]" onClick={() => setShowNewChannel(false)}><X size={18} /></button>
                        </div>
                        <input value={channelName} onChange={e => setChannelName(e.target.value)}
                            placeholder="Tên kênh..." className="mb-3 w-full rounded-lg border border-[#eef0f5] px-3 py-2.5 text-[13px] outline-none focus:border-[#0058be]" />
                        <p className="mb-2 text-[12px] font-bold text-[#9aa0a6]">Thêm thành viên:</p>
                        <div className="max-h-48 overflow-y-auto space-y-1 mb-4">
                            {(wsMembers || []).filter(m => m.user_id !== currentUser?.user_id).map(m => (
                                <label key={m.user_id} className="flex cursor-pointer items-center gap-3 rounded-lg px-3 py-2 hover:bg-[#f0f4ff]">
                                    <input type="checkbox" checked={selectedMembers.includes(m.user_id)}
                                        onChange={() => setSelectedMembers(prev => prev.includes(m.user_id) ? prev.filter(id => id !== m.user_id) : [...prev, m.user_id])}
                                        className="h-4 w-4 accent-[#0058be]" />
                                    <div className="flex h-7 w-7 items-center justify-center rounded-full text-[10px] font-bold text-white" style={{ backgroundColor: colorFor(m.user_id) }}>
                                        {initials(m.name)}
                                    </div>
                                    <span className="text-[13px] font-semibold text-[#141b2b]">{m.name}</span>
                                </label>
                            ))}
                        </div>
                        <button onClick={handleCreateChannel} disabled={!channelName.trim()}
                            className="w-full cursor-pointer rounded-lg border-none bg-[#0058be] py-2.5 text-[13px] font-bold text-white transition-colors hover:bg-[#004aa0] disabled:cursor-not-allowed disabled:bg-[#d0d4d9]">
                            Tạo kênh
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
