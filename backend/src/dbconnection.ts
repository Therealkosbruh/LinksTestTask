import {config} from "dotenv";
config();

const CONNECTION = {
    type: 'postgres',
    host: 'localhost',
    port: process.env.DATABASE_PORT,
    username: process.env.DATABASE_USER,
    password: process.env.DATABASE_PASS,
    database: process.env.DATABASE_NAME,
} 

export default CONNECTION;