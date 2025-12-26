"use client";

import { useEffect, useState } from "react";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";

export default function FAQAdmin() {
  const [faqs, setFaqs] = useState([]);
  const [editingId, setEditingId] = useState(null);

  const [form, setForm] = useState({
    question: "",
    answer: "",
    position: 0,
    is_enabled: true,
    page: "home",
  });

  /* ================= LOAD ================= */
  const load = async () => {
    const res = await fetch("/api/admin/faqs");
    setFaqs(await res.json());
  };

  useEffect(() => {
    load();
  }, []);

  /* ================= SAVE / UPDATE ================= */
  const save = async () => {
    if (!form.question || !form.answer) {
      return alert("Question & Answer required");
    }

    await fetch("/api/admin/faqs", {
      method: editingId ? "PUT" : "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(editingId ? { ...form, id: editingId } : form),
    });

    resetForm();
    load();
  };

  /* ================= EDIT ================= */
  const editFaq = (f) => {
    setEditingId(f.id);
    setForm({
      question: f.question,
      answer: f.answer,
      position: f.position || 0,
      is_enabled: !!f.is_enabled,
      page: f.page || "home",
    });
  };

  /* ================= TOGGLE ================= */
  const toggle = async (f) => {
    await fetch("/api/admin/faqs", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        id: f.id,
        question: f.question,
        answer: f.answer,
        page: f.page,
        position: f.position,
        is_enabled: !f.is_enabled,
      }),
    });
    load();
  };

  /* ================= DELETE ================= */
  const remove = async (id) => {
    if (!confirm("Delete this FAQ?")) return;
    await fetch(`/api/admin/faqs?id=${id}`, { method: "DELETE" });
    load();
  };

  /* ================= DRAG & DROP ================= */
  const onDragEnd = async (result) => {
    if (!result.destination) return;

    const items = Array.from(faqs);
    const [moved] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, moved);

    const reordered = items.map((f, i) => ({
      ...f,
      position: i + 1,
    }));

    setFaqs(reordered);

    await fetch("/api/admin/faqs/order", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(
        reordered.map((f) => ({ id: f.id, position: f.position }))
      ),
    });
  };

  /* ================= RESET ================= */
  const resetForm = () => {
    setEditingId(null);
    setForm({
      question: "",
      answer: "",
      position: 0,
      is_enabled: true,
      page: "home",
    });
  };

  return (
    <div className="container-fluid my-4">
      <div className="row">

        {/* ===== LEFT: LIST ===== */}
        <div className="col-lg-8">
          <h4 className="mb-3">FAQs (Drag to reorder)</h4>

          <DragDropContext onDragEnd={onDragEnd}>
            <Droppable droppableId="faqs">
              {(provided) => (
                <table
                  className="table table-bordered"
                  ref={provided.innerRef}
                  {...provided.droppableProps}
                >
                  <thead className="table-light">
                    <tr>
                      <th width="40">↕</th>
                      <th>Question</th>
                      <th width="80">Pos</th>
                      <th width="120">Status</th>
                      <th width="220">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {faqs.map((f, index) => (
                      <Draggable key={f.id} draggableId={String(f.id)} index={index}>
                        {(prov) => (
                          <tr
                            ref={prov.innerRef}
                            {...prov.draggableProps}
                            {...prov.dragHandleProps}
                            style={{ cursor: "grab", ...prov.draggableProps.style }}
                          >
                            <td>☰</td>
                            <td>{f.question}</td>
                            <td>{f.position}</td>
                            <td>
                              <span className={`badge ${f.is_enabled ? "bg-success" : "bg-secondary"}`}>
                                {f.is_enabled ? "Enabled" : "Disabled"}
                              </span>
                            </td>
                            <td>
                              <div className="d-flex gap-2">
                                <button className="btn btn-sm btn-outline-primary" onClick={() => editFaq(f)}>Edit</button>
                                <button className="btn btn-sm btn-outline-secondary" onClick={() => toggle(f)}>
                                  {f.is_enabled ? "Disable" : "Enable"}
                                </button>
                                <button className="btn btn-sm btn-outline-danger" onClick={() => remove(f.id)}>Delete</button>
                              </div>
                            </td>
                          </tr>
                        )}
                      </Draggable>
                    ))}
                    {provided.placeholder}
                  </tbody>
                </table>
              )}
            </Droppable>
          </DragDropContext>
        </div>

        {/* ===== RIGHT: FORM ===== */}
        <div className="col-lg-4">
          <div className="card shadow-sm">
            <div className="card-body">
              <h5>{editingId ? "Edit FAQ" : "Add FAQ"}</h5>

              <input className="form-control mb-2" placeholder="Question"
                value={form.question}
                onChange={(e) => setForm({ ...form, question: e.target.value })}
              />

              <textarea className="form-control mb-2" rows="4" placeholder="Answer"
                value={form.answer}
                onChange={(e) => setForm({ ...form, answer: e.target.value })}
              />

              <input type="number" className="form-control mb-2" placeholder="Position"
                value={form.position}
                onChange={(e) => setForm({ ...form, position: e.target.value })}
              />

              <div className="form-check form-switch mb-3">
                <input className="form-check-input" type="checkbox"
                  checked={form.is_enabled}
                  onChange={() => setForm({ ...form, is_enabled: !form.is_enabled })}
                />
                <label className="form-check-label">Enabled</label>
              </div>

              <button className="btn btn-primary w-100" onClick={save}>
                {editingId ? "Update FAQ" : "Add FAQ"}
              </button>

              {editingId && (
                <button className="btn btn-link w-100 mt-2" onClick={resetForm}>
                  Cancel Edit
                </button>
              )}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
