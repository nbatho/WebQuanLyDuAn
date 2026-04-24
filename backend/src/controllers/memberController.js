import { Resend } from "resend";
import express from "express";
import dotenv from "dotenv";
const resend = new Resend(process.env.RESEND_API_KEY);
import { createInvitations, checkExistingInvitation, deleteInvitation, updateInvitationStatus,addMemberToWorkspace } from "../models/Member.js";
import jwt from 'jsonwebtoken';

export const InviteMember = async (req, res) => {
    try {
        const { email, workspace_id } = req.body;

        // 1. Validate đầu vào
        if (!email || !workspace_id) {
            return res.status(400).json({ message: "Email và workspace_id là bắt buộc" });
        }

        const existingInvitation = await checkExistingInvitation(workspace_id, email);
        if (existingInvitation) {
            return res.status(400).json({ message: "Lời mời đã được gửi trước đó" });
        }

        // 2. Tạo Token (Dùng JWT như code của bạn)
        const inviteToken = jwt.sign(
            { email: email, workspace_id },
            process.env.EMAIL_TOKEN_SECRET,
            { expiresIn: "1d" }
        );

        const invitationRecord = await createInvitations(workspace_id, email, inviteToken, req.user.user_id);
        if (!invitationRecord) {
            return res.status(500).json({ message: "Không thể tạo lời mời lúc này" });
        }

        const clientUrl = process.env.CLIENT_URL || "http://localhost:5173";
        const invitationLink = `${clientUrl}/join-workspace?token=${inviteToken}`;

        const { data, error } = await resend.emails.send({
            from: "Acme <onboarding@resend.dev>",
            to: [email],
            subject: "Bạn có lời mời tham gia Workspace",
            html: `
                <div style="font-family: sans-serif; padding: 20px;">
                    <h2>Chào bạn,</h2>
                    <p>Bạn vừa nhận được lời mời tham gia Workspace.</p>
                    <p>Vui lòng click vào nút bên dưới để chấp nhận (Link có hiệu lực trong 1 giờ):</p>
                    <a href="${invitationLink}" style="display: inline-block; padding: 10px 20px; background-color: #007bff; color: white; text-decoration: none; border-radius: 5px;">
                        Chấp nhận lời mời
                    </a>
                </div>
            `,
        });

        if (error) {
            console.error("Lỗi từ Resend:", error);
            await deleteInvitation(invitationRecord.invitation_id);
            return res.status(400).json({ message: "Không thể gửi email lúc này", error });
        }

        // Trả về thành công
        res.status(200).json({ message: "Đã gửi lời mời thành công", data });

    } catch (error) {
        console.error("Error inviting member:", error);
        return res.status(500).json({ message: "Lỗi Server nội bộ" });
    }
}

export const RespondToInvitation = async (req, res) => {
    try {
        const { token, action } = req.body;

        if (!token || !action) {
            return res.status(400).json({ message: "Token và action là bắt buộc" });
        }

        if (!['accept', 'reject'].includes(action)) {
            return res.status(400).json({ message: "Hành động không hợp lệ" });
        }

        let decoded;
        try {
            decoded = jwt.verify(token, process.env.EMAIL_TOKEN_SECRET);
        } catch (err) {
            console.error("Lỗi xác thực token:", err);
            return res.status(400).json({ message: "Token không hợp lệ hoặc đã hết hạn" });
        }

        const { email, workspace_id } = decoded;

        if (req.user.email !== email) {
            return res.status(403).json({ message: "Email đăng nhập không khớp với email được mời!" });
        }

        const invitation = await checkExistingInvitation(workspace_id, email);
        if (!invitation) {
            return res.status(404).json({ message: "Lời mời không tồn tại hoặc đã được xử lý" });
        }


        if (action === 'accept') {
            await addMemberToWorkspace(workspace_id, req.user.user_id);
            await updateInvitationStatus(invitation.invitation_id, 'accepted');
            return res.status(200).json({ message: "Bạn đã gia nhập Workspace thành công!" });
        } 
        else if (action === 'reject') {
            await updateInvitationStatus(invitation.invitation_id, 'rejected'); // Dùng 'rejected' thay vì 'declined'
            return res.status(200).json({ message: "Bạn đã từ chối lời mời tham gia Workspace." });
        }

    } catch (error) {
        console.error("Error responding to invitation:", error);
        return res.status(500).json({ message: "Lỗi Server nội bộ" });
    }
};

export const RemoveMember = async (req, res) => {}