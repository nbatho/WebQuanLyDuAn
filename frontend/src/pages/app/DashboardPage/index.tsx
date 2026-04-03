import { Clock, Calendar, AlertTriangle, ArrowRight, Target } from 'lucide-react';
import './dashboard.css';

export default function DashboardPage() {
    return (
        <div className="db-page">

            {/* ═══════ Main Content ═══════ */}
            <main className="db-main">
                {/* Welcome */}
                <h1 className="db-welcome">Welcome back, John!</h1>
                <div className="db-attention-bar">
                    <p>You have <strong>3 tasks</strong> that need your attention today.</p>
                </div>

                {/* Needs Action */}
                <div className="db-section-label">
                    <span className="db-section-dot db-section-dot--red">!</span>
                    <span>NEEDS ACTION</span>
                </div>

                <div className="db-actions-list">
                    {/* Action 1 */}
                    <div className="db-action-card">
                        <img
                            src="https://ui-avatars.com/api/?name=Sarah+Chen&background=e8edff&color=0058be&size=44&bold=true"
                            alt="Sarah Chen"
                            className="db-action-avatar"
                        />
                        <div className="db-action-content">
                            <p className="db-action-text">
                                <strong>Sarah Chen</strong> mentioned you in{' '}
                                <a href="#" className="db-action-link">Brand Identity Revision</a>
                            </p>
                            <p className="db-action-quote">
                                "John, can you review the color hex codes for the new guidelines?"
                            </p>
                        </div>
                        <span className="db-action-time">2M AGO</span>
                    </div>

                    {/* Action 2 */}
                    <div className="db-action-card">
                        <div className="db-action-alert-icon">
                            <AlertTriangle size={20} />
                        </div>
                        <div className="db-action-content">
                            <p className="db-action-text">
                                <strong>Server Alert:</strong> Latency spike detected in{' '}
                                <a href="#" className="db-action-link">US-East Node</a>
                            </p>
                            <p className="db-action-quote">
                                The development team is investigating. Estimated fix: 30 mins.
                            </p>
                        </div>
                        <span className="db-action-time">14M AGO</span>
                    </div>
                </div>

                {/* What Do I Do Next */}
                <div className="db-section-label db-section-label--green">
                    <span className="db-section-dot db-section-dot--green">✓</span>
                    <span>WHAT DO I DO NEXT?</span>
                </div>

                <div className="db-next-grid">
                    <div className="db-next-card">
                        <div className="db-next-card-top">
                            <span className="db-next-tag db-next-tag--red">HIGH PRIORITY</span>
                            <ArrowRight size={16} className="db-next-arrow" />
                        </div>
                        <h3 className="db-next-title">Finalize Q1 Marketing Roadmap</h3>
                        <p className="db-next-desc">Draft due by end of day for the stakeholder meeting.</p>
                        <div className="db-next-meta">
                            <Calendar size={13} />
                            <span>DUE TODAY</span>
                        </div>
                    </div>

                    <div className="db-next-card">
                        <div className="db-next-card-top">
                            <span className="db-next-tag db-next-tag--blue">DEVELOPMENT</span>
                            <ArrowRight size={16} className="db-next-arrow" />
                        </div>
                        <h3 className="db-next-title">Review UI Components Documentation</h3>
                        <p className="db-next-desc">Coordinate with the Design Space to align on tokens.</p>
                        <div className="db-next-meta">
                            <Clock size={13} />
                            <span>STARTS AT 2:00 PM</span>
                        </div>
                    </div>
                </div>
            </main>

            {/* ═══════ Right Panel ═══════ */}
            <aside className="db-right">
                {/* Sprint Progress */}
                <div className="db-sprint-card">
                    <span className="db-sprint-label">SPRINT PROGRESS</span>
                    <div className="db-sprint-value">
                        <span className="db-sprint-pct">64%</span>
                        <span className="db-sprint-text">COMPLETE</span>
                    </div>
                    <div className="db-sprint-bar-bg">
                        <div className="db-sprint-bar-fill" style={{ width: '64%' }} />
                    </div>
                    <span className="db-sprint-remaining">4 DAYS REMAINING</span>
                </div>

                {/* Team */}
                <div className="db-team-card">
                    <span className="db-team-label">WHERE IS THE TEAM?</span>
                    <div className="db-team-member">
                        <img
                            src="https://ui-avatars.com/api/?name=Alex+Rivera&background=4285F4&color=fff&size=36&bold=true"
                            alt="Alex Rivera"
                            className="db-team-avatar"
                        />
                        <div className="db-team-info">
                            <span className="db-team-name">Alex Rivera</span>
                            <span className="db-team-dept">ENGINEERING</span>
                        </div>
                        <span className="db-team-status db-team-status--active">ACTIVE</span>
                    </div>
                    <div className="db-team-member">
                        <img
                            src="https://ui-avatars.com/api/?name=Elena+Rodriguez&background=e84393&color=fff&size=36&bold=true"
                            alt="Elena Rodriguez"
                            className="db-team-avatar"
                        />
                        <div className="db-team-info">
                            <span className="db-team-name">Elena Rodriguez</span>
                            <span className="db-team-dept">MARKETING</span>
                        </div>
                        <span className="db-team-status db-team-status--meeting">MEETING</span>
                    </div>
                </div>

                {/* Milestones */}
                <div className="db-milestone-card">
                    <span className="db-milestone-label">UPCOMING MILESTONES</span>
                    <div className="db-milestone-item">
                        <div className="db-milestone-icon">
                            <Target size={18} />
                        </div>
                        <div className="db-milestone-info">
                            <span className="db-milestone-name">Beta V2 Launch Phase</span>
                            <span className="db-milestone-date">Scheduled for next Friday, 10:00 AM</span>
                        </div>
                    </div>
                    <a href="#" className="db-milestone-link">VIEW ROADMAP ›</a>
                </div>
            </aside>
        </div>
    );
}
