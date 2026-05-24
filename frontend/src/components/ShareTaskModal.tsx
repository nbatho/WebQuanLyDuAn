import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchShareableUsers, fetchShareTask, clearShareTaskState } from '@/store/modules/tasks';
import type { AppDispatch, RootState } from '@/store/configureStore';
import { X, Search, Check, Loader2, Users, Share2 } from 'lucide-react';

interface ShareTaskModalProps {
    taskId: number;
    taskName: string;
    isOpen: boolean;
    onClose: () => void;
}

export default function ShareTaskModal({ taskId, taskName, isOpen, onClose }: ShareTaskModalProps) {
    const dispatch = useDispatch<AppDispatch>();
    const {
        shareableUsers,
        isLoadingShareableUsers,
        isSharingTask,
        shareTaskSuccess,
        errorShareTask,
    } = useSelector((state: RootState) => state.tasks);

    const [selectedUserIds, setSelectedUserIds] = useState<number[]>([]);
    const [searchQuery, setSearchQuery] = useState('');

    useEffect(() => {
        if (isOpen && taskId) {
            dispatch(fetchShareableUsers(taskId));
        }
        return () => {
            dispatch(clearShareTaskState());
            setSelectedUserIds([]);
            setSearchQuery('');
        };
    }, [isOpen, taskId, dispatch]);

    useEffect(() => {
        if (shareTaskSuccess) {
            setTimeout(() => {
                onClose();
            }, 1500);
        }
    }, [shareTaskSuccess, onClose]);

    const filteredUsers = shareableUsers.filter((user) => {
        const q = searchQuery.toLowerCase();
        return (
            user.name?.toLowerCase().includes(q) ||
            user.email?.toLowerCase().includes(q) ||
            user.username?.toLowerCase().includes(q)
        );
    });

    const toggleUser = (userId: number) => {
        setSelectedUserIds((prev) =>
            prev.includes(userId) ? prev.filter((id) => id !== userId) : [...prev, userId]
        );
    };

    const handleShare = () => {
        if (selectedUserIds.length === 0) return;
        dispatch(fetchShareTask({ task_id: taskId, user_ids: selectedUserIds }));
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/40 backdrop-blur-sm">
            <div className="mx-4 flex w-full max-w-md flex-col rounded-2xl bg-white shadow-2xl">
                {/* Header */}
                <div className="flex items-center justify-between border-b border-[#eef0f5] px-6 py-4">
                    <div className="flex items-center gap-2.5">
                        <Share2 size={18} className="text-[#0058be]" />
                        <h2 className="m-0 text-base font-extrabold text-[#141b2b]">Share Task</h2>
                    </div>
                    <button
                        onClick={onClose}
                        className="flex h-8 w-8 items-center justify-center rounded-lg border-none bg-transparent text-[#9aa0a6] transition-colors hover:bg-[#f0f4ff] hover:text-[#141b2b] cursor-pointer"
                    >
                        <X size={18} />
                    </button>
                </div>

                {/* Task name */}
                <div className="border-b border-[#eef0f5] px-6 py-3">
                    <p className="m-0 text-xs text-[#9aa0a6]">Chia sẻ task</p>
                    <p className="m-0 mt-0.5 text-sm font-semibold text-[#141b2b] truncate">{taskName}</p>
                </div>

                {/* Search */}
                <div className="px-6 pt-4">
                    <div className="relative">
                        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#9aa0a6]" />
                        <input
                            type="text"
                            placeholder="Tìm kiếm theo tên, email..."
                            className="w-full rounded-lg border border-[#dcdfe4] bg-[#f8f9fb] py-2.5 pl-10 pr-3 text-sm text-[#141b2b] outline-none transition-all focus:border-[#0058be] focus:bg-white focus:shadow-[0_0_0_3px_rgba(0,88,190,0.08)]"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                </div>

                {/* User list */}
                <div className="max-h-72 min-h-[120px] overflow-y-auto px-6 py-3">
                    {isLoadingShareableUsers ? (
                        <div className="flex items-center justify-center py-10">
                            <Loader2 size={24} className="animate-spin text-[#0058be]" />
                        </div>
                    ) : filteredUsers.length === 0 ? (
                        <div className="flex flex-col items-center justify-center gap-2 py-10 text-center">
                            <Users size={32} className="text-[#dcdfe4]" />
                            <p className="m-0 text-sm text-[#9aa0a6]">
                                {shareableUsers.length === 0
                                    ? 'Tất cả thành viên đã được gán vào task này'
                                    : 'Không tìm thấy thành viên phù hợp'}
                            </p>
                        </div>
                    ) : (
                        <div className="flex flex-col gap-1">
                            {filteredUsers.map((user) => {
                                const isSelected = selectedUserIds.includes(user.user_id);
                                return (
                                    <button
                                        key={user.user_id}
                                        onClick={() => toggleUser(user.user_id)}
                                        className={`flex w-full items-center gap-3 rounded-lg border-none px-3 py-2.5 text-left transition-all cursor-pointer ${
                                            isSelected
                                                ? 'bg-[#eff6ff] ring-1 ring-[#0058be]/20'
                                                : 'bg-transparent hover:bg-[#f8f9fb]'
                                        }`}
                                    >
                                        {/* Avatar */}
                                        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#e8eaee] text-xs font-bold text-[#5f6368] overflow-hidden">
                                            {user.avatar_url ? (
                                                <img src={user.avatar_url} alt={user.name} className="h-full w-full object-cover" />
                                            ) : (
                                                (user.name || user.username || 'U').charAt(0).toUpperCase()
                                            )}
                                        </div>

                                        {/* Info */}
                                        <div className="flex flex-1 flex-col min-w-0">
                                            <span className="text-sm font-semibold text-[#141b2b] truncate">
                                                {user.name || user.username}
                                            </span>
                                            <span className="text-xs text-[#9aa0a6] truncate">{user.email}</span>
                                        </div>

                                        {/* Checkbox */}
                                        <div
                                            className={`flex h-5 w-5 shrink-0 items-center justify-center rounded border transition-all ${
                                                isSelected
                                                    ? 'border-[#0058be] bg-[#0058be] text-white'
                                                    : 'border-[#dcdfe4] bg-white'
                                            }`}
                                        >
                                            {isSelected && <Check size={12} />}
                                        </div>
                                    </button>
                                );
                            })}
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div className="flex items-center justify-between border-t border-[#eef0f5] px-6 py-4">
                    <div className="text-xs text-[#9aa0a6]">
                        {selectedUserIds.length > 0
                            ? `Đã chọn ${selectedUserIds.length} thành viên`
                            : 'Chọn thành viên để chia sẻ'}
                    </div>

                    <div className="flex items-center gap-2">
                        {shareTaskSuccess && (
                            <span className="flex items-center gap-1 text-xs font-semibold text-[#059669]">
                                <Check size={14} />
                                Đã chia sẻ!
                            </span>
                        )}
                        {errorShareTask && (
                            <span className="text-xs text-[#dc2626]">{errorShareTask}</span>
                        )}
                        <button
                            onClick={onClose}
                            className="rounded-lg border border-[#dcdfe4] bg-white px-4 py-2 text-[13px] font-semibold text-[#5f6368] transition-colors hover:bg-[#f8f9fb] cursor-pointer"
                        >
                            Hủy
                        </button>
                        <button
                            onClick={handleShare}
                            disabled={selectedUserIds.length === 0 || isSharingTask || shareTaskSuccess}
                            className="flex items-center gap-1.5 rounded-lg border-none bg-[#0058be] px-4 py-2 text-[13px] font-bold text-white transition-colors hover:bg-[#004aab] disabled:cursor-not-allowed disabled:opacity-60 cursor-pointer"
                        >
                            {isSharingTask ? (
                                <>
                                    <Loader2 size={14} className="animate-spin" />
                                    Đang chia sẻ...
                                </>
                            ) : (
                                <>
                                    <Share2 size={14} />
                                    Chia sẻ
                                </>
                            )}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
