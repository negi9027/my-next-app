import pool from "@/lib/db";

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const search = searchParams.get("search") || "";
    const page = parseInt(searchParams.get("page") || "1");
    const limit = 10;
    const offset = (page - 1) * limit;

let where = "";
    let values = [];

    if (search) {
      where =
        "WHERE name LIKE ? OR email LIKE ? OR phone LIKE ?";
      values = [`%${search}%`, `%${search}%`, `%${search}%`];
    }

    // total count
    const [countRows] = await pool.execute(
      `SELECT COUNT(*) as total FROM enquiry ${where}`,
      values
    );

    // data
    const [rows] = await pool.execute(
      `SELECT * FROM enquiry ${where} ORDER BY id DESC LIMIT ${limit} OFFSET ${offset}`,
      values
    );

    return new Response(
      JSON.stringify({
        success: true,
        data: rows,
        total: countRows[0].total,
      }),
      { status: 200 }
    );
  } catch (err) {
    return new Response(
      JSON.stringify({ success: false, error: err.message }),
      { status: 500 }
    );
  }
}
