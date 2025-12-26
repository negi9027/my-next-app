// C:\Users\esfgi\Desktop\next_web\myproject\src\app\(public)\disease\[slug]\page.js

export const dynamic = "force-dynamic";

import pool from "@/lib/db";
import Link from "next/link";
import ContactFormWrapper from "@/components/ContactFormWrapper";

export async function generateMetadata({ params }) {
  const { slug } = await params;

  if (!slug) return {};

  const conn = await pool.getConnection();
  const [rows] = await conn.execute(
    "SELECT meta_title, meta_description, meta_keywords FROM diseases WHERE slug=? AND status='active'",
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

export default async function Page({ params }) {
  const { slug } = await params;

  if (!slug) return <h1>Invalid URL</h1>;

  const conn = await pool.getConnection();
  const [rows] = await conn.execute(
    "SELECT * FROM diseases WHERE slug=? AND status='active'",
    [slug]
  );
  conn.release();

  if (!rows.length) {
    return (
      <div className="container my-5 text-center">
        <h1>Disease Not Found</h1>
        <Link href="/" className="btn btn-secondary mt-3">
          Go Home
        </Link>
      </div>
    );
  }

  const data = rows[0];

  let faqs = [];
  try {
    faqs = JSON.parse(data.faqs || "[]");
  } catch (e) {}

return (
  <>

            {/* ===== HERO ===== */}
      <section className="disease-hero my-4">
        <div className="overlay" />
        <div className="container hero-content py-5 text-white position-relative">
          <nav aria-label="breadcrumb">
            <ol className="breadcrumb bg-transparent p-0 mb-2">
              <li className="breadcrumb-item"><Link href="/">Home</Link></li>
              <li className="breadcrumb-item"><Link href="/diseases">Diseases</Link></li>
              <li className="breadcrumb-item active" aria-current="page">{data.title}</li>
            </ol>
          </nav>

          <div className="d-flex align-items-center justify-content-between flex-wrap">
            <div style={{ maxWidth: 800 }}>
              <h1 className="fw-bold display-5 mb-2 gradient-text">{data.title}</h1>
              {data.intro && (
                <p className="mb-0 lead opacity-85">{data.intro}</p>
              )}

              <div className="mt-3">
                <a href="#contact" className="btn btn-light btn-sm me-2">Get Advice</a>
                <a href={`tel:+919876543210`} className="btn btn-outline-light btn-sm">Call Now</a>
              </div>
            </div>

            <div className="text-end d-none d-md-block">
              <span className="badge bg-light text-dark">Expert Care</span>
              <div className="small mt-2">Trusted by 1L+ patients</div>
            </div>
          </div>
        </div>
      </section>



    {/* ================= CONTENT + SIDEBAR ================= */}
    <div className="container mb-5">


      <div className="row g-4">
        {/* ===== LEFT CONTENT ===== */}
        <div className="col-lg-8 mt-5">


          <div className="bg-white rounded shadow-sm p-4">

            {data.main_image && (
              <img
                src={`/uploads/diseases/${data.main_image}`}
                alt={data.title}
                className="img-fluid rounded mb-4"
              />
            )}

            {/* Intro */}
            {data.intro && (
              <p className="lead">{data.intro}</p>
            )}

            {/* Symptoms */}
            {data.symptoms && (
              <>
                
                <div dangerouslySetInnerHTML={{ __html: data.symptoms }} />
              </>
            )}

            {/* Tips */}
            {data.tips && (
              <>
              
                <div dangerouslySetInnerHTML={{ __html: data.tips }} />
              </>
            )}

            {/* FAQs */}
            {faqs.length !== 0 && (
              <>
                <h3 className="mt-5 mb-3">Frequently Asked Questions</h3>

                <div className="accordion" id="faqAccordion">
                  {faqs.map((f, i) => (
                    <div className="accordion-item" key={i}>
                      <h2 className="accordion-header">
                        <button
                          className={`accordion-button ${i !== 0 ? "collapsed" : ""}`}
                          type="button"
                          data-bs-toggle="collapse"
                          data-bs-target={`#faq-${i}`}
                        >
                          {f.q}
                        </button>
                      </h2>
                      <div
                        id={`faq-${i}`}
                        className={`accordion-collapse collapse ${i === 0 ? "show" : ""}`}
                      >
                        <div className="accordion-body">
                          {f.a}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>
        </div>

        {/* ===== RIGHT SIDEBAR ===== */}
        <aside className="col-lg-4">
          <div className="sticky-top" style={{ top: 170 }}>

            {/* Contact Card */}
            <div className="card shadow-sm mb-4" id="contact">
              <div className="card-body">
                <h5 className="mb-3">Get Medical Advice</h5>
                <ContactFormWrapper />
              </div>
            </div>

            {/* Quick Info */}
            <div className="card shadow-sm mb-4">
              <div className="card-body">
                <h6 className="fw-bold mb-2">Why Choose Us?</h6>
                <ul className="small mb-0">
                  <li>✔ 20+ years experience</li>
                  <li>✔ Ayurvedic specialists</li>
                  <li>✔ Trusted by 1L+ patients</li>
                </ul>
              </div>
            </div>

            {/* CTA */}
            <div className="card bg-primary text-white text-center shadow-sm">
              <div className="card-body">
                <h5 className="fw-bold">Need Immediate Help?</h5>
                <p className="small">Talk to our care team now</p>
                <a href="tel:+919876543210" className="btn btn-light btn-sm">
                  Call Now
                </a>
              </div>
            </div>

          </div>
        </aside>

      </div>
    </div>

  </>
);

}
