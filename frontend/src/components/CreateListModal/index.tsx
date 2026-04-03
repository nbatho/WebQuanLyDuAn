import { useState } from 'react';
import { List, X } from 'lucide-react';
import './create-list-modal.css';

interface CreateListModalProps {
    isOpen: boolean;
    onClose: () => void;
    onCreate: (name: string) => void;
    folderName: string;
}

export default function CreateListModal({ isOpen, onClose, onCreate, folderName }: CreateListModalProps) {
    const [name, setName] = useState('');

    if (!isOpen) return null;

    const handleCreate = () => {
        if (name.trim()) {
            onCreate(name.trim());
            setName('');
            onClose();
        }
    };

    return (
        <div className="clm-overlay" onClick={onClose}>
            <div className="clm-modal" onClick={e => e.stopPropagation()}>
                <div className="clm-header">
                    <div className="clm-header-left">
                        <List size={18} className="clm-header-icon" />
                        <h2 className="clm-title">Create a List</h2>
                    </div>
                    <button className="clm-close" onClick={onClose}><X size={18} /></button>
                </div>

                <p className="clm-subtitle">
                    Add a List to <strong>{folderName}</strong>
                </p>

                <div className="clm-form">
                    <label className="clm-label">List name</label>
                    <input
                        className="clm-input"
                        placeholder="e.g. Frontend Tasks, Backend Tasks..."
                        value={name}
                        onChange={e => setName(e.target.value)}
                        onKeyDown={e => e.key === 'Enter' && handleCreate()}
                        autoFocus
                    />
                </div>

                <div className="clm-footer">
                    <button className="clm-btn-cancel" onClick={onClose}>Cancel</button>
                    <button className="clm-btn-create" onClick={handleCreate} disabled={!name.trim()}>Create List</button>
                </div>
            </div>
        </div>
    );
}
