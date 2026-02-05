import pool from "@/lib/db";

export async function POST(req) {
    try {
        const { updates } = await req.json();

        if (!updates || !Array.isArray(updates)) {
            return Response.json({ error: 'Invalid updates array' }, { status: 400 });
        }

        const conn = await pool.getConnection();

        // Update positions for all videos
        for (const update of updates) {
            await conn.execute(
                "UPDATE youtube_videos SET position = ? WHERE id = ?",
                [update.position, update.id]
            );
        }

        conn.release();

        return Response.json({ success: true });
    } catch (error) {
        console.error('Reorder error:', error);
        return Response.json({ error: 'Failed to reorder videos' }, { status: 500 });
    }
}
