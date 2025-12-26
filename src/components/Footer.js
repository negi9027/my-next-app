import Link from "next/link";
import { getSiteSettings } from "@/lib/siteSettings";

// compute once on server; deterministic value
const CURRENT_YEAR = new Date().getFullYear();

export default async function Footer() {
  let settings = {};
  try {
    settings = await getSiteSettings();
  } catch (err) {
    // if DB is not reachable during build, use empty settings
    console.warn("Footer: failed to load site settings:", err?.message || err);
    settings = {};
  }

  return (
        <footer className="bg-white border-top mt-5">
          <div className="container py-5">
            <div className="row">
              <div className="col-md-4 mb-3">
                <h5 className="fw-bold">Karma Ayurveda</h5>
                <p className="small text-muted">Reliable health information, simple tips and trusted resources. This is a demo site built with Next.js & Bootstrap.</p>
              </div>




              <div className="col-md-2 mb-3">
                <h6 className="fw-semibold">Quick Links</h6>
                <ul className="list-unstyled small">
                  <li><Link href="/" className="text-muted">Home</Link></li>
                  <li><Link href="/about" className="text-muted">About</Link></li>
                  <li><Link href="/parkinson" className="text-muted">Parkinson</Link></li>
                  <li><Link href="/cancer" className="text-muted">Cancer</Link></li>
                </ul>
              </div>

              <div className="col-md-3 mb-3">
                <h6 className="fw-semibold">Contact</h6>
                {settings.phone && <p className="small mb-1">📞 {settings.phone}</p>}
                {settings.email && <p className="small">📧 {settings.email}</p>}
                {settings.address && <p className="small text-muted">📍 {settings.address}</p>}
              </div>

              <div className="col-md-3 mb-3">
              <h6 className="fw-semibold mb-2">Social Media</h6>

              <ul className="list-group list-group-flush">
                {settings.facebook && (
                  <li className="list-group-item px-0">
                    <Link
                      href={settings.facebook}
                      target="_blank"
                      className="text-decoration-none d-flex align-items-center gap-2 text-primary"
                    >
                      <i className="bi bi-facebook fs-5"></i>
                      <span>Facebook</span>
                    </Link>
                  </li>
                )}

                {settings.instagram && (
                  <li className="list-group-item px-0">
                    <Link
                      href={settings.instagram}
                      target="_blank"
                      className="text-decoration-none d-flex align-items-center gap-2 text-danger"
                    >
                      <i className="bi bi-instagram fs-5"></i>
                      <span>Instagram</span>
                    </Link>
                  </li>
                )}
              </ul>

              </div>
            </div>
                

            <div className="text-center small text-muted mt-4">
              © {CURRENT_YEAR} My Health Site. All rights reserved.
            </div>
          </div>
        </footer>
        );
}