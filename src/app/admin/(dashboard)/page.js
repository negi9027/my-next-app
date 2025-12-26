"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { FaBlog, FaEnvelope, FaHospital, FaVirus, FaSearch } from "react-icons/fa";

export default function AdminHome() {
  const [blogsCount, setBlogsCount] = useState(0);
  const [enquiriesCount, setEnquiriesCount] = useState(0);
  const [clinicsCount, setClinicsCount] = useState(0);
  const [diseasesCount, setDiseasesCount] = useState(0);

  const [diseases, setDiseases] = useState([]);
  const [clinics, setClinics] = useState([]);
  const [recentEnquiries, setRecentEnquiries] = useState([]);

  // UI state
  const [search, setSearch] = useState("");
  const [filteredDiseases, setFilteredDiseases] = useState([]);
  const [filteredClinics, setFilteredClinics] = useState([]);

  useEffect(() => {
    // Blogs
    fetch("/api/admin/blogs")
      .then((r) => (r.ok ? r.json() : []))
      .then((data) => {
        const arr = Array.isArray(data) ? data : data.rows ?? [];
        setBlogsCount(arr.length || 0);
      })
      .catch((e) => console.error("fetch blogs:", e));

    // Enquiries
    fetch("/api/admin/enquiries")
      .then((r) => (r.ok ? r.json() : []))
      .then((res) => {
        // normalize expected shapes: Array, { data: [] }, { rows: [] }, or { data, total }
        const arr = Array.isArray(res)
          ? res
          : (res && Array.isArray(res.data) ? res.data : (res && Array.isArray(res.rows) ? res.rows : []));
        const total = res && typeof res === "object" ? (res.total ?? arr.length) : arr.length;
        setEnquiriesCount(total ?? arr.length ?? 0);
        setRecentEnquiries(arr.slice(0, 6));
      })
      .catch((e) => console.error("fetch enquiries:", e));

    // Clinics
    fetch("/api/admin/clinics")
      .then((r) => (r.ok ? r.json() : []))
      .then((data) => {
        const arr = Array.isArray(data) ? data : data.rows ?? [];
        setClinics(arr);
        setClinicsCount(arr.length || 0);
        setFilteredClinics(arr);
      })
      .catch((e) => console.error("fetch clinics:", e));

    // Diseases
    fetch("/api/admin/diseases")
      .then((r) => (r.ok ? r.json() : []))
      .then((data) => {
        const arr = Array.isArray(data) ? data : data.rows ?? [];
        setDiseases(arr);
        setDiseasesCount(arr.length || 0);
        setFilteredDiseases(arr);
      })
      .catch((e) => console.error("fetch diseases:", e));
  }, []);

  // Search filter handler
  useEffect(() => {
    const q = search.trim().toLowerCase();
    if (!q) {
      setFilteredDiseases(diseases);
      setFilteredClinics(clinics);
      return;
    }
    setFilteredDiseases(diseases.filter((d) => (d.title || "").toLowerCase().includes(q) || (d.slug || "").toLowerCase().includes(q)));
    setFilteredClinics(clinics.filter((c) => (c.name || "").toLowerCase().includes(q) || (c.slug || "").toLowerCase().includes(q) || (c.location || "").toLowerCase().includes(q)));
  }, [search, diseases, clinics]);

  return (
    <>

      {/* Search bar */}
      <div className="mb-4">
        <div className="input-group shadow-sm">
          <span className="input-group-text bg-white"><FaSearch /></span>
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search diseases, clinics..."
            className="form-control"
          />
          <button type="button" className="btn btn-outline-secondary" onClick={() => { setSearch(""); }}>
            Clear
          </button>
        </div>
      </div>

      {/* Summary cards */}
      <div className="row g-3 mb-4">
        <CardLink href="/admin/blogs" title="Blogs" value={blogsCount} icon={<FaBlog />} color="linear-gradient(90deg,#3b82f6,#60a5fa)" />
        <CardLink href="/admin/enquiries" title="Enquiries" value={enquiriesCount} icon={<FaEnvelope />} color="linear-gradient(90deg,#10b981,#34d399)" />
        <CardLink href="/admin/clinics" title="Clinics" value={clinicsCount} icon={<FaHospital />} color="linear-gradient(90deg,#06b6d4,#67e8f9)" />
        <CardLink href="/admin/diseases" title="Diseases" value={diseasesCount} icon={<FaVirus />} color="linear-gradient(90deg,#f59e0b,#fbbf24)" />
      </div>

      <div className="row g-4">
        {/* Left column: recent enquiries */}
        <div className="col-lg-4">
          <div className="card shadow-sm h-100">
            <div className="card-body">
              <div className="d-flex justify-content-between align-items-center mb-3">
                <h5 className="mb-0">Recent Enquiries</h5>
                <Link href="/admin/enquiries" className="btn btn-sm btn-outline-primary">View all</Link>
              </div>

              {recentEnquiries.length === 0 ? (
                <div className="text-muted small">No enquiries yet.</div>
              ) : (
                recentEnquiries.map((q, i) => (
                  <div key={i} className="border rounded p-2 mb-2" style={{ background: "#fff" }}>
                    <div className="d-flex justify-content-between">
                      <div className="fw-semibold">{q.name || q.email || "—"}</div>
                      <div className="small text-muted">{new Date(q.created_at || q.createdAt || Date.now()).toLocaleDateString()}</div>
                    </div>
                    <div className="small text-muted mt-1">{q.message ? (q.message.length > 90 ? q.message.slice(0, 90) + "…" : q.message) : <em>No message</em>}</div>
                    <div className="mt-2 d-flex justify-content-between">
                      <div className="small text-muted">Page</div>
                      <div className="small">{q.page_url || "-"}</div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Right column: diseases + clinics */}
        <div className="col-lg-8">
          <div className="card shadow-sm mb-3">
            <div className="card-body">
              <div className="d-flex justify-content-between align-items-center mb-3">
                <h5 className="mb-0">Diseases</h5>
                <Link href="/admin/diseases" className="btn btn-sm btn-outline-secondary">Manage Diseases</Link>
              </div>

              <div className="row g-2">
                {filteredDiseases.length === 0 ? (
                  <div className="col-12"><p className="text-muted small mb-0">No diseases to show.</p></div>
                ) : filteredDiseases.slice(0, 6).map((d) => (
                  <div key={d.id} className="col-6 col-md-4">
                    <Link href={`/admin/diseases`} className="text-decoration-none">
                      <div className="card h-100 border-0 hover-card">
                        <div className="card-body text-center">
                          {d.icon ? (
                            <img src={`/uploads/diseases/${d.icon}`} alt={d.title} style={{ width: 56, height: 56, objectFit: "cover" }} className="mb-2 rounded" />
                          ) : (
                            <div className="mb-2 rounded-circle bg-secondary text-white d-inline-flex align-items-center justify-content-center" style={{ width: 56, height: 56 }}>
                              🩺
                            </div>
                          )}
                          <div className="small fw-semibold text-dark">{d.title}</div>
                          <div className="small text-muted">{d.slug}</div>
                        </div>
                      </div>
                    </Link>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="card shadow-sm">
            <div className="card-body">
              <div className="d-flex justify-content-between align-items-center mb-3">
                <h5 className="mb-0">Clinics</h5>
                <Link href="/admin/clinics" className="btn btn-sm btn-outline-secondary">Manage Clinics</Link>
              </div>

              <div className="row g-2">
                {filteredClinics.length === 0 ? (
                  <div className="col-12"><p className="text-muted small mb-0">No clinics to show.</p></div>
                ) : filteredClinics.slice(0, 6).map((c) => (
                  <div key={c.id} className="col-6 col-md-4">
                    <Link href={`/admin/clinics`} className="text-decoration-none">
                      <div className="card h-100 border-0 hover-card">
                        <div className="card-body text-center">
                          {c.icon ? (
                            <img src={`/uploads/clinics/${c.icon}`} alt={c.name} style={{ width: 56, height: 56, objectFit: "cover" }} className="mb-2 rounded" />
                          ) : (
                            <div className="mb-2 rounded-circle bg-secondary text-white d-inline-flex align-items-center justify-content-center" style={{ width: 56, height: 56 }}>
                              🏥
                            </div>
                          )}
                          <div className="small fw-semibold text-dark">{c.name}</div>
                          <div className="small text-muted">{c.location || c.slug}</div>
                        </div>
                      </div>
                    </Link>
                  </div>
                ))}
              </div>

            </div>
          </div>
        </div>
      </div>

      {/* quick footer note */}
      <div className="text-center mt-4 small text-muted">Admin panel • Manage content securely</div>

      {/* Local styles (safe inside client component) */}
      <style>{`
        .hover-card { transition: transform .15s ease, box-shadow .15s ease; }
        .hover-card:hover { transform: translateY(-6px); box-shadow: 0 10px 30px rgba(0,0,0,0.08); }
        .card .card-body img { border-radius: 8px; }
        /* subtle responsive tweaks */
        @media (max-width: 575px) {
          .card .card-body img { width: 48px !important; height: 48px !important; }
        }
      `}</style>
    </>
  );
}

/* Small helper card component */
function CardLink({ href, title, value, icon, color }) {
  return (
    <div className="col-6 col-md-3">
      <Link href={href} className="text-decoration-none">
        <div className="card shadow-sm h-100">
          <div className="card-body d-flex align-items-center gap-3">
            <div style={{
              width: 56, height: 56, borderRadius: 12,
              display: "flex", alignItems: "center", justifyContent: "center",
              background: color || "#ddd", color: "white", fontSize: 20
            }}>
              {icon}
            </div>
            <div>
              <div className="small text-muted">{title}</div>
              <div className="h4 mb-0">{value}</div>
            </div>
          </div>
        </div>
      </Link>
    </div>
  );
}
