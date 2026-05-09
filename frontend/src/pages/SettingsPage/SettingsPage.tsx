import { useState } from 'react';
import {
    Settings, User, Bell, Shield, Palette, Globe,
    ChevronRight
} from 'lucide-react';
import type { SettingsTab } from '../../types/app';
import Notifications from './components/Notifications';
import Theme from './components/Theme';
import Profile from './components/Profile';
import Security from './components/Security';
import Workspace from './components/Workspace';

export default function SettingsPage() {
    const [activeTab, setActiveTab] = useState<SettingsTab>('profile');

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
                        <Profile />
                    )}

                    {/* Notifications */}
                    {activeTab === 'notifications' && (
                        <Notifications />
                    )}

                    {/* Theme */}
                    {activeTab === 'theme' && (
                        <Theme />
                    )}

                    {/* Security */}
                    {activeTab === 'security' && (
                        <Security />
                    )}

                    {/* Workspace */}
                    {activeTab === 'workspace' && (
                        <Workspace />
                    )}
                </div>
            </div>
        </div>
    );
}
