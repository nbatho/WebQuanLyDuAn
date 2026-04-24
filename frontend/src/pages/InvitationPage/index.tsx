
import { useSearchParams } from 'react-router';
import './InvitationPage.css';

export default function InvitationPage() {
    const projectName = 'WebQuanLyDuAn';
    const inviterEmail = 'owner@example.com';
    const [searchParams] = useSearchParams();
    const token = searchParams.get('token');
    const handleAccept = () => {
        console.log('Invitation accepted', token);
    };

    const handleReject = () => {
        console.log('Invitation rejected');
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