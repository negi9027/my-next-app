// src/app/admin/(dashboard)/layout.js
import { headers } from "next/headers";
import { verifyToken } from "@/lib/auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import LogoutButton from "@/components/LogoutButton";
import { testConnection } from "@/lib/db";


const navItems = [
  { href: "/admin", label: "Dashboard", icon: "🏠" },
  { href: "/admin/home-management", label: "Home Page", icon: "🌐" },
  { href: "/admin/diseases", label: "Diseases", icon: "🩺" },
  { href: "/admin/clinics", label: "Clinics", icon: "🏥" },
  { href: "/admin/blogs", label: "Blogs", icon: "✍️" },
  { href: "/admin/enquiries", label: "Enquiries", icon: "✉️" },
  { href: "/admin/site-settings", label: "Site Settings", icon: "⚙️" },
  { href: "/admin/youtube-videos", label: "YouTube Videos", icon: "▶️" },
  { href: "/admin/faqs", label: "FAQs", icon: "❓" },
  { href: "/admin/testimonials", label: "Testimonials", icon: "💬" },
];

export default async function AdminDashboardLayout({ children }) {
  const cookieName = process.env.COOKIE_NAME || "admin_token";

  const hdrs = await headers();
  const cookieHeader = hdrs.get("cookie") || "";


  let token = null;
  cookieHeader.split(";").forEach((c) => {
    const [k, v] = c.trim().split("=");
    if (k === cookieName) token = v;
  });

  if (!token || !verifyToken(token)) {
    redirect("/admin/login");
  }

  // Verify DB connectivity and show a clear message if unreachable
  const dbOk = await testConnection();
  if (!dbOk) {
    return (
      <div style={{ display: "flex", height: "100vh", alignItems: "center", justifyContent: "center", padding: 24 }}>
        <div style={{ maxWidth: 680, textAlign: "center" }}>
          <h2 style={{ color: "#d9534f", marginBottom: 8 }}>Database connection error</h2>
          <p style={{ color: "#6b7280" }}>
            The admin panel cannot reach the database. Please check your database server, environment variables, and try again.
          </p>
          <div style={{ marginTop: 16 }}>
            <a href="/api/_status/db" className="btn btn-outline-secondary">Check status</a>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      className="admin-root"
      style={{
        display: "flex",
        minHeight: "100vh",
        fontFamily:
          "Inter, system-ui, -apple-system, Segoe UI, Roboto, Helvetica Neue, Arial",
      }}
    >
      {/* ================= SIDEBAR ================= */}
      <aside
        className="admin-sidebar"
        style={{
          width: 260,
          background: "#0f1724",
          color: "#e6eef8",
          display: "flex",
          flexDirection: "column",
          height: "100vh",
          position: "fixed",
          left: 0,
          top: 0,
        }}
      >
        {/* TOP (FIXED) */}
        <div style={{ padding: 20 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <div
              style={{
                width: 48,
                height: 48,
                borderRadius: 10,
                background: "linear-gradient(135deg,#06b6d4,#7c3aed)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 22,
                fontWeight: 700,
              }}
            >
              KA
            </div>
            <div>
              <div style={{ fontWeight: 700 }}>Karma Ayurveda</div>
              <div style={{ fontSize: 12, color: "#9fb3c9" }}>
                Admin Panel
              </div>
            </div>
          </div>
        </div>

        <hr style={{ borderColor: "rgba(255,255,255,0.05)", margin: 0 }} />

        {/* NAV (SCROLLABLE ONLY THIS) */}
        <nav
          style={{
            flex: 1,
            overflowY: "auto",
            padding: 12,
          }}
        >
          <ul className="list-unstyled m-0 p-0">
            {navItems.map((it) => (
              <li key={it.href} style={{ marginBottom: 6 }}>
                <Link
                  href={it.href}
                  className="nav-link-admin"
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 12,
                    padding: "10px 12px",
                    borderRadius: 8,
                    color: "inherit",
                    textDecoration: "none",
                    fontWeight: 600,
                  }}
                >
                  <span style={{ width: 28, textAlign: "center" }}>
                    {it.icon}
                  </span>
                  {it.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        {/* BOTTOM (FIXED) */}
        <div style={{ padding: 20 }}>
          <hr style={{ borderColor: "rgba(255,255,255,0.05)" }} />

          <div style={{ fontSize: 12, color: "#9fb3c9", marginBottom: 8 }}>
            Signed in as
          </div>

          <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
            <div
              style={{
                width: 36,
                height: 36,
                borderRadius: 8,
                background: "#112233",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontWeight: 700,
              }}
            >
              A
            </div>
            <div>
              <div style={{ fontWeight: 700 }}>Admin</div>
              <div style={{ fontSize: 12, color: "#9fb3c9" }}>
                admin@example.com
              </div>
            </div>
          </div>

          <div style={{ marginTop: 14 }}>
            <LogoutButton className="btn btn-danger w-100" />
          </div>
        </div>
      </aside>

      {/* ================= MAIN ================= */}
      <div
        style={{
          marginLeft: 260,
          flex: 1,
          background: "#f3f6f9",
          minHeight: "100vh",
        }}
      >
        {/* HEADER (FIXED) */}
        <header
          style={{
            position: "sticky",
            top: 0,
            zIndex: 50,
            background: "#ffffff",
            padding: "14px 24px",
            borderBottom: "1px solid #e5e7eb",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <div>
            <h4 style={{ margin: 0 }}>Admin Dashboard</h4>
            <div style={{ fontSize: 13, color: "#6b7280" }}>
              Manage site content & settings
            </div>
          </div>

          <div style={{ display: "flex", gap: 10 }}>
            <Link
              href="/admin/diseases"
              className="btn btn-sm btn-primary"
            >
              + New Disease
            </Link>
            <Link
              href="/admin/blogs"
              className="btn btn-sm btn-outline-primary"
            >
              + New Blog
            </Link>
          </div>
        </header>

        {/* CONTENT */}
        <main style={{ padding: 24 }}>
          {children}

          {/* FOOTER */}
          <footer
            style={{
              marginTop: 40,
              fontSize: 13,
              color: "#6b7280",
              display: "flex",
              justifyContent: "space-between",
            }}
          >
            <div>© {new Date().getFullYear()} Karma Ayurveda</div>
            <div>Built with Next.js • Secure Admin</div>
          </footer>
        </main>
      </div>

      {/* ================= STYLES ================= */}
      <style>{`
        .nav-link-admin:hover {
          background: rgba(255,255,255,0.06);
          transition: all 0.15s ease;
        }

        @media (max-width: 900px) {
          aside.admin-sidebar {
            display: none;
          }
          div[style*="margin-left: 260px"] {
            margin-left: 0 !important;
          }
        }
      `}</style>
    </div>
  );
}
