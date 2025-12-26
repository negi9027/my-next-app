import pool from "@/lib/db";

/* GET ALL SETTINGS */
export async function GET() {
  const [rows] = await pool.execute("SELECT * FROM site_settings ORDER BY id ASC");
  return Response.json(rows);
} 

/* UPDATE / ADD SETTING */
export async function POST(req) {
  const { key, value, enabled } = await req.json();

  await pool.execute(
    `INSERT INTO site_settings (setting_key, setting_value, is_enabled)
     VALUES (?, ?, ?)
     ON DUPLICATE KEY UPDATE setting_value=?, is_enabled=?`,
    [key, value, enabled, value, enabled]
  );

  return Response.json({ success: true });
}

/* TOGGLE ENABLE / DISABLE */
export async function PUT(req) {
  const { key, enabled } = await req.json();

  await pool.execute(
    "UPDATE site_settings SET is_enabled=? WHERE setting_key=?",
    [enabled, key]
  );

  return Response.json({ success: true });
}
