// src/components/HomeSidebar.js
"use client";

import ContactFormWrapper from "./ContactFormWrapper";

export default function HomeSidebar({ clinics }) {
  return (
    <>
      <div className="card mb-3 shadow-sm">
        <div className="card-body">
          <div className="d-flex justify-content-between align-items-center mb-2">
            <h5 className="mb-0">Our Clinics</h5>
            <a href="/clinics" className="small">View all</a>
          </div>
          <div className="list-group list-group-flush">
            {clinics.map(c => (
              <a key={c.slug} href={`/clinics/${c.slug}`} className="list-group-item d-flex gap-3 align-items-center">
                {c.icon ? (
                  <img src={`/uploads/clinics/${c.icon}`} alt={c.name} style={{ width: 48, height: 48, objectFit: "cover", borderRadius: 8 }} />
                ) : (
                  <div style={{ width: 48, height: 48 }} className="d-flex align-items-center justify-content-center rounded bg-light text-secondary">🏥</div>
                )}
                <div>
                  <div className="fw-semibold">{c.name}</div>
                  <div className="small text-muted">{c.location || c.slug}</div>
                </div>
              </a>
            ))}
          </div>
        </div>
      </div>

      <div className="card mb-3 shadow-sm">
        <div className="card-body">
          <h5 className="mb-3">Contact Us</h5>
          <p className="small text-muted">Have questions? Send us a message.</p>
          <ContactFormWrapper />
        </div>
      </div>

      <style jsx global>{`
        .hover-lift:hover { transform: translateY(-6px); box-shadow: 0 20px 40px rgba(12, 64, 93, 0.08); }
        @media (max-width: 768px) { .hover-lift { transition: none; } }
      `}</style>
    </>
  );
}
