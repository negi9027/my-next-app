// src/components/Navbar.js
import Link from "next/link";
import Image from "next/image";
import NavbarClientBehavior from "./NavbarClientBehavior";
import pool from "@/lib/db";

// Force dynamic rendering to always fetch fresh data
export const dynamic = 'force-dynamic';

export default async function Navbar() {
  let groupedDiseases = {};

  try {
    const conn = await pool.getConnection();

    const [rows] = await conn.execute(`
      SELECT 
        d.title,
        d.slug,
        d.icon,
        c.name AS category_name
      FROM diseases d
      LEFT JOIN disease_categories c ON d.category_id = c.id
      WHERE d.status = 'active'
      ORDER BY c.name ASC, d.title ASC
    `);

    conn.release();

    // ✅ GROUP CATEGORY-WISE (SERVER SIDE)
    groupedDiseases = rows.reduce((acc, d) => {
      const category = d.category_name || "Other";
      if (!acc[category]) acc[category] = [];
      acc[category].push(d);
      return acc;
    }, {});

    console.log('Navbar: Fetched diseases:', rows.length);
    console.log('Navbar: Grouped categories:', Object.keys(groupedDiseases));

  } catch (err) {
    console.warn("Navbar DB Error:", err?.message || err);
    groupedDiseases = {};
  }

  return (
    <nav className="navbar navbar-expand-lg bg-white border-bottom shadow-sm">
      <div className="container">

        {/* LOGO */}
        <Link href="/" className="navbar-brand">
          <Image
            src="/images/karma-logo.png"
            alt="Karma Ayurveda"
            width={70}
            height={70}
            style={{ height: "auto" }}
            priority
          />
        </Link>

        {/* TOGGLER */}
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navMenu"
          aria-controls="navMenu"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>


        {/* MENU */}
        <div className="collapse navbar-collapse" id="navMenu">
          <ul className="navbar-nav ms-auto align-items-lg-center">

            <li className="nav-item">
              <Link href="/" className="nav-link">Accueil</Link>
            </li>

            <li className="nav-item">
              <Link href="/about" className="nav-link">À propos</Link>
            </li>

            {/* ===== DISEASE MEGA MENU ===== */}
            <li className="nav-item dropdown dropdown-mega position-static">
              <button
                className="nav-link dropdown-toggle fw-semibold btn btn-link p-0"
                type="button"
                data-bs-toggle="dropdown"
                aria-expanded="false"
              >
                Maladies
              </button>

              <div className="dropdown-menu w-100 border-0 shadow-lg mt-0">
                <div className="container py-4">
                  <div className="row g-4">

                    {Object.keys(groupedDiseases).length === 0 ? (
                      <div className="col-12 text-muted">
                        Aucune maladie
                      </div>
                    ) : (
                      Object.entries(groupedDiseases).map(
                        ([category, items]) => (
                          <div
                            key={category}
                            className="col-12 col-md-4 col-lg-3"
                          >
                            <h6 className="text-primary fw-bold border-bottom pb-2 mb-3">
                              {category}
                            </h6>

                            <ul className="list-unstyled mb-0">
                              {items.map((d) => (
                                <li key={d.slug} className="mb-2">
                                  <Link
                                    href={`/disease/${d.slug}`}
                                    className="dropdown-item d-flex align-items-center rounded-3 px-2 py-2 disease-item"
                                  >
                                    {d.icon && (
                                      <Image
                                        src={`/uploads/diseases/${d.icon}`}
                                        alt={d.title}
                                        width={26}
                                        height={26}
                                        className="me-2 rounded-circle bg-light p-1"
                                      />
                                    )}
                                    <span>{d.title}</span>
                                  </Link>
                                </li>
                              ))}
                            </ul>

                            {items.length > 0 && (
                              <div className="mt-3">
                                <Link href="/diseases" className="small text-primary d-block">
                                  Tout voir →
                                </Link>
                              </div>
                            )}
                          </div>
                        )
                      )
                    )}

                  </div>
                </div>
              </div>
            </li>

            <li className="nav-item">
              <Link href="/kidney-calculator" className="nav-link">Calculateur</Link>
            </li>

            <li className="nav-item">
              <Link href="/blog" className="nav-link">Blog</Link>
            </li>

            <li className="nav-item ms-lg-2">
              <Link href="/contact" className="btn btn-primary btn-sm px-3">
                Contact
              </Link>
            </li>

          </ul>
        </div>


        {/* Client behavior: close menu on navigation / link click */}
        <NavbarClientBehavior />

      </div>

      {/* Mobile-specific tweaks for spacing and tap targets */}
      <style>{`
        @media (max-width: 991px) {
          .navbar-nav { gap: .2rem; }
          .nav-link { padding: .6rem 0.75rem; font-size: 0.97rem; }
          .navbar .btn { width: 100%; padding-left: 1rem; padding-right: 1rem; }
          .dropdown-menu { width: 100%; border-radius: 10px; }
          .dropdown-mega .dropdown-menu { padding-left: 0; padding-right: 0; }
        }
      `}</style>

    </nav>
  );
}
