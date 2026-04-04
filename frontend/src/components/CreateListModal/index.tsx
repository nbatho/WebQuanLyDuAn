import { useState } from 'react';
import { List, X } from 'lucide-react';

export interface CreateListModalProps {
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
        <div
            className="fixed inset-0 z-1000 flex items-center justify-center bg-black/35 backdrop-blur-[2px]"
            onClick={onClose}
        >
            <div
                className="w-115 rounded-xl bg-white shadow-[0_16px_48px_rgba(0,0,0,0.18)]"
                onClick={e => e.stopPropagation()}
            >
                <div className="flex items-center justify-between border-b border-[#eef0f5] px-5 pb-3 pt-4">
                    <div className="flex items-center gap-2">
                        <List size={18} className="text-[#7c5cfc]" />
                        <h2 className="m-0 text-base font-extrabold text-[#141b2b]">Create a List</h2>
                    </div>
                    <button
                        className="cursor-pointer rounded-md border-none bg-transparent p-1 text-[#9aa0a6] hover:bg-[#f0f2f5] hover:text-[#141b2b]"
                        onClick={onClose}
                    >
                        <X size={18} />
                    </button>
                </div>

                <p className="m-0 px-5 pb-0 pt-3 text-[13px] text-[#5f6368]">
                    Add a List to <strong>{folderName}</strong>
                </p>

                <div className="px-5 py-4">
                    <label className="mb-1.5 block text-xs font-bold text-[#5f6368]">List name</label>
                    <input
                        className="box-border w-full rounded-lg border border-[#dcdfe4] px-3 py-2.5 text-sm text-[#141b2b] outline-none transition-colors focus:border-[#7c5cfc] focus:shadow-[0_0_0_3px_rgba(124,92,252,0.1)]"
                        placeholder="e.g. Frontend Tasks, Backend Tasks..."
                        value={name}
                        onChange={e => setName(e.target.value)}
                        onKeyDown={e => e.key === 'Enter' && handleCreate()}
                        autoFocus
                    />
                </div>

                <div className="flex justify-end gap-2 border-t border-[#eef0f5] px-5 pb-4 pt-3">
                    <button
                        className="cursor-pointer rounded-lg border border-[#dcdfe4] bg-transparent px-4.5 py-2 text-[13px] font-semibold text-[#5f6368] hover:bg-[#f8fafb]"
                        onClick={onClose}
                    >
                        Cancel
                    </button>
                    <button
                        className="cursor-pointer rounded-lg border-none bg-[#7c5cfc] px-4.5 py-2 text-[13px] font-bold text-white transition-colors hover:bg-[#6b4ce0] disabled:cursor-default disabled:opacity-50"
                        onClick={handleCreate}
                        disabled={!name.trim()}
                    >
                        Create List
                    </button>
                </div>
            </div>
        </div>
    );
}
