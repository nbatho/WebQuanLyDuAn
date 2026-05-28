import { useEffect, useCallback, useRef } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { message } from 'antd';

import './InvitationPage.css';
import type { AppDispatch, RootState } from '@/store/configureStore';
import { useAppDispatch } from '@/hooks';
import { fetchVerifyInvitation, respondToInvitations } from '@/store/modules/workspaces';
import { CheckCircle2, XCircle, Mail, Shield, Users } from 'lucide-react';

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

    // ── Loading State ──
    if (isVerifying || !invitationInfo || willAutoAccept || isResponding) {
        return (
            <div className="inv-page">
                <div className="inv-bg">
                    <div className="inv-bg-shape inv-bg-shape--1" />
                    <div className="inv-bg-shape inv-bg-shape--2" />
                </div>
                <div className="inv-loading-card">
                    <div className="inv-loading-spinner" />
                    <h2 className="inv-loading-text">
                        {isVerifying ? 'Đang xác thực lời mời...' : 'Đang xử lý tham gia...'}
                    </h2>
                    <p className="inv-loading-sub">Vui lòng chờ trong giây lát</p>
                </div>
            </div>
        );
    }

    // ── Main UI ──
    const workspaceInitial = (invitationInfo.workspaceName || 'W')[0].toUpperCase();

    return (
        <div className="inv-page">
            <div className="inv-bg">
                <div className="inv-bg-shape inv-bg-shape--1" />
                <div className="inv-bg-shape inv-bg-shape--2" />
                <div className="inv-bg-shape inv-bg-shape--3" />
            </div>

            <div className="inv-card">
                {/* Header decoration */}
                <div className="inv-card-deco" />

                {/* Workspace Avatar */}
                <div className="inv-workspace-avatar">
                    <span>{workspaceInitial}</span>
                </div>

                {/* Label */}
                <div className="inv-label">
                    <Users size={14} />
                    <span>Lời mời tham gia dự án</span>
                </div>

                {/* Workspace Name */}
                <h1 className="inv-workspace-name">
                    {invitationInfo.workspaceName || 'Floswise Workspace'}
                </h1>

                {/* Inviter Info */}
                <div className="inv-inviter-section">
                    <div className="inv-inviter-card">
                        <div className="inv-inviter-avatar">
                            {(invitationInfo.inviterName || 'A')[0].toUpperCase()}
                        </div>
                        <div className="inv-inviter-info">
                            <span className="inv-inviter-name">
                                {invitationInfo.inviterName || 'Admin'}
                            </span>
                            <span className="inv-inviter-email">
                                <Mail size={12} />
                                {invitationInfo.inviterEmail || invitationInfo.email}
                            </span>
                        </div>
                    </div>
                </div>

                {/* Security badge */}
                <div className="inv-security-badge">
                    <Shield size={13} />
                    <span>Lời mời được gửi cho: <strong>{invitationInfo.email}</strong></span>
                </div>

                {/* Actions */}
                <div className="inv-actions">
                    <button
                        type="button"
                        className="inv-btn inv-btn--accept"
                        onClick={handleAccept}
                        disabled={isResponding}
                    >
                        <CheckCircle2 size={18} />
                        Chấp nhận lời mời
                    </button>
                    <button
                        type="button"
                        className="inv-btn inv-btn--reject"
                        onClick={handleReject}
                        disabled={isResponding}
                    >
                        <XCircle size={18} />
                        Từ chối
                    </button>
                </div>
            </div>
        </div>
    );
}