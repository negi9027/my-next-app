import pool from "@/lib/db";

export async function GET() {
  try {
    const [rows] = await pool.execute(
      "SELECT * FROM blogs ORDER BY id DESC"
    );

    return new Response(JSON.stringify(rows ?? []), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (err) {
    console.error("/api/admin/blogs GET error:", err);
    return new Response(JSON.stringify({ success: false, error: err?.message || "Server error" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}

export async function POST(req) {
  try {
    const data = await req.json();
    const {
      title,
      slug,
      short_desc,
      content,
      status,
      image,
      meta_title,
      meta_desc,
      meta_keywords,
    } = data;



    await pool.execute(
      `INSERT INTO blogs 
     (title, slug, short_desc, content, status, image, meta_title, meta_desc, meta_keywords) 
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [title, slug, short_desc, content, status, image, meta_title, meta_desc, meta_keywords]
    );

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (err) {
    console.error("/api/admin/blogs POST error:", err);
    return new Response(JSON.stringify({ success: false, error: err?.message || "Server error" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}

export async function DELETE(req) {
  try {
    const url = new URL(req.url);
    const id = url.searchParams.get("id");

    if (!id) {
      return new Response(
        JSON.stringify({ success: false, error: "ID missing" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    const [result] = await pool.execute("DELETE FROM blogs WHERE id=?", [id]);

    return new Response(JSON.stringify({ success: true, affected: result.affectedRows }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (err) {
    console.error("/api/admin/blogs DELETE error:", err);
    return new Response(JSON.stringify({ success: false, error: err.message }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}



export async function PUT(req) {
  try {
    const data = await req.json();
    const {
      id,
      title,
      slug,
      short_desc,
      content,
      status,
      image,
      meta_title,
      meta_desc,
      meta_keywords,
    } = data;

    await pool.execute(
      `UPDATE blogs SET 
      title=?, slug=?, short_desc=?, content=?, status=?, image=?, 
      meta_title=?, meta_desc=?, meta_keywords=? 
     WHERE id=?`,
      [title, slug, short_desc, content, status, image, meta_title, meta_desc, meta_keywords, id]
    );

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (err) {
    console.error("/api/admin/blogs PUT error:", err);
    return new Response(JSON.stringify({ success: false, error: err?.message || "Server error" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
