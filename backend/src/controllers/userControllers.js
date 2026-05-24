import {
    getProfile, 
    updateProfile,
    findUserById,
    getPasswordHash,
    updatePassword,
} from '../models/Users.js';
import bcrypt from 'bcrypt';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

// In-memory OTP store: Map<user_id, { otp, newPasswordHash, expiresAt }>
const otpStore = new Map();
const OTP_TTL_MS = 10 * 60 * 1000; // 10 phút

export const authMe = async (req, res) => {
    try {
        const user_id = req.user.user_id;
        const user = await findUserById(user_id);
        return res.status(200).json({
            message: 'Thong tin nguoi dung',
            user
        });
    } catch (error) {
        return res.status(500).json({ message: 'Loi server', error: error.message });
    }
}

export const getProfiles = async (req, res) => {
    try {
        const user_id = req.user.user_id;
        const userProfile = await getProfile(user_id);
        return res.status(200).json({
            message: 'Thong tin nguoi dung',
            users : userProfile
        });
    } catch (error) {
        return res.status(500).json({ message: 'Loi server khi lay thong tin nguoi dung', error: error.message });
    }
}
export const updateProfiles = async (req, res) => {
    try {
        const user_id = req.user.user_id;
        const { name, avatar_url, sdt } = req.body;

        const updateData = {};
        if (name) updateData.name = name;
        if (avatar_url) updateData.avatar_url = avatar_url;
        if (sdt) updateData.sdt = sdt;

        if (Object.keys(updateData).length === 0) {
            return res.status(400).json({ message: 'Không có thông tin nào để cập nhật' });
        }

        await updateProfile(user_id, updateData); 

        return res.status(200).json({ message: 'Thông tin người dùng đã được cập nhật' });
    } catch (error) {
        return res.status(500).json({ message: 'Lỗi server', error: error.message });
    }
}

export const changePassword = async (req, res) => {
    try {
        const user_id = req.user.user_id;
        const { currentPassword, newPassword, confirmPassword } = req.body;

        if (!currentPassword || !newPassword || !confirmPassword) {
            return res.status(400).json({ message: 'Vui lòng nhập đầy đủ mật khẩu hiện tại, mật khẩu mới và xác nhận mật khẩu' });
        }

        if (newPassword.length < 6) {
            return res.status(400).json({ message: 'Mật khẩu mới phải có ít nhất 6 ký tự' });
        }

        if (newPassword !== confirmPassword) {
            return res.status(400).json({ message: 'Mật khẩu mới và xác nhận mật khẩu không khớp' });
        }

        const currentHash = await getPasswordHash(user_id);
        if (!currentHash) {
            return res.status(404).json({ message: 'Không tìm thấy người dùng' });
        }

        const isMatch = await bcrypt.compare(currentPassword, currentHash);
        if (!isMatch) {
            return res.status(401).json({ message: 'Mật khẩu hiện tại không đúng' });
        }

        const newHash = await bcrypt.hash(newPassword, 10);
        await updatePassword(user_id, newHash);

        return res.status(200).json({ message: 'Cập nhật mật khẩu thành công' });
    } catch (error) {
        return res.status(500).json({ message: 'Lỗi server khi cập nhật mật khẩu', error: error.message });
    }
}

// Bước 1: Xác thực mật khẩu hiện tại + gửi OTP email
export const requestPasswordChangeOtp = async (req, res) => {
    try {
        const user_id = req.user.user_id;
        const { currentPassword, newPassword, confirmPassword } = req.body;

        if (!currentPassword || !newPassword || !confirmPassword) {
            return res.status(400).json({ message: 'Vui lòng nhập đầy đủ mật khẩu hiện tại, mật khẩu mới và xác nhận mật khẩu' });
        }
        if (newPassword.length < 6) {
            return res.status(400).json({ message: 'Mật khẩu mới phải có ít nhất 6 ký tự' });
        }
        if (newPassword !== confirmPassword) {
            return res.status(400).json({ message: 'Mật khẩu mới và xác nhận mật khẩu không khớp' });
        }

        const currentHash = await getPasswordHash(user_id);
        if (!currentHash) {
            return res.status(404).json({ message: 'Không tìm thấy người dùng' });
        }
        const isMatch = await bcrypt.compare(currentPassword, currentHash);
        if (!isMatch) {
            return res.status(401).json({ message: 'Mật khẩu hiện tại không đúng' });
        }

        const user = await findUserById(user_id);
        if (!user?.email) {
            return res.status(404).json({ message: 'Không tìm thấy email người dùng' });
        }

        // Tạo OTP 6 chữ số
        const otp = String(Math.floor(100000 + Math.random() * 900000));
        const newPasswordHash = await bcrypt.hash(newPassword, 10);
        otpStore.set(user_id, {
            otp,
            newPasswordHash,
            expiresAt: Date.now() + OTP_TTL_MS,
        });

        // Gửi email OTP qua Resend
        const { error } = await resend.emails.send({
            from: 'Flowise <noreply@contact.flowise.id.vn>',
            to: [user.email],
            subject: 'Mã xác thực đổi mật khẩu Flowise',
            html: `
                <div style="font-family: sans-serif; max-width: 480px; margin: auto; padding: 32px; border: 1px solid #e2e8f0; border-radius: 12px;">
                    <h2 style="color: #0058be; margin-bottom: 8px;">Xác thực đổi mật khẩu</h2>
                    <p style="color: #5f6368; margin-bottom: 24px;">Bạn vừa yêu cầu đổi mật khẩu trên Flowise. Nhập mã OTP bên dưới để xác nhận:</p>
                    <div style="font-size: 36px; font-weight: 800; letter-spacing: 10px; color: #141b2b; text-align: center; background: #f0f4ff; border-radius: 8px; padding: 16px 0; margin-bottom: 24px;">${otp}</div>
                    <p style="color: #9aa0a6; font-size: 13px;">Mã có hiệu lực trong <strong>10 phút</strong>. Nếu bạn không thực hiện yêu cầu này, hãy bỏ qua email này.</p>
                </div>
            `,
        });

        if (error) {
            console.error('Resend error:', error);
            otpStore.delete(user_id);
            return res.status(500).json({ message: 'Không thể gửi email OTP lúc này, vui lòng thử lại' });
        }

        // Che bớt email để hiển thị ở frontend
        const maskedEmail = user.email.replace(/(.{2})[^@]+(@.+)/, '$1***$2');
        return res.status(200).json({ message: 'OTP đã được gửi tới email của bạn', maskedEmail });
    } catch (error) {
        return res.status(500).json({ message: 'Lỗi server', error: error.message });
    }
};

// Bước 2: Xác thực OTP và thực hiện đổi mật khẩu
export const verifyAndChangePassword = async (req, res) => {
    try {
        const user_id = req.user.user_id;
        const { otp } = req.body;

        if (!otp) {
            return res.status(400).json({ message: 'Vui lòng nhập mã OTP' });
        }

        const stored = otpStore.get(user_id);
        if (!stored) {
            return res.status(400).json({ message: 'Không tìm thấy yêu cầu đổi mật khẩu, vui lòng thử lại' });
        }
        if (Date.now() > stored.expiresAt) {
            otpStore.delete(user_id);
            return res.status(400).json({ message: 'Mã OTP đã hết hạn, vui lòng yêu cầu mã mới' });
        }
        if (stored.otp !== otp.trim()) {
            return res.status(400).json({ message: 'Mã OTP không đúng' });
        }

        await updatePassword(user_id, stored.newPasswordHash);
        otpStore.delete(user_id);

        return res.status(200).json({ message: 'Cập nhật mật khẩu thành công' });
    } catch (error) {
        return res.status(500).json({ message: 'Lỗi server khi cập nhật mật khẩu', error: error.message });
    }
};