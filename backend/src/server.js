import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import con from "./config/connect.js";
import cookieParser from "cookie-parser";
import {
  authRoutes,
  userRoutes,
  workspacesRoutes,
  spaceRoutes,
  taskRoutes,
  taskStatusRoutes,
  milestoneRoutes,
  sprintRoutes,
  notificationRoutes,
  timeLogRoutes,
  activityLogRoutes,
  folderRoutes,
  listRoutes,
  memberRoutes,
  aiRoutes,
  messageRoutes,
  uploadRoutes,
} from "./routes/index.js";
import { protectedRoute } from "./middlewares/authMiddlewares.js";
import { globalErrorHandler, notFoundHandler } from "./middlewares/errorMiddleware.js";
import { generalLimiter } from "./middlewares/rateLimitMiddleware.js";
import { ensureMessagingTables } from "./models/Messages.js";

dotenv.config();
const app = express();
const PORT = process.env.PORT || 5001;
const HOST = process.env.HOST || "0.0.0.0";

//middleware
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:5173',
  credentials: true,
}));
app.use(express.json());
app.use(cookieParser());
app.use(generalLimiter);

//public route
import fs from 'fs';
if (!fs.existsSync('uploads')) fs.mkdirSync('uploads', { recursive: true });
app.use('/uploads', express.static('uploads'));

app.get("/db-health", async (req, res) => {
  try {
    const result = await con.query("SELECT NOW()");

    res.json({
      status: "OK",
      database: "connected",
      time: result.rows[0].now,
    });
  } catch (error) {
    res.status(500).json({
      status: "ERROR",
      database: "not connected",
      error: error.message,
    });
  }
});
app.use("/api/v1/auth", authRoutes);
app.use('/api/v1/members', memberRoutes);

//private route
app.use(protectedRoute);
app.use("/api/v1/upload", uploadRoutes);
app.use("/api/v1/ai", aiRoutes);
app.use("/api/v1/users", userRoutes);
app.use("/api/v1/workspaces", workspacesRoutes);
app.use("/api/v1/spaces", spaceRoutes);
app.use("/api/v1/tasks", taskRoutes);
app.use("/api/v1/statuses", taskStatusRoutes);
app.use("/api/v1/milestones", milestoneRoutes);
app.use("/api/v1/sprints", sprintRoutes);
app.use("/api/v1/notifications", notificationRoutes);
app.use("/api/v1/timelogs", timeLogRoutes);
app.use("/api/v1/activities", activityLogRoutes);
app.use("/api/v1/folders", folderRoutes);
app.use("/api/v1/lists", listRoutes);
app.use('/api/v1/messages', messageRoutes);

// ── 404 handler (đặt sau tất cả routes) ────────────────────────
app.use(notFoundHandler);

// ── Global error handler (đặt cuối cùng) ────────────────────────
app.use(globalErrorHandler);

app.listen(PORT, HOST, () => {
  console.log(`Server is running on ${HOST}:${PORT}`);
  ensureMessagingTables();
});
