import { NextResponse } from "next/server";
import pool from "@/lib/db";

// Public API to fetch home page data
export async function GET() {
    try {
        const conn = await pool.getConnection();

        // Fetch all active sections
        const [sections] = await conn.execute(
            `SELECT * FROM home_sections 
       WHERE is_active = TRUE 
       ORDER BY display_order ASC, id ASC`
        );

        // Parse extra_data for each section
        const parsedSections = sections.map(s => ({
            ...s,
            extra_data: s.extra_data ? JSON.parse(s.extra_data) : {}
        }));

        // Fetch all active features grouped by section
        const [features] = await conn.execute(
            `SELECT * FROM home_features 
       WHERE is_active = TRUE 
       ORDER BY section_key, display_order ASC, id ASC`
        );

        conn.release();

        // Group features by section_key
        const featuresBySection = features.reduce((acc, feature) => {
            if (!acc[feature.section_key]) {
                acc[feature.section_key] = [];
            }
            acc[feature.section_key].push(feature);
            return acc;
        }, {});

        return NextResponse.json({
            sections: parsedSections,
            features: featuresBySection
        });
    } catch (err) {
        console.error("GET /api/home error:", err);
        return NextResponse.json(
            { error: "Failed to fetch home data" },
            { status: 500 }
        );
    }
}
