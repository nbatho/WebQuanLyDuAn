import { useState } from 'react';
import {
    Settings, User, Bell, Shield, Palette, Globe,
    ChevronRight, Camera, Check, Moon, Sun, Monitor
} from 'lucide-react';
import { Avatar } from 'antd';
import './settings.css';

type SettingsTab = 'profile' | 'notifications' | 'theme' | 'security' | 'workspace';

export default function SettingsPage() {
    const [activeTab, setActiveTab] = useState<SettingsTab>('profile');
    const [theme, setTheme] = useState<'light' | 'dark' | 'system'>('light');
    const [profileName, setProfileName] = useState('Alex Rivera');
    const [profileEmail, setProfileEmail] = useState('alex.rivera@flowise.io');
    const [profileRole, setProfileRole] = useState('Project Manager');
    const [notiEmail, setNotiEmail] = useState(true);
    const [notiDesktop, setNotiDesktop] = useState(true);
    const [notiMention, setNotiMention] = useState(true);
    const [notiTaskUpdate, setNotiTaskUpdate] = useState(false);

    const tabs = [
        { id: 'profile' as SettingsTab, label: 'Profile', icon: <User size={16} /> },
        { id: 'notifications' as SettingsTab, label: 'Notifications', icon: <Bell size={16} /> },
        { id: 'theme' as SettingsTab, label: 'Appearance', icon: <Palette size={16} /> },
        { id: 'security' as SettingsTab, label: 'Security', icon: <Shield size={16} /> },
        { id: 'workspace' as SettingsTab, label: 'Workspace', icon: <Globe size={16} /> },
    ];

    return (
        <div className="st-page">
            <header className="st-header">
                <Settings size={20} className="st-header-icon" />
                <h1 className="st-title">Settings</h1>
            </header>

            <div className="st-body">
                {/* Sidebar */}
                <nav className="st-nav">
                    {tabs.map(tab => (
                        <button
                            key={tab.id}
                            className={`st-nav-item ${activeTab === tab.id ? 'st-nav-item--active' : ''}`}
                            onClick={() => setActiveTab(tab.id)}
                        >
                            {tab.icon}
                            <span>{tab.label}</span>
                            <ChevronRight size={14} className="st-nav-chevron" />
                        </button>
                    ))}
                </nav>

                {/* Content */}
                <div className="st-content">
                    {/* Profile */}
                    {activeTab === 'profile' && (
                        <div className="st-section">
                            <h2 className="st-section-title">Profile Settings</h2>
                            <p className="st-section-desc">Manage your personal information</p>

                            <div className="st-avatar-section">
                                <div className="st-avatar-wrap">
                                    <Avatar size={72} style={{ backgroundColor: '#4285F4', fontSize: '24px', fontWeight: 'bold' }}>AR</Avatar>
                                    <button className="st-avatar-edit"><Camera size={14} /></button>
                                </div>
                                <div className="st-avatar-info">
                                    <p className="st-avatar-name">{profileName}</p>
                                    <p className="st-avatar-role">{profileRole}</p>
                                </div>
                            </div>

                            <div className="st-form">
                                <div className="st-form-group">
                                    <label className="st-label">Full Name</label>
                                    <input className="st-input" value={profileName} onChange={e => setProfileName(e.target.value)} />
                                </div>
                                <div className="st-form-group">
                                    <label className="st-label">Email</label>
                                    <input className="st-input" type="email" value={profileEmail} onChange={e => setProfileEmail(e.target.value)} />
                                </div>
                                <div className="st-form-group">
                                    <label className="st-label">Role</label>
                                    <input className="st-input" value={profileRole} onChange={e => setProfileRole(e.target.value)} />
                                </div>
                                <button className="st-save-btn">Save Changes</button>
                            </div>
                        </div>
                    )}

                    {/* Notifications */}
                    {activeTab === 'notifications' && (
                        <div className="st-section">
                            <h2 className="st-section-title">Notification Preferences</h2>
                            <p className="st-section-desc">Choose how you want to be notified</p>

                            <div className="st-toggles">
                                <div className="st-toggle-row">
                                    <div className="st-toggle-info">
                                        <span className="st-toggle-label">Email notifications</span>
                                        <span className="st-toggle-desc">Receive email for important updates</span>
                                    </div>
                                    <button className={`st-toggle ${notiEmail ? 'st-toggle--on' : ''}`}
                                        onClick={() => setNotiEmail(!notiEmail)}>
                                        <span className="st-toggle-knob" />
                                    </button>
                                </div>
                                <div className="st-toggle-row">
                                    <div className="st-toggle-info">
                                        <span className="st-toggle-label">Desktop notifications</span>
                                        <span className="st-toggle-desc">Show browser push notifications</span>
                                    </div>
                                    <button className={`st-toggle ${notiDesktop ? 'st-toggle--on' : ''}`}
                                        onClick={() => setNotiDesktop(!notiDesktop)}>
                                        <span className="st-toggle-knob" />
                                    </button>
                                </div>
                                <div className="st-toggle-row">
                                    <div className="st-toggle-info">
                                        <span className="st-toggle-label">Mention alerts</span>
                                        <span className="st-toggle-desc">Get notified when someone @mentions you</span>
                                    </div>
                                    <button className={`st-toggle ${notiMention ? 'st-toggle--on' : ''}`}
                                        onClick={() => setNotiMention(!notiMention)}>
                                        <span className="st-toggle-knob" />
                                    </button>
                                </div>
                                <div className="st-toggle-row">
                                    <div className="st-toggle-info">
                                        <span className="st-toggle-label">Task status updates</span>
                                        <span className="st-toggle-desc">Alerts when tasks you follow change status</span>
                                    </div>
                                    <button className={`st-toggle ${notiTaskUpdate ? 'st-toggle--on' : ''}`}
                                        onClick={() => setNotiTaskUpdate(!notiTaskUpdate)}>
                                        <span className="st-toggle-knob" />
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Theme */}
                    {activeTab === 'theme' && (
                        <div className="st-section">
                            <h2 className="st-section-title">Appearance</h2>
                            <p className="st-section-desc">Customize the look and feel</p>

                            <div className="st-theme-grid">
                                <div className={`st-theme-card ${theme === 'light' ? 'st-theme-card--active' : ''}`}
                                    onClick={() => setTheme('light')}>
                                    <div className="st-theme-preview st-theme-preview--light">
                                        <div className="st-tp-sidebar" /><div className="st-tp-main" />
                                    </div>
                                    <div className="st-theme-name">
                                        <Sun size={14} /> Light
                                        {theme === 'light' && <Check size={14} className="st-theme-check" />}
                                    </div>
                                </div>
                                <div className={`st-theme-card ${theme === 'dark' ? 'st-theme-card--active' : ''}`}
                                    onClick={() => setTheme('dark')}>
                                    <div className="st-theme-preview st-theme-preview--dark">
                                        <div className="st-tp-sidebar" /><div className="st-tp-main" />
                                    </div>
                                    <div className="st-theme-name">
                                        <Moon size={14} /> Dark
                                        {theme === 'dark' && <Check size={14} className="st-theme-check" />}
                                    </div>
                                </div>
                                <div className={`st-theme-card ${theme === 'system' ? 'st-theme-card--active' : ''}`}
                                    onClick={() => setTheme('system')}>
                                    <div className="st-theme-preview st-theme-preview--system">
                                        <div className="st-tp-sidebar" /><div className="st-tp-main" />
                                    </div>
                                    <div className="st-theme-name">
                                        <Monitor size={14} /> System
                                        {theme === 'system' && <Check size={14} className="st-theme-check" />}
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Security */}
                    {activeTab === 'security' && (
                        <div className="st-section">
                            <h2 className="st-section-title">Security</h2>
                            <p className="st-section-desc">Manage your account security</p>
                            <div className="st-form">
                                <div className="st-form-group">
                                    <label className="st-label">Current Password</label>
                                    <input className="st-input" type="password" placeholder="Enter current password" />
                                </div>
                                <div className="st-form-group">
                                    <label className="st-label">New Password</label>
                                    <input className="st-input" type="password" placeholder="Enter new password" />
                                </div>
                                <div className="st-form-group">
                                    <label className="st-label">Confirm Password</label>
                                    <input className="st-input" type="password" placeholder="Confirm new password" />
                                </div>
                                <button className="st-save-btn">Update Password</button>
                            </div>
                        </div>
                    )}

                    {/* Workspace */}
                    {activeTab === 'workspace' && (
                        <div className="st-section">
                            <h2 className="st-section-title">Workspace Settings</h2>
                            <p className="st-section-desc">Configure your workspace</p>
                            <div className="st-form">
                                <div className="st-form-group">
                                    <label className="st-label">Workspace Name</label>
                                    <input className="st-input" defaultValue="Flowise PM" />
                                </div>
                                <div className="st-form-group">
                                    <label className="st-label">Default Language</label>
                                    <select className="st-select">
                                        <option>English</option>
                                        <option>Vietnamese</option>
                                        <option>Japanese</option>
                                    </select>
                                </div>
                                <div className="st-form-group">
                                    <label className="st-label">Timezone</label>
                                    <select className="st-select">
                                        <option>UTC+7 (Ho Chi Minh City)</option>
                                        <option>UTC+0 (London)</option>
                                        <option>UTC-5 (New York)</option>
                                    </select>
                                </div>
                                <button className="st-save-btn">Save Settings</button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
