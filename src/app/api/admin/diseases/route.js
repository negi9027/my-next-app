// C:\Users\esfgi\Desktop\next_web\myproject\src\app\api\admin\diseases\route.js
import pool from "@/lib/db";

const safe = (v) => (v === undefined || v === "" ? null : v);

export async function GET() {
  const conn = await pool.getConnection();

  const [rows] = await conn.execute(`
    SELECT 
      d.*,
      c.name AS category_name,
      c.slug AS category_slug
    FROM diseases d
    LEFT JOIN disease_categories c 
      ON d.category_id = c.id
    ORDER BY d.id DESC
  `);

  conn.release();
  return new Response(JSON.stringify(rows), { status: 200 });
}

export async function POST(req) {
  try {
    const formData = await req.json();

    // ✅ FAQ safe stringify
    const faqs = typeof formData.faqs === "string"
      ? formData.faqs
      : JSON.stringify(formData.faqs || []);

    const conn = await pool.getConnection();

await conn.execute(`
  INSERT INTO diseases 
  (category_id, title, slug, intro, symptoms, tips, faqs, icon, main_image,
   meta_title, meta_description, meta_keywords, status)
  VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
  [
    safe(formData.category_id),
    safe(formData.title),
    safe(formData.slug),
    safe(formData.intro),
    safe(formData.symptoms),
    safe(formData.tips),
    faqs,
    safe(formData.icon),
    safe(formData.main_image),
    safe(formData.meta_title),
    safe(formData.meta_description),
    safe(formData.meta_keywords),
    safe(formData.status || "active"),
  ]
);

    conn.release();
    return new Response(JSON.stringify({ success: true }), { status: 200 });

  } catch (err) {
    console.error("POST ERROR:", err);
    return new Response(JSON.stringify({ success: false, error: err.message }), { status: 500 });
  }
}

export async function PUT(req) {
  try {
    const formData = await req.json();

    if (!formData.id) {
      return new Response(JSON.stringify({ success: false, error: "ID missing" }), { status: 400 });
    }

    const faqs = typeof formData.faqs === "string"
      ? formData.faqs
      : JSON.stringify(formData.faqs || []);

    const conn = await pool.getConnection();

await conn.execute(`
  UPDATE diseases SET
  category_id=?,
  title=?, slug=?, intro=?, symptoms=?, tips=?, faqs=?,
  icon=?, main_image=?, meta_title=?, meta_description=?, meta_keywords=?, status=?
  WHERE id=?`,
  [
    safe(formData.category_id),
    safe(formData.title),
    safe(formData.slug),
    safe(formData.intro),
    safe(formData.symptoms),
    safe(formData.tips),
    faqs,
    safe(formData.icon),
    safe(formData.main_image),
    safe(formData.meta_title),
    safe(formData.meta_description),
    safe(formData.meta_keywords),
    safe(formData.status || "active"),
    formData.id
  ]
);


    conn.release();
    return new Response(JSON.stringify({ success: true }), { status: 200 });

  } catch (err) {
    console.error("PUT ERROR:", err);
    return new Response(JSON.stringify({ success: false, error: err.message }), { status: 500 });
  }
}

export async function DELETE(req) {
  const url = new URL(req.url);
  const id = url.searchParams.get("id");

  const conn = await pool.getConnection();
  await conn.execute("DELETE FROM diseases WHERE id=?", [id]);
  conn.release();

  return new Response(JSON.stringify({ success: true }), { status: 200 });
}
