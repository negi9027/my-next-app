"use client";

import { useEffect, useState } from "react";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

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

// Sortable Row Component
function SortableTestimonialRow({ testimonial, onEdit, onRemove }) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
  } = useSortable({ id: testimonial.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <tr ref={setNodeRef} style={style}>
      <td style={{ width: 50, cursor: 'grab' }} {...attributes} {...listeners}>
        <div className="text-center">☰</div>
      </td>
      <td style={{ width: 80 }}>
        <img
          src={testimonial.image || '/images/user.png'}
          alt={testimonial.name}
          className="rounded-circle"
          style={{ width: 60, height: 60, objectFit: 'cover' }}
          onError={(e) => { e.target.src = '/images/user.png'; }}
        />
      </td>
      <td>{testimonial.name}</td>
      <td>{testimonial.disease}</td>
      <td style={{ maxWidth: 300 }}>
        {testimonial.message.slice(0, 80)}...
      </td>
      <td>{testimonial.rating} ⭐</td>
      <td>
        <span className={`badge bg-${testimonial.status === "active" ? "success" : "secondary"}`}>
          {testimonial.status}
        </span>
      </td>
      <td>
        <div className="d-flex gap-1">
          <button
            className="btn btn-sm btn-outline-primary"
            onClick={() => onEdit(testimonial)}
          >
            Edit
          </button>
          <button
            className="btn btn-sm btn-outline-danger"
            onClick={() => onRemove(testimonial.id)}
          >
            Delete
          </button>
        </div>
      </td>
    </tr>
  );
}

export default function TestimonialsAdmin() {
  const [items, setItems] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [loading, setLoading] = useState(false);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  // 🔄 Load testimonials
  const load = async () => {
    const res = await fetch("/api/admin/testimonials");
    const data = await res.json();
    // Sort by position
    const sorted = data.sort((a, b) => (a.position || 0) - (b.position || 0));
    setItems(sorted);
  };

  useEffect(() => {
    load();
  }, []);

  // 💾 Add / Update
  const submit = async () => {
    setLoading(true);

    let payload = form;

    // Auto-calculate position for new testimonials
    if (!form.id) {
      const maxPosition = items.length > 0 ? Math.max(...items.map(t => t.position || 0)) : 0;
      payload = { ...form, position: maxPosition + 1 };
    }

    await fetch("/api/admin/testimonials", {
      method: form.id ? "PUT" : "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
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

  const handleDragEnd = async (event) => {
    const { active, over } = event;

    if (active.id !== over.id) {
      const oldIndex = items.findIndex((t) => t.id === active.id);
      const newIndex = items.findIndex((t) => t.id === over.id);

      const newItems = arrayMove(items, oldIndex, newIndex);

      // Update position values immediately for UI
      const updatedItems = newItems.map((t, index) => ({
        ...t,
        position: index + 1
      }));

      setItems(updatedItems);

      // Update positions in database
      const updates = updatedItems.map((t) => ({
        id: t.id,
        position: t.position
      }));

      await fetch("/api/admin/testimonials/reorder", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ updates }),
      });
    }
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

            {/* Image Upload Section */}
            <div className="col-12">
              <label className="form-label small fw-semibold">Patient Image</label>
              <div className="row g-2">
                <div className="col-md-6">
                  <input
                    type="file"
                    className="form-control"
                    accept="image/*"
                    onChange={async (e) => {
                      const file = e.target.files?.[0];
                      if (!file) return;

                      const fd = new FormData();
                      fd.append('file', file);

                      try {
                        const res = await fetch('/api/admin/testimonials/upload', {
                          method: 'POST',
                          body: fd
                        });
                        const data = await res.json();
                        if (data.filename) {
                          setForm({ ...form, image: `/uploads/testimonials/${data.filename}` });
                        }
                      } catch (err) {
                        console.error('Upload failed:', err);
                        alert('Upload failed');
                      }
                    }}
                  />
                  <small className="text-muted">Upload image file</small>
                </div>

                <div className="col-md-6">
                  <input
                    className="form-control"
                    placeholder="Or paste image URL"
                    value={form.image}
                    onChange={(e) => setForm({ ...form, image: e.target.value })}
                  />
                  <small className="text-muted">Or enter image URL</small>
                </div>
              </div>

              {form.image && (
                <div className="mt-2">
                  <img
                    src={form.image}
                    alt="Preview"
                    className="rounded-circle"
                    style={{ width: 80, height: 80, objectFit: 'cover' }}
                    onError={(e) => { e.target.src = '/images/user.png'; }}
                  />
                  <button
                    type="button"
                    className="btn btn-sm btn-outline-danger ms-2"
                    onClick={() => setForm({ ...form, image: '' })}
                  >
                    Remove
                  </button>
                </div>
              )}
            </div>

            <div className="col-md-3">
              <label className="form-label small">Rating</label>
              <select
                className="form-select"
                value={form.rating}
                onChange={(e) => setForm({ ...form, rating: e.target.value })}
              >
                {[5, 4, 3, 2, 1].map(r => (
                  <option key={r} value={r}>{r} Star</option>
                ))}
              </select>
            </div>

            <div className="col-md-3">
              <label className="form-label small">Status</label>
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
                  <th style={{ width: 50 }}>Drag</th>
                  <th style={{ width: 80 }}>Image</th>
                  <th>Name</th>
                  <th>Disease</th>
                  <th>Message</th>
                  <th>Rating</th>
                  <th>Status</th>
                  <th width="140">Action</th>
                </tr>
              </thead>
              <tbody>
                {items.length === 0 && (
                  <tr>
                    <td colSpan="8" className="text-center text-muted">
                      No testimonials found
                    </td>
                  </tr>
                )}

                <DndContext
                  sensors={sensors}
                  collisionDetection={closestCenter}
                  onDragEnd={handleDragEnd}
                >
                  <SortableContext
                    items={items.map(t => t.id)}
                    strategy={verticalListSortingStrategy}
                  >
                    {items.map((t) => (
                      <SortableTestimonialRow
                        key={t.id}
                        testimonial={t}
                        onEdit={edit}
                        onRemove={remove}
                      />
                    ))}
                  </SortableContext>
                </DndContext>
              </tbody>
            </table>
          </div>

        </div>
      </div>

    </div>
  );
}
