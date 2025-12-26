"use client";

import { useEffect, useMemo, useState, useRef } from "react";
import { FaSearch, FaTrash, FaClipboard, FaExclamationTriangle, FaSpinner } from "react-icons/fa";

/**
 * Enquiries admin page
 * - GET  /api/admin/enquiries?search=...&page=...
 *   -> expected response: { data: [...], total: N }
 * - DELETE /api/admin/enquiries?id=...
 *
 * Place at: src/app/admin/(dashboard)/enquiries/page.js
 */

export default function EnquiriesPage() {
  const [data, setData] = useState([]);
  const [search, setSearch] = useState("");
  const [debounced, setDebounced] = useState("");
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const limit = 10;

  const [loading, setLoading] = useState(false);
  const [selected, setSelected] = useState(null);
  const [alert, setAlert] = useState(null);
  const debounceRef = useRef(null);

  // debounce search (300ms)
  useEffect(() => {
    clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      setDebounced(search.trim());
      setPage(1);
    }, 300);
    return () => clearTimeout(debounceRef.current);
  }, [search]);

  // fetch data when debounced or page changes
  useEffect(() => {
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debounced, page]);

  async function fetchData() {
    try {
      setLoading(true);
      const q = encodeURIComponent(debounced || "");
      const res = await fetch(`/api/admin/enquiries?search=${q}&page=${page}`);
      if (!res.ok) {
        throw new Error(`Server returned ${res.status}`);
      }
      const json = await res.json();
      // support both shapes: { data, total } or array
      if (Array.isArray(json)) {
        setData(json);
        setTotal(json.length);
      } else {
        setData(json.data || json.rows || []);
        setTotal(json.total ?? (json.data ? json.data.length : 0));
      }
    } catch (err) {
      console.error("fetch enquiries:", err);
      setAlert({ type: "danger", text: "Failed to load enquiries" });
      setData([]);
      setTotal(0);
    } finally {
      setLoading(false);
    }
  }

  const totalPages = Math.max(1, Math.ceil(total / limit));

  // select a row to show chat panel
  const openEnquiry = (item) => {
    setSelected(item);
    // optionally mark as read locally
  };

  // delete row
  const deleteRow = async (id) => {
    if (!confirm("Delete this enquiry?")) return;
    try {
      const res = await fetch(`/api/admin/enquiries?id=${id}`, { method: "DELETE" });
      const json = await res.json().catch(() => ({}));
      if (!res.ok || json.success === false) {
        throw new Error(json.error || `Delete failed (${res.status})`);
      }
      setAlert({ type: "success", text: "Deleted successfully" });
      // refresh
      fetchData();
      if (selected?.id === id) setSelected(null);
    } catch (err) {
      console.error(err);
      setAlert({ type: "danger", text: err.message || "Delete failed" });
    }
  };

  // mark duplicate locally (send to server if you have endpoint)
  const markDuplicate = async (id) => {
    // Try to call API if available, else update locally
    try {
      const res = await fetch(`/api/admin/enquiries/mark-duplicate?id=${id}`, { method: "POST" });
      if (res.ok) {
        setAlert({ type: "success", text: "Marked duplicate" });
        fetchData();
      } else {
        // fallback local update
        setData((prev) => prev.map((r) => (r.id === id ? { ...r, is_duplicate: 1 } : r)));
        setAlert({ type: "info", text: "Marked duplicate (local)" });
      }
    } catch {
      setData((prev) => prev.map((r) => (r.id === id ? { ...r, is_duplicate: 1 } : r)));
      setAlert({ type: "info", text: "Marked duplicate (local)" });
    }
  };

  const copyToClipboard = (text, label) => {
    navigator.clipboard?.writeText(text || "").then(() => {
      setAlert({ type: "success", text: `${label} copied to clipboard` });
    }).catch(() => {
      setAlert({ type: "danger", text: `Failed to copy ${label}` });
    });
  };

  const clearAlertAfter = (t = 2500) => {
    setTimeout(() => setAlert(null), t);
  };

  useEffect(() => { if (alert) clearAlertAfter(); }, [alert]);

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h2 className="m-0">All Enquiries</h2>
        <div className="small text-muted">Total: {total}</div>
      </div>

      {alert && (
        <div className={`alert alert-${alert.type} py-2`} role="alert">
          {alert.text}
        </div>
      )}

      {/* CHAT / PREVIEW PANEL */}
      <div className="row g-3 mb-4">
        <div className="col-lg-4">
          <div className="card shadow-sm h-100">
            <div className="card-body d-flex flex-column">
              <div className="d-flex justify-content-between mb-2 align-items-center">
                <strong>Conversation</strong>
                <div className="small text-muted">Click a row to preview</div>
              </div>

              {!selected ? (
                <div className="d-flex flex-column justify-content-center align-items-center text-center text-muted h-100">
                  <FaExclamationTriangle size={36} className="mb-2" />
                  <div>No enquiry selected</div>
                  <div className="small mt-1">Select a row to view message and contact details.</div>
                </div>
              ) : (
                <>
                  <div style={{ maxHeight: 280, overflow: "auto" }} className="mb-3">
                    {/* Chat bubble style */}
                    <div className="mb-3">
                      <div className="small text-muted mb-1">From</div>
                      <div className="d-flex gap-2 align-items-center">
                        <div className="fw-semibold">{selected.name || selected.email || "Unknown"}</div>
                        <div className="small text-muted">• {new Date(selected.created_at || selected.createdAt || Date.now()).toLocaleString()}</div>
                        {selected.is_duplicate == 1 && <span className="badge bg-warning ms-2">Duplicate</span>}
                      </div>
                    </div>

                    <div>
                      <div className="small text-muted mb-1">Message</div>
                      <div className="p-3 rounded-3" style={{ background: "#f6f8fb", whiteSpace: "pre-wrap" }}>
                        {selected.message || "(No message provided)"}
                      </div>
                    </div>
                  </div>

                  <div className="mt-auto">
                    <div className="d-flex gap-2 mb-2">
                      <button className="btn btn-outline-primary btn-sm" onClick={() => copyToClipboard(selected.phone || "", "Phone")}>
                        <FaClipboard className="me-1" /> Copy Phone
                      </button>
                      <button className="btn btn-outline-primary btn-sm" onClick={() => copyToClipboard(selected.email || "", "Email")}>
                        <FaClipboard className="me-1" /> Copy Email
                      </button>
                      <button className="btn btn-outline-warning btn-sm" onClick={() => markDuplicate(selected.id)}>
                        <FaExclamationTriangle className="me-1" /> Mark Duplicate
                      </button>
                    </div>

                    <div className="d-flex gap-2">
                      <a className="btn btn-sm btn-outline-secondary" href={`tel:${selected.phone || ""}`}>Call</a>
                      <a className="btn btn-sm btn-outline-secondary" href={`mailto:${selected.email || ""}`}>Email</a>
                      <button className="btn btn-sm btn-danger" onClick={() => deleteRow(selected.id)}><FaTrash className="me-1" /> Delete</button>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>

        {/* MAIN: search + table */}
        <div className="col-lg-8">
          <div className="card shadow-sm">
            <div className="card-body">
              {/* search */}
              <div className="d-flex mb-3 gap-2">
                <div className="input-group">
                  <span className="input-group-text bg-white"><FaSearch /></span>
                  <input
                    className="form-control"
                    placeholder="Search by name, email, phone, disease..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                  />
                </div>
                <button className="btn btn-outline-secondary" onClick={() => { setSearch(""); setDebounced(""); setPage(1); }}>Clear</button>
              </div>

              <div className="table-responsive" style={{ minHeight: 220 }}>
                <table className="table table-hover table-bordered align-middle mb-0">
                  <thead className="table-light">
                    <tr>
                      <th style={{ width: 60 }}>ID</th>
                      <th>Name</th>
                      <th>Phone</th>
                      <th>Email</th>
                      <th>Disease</th>
                      <th style={{ width: 100 }}>Status</th>
                      <th style={{ width: 120 }}>Page</th>
                      <th style={{ width: 140 }}>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {loading ? (
                      <tr>
                        <td colSpan="8" className="text-center py-4">
                          <FaSpinner className="me-2 spin" /> Loading...
                        </td>
                      </tr>
                    ) : data.length === 0 ? (
                      <tr>
                        <td colSpan="8" className="text-center py-4 text-muted">No enquiries found</td>
                      </tr>
                    ) : (
                      data.map((item) => (
                        <tr key={item.id} className={selected?.id === item.id ? "table-primary" : ""}>
                          <td>{item.id}</td>
                          <td style={{ minWidth: 140 }}>{item.name || <span className="text-muted">—</span>}</td>
                          <td>{item.phone || <span className="text-muted">—</span>}</td>
                          <td style={{ maxWidth: 160, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{item.email || <span className="text-muted">—</span>}</td>
                          <td style={{ maxWidth: 150, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{item.disease || <span className="text-muted">—</span>}</td>
                          <td>
                            {item.is_duplicate == 1
                              ? <span className="badge bg-warning">Duplicate</span>
                              : <span className="badge bg-success">New</span>}
                          </td>
                          <td style={{ maxWidth: 120, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{item.page_url || "-"}</td>
                          <td>
                            <div className="d-flex gap-2">
                              <button className="btn btn-sm btn-outline-primary" onClick={() => openEnquiry(item)}>View</button>
                              <button className="btn btn-sm btn-outline-danger" onClick={() => deleteRow(item.id)}>Delete</button>
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>

              {/* pagination */}
              <div className="d-flex justify-content-between align-items-center mt-3">
                <div className="small text-muted">
                  Showing {(page - 1) * limit + (data.length ? 1 : 0)} - {(page - 1) * limit + data.length} of {total}
                </div>
                <div className="btn-group">
                  <button className="btn btn-sm btn-outline-secondary" disabled={page <= 1} onClick={() => setPage((p) => Math.max(1, p - 1))}>Prev</button>
                  <button className="btn btn-sm btn-outline-secondary" disabled={page >= totalPages} onClick={() => setPage((p) => Math.min(totalPages, p + 1))}>Next</button>
                </div>
              </div>

            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        .spin { animation: spin 1s linear infinite; }
        @keyframes spin { from { transform: rotate(0deg) } to { transform: rotate(360deg) } }
      `}</style>
    </div>
  );
}
