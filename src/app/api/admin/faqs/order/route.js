import pool from "@/lib/db";

export async function POST(req) {
  const data = await req.json();
  const conn = await pool.getConnection();

  for (const f of data) {
    await conn.execute(
      "UPDATE faqs SET position=? WHERE id=?",
      [Number(f.position), Number(f.id)]
    );
  }

  conn.release();
  return Response.json({ success: true });
}
