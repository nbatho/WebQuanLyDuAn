import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import con  from './config/connect.js';
import cookieParser from 'cookie-parser';
import { 
    authRoutes,
    userRoutes,
    workspacesRoutes,
    spaceRoutes,
    taskRoutes,
    milestoneRoutes,
    sprintRoutes,
    notificationRoutes
} from './routes/index.js';
import { protectedRoute } from './middlewares/authMiddlewares.js';

import swaggerUi from 'swagger-ui-express';
import swaggerJsdoc from 'swagger-jsdoc';


dotenv.config();
const app = express();
const PORT = process.env.PORT || 5001;
const HOST = process.env.HOST || '0.0.0.0';

//middleware
app.use(cors());
app.use(express.json());
app.use(cookieParser());

//swagger
const swaggerOptions = {
    definition: {
        openapi: '3.0.0', 
        info: {
            title: 'FLOWISE API',
            version: '1.0.0',
            description: 'Tài liệu API cho hệ thống quản lý công việc Flowise',
        },
        servers: [
            {
                url: `http://localhost:${PORT}`, 
                description: 'Development Server'
            },
        ],

        components: {
            securitySchemes: {
                bearerAuth: {
                    type: 'http',
                    scheme: 'bearer',
                    bearerFormat: 'JWT',
                }
            }
        },
        security: [{
            bearerAuth: [] 
        }]
    },
    apis: ['./src/routes/*.js'], 
};
const swaggerSpec = swaggerJsdoc(swaggerOptions);
app.use('/api', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
//public route
app.get('/db-health', async (req, res) => {
    try {
        const result = await con.query('SELECT NOW()');

        res.json({
            status: 'OK',
            database: "connected",
            time: result.rows[0].now
        })
    } catch (error) {
        res.status(500).json({
            status: 'ERROR',
            database: "not connected",
            error: error.message
        })
    }
});
app.use('api/v1/auth', authRoutes);



//private route'
app.use(protectedRoute);
app.use('api/v1/user', userRoutes);
app.use('api/v1/workspaces', workspacesRoutes);
app.use('api/v1/spaces', spaceRoutes);
app.use('api/v1/tasks', taskRoutes);
app.use('api/v1/milestones', milestoneRoutes);
app.use('api/v1/sprints', sprintRoutes);
app.use('api/v1/notifications', notificationRoutes);


//error handling middleware
app.listen(PORT, HOST, () => {
    console.log(`Server is running on ${HOST}:${PORT}`);
});
