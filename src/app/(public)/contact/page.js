export const dynamic = "force-dynamic";

import ContactClient from "./ContactClient";

export default function Contact() {
  return (
    <div className="my-4 container">
      <h1 className="mb-3">Contact Us</h1>
      <p className="text-muted mb-4">
        Fill out the form below and we'll get back to you.
      </p>

      <div className="row">
        <div className="col-md-6">
          <ContactClient />
        </div>

        <div className="col-md-6">
          <h5>Our Contact Info</h5>
          <p>📞 +91 98765 43210</p>
          <p>✉️ info@example.com</p>
          <p>🏢 Your City, India</p>
        </div>
      </div>
    </div>
  );
}
