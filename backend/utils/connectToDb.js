import pg from 'pg';
import dotenv from 'dotenv';

dotenv.config(); // use standard "dotenv" name

let dbConfig;

if (process.env.DATABASE_URL) {
    // Use DATABASE_URL for Render or other hosted services
    dbConfig = {
        connectionString: process.env.DATABASE_URL,
        ssl: { rejectUnauthorized: false }, // Required for Render's PostgreSQL
        max: 20,       // optional: max pool size
        idleTimeoutMillis: 30000, // optional: release idle clients after 30s
        connectionTimeoutMillis: 2000 // optional: wait max 2s for connection
    };
} else {
    // Fallback to individual environment variables for local development
    const requiredEnvVars = ['PG_USER', 'PG_HOST', 'PG_DATABASE', 'PG_PORT', 'PG_PASSWORD'];
    requiredEnvVars.forEach((varName) => {
        if (!process.env[varName]) {
            console.error(`Missing environment variable: ${varName}`);
            process.exit(1);
        }
    });

    dbConfig = {
        user: process.env.PG_USER,
        host: process.env.PG_HOST,
        database: process.env.PG_DATABASE,
        password: process.env.PG_PASSWORD,
        port: parseInt(process.env.PG_PORT, 10), // ensure port is a number
        max: 20,       // optional: max pool size
        idleTimeoutMillis: 30000, // optional: release idle clients after 30s
        connectionTimeoutMillis: 2000 // optional: wait max 2s for connection
    };
}

const db = new pg.Pool(dbConfig);

console.log('Attempting to connect to database...');

db.connect()
  .then(() => console.log('Connected to the database'))
  .catch((err) => {
      console.error('Database connection error:', err);
      process.exit(1);
  });

db.on('error', (err) => {
    console.error('Unexpected database error:', err);
    process.exit(1);
});

// Export a helper function for queries
export const query = (text, params) => db.query(text, params);
export default db; // optional, in case you want to access pool directly
