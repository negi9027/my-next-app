import { NextResponse } from "next/server";
import pool from "@/lib/db";
import { writeFile, mkdir } from "fs/promises";
import path from "path";

// GET: Fetch all features for a section
export async function GET(req) {
    try {
        const { searchParams } = new URL(req.url);
        const section_key = searchParams.get("section_key");

        const conn = await pool.getConnection();

        let query = "SELECT * FROM home_features";
        let params = [];

        if (section_key) {
            query += " WHERE section_key = ?";
            params.push(section_key);
        }

        query += " ORDER BY section_key, display_order ASC, id ASC";

        const [features] = await conn.execute(query, params);
        conn.release();

        return NextResponse.json(features);
    } catch (err) {
        console.error("GET /api/admin/home-features error:", err);
        return NextResponse.json(
            { error: "Failed to fetch home features" },
            { status: 500 }
        );
    }
}

// POST: Create new feature
export async function POST(req) {
    try {
        const formData = await req.formData();

        const section_key = formData.get("section_key");
        const title = formData.get("title");
        const description = formData.get("description");
        const icon_alt = formData.get("icon_alt");
        const is_active = formData.get("is_active") === "true";
        const display_order = parseInt(formData.get("display_order") || "0");

        // Handle icon upload
        let icon_url = formData.get("icon_url") || null;
        const iconFile = formData.get("icon_file");

        if (iconFile && iconFile.size > 0) {
            const uploadsDir = path.join(process.cwd(), "public", "uploads", "home", "features");
            await mkdir(uploadsDir, { recursive: true });

            const ext = path.extname(iconFile.name);
            const filename = `${section_key}_${Date.now()}${ext}`;
            const filepath = path.join(uploadsDir, filename);

            const bytes = await iconFile.arrayBuffer();
            await writeFile(filepath, Buffer.from(bytes));

            icon_url = `/uploads/home/features/${filename}`;
        }

        const conn = await pool.getConnection();

        const [result] = await conn.execute(
            `INSERT INTO home_features 
       (section_key, title, description, icon_url, icon_alt, is_active, display_order)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
            [section_key, title, description, icon_url, icon_alt, is_active, display_order]
        );

        conn.release();

        return NextResponse.json({
            success: true,
            id: result.insertId
        });
    } catch (err) {
        console.error("POST /api/admin/home-features error:", err);
        return NextResponse.json(
            { error: err.message || "Failed to create feature" },
            { status: 500 }
        );
    }
}

// PUT: Update existing feature
export async function PUT(req) {
    try {
        const formData = await req.formData();

        const id = parseInt(formData.get("id"));
        const section_key = formData.get("section_key");
        const title = formData.get("title");
        const description = formData.get("description");
        const icon_alt = formData.get("icon_alt");
        const is_active = formData.get("is_active") === "true";
        const display_order = parseInt(formData.get("display_order") || "0");

        // Get existing data
        const conn = await pool.getConnection();
        const [existing] = await conn.execute(
            "SELECT icon_url FROM home_features WHERE id = ?",
            [id]
        );

        let icon_url = formData.get("icon_url") || existing[0]?.icon_url || null;
        const iconFile = formData.get("icon_file");

        if (iconFile && iconFile.size > 0) {
            const uploadsDir = path.join(process.cwd(), "public", "uploads", "home", "features");
            await mkdir(uploadsDir, { recursive: true });

            const ext = path.extname(iconFile.name);
            const filename = `${section_key}_${Date.now()}${ext}`;
            const filepath = path.join(uploadsDir, filename);

            const bytes = await iconFile.arrayBuffer();
            await writeFile(filepath, Buffer.from(bytes));

            icon_url = `/uploads/home/features/${filename}`;
        }

        await conn.execute(
            `UPDATE home_features SET 
       section_key = ?, title = ?, description = ?, icon_url = ?, 
       icon_alt = ?, is_active = ?, display_order = ?
       WHERE id = ?`,
            [section_key, title, description, icon_url, icon_alt, is_active, display_order, id]
        );

        conn.release();

        return NextResponse.json({ success: true });
    } catch (err) {
        console.error("PUT /api/admin/home-features error:", err);
        return NextResponse.json(
            { error: err.message || "Failed to update feature" },
            { status: 500 }
        );
    }
}

// DELETE: Delete a feature
export async function DELETE(req) {
    try {
        const { searchParams } = new URL(req.url);
        const id = parseInt(searchParams.get("id"));

        if (!id) {
            return NextResponse.json(
                { error: "Feature ID required" },
                { status: 400 }
            );
        }

        const conn = await pool.getConnection();
        await conn.execute("DELETE FROM home_features WHERE id = ?", [id]);
        conn.release();

        return NextResponse.json({ success: true });
    } catch (err) {
        console.error("DELETE /api/admin/home-features error:", err);
        return NextResponse.json(
            { error: "Failed to delete feature" },
            { status: 500 }
        );
    }
}
