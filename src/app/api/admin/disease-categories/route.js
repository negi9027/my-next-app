import pool from "@/lib/db";

export async function GET() {
  const conn = await pool.getConnection();
  const [rows] = await conn.execute(
    "SELECT * FROM disease_categories WHERE status='active' ORDER BY name"
  );
  conn.release();
  return Response.json(rows);
}

export async function POST(req) {
  const body = await req.json();
  const conn = await pool.getConnection();

  await conn.execute(
    "INSERT INTO disease_categories (name, slug, status) VALUES (?, ?, ?)",
    [body.name, body.slug, body.status || "active"]
  );

  conn.release();
  return Response.json({ success: true });
}
