import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import con  from './config/connect.js';
import cookieParser from 'cookie-parser';
import { 
    authRoutes,
    userRoutes
} from './routes/index.js';
import { protectedRoute } from './middlewares/authMiddlewares.js';
dotenv.config();
const app = express();
const PORT = process.env.PORT || 5001;
const HOST = process.env.HOST || '0.0.0.0';

//middleware
app.use(cors());
app.use(express.json());
app.use(cookieParser());
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
app.use('/api/auth', authRoutes);



//private route'
app.use(protectedRoute);
app.use('/api/user', userRoutes);



//error handling middleware
app.listen(PORT, HOST, () => {
    console.log(`Server is running on ${HOST}:${PORT}`);
});
