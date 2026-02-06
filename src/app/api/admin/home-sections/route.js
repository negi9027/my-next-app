import { NextResponse } from "next/server";
import pool from "@/lib/db";
import { writeFile, mkdir } from "fs/promises";
import path from "path";

// GET: Fetch all home sections
export async function GET() {
    try {
        const conn = await pool.getConnection();

        const [sections] = await conn.execute(
            `SELECT * FROM home_sections ORDER BY display_order ASC, id ASC`
        );

        // Parse extra_data JSON for each section
        const parsed = sections.map(s => ({
            ...s,
            extra_data: s.extra_data ? JSON.parse(s.extra_data) : {}
        }));

        conn.release();
        return NextResponse.json(parsed);
    } catch (err) {
        console.error("GET /api/admin/home-sections error:", err);
        return NextResponse.json(
            { error: "Failed to fetch home sections" },
            { status: 500 }
        );
    }
}

// POST: Create new home section
export async function POST(req) {
    try {
        const formData = await req.formData();

        const section_key = formData.get("section_key");
        const title = formData.get("title");
        const content = formData.get("content");
        const cta_text = formData.get("cta_text");
        const cta_link = formData.get("cta_link");
        const cta_text_2 = formData.get("cta_text_2");
        const cta_link_2 = formData.get("cta_link_2");
        const image_alt = formData.get("image_alt");
        const is_active = formData.get("is_active") === "true";
        const display_order = parseInt(formData.get("display_order") || "0");
        const extra_data = formData.get("extra_data") || "{}";

        // Handle image upload
        let image_url = formData.get("image_url") || null;
        const imageFile = formData.get("image_file");

        if (imageFile && imageFile.size > 0) {
            const uploadsDir = path.join(process.cwd(), "public", "uploads", "home");
            await mkdir(uploadsDir, { recursive: true });

            const ext = path.extname(imageFile.name);
            const filename = `${section_key}_${Date.now()}${ext}`;
            const filepath = path.join(uploadsDir, filename);

            const bytes = await imageFile.arrayBuffer();
            await writeFile(filepath, Buffer.from(bytes));

            image_url = `/uploads/home/${filename}`;
        }

        // Handle background image upload
        let background_image = formData.get("background_image_url") || null;
        const bgImageFile = formData.get("background_image_file");

        if (bgImageFile && bgImageFile.size > 0) {
            const uploadsDir = path.join(process.cwd(), "public", "uploads", "home");
            await mkdir(uploadsDir, { recursive: true });

            const ext = path.extname(bgImageFile.name);
            const filename = `${section_key}_bg_${Date.now()}${ext}`;
            const filepath = path.join(uploadsDir, filename);

            const bytes = await bgImageFile.arrayBuffer();
            await writeFile(filepath, Buffer.from(bytes));

            background_image = `/uploads/home/${filename}`;
        }

        const conn = await pool.getConnection();

        const [result] = await conn.execute(
            `INSERT INTO home_sections 
       (section_key, title, content, image_url, image_alt, background_image, 
        cta_text, cta_link, cta_text_2, cta_link_2, extra_data, is_active, display_order)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [section_key, title, content, image_url, image_alt, background_image,
                cta_text, cta_link, cta_text_2, cta_link_2, extra_data, is_active, display_order]
        );

        conn.release();

        return NextResponse.json({
            success: true,
            id: result.insertId
        });
    } catch (err) {
        console.error("POST /api/admin/home-sections error:", err);
        return NextResponse.json(
            { error: err.message || "Failed to create section" },
            { status: 500 }
        );
    }
}

// PUT: Update existing section
export async function PUT(req) {
    try {
        const formData = await req.formData();

        const id = parseInt(formData.get("id"));
        const section_key = formData.get("section_key");
        const title = formData.get("title");
        const content = formData.get("content");
        const cta_text = formData.get("cta_text");
        const cta_link = formData.get("cta_link");
        const cta_text_2 = formData.get("cta_text_2");
        const cta_link_2 = formData.get("cta_link_2");
        const image_alt = formData.get("image_alt");
        const is_active = formData.get("is_active") === "true";
        const display_order = parseInt(formData.get("display_order") || "0");
        const extra_data = formData.get("extra_data") || "{}";

        // Get existing data
        const conn = await pool.getConnection();
        const [existing] = await conn.execute(
            "SELECT image_url, background_image FROM home_sections WHERE id = ?",
            [id]
        );

        let image_url = formData.get("image_url") || existing[0]?.image_url || null;
        const imageFile = formData.get("image_file");

        if (imageFile && imageFile.size > 0) {
            const uploadsDir = path.join(process.cwd(), "public", "uploads", "home");
            await mkdir(uploadsDir, { recursive: true });

            const ext = path.extname(imageFile.name);
            const filename = `${section_key}_${Date.now()}${ext}`;
            const filepath = path.join(uploadsDir, filename);

            const bytes = await imageFile.arrayBuffer();
            await writeFile(filepath, Buffer.from(bytes));

            image_url = `/uploads/home/${filename}`;
        }

        let background_image = formData.get("background_image_url") || existing[0]?.background_image || null;
        const bgImageFile = formData.get("background_image_file");

        if (bgImageFile && bgImageFile.size > 0) {
            const uploadsDir = path.join(process.cwd(), "public", "uploads", "home");
            await mkdir(uploadsDir, { recursive: true });

            const ext = path.extname(bgImageFile.name);
            const filename = `${section_key}_bg_${Date.now()}${ext}`;
            const filepath = path.join(uploadsDir, filename);

            const bytes = await bgImageFile.arrayBuffer();
            await writeFile(filepath, Buffer.from(bytes));

            background_image = `/uploads/home/${filename}`;
        }

        await conn.execute(
            `UPDATE home_sections SET 
       section_key = ?, title = ?, content = ?, image_url = ?, image_alt = ?,
       background_image = ?, cta_text = ?, cta_link = ?, cta_text_2 = ?, 
       cta_link_2 = ?, extra_data = ?, is_active = ?, display_order = ?
       WHERE id = ?`,
            [section_key, title, content, image_url, image_alt, background_image,
                cta_text, cta_link, cta_text_2, cta_link_2, extra_data, is_active, display_order, id]
        );

        conn.release();

        return NextResponse.json({ success: true });
    } catch (err) {
        console.error("PUT /api/admin/home-sections error:", err);
        return NextResponse.json(
            { error: err.message || "Failed to update section" },
            { status: 500 }
        );
    }
}

// DELETE: Delete a section
export async function DELETE(req) {
    try {
        const { searchParams } = new URL(req.url);
        const id = parseInt(searchParams.get("id"));

        if (!id) {
            return NextResponse.json(
                { error: "Section ID required" },
                { status: 400 }
            );
        }

        const conn = await pool.getConnection();
        await conn.execute("DELETE FROM home_sections WHERE id = ?", [id]);
        conn.release();

        return NextResponse.json({ success: true });
    } catch (err) {
        console.error("DELETE /api/admin/home-sections error:", err);
        return NextResponse.json(
            { error: "Failed to delete section" },
            { status: 500 }
        );
    }
}
