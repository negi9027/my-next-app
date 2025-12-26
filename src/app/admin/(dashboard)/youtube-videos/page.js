"use client";

import { useEffect, useState } from "react";

export default function YouTubeAdmin() {
  const [videos, setVideos] = useState([]);
  const [form, setForm] = useState({
    title: "",
    youtube_id: "",
    position: "",
    is_enabled: true,
  });

  const load = async () => {
    const res = await fetch("/api/admin/youtube-videos");
    const data = await res.json();
    setVideos(data);
  };

  useEffect(() => {
    load();
  }, []);

  const save = async () => {
    if (!form.youtube_id) return alert("YouTube ID required");

    await fetch("/api/admin/youtube-videos", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });

    setForm({ title: "", youtube_id: "", position: "", is_enabled: true });
    load();
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
                      <td colSpan="5" className="text-center text-muted py-4">
                        No videos added yet
                      </td>
                    </tr>
                  )}

                  {videos.map(v => (
                    <tr key={v.id}>
                      <td style={{ width: 160 }}>
                        <img
                          src={`https://img.youtube.com/vi/${v.youtube_id}/mqdefault.jpg`}
                          alt={v.title}
                          className="rounded"
                          style={{ width: 140 }}
                        />
                      </td>

                      <td>
                        <div className="fw-semibold">{v.title || "—"}</div>
                        <div className="text-muted small">{v.youtube_id}</div>
                      </td>

                      <td>
                        <span className="badge bg-light text-dark">
                          {v.position}
                        </span>
                      </td>

                      <td>
                        <div className="form-check form-switch">
                          <input
                            className="form-check-input"
                            type="checkbox"
                            checked={!!v.is_enabled}
                            onChange={() => toggle(v)}
                          />
                        </div>
                      </td>

                      <td className="text-end">
                        <button
                          className="btn btn-sm btn-outline-danger"
                          onClick={() => remove(v.id)}
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}

                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* ================= RIGHT: ADD PANEL ================= */}
        <div className="col-lg-4">
          <div className="card shadow-sm border-0 position-sticky" style={{ top: 80 }}>
            <div className="card-body">
              <h5 className="mb-3">Add New Video</h5>

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

              <label className="form-label small">Position</label>
              <input
                type="number"
                className="form-control mb-3"
                placeholder="Sort order"
                value={form.position}
                onChange={e => setForm({ ...form, position: e.target.value })}
              />

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

              <button className="btn btn-primary w-100" onClick={save}>
                Add Video
              </button>

              <p className="text-muted small mt-3 mb-0">
                Thumbnail will be auto fetched from YouTube.
              </p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
