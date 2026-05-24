import {
    getProfile, 
    updateProfile,
    findUserById,
    getPasswordHash,
    updatePassword,
} from '../models/Users.js';
import bcrypt from 'bcrypt';

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