import { useState } from 'react'
import {
    Check, Moon, Sun, Monitor
} from 'lucide-react';
export default function Theme() {
    const [theme, setTheme] = useState<'light' | 'dark' | 'system'>('light');

    return (
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
    )
}
