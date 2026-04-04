import { useState } from 'react';
import {
    Settings, User, Bell, Shield, Palette, Globe,
    ChevronRight, Camera, Check, Moon, Sun, Monitor
} from 'lucide-react';
import { Avatar } from 'antd';

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
        <div className="flex h-full flex-col overflow-hidden bg-white font-['Plus_Jakarta_Sans','Inter',sans-serif]">
            <header className="flex shrink-0 items-center gap-2.5 border-b border-[#eef0f5] px-6 py-4">
                <Settings size={20} className="text-[#5f6368]" />
                <h1 className="m-0 text-lg font-extrabold text-[#141b2b]">Settings</h1>
            </header>

            <div className="flex flex-1 overflow-hidden">
                {/* Sidebar */}
                <nav className="flex w-55 shrink-0 flex-col gap-0.5 border-r border-[#eef0f5] px-3 py-4">
                    {tabs.map(tab => (
                        <button
                            key={tab.id}
                            className={`flex w-full items-center gap-2 rounded-lg border-none px-3 py-2.25 text-left text-[13px] font-semibold transition-all duration-150 ${activeTab === tab.id
                                    ? 'bg-[#0058be] text-white hover:bg-[#0058be]'
                                    : 'bg-transparent text-[#5f6368] hover:bg-[#f0f4ff] hover:text-[#141b2b]'
                                }`}
                            onClick={() => setActiveTab(tab.id)}
                        >
                            {tab.icon}
                            <span>{tab.label}</span>
                            <ChevronRight size={14} className="ml-auto opacity-50" />
                        </button>
                    ))}
                </nav>

                {/* Content */}
                <div className="flex-1 overflow-y-auto px-8 py-6">
                    {/* Profile */}
                    {activeTab === 'profile' && (
                        <div>
                            <h2 className="mb-1 text-xl font-extrabold text-[#141b2b]">Profile Settings</h2>
                            <p className="mb-6 text-[13px] text-[#9aa0a6]">Manage your personal information</p>

                            <div className="mb-6 flex items-center gap-5 rounded-xl bg-[#f8fafb] p-5">
                                <div className="relative">
                                    <Avatar size={72} style={{ backgroundColor: '#4285F4', fontSize: '24px', fontWeight: 'bold' }}>AR</Avatar>
                                    <button className="absolute bottom-0 right-0 flex h-6.5 w-6.5 items-center justify-center rounded-full border-2 border-white bg-[#0058be] text-white transition-colors duration-150 hover:bg-[#004aab]"><Camera size={14} /></button>
                                </div>
                                <div>
                                    <p className="m-0 text-base font-extrabold text-[#141b2b]">{profileName}</p>
                                    <p className="mt-0.5 text-[13px] text-[#9aa0a6]">{profileRole}</p>
                                </div>
                            </div>

                            <div className="flex max-w-120 flex-col gap-4">
                                <div className="flex flex-col gap-1">
                                    <label className="text-xs font-bold text-[#5f6368]">Full Name</label>
                                    <input className="rounded-lg border border-[#dcdfe4] bg-white px-3 py-2.5 text-sm text-[#141b2b] outline-none transition-all duration-150 focus:border-[#0058be] focus:shadow-[0_0_0_3px_rgba(0,88,190,0.08)]" value={profileName} onChange={e => setProfileName(e.target.value)} />
                                </div>
                                <div className="flex flex-col gap-1">
                                    <label className="text-xs font-bold text-[#5f6368]">Email</label>
                                    <input className="rounded-lg border border-[#dcdfe4] bg-white px-3 py-2.5 text-sm text-[#141b2b] outline-none transition-all duration-150 focus:border-[#0058be] focus:shadow-[0_0_0_3px_rgba(0,88,190,0.08)]" type="email" value={profileEmail} onChange={e => setProfileEmail(e.target.value)} />
                                </div>
                                <div className="flex flex-col gap-1">
                                    <label className="text-xs font-bold text-[#5f6368]">Role</label>
                                    <input className="rounded-lg border border-[#dcdfe4] bg-white px-3 py-2.5 text-sm text-[#141b2b] outline-none transition-all duration-150 focus:border-[#0058be] focus:shadow-[0_0_0_3px_rgba(0,88,190,0.08)]" value={profileRole} onChange={e => setProfileRole(e.target.value)} />
                                </div>
                                <button className="mt-2 self-start rounded-lg border-none bg-[#0058be] px-6 py-2.5 text-[13px] font-bold text-white transition-colors duration-150 hover:bg-[#004aab]">Save Changes</button>
                            </div>
                        </div>
                    )}

                    {/* Notifications */}
                    {activeTab === 'notifications' && (
                        <div>
                            <h2 className="mb-1 text-xl font-extrabold text-[#141b2b]">Notification Preferences</h2>
                            <p className="mb-6 text-[13px] text-[#9aa0a6]">Choose how you want to be notified</p>

                            <div className="flex max-w-130 flex-col gap-1">
                                <div className="flex items-center justify-between rounded-[10px] border border-[#eef0f5] px-4 py-3.5 transition-colors duration-100 hover:bg-[#f8fafb]">
                                    <div className="flex flex-col">
                                        <span className="text-sm font-bold text-[#141b2b]">Email notifications</span>
                                        <span className="mt-0.5 text-xs text-[#9aa0a6]">Receive email for important updates</span>
                                    </div>
                                    <button className={`relative h-6 w-11 shrink-0 rounded-xl border-none transition-colors duration-200 ${notiEmail ? 'bg-[#0058be]' : 'bg-[#dcdfe4]'}`}
                                        onClick={() => setNotiEmail(!notiEmail)}>
                                        <span className={`absolute left-0.5 top-0.5 h-5 w-5 rounded-full bg-white shadow-[0_1px_3px_rgba(0,0,0,0.2)] transition-transform duration-200 ${notiEmail ? 'translate-x-5' : ''}`} />
                                    </button>
                                </div>
                                <div className="flex items-center justify-between rounded-[10px] border border-[#eef0f5] px-4 py-3.5 transition-colors duration-100 hover:bg-[#f8fafb]">
                                    <div className="flex flex-col">
                                        <span className="text-sm font-bold text-[#141b2b]">Desktop notifications</span>
                                        <span className="mt-0.5 text-xs text-[#9aa0a6]">Show browser push notifications</span>
                                    </div>
                                    <button className={`relative h-6 w-11 shrink-0 rounded-xl border-none transition-colors duration-200 ${notiDesktop ? 'bg-[#0058be]' : 'bg-[#dcdfe4]'}`}
                                        onClick={() => setNotiDesktop(!notiDesktop)}>
                                        <span className={`absolute left-0.5 top-0.5 h-5 w-5 rounded-full bg-white shadow-[0_1px_3px_rgba(0,0,0,0.2)] transition-transform duration-200 ${notiDesktop ? 'translate-x-5' : ''}`} />
                                    </button>
                                </div>
                                <div className="flex items-center justify-between rounded-[10px] border border-[#eef0f5] px-4 py-3.5 transition-colors duration-100 hover:bg-[#f8fafb]">
                                    <div className="flex flex-col">
                                        <span className="text-sm font-bold text-[#141b2b]">Mention alerts</span>
                                        <span className="mt-0.5 text-xs text-[#9aa0a6]">Get notified when someone @mentions you</span>
                                    </div>
                                    <button className={`relative h-6 w-11 shrink-0 rounded-xl border-none transition-colors duration-200 ${notiMention ? 'bg-[#0058be]' : 'bg-[#dcdfe4]'}`}
                                        onClick={() => setNotiMention(!notiMention)}>
                                        <span className={`absolute left-0.5 top-0.5 h-5 w-5 rounded-full bg-white shadow-[0_1px_3px_rgba(0,0,0,0.2)] transition-transform duration-200 ${notiMention ? 'translate-x-5' : ''}`} />
                                    </button>
                                </div>
                                <div className="flex items-center justify-between rounded-[10px] border border-[#eef0f5] px-4 py-3.5 transition-colors duration-100 hover:bg-[#f8fafb]">
                                    <div className="flex flex-col">
                                        <span className="text-sm font-bold text-[#141b2b]">Task status updates</span>
                                        <span className="mt-0.5 text-xs text-[#9aa0a6]">Alerts when tasks you follow change status</span>
                                    </div>
                                    <button className={`relative h-6 w-11 shrink-0 rounded-xl border-none transition-colors duration-200 ${notiTaskUpdate ? 'bg-[#0058be]' : 'bg-[#dcdfe4]'}`}
                                        onClick={() => setNotiTaskUpdate(!notiTaskUpdate)}>
                                        <span className={`absolute left-0.5 top-0.5 h-5 w-5 rounded-full bg-white shadow-[0_1px_3px_rgba(0,0,0,0.2)] transition-transform duration-200 ${notiTaskUpdate ? 'translate-x-5' : ''}`} />
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Theme */}
                    {activeTab === 'theme' && (
                        <div>
                            <h2 className="mb-1 text-xl font-extrabold text-[#141b2b]">Appearance</h2>
                            <p className="mb-6 text-[13px] text-[#9aa0a6]">Customize the look and feel</p>

                            <div className="grid max-w-130 grid-cols-3 gap-4">
                                <div className={`cursor-pointer overflow-hidden rounded-xl border-2 transition-all duration-150 ${theme === 'light' ? 'border-[#0058be] shadow-[0_0_0_3px_rgba(0,88,190,0.12)]' : 'border-[#eef0f5] hover:border-[#b0b5c1]'}`}
                                    onClick={() => setTheme('light')}>
                                    <div className="flex h-20 bg-[#f5f7ff] p-1.5">
                                        <div className="mr-1 w-[30%] rounded bg-white" /><div className="flex-1 rounded bg-white" />
                                    </div>
                                    <div className="flex items-center gap-1.5 px-3 py-2.5 text-[13px] font-bold text-[#141b2b]">
                                        <Sun size={14} /> Light
                                        {theme === 'light' && <Check size={14} className="ml-auto text-[#0058be]" />}
                                    </div>
                                </div>
                                <div className={`cursor-pointer overflow-hidden rounded-xl border-2 transition-all duration-150 ${theme === 'dark' ? 'border-[#0058be] shadow-[0_0_0_3px_rgba(0,88,190,0.12)]' : 'border-[#eef0f5] hover:border-[#b0b5c1]'}`}
                                    onClick={() => setTheme('dark')}>
                                    <div className="flex h-20 bg-[#1a1d23] p-1.5">
                                        <div className="mr-1 w-[30%] rounded bg-[#2a2d35]" /><div className="flex-1 rounded bg-[#2a2d35]" />
                                    </div>
                                    <div className="flex items-center gap-1.5 px-3 py-2.5 text-[13px] font-bold text-[#141b2b]">
                                        <Moon size={14} /> Dark
                                        {theme === 'dark' && <Check size={14} className="ml-auto text-[#0058be]" />}
                                    </div>
                                </div>
                                <div className={`cursor-pointer overflow-hidden rounded-xl border-2 transition-all duration-150 ${theme === 'system' ? 'border-[#0058be] shadow-[0_0_0_3px_rgba(0,88,190,0.12)]' : 'border-[#eef0f5] hover:border-[#b0b5c1]'}`}
                                    onClick={() => setTheme('system')}>
                                    <div className="flex h-20 bg-[linear-gradient(135deg,#f5f7ff_50%,#1a1d23_50%)] p-1.5">
                                        <div className="mr-1 w-[30%] rounded bg-[linear-gradient(135deg,#fff_50%,#2a2d35_50%)]" /><div className="flex-1 rounded bg-[linear-gradient(135deg,#fff_50%,#2a2d35_50%)]" />
                                    </div>
                                    <div className="flex items-center gap-1.5 px-3 py-2.5 text-[13px] font-bold text-[#141b2b]">
                                        <Monitor size={14} /> System
                                        {theme === 'system' && <Check size={14} className="ml-auto text-[#0058be]" />}
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Security */}
                    {activeTab === 'security' && (
                        <div>
                            <h2 className="mb-1 text-xl font-extrabold text-[#141b2b]">Security</h2>
                            <p className="mb-6 text-[13px] text-[#9aa0a6]">Manage your account security</p>
                            <div className="flex max-w-120 flex-col gap-4">
                                <div className="flex flex-col gap-1">
                                    <label className="text-xs font-bold text-[#5f6368]">Current Password</label>
                                    <input className="rounded-lg border border-[#dcdfe4] bg-white px-3 py-2.5 text-sm text-[#141b2b] outline-none transition-all duration-150 focus:border-[#0058be] focus:shadow-[0_0_0_3px_rgba(0,88,190,0.08)]" type="password" placeholder="Enter current password" />
                                </div>
                                <div className="flex flex-col gap-1">
                                    <label className="text-xs font-bold text-[#5f6368]">New Password</label>
                                    <input className="rounded-lg border border-[#dcdfe4] bg-white px-3 py-2.5 text-sm text-[#141b2b] outline-none transition-all duration-150 focus:border-[#0058be] focus:shadow-[0_0_0_3px_rgba(0,88,190,0.08)]" type="password" placeholder="Enter new password" />
                                </div>
                                <div className="flex flex-col gap-1">
                                    <label className="text-xs font-bold text-[#5f6368]">Confirm Password</label>
                                    <input className="rounded-lg border border-[#dcdfe4] bg-white px-3 py-2.5 text-sm text-[#141b2b] outline-none transition-all duration-150 focus:border-[#0058be] focus:shadow-[0_0_0_3px_rgba(0,88,190,0.08)]" type="password" placeholder="Confirm new password" />
                                </div>
                                <button className="mt-2 self-start rounded-lg border-none bg-[#0058be] px-6 py-2.5 text-[13px] font-bold text-white transition-colors duration-150 hover:bg-[#004aab]">Update Password</button>
                            </div>
                        </div>
                    )}

                    {/* Workspace */}
                    {activeTab === 'workspace' && (
                        <div>
                            <h2 className="mb-1 text-xl font-extrabold text-[#141b2b]">Workspace Settings</h2>
                            <p className="mb-6 text-[13px] text-[#9aa0a6]">Configure your workspace</p>
                            <div className="flex max-w-120 flex-col gap-4">
                                <div className="flex flex-col gap-1">
                                    <label className="text-xs font-bold text-[#5f6368]">Workspace Name</label>
                                    <input className="rounded-lg border border-[#dcdfe4] bg-white px-3 py-2.5 text-sm text-[#141b2b] outline-none transition-all duration-150 focus:border-[#0058be] focus:shadow-[0_0_0_3px_rgba(0,88,190,0.08)]" defaultValue="Flowise PM" />
                                </div>
                                <div className="flex flex-col gap-1">
                                    <label className="text-xs font-bold text-[#5f6368]">Default Language</label>
                                    <select className="rounded-lg border border-[#dcdfe4] bg-white px-3 py-2.5 text-sm text-[#141b2b] outline-none transition-all duration-150 focus:border-[#0058be] focus:shadow-[0_0_0_3px_rgba(0,88,190,0.08)]">
                                        <option>English</option>
                                        <option>Vietnamese</option>
                                        <option>Japanese</option>
                                    </select>
                                </div>
                                <div className="flex flex-col gap-1">
                                    <label className="text-xs font-bold text-[#5f6368]">Timezone</label>
                                    <select className="rounded-lg border border-[#dcdfe4] bg-white px-3 py-2.5 text-sm text-[#141b2b] outline-none transition-all duration-150 focus:border-[#0058be] focus:shadow-[0_0_0_3px_rgba(0,88,190,0.08)]">
                                        <option>UTC+7 (Ho Chi Minh City)</option>
                                        <option>UTC+0 (London)</option>
                                        <option>UTC-5 (New York)</option>
                                    </select>
                                </div>
                                <button className="mt-2 self-start rounded-lg border-none bg-[#0058be] px-6 py-2.5 text-[13px] font-bold text-white transition-colors duration-150 hover:bg-[#004aab]">Save Settings</button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
