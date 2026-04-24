import express from "express";
import {
  getWorkspaces,
  createWorkspaces,
  getWorkspaceById,
  updateWorkspaces,
  deleteWorkspaces,
  getWorkspaceMembers,
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


export default router;

