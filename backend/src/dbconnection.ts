import { config } from "dotenv";
config();

const CONNECTION = {
    type: 'postgres',
    host: process.env.DATABASE_HOST || 'localhost', 
    port: Number(process.env.DATABASE_PORT) || 5432,
    username: process.env.DATABASE_USER || 'postgres',
    password: process.env.DATABASE_PASS || 'password',
    database: process.env.DATABASE_NAME || 'postgres',
};

export default CONNECTION;
