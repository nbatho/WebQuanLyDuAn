import { useState } from 'react';
import { X, Grid3X3, Lock, Users } from 'lucide-react';
import { Button } from 'antd';
import './create-space-modal.css';

interface CreateSpaceModalProps {
    isOpen: boolean;
    onClose: () => void;
    onCreate: (name: string, color: string) => void;
}

const COLORS = [
    '#e84393', '#d63031', '#e17055', '#fdcb6e', '#00b894', '#00cec9', '#0984e3', '#6c5ce7'
];

export default function CreateSpaceModal({ isOpen, onClose, onCreate }: CreateSpaceModalProps) {
    const [spaceName, setSpaceName] = useState('');
    const [selectedColor, setSelectedColor] = useState(COLORS[6]); // Default blue
    const [privacy, setPrivacy] = useState<'public' | 'private'>('public');

    if (!isOpen) return null;

    const handleCreate = () => {
        if (!spaceName.trim()) return;
        onCreate(spaceName, selectedColor);
        setSpaceName('');
        onClose();
    };

    return (
        <div className="csm-overlay" onClick={onClose}>
            <div className="csm-modal" onClick={e => e.stopPropagation()}>
                {/* Header */}
                <div className="csm-header">
                    <h2>Create New Space</h2>
                    <button className="csm-close" onClick={onClose}>
                        <X size={18} />
                    </button>
                </div>

                {/* Body */}
                <div className="csm-body">
                    {/* Space Name */}
                    <div className="csm-field">
                        <label>Space Name</label>
                        <input 
                            type="text" 
                            placeholder="e.g., Marketing, Engineering, HR"
                            value={spaceName}
                            onChange={e => setSpaceName(e.target.value)}
                            autoFocus
                        />
                    </div>

                    {/* Avatar & Color */}
                    <div className="csm-field">
                        <label>Space Avatar & Color</label>
                        <div className="csm-avatar-section">
                            <div className="csm-avatar-preview" style={{ backgroundColor: selectedColor }}>
                                <Grid3X3 size={20} color="#fff" />
                            </div>
                            <div className="csm-color-picker">
                                {COLORS.map(c => (
                                    <div 
                                        key={c}
                                        className={`csm-color-dot ${selectedColor === c ? 'csm-color-dot--active' : ''}`}
                                        style={{ backgroundColor: c }}
                                        onClick={() => setSelectedColor(c)}
                                    />
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Privacy */}
                    <div className="csm-field">
                        <label>Privacy</label>
                        <div className="csm-privacy-options">
                            <div 
                                className={`csm-privacy-card ${privacy === 'public' ? 'csm-privacy-card--active' : ''}`}
                                onClick={() => setPrivacy('public')}
                            >
                                <Users size={20} className="csm-privacy-icon" />
                                <div>
                                    <h4>Workspace</h4>
                                    <p>Anyone in this Workspace</p>
                                </div>
                            </div>
                            <div 
                                className={`csm-privacy-card ${privacy === 'private' ? 'csm-privacy-card--active' : ''}`}
                                onClick={() => setPrivacy('private')}
                            >
                                <Lock size={20} className="csm-privacy-icon" />
                                <div>
                                    <h4>Private</h4>
                                    <p>Only invited people</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <div className="csm-footer">
                    <button className="csm-btn-cancel" onClick={onClose}>Cancel</button>
                    <Button 
                        type="primary" 
                        className="csm-btn-create" 
                        onClick={handleCreate}
                        disabled={!spaceName.trim()}
                    >
                        Create Space
                    </Button>
                </div>
            </div>
        </div>
    );
}
