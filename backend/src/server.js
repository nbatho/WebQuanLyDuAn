import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import con  from './config/connect.js';
dotenv.config();
const app = express();
const PORT = process.env.PORT || 5001;

//middleware
app.use(cors());
app.use(express.json());

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


app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
