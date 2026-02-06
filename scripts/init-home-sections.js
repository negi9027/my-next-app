// Script to initialize home sections tables
import pool from '../src/lib/db.js';
import { readFile } from 'fs/promises';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

async function initHomeSections() {
    let conn;
    try {
        console.log('🔄 Connecting to database...');
        conn = await pool.getConnection();

        console.log('📖 Reading SQL file...');
        const sqlPath = join(__dirname, 'create_home_sections_table.sql');
        const sql = await readFile(sqlPath, 'utf-8');

        // Split by semicolon and execute each statement
        const statements = sql
            .split(';')
            .map(s => s.trim())
            .filter(s => s.length > 0);

        console.log(`📝 Executing ${statements.length} SQL statements...`);

        for (const statement of statements) {
            await conn.execute(statement);
        }

        console.log('✅ Home sections tables created successfully!');
        console.log('✅ Default data inserted!');

    } catch (err) {
        console.error('❌ Error:', err.message);
        throw err;
    } finally {
        if (conn) conn.release();
        process.exit(0);
    }
}

initHomeSections();
