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
  taskPriorityRoutes,
  milestoneRoutes,
  sprintRoutes,
  notificationRoutes,
  tagRoutes,
  timeLogRoutes,
  activityLogRoutes,
  roleRoutes,
  dashboardRoutes,
  folderRoutes,
  listRoutes,
  aiRoutes,
} from "./routes/index.js";
import { protectedRoute } from "./middlewares/authMiddlewares.js";

import swaggerUi from "swagger-ui-express";
import swaggerJsdoc from "swagger-jsdoc";

dotenv.config();
const app = express();
const PORT = process.env.PORT || 5001;
const HOST = process.env.HOST || "0.0.0.0";

//middleware
app.use(cors({
    origin: 'http://localhost:5173',
    credentials: true,
}));
app.use(express.json());
app.use(cookieParser());

//swagger
const swaggerOptions = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "FLOWISE API",
      version: "1.0.0",
      description: "Tài liệu API cho hệ thống quản lý công việc Flowise",
    },
    servers: [
      {
        url: `http://localhost:${PORT}`,
        description: "Development Server",
      },
    ],

    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
        },
      },
    },
    security: [
      {
        bearerAuth: [],
      },
    ],
  },
  apis: ["./src/routes/*.js"],
};
const swaggerSpec = swaggerJsdoc(swaggerOptions);
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

//public route
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

//private route
app.use(protectedRoute);
app.use("/api/v1/ai", aiRoutes);
app.use("/api/v1/users", userRoutes);
app.use("/api/v1/workspaces", workspacesRoutes);
app.use("/api/v1/spaces", spaceRoutes);
app.use("/api/v1/tasks", taskRoutes);
app.use("/api/v1/statuses", taskStatusRoutes);
app.use("/api/v1/priorities", taskPriorityRoutes);
app.use("/api/v1/milestones", milestoneRoutes);
app.use("/api/v1/sprints", sprintRoutes);
app.use("/api/v1/notifications", notificationRoutes);
app.use("/api/v1/tags", tagRoutes);
app.use("/api/v1/timelogs", timeLogRoutes);
app.use("/api/v1/activities", activityLogRoutes);
app.use("/api/v1/roles", roleRoutes);
app.use("/api/v1/dashboard", dashboardRoutes);
app.use("/api/v1/folders", folderRoutes);
app.use("/api/v1/lists", listRoutes);

//error handling middleware
app.listen(PORT, HOST, () => {
  console.log(`Server is running on ${HOST}:${PORT}`);
});
