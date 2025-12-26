export const dynamic = "force-dynamic";

export const metadata = {
  title: "About Karma Ayurveda — My Health Site",
  description:
    "Learn about Karma Ayurveda, its legacy, mission, vision, and holistic Ayurvedic treatment approach for various health disorders.",
};

export default function About() {
  return (
    <main id="main">

      {/* ================= HERO ================= */}
      <section
        className="py-5 text-center text-white"
        style={{
          background: "linear-gradient(1deg, #0a48a5, #022340)",
        }}
      >
        <div className="container">
          <h1 className="fw-bold display-6 mb-2">About Karma Ayurveda</h1>
          <p className="opacity-75 mb-3">
            80+ Years of Trusted Ayurvedic Healing
          </p>

          <nav>
            <ul className="list-inline mb-0">
              <li className="list-inline-item">
                <a href="/" className="text-white text-decoration-none">
                  Home
                </a>
              </li>
              <li className="list-inline-item">/</li>
              <li className="list-inline-item opacity-75">About Us</li>
            </ul>
          </nav>
        </div>
      </section>

      {/* ================= ABOUT INTRO ================= */}
      <section className="py-5">
        <div className="container">
          <div className="row align-items-center g-4">

            {/* LEFT CONTENT */}
            <div className="col-lg-7">
              <h2 className="fw-bold mb-3">
                Karma Ayurveda – A Legacy of{" "}
                <span className="text-primary">Natural Healing</span>
              </h2>

              <p className="text-muted">
                Established in 1937, Karma Ayurveda carries a rich legacy of
                over eight decades in Ayurvedic healthcare. Led by Dr. Puneet
                Dhawan, a fifth-generation Ayurvedic expert, we continue to
                deliver authentic and ethical Ayurvedic treatment.
              </p>

              <p className="text-muted">
                While globally known for kidney treatment, Karma Ayurveda has
                evolved into a holistic healthcare center treating multiple
                chronic disorders naturally.
              </p>
            </div>

            {/* RIGHT CARD */}
            <div className="col-lg-5">
              <div className="card border-0 shadow-sm rounded-4">
                <div className="card-body p-4">
                  <h5 className="fw-bold mb-3">Ayurvedic Philosophy</h5>
                  <p className="text-muted mb-0">
                    Ayurveda believes diseases arise from dosha imbalance.
                    Treatment restores balance using herbs, detox therapies,
                    diet, and lifestyle correction.
                  </p>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ================= WHY CHOOSE ================= */}
      <section className="py-5 bg-light">
        <div className="container">
          <h2 className="fw-bold text-center mb-4">
            Why Choose Karma Ayurveda?
          </h2>

          <div className="row g-4">
            {[
              "Personalized Treatment Plans",
              "Expert Diet & Lifestyle Guidance",
              "Advanced Ayurvedic Therapies",
              "Continuous Patient Follow-up",
            ].map((item, index) => (
              <div className="col-md-6 col-lg-3" key={index}>
                <div className="card h-100 border-0 shadow-sm rounded-4 text-center">
                  <div className="card-body p-4">
                    <div className="fs-3 text-success mb-2">✔</div>
                    <h6 className="fw-semibold">{item}</h6>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ================= FEATURES ================= */}
      <section className="py-5">
        <div className="container">
          <h2 className="fw-bold text-center mb-4">
            Treatment Key Features
          </h2>

          <div className="row justify-content-center">
            <div className="col-lg-8">
              <ul className="list-group shadow-sm rounded-4 overflow-hidden">
                {[
                  "100% Herbal & Chemical-Free Treatment",
                  "Root-Cause Based Healing",
                  "Diet & Lifestyle Modification",
                  "Post-Treatment Monitoring",
                ].map((item, index) => (
                  <li key={index} className="list-group-item py-3">
                    ✅ {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* ================= MISSION & VISION ================= */}
      <section className="py-5 bg-light">
        <div className="container">
          <div className="row g-4">

            <div className="col-md-6">
              <div className="card h-100 border-0 shadow-sm rounded-4">
                <div className="card-body p-4">
                  <h4 className="fw-bold">Our Mission</h4>
                  <p className="text-muted mb-0">
                    To provide ethical, personalized, and long-term healing
                    through authentic Ayurvedic treatment.
                  </p>
                </div>
              </div>
            </div>

            <div className="col-md-6">
              <div className="card h-100 border-0 shadow-sm rounded-4">
                <div className="card-body p-4">
                  <h4 className="fw-bold">Our Vision</h4>
                  <p className="text-muted mb-0">
                    To combine ancient Ayurvedic wisdom with modern science and
                    make natural healing accessible worldwide.
                  </p>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ================= GALLERY ================= */}
      <section className="py-5">
        <div className="container">
          <h2 className="fw-bold text-center mb-4">Our Gallery</h2>
        </div>

        <div className="container-fluid">
          <div className="row g-0">
            {[
              "awards2.webp",
              "awards3.webp",
              "awards4.webp",
              "awards5.webp",
            ].map((img, index) => (
              <div className="col-lg-3 col-md-4" key={index}>
                <img
                  src={`https://www.karmaayurvedausa.com/assets/image/gallery/${img}`}
                  alt="Karma Ayurveda Awards"
                  className="img-fluid gallery-img"
                  loading="lazy"
                />
              </div>
            ))}
          </div>
        </div>
      </section>

    </main>
  );
}
