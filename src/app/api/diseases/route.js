import pool from "@/lib/db";

export async function GET() {
    try {
        const [rows] = await pool.query(`
            SELECT d.id, d.title as name, d.slug, c.name as category
            FROM diseases d
            LEFT JOIN disease_categories c ON d.category_id = c.id
            WHERE d.status = 'active'
            ORDER BY c.name ASC, d.title ASC
        `);
        return new Response(JSON.stringify(rows), {
            status: 200,
            headers: { "Content-Type": "application/json" },
        });
    } catch (err) {
        return new Response(JSON.stringify({ error: err.message }), {
            status: 500,
            headers: { "Content-Type": "application/json" },
        });
    }
}
