import pool from "@/lib/db";

export async function POST(req) {
  try {
    const body = await req.json();
    const { name, email, phone, disease, message, page_url } = body;

    // get user IP & user agent from headers
    const ip_address =
      req.headers.get("x-forwarded-for") ||
      req.headers.get("x-real-ip") ||
      "Unknown";

    const user_agent = req.headers.get("user-agent") || "Unknown";

    // check duplicate (same email + phone)
    const [existing] = await pool.execute(
      "SELECT id FROM enquiry WHERE email=? AND phone=?",
      [email, phone]
    );
    const is_duplicate = existing.length > 0 ? 1 : 0;

    const [result] = await pool.execute(
      `INSERT INTO enquiry
      (name, email, phone, disease, message, page_url, ip_address, user_agent, is_duplicate)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [name, email, phone, disease, message, page_url, ip_address, user_agent, is_duplicate]
    );

    return new Response(
      JSON.stringify({ success: true, id: result.insertId, is_duplicate }),
      { status: 200, headers: { "Content-Type": "application/json" } }
    );
  } catch (err) {
    return new Response(
      JSON.stringify({ success: false, error: err.message }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}
