import { useState, useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  fetchRequestPasswordOtp,
  fetchVerifyChangePassword,
  clearChangePasswordState,
} from '@/store/modules/users';
import type { AppDispatch } from '@/store/configureStore';
import { Eye, EyeOff, Check, AlertCircle, Loader2, Mail, ArrowLeft, RotateCcw } from 'lucide-react';

// ─── OTP Input ──────────────────────────────────────────────────────────────
function OtpInput({ value, onChange, disabled }: { value: string; onChange: (v: string) => void; disabled: boolean }) {
  const refs = useRef<(HTMLInputElement | null)[]>([]);
  const digits = value.padEnd(6, ' ').split('').slice(0, 6);

  const handleKey = (i: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace') {
      e.preventDefault();
      const next = [...digits];
      if (next[i].trim()) {
        next[i] = ' ';
        onChange(next.join('').trimEnd());
      } else if (i > 0) {
        next[i - 1] = ' ';
        onChange(next.join('').trimEnd());
        refs.current[i - 1]?.focus();
      }
    }
  };

  const handleChange = (i: number, e: React.ChangeEvent<HTMLInputElement>) => {
    const char = e.target.value.replace(/\D/g, '').slice(-1);
    if (!char) return;
    const next = [...digits];
    next[i] = char;
    onChange(next.join('').replace(/ /g, ''));
    if (i < 5) refs.current[i + 1]?.focus();
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6);
    onChange(pasted);
    refs.current[Math.min(pasted.length, 5)]?.focus();
    e.preventDefault();
  };

  return (
    <div className="flex gap-2 justify-center" onPaste={handlePaste}>
      {digits.map((d, i) => (
        <input
          key={i}
          ref={(el) => { refs.current[i] = el; }}
          type="text"
          inputMode="numeric"
          maxLength={1}
          value={d.trim()}
          disabled={disabled}
          onChange={(e) => handleChange(i, e)}
          onKeyDown={(e) => handleKey(i, e)}
          className="h-12 w-11 rounded-lg border border-[#dcdfe4] bg-white text-center text-xl font-bold text-[#141b2b] outline-none transition-all focus:border-[#0058be] focus:shadow-[0_0_0_3px_rgba(0,88,190,0.08)] disabled:bg-[#f8f9fa] disabled:opacity-60"
        />
      ))}
    </div>
  );
}

// ─── Main Component ─────────────────────────────────────────────────────────
export default function Security() {
  const dispatch = useDispatch<AppDispatch>();
  const {
    changePasswordSuccess,
    isRequestingOtp,
    otpRequested,
    maskedEmail,
    errorRequestOtp,
    isVerifyingOtp,
    errorVerifyOtp,
  } = useSelector((state: any) => state.users);

  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [clientError, setClientError] = useState('');
  const [otp, setOtp] = useState('');
  const [countdown, setCountdown] = useState(0);

  // Countdown timer khi OTP đã gửi
  useEffect(() => {
    if (otpRequested && countdown === 0) setCountdown(60);
  }, [otpRequested]);

  useEffect(() => {
    if (countdown <= 0) return;
    const t = setTimeout(() => setCountdown((c) => c - 1), 1000);
    return () => clearTimeout(t);
  }, [countdown]);

  // Reset form sau khi đổi thành công
  useEffect(() => {
    if (changePasswordSuccess) {
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
      setOtp('');
      setTimeout(() => dispatch(clearChangePasswordState()), 3000);
    }
  }, [changePasswordSuccess, dispatch]);

  useEffect(() => {
    return () => { dispatch(clearChangePasswordState()); };
  }, [dispatch]);

  // Bước 1: Gửi OTP
  const handleSendOtp = (e: React.FormEvent) => {
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
    dispatch(fetchRequestPasswordOtp({ currentPassword, newPassword, confirmPassword }));
  };

  // Bước 2: Xác thực OTP
  const handleVerifyOtp = (e: React.FormEvent) => {
    e.preventDefault();
    if (otp.length < 6) {
      setClientError('Vui lòng nhập đủ 6 số OTP');
      return;
    }
    setClientError('');
    dispatch(fetchVerifyChangePassword(otp));
  };

  const handleResendOtp = () => {
    setOtp('');
    setCountdown(60);
    dispatch(fetchRequestPasswordOtp({ currentPassword, newPassword, confirmPassword }));
  };

  const handleBack = () => {
    dispatch(clearChangePasswordState());
    setOtp('');
    setClientError('');
  };

  const inputClass =
    'w-full rounded-lg border border-[#dcdfe4] bg-white px-3 py-2.5 pr-10 text-sm text-[#141b2b] outline-none transition-all duration-150 focus:border-[#0058be] focus:shadow-[0_0_0_3px_rgba(0,88,190,0.08)] disabled:bg-[#f8f9fa] disabled:opacity-60';
  const eyeBtnClass =
    'absolute right-3 top-1/2 -translate-y-1/2 border-none bg-transparent text-[#9aa0a6] hover:text-[#5f6368] cursor-pointer';

  return (
    <div>
      <h2 className="mb-1 text-xl font-extrabold text-[#141b2b]">Security</h2>
      <p className="mb-6 text-[13px] text-[#9aa0a6]">Manage your account security</p>

      {/* ── Thành công ── */}
      {changePasswordSuccess && (
        <div className="mb-4 flex items-center gap-2 rounded-lg border border-[#a7f3d0] bg-[#ecfdf5] px-4 py-3 text-sm text-[#065f46]">
          <Check size={16} className="shrink-0" />
          <span>Cập nhật mật khẩu thành công!</span>
        </div>
      )}

      {!changePasswordSuccess && (
        <>
          {/* ══════════ BƯỚC 1: Form nhập mật khẩu ══════════ */}
          {!otpRequested ? (
            <form onSubmit={handleSendOtp} className="flex max-w-120 flex-col gap-4">
              {(clientError || errorRequestOtp) && (
                <div className="flex items-center gap-2 rounded-lg border border-[#fecaca] bg-[#fef2f2] px-4 py-3 text-sm text-[#991b1b]">
                  <AlertCircle size={16} className="shrink-0" />
                  <span>{clientError || errorRequestOtp}</span>
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
                    disabled={isRequestingOtp}
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
                    disabled={isRequestingOtp}
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
                    disabled={isRequestingOtp}
                  />
                  <button type="button" className={eyeBtnClass} onClick={() => setShowConfirm(!showConfirm)}>
                    {showConfirm ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={isRequestingOtp}
                className="mt-2 flex items-center justify-center gap-2 self-start rounded-lg border-none bg-[#0058be] px-6 py-2.5 text-[13px] font-bold text-white transition-colors duration-150 hover:bg-[#004aab] disabled:cursor-not-allowed disabled:opacity-60"
              >
                {isRequestingOtp ? (
                  <>
                    <Loader2 size={14} className="animate-spin" />
                    Đang gửi mã xác thực...
                  </>
                ) : (
                  <>
                    <Mail size={14} />
                    Gửi mã xác thực qua email
                  </>
                )}
              </button>
            </form>
          ) : (
            /* ══════════ BƯỚC 2: Nhập OTP ══════════ */
            <form onSubmit={handleVerifyOtp} className="flex max-w-120 flex-col gap-5">
              {/* Header */}
              <div className="rounded-xl border border-[#e2e8f0] bg-[#f8faff] px-5 py-4">
                <div className="mb-1 flex items-center gap-2">
                  <Mail size={16} className="text-[#0058be]" />
                  <span className="text-sm font-bold text-[#141b2b]">Kiểm tra email của bạn</span>
                </div>
                <p className="text-[13px] text-[#5f6368]">
                  Mã OTP 6 số đã được gửi tới{' '}
                  <span className="font-semibold text-[#141b2b]">{maskedEmail}</span>.
                  Mã có hiệu lực trong <span className="font-semibold">10 phút</span>.
                </p>
              </div>

              {/* Lỗi */}
              {(clientError || errorVerifyOtp) && (
                <div className="flex items-center gap-2 rounded-lg border border-[#fecaca] bg-[#fef2f2] px-4 py-3 text-sm text-[#991b1b]">
                  <AlertCircle size={16} className="shrink-0" />
                  <span>{clientError || errorVerifyOtp}</span>
                </div>
              )}

              {/* OTP boxes */}
              <div className="flex flex-col gap-2">
                <label className="text-xs font-bold text-[#5f6368]">Nhập mã OTP</label>
                <OtpInput value={otp} onChange={setOtp} disabled={isVerifyingOtp} />
              </div>

              {/* Actions */}
              <div className="flex flex-wrap items-center gap-3">
                <button
                  type="submit"
                  disabled={isVerifyingOtp || otp.length < 6}
                  className="flex items-center justify-center gap-2 rounded-lg border-none bg-[#0058be] px-6 py-2.5 text-[13px] font-bold text-white transition-colors hover:bg-[#004aab] disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {isVerifyingOtp ? (
                    <>
                      <Loader2 size={14} className="animate-spin" />
                      Đang xác thực...
                    </>
                  ) : (
                    <>
                      <Check size={14} />
                      Xác nhận & Đổi mật khẩu
                    </>
                  )}
                </button>

                <button
                  type="button"
                  onClick={handleResendOtp}
                  disabled={countdown > 0 || isVerifyingOtp}
                  className="flex items-center gap-1.5 rounded-lg border border-[#dcdfe4] bg-white px-4 py-2.5 text-[13px] font-semibold text-[#5f6368] transition-colors hover:bg-[#f3f4f8] disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <RotateCcw size={13} />
                  {countdown > 0 ? `Gửi lại (${countdown}s)` : 'Gửi lại mã'}
                </button>

                <button
                  type="button"
                  onClick={handleBack}
                  disabled={isVerifyingOtp}
                  className="flex items-center gap-1.5 rounded-lg border-none bg-transparent px-4 py-2.5 text-[13px] font-semibold text-[#5f6368] transition-colors hover:text-[#141b2b] disabled:opacity-50"
                >
                  <ArrowLeft size={13} />
                  Quay lại
                </button>
              </div>
            </form>
          )}
        </>
      )}
    </div>
  );
}
