import express from "express";
import {
  authMe,
  getProfiles,
  updateProfiles,
} from "../controllers/userControllers.js";
const router = express.Router();

/**
 * @swagger
 * tags:
 *   - name: Users
 */

/**
 * @swagger
 * /api/v1/users/me:
 *   get:
 *     summary: Lấy thông tin người dùng hiện tại
 *     tags: [Users]
 *     responses:
 *       200:
 *         description: Thành công, trả về thông tin người dùng
 *       401:
 *         description: Chưa đăng nhập hoặc Token hết hạn
 *       500:
 *         description: Lỗi máy chủ
 */

router.get("/me", authMe);

/**
 * @swagger
 * /api/v1/users/profiles:
 *   get:
 *     summary: Lấy thông tin hồ sơ người dùng
 *     tags: [Users]
 *     responses:
 *       200:
 *         description: Thành công, trả về thông tin hồ sơ người dùng
 *       401:
 *         description: Chưa đăng nhập hoặc Token hết hạn
 *       500:
 *         description: Lỗi máy chủ
 *
 */
router.get("/profiles", getProfiles);

/**
 * @swagger
 * /api/v1/users/profiles:
 *   put:
 *     summary: Cập nhật thông tin hồ sơ người dùng
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: Nguyen Van A
 *               avatar_url:
 *                 type: string
 *                 example: https://example.com/avatar.png
 *               sdt:
 *                 type: string
 *                 example: 0987654321
 *     responses:
 *       200:
 *         description: Cập nhật hồ sơ thành công
 *       400:
 *         description: Không có thông tin hợp lệ để cập nhật
 *       401:
 *         description: Chưa đăng nhập hoặc Token hết hạn
 *       500:
 *         description: Lỗi máy chủ
 */

router.put("/profiles", updateProfiles);
// router.get('/profiles/stats', getProfileStats);

export default router;
