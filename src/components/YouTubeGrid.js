import pool from "@/lib/db";
import YouTubeGridClient from "./YouTubeGridClient";

export default async function YouTubeGrid() {
  try {
    const conn = await pool.getConnection();
    const [videos] = await conn.execute(
      "SELECT id, title, youtube_id FROM youtube_videos WHERE is_enabled=1 ORDER BY position ASC"
    );
    conn.release();

    return <YouTubeGridClient videos={videos} />;
  } catch (err) {
    console.warn("YouTubeGrid: DB unavailable:", err?.message || err);
    return <YouTubeGridClient videos={[]} />;
  }
}
