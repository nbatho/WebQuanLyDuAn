import { useState } from 'react';
import { X, Grid3X3, Lock, Users } from 'lucide-react';
import { Button } from 'antd';
import type { CreateSpaceModalProps } from '@/types/modal';


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
        <div
            className="fixed inset-0 z-9999 flex items-center justify-center bg-[rgba(20,27,43,0.4)] backdrop-blur-[2px]"
            onClick={onClose}
        >
            <div
                className="flex w-120 flex-col rounded-xl bg-white font-['Plus_Jakarta_Sans',sans-serif] shadow-[0_10px_40px_rgba(0,0,0,0.15)]"
                onClick={e => e.stopPropagation()}
            >
                {/* Header */}
                <div className="flex items-center justify-between border-b border-[#eef0f5] px-6 pb-4 pt-5">
                    <h2 className="m-0 text-lg font-extrabold tracking-[-0.01em] text-[#141b2b]">Create New Space</h2>
                    <button
                        className="flex h-7 w-7 cursor-pointer items-center justify-center rounded-md border-none bg-transparent text-[#9aa0a6] transition-all hover:bg-[#f0f4ff] hover:text-[#141b2b]"
                        onClick={onClose}
                    >
                        <X size={18} />
                    </button>
                </div>

                {/* Body */}
                <div className="flex flex-col gap-5 p-6">
                    {/* Space Name */}
                    <div className="flex flex-col gap-2">
                        <label className="text-xs font-bold uppercase tracking-[0.04em] text-[#5f6368]">Space Name</label>
                        <input
                            type="text"
                            className="h-10 rounded-lg border border-[#dcdfe4] px-3.5 text-sm font-medium text-[#141b2b] outline-none transition-all focus:border-[#0058be] focus:shadow-[0_0_0_3px_rgba(0,88,190,0.1)]"
                            placeholder="e.g., Marketing, Engineering, HR"
                            value={spaceName}
                            onChange={e => setSpaceName(e.target.value)}
                            autoFocus
                        />
                    </div>

                    {/* Avatar & Color */}
                    <div className="flex flex-col gap-2">
                        <label className="text-xs font-bold uppercase tracking-[0.04em] text-[#5f6368]">Space Avatar & Color</label>
                        <div className="flex items-center gap-4">
                            <div
                                className="flex h-12 w-12 items-center justify-center rounded-xl shadow-[0_2px_8px_rgba(0,0,0,0.1)]"
                                style={{ backgroundColor: selectedColor }}
                            >
                                <Grid3X3 size={20} color="#fff" />
                            </div>
                            <div className="flex flex-wrap gap-2">
                                {COLORS.map(c => (
                                    <div
                                        key={c}
                                        className={`h-6 w-6 cursor-pointer rounded-full border-2 transition-all hover:scale-110 ${selectedColor === c
                                            ? 'scale-110 border-white shadow-[0_0_0_2px_#0058be]'
                                            : 'border-transparent'
                                            }`}
                                        style={{ backgroundColor: c }}
                                        onClick={() => setSelectedColor(c)}
                                    />
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Privacy */}
                    <div className="flex flex-col gap-2">
                        <label className="text-xs font-bold uppercase tracking-[0.04em] text-[#5f6368]">Privacy</label>
                        <div className="flex gap-3">
                            <div
                                className={`flex flex-1 cursor-pointer items-start gap-2.5 rounded-lg border p-3 transition-all ${privacy === 'public'
                                    ? 'border-[#0058be] bg-[#f0f4ff]'
                                    : 'border-[#eef0f5] bg-white hover:border-[#c2c9e0]'
                                    }`}
                                onClick={() => setPrivacy('public')}
                            >
                                <Users size={20} className={privacy === 'public' ? 'mt-0.5 text-[#0058be]' : 'mt-0.5 text-[#5f6368]'} />
                                <div>
                                    <h4 className="m-0 mb-0.5 text-[13px] font-bold text-[#141b2b]">Workspace</h4>
                                    <p className="m-0 text-[11px] text-[#6b7280]">Anyone in this Workspace</p>
                                </div>
                            </div>
                            <div
                                className={`flex flex-1 cursor-pointer items-start gap-2.5 rounded-lg border p-3 transition-all ${privacy === 'private'
                                    ? 'border-[#0058be] bg-[#f0f4ff]'
                                    : 'border-[#eef0f5] bg-white hover:border-[#c2c9e0]'
                                    }`}
                                onClick={() => setPrivacy('private')}
                            >
                                <Lock size={20} className={privacy === 'private' ? 'mt-0.5 text-[#0058be]' : 'mt-0.5 text-[#5f6368]'} />
                                <div>
                                    <h4 className="m-0 mb-0.5 text-[13px] font-bold text-[#141b2b]">Private</h4>
                                    <p className="m-0 text-[11px] text-[#6b7280]">Only invited people</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <div className="flex justify-end gap-3 rounded-b-xl border-t border-[#eef0f5] bg-[#f8fafc] px-6 py-4">
                    <button
                        className="cursor-pointer rounded-md border-none bg-transparent px-4 text-[13px] font-semibold text-[#5f6368] hover:bg-[#eef0f5] hover:text-[#141b2b]"
                        onClick={onClose}
                    >
                        Cancel
                    </button>
                    <Button
                        type="primary"
                        className="h-9 rounded-md border-none bg-[#0058be] text-[13px] font-bold tracking-[0.02em] hover:bg-[#004aa0]!"
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
