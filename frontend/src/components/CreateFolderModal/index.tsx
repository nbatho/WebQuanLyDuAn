import { useState } from 'react';
import { FolderPlus, X } from 'lucide-react';
import './create-folder-modal.css';

interface CreateFolderModalProps {
    isOpen: boolean;
    onClose: () => void;
    onCreate: (name: string) => void;
    spaceName: string;
}

export default function CreateFolderModal({ isOpen, onClose, onCreate, spaceName }: CreateFolderModalProps) {
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
        <div className="cfm-overlay" onClick={onClose}>
            <div className="cfm-modal" onClick={e => e.stopPropagation()}>
                <div className="cfm-header">
                    <div className="cfm-header-left">
                        <FolderPlus size={18} className="cfm-header-icon" />
                        <h2 className="cfm-title">Create a Folder</h2>
                    </div>
                    <button className="cfm-close" onClick={onClose}><X size={18} /></button>
                </div>

                <p className="cfm-subtitle">
                    A Folder is used to organize Lists within <strong>{spaceName}</strong>
                </p>

                <div className="cfm-form">
                    <label className="cfm-label">Folder name</label>
                    <input
                        className="cfm-input"
                        placeholder="e.g. Sprint 1, Phase 2, Design..."
                        value={name}
                        onChange={e => setName(e.target.value)}
                        onKeyDown={e => e.key === 'Enter' && handleCreate()}
                        autoFocus
                    />
                </div>

                <div className="cfm-footer">
                    <button className="cfm-btn-cancel" onClick={onClose}>Cancel</button>
                    <button className="cfm-btn-create" onClick={handleCreate} disabled={!name.trim()}>Create Folder</button>
                </div>
            </div>
        </div>
    );
}
