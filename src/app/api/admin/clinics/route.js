import pool from "@/lib/db";
import fs from "fs";
import path from "path";

const uploadPath = path.join(process.cwd(), "public/uploads/clinics");

/* ===================== GET ===================== */
export async function GET() {
  const conn = await pool.getConnection();
  const [rows] = await conn.execute("SELECT * FROM clinics ORDER BY id DESC");
  conn.release();

  return new Response(JSON.stringify(rows), { status: 200 });
}

/* ===================== POST (ADD) ===================== */
export async function POST(req) {
  try {
    const formData = await req.formData();

    const name = formData.get("name");
    const slug = formData.get("slug");
    const location = formData.get("location");
    const intro = formData.get("intro");
    const services = formData.get("services");
    const faqs = formData.get("faqs");
    const meta_title = formData.get("meta_title");
    const meta_description = formData.get("meta_description");
    const meta_keywords = formData.get("meta_keywords");
    const status = formData.get("status") || "active";

    const iconFile = formData.get("icon");
    const imageFile = formData.get("main_image");

    let iconName = null;
    let imageName = null;

    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true });
    }

    if (iconFile && iconFile.name) {
      const buffer = Buffer.from(await iconFile.arrayBuffer());
      iconName = Date.now() + "_" + iconFile.name;
      fs.writeFileSync(path.join(uploadPath, iconName), buffer);
    }

    if (imageFile && imageFile.name) {
      const buffer = Buffer.from(await imageFile.arrayBuffer());
      imageName = Date.now() + "_" + imageFile.name;
      fs.writeFileSync(path.join(uploadPath, imageName), buffer);
    }

    const conn = await pool.getConnection();

    await conn.execute(`
      INSERT INTO clinics
      (name, slug, location, intro, services, faqs, icon, main_image, meta_title, meta_description, meta_keywords, status)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `, [
      name, slug, location, intro, services, faqs,
      iconName, imageName, meta_title, meta_description, meta_keywords, status
    ]);

    conn.release();

    return new Response(JSON.stringify({ success: true }), { status: 200 });

  } catch (err) {
    console.error("Clinic POST Error:", err);
    return new Response(JSON.stringify({ success: false, error: err.message }), { status: 500 });
  }
}

/* ===================== PUT (UPDATE) ===================== */
export async function PUT(req) {
  try {
    const formData = await req.formData();

    const id = formData.get("id");
    const name = formData.get("name");
    const slug = formData.get("slug");
    const location = formData.get("location");
    const intro = formData.get("intro");
    const services = formData.get("services");
    const faqs = formData.get("faqs");
    const meta_title = formData.get("meta_title");
    const meta_description = formData.get("meta_description");
    const meta_keywords = formData.get("meta_keywords");
    const status = formData.get("status") || "active";

    const iconFile = formData.get("icon");
    const imageFile = formData.get("main_image");

    let iconName = null;
    let imageName = null;

    if (iconFile && iconFile.name) {
      const buffer = Buffer.from(await iconFile.arrayBuffer());
      iconName = Date.now() + "_" + iconFile.name;
      fs.writeFileSync(path.join(uploadPath, iconName), buffer);
    }

    if (imageFile && imageFile.name) {
      const buffer = Buffer.from(await imageFile.arrayBuffer());
      imageName = Date.now() + "_" + imageFile.name;
      fs.writeFileSync(path.join(uploadPath, imageName), buffer);
    }

    const conn = await pool.getConnection();

    // build dynamic query (so old images aren’t lost)
    let sql = `
      UPDATE clinics SET
        name=?, slug=?, location=?, intro=?, services=?, faqs=?,
        meta_title=?, meta_description=?, meta_keywords=?, status=?
    `;
    const values = [
      name, slug, location, intro, services, faqs,
      meta_title, meta_description, meta_keywords, status
    ];

    if (iconName) {
      sql += ", icon=?";
      values.push(iconName);
    }

    if (imageName) {
      sql += ", main_image=?";
      values.push(imageName);
    }

    sql += " WHERE id=?";
    values.push(id);

    await conn.execute(sql, values);
    conn.release();

    return new Response(JSON.stringify({ success: true }), { status: 200 });

  } catch (err) {
    console.error("Clinic PUT Error:", err);
    return new Response(JSON.stringify({ success: false, error: err.message }), { status: 500 });
  }
}

/* ===================== DELETE ===================== */
export async function DELETE(req) {
  try {
    const url = new URL(req.url);
    const id = url.searchParams.get("id");

    const conn = await pool.getConnection();
    await conn.execute("DELETE FROM clinics WHERE id=?", [id]);
    conn.release();

    return new Response(JSON.stringify({ success: true }), { status: 200 });

  } catch (err) {
    console.error("Clinic DELETE Error:", err);
    return new Response(JSON.stringify({ success: false, error: err.message }), { status: 500 });
  }
}
