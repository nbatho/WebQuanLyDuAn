import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

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
        <div className="flex min-h-screen flex-col items-center justify-center bg-[#f0f4ff] p-5 font-['Plus_Jakarta_Sans','Google_Sans','Roboto',Arial,sans-serif]">
            {/* ── Main Card ── */}
            <div className="w-full max-w-112.5 overflow-hidden rounded-2xl bg-white shadow-[0_1px_3px_rgba(0,0,0,0.04),0_4px_24px_rgba(0,88,190,0.06)]">
                {/* Header */}
                <div className="px-10 pb-6 pt-10 text-center max-[520px]:px-6 max-[520px]:pb-4.5 max-[520px]:pt-7">
                    <h1 className="mb-3 text-[28px] font-black tracking-[-0.04em] text-[#141b2b]">Flowise</h1>
                    <h2 className="mb-1.5 text-xl font-bold text-[#202124]">Choose an account</h2>
                    <p className="m-0 text-[15px] text-[#5f6368]">
                        to continue to{' '}
                        <Link to="/" className="font-semibold text-[#0058be] no-underline hover:underline">
                            Flowise
                        </Link>
                    </p>
                </div>

                {/* Account List */}
                <div className="px-6 pb-4 pt-2 max-[520px]:px-4 max-[520px]:pb-3">
                    {mockAccounts.map((account) => (
                        <button
                            key={account.id}
                            className={`group mb-1 flex w-full items-center gap-3.5 rounded-xl border-none px-4 py-3.5 text-left font-inherit transition-all duration-200 ${hoveredId === account.id ? 'translate-x-0.5 bg-[#e8edff]' : 'bg-[#f5f7ff] hover:translate-x-0.5 hover:bg-[#e8edff]'} active:scale-[0.995]`}
                            onClick={() => handleSelectAccount(account)}
                            onMouseEnter={() => setHoveredId(account.id)}
                            onMouseLeave={() => setHoveredId(null)}
                        >
                            {/* Avatar */}
                            <div className="h-11 w-11 shrink-0">
                                {account.avatar ? (
                                    <img
                                        src={account.avatar}
                                        alt={account.name}
                                        className="h-11 w-11 rounded-full object-cover"
                                    />
                                ) : (
                                    <div className="flex h-11 w-11 items-center justify-center rounded-full bg-[#e8eaed]">
                                        <svg viewBox="0 0 24 24" className="h-7 w-7">
                                            <path
                                                d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 3c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3zm0 14.2c-2.5 0-4.71-1.28-6-3.22.03-1.99 4-3.08 6-3.08 1.99 0 5.97 1.09 6 3.08-1.29 1.94-3.5 3.22-6 3.22z"
                                                fill="#5f6368"
                                            />
                                        </svg>
                                    </div>
                                )}
                            </div>

                            {/* Info */}
                            <div className="flex min-w-0 flex-1 flex-col gap-0.5">
                                <span className="overflow-hidden text-ellipsis whitespace-nowrap text-[15px] font-bold text-[#202124]">{account.name}</span>
                                <span className="overflow-hidden text-ellipsis whitespace-nowrap text-[13px] font-medium text-[#5f6368]">{account.email}</span>
                            </div>

                            {/* Arrow */}
                            <svg className="h-5 w-5 shrink-0 opacity-50 transition-[opacity,transform] duration-200 group-hover:translate-x-0.5 group-hover:opacity-80" viewBox="0 0 24 24">
                                <path d="M9.29 6.71a1 1 0 0 0 0 1.41L13.17 12l-3.88 3.88a1 1 0 1 0 1.41 1.41l4.59-4.59a1 1 0 0 0 0-1.41L10.7 6.7a1 1 0 0 0-1.41.01z" fill="#9aa0a6" />
                            </svg>
                        </button>
                    ))}

                    {/* Use another account */}
                    <button className="mt-2 flex w-full items-center gap-3.5 rounded-xl border-2 border-dashed border-[#d2d6e8] bg-transparent px-4 py-3.5 text-left font-inherit transition-colors duration-200 hover:border-[#a8b0cc] hover:bg-[#f5f7ff]" onClick={handleUseAnotherAccount}>
                        <div className="h-11 w-11 shrink-0">
                            <div className="flex h-11 w-11 items-center justify-center rounded-full border-2 border-[#c2c6d6] bg-white">
                                <svg viewBox="0 0 24 24" className="h-5.5 w-5.5">
                                    <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z" fill="#5f6368" />
                                </svg>
                            </div>
                        </div>
                        <div className="flex min-w-0 flex-1 flex-col gap-0.5">
                            <span className="overflow-hidden text-ellipsis whitespace-nowrap text-[15px] font-bold text-[#202124]">Use another account</span>
                        </div>
                    </button>
                </div>

                {/* Disclaimer */}
                <div className="border-t border-[#e8eaed] px-8 pb-5 pt-4 max-[520px]:px-5 max-[520px]:pb-4 max-[520px]:pt-3">
                    <p className="m-0 text-[12.5px] leading-[1.6] text-[#5f6368]">
                        To continue, Google will share your name, email address,
                        language preference, and profile picture with <strong className="font-bold text-[#202124]">Flowise</strong>.
                        Before using this app, you can review Flowise's{' '}
                        <a href="#" className="font-semibold text-[#0058be] no-underline hover:underline">privacy policy</a> and{' '}
                        <a href="#" className="font-semibold text-[#0058be] no-underline hover:underline">terms of service</a>.
                    </p>
                </div>

                {/* Card Footer Links */}
                <div className="flex items-center justify-between border-t border-[#e8eaed] bg-[#fafbff] px-8 py-3.5 max-[520px]:flex-col max-[520px]:gap-2 max-[520px]:px-5 max-[520px]:py-3">
                    <span className="text-[11px] font-bold uppercase tracking-[0.04em] text-[#5f6368]">ENGLISH (UNITED STATES)</span>
                    <div className="flex gap-4">
                        <a href="#" className="text-[11px] font-bold uppercase tracking-[0.04em] text-[#5f6368] no-underline transition-colors duration-150 hover:text-[#0058be]">HELP</a>
                        <a href="#" className="text-[11px] font-bold uppercase tracking-[0.04em] text-[#5f6368] no-underline transition-colors duration-150 hover:text-[#0058be]">PRIVACY</a>
                        <a href="#" className="text-[11px] font-bold uppercase tracking-[0.04em] text-[#5f6368] no-underline transition-colors duration-150 hover:text-[#0058be]">TERMS</a>
                    </div>
                </div>
            </div>

            {/* ── Page Footer ── */}
            <footer className="mt-auto flex w-full max-w-250 items-center justify-between px-6 pb-5 pt-8 max-[520px]:flex-col max-[520px]:gap-2 max-[520px]:text-center">
                <span className="text-base font-black tracking-[-0.03em] text-[#141b2b]">Flowise</span>
                <span className="text-xs font-semibold uppercase tracking-[0.08em] text-[#9aa0a6]">© 2024 FLOWISEAI INC.</span>
                <div className="flex gap-6">
                    <a href="#" className="text-xs font-bold uppercase tracking-[0.06em] text-[#5f6368] no-underline transition-colors duration-150 hover:text-[#0058be]">PRIVACY</a>
                    <a href="#" className="text-xs font-bold uppercase tracking-[0.06em] text-[#5f6368] no-underline transition-colors duration-150 hover:text-[#0058be]">TERMS</a>
                    <a href="#" className="text-xs font-bold uppercase tracking-[0.06em] text-[#5f6368] no-underline transition-colors duration-150 hover:text-[#0058be]">HELP</a>
                </div>
            </footer>
        </div>
    );
}
