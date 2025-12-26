"use client";

import { useState } from "react";
import Link from "next/link";
import ContactFormWrapper from "./ContactFormWrapper";

export default function Topbar() {
  const [open, setOpen] = useState(false);

  return (
    <>
      {/* TOPBAR */}
      <div id="topbar" style={{ background: "#022340" }} className="border-bottom">
        <div className="container d-flex justify-content-between align-items-center py-2">

          {/* LEFT: Social */}
          <div className="d-flex align-items-center">
            <Link
              href="https://www.youtube.com/@kidneyexpertus"
              target="_blank"
              aria-label="YouTube"
              className="text-danger fs-5 me-3"
            >
              <i className="bi bi-youtube youtube-circle"></i>
            </Link>
          </div>

          {/* RIGHT: Flag + Button */}
          <div className="d-flex align-items-center">
            <img
              src="https://upload.wikimedia.org/wikipedia/en/a/a4/Flag_of_the_United_States.svg"
              alt="USA Flag"
              width="60"
              style={{ height: "auto", borderRadius: 4 }}
              className="me-2"
              loading="lazy"
            />

            <button
              className="topbar-consult-btn"
              onClick={() => setOpen(true)}
              aria-haspopup="dialog"
            >
              <span className="pulse"></span>
              <span className="blinker">Book Free Consultation</span>
            </button>
          </div>

        </div>
      </div>

      {/* MODAL */}
      {open && (
        <div
          className="modal-overlay"
          role="dialog"
          aria-modal="true"
          tabIndex="-1"
        >
          <div className="modal-card">
            <div className="modal-header">
              <div>
                <h3>Free Kidney Consultation</h3>
                <p className="mb-0">Expert Guidance — Confidential & Free</p>
              </div>
              <button
                className="modal-close"
                onClick={() => setOpen(false)}
                aria-label="Close"
              >
                ×
              </button>
            </div>

            <div className="modal-body">
              <p className="fw-semibold">
                Book Your Free Consultation and talk with our doctors.
              </p>

              <ContactFormWrapper />
            </div>
          </div>
        </div>
      )}
    </>
  );
}
