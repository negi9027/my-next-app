"use client";

import Link from "next/link";

export default function ClinicCard({ slug, name, icon, location }) {
  return (
    <div className="col-sm-6 col-md-4">
      <Link href={`/clinics/${slug}`} className="text-decoration-none">
        <div
          className="card h-100 border-0 shadow-sm p-3 text-center"
          style={{ transition: "transform .18s ease, boxShadow: '0 20px 40px rgba(12,64,93,0.08)'", cursor: "pointer" }}
          onMouseEnter={(e) => { e.currentTarget.style.transform = "translateY(-6px)"; e.currentTarget.style.boxShadow = "0 20px 40px rgba(12,64,93,0.08)"; }}
          onMouseLeave={(e) => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = ""; }}
        >
          {icon ? (
            <img
              src={`/uploads/clinics/${icon}`}
              alt={name}
              style={{ width: 64, height: 64, objectFit: "cover", borderRadius: 8 }}
              className="mb-2"
            />
          ) : (
            <div className="display-6 mb-2">🏥</div>
          )}

          <h5 className="text-dark mb-1">{name}</h5>
          <span className="small text-muted">{location}</span>
        </div>
      </Link>
    </div>
  );
}
