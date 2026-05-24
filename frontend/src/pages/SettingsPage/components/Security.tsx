import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchChangePassword, clearChangePasswordState } from '@/store/modules/users';
import type { AppDispatch } from '@/store/configureStore';
import { Eye, EyeOff, Check, AlertCircle, Loader2 } from 'lucide-react';

export default function Security() {
  const dispatch = useDispatch<AppDispatch>();
  const { isChangingPassword, errorChangePassword, changePasswordSuccess } = useSelector(
    (state: any) => state.users
  );

  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [clientError, setClientError] = useState('');

  useEffect(() => {
    return () => {
      dispatch(clearChangePasswordState());
    };
  }, [dispatch]);

  useEffect(() => {
    if (changePasswordSuccess) {
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
      setTimeout(() => {
        dispatch(clearChangePasswordState());
      }, 3000);
    }
  }, [changePasswordSuccess, dispatch]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setClientError('');

    if (!currentPassword || !newPassword || !confirmPassword) {
      setClientError('Vui lòng nhập đầy đủ các trường');
      return;
    }
    if (newPassword.length < 6) {
      setClientError('Mật khẩu mới phải có ít nhất 6 ký tự');
      return;
    }
    if (newPassword !== confirmPassword) {
      setClientError('Mật khẩu mới và xác nhận không khớp');
      return;
    }

    dispatch(fetchChangePassword({ currentPassword, newPassword, confirmPassword }));
  };

  const inputClass =
    'w-full rounded-lg border border-[#dcdfe4] bg-white px-3 py-2.5 pr-10 text-sm text-[#141b2b] outline-none transition-all duration-150 focus:border-[#0058be] focus:shadow-[0_0_0_3px_rgba(0,88,190,0.08)]';
  const eyeBtnClass =
    'absolute right-3 top-1/2 -translate-y-1/2 border-none bg-transparent text-[#9aa0a6] hover:text-[#5f6368] cursor-pointer';

  const displayError = clientError || errorChangePassword;

  return (
    <div>
      <h2 className="mb-1 text-xl font-extrabold text-[#141b2b]">Security</h2>
      <p className="mb-6 text-[13px] text-[#9aa0a6]">Manage your account security</p>

      <form onSubmit={handleSubmit} className="flex max-w-120 flex-col gap-4">
        {/* Success message */}
        {changePasswordSuccess && (
          <div className="flex items-center gap-2 rounded-lg bg-[#ecfdf5] border border-[#a7f3d0] px-4 py-3 text-sm text-[#065f46]">
            <Check size={16} className="shrink-0" />
            <span>Cập nhật mật khẩu thành công!</span>
          </div>
        )}

        {/* Error message */}
        {displayError && (
          <div className="flex items-center gap-2 rounded-lg bg-[#fef2f2] border border-[#fecaca] px-4 py-3 text-sm text-[#991b1b]">
            <AlertCircle size={16} className="shrink-0" />
            <span>{displayError}</span>
          </div>
        )}

        <div className="flex flex-col gap-1">
          <label className="text-xs font-bold text-[#5f6368]">Current Password</label>
          <div className="relative">
            <input
              className={inputClass}
              type={showCurrent ? 'text' : 'password'}
              placeholder="Enter current password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              disabled={isChangingPassword}
            />
            <button type="button" className={eyeBtnClass} onClick={() => setShowCurrent(!showCurrent)}>
              {showCurrent ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>
        </div>

        <div className="flex flex-col gap-1">
          <label className="text-xs font-bold text-[#5f6368]">New Password</label>
          <div className="relative">
            <input
              className={inputClass}
              type={showNew ? 'text' : 'password'}
              placeholder="Enter new password (min 6 characters)"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              disabled={isChangingPassword}
            />
            <button type="button" className={eyeBtnClass} onClick={() => setShowNew(!showNew)}>
              {showNew ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>
        </div>

        <div className="flex flex-col gap-1">
          <label className="text-xs font-bold text-[#5f6368]">Confirm Password</label>
          <div className="relative">
            <input
              className={inputClass}
              type={showConfirm ? 'text' : 'password'}
              placeholder="Confirm new password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              disabled={isChangingPassword}
            />
            <button type="button" className={eyeBtnClass} onClick={() => setShowConfirm(!showConfirm)}>
              {showConfirm ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>
        </div>

        <button
          type="submit"
          disabled={isChangingPassword}
          className="mt-2 flex items-center justify-center gap-2 self-start rounded-lg border-none bg-[#0058be] px-6 py-2.5 text-[13px] font-bold text-white transition-colors duration-150 hover:bg-[#004aab] disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isChangingPassword ? (
            <>
              <Loader2 size={14} className="animate-spin" />
              Đang cập nhật...
            </>
          ) : (
            'Update Password'
          )}
        </button>
      </form>
    </div>
  );
}
