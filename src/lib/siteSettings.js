import pool from "@/lib/db";

export async function getSiteSettings() {
  try {
    const conn = await pool.getConnection();
    const [rows] = await conn.execute(
      "SELECT setting_key, setting_value FROM site_settings WHERE is_enabled=1"
    );
    conn.release();

    const settings = {};
    rows.forEach(row => {
      settings[row.setting_key] = row.setting_value;
    });

    return settings;
  } catch (err) {
    // DB likely not available during build; return empty settings so build can continue
    console.warn("getSiteSettings: DB unavailable:", err?.message || err);
    return {};
  }
}
