
import { useNavigate, useSearchParams } from 'react-router';
import './InvitationPage.css';
import type { AppDispatch } from '@/store/configureStore';
import { useAppDispatch } from '@/hooks';
import { respondToInvitation } from '@/api/workspaces';
import { useSelector } from 'react-redux';
import type { RootState } from '@/store/configureStore';
export default function InvitationPage() {
    const projectName = 'WebQuanLyDuAn';
    const inviterEmail = 'owner@example.com';
    const [searchParams] = useSearchParams();
    const token = searchParams.get('token');
    const dispatch = useAppDispatch<AppDispatch>();
    const isRespondingInvitation = useSelector((state : RootState) => state.workspaces.isRespondingInvitation);
    const navigate = useNavigate();
    const handleAccept = async () => {
        dispatch(respondToInvitation(token || '', 'accept') as any);
        if (isRespondingInvitation) {
            navigate('/workspaces');
        }
    };
    const handleReject = async () => {
        dispatch(respondToInvitation(token || '', 'reject') as any);
        if (isRespondingInvitation) {
            navigate('/workspaces');
        }
    };
    

    return (
        <div className="invitation-page">
            <div className="invitation-card">
                <p className="invitation-label">Current Project</p>
                <h1 className="invitation-project-name">{projectName}</h1>

                <h2 className="invitation-title">
                    You have an invitations from user with email
                </h2>
                <p className="invitation-email">{inviterEmail}</p>

                <div className="invitation-actions">
                    <button
                        type="button"
                        className="invitation-btn invitation-btn-accept"
                        onClick={handleAccept}
                    >
                        Accept
                    </button>
                    <button
                        type="button"
                        className="invitation-btn invitation-btn-reject"
                        onClick={handleReject}
                    >
                        Reject
                    </button>
                </div>
            </div>
        </div>
    );
}