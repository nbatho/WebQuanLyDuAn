import express from "express";
import {
  getWorkspaces,
  createWorkspaces,
  getWorkspaceById,
  updateWorkspaces,
  deleteWorkspaces,
  getWorkspaceMembers,
  getWorkspaceInvitations,
  createInvitation,
  acceptWorkspaceInvitation,
  rejectWorkspaceInvitation,
  addMemberToWorkspace,
  removeMemberFromWorkspace,
  updateWorkspaceMemberRole,
} from "../controllers/workspacesControllers.js";

const router = express.Router();

/**
 * @swagger
 * tags:
 *   - name: Workspaces
 */

/**
 * @swagger
 * /api/v1/workspaces:
 *   get:
 *     summary: Lấy danh sách toàn bộ workspaces của người dùng
 *     tags: [Workspaces]
 *     responses:
 *       200:
 *         description: Trả về mảng danh sách workspace
 *       401:
 *         description: Chưa đăng nhập hoặc Token hết hạn
 *       500:
 *         description: Lỗi máy chủ
 */
router.get("/", getWorkspaces);

/**
 * @swagger
 * /api/v1/workspaces:
 *   post:
 *     summary: Tạo một Workspace mới
 *     tags: [Workspaces]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - slug
 *             properties:
 *               name:
 *                 type: string
 *                 example: Công ty Alpha
 *               slug:
 *                 type: string
 *                 example: cong-ty-alpha
 *               description:
 *                 type: string
 *                 example: Không gian làm việc của team Alpha
 *     responses:
 *       201:
 *         description: Tạo thành công
 *       400:
 *         description: Thiếu thông tin hoặc slug không hợp lệ
 *       409:
 *         description: Slug đã tồn tại
 */
router.post("/", createWorkspaces);

/**
 * @swagger
 * /api/v1/workspaces/{workspaceId}:
 *   get:
 *     summary: Lấy chi tiết một Workspace theo ID
 *     tags: [Workspaces]
 *     parameters:
 *       - in: path
 *         name: workspaceId
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID của workspace cần tìm
 *     responses:
 *       200:
 *         description: Thông chi tiết của workspace
 *       404:
 *         description: Không tìm thấy workspace
 */
router.get("/:workspaceId", getWorkspaceById);

/**
 * @swagger
 * /api/v1/workspaces/{workspaceId}:
 *   put:
 *     summary: Cập nhật thông tin Workspace
 *     tags: [Workspaces]
 *     parameters:
 *       - in: path
 *         name: workspaceId
 *         schema:
 *           type: integer
 *         required: true
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               description:
 *                 type: string
 *     responses:
 *       200:
 *         description: Cập nhật thành công
 */
router.put("/:workspaceId", updateWorkspaces);

/**
 * @swagger
 * /api/v1/workspaces/{workspaceId}:
 *   delete:
 *     summary: Xóa một Workspace
 *     tags: [Workspaces]
 *     parameters:
 *       - in: path
 *         name: workspaceId
 *         schema:
 *           type: integer
 *         required: true
 *     responses:
 *       204:
 *         description: Xóa thành công
 */
router.delete("/:workspaceId", deleteWorkspaces);

// --- Members ---

/**
 * @swagger
 * /api/v1/workspaces/{workspaceId}/members:
 *   get:
 *     summary: Lấy danh sách thành viên trong Workspace
 *     tags: [Workspaces]
 *     parameters:
 *       - in: path
 *         name: workspaceId
 *         schema:
 *           type: integer
 *         required: true
 *     responses:
 *       200:
 *         description: Trả về mảng danh sách thành viên
 */
router.get("/:workspaceId/members", getWorkspaceMembers);

/**
 * @swagger
 * /api/v1/workspaces/{workspaceId}/members:
 *   post:
 *     summary: Thêm thành viên vào Workspace
 *     tags: [Workspaces]
 *     parameters:
 *       - in: path
 *         name: workspaceId
 *         schema:
 *           type: integer
 *         required: true
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [userId]
 *             properties:
 *               userId:
 *                 type: integer
 *               roleId:
 *                 type: integer
 *     responses:
 *       201:
 *         description: Thêm thành viên thành công
 */
router.post("/:workspaceId/members", addMemberToWorkspace);

/**
 * @swagger
 * /api/v1/workspaces/{workspaceId}/members/{userId}:
 *   delete:
 *     summary: Xóa thành viên khỏi Workspace
 *     tags: [Workspaces]
 *     parameters:
 *       - in: path
 *         name: workspaceId
 *         schema:
 *           type: integer
 *         required: true
 *       - in: path
 *         name: userId
 *         schema:
 *           type: integer
 *         required: true
 *     responses:
 *       200:
 *         description: Xóa thành viên thành công
 */
router.delete("/:workspaceId/members/:userId", removeMemberFromWorkspace);

/**
 * @swagger
 * /api/v1/workspaces/{workspaceId}/members/{userId}/role:
 *   put:
 *     summary: Cập nhật role cho thành viên
 *     tags: [Workspaces]
 *     parameters:
 *       - in: path
 *         name: workspaceId
 *         schema:
 *           type: integer
 *         required: true
 *       - in: path
 *         name: userId
 *         schema:
 *           type: integer
 *         required: true
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [roleId]
 *             properties:
 *               roleId:
 *                 type: integer
 *     responses:
 *       200:
 *         description: Cập nhật role thành công
 */
router.put("/:workspaceId/members/:userId/role", updateWorkspaceMemberRole);

// --- Invitations ---

/**
 * @swagger
 * /api/v1/workspaces/{workspaceId}/invitations:
 *   get:
 *     summary: Lấy danh sách lời mời của Workspace
 *     tags: [Workspaces]
 *     parameters:
 *       - in: path
 *         name: workspaceId
 *         schema:
 *           type: integer
 *         required: true
 *     responses:
 *       200:
 *         description: Danh sách invitations
 */
router.get("/:workspaceId/invitations", getWorkspaceInvitations);

/**
 * @swagger
 * /api/v1/workspaces/{workspaceId}/invitations:
 *   post:
 *     summary: Tạo lời mời vào Workspace
 *     tags: [Workspaces]
 *     parameters:
 *       - in: path
 *         name: workspaceId
 *         schema:
 *           type: integer
 *         required: true
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [email]
 *             properties:
 *               email:
 *                 type: string
 *               roleId:
 *                 type: integer
 *     responses:
 *       201:
 *         description: Lời mời đã được tạo
 */
router.post("/:workspaceId/invitations", createInvitation);

/**
 * @swagger
 * /api/v1/workspaces/invitations/{invitationId}/accept:
 *   post:
 *     summary: Chấp nhận lời mời
 *     tags: [Workspaces]
 *     parameters:
 *       - in: path
 *         name: invitationId
 *         schema:
 *           type: integer
 *         required: true
 *     responses:
 *       200:
 *         description: Lời mời đã được chấp nhận
 */
router.post("/invitations/:invitationId/accept", acceptWorkspaceInvitation);

/**
 * @swagger
 * /api/v1/workspaces/invitations/{invitationId}/reject:
 *   post:
 *     summary: Từ chối lời mời
 *     tags: [Workspaces]
 *     parameters:
 *       - in: path
 *         name: invitationId
 *         schema:
 *           type: integer
 *         required: true
 *     responses:
 *       200:
 *         description: Lời mời đã bị từ chối
 */
router.post("/invitations/:invitationId/reject", rejectWorkspaceInvitation);

export default router;

