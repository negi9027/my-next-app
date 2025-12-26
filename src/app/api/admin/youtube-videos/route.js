import pool from "@/lib/db";

/* GET */
export async function GET() {
  const conn = await pool.getConnection();
  const [rows] = await conn.execute(
    "SELECT * FROM youtube_videos ORDER BY position ASC, id DESC"
  );
  conn.release();
  return Response.json(rows);
}

/* POST */
export async function POST(req) {
  const { title, youtube_id, position, is_enabled } = await req.json();

  const conn = await pool.getConnection();
  await conn.execute(
    "INSERT INTO youtube_videos (title, youtube_id, position, is_enabled) VALUES (?,?,?,?)",
    [title, youtube_id, position || 0, is_enabled ? 1 : 0]
  );
  conn.release();

  return Response.json({ success: true });
}

/* PUT */
export async function PUT(req) {
  const { id, title, youtube_id, position, is_enabled } = await req.json();

  const conn = await pool.getConnection();
  await conn.execute(
    `UPDATE youtube_videos SET title=?, youtube_id=?, position=?, is_enabled=? WHERE id=?`,
    [title, youtube_id, position, is_enabled ? 1 : 0, id]
  );
  conn.release();

  return Response.json({ success: true });
}

/* DELETE */
export async function DELETE(req) {
  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");

  const conn = await pool.getConnection();
  await conn.execute("DELETE FROM youtube_videos WHERE id=?", [id]);
  conn.release();

  return Response.json({ success: true });
}
