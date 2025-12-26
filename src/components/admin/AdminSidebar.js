"use client";

import { useState } from "react";
import Link from "next/link";

export default function AdminSidebar() {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <aside className={`admin-sidebar bg-white border-end ${collapsed ? "collapsed" : ""}`}>

      <div className="sidebar-top d-flex align-items-center justify-content-between p-3 border-bottom">
        <Link href="/admin" className="text-decoration-none">
          <strong className="text-primary">Karma Admin</strong>
        </Link>

        <button className="btn btn-sm btn-outline-secondary" onClick={() => setCollapsed(!collapsed)} aria-label="Toggle sidebar">
          {collapsed ? "▶" : "◀"}
        </button>
      </div>

      <nav className="nav flex-column p-2">
        <Link href="/admin" className="nav-link py-2">Dashboard</Link>
        <Link href="/admin/enquiries" className="nav-link py-2">Enquiries</Link>
        <Link href="/admin/blogs" className="nav-link py-2">Blogs</Link>
        <Link href="/admin/pages" className="nav-link py-2">Pages</Link>
        <Link href="/admin/users" className="nav-link py-2">Users</Link>
        <Link href="/admin/settings" className="nav-link py-2">Settings</Link>
      </nav>

      <div className="sidebar-footer mt-auto p-3 border-top small text-muted">
        © {new Date().getFullYear()} Karma Ayurveda
      </div>
    </aside>
  );
}
