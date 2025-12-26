import pool from "@/lib/db";
import DiseasesSection from "@/components/DiseasesSection";

export const dynamic = "force-dynamic";

export default async function AllDiseasesPage() {
  const conn = await pool.getConnection();

  const [rows] = await conn.execute(
    `SELECT d.*, c.slug AS category_slug, c.name AS category_name
     FROM diseases d
     LEFT JOIN disease_categories c ON d.category_id = c.id
     WHERE d.status = 'active'
     ORDER BY c.name ASC, d.title ASC`
  );

  conn.release();

  return (
    <div className="container my-5">
      <h1 className="mb-4">All Diseases</h1>
      <p className="text-muted mb-4">Browse through all diseases, grouped by category. Use the search to quickly find a disease.</p>

      {/* Client search + grouping UI */}
      <DiseasesSection diseases={rows} />
    </div>
  );
}
