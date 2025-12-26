"use client";

import { useEffect, useMemo, useState } from "react";
import { FaSearch, FaEdit, FaTrash, FaImage, FaPlus } from "react-icons/fa";

/**
 * Admin Blog Manager - improved UI
 * - Uses your same endpoints:
 *   GET  /api/admin/blogs
 *   POST /api/admin/blogs
 *   PUT  /api/admin/blogs
 *   DELETE /api/admin/blogs?id=...
 *   POST /api/admin/blogs/upload   (for image uploads -> returns { filename })
 *
 * Replace your existing file with this component.
 */

export default function BlogPage() {
  const [blogs, setBlogs] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const initialForm = {
    title: "",
    slug: "",
    short_desc: "",
    content: "",
    status: "published",
    image: "",
    meta_title: "",
    meta_desc: "",
    meta_keywords: "",
  };
  const [form, setForm] = useState(initialForm);

  // UI state
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [alert, setAlert] = useState(null); // { type: 'success'|'error', text }
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const perPage = 8;

  // fetch blogs
  const fetchBlogs = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/admin/blogs");
      const data = await res.json();
      const arr = Array.isArray(data) ? data : data.rows ?? [];
      // sanitize fields
      const sanitized = arr.map((b) => ({
        id: b.id,
        title: b.title || "",
        slug: b.slug || "",
        short_desc: b.short_desc || "",
        content: b.content || "",
        status: b.status || "published",
        image: b.image || "",
        meta_title: b.meta_title || "",
        meta_desc: b.meta_desc || "",
        meta_keywords: b.meta_keywords || "",
      }));
      setBlogs(sanitized);
    } catch (err) {
      console.error("fetchBlogs:", err);
      setAlert({ type: "error", text: "Failed to load blogs" });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBlogs();
  }, []);

  // filtered + paginated list
  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return blogs;
    return blogs.filter(
      (b) =>
        (b.title || "").toLowerCase().includes(q) ||
        (b.slug || "").toLowerCase().includes(q) ||
        (b.short_desc || "").toLowerCase().includes(q)
    );
  }, [blogs, search]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / perPage));
  useEffect(() => {
    if (page > totalPages) setPage(totalPages);
  }, [totalPages, page]);

  const paged = filtered.slice((page - 1) * perPage, page * perPage);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const clearForm = () => {
    setForm(initialForm);
    setEditingId(null);
    setAlert(null);
    setPage(1);
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const fd = new FormData();
    fd.append("file", file);

    try {
      setSaving(true);
      const res = await fetch("/api/admin/blogs/upload", {
        method: "POST",
        body: fd,
      });
      const data = await res.json();
      if (!res.ok || !data.filename) {
        throw new Error(data.error || "Upload failed");
      }
      setForm((s) => ({ ...s, image: data.filename }));
      setAlert({ type: "success", text: "Image uploaded" });
    } catch (err) {
      console.error("upload:", err);
      setAlert({ type: "error", text: err.message || "Upload failed" });
    } finally {
      setSaving(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // basic validation
    if (!form.title || !form.slug) {
      setAlert({ type: "error", text: "Title and slug are required" });
      return;
    }

    const method = editingId ? "PUT" : "POST";
    const payload = editingId ? { ...form, id: editingId } : form;

    try {
      setSaving(true);
      const res = await fetch("/api/admin/blogs", {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json().catch(() => null);

      if (!res.ok || (data && data.success === false)) {
        const msg = data?.error || `Save failed (${res.status})`;
        throw new Error(msg);
      }

      setAlert({ type: "success", text: editingId ? "Updated blog" : "Added blog" });
      clearForm();
      fetchBlogs();
    } catch (err) {
      console.error("save:", err);
      setAlert({ type: "error", text: err.message || "Save failed" });
    } finally {
      setSaving(false);
    }
  };

  const editBlog = (blog) => {
    setForm({
      title: blog.title || "",
      slug: blog.slug || "",
      short_desc: blog.short_desc || "",
      content: blog.content || "",
      status: blog.status || "published",
      image: blog.image || "",
      meta_title: blog.meta_title || "",
      meta_desc: blog.meta_desc || "",
      meta_keywords: blog.meta_keywords || "",
    });
    setEditingId(blog.id);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const deleteBlog = async (id) => {
    if (!confirm("Delete this blog? This cannot be undone.")) return;
    try {
      const res = await fetch(`/api/admin/blogs?id=${id}`, { method: "DELETE" });
      const data = await res.json().catch(() => null);
      if (!res.ok || (data && data.success === false)) {
        throw new Error(data?.error || `Delete failed (${res.status})`);
      }
      setAlert({ type: "success", text: "Blog deleted" });
      fetchBlogs();
    } catch (err) {
      console.error("delete:", err);
      setAlert({ type: "error", text: err.message || "Delete failed" });
    }
  };

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h2 className="m-0">Blog Manager</h2>
        <div className="d-flex gap-2">
          <div className="input-group">
            <span className="input-group-text bg-white"><FaSearch /></span>
            <input
              className="form-control"
              placeholder="Search title, slug, description..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <button className="btn btn-outline-secondary" onClick={() => { clearForm(); }}>
            <FaPlus className="me-1" /> New
          </button>
        </div>
      </div>

      {/* Alert */}
      {alert && (
        <div className={`alert ${alert.type === "error" ? "alert-danger" : "alert-success"} py-2`} role="alert">
          {alert.text}
        </div>
      )}

      {/* FORM + PREVIEW */}
      <div className="card mb-4 shadow-sm">
        <div className="card-body">
          <form onSubmit={handleSubmit}>
            <div className="row g-3">
              {/* Left: form inputs */}
              <div className="col-12 col-lg-7">
                <div className="mb-2">
                  <label className="form-label small">Title *</label>
                  <input name="title" value={form.title} onChange={handleChange} className="form-control" />
                </div>

                <div className="mb-2">
                  <label className="form-label small">Slug (url) *</label>
                  <input name="slug" value={form.slug} onChange={handleChange} className="form-control" />
                </div>

                <div className="mb-2">
                  <label className="form-label small">Short description</label>
                  <textarea name="short_desc" value={form.short_desc} onChange={handleChange} className="form-control" rows={2} />
                </div>

                <div className="mb-2">
                  <label className="form-label small">Content (HTML allowed)</label>
                  <textarea name="content" value={form.content} onChange={handleChange} className="form-control" rows={6} />
                </div>

                <div className="row gx-2">
                  <div className="col">
                    <label className="form-label small">Status</label>
                    <select name="status" value={form.status} onChange={handleChange} className="form-select">
                      <option value="published">Published</option>
                      <option value="draft">Draft</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Right: image upload & meta preview */}
              <div className="col-12 col-lg-5">
                <div className="mb-2">
                  <label className="form-label small">Feature image</label>
                  <div className="d-flex gap-2">
                    <input type="file" accept="image/*" onChange={handleImageUpload} className="form-control" />
                    <button type="button" className="btn btn-outline-secondary" onClick={() => { setForm((s) => ({...s, image: ""})); }}>
                      Remove
                    </button>
                  </div>
                  <small className="text-muted">Upload via <code>/api/admin/blogs/upload</code></small>

                  {form.image ? (
                    <div className="mt-2">
                      <img src={`/uploads/${form.image}`} alt="preview" style={{ width: "100%", maxHeight: 180, objectFit: "cover", borderRadius: 6 }} />
                      <div className="small text-muted mt-1">{form.image}</div>
                    </div>
                  ) : (
                    <div className="border rounded p-3 mt-2 text-center text-muted">
                      <FaImage size={28} /> <div className="small">No image</div>
                    </div>
                  )}
                </div>

                <hr />

                <div className="mb-2">
                  <label className="form-label small">Meta title</label>
                  <input name="meta_title" value={form.meta_title} onChange={handleChange} className="form-control" />
                </div>
                <div className="mb-2">
                  <label className="form-label small">Meta description</label>
                  <textarea name="meta_desc" value={form.meta_desc} onChange={handleChange} className="form-control" rows={3} />
                </div>
                <div className="mb-2">
                  <label className="form-label small">Meta keywords</label>
                  <input name="meta_keywords" value={form.meta_keywords} onChange={handleChange} className="form-control" />
                </div>

                <div className="d-grid mt-2">
                  <button type="submit" className="btn btn-primary" disabled={saving}>
                    {saving ? (editingId ? "Saving..." : "Adding...") : (editingId ? "Update Blog" : "Add Blog")}
                  </button>
                  {editingId && (
                    <button type="button" className="btn btn-outline-secondary mt-2" onClick={clearForm}>Cancel</button>
                  )}
                </div>
              </div>
            </div>
          </form>
        </div>
      </div>

      {/* BLOG LIST */}
      <div className="card shadow-sm">
        <div className="card-body">
          <div className="d-flex justify-content-between align-items-center mb-3">
            <h5 className="m-0">All Blogs</h5>
            <div className="small text-muted">{filtered.length} results</div>
          </div>

          {loading ? (
            <div className="text-center py-4 text-muted">Loading…</div>
          ) : (
            <>
              <div className="table-responsive">
                <table className="table table-hover align-middle mb-0">
                  <thead className="table-light">
                    <tr>
                      <th style={{ width: 60 }}>#</th>
                      <th>Title</th>
                      <th>Slug</th>
                      <th style={{ width: 120 }}>Status</th>
                      <th style={{ width: 170 }}>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {paged.map((b) => (
                      <tr key={b.id}>
                        <td>{b.id}</td>
                        <td>
                          <div className="d-flex align-items-center gap-2">
                            {b.image ? (
                              <img src={`/uploads/${b.image}`} alt="" style={{ width: 56, height: 40, objectFit: "cover", borderRadius: 6 }} />
                            ) : (
                              <div style={{ width: 56, height: 40 }} className="bg-light d-inline-block" />
                            )}
                            <div>
                              <div className="fw-semibold">{b.title}</div>
                              <div className="small text-muted">{b.short_desc?.slice(0, 80)}</div>
                            </div>
                          </div>
                        </td>
                        <td className="text-muted">{b.slug}</td>
                        <td>
                          <span className={`badge ${b.status === "published" ? "bg-success" : "bg-secondary"}`}>
                            {b.status}
                          </span>
                        </td>
                        <td>
                          <div className="d-flex gap-2">
                            <button className="btn btn-sm btn-outline-warning" onClick={() => editBlog(b)}>
                              <FaEdit /> Edit
                            </button>
                            <button className="btn btn-sm btn-outline-danger" onClick={() => deleteBlog(b.id)}>
                              <FaTrash /> Delete
                            </button>
                            <a className="btn btn-sm btn-outline-primary" href={`/blog/${b.slug}`} target="_blank" rel="noreferrer">View</a>
                          </div>
                        </td>
                      </tr>
                    ))}
                    {paged.length === 0 && (
                      <tr>
                        <td colSpan="5" className="text-center text-muted py-4">No blogs found.</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              <div className="d-flex justify-content-between align-items-center mt-3">
                <div className="small text-muted">Page {page} / {totalPages}</div>
                <div className="btn-group">
                  <button className="btn btn-sm btn-outline-secondary" disabled={page <= 1} onClick={() => setPage((p) => Math.max(1, p - 1))}>Prev</button>
                  <button className="btn btn-sm btn-outline-secondary" disabled={page >= totalPages} onClick={() => setPage((p) => Math.min(totalPages, p + 1))}>Next</button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>

      {/* little styles */}
      <style jsx>{`
        .table img { border-radius: 6px; }
        .input-group .input-group-text { border-right: 0; }
        .input-group input { border-left: 0; }
        @media (max-width: 991px) {
          /* stack preview under inputs on small screens */
        }
      `}</style>
    </div>
  );
}
