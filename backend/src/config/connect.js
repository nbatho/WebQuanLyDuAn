import pkg from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const { Pool } = pkg; 

const con = new Pool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT,
    max: 20, 
    idleTimeoutMillis: 30000, 
    connectionTimeoutMillis: 2000, 
});

con.connect((err, client, release) => {
    if (err) {
        return console.error('Lỗi kết nối tới PostgreSQL:', err.stack);
    }
    console.log("Connected to PostgreSQL successfully via Pool!");
    release();
});

export default con;