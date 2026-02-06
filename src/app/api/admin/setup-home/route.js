import { NextResponse } from "next/server";
import pool from "@/lib/db";
import fs from "fs";
import path from "path";

// Setup endpoint to initialize home sections tables
export async function POST() {
    try {
        const sqlPath = path.join(process.cwd(), "scripts", "create_home_sections_table.sql");
        const sql = fs.readFileSync(sqlPath, "utf-8");

        // Split by semicolon and execute each statement
        const statements = sql
            .split(';')
            .map(s => s.trim())
            .filter(s => s.length > 0);

        const conn = await pool.getConnection();
        const results = [];
        const errors = [];

        for (let i = 0; i < statements.length; i++) {
            try {
                await conn.execute(statements[i]);
                results.push(`Statement ${i + 1} executed successfully`);
            } catch (err) {
                // Ignore duplicate/already exists errors
                if (err.code === 'ER_TABLE_EXISTS_ERROR' ||
                    err.code === 'ER_DUP_ENTRY' ||
                    err.message.includes('already exists')) {
                    results.push(`Statement ${i + 1} skipped (already exists)`);
                } else {
                    errors.push(`Statement ${i + 1} error: ${err.message}`);
                }
            }
        }

        conn.release();

        return NextResponse.json({
            success: true,
            message: "Home sections tables initialized!",
            results,
            errors: errors.length > 0 ? errors : null
        });

    } catch (err) {
        console.error("Setup error:", err);
        return NextResponse.json(
            {
                success: false,
                error: err.message
            },
            { status: 500 }
        );
    }
}
