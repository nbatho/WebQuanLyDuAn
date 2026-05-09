import express from "express";
import {
  getNotifications,
  markNotificationAsRead,
  markAllNotificationsAsRead,
  deleteNotification,
} from "../controllers/notificationsController.js";
const router = express.Router();
router.get("/", getNotifications);

router.patch("/:notificationId/read", markNotificationAsRead);

router.patch("/read-all", markAllNotificationsAsRead);

router.delete("/:notificationId", deleteNotification);

export default router;
