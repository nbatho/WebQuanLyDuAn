import { useEffect, useState } from 'react';
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
    const currentUserEmail = signIn?.user?.email;

    useEffect(() => {
        if (!token) {
            message.error('Token không hợp lệ!');
            navigate('/');
            return;
        }
        dispatch(fetchVerifyInvitation(token));
    }, [dispatch, token, navigate]);

    const [hasAutoAccepted, setHasAutoAccepted] = useState(false);

    useEffect(() => {
        if (!invitationInfo || isVerifying) return;

        if (isAuthenticated) {
            if (currentUserEmail && currentUserEmail === invitationInfo.email) {

                if (!hasAutoAccepted) {
                    setHasAutoAccepted(true);
                    handleAccept(); 
                }

            } else if (currentUserEmail && currentUserEmail !== invitationInfo.email) {
                message.warning(`Lời mời này dành cho ${invitationInfo.email}. Vui lòng đổi tài khoản.`);
                navigate('/');
            }
        } else {
            if (invitationInfo.isUserExists) {
                navigate(`/login?email=${invitationInfo.email}&redirect=/join-workspace?token=${token}`);
            } else {
                navigate(`/register?email=${invitationInfo.email}&invite_token=${token}`);
            }
        }
    }, [invitationInfo, isAuthenticated, currentUserEmail, navigate, token, isVerifying, hasAutoAccepted]);

    const handleAccept = async () => {
        if (!token || !invitationInfo) return;

        if (!isAuthenticated) {
            const redirectPath = invitationInfo.isUserExists
                ? `/login?email=${invitationInfo.email}&redirect=/join-workspace?token=${token}`
                : `/register?email=${invitationInfo.email}&invite_token=${token}`;
            navigate(redirectPath);
            return;
        }

        if (currentUserEmail !== invitationInfo.email) {
            message.warning(`Lời mời này dành cho ${invitationInfo.email}. Vui lòng đổi tài khoản.`);
            navigate('/login');
            return;
        }

        try {
            await dispatch(respondToInvitations({ token, action: 'accept' })).unwrap();
            message.success('Đã tham gia dự án thành công!');
            navigate('/home');
        } catch (error: any) {
            message.error(error || 'Có lỗi xảy ra khi chấp nhận lời mời');
        }
    };

    const handleReject = async () => {
        if (!token || !invitationInfo) return;

        if (!isAuthenticated) {
            const redirectPath = invitationInfo.isUserExists
                ? `/login?email=${invitationInfo.email}&redirect=/join-workspace?token=${token}`
                : `/register?email=${invitationInfo.email}&invite_token=${token}`;
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
        } catch (error: any) {
            message.error(error || 'Có lỗi xảy ra khi từ chối lời mời');
        }
    };

    if (isVerifying || !invitationInfo) {
        return (
            <div className="flex h-screen items-center justify-center bg-[#f5f7ff]">
                <div className="text-center">
                    <Spin size="large" />
                    <h2 className="mt-4 text-lg font-bold text-[#141b2b]">Đang xác thực lời mời...</h2>
                </div>
            </div>
        );
    }
    return (
        <div className="invitation-page">
            <div className="invitation-card">
                <p className="invitation-label">Bạn được mời tham gia dự án</p>
                <h1 className="invitation-project-name">{invitationInfo.workspaceName}</h1>

                <h2 className="invitation-title">
                    Lời mời được gửi từ:
                </h2>
                <p className="invitation-email font-bold">{invitationInfo.inviterName} ({invitationInfo.inviterEmail})</p>

                <div className="invitation-actions mt-6 flex gap-4">
                    <button
                        type="button"
                        className="invitation-btn invitation-btn-accept flex-1 rounded bg-blue-600 py-2 text-white disabled:opacity-50"
                        onClick={handleAccept}
                        disabled={isResponding}
                    >
                        {isResponding ? 'Đang xử lý...' : 'Chấp nhận'}
                    </button>
                    <button
                        type="button"
                        className="invitation-btn invitation-btn-reject flex-1 rounded border border-red-500 py-2 text-red-500 disabled:opacity-50"
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