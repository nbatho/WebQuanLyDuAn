import { useState, useRef, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { beApi } from '../../api/callApi';
import { 
    Sparkles, 
    Plus, 
    Globe, 
    ArrowRight, 
    Copy, 
    CheckSquare, 
    FileText,
    MessageSquarePlus,
    History,
    Blocks,
    UserCircle,
    Users2,
    Edit,
    Search,
    Sun,
    Bell,
    Lightbulb,
    PanelLeftClose,
    PanelLeftOpen,
    MoreHorizontal,
    Trash2
} from 'lucide-react';

export interface AIChatMessage {
    id: string;
    role: 'user' | 'ai';
    content: string;
    isStreaming?: boolean;
    isSearching?: boolean;
    followUps?: string[];
}

interface ChatSession {
    id: string;
    title: string;
    messages: AIChatMessage[];
    timestamp: number;
}

export default function AIPage() {
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    
    // Quản lý nhiều phiên chat
    const [sessions, setSessions] = useState<ChatSession[]>(() => {
        const saved = localStorage.getItem('flowise_ai_sessions');
        if (saved) return JSON.parse(saved);
        
        // Mặc định tạo 1 session nếu chưa có gì
        return [{
            id: 'default',
            title: 'Cuộc trò chuyện mới',
            messages: [],
            timestamp: Date.now()
        }];
    });

    const [activeSessionId, setActiveSessionId] = useState<string>(() => {
        const lastActive = localStorage.getItem('flowise_ai_active_session');
        const savedSessions = localStorage.getItem('flowise_ai_sessions');
        const parsedSessions = savedSessions ? JSON.parse(savedSessions) : [];
        
        if (parsedSessions.length > 0) {
            const sessionExists = parsedSessions.some((s: any) => s.id === lastActive);
            return sessionExists ? lastActive! : parsedSessions[0].id;
        }
        return 'default';
    });

    const [inputValue, setInputValue] = useState('');
    const [isGenerating, setIsGenerating] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    // Session hiện tại đang được chọn
    const activeSession = sessions.find(s => s.id === activeSessionId) || sessions[0];
    const messages = activeSession?.messages || [];

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    // Đồng bộ session vào localStorage
    useEffect(() => {
        localStorage.setItem('flowise_ai_sessions', JSON.stringify(sessions));
        localStorage.setItem('flowise_ai_active_session', activeSessionId);
    }, [sessions, activeSessionId]);

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const handleNewChat = () => {
        const newId = Date.now().toString();
        const newSession: ChatSession = {
            id: newId,
            title: 'Cuộc trò chuyện mới',
            messages: [],
            timestamp: Date.now()
        };
        setSessions([newSession, ...sessions]);
        setActiveSessionId(newId);
    };

    const handleDeleteSession = (sessionId: string, e: React.MouseEvent) => {
        e.stopPropagation();
        const updatedSessions = sessions.filter(s => s.id !== sessionId);
        
        if (updatedSessions.length === 0) {
            const newId = Date.now().toString();
            const newSession = { id: newId, title: 'Cuộc trò chuyện mới', messages: [], timestamp: Date.now() };
            setSessions([newSession]);
            setActiveSessionId(newId);
        } else {
            setSessions(updatedSessions);
            if (activeSessionId === sessionId) {
                setActiveSessionId(updatedSessions[0].id);
            }
        }
    };

    const handleSendMessage = async (forceText?: string) => {
        const text = forceText || inputValue.trim();
        if (!text || isGenerating) return;

        const userMessage: AIChatMessage = { id: Date.now().toString(), role: 'user', content: text };
        
        // Cập nhật tin nhắn và đổi tên tiêu đề nếu là tin nhắn đầu tiên
        setSessions(prev => prev.map(s => {
            if (s.id === activeSessionId) {
                const newTitle = s.messages.length === 0 
                    ? (text.length > 25 ? text.substring(0, 25) + '...' : text)
                    : s.title;
                return { ...s, title: newTitle, messages: [...s.messages, userMessage] };
            }
            return s;
        }));

        setInputValue('');
        setIsGenerating(true);

        const aiMessageId = (Date.now() + 1).toString();
        
        // Thêm tin nhắn AI với trạng thái Searching
        setSessions(prev => prev.map(s => 
            s.id === activeSessionId 
                ? { ...s, messages: [...s.messages, { id: aiMessageId, role: 'ai', content: '', isSearching: true, isStreaming: true }] } 
                : s
        ));

        try {
            const chatHistory = messages.slice(-5).map(msg => ({
                role: msg.role === 'user' ? 'user' : 'assistant',
                content: msg.content
            }));

            const response: any = await beApi.post('ai/chat', { 
                message: text,
                history: chatHistory
            });

            const fullResponse = response.response;
            const words = fullResponse.split(' ');
            let currentText = '';

            // Tắt Searching
            setSessions(prev => prev.map(s => 
                s.id === activeSessionId 
                    ? { ...s, messages: s.messages.map(m => m.id === aiMessageId ? { ...m, isSearching: false, isStreaming: true } : m) } 
                    : s
            ));

            for (let i = 0; i < words.length; i++) {
                await new Promise(r => setTimeout(r, 30));
                currentText += words[i] + ' ';
                setSessions(prev => prev.map(s => 
                    s.id === activeSessionId 
                        ? { ...s, messages: s.messages.map(m => m.id === aiMessageId ? { ...m, content: currentText } : m) } 
                        : s
                ));
            }

            setSessions(prev => prev.map(s => 
                s.id === activeSessionId 
                    ? { ...s, 
                        title: response.suggestedTitle || s.title, // Cập nhật tiêu đề từ AI
                        messages: s.messages.map(m => m.id === aiMessageId ? { 
                            ...m, 
                            content: fullResponse, 
                            isStreaming: false,
                            followUps: response.suggestions || []
                        } : m) } 
                    : s
            ));

        } catch (error: any) {
            setSessions(prev => prev.map(s => 
                s.id === activeSessionId 
                    ? { ...s, messages: s.messages.map(m => m.id === aiMessageId ? { 
                        ...m, 
                        content: "Rất tiếc, AI đang gặp lỗi kết nối. Vui lòng thử lại sau.", 
                        isSearching: false,
                        isStreaming: false 
                    } : m) } 
                    : s
            ));
        } finally {
            setIsGenerating(false);
        }
    };

    return (
        <div className="relative flex h-screen w-full bg-[#f6f7f9] font-['Plus_Jakarta_Sans',sans-serif]">
            
            {/* AI Secondary Sidebar */}
            <div 
                className={`flex shrink-0 flex-col bg-[#fafbfc] transition-all duration-300 ease-in-out z-30 ${
                    isSidebarOpen ? 'w-60 border-r border-[#eef0f5] opacity-100' : 'w-0 border-none opacity-0 overflow-hidden'
                }`}
            >
                <div className="flex h-12 w-60 items-center justify-between px-4 pb-2 pt-4">
                    <span className="text-[14px] font-extrabold text-[#141b2b]">AI</span>
                    <div className="flex items-center gap-1.5">
                        <button 
                            className="flex h-6 w-6 items-center justify-center rounded text-[#9aa0a6] hover:bg-[#eef0f5] hover:text-[#5f6368] transition-colors"
                            onClick={() => setIsSidebarOpen(false)}
                            title="Close sidebar"
                        >
                            <PanelLeftClose size={14} />
                        </button>
                        <button className="flex h-6 w-6 items-center justify-center rounded border border-[#eef0f5] bg-white text-[#5f6368] hover:bg-[#f6f7f9]">
                            <Edit size={13} />
                        </button>
                    </div>
                </div>

                <div className="flex w-60 flex-col gap-0.5 px-2 mt-2">
                    <div className="flex cursor-pointer items-center gap-2.5 rounded-lg bg-[#f0f4ff] px-2.5 py-1.5 text-[13px] font-semibold text-[#0058be]">
                        <div className="flex items-center justify-center">
                            <Sparkles size={14} className="text-[#e84393]" />
                        </div>
                        <span>Ask or Create</span>
                    </div>
                </div>

                <div className="mt-6 flex w-60 flex-col px-2">
                    <div className="mb-1 px-2.5 text-[11px] font-extrabold text-[#9aa0a6] uppercase tracking-[0.05em]">
                        Super Agents
                    </div>
                    <div className="flex cursor-pointer items-center gap-2.5 rounded-lg px-2.5 py-1.5 text-[13px] font-semibold text-[#5f6368] hover:bg-[#eef0f5] transition-colors">
                        <Blocks size={14} className="text-[#3498db]" />
                        <span>Create Agent</span>
                    </div>
                    <div className="flex cursor-pointer items-center gap-2.5 rounded-lg px-2.5 py-1.5 text-[13px] font-semibold text-[#5f6368] hover:bg-[#eef0f5] transition-colors">
                        <Users2 size={14} className="text-[#e67e22]" />
                        <span>All Agents</span>
                    </div>
                    <div className="flex cursor-pointer items-center gap-2.5 rounded-lg px-2.5 py-1.5 text-[13px] font-semibold text-[#5f6368] hover:bg-[#eef0f5] transition-colors">
                        <UserCircle size={14} className="text-[#2c3e50]" />
                        <span>My Agents</span>
                    </div>
                    <div className="flex cursor-pointer items-center gap-2.5 rounded-lg px-2.5 py-1.5 text-[13px] font-semibold text-[#5f6368] hover:bg-[#eef0f5] transition-colors">
                        <History size={14} className="text-[#95a5a6]" />
                        <span>Activity</span>
                    </div>
                </div>

                <div className="mt-6 flex flex-1 flex-col px-2 overflow-y-auto scrollbar-thin">
                    <div className="mb-1 px-2.5 text-[11px] font-extrabold text-[#9aa0a6] uppercase tracking-[0.05em]">
                        Recent Chats
                    </div>
                    <button 
                        onClick={handleNewChat}
                        className="mb-2 flex cursor-pointer items-center gap-2.5 rounded-lg border border-dashed border-[#d0d4d9] px-2.5 py-1.5 text-[13px] font-semibold text-[#5f6368] hover:bg-[#eef0f5] hover:border-[#7c5cfc] hover:text-[#7c5cfc] transition-all"
                    >
                        <Plus size={14} />
                        <span>New Conversation</span>
                    </button>

                    <div className="flex flex-col gap-0.5">
                        {sessions
                            .filter(session => session.messages.length > 0) // Chỉ hiện session đã có tin nhắn
                            .map((session) => (
                                <div 
                                    key={session.id}
                                    onClick={() => setActiveSessionId(session.id)}
                                    className={`group relative flex items-center justify-between rounded-lg px-2.5 py-1.5 transition-all cursor-pointer ${
                                        activeSessionId === session.id 
                                        ? 'bg-[#eef0f5] text-[#141b2b]' 
                                        : 'text-[#5f6368] hover:bg-[#eef0f5] hover:text-[#141b2b]'
                                    }`}
                                >
                                <div className="flex items-center gap-2 overflow-hidden">
                                    <History size={14} className="shrink-0 opacity-70" />
                                    <span className="truncate text-[13px] font-semibold leading-tight">{session.title}</span>
                                </div>
                                
                                <button 
                                    onClick={(e) => handleDeleteSession(session.id, e)}
                                    className={`flex h-6 w-6 items-center justify-center rounded text-[#9aa0a6] hover:bg-red-50 hover:text-red-500 transition-all ${
                                        activeSessionId === session.id ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'
                                    }`}
                                    title="Delete chat"
                                >
                                    <Trash2 size={13} />
                                </button>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Main Area */}
            <div className="relative flex flex-1 w-full flex-col bg-white overflow-hidden items-center group/main">
                
                {/* Floating Open Sidebar Button (visible when sidebar is closed) */}
                {!isSidebarOpen && (
                    <button 
                        className="absolute left-4 top-4 z-50 flex h-7 w-7 items-center justify-center rounded-md bg-white border border-[#eef0f5] text-[#5f6368] opacity-60 shadow-sm transition-all hover:bg-[#f6f7f9] hover:opacity-100"
                        onClick={() => setIsSidebarOpen(true)}
                        title="Open sidebar"
                    >
                        <PanelLeftOpen size={14} />
                    </button>
                )}
                
                {messages.length === 0 ? (
                    // ==========================================
                    // EMPTY STATE (CENTERED HUB UI)
                    // ==========================================
                    <div className="flex h-full w-full flex-col items-center justify-center relative">
                        {/* Top Gradient Blur matching ClickUp Brain */}
                        <div className="absolute top-0 left-0 right-0 h-64 bg-linear-to-b from-[#e84393]/8 via-[#7c5cfc]/8 to-transparent pointer-events-none blur-3xl opacity-60" />

                        <div className="z-10 flex w-full max-w-3xl flex-col items-center px-6">
                            {/* Giant Brain Logo */}
                            <div className="flex items-center justify-center gap-3 mb-10 w-full animate-in fade-in zoom-in duration-500">
                                <Sparkles size={40} className="text-[#e84393]" fill="#e84393" strokeWidth={1} />
                                <span className="text-[40px] font-bold text-[#141b2b] tracking-tight">FlowiseAI<sup className="text-lg text-[#9aa0a6] font-medium ml-1">™</sup></span>
                            </div>

                            {/* Centered Composer */}
                            <div className="relative w-full rounded-3xl p-0.5 bg-linear-to-r from-[#e3e8f8] via-[#fdecf5] to-[#f0ebff] shadow-[0_8px_30px_rgb(0,0,0,0.06)]">
                                {/* floating tabs */}
                                <div className="absolute -top-7.5 left-6 flex">
                                    <div className="flex h-8 items-center gap-1.5 rounded-t-xl bg-white px-4 text-[13px] font-bold text-[#0058be] shadow-[0_-2px_10px_rgb(0,0,0,0.02)]">
                                        <Sparkles size={12} className="text-[#e84393]" fill="#e84393" /> Ask
                                    </div>
                                    <div className="flex h-8 items-center gap-1.5 rounded-t-xl px-4 text-[13px] font-semibold text-[#9aa0a6] hover:text-[#5f6368] cursor-pointer">
                                        <Blocks size={12} /> Agents
                                    </div>
                                </div>

                                <div className="flex flex-col rounded-[22px] bg-white pt-4 pb-2 px-3">
                                    <textarea
                                        value={inputValue}
                                        onChange={(e) => setInputValue(e.target.value)}
                                        onKeyDown={(e) => {
                                            if (e.key === 'Enter' && !e.shiftKey) {
                                                e.preventDefault();
                                                handleSendMessage();
                                            }
                                        }}
                                        placeholder="Get instant answers, insights, and ideas."
                                        autoFocus
                                        className="min-h-17.5 max-h-50 w-full resize-none border-none bg-transparent px-3 py-1 text-[15px] font-medium text-[#141b2b] outline-none placeholder:text-[#b0b5c1] scrollbar-hide"
                                    />
                                    
                                    <div className="mt-3 flex items-center justify-between">
                                        {/* Left Side Tools */}
                                        <div className="flex items-center gap-2">
                                            <button className="flex h-7 w-7 items-center justify-center rounded bg-[#f6f7f9] text-[#5f6368] transition-colors hover:bg-[#eef0f5]">
                                                <Plus size={14} />
                                            </button>
                                            <div className="flex cursor-pointer items-center gap-1.5 px-2 rounded hover:bg-[#f6f7f9] py-1 transition-colors">
                                                <Sparkles size={14} className="text-[#e84393]" fill="#e84393" strokeWidth={1} />
                                                <span className="text-[13px] font-bold text-[#5f6368]">FlowiseAI</span>
                                                <ArrowRight size={10} className="rotate-90 ml-0.5 text-[#9aa0a6]" />
                                            </div>
                                        </div>

                                        {/* Right Side Tools */}
                                        <div className="flex items-center gap-2">
                                            <button className="flex items-center gap-1.5 px-2 py-1.5 rounded text-[#9aa0a6] hover:text-[#5f6368] transition-colors">
                                                <Globe size={14} />
                                            </button>
                                            
                                            <button 
                                                onClick={() => handleSendMessage()}
                                                disabled={!inputValue.trim() || isGenerating}
                                                className={`flex h-8 w-8 items-center justify-center rounded-full transition-all ${
                                                    inputValue.trim() 
                                                        ? 'bg-[#eef0f5] text-[#141b2b] hover:bg-[#dcdfe4]' 
                                                        : 'bg-[#f6f7f9] text-[#c2c9e0]'
                                                }`}
                                            >
                                                <ArrowRight size={14} strokeWidth={2.5} />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Action Cards under the Composer */}
                            <div className="mt-6 flex w-full gap-3 justify-center text-left">
                                <button className="flex flex-1 flex-col justify-start rounded-xl border border-[#eef0f5] bg-white p-3 shadow-sm hover:border-[#dcdfe4] hover:-translate-y-0.5 transition-all" onClick={() => handleSendMessage("Create Task")}>
                                    <Sun size={14} className="mb-2 text-[#5f6368]" />
                                    <span className="text-[12px] font-extrabold text-[#141b2b] mb-0.5">Create Task</span>
                                    <span className="text-[11px] font-medium text-[#9aa0a6]">Add new action item</span>
                                </button>
                                <button className="flex flex-1 flex-col justify-start rounded-xl border border-[#eef0f5] bg-white p-3 shadow-sm hover:border-[#dcdfe4] hover:-translate-y-0.5 transition-all" onClick={() => handleSendMessage("Set Reminder")}>
                                    <Bell size={14} className="mb-2 text-[#5f6368]" />
                                    <span className="text-[12px] font-extrabold text-[#141b2b] mb-0.5">Set Reminder</span>
                                    <span className="text-[11px] font-medium text-[#9aa0a6]">Remind about task</span>
                                </button>
                                <button className="flex flex-1 flex-col justify-start rounded-xl border border-[#eef0f5] bg-white p-3 shadow-sm hover:border-[#dcdfe4] hover:-translate-y-0.5 transition-all" onClick={() => handleSendMessage("Brainstorm Ideas")}>
                                    <Lightbulb size={14} className="mb-2 text-[#5f6368]" />
                                    <span className="text-[12px] font-extrabold text-[#141b2b] mb-0.5">Brainstorm Ideas</span>
                                    <span className="text-[11px] font-medium text-[#9aa0a6]">Generate new concepts</span>
                                </button>
                                <button className="flex flex-1 flex-col justify-start rounded-xl border border-[#eef0f5] bg-white p-3 shadow-sm hover:border-[#dcdfe4] hover:-translate-y-0.5 transition-all" onClick={() => handleSendMessage("Find Tasks")}>
                                    <Search size={14} className="mb-2 text-[#5f6368]" />
                                    <span className="text-[12px] font-extrabold text-[#141b2b] mb-0.5">Find Tasks</span>
                                    <span className="text-[11px] font-medium text-[#9aa0a6]">Search for overdue tasks</span>
                                </button>
                            </div>
                        </div>
                    </div>
                ) : (
                    // ==========================================
                    // ACTIVE CHAT STATE
                    // ==========================================
                    <>
                        {/* Glow Background Elements simulating ClickUp's soft atmospheric lighting */}
                        <div className="absolute top-0 left-0 right-0 h-64 bg-linear-to-b from-[#e84393]/3 via-[#7c5cfc]/3 to-transparent pointer-events-none" />

                        <div className="flex-1 w-full overflow-y-auto px-10 pb-40 pt-10 scrollbar-hide z-10 flex flex-col items-center">
                            <div className="w-full max-w-4xl flex flex-col gap-6">
                                {messages.map((message) => (
                                    <div 
                                        key={message.id} 
                                        className={`flex w-full ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                                    >
                                        {message.role === 'user' ? (
                                            <div className="max-w-[70%] rounded-2xl bg-[#eef0f5] px-4 py-2.5 text-[14px] font-medium text-[#141b2b]">
                                                {message.content}
                                            </div>
                                        ) : (
                                            <div className="flex w-full max-w-[85%] flex-col">
                                                <div className="mb-2 flex items-center gap-1.5">
                                                    <Sparkles size={16} className="text-[#e84393]" fill="#e84393" strokeWidth={1} />
                                                    <span className="text-[14px] font-bold text-[#141b2b]">FlowiseAI</span>
                                                </div>
                                                
                                                {message.isSearching ? (
                                                    <div className="flex items-center gap-2 rounded-lg bg-linear-to-r from-[#e3e8f8]/30 to-transparent py-2 px-3 animate-pulse w-max">
                                                        <Search size={14} className="text-[#7c5cfc] animate-spin-slow" />
                                                        <span className="text-[13px] font-semibold text-[#7c5cfc]">Flowise thinking...</span>
                                                    </div>
                                                ) : (
                                                    <div className="text-[14px] font-medium leading-[1.6] text-[#3a3f47] markdown-content overflow-hidden">
                                                        <ReactMarkdown remarkPlugins={[remarkGfm]}>
                                                            {message.content + (message.isStreaming ? ' █' : '')}
                                                        </ReactMarkdown>
                                                    </div>
                                                )}
                                                
                                                {!message.isStreaming && !message.isSearching && (
                                                    <div className="mt-3 flex items-center gap-1">
                                                        <button className="flex h-7 w-7 items-center justify-center rounded text-[#9aa0a6] hover:bg-[#eef0f5] hover:text-[#5f6368] transition-colors">
                                                            <Copy size={13} />
                                                        </button>
                                                        <button className="flex h-7 w-7 items-center justify-center rounded text-[#9aa0a6] hover:bg-[#eef0f5] hover:text-[#5f6368] transition-colors">
                                                            <CheckSquare size={13} />
                                                        </button>
                                                        <button className="flex h-7 w-7 items-center justify-center rounded text-[#9aa0a6] hover:bg-[#eef0f5] hover:text-[#5f6368] transition-colors">
                                                            <FileText size={13} />
                                                        </button>
                                                    </div>
                                                )}

                                                {/* Follow-ups Section */}
                                                {!message.isStreaming && !message.isSearching && message.followUps && message.followUps.length > 0 && (
                                                    <div className="mt-5 w-max">
                                                        <div className="flex flex-col gap-2">
                                                            {message.followUps.map((prompt, idx) => (
                                                                <button 
                                                                    key={idx}
                                                                    onClick={() => handleSendMessage(prompt)}
                                                                    className="flex items-center gap-1.5 rounded-full border border-[#eef0f5] bg-white px-3 py-1.5 text-left text-[13px] font-medium text-[#5f6368] shadow-[0_2px_4px_rgb(0,0,0,0.02)] transition-all hover:border-[#7c5cfc] hover:text-[#7c5cfc] hover:shadow-sm"
                                                                >
                                                                    <span className="text-[#b0b5c1]">↳</span> {prompt}
                                                                </button>
                                                            ))}
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                        )}
                                    </div>
                                ))}
                                <div ref={messagesEndRef} />
                            </div>
                        </div>

                        {/* Floating Input Composer at Bottom */}
                        <div className="absolute bottom-6 left-0 right-0 z-20 flex justify-center w-full px-8">
                            <div className="w-full max-w-4xl relative rounded-3xl p-0.5 bg-linear-to-r from-[#e3e8f8] via-[#fdecf5] to-[#f0ebff] shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
                                <div className="flex flex-col rounded-[22px] bg-white pt-2.5 pb-2 px-3">
                                    <textarea
                                        value={inputValue}
                                        onChange={(e) => setInputValue(e.target.value)}
                                        onKeyDown={(e) => {
                                            if (e.key === 'Enter' && !e.shiftKey) {
                                                e.preventDefault();
                                                handleSendMessage();
                                            }
                                        }}
                                        placeholder="Tell AI what to do next"
                                        className="min-h-11 max-h-50 w-full resize-none border-none bg-transparent px-2 py-1 text-[14px] font-medium text-[#141b2b] outline-none placeholder:text-[#b0b5c1] scrollbar-hide"
                                    />
                                    
                                    <div className="mt-2 flex items-center justify-between">
                                        <div className="flex items-center gap-2">
                                            <button className="flex h-7 w-7 items-center justify-center rounded bg-[#f6f7f9] text-[#5f6368] transition-colors hover:bg-[#eef0f5]">
                                                <Plus size={14} />
                                            </button>
                                            <div className="flex items-center gap-1.5 px-2">
                                                <Sparkles size={14} className="text-[#e84393]" fill="#e84393" strokeWidth={1} />
                                                <span className="text-[13px] font-bold text-[#5f6368]">FlowiseAI</span>
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-2">
                                            <button className="flex items-center gap-1.5 px-2 py-1.5 rounded hover:bg-[#f6f7f9] text-[#5f6368] transition-colors">
                                                <Globe size={13} />
                                                <span className="text-[12px] font-semibold">All sources</span>
                                                <ArrowRight size={10} className="rotate-90 ml-0.5" />
                                            </button>
                                            
                                            <button 
                                                onClick={() => handleSendMessage()}
                                                disabled={!inputValue.trim() || isGenerating}
                                                className={`flex h-7 w-7 items-center justify-center rounded-full transition-all ${
                                                    inputValue.trim() 
                                                        ? 'bg-[#eef0f5] text-[#141b2b] hover:bg-[#dcdfe4]' 
                                                        : 'bg-[#f6f7f9] text-[#c2c9e0]'
                                                }`}
                                            >
                                                <ArrowRight size={14} strokeWidth={2.5} />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}
