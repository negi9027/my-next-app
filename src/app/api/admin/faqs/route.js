import pool from "@/lib/db";

/* GET */
export async function GET() {
  const conn = await pool.getConnection();
  const [rows] = await conn.execute(
    "SELECT * FROM faqs ORDER BY position ASC, id DESC"
  );
  conn.release();
  return Response.json(rows);
}

/* POST */
export async function POST(req) {
  const { question, answer, page = "home", position = 0, is_enabled = 1 } = await req.json();

  const conn = await pool.getConnection();
  await conn.execute(
    `INSERT INTO faqs (question, answer, page, position, is_enabled)
     VALUES (?, ?, ?, ?, ?)`,
    [question, answer, page, Number(position), is_enabled ? 1 : 0]
  );
  conn.release();

  return Response.json({ success: true });
}

/* PUT */
export async function PUT(req) {
  const { id, question, answer, page = "home", position = 0, is_enabled = 1 } = await req.json();

  if (!id) {
    return Response.json({ success: false, error: "FAQ ID missing" }, { status: 400 });
  }

  const conn = await pool.getConnection();
  await conn.execute(
    `UPDATE faqs 
     SET question=?, answer=?, page=?, position=?, is_enabled=? 
     WHERE id=?`,
    [question, answer, page, Number(position), is_enabled ? 1 : 0, Number(id)]
  );
  conn.release();

  return Response.json({ success: true });
}

/* DELETE */
export async function DELETE(req) {
  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");

  const conn = await pool.getConnection();
  await conn.execute("DELETE FROM faqs WHERE id=?", [id]);
  conn.release();

  return Response.json({ success: true });
}
