import express from 'express';
import {
  getRoles,
  getRoleById,
  getPermissionsByRoleId,
  getPermissions,
} from '../controllers/roleController.js';

const router = express.Router();

/**
 * @swagger
 * /api/v1/roles:
 *   get:
 *     summary: Lấy danh sách tất cả roles
 *     tags: [Roles & Permissions]
 *     responses:
 *       200:
 *         description: Danh sách roles
 */
router.get('/', getRoles);

/**
 * @swagger
 * /api/v1/roles/permissions:
 *   get:
 *     summary: Lấy danh sách tất cả permissions
 *     tags: [Roles & Permissions]
 *     responses:
 *       200:
 *         description: Danh sách permissions
 */
router.get('/permissions', getPermissions);

/**
 * @swagger
 * /api/v1/roles/{roleId}:
 *   get:
 *     summary: Lấy chi tiết role
 *     tags: [Roles & Permissions]
 *     parameters:
 *       - in: path
 *         name: roleId
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Chi tiết role
 */
router.get('/:roleId', getRoleById);

/**
 * @swagger
 * /api/v1/roles/{roleId}/permissions:
 *   get:
 *     summary: Lấy danh sách permissions theo role
 *     tags: [Roles & Permissions]
 *     parameters:
 *       - in: path
 *         name: roleId
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Danh sách permissions của role
 */
router.get('/:roleId/permissions', getPermissionsByRoleId);

export default router;
