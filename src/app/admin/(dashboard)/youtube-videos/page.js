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

// Sortable Row Component
function SortableVideoRow({ video, onEdit, onToggle, onRemove }) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
  } = useSortable({ id: video.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <tr ref={setNodeRef} style={style}>
      <td style={{ width: 50, cursor: 'grab' }} {...attributes} {...listeners}>
        <div className="text-center">☰</div>
      </td>
      <td style={{ width: 160 }}>
        <img
          src={video.custom_thumbnail || `https://img.youtube.com/vi/${video.youtube_id}/mqdefault.jpg`}
          alt={video.title}
          className="rounded"
          style={{ width: 140, height: 78, objectFit: 'cover' }}
        />
      </td>
      <td>
        <div className="fw-semibold">{video.title || "—"}</div>
        <div className="text-muted small">{video.youtube_id}</div>
      </td>
      <td>
        <span className="badge bg-light text-dark">{video.position}</span>
      </td>
      <td>
        <div className="form-check form-switch">
          <input
            className="form-check-input"
            type="checkbox"
            checked={!!video.is_enabled}
            onChange={() => onToggle(video)}
          />
        </div>
      </td>
      <td className="text-end">
        <div className="d-flex gap-1 justify-content-end">
          <button className="btn btn-sm btn-outline-primary" onClick={() => onEdit(video)}>
            Edit
          </button>
          <button className="btn btn-sm btn-outline-danger" onClick={() => onRemove(video.id)}>
            Delete
          </button>
        </div>
      </td>
    </tr>
  );
}

export default function YouTubeAdmin() {
  const [videos, setVideos] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState({
    title: "",
    youtube_id: "",
    custom_thumbnail: "",
    is_enabled: true,
  });

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const load = async () => {
    const res = await fetch("/api/admin/youtube-videos");
    const data = await res.json();
    // Sort by position ascending
    const sorted = data.sort((a, b) => (a.position || 0) - (b.position || 0));
    setVideos(sorted);
  };

  useEffect(() => {
    load();
  }, []);

  const save = async () => {
    if (!form.youtube_id) return alert("YouTube ID required");

    const method = editingId ? "PUT" : "POST";

    // Auto-calculate position for new videos
    let payload = editingId ? { ...form, id: editingId } : form;

    if (!editingId) {
      const maxPosition = videos.length > 0 ? Math.max(...videos.map(v => v.position || 0)) : 0;
      payload = { ...payload, position: maxPosition + 1 };
    }

    await fetch("/api/admin/youtube-videos", {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    setForm({ title: "", youtube_id: "", custom_thumbnail: "", is_enabled: true });
    setEditingId(null);
    load();
  };

  const edit = (v) => {
    setForm({
      title: v.title || "",
      youtube_id: v.youtube_id || "",
      custom_thumbnail: v.custom_thumbnail || "",
      is_enabled: !!v.is_enabled,
    });
    setEditingId(v.id);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const cancel = () => {
    setForm({ title: "", youtube_id: "", custom_thumbnail: "", is_enabled: true });
    setEditingId(null);
  };

  const toggle = async (v) => {
    await fetch("/api/admin/youtube-videos", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...v, is_enabled: !v.is_enabled }),
    });
    load();
  };

  const remove = async (id) => {
    if (!confirm("Delete this video?")) return;
    await fetch(`/api/admin/youtube-videos?id=${id}`, { method: "DELETE" });
    load();
  };

  const handleDragEnd = async (event) => {
    const { active, over } = event;

    if (active.id !== over.id) {
      const oldIndex = videos.findIndex((v) => v.id === active.id);
      const newIndex = videos.findIndex((v) => v.id === over.id);

      const newVideos = arrayMove(videos, oldIndex, newIndex);

      // Update position values immediately for UI
      const updatedVideos = newVideos.map((v, index) => ({
        ...v,
        position: index + 1
      }));

      setVideos(updatedVideos);

      // Update positions in database
      const updates = updatedVideos.map((v) => ({
        id: v.id,
        position: v.position
      }));

      await fetch("/api/admin/youtube-videos/reorder", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ updates }),
      });
    }
  };

  return (
    <div className="container-fluid my-4">
      <div className="row">
        {/* ================= LEFT: LIST ================= */}
        <div className="col-lg-8 mb-4">
          <h3 className="mb-3">YouTube Videos</h3>

          <div className="card shadow-sm border-0">
            <div className="table-responsive">
              <table className="table align-middle mb-0">
                <thead className="table-light">
                  <tr>
                    <th style={{ width: 50 }}>Drag</th>
                    <th>Video</th>
                    <th>Title</th>
                    <th>Position</th>
                    <th>Status</th>
                    <th className="text-end">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {videos.length === 0 && (
                    <tr>
                      <td colSpan="6" className="text-center text-muted py-4">
                        No videos added yet
                      </td>
                    </tr>
                  )}

                  <DndContext
                    sensors={sensors}
                    collisionDetection={closestCenter}
                    onDragEnd={handleDragEnd}
                  >
                    <SortableContext
                      items={videos.map(v => v.id)}
                      strategy={verticalListSortingStrategy}
                    >
                      {videos.map((v) => (
                        <SortableVideoRow
                          key={v.id}
                          video={v}
                          onEdit={edit}
                          onToggle={toggle}
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

        {/* ================= RIGHT: ADD PANEL ================= */}
        <div className="col-lg-4">
          <div className="card shadow-sm border-0 position-sticky" style={{ top: 80 }}>
            <div className="card-body">
              <h5 className="mb-3">{editingId ? "Edit Video" : "Add New Video"}</h5>

              <label className="form-label small">Video Title</label>
              <input
                className="form-control mb-3"
                placeholder="Optional title"
                value={form.title}
                onChange={e => setForm({ ...form, title: e.target.value })}
              />

              <label className="form-label small">YouTube Video ID</label>
              <input
                className="form-control mb-3"
                placeholder="e.g. Fcz1pk8STfY"
                value={form.youtube_id}
                onChange={e => setForm({ ...form, youtube_id: e.target.value })}
              />

              <label className="form-label small fw-semibold">Custom Thumbnail (Optional)</label>
              <div className="mb-3">
                <input
                  type="file"
                  className="form-control mb-2"
                  accept="image/*"
                  onChange={async (e) => {
                    const file = e.target.files?.[0];
                    if (!file) return;
                    const fd = new FormData();
                    fd.append('file', file);
                    try {
                      const res = await fetch('/api/admin/youtube-videos/upload', { method: 'POST', body: fd });
                      const data = await res.json();
                      if (data.filename) {
                        setForm({ ...form, custom_thumbnail: `/uploads/youtube/${data.filename}` });
                      }
                    } catch (err) {
                      console.error('Upload failed:', err);
                      alert('Upload failed');
                    }
                  }}
                />
                <input
                  className="form-control mb-2"
                  placeholder="Or paste image URL"
                  value={form.custom_thumbnail}
                  onChange={e => setForm({ ...form, custom_thumbnail: e.target.value })}
                />
                {form.custom_thumbnail && (
                  <div className="mt-2">
                    <img src={form.custom_thumbnail} alt="Preview" style={{ width: '100%', maxHeight: 120, objectFit: 'cover', borderRadius: 4 }} />
                    <button type="button" className="btn btn-sm btn-outline-danger mt-1" onClick={() => setForm({ ...form, custom_thumbnail: '' })}>Remove</button>
                  </div>
                )}
                <small className="text-muted">If not set, YouTube auto thumbnail will be used</small>
              </div>

              <div className="form-check form-switch mb-3">
                <input
                  className="form-check-input"
                  type="checkbox"
                  checked={form.is_enabled}
                  onChange={() =>
                    setForm({ ...form, is_enabled: !form.is_enabled })
                  }
                />
                <label className="form-check-label small">
                  Enable video
                </label>
              </div>

              <button className="btn btn-primary w-100 mb-2" onClick={save}>
                {editingId ? "Update Video" : "Add Video"}
              </button>

              {editingId && (
                <button className="btn btn-outline-secondary w-100" onClick={cancel}>
                  Cancel
                </button>
              )}

            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
