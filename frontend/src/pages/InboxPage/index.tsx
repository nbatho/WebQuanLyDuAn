import { useState } from 'react';
import { Search, Filter, AtSign, CornerUpLeft, Bell, Paperclip, Smile, Image, Download } from 'lucide-react';
import './inbox.css';

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
        <div className="ib-page">
            {/* ═══════ Filter Column ═══════ */}
            <div className="ib-filters">
                <h2 className="ib-filters-title">Inbox</h2>
                <div className="ib-filter-tabs">
                    {[
                        { id: 'all', label: 'All', count: 12 },
                        { id: 'unread', label: 'Unread', count: 4 },
                        { id: 'assigned', label: 'Assigned', count: null },
                    ].map((f) => (
                        <button
                            key={f.id}
                            className={`ib-filter-tab ${activeFilter === f.id ? 'ib-filter-tab--active' : ''}`}
                            onClick={() => setActiveFilter(f.id)}
                        >
                            <span>{f.label}</span>
                            {f.count && <span className="ib-filter-count">{f.count}</span>}
                        </button>
                    ))}
                </div>

                <div className="ib-filter-category-label">CATEGORIES</div>
                <div className="ib-filter-categories">
                    <button className="ib-cat-btn"><AtSign size={15} /><span>Mentions</span></button>
                    <button className="ib-cat-btn"><CornerUpLeft size={15} /><span>Replies</span></button>
                    <button className="ib-cat-btn"><Bell size={15} /><span>System Updates</span></button>
                </div>
            </div>

            {/* ═══════ Message List ═══════ */}
            <div className="ib-messages">
                <div className="ib-msg-topbar">
                    <div className="ib-msg-search">
                        <Search size={16} className="ib-msg-search-icon" />
                        <input type="text" placeholder="Search messages..." className="ib-msg-search-input" />
                    </div>
                    <Filter size={16} className="ib-msg-filter-icon" />
                </div>

                <div className="ib-msg-list">
                    {messages.map((msg) => (
                        <div key={msg.id}>
                            {msg.section && (
                                <div className="ib-msg-section-label">
                                    {msg.section.includes('NEEDS') && <span className="ib-msg-dot" />}
                                    {msg.section}
                                </div>
                            )}
                            <div
                                className={`ib-msg-row ${activeMsg === msg.id ? 'ib-msg-row--active' : ''}`}
                                onClick={() => setActiveMsg(msg.id)}
                            >
                                <div className="ib-msg-avatar" style={{ backgroundColor: msg.avatarBg }}>
                                    {msg.avatar.length > 2 ? msg.avatar : msg.avatar}
                                </div>
                                <div className="ib-msg-body">
                                    <div className="ib-msg-top-row">
                                        <span className="ib-msg-sender">{msg.sender}</span>
                                        <span className="ib-msg-time">{msg.time}</span>
                                    </div>
                                    <span className="ib-msg-subject">{msg.subject}</span>
                                    <span className="ib-msg-preview">
                                        {msg.priority && <span className="ib-msg-priority-dot" />}
                                        {msg.preview}
                                    </span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* ═══════ Conversation Detail ═══════ */}
            <div className="ib-detail">
                <div className="ib-detail-header">
                    <h2 className="ib-detail-title">Review Q4 Brand Guidelines</h2>
                    <div className="ib-detail-actions">
                        <span className="ib-detail-id">FLOW-829</span>
                        <button className="ib-detail-action-btn">📎</button>
                        <button className="ib-detail-action-btn">🗑</button>
                        <button className="ib-detail-action-btn">⋮</button>
                    </div>
                </div>

                <div className="ib-detail-messages">
                    {/* Message 1 */}
                    <div className="ib-chat-msg">
                        <img
                            src="https://ui-avatars.com/api/?name=Sarah+Jenkins&background=0058be&color=fff&size=36&bold=true"
                            alt="Sarah Jenkins"
                            className="ib-chat-avatar"
                        />
                        <div className="ib-chat-content">
                            <div className="ib-chat-meta">
                                <span className="ib-chat-name">Sarah Jenkins</span>
                                <span className="ib-chat-time">10:24 AM</span>
                            </div>
                            <div className="ib-chat-bubble">
                                <p>Hi team! I've just finalized the initial draft for the Q4 Brand Guidelines. We need to focus specifically on the "Reductive Geometry" section. @Marcus Chen, could you take a look at the color palette accessibility?</p>
                                <div className="ib-chat-file">
                                    <div className="ib-chat-file-icon">📄</div>
                                    <div className="ib-chat-file-info">
                                        <span className="ib-chat-file-name">Brand_Guidelines_V1.pdf</span>
                                        <span className="ib-chat-file-size">4.2 MB</span>
                                    </div>
                                    <Download size={16} className="ib-chat-file-dl" />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Message 2 */}
                    <div className="ib-chat-msg">
                        <img
                            src="https://ui-avatars.com/api/?name=Marcus+Chen&background=7c5cfc&color=fff&size=36&bold=true"
                            alt="Marcus Chen"
                            className="ib-chat-avatar"
                        />
                        <div className="ib-chat-content">
                            <div className="ib-chat-meta">
                                <span className="ib-chat-name">Marcus Chen</span>
                                <span className="ib-chat-time">11:05 AM</span>
                            </div>
                            <div className="ib-chat-bubble">
                                <p>On it, Sarah. The geometric shapes look great. Checking the contrast ratios for the primary blue (#0058be) against the container backgrounds now.</p>
                            </div>
                        </div>
                    </div>

                    {/* Linked Task */}
                    <div className="ib-linked-task">
                        <div className="ib-lt-header">
                            <span className="ib-lt-label">LINKED TASK</span>
                            <span className="ib-lt-status">In Review</span>
                            <span className="ib-lt-pct">65% Complete</span>
                            <span className="ib-lt-stakeholders-label">STAKEHOLDERS</span>
                        </div>
                        <div className="ib-lt-body">
                            <span className="ib-lt-name">Finalize Styleguide</span>
                            <div className="ib-lt-avatars">
                                <img src="https://ui-avatars.com/api/?name=S+J&background=0058be&color=fff&size=24&bold=true" alt="" className="ib-lt-av" />
                                <img src="https://ui-avatars.com/api/?name=M+C&background=7c5cfc&color=fff&size=24&bold=true" alt="" className="ib-lt-av" />
                                <span className="ib-lt-more">+4</span>
                            </div>
                        </div>
                        <div className="ib-lt-bar-bg">
                            <div className="ib-lt-bar-fill" style={{ width: '65%' }} />
                        </div>
                    </div>
                </div>

                {/* Reply Box */}
                <div className="ib-reply">
                    <input type="text" placeholder="Write a reply..." className="ib-reply-input" />
                    <div className="ib-reply-actions">
                        <div className="ib-reply-tools">
                            <Paperclip size={16} className="ib-reply-tool" />
                            <Smile size={16} className="ib-reply-tool" />
                            <Image size={16} className="ib-reply-tool" />
                        </div>
                        <button className="ib-reply-btn">Reply</button>
                    </div>
                </div>
            </div>
        </div>
    );
}
