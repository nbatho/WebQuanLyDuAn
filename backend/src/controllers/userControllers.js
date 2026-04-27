import {
    getProfile, 
    updateProfile,
    findUserById,
} from '../models/Users.js';

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