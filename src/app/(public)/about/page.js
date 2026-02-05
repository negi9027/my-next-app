export const dynamic = "force-dynamic";

export const metadata = {
  title: "À propos de Karma Ayurveda — Mon site santé",
  description:
    "Découvrez Karma Ayurveda, son héritage, sa mission et son approche ayurvédique naturelle pour la santé.",
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
          <h1 className="fw-bold display-6 mb-2">À propos de Karma Ayurveda</h1>
          <p className="opacity-75 mb-3">
            Plus de 80 ans de soins ayurvédiques de confiance
          </p>

          <nav>
            <ul className="list-inline mb-0">
              <li className="list-inline-item">
                <a href="/" className="text-white text-decoration-none">
                  Accueil
                </a>
              </li>
              <li className="list-inline-item">/</li>
              <li className="list-inline-item opacity-75">À propos</li>
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
                Karma Ayurveda – Une tradition de{" "}
                <span className="text-primary">soins naturels</span>
              </h2>

              <p className="text-muted">
                Fondée en 1937, Karma Ayurveda s’appuie sur plusieurs décennies
                d’expérience en médecine ayurvédique, sous la direction du
                Dr Puneet Dhawan.
              </p>

              <p className="text-muted">
                Reconnue pour ses soins rénaux, la clinique adopte aujourd’hui
                une approche globale pour les maladies chroniques.
              </p>
            </div>

            {/* RIGHT CARD */}
            <div className="col-lg-5">
              <div className="card border-0 shadow-sm rounded-4">
                <div className="card-body p-4">
                  <h5 className="fw-bold mb-3">Philosophie ayurvédique</h5>
                  <p className="text-muted mb-0">
                    L’Ayurveda vise à rétablir l’équilibre du corps par des
                    plantes, la détoxification, l’alimentation et le mode de vie.
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
            Pourquoi choisir Karma Ayurveda ?
          </h2>

          <div className="row g-4">
            {[
              "Soins personnalisés",
              "Conseils alimentaires",
              "Thérapies ayurvédiques",
              "Suivi patient continu",
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
            Points clés du traitement
          </h2>

          <div className="row justify-content-center">
            <div className="col-lg-8">
              <ul className="list-group shadow-sm rounded-4 overflow-hidden">
                {[
                  "Traitement 100 % naturel",
                  "Approche ciblant la cause",
                  "Adaptation du mode de vie",
                  "Suivi après traitement",
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
                  <h4 className="fw-bold">Notre mission</h4>
                  <p className="text-muted mb-0">
                    Offrir des soins ayurvédiques éthiques et personnalisés.
                  </p>
                </div>
              </div>
            </div>

            <div className="col-md-6">
              <div className="card h-100 border-0 shadow-sm rounded-4">
                <div className="card-body p-4">
                  <h4 className="fw-bold">Notre vision</h4>
                  <p className="text-muted mb-0">
                    Rendre la guérison naturelle accessible à tous.
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
          <h2 className="fw-bold text-center mb-4">Galerie</h2>
        </div>
      </section>

    </main>
  );
}
