import pool from "@/lib/db";

export async function OPTIONS() {
  // for preflight checks (if kabhi CORS ya fetch options aayen)
  return new Response(null, {
    status: 204,
    headers: {
      "Allow": "GET, POST, OPTIONS",
      "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
    },
  });
}

export async function GET(request) {
  try {
    const [rows] = await pool.execute("SELECT * FROM users ORDER BY id DESC");
    return new Response(JSON.stringify(rows), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (err) {
    console.error("GET /api/users error:", err);
    return new Response(JSON.stringify({ error: err.message }), { status: 500 });
  }
}

export async function POST(request) {
  try {
    const body = await request.json();
    const name = (body.name || "").trim();
    const email = (body.email || "").trim();

    if (!name || !email) {
      return new Response(JSON.stringify({ error: "Name and email required" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    const [result] = await pool.execute(
      "INSERT INTO users (name, email) VALUES (?, ?)",
      [name, email]
    );

    return new Response(JSON.stringify({ message: "User added", insertId: result.insertId }), {
      status: 201,
      headers: { "Content-Type": "application/json" },
    });
  } catch (err) {
    console.error("POST /api/users error:", err);
    return new Response(JSON.stringify({ error: err.message }), { status: 500 });
  }
}
