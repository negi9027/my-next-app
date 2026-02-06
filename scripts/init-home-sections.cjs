// Simple script to initialize home sections tables
const mysql = require('mysql2/promise');
const fs = require('fs');
const path = require('path');

// Read .env.local file manually
const envPath = path.join(__dirname, '..', '.env.local');
const envContent = fs.readFileSync(envPath, 'utf-8');
const envVars = {};

envContent.split('\n').forEach(line => {
    const match = line.match(/^([^=]+)=(.*)$/);
    if (match) {
        envVars[match[1].trim()] = match[2].trim();
    }
});

async function initHomeSections() {
    let conn;
    try {
        console.log('🔄 Connecting to database...');
        console.log(`Database: ${envVars.DB_NAME || 'kidney_health_db'}`);

        const pool = mysql.createPool({
            host: envVars.DB_HOST || 'localhost',
            user: envVars.DB_USER || 'root',
            password: envVars.DB_PASSWORD || '',
            database: envVars.DB_NAME || 'kidney_health_db',
            waitForConnections: true,
            connectionLimit: 10,
            queueLimit: 0,
            multipleStatements: true
        });

        conn = await pool.getConnection();
        console.log('✅ Connected to database');

        console.log('📖 Reading SQL file...');
        const sqlPath = path.join(__dirname, 'create_home_sections_table.sql');
        const sql = fs.readFileSync(sqlPath, 'utf-8');

        // Execute all statements
        console.log('📝 Executing SQL statements...');
        await conn.query(sql);

        console.log('✅ Home sections tables initialized successfully!');
        console.log('✅ Default data inserted!');
        console.log('');
        console.log('📌 Next steps:');
        console.log('   1. Start your dev server: npm run dev');
        console.log('   2. Go to: http://localhost:3000/admin/home-management');
        console.log('   3. Manage your home page content!');

    } catch (err) {
        console.error('❌ Error:', err.message);
        if (err.code === 'ER_TABLE_EXISTS_ERROR') {
            console.log('⚠ Tables already exist, skipping creation');
        } else {
            throw err;
        }
    } finally {
        if (conn) conn.release();
        process.exit(0);
    }
}

initHomeSections();
