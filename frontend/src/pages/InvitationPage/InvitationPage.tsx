import { useEffect, useCallback, useRef } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom'; // Đổi thành react-router-dom nếu bị lỗi
import { useSelector } from 'react-redux';
import { message, Spin } from 'antd';

import './InvitationPage.css';
import type { AppDispatch, RootState } from '@/store/configureStore';
import { useAppDispatch } from '@/hooks';
import { fetchVerifyInvitation, respondToInvitations } from '@/store/modules/workspaces';

export default function InvitationPage() {
    const [searchParams] = useSearchParams();
    const token = searchParams.get('token');
    const navigate = useNavigate();
    const dispatch = useAppDispatch<AppDispatch>();

    const isVerifying = useSelector((state: RootState) => state.workspaces.isVerifyingInvitation);
    const isResponding = useSelector((state: RootState) => state.workspaces.isRespondingInvitation);
    const invitationInfo = useSelector((state: RootState) => state.workspaces.verifyInvitationData);

    const { access_token, signIn } = useSelector((state: RootState) => state.auth);

    const isAuthenticated = !!access_token;
    
    let currentUserEmail = signIn?.user?.email;
    if (!currentUserEmail && access_token) {
        try {
            const payload = access_token.split('.')[1];
            if (payload) {
                const base64 = payload.replace(/-/g, '+').replace(/_/g, '/');
                const jsonPayload = decodeURIComponent(
                    atob(base64)
                        .split('')
                        .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
                        .join('')
                );
                const decoded = JSON.parse(jsonPayload);
                currentUserEmail = decoded.email;
            }
        } catch (error) {
            console.error("Failed to decode token", error);
        }
    }

    const hasAutoAccepted = useRef(false);

    useEffect(() => {
        if (!token) {
            message.error('Token không hợp lệ!');
            navigate('/');
            return;
        }
        dispatch(fetchVerifyInvitation(token));
    }, [dispatch, token, navigate]);

    const handleAccept = useCallback(async () => {
        if (!token || !invitationInfo) return;

        if (!isAuthenticated) {
            const redirectPath = invitationInfo.isUserExists
                ? `/login?inviteToken=${token}`
                : `/register?inviteToken=${token}`;
            navigate(redirectPath);
            return;
        }

        if (currentUserEmail !== invitationInfo.email) {
            message.warning(`Lời mời này dành cho ${invitationInfo.email}. Vui lòng đổi tài khoản.`);
            navigate(`/login?inviteToken=${token}`);
            return;
        }

        try {
            await dispatch(respondToInvitations({ token, action: 'accept' })).unwrap();
            message.success('Đã tham gia dự án thành công!');
            navigate('/home');
        } catch (error: unknown) {
            const msg = typeof error === 'string' ? error : 'Có lỗi xảy ra khi chấp nhận lời mời';
            message.error(msg);
        }
    }, [token, invitationInfo, isAuthenticated, currentUserEmail, navigate, dispatch]);

    useEffect(() => {
        if (!invitationInfo || isVerifying) return;
        if (isAuthenticated) {
            if (currentUserEmail && currentUserEmail === invitationInfo.email) {

                if (!hasAutoAccepted.current) {
                    hasAutoAccepted.current = true;
                    handleAccept(); 
                }

            } else if (currentUserEmail && currentUserEmail !== invitationInfo.email) {
                message.warning(`Lời mời này dành cho ${invitationInfo.email}. Vui lòng đổi tài khoản.`);
                navigate(`/login?inviteToken=${token}`);
            }
        } else {
            if (invitationInfo.isUserExists) {
                navigate(`/login?inviteToken=${token}`);
            } else {
                navigate(`/register?inviteToken=${token}`);
            }
        }
    }, [invitationInfo, isAuthenticated, currentUserEmail, navigate, token, isVerifying, handleAccept]);

    const handleReject = async () => {
        if (!token || !invitationInfo) return;

        if (!isAuthenticated) {
            const redirectPath = invitationInfo.isUserExists
                ? `/login?inviteToken=${token}`
                : `/register?inviteToken=${token}`;
            navigate(redirectPath);
            return;
        }

        if (currentUserEmail !== invitationInfo.email) {
            message.warning(`Lời mời này dành cho ${invitationInfo.email}. Vui lòng đổi tài khoản.`);
            navigate('/login');
            return;
        }

        try {
            await dispatch(respondToInvitations({ token, action: 'reject' })).unwrap();
            message.info('Bạn đã từ chối lời mời.');
            navigate('/home');
        } catch (error: unknown) {
            const msg = typeof error === 'string' ? error : 'Có lỗi xảy ra khi từ chối lời mời';
            message.error(msg);
        }
    };

    const willAutoAccept = isAuthenticated && !!currentUserEmail && currentUserEmail === invitationInfo?.email;

    if (isVerifying || !invitationInfo || willAutoAccept || isResponding) {
        return (
            <div className="flex h-screen items-center justify-center bg-[#f5f7ff]">
                <div className="text-center">
                    <Spin size="large" />
                    <h2 className="mt-4 text-lg font-bold text-[#141b2b]">
                        {isVerifying ? 'Đang xác thực lời mời...' : 'Đang xử lý tham gia...'}
                    </h2>
                </div>
            </div>
        );
    }
    return (
        <div className="invitation-page">
            <div className="invitation-card">
                <p className="invitation-label">Bạn được mời tham gia dự án</p>
                <h1 className="invitation-project-name">{invitationInfo.workspaceName || 'Floswise Workspace'}</h1>

                <h2 className="invitation-title">
                    Lời mời được gửi từ:
                </h2>
                <p className="invitation-email font-bold">{invitationInfo.inviterName || 'Admin'} ({invitationInfo.inviterEmail || invitationInfo.email})</p>

                <div className="invitation-actions mt-6 flex gap-4">
                    <button
                        type="button"
                        className="invitation-btn invitation-btn-accept flex-1 rounded bg-blue-600 py-2 text-white disabled:opacity-50 hover:bg-blue-700 transition-colors"
                        onClick={handleAccept}
                        disabled={isResponding}
                    >
                        Chấp nhận
                    </button>
                    <button
                        type="button"
                        className="invitation-btn invitation-btn-reject flex-1 rounded border border-red-500 py-2 text-red-500 disabled:opacity-50 hover:bg-red-50 transition-colors"
                        onClick={handleReject}
                        disabled={isResponding}
                    >
                        Từ chối
                    </button>
                </div>
            </div>
        </div>
    );
}