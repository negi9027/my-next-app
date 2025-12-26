"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

export default function RecentBlogs() {
  const [blogs, setBlogs] = useState([]);

  useEffect(() => {
    fetch("/api/admin/blogs")
      .then((res) => res.json())
      .then((data) => setBlogs(data))
      .catch(() => {});
  }, []);

  if (!blogs.length) return null;

  return (
    <section className="mb-5">
      <div className="container">

        {/* Section Heading */}
        <div className="text-center mb-4">
          <h2 className="fw-bold">Recent Blogs</h2>
          <p className="text-muted">
            Stay updated with healthy routines, diet guides & lifestyle tips.
          </p>
        </div>

        {/* Blog Cards */}
        <div className="row g-4">
          {blogs.map((blog) => (
            <div className="col-md-4" key={blog.id}>
              <div className="card h-100 border-0 shadow-sm">

                {blog.image && (
                  <img
                    src={`/uploads/${blog.image}`}
                    className="card-img-top"
                    alt={blog.title}
                    style={{ height: "200px", objectFit: "cover" }}
                  />
                )}

                <div className="card-body">
                  <h5 className="card-title fw-semibold">
                    {blog.title}
                  </h5>

                  <p className="card-text text-muted small">
                    {blog.short_desc?.slice(0, 100)}...
                  </p>
                </div>

                <div className="card-footer bg-white border-0">
                  <Link
                    href={`/blog/${blog.slug}`}
                    className="btn btn-outline-primary btn-sm"
                  >
                    Read More →
                  </Link>
                </div>

              </div>
            </div>
          ))}
        </div>

        {/* View All CTA */}
        <div className="text-center mt-4">
          <Link href="/blog" className="btn btn-primary btn-lg">
            View All Blogs
          </Link>
        </div>

      </div>
    </section>
  );
}
