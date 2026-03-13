import pkg from 'pg';
import dotenv from 'dotenv';
dotenv.config();
const { Client } = pkg;

const con = new Client({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT
});

await con.connect();

console.log("Connected to PostgreSQL");

export default con;