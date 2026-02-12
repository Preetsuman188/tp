import pg from 'pg';
import bcrypt from 'bcryptjs';
import 'dotenv/config';

const { Pool } = pg;
const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false }
});

async function resetUsers() {
    try {
        const client = await pool.connect();
        try {
            console.log('Resetting users table...');
            await client.query('DROP TABLE IF EXISTS users');
            await client.query(`
        CREATE TABLE users (
          id SERIAL PRIMARY KEY,
          username TEXT UNIQUE NOT NULL,
          password TEXT NOT NULL,
          role TEXT NOT NULL DEFAULT 'viewer',
          name TEXT,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );
      `);

            const hashedPassword = await bcrypt.hash('adminpreet', 10);
            await client.query(
                'INSERT INTO users (username, password, role, name) VALUES ($1, $2, $3, $4)',
                ['preetsuman188@gmail.com', hashedPassword, 'admin', 'Preet suman']
            );

            console.log('✅ Users table reset successfully.');
            console.log('👤 Admin Account: preetsuman188@gmail.com / adminpreet');
        } finally {
            client.release();
        }
    } catch (err) {
        console.error('Failed to reset users:', err);
    } finally {
        await pool.end();
    }
}

resetUsers();
