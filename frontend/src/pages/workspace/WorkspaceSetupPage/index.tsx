import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Input, Select } from 'antd';
import { ArrowLeft, ArrowRight, Camera } from 'lucide-react';
import './workspace-setup.css';

const orgSizeOptions = [
    { value: '1-10', label: '1–10 employees' },
    { value: '11-50', label: '11–50 employees' },
    { value: '51-200', label: '51–200 employees' },
    { value: '201-500', label: '201–500 employees' },
    { value: '501+', label: '501+ employees' },
];

const industryOptions = [
    { value: 'technology', label: 'Technology' },
    { value: 'finance', label: 'Finance' },
    { value: 'healthcare', label: 'Healthcare' },
    { value: 'education', label: 'Education' },
    { value: 'marketing', label: 'Marketing' },
    { value: 'ecommerce', label: 'E-Commerce' },
    { value: 'consulting', label: 'Consulting' },
    { value: 'other', label: 'Other' },
];

export default function WorkspaceSetupPage() {
    const navigate = useNavigate();
    const [name, setName] = useState('Acme Corp');
    const [slug, setSlug] = useState('acme-hq');
    const [orgSize, setOrgSize] = useState('1-10');
    const [industry, setIndustry] = useState('technology');

    /* auto-generate slug from name */
    const handleNameChange = (val: string) => {
        setName(val);
        const autoSlug = val
            .toLowerCase()
            .replace(/[^a-z0-9\s-]/g, '')
            .replace(/\s+/g, '-')
            .replace(/-+/g, '-')
            .slice(0, 40);
        setSlug(autoSlug);
    };

    const handleNext = () => {
        console.log('Create workspace:', { name, slug, orgSize, industry });
        navigate('/workspace-branding');
    };

    /* first letter for the preview avatar */
    const initial = name.trim().charAt(0).toUpperCase() || 'W';

    return (
        <div className="ws-page">
            {/* ═══════ LEFT — Form ═══════ */}
            <section className="ws-form-section">
                <div className="ws-form-inner">
                    <h1 className="ws-heading">
                        What's the name of<br />your workspace?
                    </h1>
                    <p className="ws-subheading">
                        This is where your team works and collaborates.
                    </p>

                    {/* Logo Upload */}
                    <div className="ws-logo-upload">
                        <div className="ws-logo-box">
                            <Camera size={24} className="ws-logo-icon" />
                        </div>
                        <div className="ws-logo-text">
                            <span className="ws-logo-label">WORKSPACE LOGO</span>
                            <span className="ws-logo-hint">Recommended 400×400px</span>
                        </div>
                    </div>

                    {/* Workspace Name */}
                    <div className="ws-field">
                        <label className="ws-label">WORKSPACE NAME</label>
                        <Input
                            size="large"
                            value={name}
                            onChange={(e) => handleNameChange(e.target.value)}
                            placeholder="Acme Corp"
                            className="ws-input"
                        />
                    </div>

                    {/* Workspace URL */}
                    <div className="ws-field">
                        <label className="ws-label">WORKSPACE URL</label>
                        <div className="ws-url-group">
                            <span className="ws-url-prefix">flowise.app/</span>
                            <Input
                                size="large"
                                value={slug}
                                onChange={(e) => setSlug(e.target.value)}
                                placeholder="acme-hq"
                                className="ws-input ws-input-slug"
                            />
                        </div>
                    </div>

                    {/* Org Size & Industry */}
                    <div className="ws-row">
                        <div className="ws-field ws-field-half">
                            <label className="ws-label">ORGANIZATION SIZE</label>
                            <Select
                                size="large"
                                value={orgSize}
                                onChange={setOrgSize}
                                options={orgSizeOptions}
                                className="ws-select"
                                popupMatchSelectWidth
                            />
                        </div>
                        <div className="ws-field ws-field-half">
                            <label className="ws-label">INDUSTRY</label>
                            <Select
                                size="large"
                                value={industry}
                                onChange={setIndustry}
                                options={industryOptions}
                                className="ws-select"
                                popupMatchSelectWidth
                            />
                        </div>
                    </div>

                    {/* Divider */}
                    <div className="ws-divider" />

                    {/* Actions */}
                    <div className="ws-actions">
                        <button className="ws-back-btn" onClick={() => navigate('/google-login')}>
                            <ArrowLeft size={16} />
                            <span>Back</span>
                        </button>
                        <Button
                            type="primary"
                            size="large"
                            onClick={handleNext}
                            className="ws-next-btn"
                        >
                            <span>Next</span>
                            <ArrowRight size={18} />
                        </Button>
                    </div>
                </div>
            </section>

            {/* ═══════ RIGHT — Sidebar Preview ═══════ */}
            <section className="ws-preview-section">
                <div className="ws-preview-container">
                    {/* Preview Label */}
                    <div className="ws-preview-label">
                        <span className="ws-preview-line" />
                        <span className="ws-preview-text">SIDEBAR PREVIEW</span>
                    </div>

                    {/* Mock Sidebar */}
                    <div className="ws-sidebar-mock">
                        {/* Sidebar Header */}
                        <div className="ws-sb-header">
                            <div className="ws-sb-avatar" style={{ backgroundColor: '#0058be' }}>
                                {initial}
                            </div>
                            <div className="ws-sb-header-text">
                                <span className="ws-sb-name">{name || 'Workspace'}</span>
                                <span className="ws-sb-plan">ENTERPRISE PLAN</span>
                            </div>
                        </div>

                        {/* Search bar mock */}
                        <div className="ws-sb-search">
                            <div className="ws-sb-search-icon">
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                                    <circle cx="10.5" cy="10.5" r="7.5" stroke="#9aa0a6" strokeWidth="2.5" />
                                    <line x1="16" y1="16" x2="21" y2="21" stroke="#9aa0a6" strokeWidth="2.5" strokeLinecap="round" />
                                </svg>
                            </div>
                            <div className="ws-sb-search-bar" />
                        </div>

                        {/* Nav Items */}
                        <div className="ws-sb-nav">
                            <div className="ws-sb-nav-item ws-sb-nav-item--active">
                                <div className="ws-sb-nav-icon ws-sb-nav-icon--blue">
                                    <svg width="14" height="14" viewBox="0 0 24 24"><rect x="3" y="3" width="7" height="7" rx="1.5" fill="#fff" /><rect x="14" y="3" width="7" height="7" rx="1.5" fill="#fff" /><rect x="3" y="14" width="7" height="7" rx="1.5" fill="#fff" /><rect x="14" y="14" width="7" height="7" rx="1.5" fill="#fff" /></svg>
                                </div>
                                <div className="ws-sb-nav-bar ws-sb-nav-bar--w60" />
                            </div>
                            <div className="ws-sb-nav-item">
                                <div className="ws-sb-nav-icon ws-sb-nav-icon--dark">
                                    <svg width="12" height="12" viewBox="0 0 24 24"><path d="M3 7h18v2H3zm0 4h18v2H3zm0 4h18v2H3z" fill="#5f6368" /></svg>
                                </div>
                                <div className="ws-sb-nav-bar ws-sb-nav-bar--w40" />
                            </div>
                            <div className="ws-sb-nav-item">
                                <div className="ws-sb-nav-icon ws-sb-nav-icon--dark">
                                    <svg width="12" height="12" viewBox="0 0 24 24"><path d="M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5s-3 1.34-3 3 1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z" fill="#5f6368" /></svg>
                                </div>
                                <div className="ws-sb-nav-bar ws-sb-nav-bar--w50" />
                            </div>
                            <div className="ws-sb-nav-item">
                                <div className="ws-sb-nav-icon ws-sb-nav-icon--dark">
                                    <svg width="12" height="12" viewBox="0 0 24 24"><path d="M7 2v11h3v9l7-12h-4l4-8z" fill="#5f6368" /></svg>
                                </div>
                                <div className="ws-sb-nav-bar ws-sb-nav-bar--w35" />
                            </div>
                        </div>

                        {/* Bottom user */}
                        <div className="ws-sb-bottom">
                            <div className="ws-sb-user-avatar">
                                <img src="https://ui-avatars.com/api/?name=U&background=4285F4&color=fff&size=32&bold=true" alt="" className="ws-sb-user-img" />
                            </div>
                            <div className="ws-sb-user-bar" />
                        </div>
                    </div>

                    {/* Content area mock (right side of sidebar) */}
                    <div className="ws-content-mock">
                        <div className="ws-mock-topbar">
                            <div className="ws-mock-bar ws-mock-bar--lg" />
                        </div>
                        <div className="ws-mock-cards">
                            <div className="ws-mock-card ws-mock-card--sm" />
                            <div className="ws-mock-card ws-mock-card--sm" />
                        </div>
                        <div className="ws-mock-cards">
                            <div className="ws-mock-card ws-mock-card--lg" />
                        </div>
                    </div>

                    {/* Caption */}
                    <p className="ws-preview-caption">
                        "Changes to your workspace name and logo will update across
                        the entire application interface in real-time."
                    </p>
                </div>
            </section>
        </div>
    );
}
