"use client";

import Link from "next/link";
import LogoutButton from "@/components/LogoutButton";

export default function AdminHeader() {
  return (
    <header className="admin-header bg-white border-bottom py-2">
      <div className="container-fluid d-flex align-items-center justify-content-between">
        <div className="d-flex align-items-center">
          <button className="btn btn-sm btn-outline-secondary me-3 d-md-none" onClick={() => {
            // small helper to toggle sidebar from header on mobile:
            const side = document.querySelector(".admin-sidebar");
            if (side) side.classList.toggle("show-mobile");
          }}>☰</button>
          <h5 className="mb-0">Admin Dashboard</h5>
          <small className="text-muted ms-3">Manage enquiries, posts and site settings</small>
        </div>

        <div className="d-flex align-items-center gap-2">
          <Link href="/" className="btn btn-outline-primary btn-sm">View Site</Link>
          <LogoutButton className="btn btn-outline-danger btn-sm" />
        </div>
      </div>
    </header>
  );
}
