import { useState } from 'react';
import { Button, Input, Checkbox } from 'antd';
import { ArrowRight, Mail, Lock, User, CheckCircle, Users, BarChart3, Blocks, GitBranch, Code } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import './auth.css';
import { useDispatch } from 'react-redux';
import type { AppDispatch } from '@/store/configureStore';
import { fetchSignIn, fetchSignUp } from '@/store/modules/auth';
export default function AuthPage() {
    const navigate = useNavigate();
    const dispatch = useDispatch<AppDispatch>();
    const [isRegister, setIsRegister] = useState(false);

    /* ── Login state ── */
    const [loginEmail, setLoginEmail] = useState('');
    const [loginPass, setLoginPass] = useState('');
    const [remember, setRemember] = useState(false);

    /* ── Register state ── */
    const [regName, setRegName] = useState('');
    const [regEmail, setRegEmail] = useState('');
    const [regPass, setRegPass] = useState('');
    const [regConfirmPass, setRegConfirmPass] = useState('');
    const [agreed, setAgreed] = useState(false);

    const handleLogin = (e: React.FormEvent) => {
        e.preventDefault();
        try {
            dispatch(fetchSignIn({ email: loginEmail, password: loginPass }));
            navigate('/home');
        } catch (error) {
            console.error('Login failed:', error);
        }

    };

    const handleRegister = (e: React.FormEvent) => {
        e.preventDefault();
        console.log('Register:', { regName, regEmail, regPass, regConfirmPass, agreed });
        try {
            dispatch(fetchSignUp({ email: regEmail, password: regPass, username: regName, name: regName }));
            navigate('/login');
        } catch (error) {
            console.error('Registration failed:', error);
        }
    };

    return (
        <div className="h-screen flex flex-col md:flex-row overflow-hidden">
            {/* ═══════ LEFT PANEL: Brand Visual (55%) ═══════ */}
            <section className="relative flex min-h-100 w-full flex-col justify-between overflow-hidden bg-[#0058be] p-10 md:h-screen md:w-[55%] md:p-14">
                {/* Decorative Geometric Shapes */}
                <div className="pointer-events-none absolute -left-20 -top-20 h-100 w-100 rounded-full bg-white opacity-5" />
                <div className="pointer-events-none absolute -right-20 top-1/2 h-62.5 w-62.5 rotate-15 bg-white opacity-[0.08]" />
                <div className="pointer-events-none absolute bottom-20 left-1/4 h-30 w-30 rounded-full bg-white opacity-10" />

                {/* Logo */}
                <div className="relative z-10">
                    <div className="flex items-center gap-1 mb-8">
                        <Link to="/" className="text-3xl font-extrabold text-white tracking-tighter no-underline">
                            Flowise
                        </Link>
                        <div className="w-3 h-3 bg-[#825100] rounded-full mt-2" />
                    </div>
                </div>

                {/* Sliding content area */}
                <div className="relative z-10 flex-1 flex items-center">
                    <div className="slide-panel-wrapper">
                        {/* ── LOGIN panel content ── */}
                        <div
                            className={`slide-panel-content ${!isRegister ? 'slide-active' : 'slide-exit-up'}`}
                        >
                            <div className="max-w-md">
                                <h1 className="text-4xl md:text-5xl font-bold text-white leading-[1.1] tracking-tight mb-4">
                                    Where work feels less like work.
                                </h1>
                                <p className="text-lg text-white/80 mb-8">
                                    Join 10,000+ teams managing projects with clarity and speed.
                                </p>
                                <div className="space-y-5">
                                    <div className="flex items-center gap-3">
                                        <div className="h-10 w-10 bg-white/15 rounded-lg flex items-center justify-center">
                                            <CheckCircle size={20} className="text-white" strokeWidth={2.5} />
                                        </div>
                                        <span className="text-white font-semibold text-base">Milestone tracking</span>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <div className="h-10 w-10 bg-white/15 rounded-lg flex items-center justify-center">
                                            <Users size={20} className="text-white" strokeWidth={2.5} />
                                        </div>
                                        <span className="text-white font-semibold text-base">Team collaboration</span>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <div className="h-10 w-10 bg-white/15 rounded-lg flex items-center justify-center">
                                            <BarChart3 size={20} className="text-white" strokeWidth={2.5} />
                                        </div>
                                        <span className="text-white font-semibold text-base">Real-time analytics</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* ── REGISTER panel content ── */}
                        <div
                            className={`slide-panel-content ${isRegister ? 'slide-active' : 'slide-exit-down'}`}
                        >
                            <div className="max-w-md">
                                <h1 className="text-4xl md:text-5xl font-bold text-white leading-[1.1] tracking-tight mb-5">
                                    Start Automating Today
                                </h1>
                                <div className="space-y-6">
                                    <div className="flex items-start gap-4">
                                        <div className="bg-[#2170e4] p-3 rounded-lg flex items-center justify-center">
                                            <Blocks size={22} className="text-white" strokeWidth={2.5} />
                                        </div>
                                        <div>
                                            <h3 className="text-xl font-bold text-white mb-2">100+ Integrations</h3>
                                            <p className="text-white/80 leading-relaxed">Connect your entire tech stack seamlessly with pre-built connectors for every major platform.</p>
                                        </div>
                                    </div>
                                    <div className="flex items-start gap-4">
                                        <div className="bg-[#2170e4] p-3 rounded-lg flex items-center justify-center">
                                            <GitBranch size={22} className="text-white" strokeWidth={2.5} />
                                        </div>
                                        <div>
                                            <h3 className="text-xl font-bold text-white mb-2">Visual Workflow Builder</h3>
                                            <p className="text-white/80 leading-relaxed">Design complex automation logic through an intuitive drag-and-drop interface. No code required.</p>
                                        </div>
                                    </div>
                                    <div className="flex items-start gap-4">
                                        <div className="bg-[#2170e4] p-3 rounded-lg flex items-center justify-center">
                                            <Code size={22} className="text-white" strokeWidth={2.5} />
                                        </div>
                                        <div>
                                            <h3 className="text-xl font-bold text-white mb-2">No-code logic</h3>
                                            <p className="text-white/80 leading-relaxed">Implement advanced branching, filters, and data transformations without writing a single line of script.</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Footer copyright */}
                <div className="relative z-10">
                    <p className="text-white/50 text-sm font-medium uppercase tracking-widest">© 2025 Flowise</p>
                </div>
            </section>

            {/* ═══════ RIGHT PANEL: Form (45%) ═══════ */}
            <main className="w-full md:w-[45%] h-screen bg-white flex flex-col p-6 md:p-10 overflow-hidden">
                {/* Header Actions */}
                <div className="flex justify-end mb-4">
                    {!isRegister ? (
                        <p className="text-[#424754] text-sm font-medium">
                            New here?{' '}
                            <button
                                onClick={() => setIsRegister(true)}
                                className="text-[#0058be] font-bold hover:underline bg-transparent border-0 cursor-pointer text-sm"
                            >
                                Create account
                            </button>
                        </p>
                    ) : (
                        <p className="text-[#424754] text-sm font-medium">
                            Already have an account?{' '}
                            <button
                                onClick={() => setIsRegister(false)}
                                className="text-[#0058be] font-bold hover:underline bg-transparent border-0 cursor-pointer text-sm"
                            >
                                Sign In
                            </button>
                        </p>
                    )}
                </div>

                {/* Form Container */}
                <div className="mx-auto flex w-full max-w-md grow flex-col justify-center">
                    <div className="slide-form-wrapper">
                        {/* ── LOGIN FORM ── */}
                        <div
                            className={`slide-form-content ${!isRegister ? 'slide-active' : 'slide-exit-left'}`}
                        >
                            <header className="mb-6">
                                <h2 className="text-3xl font-extrabold text-[#141b2b] tracking-tighter mb-1">
                                    Sign in
                                </h2>
                                <p className="text-[#424754] opacity-50 text-base">
                                    Welcome back. Let's get to work.
                                </p>
                            </header>

                            <form className="space-y-4" onSubmit={handleLogin}>
                                <div className="space-y-2">
                                    <label className="block text-xs font-bold text-[#141b2b] uppercase tracking-wider">
                                        Email Address
                                    </label>
                                    <Input
                                        size="large"
                                        prefix={<Mail size={18} className="text-[#424754]/40" />}
                                        placeholder="name@company.com"
                                        type="email"
                                        value={loginEmail}
                                        onChange={(e) => setLoginEmail(e.target.value)}
                                        className="h-11! bg-[#f1f3ff]! rounded-lg! border-0! text-[#141b2b]! font-medium!"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <div className="flex justify-between items-center">
                                        <label className="block text-xs font-bold text-[#141b2b] uppercase tracking-wider">
                                            Password
                                        </label>
                                        <a href="#" className="text-xs font-bold text-[#0058be] hover:underline no-underline">
                                            Forgot?
                                        </a>
                                    </div>
                                    <Input.Password
                                        size="large"
                                        prefix={<Lock size={18} className="text-[#424754]/40" />}
                                        placeholder="••••••••"
                                        value={loginPass}
                                        onChange={(e) => setLoginPass(e.target.value)}
                                        className="h-11! bg-[#f1f3ff]! rounded-lg! border-0! text-[#141b2b]! font-medium!"
                                    />
                                </div>

                                <div className="py-1">
                                    <Checkbox
                                        checked={remember}
                                        onChange={(e) => setRemember(e.target.checked)}
                                        className="text-sm! font-semibold! text-[#424754]!"
                                    >
                                        Remember this device
                                    </Checkbox>
                                </div>

                                <Button
                                    type="primary"
                                    htmlType="submit"
                                    size="large"
                                    block
                                    className="group h-12! rounded-lg! font-bold! text-base! border-0! flex! items-center! justify-center! gap-2!"
                                >
                                    <span>Sign into Dashboard</span>
                                    <ArrowRight size={18} className="transition-transform group-hover:translate-x-1" />
                                </Button>

                                <div className="relative py-2 flex items-center">
                                    <div className="grow border-t border-[#c2c6d6]" />
                                    <span className="mx-4 shrink text-xs font-black uppercase tracking-widest text-[#424754]/40">or</span>
                                    <div className="grow border-t border-[#c2c6d6]" />
                                </div>

                                <Button
                                    size="large"
                                    block
                                    onClick={() => navigate('/google-login')}
                                    className="h-12! bg-[#f1f3ff]! text-[#141b2b]! rounded-lg! font-bold! text-base! border-0! flex! items-center! justify-center! gap-3! hover:bg-[#e1e8fd]!"
                                >
                                    <svg className="w-6 h-6" viewBox="0 0 24 24">
                                        <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                                        <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                                        <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05" />
                                        <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                                    </svg>
                                    <span>Continue with Google</span>
                                </Button>
                            </form>
                        </div>

                        {/* ── REGISTER FORM ── */}
                        <div
                            className={`slide-form-content ${isRegister ? 'slide-active' : 'slide-exit-right'}`}
                        >
                            <header className="mb-3">
                                <h2 className="text-2xl font-extrabold text-[#141b2b] tracking-tight mb-1">
                                    Create your account
                                </h2>
                                <p className="text-[#424754] text-sm">
                                    Join 10,000+ developers building the future of automation.
                                </p>
                            </header>

                            <form className="space-y-3" onSubmit={handleRegister}>
                                <div className="space-y-1">
                                    <label className="block text-xs font-bold text-[#424754] uppercase tracking-widest">
                                        Full Name
                                    </label>
                                    <Input
                                        size="large"
                                        prefix={<User size={16} className="text-[#727785]" />}
                                        placeholder="John Doe"
                                        value={regName}
                                        onChange={(e) => setRegName(e.target.value)}
                                        className="h-10! bg-white! rounded-lg! border-2! border-[#c2c6d6]! focus-within:border-[#0058be]! transition-colors!"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <label className="block text-xs font-bold text-[#424754] uppercase tracking-widest">
                                        Email Address
                                    </label>
                                    <Input
                                        size="large"
                                        prefix={<Mail size={16} className="text-[#727785]" />}
                                        placeholder="name@company.com"
                                        type="email"
                                        value={regEmail}
                                        onChange={(e) => setRegEmail(e.target.value)}
                                        className="h-12! bg-white! rounded-lg! border-2! border-[#c2c6d6]! focus-within:border-[#0058be]! transition-colors!"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <label className="block text-xs font-bold text-[#424754] uppercase tracking-widest">
                                        Password
                                    </label>
                                    <Input.Password
                                        size="large"
                                        prefix={<Lock size={16} className="text-[#727785]" />}
                                        placeholder="••••••••"
                                        value={regPass}
                                        onChange={(e) => setRegPass(e.target.value)}
                                        className="h-12! bg-white! rounded-lg! border-2! border-[#c2c6d6]! focus-within:border-[#0058be]! transition-colors!"
                                    />
                                    <p className="text-xs text-[#424754]">Must be at least 8 characters with a symbol.</p>
                                </div>
                                <div className="space-y-2">
                                    <label className="block text-xs font-bold text-[#424754] uppercase tracking-widest">
                                        Confirm Password
                                    </label>
                                    <Input.Password
                                        size="large"
                                        prefix={<Lock size={16} className="text-[#727785]" />}
                                        placeholder="••••••••"
                                        value={regConfirmPass}
                                        onChange={(e) => setRegConfirmPass(e.target.value)}
                                        className="h-12! bg-white! rounded-lg! border-2! border-[#c2c6d6]! focus-within:border-[#0058be]! transition-colors!"
                                    />
                                    <p className="text-xs text-[#424754]">Must be at least 8 characters with a symbol.</p>
                                </div>

                                <div className="py-1">
                                    <Checkbox
                                        checked={agreed}
                                        onChange={(e) => setAgreed(e.target.checked)}
                                        className="text-sm! text-[#424754]!"
                                    >
                                        I agree to the <a href="#" className="text-[#0058be] hover:underline">Terms of Service</a> and <a href="#" className="text-[#0058be] hover:underline">Privacy Policy</a>.
                                    </Checkbox>
                                </div>

                                <Button
                                    type="primary"
                                    htmlType="submit"
                                    size="large"
                                    block
                                    className="h-11! rounded-lg! font-bold! text-sm! border-0!"
                                >
                                    Create Account
                                </Button>
                            </form>

                            {/* Social register */}
                            <div className="mt-4 pt-3 border-t border-[#e1e8fd] text-center">
                                <p className="text-xs font-medium text-[#424754] mb-2">Or register with</p>
                                <Button
                                    size="middle"
                                    block
                                    onClick={() => navigate('/google-login')}
                                    className="h-10! bg-[#f1f3ff]! rounded-lg! font-bold! border-0! flex! items-center! justify-center! gap-2! hover:bg-[#e1e8fd]!"
                                >
                                    <svg className="w-5 h-5" viewBox="0 0 24 24">
                                        <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                                        <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                                        <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05" />
                                        <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                                    </svg>
                                    Continue with Google
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <div className="mt-auto pt-3 text-center">
                    <p className="text-[#424754]/40 text-[10px] uppercase font-bold tracking-[0.2em]">
                        Enterprise ready • SOC2 Compliant • 256-bit Encryption
                    </p>
                </div>
            </main>
        </div>
    );
}
