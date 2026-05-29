import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Camera, Save, AlertCircle, CheckCircle2, Loader2, User } from 'lucide-react';
import { Avatar } from 'antd';
import type { AppDispatch, RootState } from '../../../store/configureStore';
import {
    fetchGetProfile,
    fetchUpdateProfile,
    clearUpdateProfileState,
} from '../../../store/modules/users';

export default function Profile() {
    const dispatch = useDispatch<AppDispatch>();

    const {
        profile,
        isLoadingProfile,
        profileError,
        isUpdatingProfile,
        updateProfileError,
        updateProfileSuccess,
    } = useSelector((s: RootState) => s.users);

    // Form state — chỉ name và sdt; email & role chỉ read-only
    const [name, setName] = useState('');
    const [sdt, setSdt] = useState('');

    // Load profile on mount
    useEffect(() => {
        dispatch(fetchGetProfile());
        return () => {
            dispatch(clearUpdateProfileState());
        };
    }, [dispatch]);

    // Sync form khi profile được load
     
    useEffect(() => {
        if (profile) {
            setName(profile.name ?? '');
            setSdt(profile.sdt ?? '');
        }
    }, [profile]);

    const isDirty =
        name !== (profile?.name ?? '') ||
        sdt !== (profile?.sdt ?? '');

    // Lấy chữ cái viết tắt cho Avatar fallback
    const initials = (profile?.name || profile?.username || 'U')
        .split(' ')
        .map((w) => w[0])
        .slice(0, 2)
        .join('')
        .toUpperCase();

    const handleSave = async () => {
        if (!isDirty) return;
        dispatch(clearUpdateProfileState());

        const payload: { name?: string; sdt?: string } = {};
        if (name.trim() !== (profile?.name ?? '')) payload.name = name.trim();
        if (sdt.trim() !== (profile?.sdt ?? '')) payload.sdt = sdt.trim();

        await dispatch(fetchUpdateProfile(payload));
    };

    /* ── Loading skeleton ── */
    if (isLoadingProfile && !profile) {
        return (
            <div className="flex flex-col gap-6">
                <div>
                    <div className="mb-1 h-7 w-40 animate-pulse rounded-md bg-[#e8eaed]" />
                    <div className="h-4 w-56 animate-pulse rounded-md bg-[#e8eaed]" />
                </div>
                <div className="mb-6 flex items-center gap-5 rounded-xl bg-[#f8f9fa] p-5">
                    <div className="h-18 w-18 animate-pulse rounded-full bg-[#e8eaed]" />
                    <div className="flex flex-col gap-2">
                        <div className="h-4 w-32 animate-pulse rounded bg-[#e8eaed]" />
                        <div className="h-3 w-24 animate-pulse rounded bg-[#e8eaed]" />
                    </div>
                </div>
                <div className="flex max-w-lg flex-col gap-5">
                    {[1, 2, 3, 4].map((i) => (
                        <div key={i} className="flex flex-col gap-1.5">
                            <div className="h-3.5 w-24 animate-pulse rounded bg-[#e8eaed]" />
                            <div className="h-10 w-full animate-pulse rounded-lg bg-[#e8eaed]" />
                        </div>
                    ))}
                </div>
            </div>
        );
    }

    /* ── Error state ── */
    if (profileError && !profile) {
        return (
            <div className="flex flex-col items-center justify-center gap-3 py-16 text-center">
                <AlertCircle className="h-12 w-12 text-red-300" />
                <p className="text-sm font-medium text-red-500">{profileError}</p>
                <button
                    onClick={() => dispatch(fetchGetProfile())}
                    className="rounded-lg bg-[#0058be] px-4 py-2 text-sm font-semibold text-white hover:bg-[#004aab]"
                >
                    Thử lại
                </button>
            </div>
        );
    }

    /* ── No profile ── */
    if (!profile) {
        return (
            <div className="flex flex-col items-center justify-center gap-3 py-16 text-center">
                <User className="h-12 w-12 text-[#dcdfe4]" />
                <p className="text-sm font-medium text-[#9aa0a6]">Không tìm thấy thông tin người dùng.</p>
            </div>
        );
    }

    return (
        <div className="flex flex-col gap-6">
            {/* Header */}
            <div>
                <h2 className="mb-1 text-xl font-extrabold text-[#141b2b]">Profile Settings</h2>
                <p className="text-[13px] text-[#9aa0a6]">Quản lý thông tin cá nhân của bạn</p>
            </div>

            {/* Avatar card */}
            <div className="flex items-center gap-5 rounded-xl border border-[#e8eaed] bg-[#f8f9fa] p-5">
                <div className="relative shrink-0">
                    {profile.avatar_url ? (
                        <img
                            src={profile.avatar_url}
                            alt={profile.name}
                            className="h-[72px] w-[72px] rounded-full object-cover"
                        />
                    ) : (
                        <Avatar
                            size={72}
                            style={{
                                backgroundColor: '#4285F4',
                                fontSize: '24px',
                                fontWeight: 'bold',
                            }}
                        >
                            {initials}
                        </Avatar>
                    )}
                    <button
                        type="button"
                        title="Đổi ảnh đại diện (tính năng sắp ra mắt)"
                        disabled
                        className="absolute bottom-0 right-0 flex h-[26px] w-[26px] cursor-not-allowed items-center justify-center rounded-full border-2 border-white bg-[#0058be] text-white opacity-60"
                    >
                        <Camera size={14} />
                    </button>
                </div>
                <div>
                    <p className="m-0 text-base font-extrabold text-[#141b2b]">{profile.name}</p>
                    <p className="mt-0.5 text-[13px] text-[#9aa0a6]">@{profile.username}</p>
                </div>
            </div>

            {/* Form */}
            <div className="flex max-w-lg flex-col gap-5">
                {/* Full Name */}
                <div className="flex flex-col gap-1.5">
                    <label htmlFor="profile-name" className="text-xs font-bold text-[#5f6368]">
                        Họ và tên <span className="text-red-500">*</span>
                    </label>
                    <input
                        id="profile-name"
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Nhập họ và tên..."
                        className="rounded-lg border border-[#dcdfe4] bg-white px-3 py-2.5 text-sm text-[#141b2b] outline-none transition-all duration-150 focus:border-[#0058be] focus:shadow-[0_0_0_3px_rgba(0,88,190,0.08)]"
                    />
                </div>

                {/* Email — read-only */}
                <div className="flex flex-col gap-1.5">
                    <label htmlFor="profile-email" className="text-xs font-bold text-[#5f6368]">
                        Email
                    </label>
                    <div className="relative">
                        <input
                            id="profile-email"
                            type="email"
                            value={profile.email}
                            readOnly
                            className="w-full cursor-not-allowed rounded-lg border border-[#dcdfe4] bg-[#f8f9fa] px-3 py-2.5 text-sm text-[#9aa0a6] outline-none"
                        />
                        <span className="absolute right-3 top-1/2 -translate-y-1/2 rounded bg-[#e8eaed] px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wide text-[#9aa0a6]">
                            read-only
                        </span>
                    </div>
                    <p className="text-[11px] text-[#9aa0a6]">Email không thể thay đổi sau khi đăng ký.</p>
                </div>

                {/* Role — read-only */}
                <div className="flex flex-col gap-1.5">
                    <label htmlFor="profile-role" className="text-xs font-bold text-[#5f6368]">
                        Vai trò trong workspace
                    </label>
                    <div className="relative">
                        <input
                            id="profile-role"
                            type="text"
                            value="—"
                            readOnly
                            className="w-full cursor-not-allowed rounded-lg border border-[#dcdfe4] bg-[#f8f9fa] px-3 py-2.5 text-sm text-[#9aa0a6] outline-none"
                        />
                        <span className="absolute right-3 top-1/2 -translate-y-1/2 rounded bg-[#e8eaed] px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wide text-[#9aa0a6]">
                            read-only
                        </span>
                    </div>
                    <p className="text-[11px] text-[#9aa0a6]">Vai trò được quản lý bởi Admin của workspace.</p>
                </div>

                {/* Phone */}
                <div className="flex flex-col gap-1.5">
                    <label htmlFor="profile-sdt" className="text-xs font-bold text-[#5f6368]">
                        Số điện thoại
                    </label>
                    <input
                        id="profile-sdt"
                        type="tel"
                        value={sdt}
                        onChange={(e) => setSdt(e.target.value)}
                        placeholder="Nhập số điện thoại..."
                        className="rounded-lg border border-[#dcdfe4] bg-white px-3 py-2.5 text-sm text-[#141b2b] outline-none transition-all duration-150 focus:border-[#0058be] focus:shadow-[0_0_0_3px_rgba(0,88,190,0.08)]"
                    />
                </div>

                {/* Feedback */}
                {updateProfileSuccess && (
                    <div className="flex items-center gap-2 rounded-lg border border-green-200 bg-green-50 px-3 py-2.5 text-sm text-green-700">
                        <CheckCircle2 className="h-4 w-4 shrink-0" />
                        Thông tin cá nhân đã được cập nhật thành công!
                    </div>
                )}
                {updateProfileError && !isUpdatingProfile && (
                    <div className="flex items-center gap-2 rounded-lg border border-red-200 bg-red-50 px-3 py-2.5 text-sm text-red-600">
                        <AlertCircle className="h-4 w-4 shrink-0" />
                        {updateProfileError}
                    </div>
                )}

                {/* Actions */}
                <div className="flex items-center gap-3 pt-1">
                    <button
                        type="button"
                        onClick={handleSave}
                        disabled={isUpdatingProfile || !isDirty || !name.trim()}
                        className="flex items-center gap-2 rounded-lg border-none bg-[#0058be] px-5 py-2.5 text-[13px] font-bold text-white transition-all duration-150 hover:bg-[#004aab] disabled:cursor-not-allowed disabled:opacity-50"
                    >
                        {isUpdatingProfile ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                            <Save className="h-4 w-4" />
                        )}
                        {isUpdatingProfile ? 'Đang lưu…' : 'Save Changes'}
                    </button>

                    {isDirty && !isUpdatingProfile && (
                        <button
                            type="button"
                            onClick={() => {
                                setName(profile.name ?? '');
                                setSdt(profile.sdt ?? '');
                                dispatch(clearUpdateProfileState());
                            }}
                            className="rounded-lg border border-[#dcdfe4] bg-white px-4 py-2.5 text-[13px] font-medium text-[#5f6368] transition-colors duration-150 hover:bg-[#f1f3f4]"
                        >
                            Huỷ
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
}
