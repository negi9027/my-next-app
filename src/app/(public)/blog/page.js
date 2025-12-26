export const dynamic = "force-dynamic";

import pool from "@/lib/db";
import Link from "next/link";


export default async function BlogList() {
  let blogs = [];

  try {
    const conn = await pool.getConnection();

    const [blogsRows] = await conn.execute(
      "SELECT * FROM blogs WHERE status='published' ORDER BY id DESC"
    );

    conn.release();
    blogs = blogsRows;
  } catch (err) {
    console.warn("BlogList: DB unavailable:", err?.message || err);
    blogs = [];
  }

  return (
    <>

    <div className="container my-5">
      <h1 className="text-center mb-4" style={{ fontSize: "2.5rem", fontWeight: "700" }}>
        Our Latest Blogs
      </h1>

      <div className="row g-4">
        {blogs.map((blog) => (
          <div key={blog.id} className="col-md-6 col-lg-4">
            <div className="card h-100 shadow-sm border-0">
              {blog.image && (
                <img
                  src={`/uploads/${blog.image}`}
                  className="card-img-top"
                  alt={blog.title}
                  style={{ height: "200px", objectFit: "cover" }}
                />
              )}

              <div className="card-body d-flex flex-column">
                <h5 className="card-title">{blog.title}</h5>
                <p className="card-text flex-grow-1">{blog.short_desc}</p>
                <Link
                  href={`/blog/${blog.slug}`}
                  className="btn btn-primary mt-2"
                  style={{ alignSelf: "flex-start" }}
                >
                  Read More
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>

    </>
  );
}
