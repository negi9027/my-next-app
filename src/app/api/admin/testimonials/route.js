import pool from "@/lib/db";

const safe = (v) => (v === undefined || v === "" ? null : v);

// ✅ GET ALL TESTIMONIALS
export async function GET() {
  const conn = await pool.getConnection();
  const [rows] = await conn.execute(
    "SELECT * FROM testimonials ORDER BY id DESC"
  );
  conn.release();
  return new Response(JSON.stringify(rows), { status: 200 });
}

// ✅ ADD TESTIMONIAL
export async function POST(req) {
  try {
    const data = await req.json();
    const conn = await pool.getConnection();

    await conn.execute(
      `INSERT INTO testimonials
      (name, disease, message, rating, location, image, status)
      VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [
        safe(data.name),
        safe(data.disease),
        safe(data.message),
        safe(data.rating || 5),
        safe(data.location),
        safe(data.image),
        safe(data.status || "active"),
      ]
    );

    conn.release();
    return new Response(JSON.stringify({ success: true }), { status: 200 });
  } catch (err) {
    return new Response(
      JSON.stringify({ success: false, error: err.message }),
      { status: 500 }
    );
  }
}

// ✅ UPDATE TESTIMONIAL
export async function PUT(req) {
  const data = await req.json();
  if (!data.id)
    return new Response(JSON.stringify({ error: "ID missing" }), { status: 400 });

  const conn = await pool.getConnection();
  await conn.execute(
    `UPDATE testimonials SET
      name=?, disease=?, message=?, rating=?, location=?, image=?, status=?
     WHERE id=?`,
    [
      safe(data.name),
      safe(data.disease),
      safe(data.message),
      safe(data.rating),
      safe(data.location),
      safe(data.image),
      safe(data.status),
      data.id,
    ]
  );
  conn.release();
  return new Response(JSON.stringify({ success: true }), { status: 200 });
}

// ✅ DELETE TESTIMONIAL
export async function DELETE(req) {
  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");

  const conn = await pool.getConnection();
  await conn.execute("DELETE FROM testimonials WHERE id=?", [id]);
  conn.release();

  return new Response(JSON.stringify({ success: true }), { status: 200 });
}
