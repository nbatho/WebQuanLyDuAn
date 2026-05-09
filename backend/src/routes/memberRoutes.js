import express from "express";
import {
    InviteMember,
    RespondToInvitation,
    RemoveMember,
} from "../controllers/memberController.js";

// Import Middleware Phân quyền
import { requirePermission } from '../middlewares/roleMiddlewares.js';

const router = express.Router();

// Mời thành viên vào Workspace -> Yêu cầu quyền: WORKSPACE_INVITE_MEMBER (Chỉ Admin)
router.post("/invitations", requirePermission('WORKSPACE_INVITE_MEMBER'), InviteMember);

// Phản hồi lời mời (accept/reject) -> Không cần check quyền (user tự xử lý lời mời của mình)
router.post("/respond-to-invitation", RespondToInvitation);

// Xóa thành viên khỏi Workspace -> Yêu cầu quyền: WORKSPACE_MANAGE_ROLES (Chỉ Admin)
router.post("/remove-member", requirePermission('WORKSPACE_MANAGE_ROLES'), RemoveMember);

export default router;