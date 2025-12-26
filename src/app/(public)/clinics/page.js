export const dynamic = "force-dynamic";

import pool from "@/lib/db";
import Link from "next/link";

/* ================= SEO ================= */
export const metadata = {
  title: "Our Clinics | Trusted Healthcare Centers",
  description: "Explore our clinics, locations, services and expert healthcare support.",
};

/* ================= PAGE ================= */
export default async function ClinicsPage() {
  let clinics = [];

  try {
    const conn = await pool.getConnection();

    const [clinicsRows] = await conn.execute(
      "SELECT name, slug, location, intro, icon, main_image FROM clinics WHERE status='active' ORDER BY id DESC"
    );

    conn.release();
    clinics = clinicsRows;
  } catch (err) {
    console.warn("ClinicsPage: DB unavailable:", err?.message || err);
    clinics = [];
  }

  return (
    <>
      {/* ================= HERO ================= */}
      <section style={{ background: "#f5f8ff", padding: "50px 0" }}>
        <div className="container text-center">
          <h1 style={{ fontSize: "2.6rem", fontWeight: 700 }}>
            Our Clinics
          </h1>
          <p className="text-muted mt-2" style={{ maxWidth: 700, margin: "0 auto" }}>
            Find trusted clinics, expert doctors, and personalized healthcare solutions near you.
          </p>
        </div>
      </section>

      {/* ================= CLINICS LIST ================= */}
      <section className="container my-5">
        <div className="row g-4">

          {clinics.length === 0 && (
            <div className="col-12 text-center text-muted">
              No clinics available at the moment.
            </div>
          )}

          {clinics.map((clinic, i) => (
            <div key={i} className="col-md-6 col-lg-4">

              <div className="card h-100 shadow-sm border-0">

                {/* Image */}
                {clinic.main_image ? (
                  <img
                    src={`/uploads/clinics/${clinic.main_image}`}
                    alt={clinic.name}
                    className="card-img-top"
                    style={{ height: 200, objectFit: "cover" }}
                  />
                ) : (
                  <div
                    style={{
                      height: 200,
                      background: "#eef2ff",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: 48
                    }}
                  >
                    🏥
                  </div>
                )}

                {/* Body */}
                <div className="card-body d-flex flex-column">

                  <h5 className="card-title mb-1">
                    {clinic.name}
                  </h5>

                  {clinic.location && (
                    <p className="text-muted small mb-2">
                      📍 {clinic.location}
                    </p>
                  )}

                  {clinic.intro && (
                    <p className="card-text text-muted small flex-grow-1">
                      {clinic.intro.length > 120
                        ? clinic.intro.slice(0, 120) + "…"
                        : clinic.intro}
                    </p>
                  )}

                  <Link
                    href={`/clinics/${clinic.slug}`}
                    className="btn btn-primary mt-3 align-self-start"
                  >
                    View Clinic →
                  </Link>
                </div>
              </div>

            </div>
          ))}

        </div>
      </section>

      {/* ================= CTA ================= */}
      <section className="container mb-5">
        <div
          className="card border-0 shadow-sm p-4 text-center"
          style={{ background: "#f9fbff" }}
        >
          <h4 className="mb-2">Need Help Choosing a Clinic?</h4>
          <p className="text-muted mb-3">
            Our team is here to guide you to the right healthcare center.
          </p>
          <Link href="/contact" className="btn btn-outline-primary">
            Contact Us
          </Link>
        </div>
      </section>

      {/* ================= STYLES ================= */}
      <style>{`
        .card:hover {
          transform: translateY(-6px);
          transition: 0.2s ease;
        }
      `}</style>
    </>
  );
}
