"use client";

import { useEffect, useMemo, useState } from "react";
import { FaSearch, FaEdit, FaTrash, FaPlus, FaImage } from "react-icons/fa";
import RichTextEditor from "@/components/RichTextEditor";

/**
 * Clinics admin page (client)
 * - GET  /api/admin/clinics
 * - POST /api/admin/clinics  (expects multipart/form-data, returns { success:true })
 * - PUT  /api/admin/clinics   (server should accept formData or JSON)
 * - DELETE /api/admin/clinics?id=...
 *
 * Place file at: src/app/admin/(dashboard)/clinics/page.js
 */

export default function ClinicsPage() {
  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(false);

  const [editId, setEditId] = useState(null);

  const initialForm = {
    name: "",
    slug: "",
    location: "",
    intro: "",
    services: "",
    meta_title: "",
    meta_description: "",
    meta_keywords: "",
    status: "active",
  };

  const [form, setForm] = useState(initialForm);
  const [faqs, setFaqs] = useState([{ q: "", a: "" }]);
  const [iconFile, setIconFile] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const [iconPreview, setIconPreview] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);

  const [saving, setSaving] = useState(false);
  const [alert, setAlert] = useState(null);

  // sidepanel UI
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const perPage = 8;

  useEffect(() => {
    fetchClinics();
  }, []);

  // fetch clinics
  const fetchClinics = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/admin/clinics");
      const data = await res.json();
      const arr = Array.isArray(data) ? data : data.rows ?? [];
      setList(arr);
    } catch (err) {
      console.error(err);
      setAlert({ type: "danger", text: "Failed to load clinics" });
    } finally {
      setLoading(false);
    }
  };

  // search/filter
  const filtered = useMemo(() => {
    const q = (search || "").trim().toLowerCase();
    if (!q) return list;
    return list.filter(
      (c) =>
        (c.name || "").toLowerCase().includes(q) ||
        (c.slug || "").toLowerCase().includes(q) ||
        (c.location || "").toLowerCase().includes(q)
    );
  }, [list, search]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / perPage));
  useEffect(() => {
    if (page > totalPages) setPage(totalPages);
  }, [totalPages]);

  const paged = filtered.slice((page - 1) * perPage, page * perPage);

  // form helpers
  const slugify = (text) => {
    return text.toString().toLowerCase()
      .trim()
      .replace(/[\s\W-]+/g, '-')
      .replace(/^-+|-+$/g, '');
  };

  const setField = (k, v) => setForm((s) => {
    const updates = { ...s, [k]: v };
    if (k === "name") {
      updates.slug = slugify(v);
    }
    return updates;
  });

  // preview images when chosen
  useEffect(() => {
    if (!iconFile) { setIconPreview(null); return; }
    const url = URL.createObjectURL(iconFile);
    setIconPreview(url);
    return () => URL.revokeObjectURL(url);
  }, [iconFile]);

  useEffect(() => {
    if (!imageFile) { setImagePreview(null); return; }
    const url = URL.createObjectURL(imageFile);
    setImagePreview(url);
    return () => URL.revokeObjectURL(url);
  }, [imageFile]);

  // reset form
  const clearForm = () => {
    setEditId(null);
    setForm(initialForm);
    setFaqs([{ q: "", a: "" }]);
    setIconFile(null);
    setImageFile(null);
    setIconPreview(null);
    setImagePreview(null);
    setAlert(null);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // add or update
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.name || !form.slug) {
      setAlert({ type: "danger", text: "Name and slug are required" });
      return;
    }

    try {
      setSaving(true);
      const fd = new FormData();
      Object.keys(form).forEach((k) => fd.append(k, form[k] ?? ""));
      fd.append("faqs", JSON.stringify(faqs || []));
      if (iconFile) fd.append("icon", iconFile);
      if (imageFile) fd.append("main_image", imageFile);
      if (editId) fd.append("id", editId);

      const method = editId ? "PUT" : "POST";
      const res = await fetch("/api/admin/clinics", {
        method,
        body: fd,
      });

      // server sometimes returns empty body -> handle gracefully
      let data = null;
      try { data = await res.json(); } catch { data = null; }

      if (!res.ok || (data && data.success === false)) {
        throw new Error((data && data.error) || `Save failed (${res.status})`);
      }

      setAlert({ type: "success", text: editId ? "Clinic updated" : "Clinic added" });
      clearForm();
      fetchClinics();
    } catch (err) {
      console.error(err);
      setAlert({ type: "danger", text: err.message || "Save failed" });
    } finally {
      setSaving(false);
    }
  };

  // edit a row populate
  const editRow = (item) => {
    setEditId(item.id);
    setForm({
      name: item.name || "",
      slug: item.slug || "",
      location: item.location || "",
      intro: item.intro || "",
      services: item.services || "",
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

    // show existing remote images as previews (read-only)
    setIconPreview(item.icon ? `/uploads/clinics/${item.icon}` : null);
    setImagePreview(item.main_image ? `/uploads/clinics/${item.main_image}` : null);

    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // delete
  const deleteRow = async (id) => {
    if (!confirm("Delete this clinic?")) return;
    try {
      const res = await fetch(`/api/admin/clinics?id=${id}`, { method: "DELETE" });
      const data = await res.json().catch(() => null);
      if (!res.ok || (data && data.success === false)) {
        throw new Error((data && data.error) || `Delete failed (${res.status})`);
      }
      setAlert({ type: "success", text: "Deleted" });
      fetchClinics();
    } catch (err) {
      console.error(err);
      setAlert({ type: "danger", text: err.message || "Delete failed" });
    }
  };

  // FAQ helpers
  const addFaq = () => setFaqs((f) => [...f, { q: "", a: "" }]);
  const removeFaq = (idx) => setFaqs((f) => f.filter((_, i) => i !== idx));
  const updateFaq = (idx, key, val) =>
    setFaqs((f) => f.map((x, i) => (i === idx ? { ...x, [key]: val } : x)));

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h3 className="m-0">Clinic Manager</h3>
        <div className="d-flex gap-2">
          <button className="btn btn-outline-secondary" onClick={clearForm}><FaPlus className="me-1" /> New</button>
        </div>
      </div>

      {alert && (
        <div className={`alert alert-${alert.type} py-2`} role="alert">
          {alert.text}
        </div>
      )}

      <div className="row g-4">
        {/* Left: form */}
        <div className="col-lg-7">
          <div className="card shadow-sm">
            <div className="card-body">
              <h5 className="mb-3">{editId ? "Edit Clinic" : "Add Clinic"}</h5>

              <form onSubmit={handleSubmit}>
                <div className="row g-2">
                  <div className="col-12 col-md-6">
                    <label className="form-label small">Clinic Name *</label>
                    <input name="name" value={form.name} onChange={(e) => setField("name", e.target.value)} className="form-control" required />
                  </div>
                  <div className="col-12 col-md-6">
                    <label className="form-label small">Slug (url) *</label>
                    <input name="slug" value={form.slug} onChange={(e) => setField("slug", e.target.value)} className="form-control" required />
                  </div>

                  <div className="col-12 col-md-6">
                    <label className="form-label small">Location</label>
                    <input name="location" value={form.location} onChange={(e) => setField("location", e.target.value)} className="form-control" />
                  </div>

                  <div className="col-12">
                    <label className="form-label small">Intro</label>
                    <textarea name="intro" value={form.intro} onChange={(e) => setField("intro", e.target.value)} className="form-control" rows={2} />
                  </div>

                  <div className="col-12">
                    <label className="form-label small">Services (HTML allowed)</label>
                    <RichTextEditor
                      value={form.services}
                      onChange={(html) => setField("services", html)}
                      placeholder="Enter clinic services..."
                    />
                  </div>

                  {/* uploads */}
                  <div className="col-12 col-md-6">
                    <label className="form-label small">Icon</label>
                    <input type="file" accept="image/*" className="form-control" onChange={(e) => setIconFile(e.target.files?.[0])} />
                    <div className="mt-2">
                      {iconPreview ? (
                        <div className="d-flex align-items-center gap-2">
                          <img src={iconPreview} alt="icon" style={{ width: 64, height: 64, objectFit: "cover", borderRadius: 8 }} />
                          <div className="small text-muted">{iconFile ? iconFile.name : (form.icon || "Existing icon")}</div>
                        </div>
                      ) : (
                        <div className="small text-muted">No icon</div>
                      )}
                    </div>
                  </div>

                  <div className="col-12 col-md-6">
                    <label className="form-label small">Main Image</label>
                    <input type="file" accept="image/*" className="form-control" onChange={(e) => setImageFile(e.target.files?.[0])} />
                    <div className="mt-2">
                      {imagePreview ? (
                        <img src={imagePreview} alt="main" style={{ width: "100%", maxHeight: 140, objectFit: "cover", borderRadius: 8 }} />
                      ) : (
                        <div className="small text-muted">No main image</div>
                      )}
                    </div>
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
                          <div className="text-end">
                            {faqs.length > 1 && <button type="button" className="btn btn-sm btn-danger" onClick={() => removeFaq(i)}>Remove</button>}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* SEO */}
                  <div className="col-12 col-md-6">
                    <label className="form-label small">Meta Title</label>
                    <input name="meta_title" value={form.meta_title} onChange={(e) => setField("meta_title", e.target.value)} className="form-control" />
                  </div>
                  <div className="col-12 col-md-6">
                    <label className="form-label small">Meta Keywords</label>
                    <input name="meta_keywords" value={form.meta_keywords} onChange={(e) => setField("meta_keywords", e.target.value)} className="form-control" />
                  </div>
                  <div className="col-12">
                    <label className="form-label small">Meta Description</label>
                    <textarea name="meta_description" value={form.meta_description} onChange={(e) => setField("meta_description", e.target.value)} className="form-control" rows={2} />
                  </div>

                  <div className="col-12 col-md-4">
                    <label className="form-label small">Status</label>
                    <select className="form-select" value={form.status} onChange={(e) => setField("status", e.target.value)}>
                      <option value="active">Active</option>
                      <option value="inactive">Inactive</option>
                    </select>
                  </div>

                  <div className="col-12 col-md-8 d-flex gap-2 align-items-center">
                    <button type="submit" className="btn btn-primary w-100" disabled={saving}>
                      {saving ? "Saving..." : editId ? "Update Clinic" : "Add Clinic"}
                    </button>
                    {editId && <button type="button" className="btn btn-outline-secondary" onClick={clearForm}>Cancel</button>}
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>

        {/* Right: side panel with search + list */}
        <div className="col-lg-5">
          <div className="card shadow-sm mb-3">
            <div className="card-body">
              <div className="d-flex gap-2 align-items-center mb-2">
                <div className="input-group">
                  <span className="input-group-text bg-white"><FaSearch /></span>
                  <input className="form-control" placeholder="Search clinics..." value={search} onChange={(e) => { setSearch(e.target.value); setPage(1); }} />
                </div>
                <div>
                  <button className="btn btn-outline-secondary" onClick={() => { setSearch(""); setPage(1); }}>Clear</button>
                </div>
              </div>

              <div style={{ maxHeight: 420, overflow: "auto" }}>
                {loading ? (
                  <div className="text-center text-muted py-3">Loading…</div>
                ) : (
                  <div className="list-group">
                    {paged.map((c) => (
                      <div key={c.id} className="list-group-item d-flex align-items-center justify-content-between">
                        <div className="d-flex align-items-center gap-3">
                          {c.icon ? (
                            <img src={`/uploads/clinics/${c.icon}`} alt={c.name} style={{ width: 56, height: 56, objectFit: "cover", borderRadius: 8 }} />
                          ) : (
                            <div style={{ width: 56, height: 56 }} className="bg-secondary rounded" />
                          )}
                          <div>
                            <div className="fw-semibold">{c.name}</div>
                            <div className="small text-muted">{c.location || c.slug}</div>
                          </div>
                        </div>

                        <div className="d-flex gap-2 align-items-center">
                          <span className={`badge ${c.status === "active" ? "bg-success" : "bg-secondary"}`}>{c.status}</span>
                          <button className="btn btn-sm btn-outline-warning" onClick={() => editRow(c)}><FaEdit /></button>
                          <button className="btn btn-sm btn-outline-danger" onClick={() => deleteRow(c.id)}><FaTrash /></button>
                        </div>
                      </div>
                    ))}

                    {paged.length === 0 && <div className="text-center text-muted p-3">No clinics found</div>}
                  </div>
                )}
              </div>

              {/* pagination */}
              <div className="d-flex justify-content-between align-items-center mt-3">
                <div className="small text-muted">Showing {(page - 1) * perPage + 1}-{Math.min(filtered.length, page * perPage)} of {filtered.length}</div>
                <div className="btn-group">
                  <button className="btn btn-sm btn-outline-secondary" disabled={page <= 1} onClick={() => setPage((p) => Math.max(1, p - 1))}>Prev</button>
                  <button className="btn btn-sm btn-outline-secondary" disabled={page >= totalPages} onClick={() => setPage((p) => Math.min(totalPages, p + 1))}>Next</button>
                </div>
              </div>
            </div>
          </div>

          {/* Quick grid preview */}
          <div className="card shadow-sm">
            <div className="card-body">
              <h6>Quick Preview</h6>
              <div className="row g-2">
                {list.slice(0, 6).map((c) => (
                  <div key={c.id} className="col-6">
                    <div className="card border-0 text-center p-2">
                      {c.icon ? <img src={`/uploads/clinics/${c.icon}`} alt={c.name} style={{ width: 48, height: 48, objectFit: "cover", borderRadius: 8 }} /> : <div style={{ width: 48, height: 48 }} className="bg-secondary rounded" />}
                      <div className="small fw-semibold mt-2">{c.name}</div>
                      <div className="small text-muted">{c.location || c.slug}</div>
                    </div>
                  </div>
                ))}
                {list.length === 0 && <div className="text-muted small">No clinics yet</div>}
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
