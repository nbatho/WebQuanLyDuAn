import express from "express";
import {
  getNotifications,
  markNotificationsAsRead,
  markAllNotificationsAsRead,
  deleteNotification,
} from "../controllers/notificationsController.js";
const router = express.Router();

/**
 * @swagger
 * tags:
 *   - name: Notifications
 */

router.get("/notifications", getNotifications);
router.post("/notifications/mark-as-read", markNotificationsAsRead);
router.patch("/notifications/read-all", markAllNotificationsAsRead);
router.delete("/notifications/:notificationId", deleteNotification);

export default router;
