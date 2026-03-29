import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './google-login.css';

/* ─── Mock accounts (replace with real Google OAuth flow later) ─── */
const mockAccounts = [
    {
        id: 1,
        name: 'John Doe',
        email: 'john.doe@gmail.com',
        avatar: 'https://ui-avatars.com/api/?name=John+Doe&background=4285F4&color=fff&size=80&bold=true',
    },
    {
        id: 2,
        name: 'Jane Smith',
        email: 'jane.design@flowise.ai',
        avatar: '', // will use fallback icon
    },
];

export default function GoogleLoginPage() {
    const [hoveredId, setHoveredId] = useState<number | null>(null);
    const navigate = useNavigate();

    const handleSelectAccount = (account: (typeof mockAccounts)[0]) => {
        // TODO: Implement actual Google OAuth flow
        console.log('Selected account:', account);
        navigate('/workspace-setup');
    };

    const handleUseAnotherAccount = () => {
        // TODO: Redirect to Google OAuth consent screen
        console.log('Use another account');
    };

    return (
        <div className="gl-page">
            {/* ── Main Card ── */}
            <div className="gl-card">
                {/* Header */}
                <div className="gl-card-header">
                    <h1 className="gl-brand">Flowise</h1>
                    <h2 className="gl-title">Choose an account</h2>
                    <p className="gl-subtitle">
                        to continue to{' '}
                        <Link to="/" className="gl-link">
                            Flowise
                        </Link>
                    </p>
                </div>

                {/* Account List */}
                <div className="gl-accounts">
                    {mockAccounts.map((account) => (
                        <button
                            key={account.id}
                            className={`gl-account-row ${hoveredId === account.id ? 'gl-account-row--hover' : ''}`}
                            onClick={() => handleSelectAccount(account)}
                            onMouseEnter={() => setHoveredId(account.id)}
                            onMouseLeave={() => setHoveredId(null)}
                        >
                            {/* Avatar */}
                            <div className="gl-avatar-wrap">
                                {account.avatar ? (
                                    <img
                                        src={account.avatar}
                                        alt={account.name}
                                        className="gl-avatar-img"
                                    />
                                ) : (
                                    <div className="gl-avatar-fallback">
                                        <svg viewBox="0 0 24 24" className="gl-avatar-icon">
                                            <path
                                                d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 3c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3zm0 14.2c-2.5 0-4.71-1.28-6-3.22.03-1.99 4-3.08 6-3.08 1.99 0 5.97 1.09 6 3.08-1.29 1.94-3.5 3.22-6 3.22z"
                                                fill="#5f6368"
                                            />
                                        </svg>
                                    </div>
                                )}
                            </div>

                            {/* Info */}
                            <div className="gl-account-info">
                                <span className="gl-account-name">{account.name}</span>
                                <span className="gl-account-email">{account.email}</span>
                            </div>

                            {/* Arrow */}
                            <svg className="gl-arrow" viewBox="0 0 24 24">
                                <path d="M9.29 6.71a1 1 0 0 0 0 1.41L13.17 12l-3.88 3.88a1 1 0 1 0 1.41 1.41l4.59-4.59a1 1 0 0 0 0-1.41L10.7 6.7a1 1 0 0 0-1.41.01z" fill="#9aa0a6" />
                            </svg>
                        </button>
                    ))}

                    {/* Use another account */}
                    <button className="gl-account-row gl-account-row--another" onClick={handleUseAnotherAccount}>
                        <div className="gl-avatar-wrap">
                            <div className="gl-avatar-add">
                                <svg viewBox="0 0 24 24" className="gl-add-icon">
                                    <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z" fill="#5f6368" />
                                </svg>
                            </div>
                        </div>
                        <div className="gl-account-info">
                            <span className="gl-account-name">Use another account</span>
                        </div>
                    </button>
                </div>

                {/* Disclaimer */}
                <div className="gl-disclaimer">
                    <p>
                        To continue, Google will share your name, email address,
                        language preference, and profile picture with <strong>Flowise</strong>.
                        Before using this app, you can review Flowise's{' '}
                        <a href="#" className="gl-link">privacy policy</a> and{' '}
                        <a href="#" className="gl-link">terms of service</a>.
                    </p>
                </div>

                {/* Card Footer Links */}
                <div className="gl-card-footer">
                    <span className="gl-footer-lang">ENGLISH (UNITED STATES)</span>
                    <div className="gl-footer-links">
                        <a href="#" className="gl-footer-link">HELP</a>
                        <a href="#" className="gl-footer-link">PRIVACY</a>
                        <a href="#" className="gl-footer-link">TERMS</a>
                    </div>
                </div>
            </div>

            {/* ── Page Footer ── */}
            <footer className="gl-page-footer">
                <span className="gl-page-footer-brand">Flowise</span>
                <span className="gl-page-footer-copy">© 2024 FLOWISEAI INC.</span>
                <div className="gl-page-footer-links">
                    <a href="#" className="gl-page-footer-link">PRIVACY</a>
                    <a href="#" className="gl-page-footer-link">TERMS</a>
                    <a href="#" className="gl-page-footer-link">HELP</a>
                </div>
            </footer>
        </div>
    );
}
