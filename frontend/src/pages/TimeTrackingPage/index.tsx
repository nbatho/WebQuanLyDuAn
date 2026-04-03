import { useState } from 'react';
import {
    Play, Pause, Clock, Calendar, ChevronDown, Plus,
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
    return `${h.toString().padStart(2,'0')}:${m.toString().padStart(2,'0')}:${s.toString().padStart(2,'0')}`;
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

    return (
        <div className="tt-page">
            {/* Header */}
            <header className="tt-header">
                <div className="tt-header-left">
                    <Clock size={20} className="tt-header-icon" />
                    <h1 className="tt-title">Time Tracking</h1>
                </div>
                <div className="tt-header-right">
                    <button className={`tt-tab ${activeTab === 'entries' ? 'tt-tab--active' : ''}`}
                        onClick={() => setActiveTab('entries')}>
                        <Timer size={14} /> Entries
                    </button>
                    <button className={`tt-tab ${activeTab === 'reports' ? 'tt-tab--active' : ''}`}
                        onClick={() => setActiveTab('reports')}>
                        <BarChart2 size={14} /> Reports
                    </button>
                </div>
            </header>

            {/* Timer Bar */}
            <div className="tt-timer-bar">
                <div className="tt-timer-input-wrap">
                    <input
                        className="tt-timer-input"
                        placeholder="What are you working on?"
                        value={timerTask}
                        onChange={e => setTimerTask(e.target.value)}
                    />
                </div>
                <div className="tt-timer-display">
                    <span className={`tt-timer-clock ${isRunning ? 'tt-timer-clock--active' : ''}`}>
                        {formatTimer(timerSeconds)}
                    </span>
                    <button
                        className={`tt-timer-btn ${isRunning ? 'tt-timer-btn--stop' : ''}`}
                        onClick={handleToggleTimer}
                    >
                        {isRunning ? <Pause size={16} /> : <Play size={16} />}
                    </button>
                </div>
            </div>

            {/* Summary Cards */}
            <div className="tt-summary-row">
                <div className="tt-summary-card">
                    <span className="tt-sum-label">Today</span>
                    <span className="tt-sum-value">{totalTodayHrs}h</span>
                    <div className="tt-sum-bar"><div className="tt-sum-bar-fill" style={{ width: `${Math.min(100, (parseFloat(totalTodayHrs) / 8) * 100)}%` }} /></div>
                    <span className="tt-sum-target">/ 8h target</span>
                </div>
                <div className="tt-summary-card">
                    <span className="tt-sum-label">This Week</span>
                    <span className="tt-sum-value">{totalWeekHrs}h</span>
                    <div className="tt-sum-bar"><div className="tt-sum-bar-fill tt-sum-bar-fill--week" style={{ width: `${Math.min(100, (parseFloat(totalWeekHrs) / 40) * 100)}%` }} /></div>
                    <span className="tt-sum-target">/ 40h target</span>
                </div>
                <div className="tt-summary-card">
                    <span className="tt-sum-label">Entries</span>
                    <span className="tt-sum-value">{entries.length}</span>
                    <span className="tt-sum-sub">time entries tracked</span>
                </div>
            </div>

            {/* Entries List */}
            <div className="tt-entries">
                {Object.entries(grouped).map(([date, dateEntries]) => {
                    const dayTotal = dateEntries.reduce((sum, e) => sum + e.durationMs, 0);
                    const dayHrs = (dayTotal / 3600000).toFixed(1);
                    return (
                        <div key={date} className="tt-date-group">
                            <div className="tt-date-header">
                                <Calendar size={13} />
                                <span className="tt-date-label">{date}</span>
                                <span className="tt-date-total">{dayHrs}h total</span>
                                <div className="tt-date-line" />
                            </div>
                            <div className="tt-entry-list">
                                {dateEntries.map(entry => (
                                    <div key={entry.id} className="tt-entry-row">
                                        <div className="tt-entry-task">
                                            <span className="tt-entry-title">{entry.task}</span>
                                            <span className="tt-entry-space" style={{ backgroundColor: entry.spaceColor + '18', color: entry.spaceColor }}>
                                                {entry.space}
                                            </span>
                                        </div>
                                        <div className="tt-entry-user">
                                            <Avatar size={22} style={{ backgroundColor: entry.userColor, fontSize: '9px', fontWeight: 'bold' }}>{entry.user}</Avatar>
                                        </div>
                                        <div className="tt-entry-duration">{entry.duration}</div>
                                        <div className="tt-entry-actions">
                                            <button className="tt-entry-btn"><Edit3 size={13} /></button>
                                            <button className="tt-entry-btn tt-entry-btn--danger"><Trash2 size={13} /></button>
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
