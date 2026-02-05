// C:\Users\esfgi\Desktop\next_web\myproject\src\app\admin\(dashboard)\diseases\page.js

"use client";

import { useEffect, useMemo, useState } from "react";
import { FaEdit, FaTrash, FaPlus, FaImage, FaSearch } from "react-icons/fa";
import RichTextEditor from "@/components/RichTextEditor";

/**
 * Admin Diseases Page
 * - Expects API endpoints:
 *   GET  /api/admin/diseases
 *   POST /api/admin/diseases
 *   PUT  /api/admin/diseases
 *   DELETE /api/admin/diseases?id=...
 *   POST /api/admin/diseases/upload  (multipart -> returns { filename })
 *
 * Place in: src/app/admin/(dashboard)/diseases/page.js
 */

export default function DiseasesPage() {
  const [list, setList] = useState([]);
  const [editId, setEditId] = useState(null);

  const initialForm = {
    category_id: "",
    title: "",
    slug: "",
    intro: "",
    symptoms: "",
    tips: "",
    icon: "",
    main_image: "",
    meta_title: "",
    meta_description: "",
    meta_keywords: "",
    status: "active",
  };
  const [categories, setCategories] = useState([]);
  const [form, setForm] = useState(initialForm);
  const [faqs, setFaqs] = useState([{ q: "", a: "" }]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [alert, setAlert] = useState(null);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const perPage = 25;

  // fetch list
  const fetchData = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/admin/diseases");
      const data = await res.json();
      const arr = Array.isArray(data) ? data : data.rows ?? [];
      setList(arr);
    } catch (err) {
      console.error(err);
      setAlert({ type: "danger", text: "Failed to load diseases." });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetch("/api/admin/disease-categories")
      .then(res => res.json())
      .then(setCategories);
  }, []);


  useEffect(() => {
    fetchData();
  }, []);

  // search + pagination
  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return list;
    return list.filter(
      (d) =>
        (d.title || "").toLowerCase().includes(q) ||
        (d.slug || "").toLowerCase().includes(q)
    );
  }, [list, search]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / perPage));
  useEffect(() => {
    if (page > totalPages) setPage(totalPages);
  }, [totalPages]);

  const paged = filtered.slice((page - 1) * perPage, page * perPage);

  const slugify = (text) => {
    return text.toString().toLowerCase()
      .trim()
      .replace(/[\s\W-]+/g, '-')
      .replace(/^-+|-+$/g, '');
  };

  const setField = (k, v) => setForm((s) => {
    const updates = { ...s, [k]: v };
    if (k === "title") {
      updates.slug = slugify(v);
    }
    return updates;
  });

  const uploadFile = async (e, field) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const fd = new FormData();
    fd.append("file", file);

    try {
      setSaving(true);
      const res = await fetch("/api/admin/diseases/upload", {
        method: "POST",
        body: fd,
      });
      const data = await res.json();
      if (!res.ok || !data.filename) throw new Error(data.error || "Upload failed");
      setForm((s) => ({ ...s, [field]: data.filename }));
      setAlert({ type: "success", text: `${field} uploaded` });
    } catch (err) {
      console.error(err);
      setAlert({ type: "danger", text: err.message || "Upload failed" });
    } finally {
      setSaving(false);
    }
  };

  const addFaq = () => setFaqs((f) => [...f, { q: "", a: "" }]);
  const removeFaq = (i) => setFaqs((f) => f.filter((_, idx) => idx !== i));
  const updateFaq = (i, key, val) => {
    setFaqs((prev) => {
      const out = [...prev];
      out[i] = { ...out[i], [key]: val };
      return out;
    });
  };

  const clearForm = () => {
    setEditId(null);
    setForm(initialForm);
    setFaqs([{ q: "", a: "" }]);
    setAlert(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // basic validation
    if (!form.title || !form.slug) {
      setAlert({ type: "danger", text: "Title and slug required." });
      return;
    }

    const payload = { ...form, faqs: JSON.stringify(faqs) };
    if (editId) payload.id = editId;

    try {
      setSaving(true);
      const res = await fetch("/api/admin/diseases", {
        method: editId ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json().catch(() => null);
      if (!res.ok || (data && data.success === false)) {
        throw new Error(data?.error || `Save failed (${res.status})`);
      }
      setAlert({ type: "success", text: editId ? "Updated disease" : "Added disease" });
      clearForm();
      fetchData();
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (err) {
      console.error(err);
      setAlert({ type: "danger", text: err.message || "Save failed" });
    } finally {
      setSaving(false);
    }
  };

  const editRow = (item) => {
    setEditId(item.id);
    // populate form; ensure fields exist
    setForm({
      category_id: item.category_id || "",
      title: item.title || "",
      slug: item.slug || "",
      intro: item.intro || "",
      symptoms: item.symptoms || "",
      tips: item.tips || "",
      icon: item.icon || "",
      main_image: item.main_image || "",
      meta_title: item.meta_title || "",
      meta_description: item.meta_description || "",
      meta_keywords: item.meta_keywords || "",
      status: item.status || "active",
    });

    try {
      setFaqs(JSON.parse(item.faqs || "[]"));
    } catch {
      setFaqs([{ q: "", a: "" }]);
    }
    // scroll to top to show form
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const deleteRow = async (id) => {
    if (!confirm("Delete this disease?")) return;
    try {
      const res = await fetch(`/api/admin/diseases?id=${id}`, { method: "DELETE" });
      const data = await res.json().catch(() => null);
      if (!res.ok || (data && data.success === false)) {
        throw new Error(data?.error || `Delete failed (${res.status})`);
      }
      setAlert({ type: "success", text: "Deleted" });
      fetchData();
    } catch (err) {
      console.error(err);
      setAlert({ type: "danger", text: err.message || "Delete failed" });
    }
  };

  return (
    <>
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h2 className="m-0">Disease Manager</h2>

        <div className="d-flex gap-2 align-items-center">
          <div className="input-group">
            <span className="input-group-text bg-white"><FaSearch /></span>
            <input
              className="form-control"
              placeholder="Search title or slug..."
              value={search}
              onChange={(e) => { setSearch(e.target.value); setPage(1); }}
            />
          </div>

          <button className="btn btn-outline-primary" onClick={() => { clearForm(); window.scrollTo({ top: 0, behavior: 'smooth' }); }}>
            <FaPlus className="me-1" /> New
          </button>
        </div>
      </div>

      {alert && (
        <div className={`alert alert-${alert.type} py-2`} role="alert">
          {alert.text}
        </div>
      )}

      <div className="row g-4">
        {/* LEFT: Form */}
        <div className="col-lg-7">
          <div className="card shadow-sm">
            <div className="card-body">
              <h4 className="mb-3">{editId ? "Edit Disease" : "Add Disease"}</h4>

              <form onSubmit={handleSubmit}>
                <div className="row g-2">

                  <div className="col-12 col-md-6">
                    <label className="form-label small">Category *</label>
                    <select
                      className="form-select"
                      value={form.category_id}
                      onChange={(e) => setField("category_id", e.target.value)}
                    >
                      <option value="">Select Category</option>
                      {categories.map(c => (
                        <option key={c.id} value={c.id}>{c.name}</option>
                      ))}
                    </select>
                  </div>


                  <div className="col-12 col-md-6">
                    <label className="form-label small">Title *</label>
                    <input name="title" value={form.title} onChange={(e) => setField("title", e.target.value)} className="form-control" />
                  </div>

                  <div className="col-12 col-md-6">
                    <label className="form-label small">Slug *</label>
                    <input name="slug" value={form.slug} onChange={(e) => setField("slug", e.target.value)} className="form-control" />
                  </div>

                  <div className="col-12">
                    <label className="form-label small">Intro</label>
                    <textarea name="intro" value={form.intro} onChange={(e) => setField("intro", e.target.value)} className="form-control" rows={2} />
                  </div>

                  <div className="col-12 col-md-6">
                    <label className="form-label small">Symptoms (HTML allowed)</label>
                    <RichTextEditor
                      value={form.symptoms}
                      onChange={(html) => setField("symptoms", html)}
                      placeholder="Enter disease symptoms..."
                    />
                  </div>

                  <div className="col-12 col-md-6">
                    <label className="form-label small">Tips (HTML allowed)</label>
                    <RichTextEditor
                      value={form.tips}
                      onChange={(html) => setField("tips", html)}
                      placeholder="Enter health tips..."
                    />
                  </div>

                  {/* Uploads */}
                  <div className="col-12 col-md-6">
                    <label className="form-label small">Icon</label>
                    <input type="file" accept="image/*" className="form-control" onChange={(e) => uploadFile(e, "icon")} />
                    {form.icon ? (
                      <div className="mt-2 d-flex align-items-center gap-2">
                        <img src={`/uploads/diseases/${form.icon}`} alt="icon" style={{ width: 64, height: 64, objectFit: "cover", borderRadius: 8 }} />
                        <div className="small text-muted">{form.icon}</div>
                      </div>
                    ) : (
                      <div className="mt-2 small text-muted">No icon</div>
                    )}
                  </div>

                  <div className="col-12 col-md-6">
                    <label className="form-label small">Main Image</label>
                    <input type="file" accept="image/*" className="form-control" onChange={(e) => uploadFile(e, "main_image")} />
                    {form.main_image ? (
                      <div className="mt-2">
                        <img src={`/uploads/diseases/${form.main_image}`} alt="main" style={{ width: "100%", maxHeight: 140, objectFit: "cover", borderRadius: 8 }} />
                        <div className="small text-muted mt-1">{form.main_image}</div>
                      </div>
                    ) : (
                      <div className="mt-2 small text-muted">No main image</div>
                    )}
                  </div>

                  {/* FAQs */}
                  <div className="col-12">
                    <div className="border rounded p-3">
                      <div className="d-flex justify-content-between align-items-center mb-2">
                        <strong>FAQs</strong>
                        <button type="button" className="btn btn-sm btn-outline-secondary" onClick={addFaq}><FaPlus /> Add</button>
                      </div>

                      {faqs.map((f, i) => (
                        <div key={i} className="mb-2">
                          <input className="form-control mb-1" placeholder="Question" value={f.q} onChange={(e) => updateFaq(i, "q", e.target.value)} />
                          <textarea className="form-control mb-1" placeholder="Answer" value={f.a} onChange={(e) => updateFaq(i, "a", e.target.value)} />
                          <div className="d-flex justify-content-end">
                            {faqs.length > 1 && (
                              <button type="button" className="btn btn-sm btn-danger" onClick={() => removeFaq(i)}>Remove</button>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* SEO */}
                  <div className="col-12 col-md-6">
                    <label className="form-label small">Meta title</label>
                    <input name="meta_title" value={form.meta_title} onChange={(e) => setField("meta_title", e.target.value)} className="form-control" />
                  </div>
                  <div className="col-12 col-md-6">
                    <label className="form-label small">Meta keywords</label>
                    <input name="meta_keywords" value={form.meta_keywords} onChange={(e) => setField("meta_keywords", e.target.value)} className="form-control" />
                  </div>
                  <div className="col-12">
                    <label className="form-label small">Meta description</label>
                    <textarea name="meta_description" value={form.meta_description} onChange={(e) => setField("meta_description", e.target.value)} className="form-control" rows={2} />
                  </div>

                  <div className="col-12 col-md-4">
                    <label className="form-label small">Status</label>
                    <select className="form-select" value={form.status} onChange={(e) => setField("status", e.target.value)}>
                      <option value="active">Active</option>
                      <option value="inactive">Inactive</option>
                    </select>
                  </div>

                  <div className="col-12 col-md-8 d-flex align-items-end">
                    <button type="submit" className="btn btn-primary w-100" disabled={saving}>
                      {saving ? "Saving..." : editId ? "Update Disease" : "Add Disease"}
                    </button>
                    {editId && (
                      <button type="button" className="btn btn-outline-secondary ms-2" onClick={clearForm}>Cancel</button>
                    )}
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>

        {/* RIGHT: Cards + List */}
        <div className="col-lg-5">


          <div className="card shadow-sm">
            <div className="card-body">
              <h5 className="mb-3">All Diseases</h5>

              {loading ? (
                <div className="text-center text-muted py-3">Loading…</div>
              ) : (
                <>
                  <div className="table-responsive" style={{ maxHeight: 620, overflow: "auto" }}>
                    <table className="table table-hover mb-0">
                      <thead className="table-light">
                        <tr>
                          <th style={{ width: 40 }}>#</th>
                          <th>Title</th>
                          <th style={{ width: 90 }}>Status</th>
                          <th style={{ width: 130 }}>Action</th>
                        </tr>
                      </thead>
                      <tbody>
                        {paged.map((d) => (
                          <tr key={d.id}>
                            <td>{d.id}</td>
                            <td>
                              <div className="d-flex align-items-center gap-2">
                                {d.icon ? (
                                  <img src={`/uploads/diseases/${d.icon}`} alt="" style={{ width: 36, height: 36, objectFit: "cover", borderRadius: 6 }} />
                                ) : (
                                  <div style={{ width: 36, height: 36 }} className="bg-light" />
                                )}
                                <div>
                                  <div className="fw-semibold">{d.title}</div>
                                  <div className="small text-muted">{d.slug}</div>
                                </div>
                              </div>
                            </td>
                            <td>
                              <span className={`badge ${d.status === "active" ? "bg-success" : "bg-secondary"}`}>{d.status}</span>
                            </td>
                            <td>
                              <div className="d-flex gap-2">
                                <button className="btn btn-sm btn-outline-warning" onClick={() => editRow(d)}><FaEdit className="me-1" />Edit</button>
                                <button className="btn btn-sm btn-outline-danger" onClick={() => deleteRow(d.id)}><FaTrash className="me-1" />Delete</button>
                              </div>
                            </td>
                          </tr>
                        ))}

                        {paged.length === 0 && (
                          <tr>
                            <td colSpan={4} className="text-center text-muted py-4">No results</td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>

                  {/* pagination */}
                  <div className="d-flex justify-content-between align-items-center mt-3">
                    <div className="small text-muted">Showing {Math.min(filtered.length, (page - 1) * perPage + 1)} - {Math.min(filtered.length, page * perPage)} of {filtered.length}</div>
                    <div className="btn-group">
                      <button className="btn btn-sm btn-outline-secondary" disabled={page <= 1} onClick={() => setPage((p) => Math.max(1, p - 1))}>Prev</button>
                      <button className="btn btn-sm btn-outline-secondary" disabled={page >= totalPages} onClick={() => setPage((p) => Math.min(totalPages, p + 1))}>Next</button>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* small custom styles */}
      <style jsx>{`
        .card h4, .card h5 { margin-bottom: 12px; }
        .table-responsive::-webkit-scrollbar { height: 8px; }
      `}</style>
    </>
  );
}
