import pool from "@/lib/db";
import Link from "next/link";
import { Stethoscope } from "lucide-react";
import CategoryDiseasesClient from "@/components/CategoryDiseasesClient";

export const dynamic = "force-dynamic";

export default async function CategoryPage({ params }) {
  // ✅ IMPORTANT FIX
  const { slug } = await params;

  if (!slug) {
    return <h1 className="text-center my-5">Invalid URL</h1>;
  }

  const conn = await pool.getConnection();

  // ✅ get category
  const [catRows] = await conn.execute(
    "SELECT * FROM disease_categories WHERE slug=? AND status='active'",
    [slug]
  );

  if (!catRows.length) {
    conn.release();
    return <h1 className="text-center my-5">Category Not Found</h1>;
  }

  const category = catRows[0];

  // ✅ get diseases
  const [rows] = await conn.execute(
    "SELECT * FROM diseases WHERE category_id=? AND status='active'",
    [category.id]
  );

  conn.release();

  return (
    <>
      <section className="hero p-4 mb-4 rounded d-flex align-items-center justify-content-between">
        <div>
          <h1 className="mb-1 display-6"><span className="me-2"><Stethoscope size={28} /></span>{category.name} Diseases</h1>
          {category.description && <p className="mb-0 text-muted small">{category.description}</p>}
        </div>
        <div className="text-end">
          <div className="badge bg-primary text-white fs-6">{rows.length} {rows.length === 1 ? "disease" : "diseases"}</div>
        </div>
      </section>

      <div className="container my-3">
        <CategoryDiseasesClient initialItems={JSON.parse(JSON.stringify(rows))} category={category} />
      </div>
    </>
  );
}
