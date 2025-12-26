import mysql from "mysql2/promise";

if (!process.env.DB_HOST) {
  throw new Error("DB_HOST is not defined in environment variables");
}

const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: Number(process.env.DB_PORT || 3306),
  waitForConnections: true,
  connectionLimit: 5, // important for Vercel
});

/**
 * Lightweight DB connectivity test used in admin UI and /api/_status/db
 * Returns true when a simple query succeeds, otherwise false.
 */
export async function testConnection() {
  try {
    await pool.query('SELECT 1');
    return true;
  } catch (err) {
    console.error('testConnection failed:', err?.message || err);
    return false;
  }
}

export default pool;
