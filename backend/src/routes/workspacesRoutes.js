import express from "express";
import {
  getWorkspaces,
  createWorkspaces,
  getWorkspaceById,
  updateWorkspaces,
  deleteWorkspaces,
  getWorkspaceMembers,
  getWorkspaceInvitations,
  acceptWorkspaceInvitation,
  rejectWorkspaceInvitation
} from "../controllers/workspacesControllers.js";

const router = express.Router();

/**
 * @swagger
 * tags:
 *   - name: Workspaces
 *     description: Các API quản lý không gian làm việc
 */

/**
 * @swagger
 * /api/workspaces:
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
 * /api/workspaces:
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
 * /api/workspaces/{id}:
 *   get:
 *     summary: Lấy chi tiết một Workspace theo ID
 *     tags: [Workspaces]
 *     parameters:
 *       - in: path
 *         name: id
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
 * /api/workspaces/{workspaceId}:
 *   put:
 *     summary: Cập nhật thông tin Workspace
 *     tags: [Workspaces]
 *     parameters:
 *       - in: path
 *         name: workspaceId
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID của workspace cần cập nhật
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: Công ty Beta (Đã đổi tên)
 *               description:
 *                 type: string
 *                 example: Mô tả mới
 *     responses:
 *       200:
 *         description: Cập nhật thành công
 *       400:
 *         description: Dữ liệu đầu vào không hợp lệ
 *       404:
 *         description: Không tìm thấy workspace
 */
router.put("/:workspaceId", updateWorkspaces);

/**
 * @swagger
 * /api/workspaces/{workspaceId}:
 *   delete:
 *     summary: Xóa một Workspace
 *     tags: [Workspaces]
 *     parameters:
 *       - in: path
 *         name: workspaceId
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID của workspace cần xóa
 *     responses:
 *       204:
 *         description: Xóa thành công (Không trả về dữ liệu)
 *       403:
 *         description: Không có quyền xóa workspace này
 *       404:
 *         description: Không tìm thấy workspace
 */
router.delete("/:workspaceId", deleteWorkspaces);

/**
 * @swagger
 * /api/workspaces/{workspaceId}/members:
 *   get:
 *     summary: Lấy danh sách thành viên trong Workspace
 *     tags: [Workspaces]
 *     parameters:
 *       - in: path
 *         name: workspaceId
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID của workspace
 *     responses:
 *       200:
 *         description: Trả về mảng danh sách thành viên
 *       404:
 *         description: Không tìm thấy workspace
 */
router.get("/:workspaceId/members", getWorkspaceMembers);

router.post('/:workspaceId/invitations', getWorkspaceInvitations);
router.post('/:workspaceId/invitations/accept', acceptWorkspaceInvitation);
router.post('/:workspaceId/invitations/reject', rejectWorkspaceInvitation);

export default router;
