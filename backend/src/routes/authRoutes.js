import express from "express";
import {
  signUp,
  signIn,
  signOut,
  refreshToken,
  googleSignIn,
} from "../controllers/authControllers.js";
const router = express.Router();

/**
 * @swagger
 * tags:
 *   - name: Authentication
 */

/**
 * @swagger
 * /api/v1/auth/signup:
 *   post:
 *     summary: Đăng ký tài khoản mới
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *               - username
 *               - name
 *             properties:
 *               email:
 *                 type: string
 *                 example: user@example.com
 *               password:
 *                 type: string
 *                 example: password123
 *               username:
 *                 type: string
 *                 example: john_doe
 *               name:
 *                 type: string
 *                 example: John Doe
 *     responses:
 *       201:
 *         description: Đăng ký thành công
 *       400:
 *         description: Dữ liệu đầu vào không hợp lệ
 *       409:
 *         description: Tài khoản đã tồn tại
 */
router.post("/signup", signUp);

/**
 * @swagger
 * /api/v1/auth/signin:
 *   post:
 *     summary: Đăng nhập vào hệ thống
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 example: user@example.com
 *               password:
 *                 type: string
 *                 example: password123
 *     responses:
 *       200:
 *         description: Đăng nhập thành công
 *       400:
 *         description: Dữ liệu đầu vào không hợp lệ
 *       401:
 *         description: Thông tin đăng nhập không hợp lệ
 */
router.post("/signin", signIn);
router.post("/google", googleSignIn);

/**
 * @swagger
 * /api/v1/auth/signout:
 *   post:
 *     summary: Đăng xuất khỏi hệ thống
 *     tags: [Authentication]
 *     responses:
 *       200:
 *         description: Đăng xuất thành công
 *       400:
 *         description: Dữ liệu đầu vào không hợp lệ
 *       401:
 *         description: Người dùng chưa đăng nhập
 */
router.post("/signout", signOut);

/**
 * @swagger
 * /api/v1/auth/refresh:
 *   post:
 *     summary: Làm mới access token bằng refresh token
 *     tags: [Authentication]
 *     responses:
 *       200:
 *         description: Làm mới token thành công
 *       400:
 *         description: Dữ liệu đầu vào không hợp lệ
 *       401:
 *         description: Refresh token không hợp lệ hoặc đã hết hạn
 *       403:
 *         description: Người dùng không có quyền truy cập
 *       500:
 *         description: Lỗi server khi làm mới token
*/
router.post("/refresh", refreshToken);
export default router;
