import pg from 'pg';
import { promises as fs } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const { Pool } = pg;

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const DB_FILE = join(__dirname, 'database.json');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false
  }
});

// Initialize database
export async function initDatabase() {
  try {
    const client = await pool.connect();
    try {
      // Create table if not exists
      await client.query(`
        CREATE TABLE IF NOT EXISTS requests (
          id TEXT PRIMARY KEY,
          data JSONB NOT NULL,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );
      `);
      console.log('✅ Database table initialized');

      // Check if data needs migration
      const res = await client.query('SELECT COUNT(*) FROM requests');
      if (parseInt(res.rows[0].count) === 0) {
        console.log('Migrating data from JSON file...');
        try {
          const data = await fs.readFile(DB_FILE, 'utf-8');
          const jsonData = JSON.parse(data);
          if (jsonData.requests && jsonData.requests.length > 0) {
            for (const req of jsonData.requests) {
              // Check if ID exists (it should, as we checked count=0, but strictly speaking)
              await client.query(
                'INSERT INTO requests (id, data, created_at) VALUES ($1, $2, $3)',
                [req.id, req, req.createdAt || new Date()]
              );
            }
            console.log(`✅ Migrated ${jsonData.requests.length} requests from JSON file`);
          }
        } catch (err) {
          console.log('No local database.json found or error reading it, skipping migration.', err.message);
        }
      }
    } finally {
      client.release();
    }
  } catch (err) {
    console.error('Failed to initialize database:', err);
    throw err;
  }
}

export const dbOperations = {
  // Get all requests
  async getAllRequests() {
    const { rows } = await pool.query('SELECT data FROM requests ORDER BY created_at DESC');
    return rows.map(row => row.data);
  },

  // Get single request by ID
  async getRequestById(id) {
    const { rows } = await pool.query('SELECT data FROM requests WHERE id = $1', [id]);
    return rows[0] ? rows[0].data : null;
  },

  // Create new request
  async createRequest(request) {
    const newRequest = {
      ...request,
      submissions: request.submissions || [],
      status: request.status || 'In Progress',
      createdAt: new Date().toISOString(),
    };

    await pool.query(
      'INSERT INTO requests (id, data, created_at) VALUES ($1, $2, $3)',
      [newRequest.id, newRequest, newRequest.createdAt]
    );
    return newRequest;
  },

  // Add submission to a request
  async addSubmission(requestId, submission) {
    const client = await pool.connect();
    try {
      await client.query('BEGIN');
      const { rows } = await client.query('SELECT data FROM requests WHERE id = $1 FOR UPDATE', [requestId]);
      if (rows.length === 0) {
        await client.query('ROLLBACK');
        return null;
      }

      const request = rows[0].data;
      if (!request.submissions) request.submissions = [];

      request.submissions.push({
        ...submission,
        createdAt: new Date().toISOString()
      });

      await client.query('UPDATE requests SET data = $1 WHERE id = $2', [request, requestId]);
      await client.query('COMMIT');
      return request;
    } catch (e) {
      await client.query('ROLLBACK');
      throw e;
    } finally {
      client.release();
    }
  },

  // Update request status
  async updateRequestStatus(id, status) {
    const client = await pool.connect();
    try {
      await client.query('BEGIN');
      const { rows } = await client.query('SELECT data FROM requests WHERE id = $1 FOR UPDATE', [id]);
      if (rows.length === 0) {
        await client.query('ROLLBACK');
        return null;
      }

      const request = rows[0].data;
      request.status = status;

      await client.query('UPDATE requests SET data = $1 WHERE id = $2', [request, id]);
      await client.query('COMMIT');
      return request;
    } catch (e) {
      await client.query('ROLLBACK');
      throw e;
    } finally {
      client.release();
    }
  },

  // Update full request
  async updateRequest(id, updates) {
    const client = await pool.connect();
    try {
      await client.query('BEGIN');
      const { rows } = await client.query('SELECT data FROM requests WHERE id = $1 FOR UPDATE', [id]);
      if (rows.length === 0) {
        await client.query('ROLLBACK');
        return null;
      }

      const request = rows[0].data;
      const updatedRequest = {
        ...request,
        ...updates,
        id: id // Ensure ID doesn't change
      };

      await client.query('UPDATE requests SET data = $1 WHERE id = $2', [updatedRequest, id]);
      await client.query('COMMIT');
      return updatedRequest;
    } catch (e) {
      await client.query('ROLLBACK');
      throw e;
    } finally {
      client.release();
    }
  }
};
