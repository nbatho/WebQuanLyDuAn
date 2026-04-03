import { useState } from 'react';
import {
    BarChart3, TrendingUp, Users, CheckCircle2,
    Clock, AlertTriangle, ArrowUpRight, MoreHorizontal, Plus
} from 'lucide-react';
import { Avatar } from 'antd';
import './dashboards.css';

const avatarColors: Record<string, string> = {
    AR: '#4285F4', MC: '#7c5cfc', SJ: '#0058be', ER: '#e84393'
};

const teamWorkload = [
    { name: 'Alex Rivera', initials: 'AR', completed: 12, inProgress: 4, total: 20 },
    { name: 'Marcus Chen', initials: 'MC', completed: 8, inProgress: 6, total: 18 },
    { name: 'Sarah Jenkins', initials: 'SJ', completed: 15, inProgress: 2, total: 20 },
    { name: 'Elena Rodriguez', initials: 'ER', completed: 10, inProgress: 5, total: 17 },
];

const recentActivity = [
    { user: 'AR', action: 'completed', task: 'SSO Integration with Azure AD', time: '2h ago' },
    { user: 'MC', action: 'commented on', task: 'Architecture Review: API v3', time: '3h ago' },
    { user: 'SJ', action: 'changed status of', task: 'Brand Identity Revision', time: '4h ago' },
    { user: 'ER', action: 'created', task: 'Dark Mode Interface Alpha', time: '5h ago' },
    { user: 'AR', action: 'assigned', task: 'Database Indexing for Reports', time: '6h ago' },
];

export default function DashboardsPage() {
    return (
        <div className="ds-page">
            {/* Header */}
            <header className="ds-header">
                <div className="ds-header-left">
                    <BarChart3 size={20} className="ds-header-icon" />
                    <h1 className="ds-title">Dashboards</h1>
                </div>
                <div className="ds-header-right">
                    <button className="ds-btn-add"><Plus size={14} /> Add Widget</button>
                </div>
            </header>

            {/* Summary Cards */}
            <div className="ds-cards-row">
                <div className="ds-card ds-card--blue">
                    <div className="ds-card-top">
                        <CheckCircle2 size={20} />
                        <ArrowUpRight size={16} className="ds-card-trend" />
                    </div>
                    <div className="ds-card-value">45</div>
                    <div className="ds-card-label">Tasks Completed</div>
                    <div className="ds-card-subtitle">+12% from last week</div>
                </div>
                <div className="ds-card ds-card--purple">
                    <div className="ds-card-top">
                        <Clock size={20} />
                        <ArrowUpRight size={16} className="ds-card-trend" />
                    </div>
                    <div className="ds-card-value">17</div>
                    <div className="ds-card-label">In Progress</div>
                    <div className="ds-card-subtitle">Across 3 spaces</div>
                </div>
                <div className="ds-card ds-card--red">
                    <div className="ds-card-top">
                        <AlertTriangle size={20} />
                    </div>
                    <div className="ds-card-value">4</div>
                    <div className="ds-card-label">Overdue</div>
                    <div className="ds-card-subtitle">Need attention</div>
                </div>
                <div className="ds-card ds-card--green">
                    <div className="ds-card-top">
                        <Users size={20} />
                    </div>
                    <div className="ds-card-value">12</div>
                    <div className="ds-card-label">Team Members</div>
                    <div className="ds-card-subtitle">8 active now</div>
                </div>
            </div>

            {/* Main Content */}
            <div className="ds-content">
                {/* Workload Chart */}
                <div className="ds-widget ds-widget--workload">
                    <div className="ds-widget-header">
                        <h3 className="ds-widget-title">Team Workload</h3>
                        <MoreHorizontal size={16} className="ds-widget-more" />
                    </div>
                    <div className="ds-workload-list">
                        {teamWorkload.map(member => {
                            const completedPct = (member.completed / member.total) * 100;
                            const inProgressPct = (member.inProgress / member.total) * 100;
                            return (
                                <div key={member.initials} className="ds-wl-row">
                                    <div className="ds-wl-user">
                                        <Avatar size={28} style={{ backgroundColor: avatarColors[member.initials], fontSize: '10px', fontWeight: 'bold' }}>
                                            {member.initials}
                                        </Avatar>
                                        <div className="ds-wl-info">
                                            <span className="ds-wl-name">{member.name}</span>
                                            <span className="ds-wl-stats">{member.completed} done · {member.inProgress} active</span>
                                        </div>
                                    </div>
                                    <div className="ds-wl-bar-wrap">
                                        <div className="ds-wl-bar">
                                            <div className="ds-wl-bar-done" style={{ width: `${completedPct}%` }} />
                                            <div className="ds-wl-bar-active" style={{ width: `${inProgressPct}%` }} />
                                        </div>
                                        <span className="ds-wl-total">{member.total}</span>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                    <div className="ds-wl-legend">
                        <span className="ds-wl-legend-item"><span className="ds-wl-dot ds-wl-dot--done" /> Completed</span>
                        <span className="ds-wl-legend-item"><span className="ds-wl-dot ds-wl-dot--active" /> In Progress</span>
                    </div>
                </div>

                {/* Activity Feed */}
                <div className="ds-widget ds-widget--activity">
                    <div className="ds-widget-header">
                        <h3 className="ds-widget-title">Recent Activity</h3>
                        <MoreHorizontal size={16} className="ds-widget-more" />
                    </div>
                    <div className="ds-activity-list">
                        {recentActivity.map((act, i) => (
                            <div key={i} className="ds-act-row">
                                <Avatar size={28} style={{ backgroundColor: avatarColors[act.user], fontSize: '10px', fontWeight: 'bold' }}>
                                    {act.user}
                                </Avatar>
                                <div className="ds-act-content">
                                    <p className="ds-act-text">
                                        <strong>{teamWorkload.find(m => m.initials === act.user)?.name || act.user}</strong>
                                        {' '}{act.action}{' '}
                                        <span className="ds-act-task">{act.task}</span>
                                    </p>
                                    <span className="ds-act-time">{act.time}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Status Distribution */}
                <div className="ds-widget ds-widget--status">
                    <div className="ds-widget-header">
                        <h3 className="ds-widget-title">Task Status</h3>
                        <MoreHorizontal size={16} className="ds-widget-more" />
                    </div>
                    <div className="ds-status-ring">
                        <div className="ds-ring-chart">
                            <svg viewBox="0 0 36 36" className="ds-ring-svg">
                                <path className="ds-ring-bg" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
                                <path className="ds-ring-done" strokeDasharray="58, 100" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
                                <path className="ds-ring-progress" strokeDasharray="22, 100" strokeDashoffset="-58" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
                                <path className="ds-ring-todo" strokeDasharray="15, 100" strokeDashoffset="-80" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
                            </svg>
                            <div className="ds-ring-center">
                                <span className="ds-ring-total">76</span>
                                <span className="ds-ring-label">Total</span>
                            </div>
                        </div>
                    </div>
                    <div className="ds-status-legend">
                        <div className="ds-sl-item"><span className="ds-sl-dot" style={{background:'#27ae60'}} />Completed <strong>45</strong></div>
                        <div className="ds-sl-item"><span className="ds-sl-dot" style={{background:'#0058be'}} />In Progress <strong>17</strong></div>
                        <div className="ds-sl-item"><span className="ds-sl-dot" style={{background:'#5f6368'}} />To Do <strong>14</strong></div>
                    </div>
                </div>
            </div>
        </div>
    );
}
