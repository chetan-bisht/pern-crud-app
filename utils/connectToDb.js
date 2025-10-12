import pg from 'pg';
import env from 'dotenv';

env.config();

const requiredEnvVars = [
    'PG_USER',
    'PG_HOST', 
    'PG_DATABASE',
    'PG_PORT',
    'PG_PASSWORD'
];

requiredEnvVars.forEach((varName) => {
    if (!process.env[varName]) {
        console.log(`Missing environment variable: ${varName}`);
        process.exit(1);
    }
});

const db = new pg.Pool({
    user: process.env.PG_USER,
    host: process.env.PG_HOST,
    database: process.env.PG_DATABASE,
    password: process.env.PG_PASSWORD,
    port: process.env.PG_PORT
});

db.connect() // Attempt to connect to the database
    .then(() => console.log('Connected to the database'))
    .catch((err) => {
        console.log('Database connection error:', err);// Handle connection errors
        process.exit(1);
    });

db.on('error', (err) => {  // Handle database errors
    console.log('Database error:', err);// Log the error
    process.exit(1);
});

export const query = (text, params) => db.query(text, params); // Export a query function for executing SQL queries