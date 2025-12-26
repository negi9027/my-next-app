// C:\Users\esfgi\Desktop\next_web\myproject\src\components\DiseaseCard.js
"use client";

import Link from "next/link";

export default function DiseaseCard({ slug, title, icon }) {
  return (
    <div className="col-sm-6 col-md-2" data-disease-title={title}>
      <Link href={`/disease/${slug}`} className="text-decoration-none">
        <div
          className="card h-100 border-0 shadow-sm p-3 text-center"
          style={{ transition: "transform .18s ease, box-shadow .18s ease", cursor: "pointer" }}
          onMouseEnter={(e) => { e.currentTarget.style.transform = "translateY(-6px)"; e.currentTarget.style.boxShadow = "0 20px 40px rgba(12,64,93,0.08)"; }}
          onMouseLeave={(e) => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = ""; }}
        >
          {icon ? (
            <div className="text-center">
            <img
              src={`/uploads/diseases/${icon}`}
              alt={title}
              style={{ width: 64, height: 64, objectFit: "cover" }}
              className="mb-3 rounded"
            />
            </div>
          ) : (
            <div className="display-6 mb-2">🩺</div>
          )}

          <h5 className="text-dark">{title}</h5>
          <p className="small text-muted mb-1">Read symptoms & care</p>
          <span className="small text-primary">View Details →</span>
        </div>
      </Link>
    </div>
  );
}
