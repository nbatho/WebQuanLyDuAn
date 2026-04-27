import {
  findNotificationsByUserId,
  countUnreadNotifications,
  markAsRead,
  markAllAsRead,
  deleteNotificationById,
} from "../models/Notifications.js";

export const getNotifications = async (req, res) => {
  try {
    const userId = req.user?.user_id;
    const { limit = 50, offset = 0 } = req.query;

    if (!userId) {
      return res.status(401).json({ error: "User not authenticated" });
    }

    const notifications = await findNotificationsByUserId(userId, parseInt(limit), parseInt(offset));
    const unreadCount = await countUnreadNotifications(userId);

    res.status(200).json({
      notifications,
      unreadCount,
    });
  } catch (error) {
    console.error("Failed to retrieve notifications:", error.message);
    res.status(500).json({ error: "Failed to retrieve notifications" });
  }
};

export const markNotificationAsRead = async (req, res) => {
  try {
    const { notificationId } = req.params;
    const userId = req.user?.user_id;

    if (!notificationId) {
      return res.status(400).json({ error: "Notification ID is required" });
    }
    if (!userId) {
      return res.status(401).json({ error: "User not authenticated" });
    }

    const notification = await markAsRead(notificationId, userId);
    if (!notification) {
      return res.status(404).json({ error: "Notification not found" });
    }
    res.status(200).json(notification);
  } catch (error) {
    console.error("Failed to mark notification as read:", error.message);
    res.status(500).json({ error: "Failed to mark notification as read" });
  }
};

export const markAllNotificationsAsRead = async (req, res) => {
  try {
    const userId = req.user?.user_id;
    if (!userId) {
      return res.status(401).json({ error: "User not authenticated" });
    }

    const notifications = await markAllAsRead(userId);
    res.status(200).json({ 
      message: "All notifications marked as read",
      count: notifications.length 
    });
  } catch (error) {
    console.error("Failed to mark all notifications as read:", error.message);
    res.status(500).json({ error: "Failed to mark all notifications as read" });
  }
};

export const deleteNotification = async (req, res) => {
  try {
    const { notificationId } = req.params;
    const userId = req.user?.user_id;

    if (!notificationId) {
      return res.status(400).json({ error: "Notification ID is required" });
    }
    if (!userId) {
      return res.status(401).json({ error: "User not authenticated" });
    }

    const deleted = await deleteNotificationById(notificationId, userId);
    if (!deleted) {
      return res.status(404).json({ error: "Notification not found" });
    }
    res.status(200).json({ message: "Notification deleted successfully" });
  } catch (error) {
    console.error("Failed to delete notification:", error.message);
    res.status(500).json({ error: "Failed to delete notification" });
  }
};