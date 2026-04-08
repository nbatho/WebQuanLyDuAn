import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { GoogleOAuthProvider, GoogleLogin } from '@react-oauth/google';
import { signInWithGoogle } from '../../../api/auth';

const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID as string | undefined;

function GoogleLoginContent() {
    const navigate = useNavigate();
    const [error, setError] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    const handleCredential = async (credential: string) => {
        setError(null);
        setIsLoading(true);
        try {
            const result = await signInWithGoogle(credential);
            const accessToken = result?.user?.access_token;
            if (!accessToken) throw new Error('Khong nhan duoc access token');
            localStorage.setItem('access_token', accessToken);
            navigate('/workspace-setup');
        } catch (err: unknown) {
            const msg = err instanceof Error ? err.message : 'Dang nhap Google that bai';
            setError(msg);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="flex min-h-screen items-center justify-center bg-[#f0f4ff] p-5 font-['Plus_Jakarta_Sans','Roboto',Arial,sans-serif]">
            <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-[0_1px_3px_rgba(0,0,0,0.04),0_4px_24px_rgba(0,88,190,0.06)]">
                <h1 className="mb-2 text-center text-2xl font-black tracking-tight text-[#141b2b]">
                    Continue with Google
                </h1>
                <p className="mb-6 text-center text-sm text-[#5f6368]">
                    Use your Google account to sign in to{' '}
                    <Link to="/" className="font-semibold text-[#0058be] no-underline hover:underline">
                        Flowise
                    </Link>
                </p>
                <div className="flex justify-center">
                    <GoogleLogin
                        onSuccess={(credentialResponse) => {
                            if (!credentialResponse.credential) {
                                setError('Google khong tra ve credential');
                                return;
                            }
                            void handleCredential(credentialResponse.credential);
                        }}
                        onError={() => setError('Google login bi huy hoac that bai')}
                        useOneTap={false}
                    />
                </div>
                {isLoading ? (
                    <p className="mt-4 text-center text-sm text-[#5f6368]">Dang dang nhap...</p>
                ) : null}
                {error ? <p className="mt-4 text-center text-sm font-medium text-[#e74c3c]">{error}</p> : null}
            </div>
        </div>
    );
}

export default function GoogleLoginPage() {
    if (!GOOGLE_CLIENT_ID) {
        return (
            <div className="flex min-h-screen items-center justify-center bg-[#f0f4ff] p-5">
                <div className="w-full max-w-md rounded-xl bg-white p-6 text-center shadow">
                    <h2 className="mb-2 text-lg font-bold text-[#141b2b]">Google login chua cau hinh</h2>
                    <p className="text-sm text-[#5f6368]">
                        Thieu bien <code>VITE_GOOGLE_CLIENT_ID</code> trong frontend/.env
                    </p>
                </div>
            </div>
        );
    }

    return (
        <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
            <GoogleLoginContent />
        </GoogleOAuthProvider>
    );
}
