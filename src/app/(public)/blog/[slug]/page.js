export const dynamic = "force-dynamic";
import pool from "@/lib/db";
import { notFound } from "next/navigation";
import ContactFormWrapper from "@/components/ContactFormWrapper";
import Link from "next/link";

/* ================= SEO ================= */
export async function generateMetadata({ params }) {
  const { slug: rawSlug } = await params;
  const slug = decodeURIComponent(rawSlug);

  try {
    const conn = await pool.getConnection();
    const [rows] = await conn.execute(
      "SELECT meta_title, meta_desc FROM blogs WHERE slug=? LIMIT 1",
      [slug]
    );
    conn.release();

    if (!rows.length) return {};

    return {
      title: rows[0].meta_title,
      description: rows[0].meta_desc,
    };
  } catch (err) {
    // If DB is down at build time, return empty metadata so build can proceed
    console.warn("generateMetadata (blog): DB unavailable:", err?.message || err);
    return {};
  }
}

/* ================= PAGE ================= */
export default async function BlogSingle({ params }) {
  const { slug: rawSlug } = await params;
  const slug = decodeURIComponent(rawSlug);

  try {
    const conn = await pool.getConnection();

    const [[blog]] = await conn.execute(
      "SELECT * FROM blogs WHERE slug=? AND status='published' LIMIT 1",
      [slug]
    );

    if (!blog) {
      conn.release();
      notFound();
    }

    // 🔹 Recent blogs
    const [recentBlogs] = await conn.execute(
      "SELECT title, slug FROM blogs WHERE status='published' AND slug!=? ORDER BY id DESC LIMIT 5",
      [slug]
    );

    conn.release();

    return (
      // original JSX unchanged — keep using blog and recentBlogs
      (function(){
        return (
          <>
            {/* ================= HERO ================= */}
            <section
              className="py-5 mb-5"
              style={{
                background:
                  "linear-gradient(135deg, rgba(203,227,255,1) 0%, rgb(131,193,255) 100%)",
              }}
            >
              <div className="container">
                <div className="row align-items-center g-4">

                  {/* Left */}
                  <div className="col-lg-12">
                    <h1 className="display-5 fw-bold text-primary mb-3">
                      {blog.title}
                    </h1>
                    <p className="lead text-dark">{blog.short_desc}</p>
                  </div>

                </div>
              </div>
            </section>

            {/* ================= CONTENT + SIDEBAR ================= */}
            <main className="container mb-5">
              <div className="row g-4">

                {/* ===== BLOG CONTENT ===== */}
                <div className="col-lg-8">
                  <article className="bg-white p-4 rounded shadow-sm">

                    {blog.image && (
                      <img
                        src={`/uploads/${blog.image}`}
                        alt={blog.title}
                        className="img-fluid rounded mb-4"
                      />
                    )}

                    <div
                      className="blog-content"
                      dangerouslySetInnerHTML={{ __html: blog.content }}
                    />
                  </article>
                </div>

                {/* ===== SIDEBAR ===== */}
                <aside className="col-lg-4">

                  <div className="sticky-top" style={{ top: 90 }}>

                    {/* Contact Card */}
                    <div className="card mb-4 shadow-sm">
                      <div className="card-body">
                        <h5 className="mb-3">Talk to Our Expert</h5>
                        <ContactFormWrapper />
                      </div>
                    </div>

                    {/* Recent Blogs */}
                    <div className="card mb-4 shadow-sm">
                      <div className="card-body">
                        <h5 className="mb-3">Recent Blogs</h5>
                        <ul className="list-unstyled mb-0">
                          {recentBlogs.map((r, i) => (
                            <li key={i} className="mb-2">
                              <Link
                                href={`/blog/${r.slug}`}
                                className="text-decoration-none"
                              >
                                → {r.title}
                              </Link>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>

                    {/* CTA */}
                    <div className="card shadow-sm text-center bg-primary text-white">
                      <div className="card-body">
                        <h5 className="fw-bold">Need Immediate Help?</h5>
                        <p className="mb-2">Speak to our care team now</p>
                        <a href="tel:+919876543210" className="btn btn-light">
                          Call Now
                        </a>
                      </div>
                    </div>

                  </div>
                </aside>

              </div>
            </main>

            {/* ================= EXTRA STYLE ================= */}
            <style>{`
              .blog-content h2 {
                margin-top: 1.8rem;
                font-weight: 700;
              }
              .blog-content p {
                line-height: 1.8;
                font-size: 1.05rem;
              }
              .blog-content ul {
                padding-left: 1.2rem;
              }
            `}</style>
          </>
        );
      })()
    );
  } catch (err) {
    console.warn("BlogSingle: DB unavailable:", err?.message || err);
    // Render a simple fallback so build doesn't fail
    return (
      <div className="container my-5">
        <h1 className="text-center mb-4">Blog temporarily unavailable</h1>
        <p className="text-center text-muted">We couldn't load this content right now. Please try again later.</p>
      </div>
    );
  }

  return (
    <>
      {/* ================= HERO ================= */}
      <section
        className="py-5 mb-5"
        style={{
          background:
            "linear-gradient(135deg, rgba(203,227,255,1) 0%, rgb(131,193,255) 100%)",
        }}
      >
        <div className="container">
          <div className="row align-items-center g-4">

            {/* Left */}
            <div className="col-lg-12">
              <h1 className="display-5 fw-bold text-primary mb-3">
                {blog.title}
              </h1>
              <p className="lead text-dark">{blog.short_desc}</p>
            </div>

            {/* Right */}
            {/* <div className="col-lg-5">
              <div className="bg-white rounded shadow-sm p-3">
                <ContactFormWrapper />
              </div>
            </div> */}

          </div>
        </div>
      </section>

      {/* ================= CONTENT + SIDEBAR ================= */}
      <main className="container mb-5">
        <div className="row g-4">

          {/* ===== BLOG CONTENT ===== */}
          <div className="col-lg-8">
            <article className="bg-white p-4 rounded shadow-sm">

              {blog.image && (
                <img
                  src={`/uploads/${blog.image}`}
                  alt={blog.title}
                  className="img-fluid rounded mb-4"
                />
              )}

              <div
                className="blog-content"
                dangerouslySetInnerHTML={{ __html: blog.content }}
              />
            </article>
          </div>

          {/* ===== SIDEBAR ===== */}
          <aside className="col-lg-4">

            <div className="sticky-top" style={{ top: 90 }}>

              {/* Contact Card */}
              <div className="card mb-4 shadow-sm">
                <div className="card-body">
                  <h5 className="mb-3">Talk to Our Expert</h5>
                  <ContactFormWrapper />
                </div>
              </div>

              {/* Recent Blogs */}
              <div className="card mb-4 shadow-sm">
                <div className="card-body">
                  <h5 className="mb-3">Recent Blogs</h5>
                  <ul className="list-unstyled mb-0">
                    {recentBlogs.map((r, i) => (
                      <li key={i} className="mb-2">
                        <Link
                          href={`/blog/${r.slug}`}
                          className="text-decoration-none"
                        >
                          → {r.title}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* CTA */}
              <div className="card shadow-sm text-center bg-primary text-white">
                <div className="card-body">
                  <h5 className="fw-bold">Need Immediate Help?</h5>
                  <p className="mb-2">Speak to our care team now</p>
                  <a href="tel:+919876543210" className="btn btn-light">
                    Call Now
                  </a>
                </div>
              </div>

            </div>
          </aside>

        </div>
      </main>

      {/* ================= EXTRA STYLE ================= */}
      <style>{`
        .blog-content h2 {
          margin-top: 1.8rem;
          font-weight: 700;
        }
        .blog-content p {
          line-height: 1.8;
          font-size: 1.05rem;
        }
        .blog-content ul {
          padding-left: 1.2rem;
        }
      `}</style>
    </>
  );
}
