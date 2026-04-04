import { useState } from 'react';
import {
    Play, Pause, Clock, Calendar,
    BarChart2, Timer, Trash2, Edit3
} from 'lucide-react';
import { Avatar } from 'antd';
import './time-tracking.css';

interface TimeEntry {
    id: string;
    task: string;
    space: string;
    spaceColor: string;
    duration: string;
    durationMs: number;
    date: string;
    user: string;
    userColor: string;
    isRunning: boolean;
}

const mockEntries: TimeEntry[] = [
    { id: 'te1', task: 'Finalize Q1 Marketing Roadmap', space: 'Marketing', spaceColor: '#e84393', duration: '2h 15m', durationMs: 8100000, date: 'Today', user: 'AR', userColor: '#4285F4', isRunning: false },
    { id: 'te2', task: 'Setup CI/CD Pipeline', space: 'Development', spaceColor: '#0984e3', duration: '1h 42m', durationMs: 6120000, date: 'Today', user: 'AR', userColor: '#4285F4', isRunning: false },
    { id: 'te3', task: 'Review UI Components', space: 'Design', spaceColor: '#00b894', duration: '0h 45m', durationMs: 2700000, date: 'Today', user: 'AR', userColor: '#4285F4', isRunning: false },
    { id: 'te4', task: 'Security Audit Report Q4', space: 'Development', spaceColor: '#0984e3', duration: '3h 20m', durationMs: 12000000, date: 'Yesterday', user: 'AR', userColor: '#4285F4', isRunning: false },
    { id: 'te5', task: 'Brand Identity Review', space: 'Marketing', spaceColor: '#e84393', duration: '1h 10m', durationMs: 4200000, date: 'Yesterday', user: 'AR', userColor: '#4285F4', isRunning: false },
    { id: 'te6', task: 'Database Indexing', space: 'Development', spaceColor: '#0984e3', duration: '2h 55m', durationMs: 10500000, date: 'Mon, Oct 23', user: 'AR', userColor: '#4285F4', isRunning: false },
];

function formatTimer(seconds: number): string {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
}

export default function TimeTrackingPage() {
    const [entries] = useState(mockEntries);
    const [isRunning, setIsRunning] = useState(false);
    const [timerSeconds, setTimerSeconds] = useState(0);
    const [timerTask, setTimerTask] = useState('');
    const [activeTab, setActiveTab] = useState<'entries' | 'reports'>('entries');

    const handleToggleTimer = () => {
        if (isRunning) {
            setIsRunning(false);
        } else {
            setIsRunning(true);
            // Simple timer increment
            const interval = setInterval(() => {
                setTimerSeconds(prev => {
                    if (!isRunning) { clearInterval(interval); return prev; }
                    return prev + 1;
                });
            }, 1000);
        }
    };

    const grouped: Record<string, TimeEntry[]> = {};
    entries.forEach(e => {
        if (!grouped[e.date]) grouped[e.date] = [];
        grouped[e.date].push(e);
    });

    const totalToday = entries.filter(e => e.date === 'Today').reduce((sum, e) => sum + e.durationMs, 0);
    const totalWeek = entries.reduce((sum, e) => sum + e.durationMs, 0);
    const totalTodayHrs = (totalToday / 3600000).toFixed(1);
    const totalWeekHrs = (totalWeek / 3600000).toFixed(1);

    const pulseClass = isRunning ? 'animate-[tt-pulse_1s_infinite]' : '';

    return (
        <div className="flex h-full flex-col overflow-hidden bg-white font-['Plus_Jakarta_Sans','Inter',sans-serif]">
            {/* Header */}
            <header className="flex shrink-0 items-center justify-between border-b border-[#eef0f5] px-6 py-3.5">
                <div className="flex items-center gap-2.5">
                    <Clock size={20} className="text-[#0058be]" />
                    <h1 className="m-0 text-lg font-extrabold text-[#141b2b]">Time Tracking</h1>
                </div>
                <div className="flex gap-1">
                    <button className={`flex items-center gap-1.25 border-x-0 border-b-2 border-t-0 border-solid bg-transparent px-3 py-1.5 text-[13px] font-semibold transition-all ${activeTab === 'entries' ? 'border-b-[#0058be] text-[#0058be]' : 'border-b-transparent text-[#5f6368] hover:text-[#141b2b]'}`}
                        onClick={() => setActiveTab('entries')}>
                        <Timer size={14} /> Entries
                    </button>
                    <button className={`flex items-center gap-1.25 border-x-0 border-b-2 border-t-0 border-solid bg-transparent px-3 py-1.5 text-[13px] font-semibold transition-all ${activeTab === 'reports' ? 'border-b-[#0058be] text-[#0058be]' : 'border-b-transparent text-[#5f6368] hover:text-[#141b2b]'}`}
                        onClick={() => setActiveTab('reports')}>
                        <BarChart2 size={14} /> Reports
                    </button>
                </div>
            </header>

            {/* Timer Bar */}
            <div className="flex shrink-0 items-center gap-4 border-b border-[#eef0f5] bg-[linear-gradient(135deg,#f8fafe_0%,#fff_100%)] px-6 py-3">
                <div className="flex-1">
                    <input
                        className="box-border w-full rounded-lg border border-[#eef0f5] bg-white px-3.5 py-2.5 text-sm text-[#141b2b] outline-none focus:border-[#0058be] focus:shadow-[0_0_0_3px_rgba(0,88,190,0.08)]"
                        placeholder="What are you working on?"
                        value={timerTask}
                        onChange={e => setTimerTask(e.target.value)}
                    />
                </div>
                <div className="flex items-center gap-2.5">
                    <span className={`min-w-25 text-center text-[22px] font-extrabold tabular-nums text-[#5f6368] ${pulseClass} ${isRunning ? 'text-[#0058be]' : ''}`}>
                        {formatTimer(timerSeconds)}
                    </span>
                    <button
                        className={`flex h-10 w-10 items-center justify-center rounded-full border-none text-white transition-all hover:scale-105 ${isRunning ? 'bg-[#e74c3c] shadow-[0_2px_8px_rgba(231,76,60,0.3)] hover:bg-[#c0392b]' : 'bg-[#0058be] shadow-[0_2px_8px_rgba(0,88,190,0.3)] hover:bg-[#004aab]'}`}
                        onClick={handleToggleTimer}
                    >
                        {isRunning ? <Pause size={16} /> : <Play size={16} />}
                    </button>
                </div>
            </div>

            {/* Summary Cards */}
            <div className="flex shrink-0 gap-4 px-6 py-4">
                <div className="flex-1 rounded-[10px] border border-[#eef0f5] bg-[#f8fafb] px-4 py-3.5">
                    <span className="block text-[11px] font-extrabold uppercase tracking-[0.06em] text-[#9aa0a6]">Today</span>
                    <span className="my-1 block text-[28px] font-black text-[#141b2b]">{totalTodayHrs}h</span>
                    <div className="mt-1.5 h-1.5 overflow-hidden rounded bg-[#eef0f5]"><div className="h-full rounded bg-[#0058be] transition-[width] duration-400" style={{ width: `${Math.min(100, (parseFloat(totalTodayHrs) / 8) * 100)}%` }} /></div>
                    <span className="text-[11px] font-semibold text-[#9aa0a6]">/ 8h target</span>
                </div>
                <div className="flex-1 rounded-[10px] border border-[#eef0f5] bg-[#f8fafb] px-4 py-3.5">
                    <span className="block text-[11px] font-extrabold uppercase tracking-[0.06em] text-[#9aa0a6]">This Week</span>
                    <span className="my-1 block text-[28px] font-black text-[#141b2b]">{totalWeekHrs}h</span>
                    <div className="mt-1.5 h-1.5 overflow-hidden rounded bg-[#eef0f5]"><div className="h-full rounded bg-[#7c5cfc] transition-[width] duration-400" style={{ width: `${Math.min(100, (parseFloat(totalWeekHrs) / 40) * 100)}%` }} /></div>
                    <span className="text-[11px] font-semibold text-[#9aa0a6]">/ 40h target</span>
                </div>
                <div className="flex-1 rounded-[10px] border border-[#eef0f5] bg-[#f8fafb] px-4 py-3.5">
                    <span className="block text-[11px] font-extrabold uppercase tracking-[0.06em] text-[#9aa0a6]">Entries</span>
                    <span className="my-1 block text-[28px] font-black text-[#141b2b]">{entries.length}</span>
                    <span className="text-xs font-medium text-[#9aa0a6]">time entries tracked</span>
                </div>
            </div>

            {/* Entries List */}
            <div className="flex-1 overflow-y-auto px-6 pb-6">
                {Object.entries(grouped).map(([date, dateEntries]) => {
                    const dayTotal = dateEntries.reduce((sum, e) => sum + e.durationMs, 0);
                    const dayHrs = (dayTotal / 3600000).toFixed(1);
                    return (
                        <div key={date} className="mb-5">
                            <div className="flex items-center gap-2 pb-1.5 pt-2 text-[#9aa0a6]">
                                <Calendar size={13} />
                                <span className="text-[13px] font-extrabold text-[#141b2b]">{date}</span>
                                <span className="text-xs font-semibold text-[#0058be]">{dayHrs}h total</span>
                                <div className="ml-2 h-px flex-1 bg-[#eef0f5]" />
                            </div>
                            <div className="flex flex-col">
                                {dateEntries.map(entry => (
                                    <div key={entry.id} className="group flex items-center gap-3 rounded-md border-b border-[#f5f7fa] px-2 py-2.5 transition-colors duration-100 hover:bg-[#f8fafb]">
                                        <div className="min-w-0 flex-1">
                                            <span className="block text-[13px] font-semibold text-[#141b2b]">{entry.task}</span>
                                            <span className="mt-0.75 inline-block rounded px-1.5 py-px text-[10px] font-bold" style={{ backgroundColor: entry.spaceColor + '18', color: entry.spaceColor }}>
                                                {entry.space}
                                            </span>
                                        </div>
                                        <div className="shrink-0">
                                            <Avatar size={22} style={{ backgroundColor: entry.userColor, fontSize: '9px', fontWeight: 'bold' }}>{entry.user}</Avatar>
                                        </div>
                                        <div className="min-w-17.5 text-right text-sm font-extrabold text-[#141b2b]">{entry.duration}</div>
                                        <div className="flex gap-1 opacity-0 transition-opacity duration-100 group-hover:opacity-100">
                                            <button className="rounded bg-transparent p-1 text-[#9aa0a6] hover:bg-[#eef0f5] hover:text-[#141b2b]"><Edit3 size={13} /></button>
                                            <button className="rounded bg-transparent p-1 text-[#9aa0a6] hover:bg-[#fff1f0] hover:text-[#e74c3c]"><Trash2 size={13} /></button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
