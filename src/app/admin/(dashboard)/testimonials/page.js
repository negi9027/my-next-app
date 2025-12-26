"use client";

import { useEffect, useState } from "react";

const emptyForm = {
  id: null,
  name: "",
  disease: "",
  message: "",
  rating: 5,
  location: "",
  image: "",
  status: "active",
};

export default function TestimonialsAdmin() {
  const [items, setItems] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [loading, setLoading] = useState(false);

  // 🔄 Load testimonials
  const load = async () => {
    const res = await fetch("/api/admin/testimonials");
    setItems(await res.json());
  };

  useEffect(() => {
    load();
  }, []);

  // 💾 Add / Update
  const submit = async () => {
    setLoading(true);

    await fetch("/api/admin/testimonials", {
      method: form.id ? "PUT" : "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });

    setForm(emptyForm);
    setLoading(false);
    load();
  };

  // ✏️ Edit
  const edit = (t) => {
    setForm(t);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // 🗑 Delete
  const remove = async (id) => {
    if (!confirm("Delete this testimonial?")) return;
    await fetch(`/api/admin/testimonials?id=${id}`, { method: "DELETE" });
    load();
  };

  return (
    <div className="container py-4">

      {/* ================= FORM ================= */}
      <div className="card mb-4 shadow-sm">
        <div className="card-body">
          <h4 className="mb-3">
            {form.id ? "Edit Testimonial" : "Add Testimonial"}
          </h4>

          <div className="row g-2">
            <div className="col-md-4">
              <input
                className="form-control"
                placeholder="Patient Name"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
              />
            </div>

            <div className="col-md-4">
              <input
                className="form-control"
                placeholder="Disease"
                value={form.disease}
                onChange={(e) => setForm({ ...form, disease: e.target.value })}
              />
            </div>

            <div className="col-md-4">
              <input
                className="form-control"
                placeholder="Location"
                value={form.location}
                onChange={(e) => setForm({ ...form, location: e.target.value })}
              />
            </div>

            <div className="col-12">
              <textarea
                className="form-control"
                rows="3"
                placeholder="Patient Message"
                value={form.message}
                onChange={(e) => setForm({ ...form, message: e.target.value })}
              />
            </div>

            <div className="col-md-3">
              <select
                className="form-select"
                value={form.rating}
                onChange={(e) => setForm({ ...form, rating: e.target.value })}
              >
                {[5,4,3,2,1].map(r => (
                  <option key={r} value={r}>{r} Star</option>
                ))}
              </select>
            </div>

            <div className="col-md-3">
              <select
                className="form-select"
                value={form.status}
                onChange={(e) => setForm({ ...form, status: e.target.value })}
              >
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
            </div>

            <div className="col-md-6 d-flex gap-2">
              <button
                className="btn btn-primary"
                disabled={loading}
                onClick={submit}
              >
                {form.id ? "Update" : "Save"}
              </button>

              {form.id && (
                <button
                  className="btn btn-secondary"
                  onClick={() => setForm(emptyForm)}
                >
                  Cancel
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* ================= LIST ================= */}
      <div className="card shadow-sm">
        <div className="card-body">
          <h4 className="mb-3">All Testimonials</h4>

          <div className="table-responsive">
            <table className="table table-bordered align-middle">
              <thead className="table-light">
                <tr>
                  <th>Name</th>
                  <th>Disease</th>
                  <th>Message</th>
                  <th>Rating</th>
                  <th>Status</th>
                  <th width="140">Action</th>
                </tr>
              </thead>
              <tbody>
                {items.map((t) => (
                  <tr key={t.id}>
                    <td>{t.name}</td>
                    <td>{t.disease}</td>
                    <td style={{ maxWidth: 300 }}>
                      {t.message.slice(0, 80)}...
                    </td>
                    <td>{t.rating} ⭐</td>
                    <td>
                      <span className={`badge bg-${t.status === "active" ? "success" : "secondary"}`}>
                        {t.status}
                      </span>
                    </td>
                    <td>
                      <button
                        className="btn btn-sm btn-outline-primary me-1"
                        onClick={() => edit(t)}
                      >
                        Edit
                      </button>
                      <button
                        className="btn btn-sm btn-outline-danger"
                        onClick={() => remove(t.id)}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}

                {items.length === 0 && (
                  <tr>
                    <td colSpan="6" className="text-center text-muted">
                      No testimonials found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

        </div>
      </div>

    </div>
  );
}
