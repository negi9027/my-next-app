export const dynamic = "force-dynamic";

import pool from "@/lib/db";
import Link from "next/link";
import ContactFormWrapper from "@/components/ContactFormWrapper";

/* ================= SEO ================= */
export async function generateMetadata({ params }) {
  const { slug } = await params;
  if (!slug) return {};

  const conn = await pool.getConnection();
  const [rows] = await conn.execute(
    "SELECT meta_title, meta_description, meta_keywords FROM clinics WHERE slug=? AND status='active' LIMIT 1",
    [slug]
  );
  conn.release();

  if (!rows.length) return {};

  return {
    title: rows[0].meta_title || "",
    description: rows[0].meta_description || "",
    keywords: rows[0].meta_keywords || "",
  };
}

/* ================= PAGE ================= */
export default async function ClinicPage({ params }) {
  const { slug } = await params;

  if (!slug) {
    return (
      <div className="container my-5 text-center">
        <h1>Invalid URL</h1>
        <Link href="/" className="btn btn-secondary mt-3">Go Home</Link>
      </div>
    );
  }

  const conn = await pool.getConnection();
  const [rows] = await conn.execute(
    "SELECT * FROM clinics WHERE slug=? AND status='active' LIMIT 1",
    [slug]
  );
  conn.release();

  if (!rows.length) {
    return (
      <div className="container my-5 text-center">
        <h1>Clinic Not Found</h1>
        <Link href="/" className="btn btn-secondary mt-3">Go Home</Link>
      </div>
    );
  }

  const clinic = rows[0];

  let faqs = [];
  try {
    faqs = JSON.parse(clinic.faqs || "[]");
  } catch {}

  return (
    <>
      {/* ================= HERO ================= */}
      <section style={{ background: "rgb(215 227 255)", padding: "40px 0" }}>
        <div className="container">
          <div className="row align-items-center">

            {/* LEFT */}
            <div className="col-lg-8">
              <nav style={{ fontSize: 14, marginBottom: 10 }}>
                <Link href="/">Home</Link> »{" "}
                <Link href="/clinics">Clinics</Link> »{" "}
                <span>{clinic.name}</span>
              </nav>

              <h1 style={{ fontSize: "2.4rem", fontWeight: 700 }}>
                {clinic.name}
              </h1>

              {clinic.location && (
                <p className="text-muted mb-1">📍 {clinic.location}</p>
              )}

              {clinic.intro && (
                <p className="lead text-muted mt-2">
                  {clinic.intro}
                </p>
              )}
            </div>

            {/* RIGHT FORM */}
            <div className="col-lg-4">
              <div className="card shadow-sm p-3">
                <h5 className="mb-2">Book an Appointment</h5>
                <ContactFormWrapper />
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ================= CONTENT ================= */}
      <section className="container my-5">
        <div className="row">

          {/* LEFT CONTENT */}
          <div className="col-lg-8">

            {/* IMAGE */}
            {clinic.main_image && (
              <img
                src={`/uploads/clinics/${clinic.main_image}`}
                alt={clinic.name}
                className="img-fluid rounded mb-4"
              />
            )}

            {/* SERVICES */}
            {clinic.services && (
              <>
                <h3>Our Services</h3>
                <div
                  className="clinic-content"
                  dangerouslySetInnerHTML={{ __html: clinic.services }}
                />
              </>
            )}

            {/* FAQs */}
            {faqs.length > 0 && (
              <>
                <h3 className="mt-4">Frequently Asked Questions</h3>
                {faqs.map((f, i) => (
                  <div key={i} className="mb-3">
                    <strong>Q. {f.q}</strong>
                    <p className="mb-0">A. {f.a}</p>
                  </div>
                ))}
              </>
            )}
          </div>

          {/* RIGHT SIDEBAR */}
          <aside className="col-lg-4">

            {/* CONTACT INFO */}
            <div className="card mb-4 shadow-sm">
              <div className="card-body">
                <h5 className="mb-3">Contact Information</h5>

                {clinic.location && (
                  <p className="mb-2">📍 {clinic.location}</p>
                )}

                <p className="mb-2">📞 +91 98765 43210</p>
                <p className="mb-2">📧 info@example.com</p>

                <Link href="/contact" className="btn btn-primary w-100 mt-2">
                  Contact Clinic
                </Link>
              </div>
            </div>

            {/* CTA */}
            <div className="card shadow-sm">
              <div className="card-body text-center">
                <h6>Need Immediate Help?</h6>
                <p className="text-muted small">
                  Talk to our health advisors now.
                </p>
                <a href="tel:+919876543210" className="btn btn-outline-primary w-100">
                  Call Now
                </a>
              </div>
            </div>

          </aside>
        </div>
      </section>

      {/* ================= STYLES ================= */}
      <style>{`
        .clinic-content p {
          line-height: 1.8;
          margin-bottom: 16px;
        }
        .clinic-content h2,
        .clinic-content h3 {
          margin-top: 28px;
          margin-bottom: 14px;
          font-weight: 600;
        }
        .clinic-content ul {
          padding-left: 20px;
        }
      `}</style>
    </>
  );
}
