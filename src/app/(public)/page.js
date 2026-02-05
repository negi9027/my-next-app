export const dynamic = "force-dynamic";

import Link from "next/link";
import pool from "@/lib/db";

import YouTubeGrid from "@/components/YouTubeGrid";
import HomeFAQs from "@/components/HomeFAQs";
import RecentBlogs from "@/components/RecentBlogs"; // server
import ContactFormWrapper from "@/components/ContactFormWrapper"; // client
import ClinicCard from "@/components/ClinicCard"; // client
import DiseasesSection from "@/components/DiseasesSection";
import TestimonialSlider from "@/components/TestimonialSlider";

export const metadata = {
  title: "Home — My Health Site",
  description: "Trusted health information, clinics, guides, and healthy lifestyle tips.",
};

export default async function Home() {
  let diseases = [];
  let clinics = [];

  try {
    const conn = await pool.getConnection();

    const [diseasesRows] = await conn.execute(
      "SELECT d.slug, d.title, d.icon, COALESCE(c.name, 'Other') AS category_name, COALESCE(c.slug, '') AS category_slug FROM diseases d LEFT JOIN disease_categories c ON d.category_id = c.id WHERE d.status='active' ORDER BY d.id ASC"
    );

    const [clinicsRows] = await conn.execute(
      "SELECT slug, name, icon, location FROM clinics WHERE status='active' LIMIT 12"
    );

    conn.release();
    diseases = diseasesRows;
    clinics = clinicsRows;
  } catch (err) {
    console.warn("Home: DB unavailable:", err?.message || err);
    diseases = [];
    clinics = [];
  }


  return (
    <>


{/* ================= HERO SECTION ================= */}
<section
  className="py-5 position-relative overflow-hidden hero"
  style={{
    background: "linear-gradient(135deg, rgba(203, 227, 255, 1) 0%, rgb(131 193 255) 100%)",
  }}
>
  <div className="container">

    {/* ===== Top Heading ===== */}
    <div className="text-center mb-5">
      <h1 className="display-5 fw-bold text-primary">
        Votre guide de confiance pour la santé des reins
      </h1>
      <p className="lead text-muted mt-2">
        Comprenez les maladies rénales, obtenez des conseils d’experts et connectez-vous avec des cliniques fiables.
      </p>
    </div>

    {/* ===== Main Layout ===== */}
    <div className="row align-items-center g-4">

      {/* ===== Left Content ===== */}
      <div className="col-lg-4 text-lg-start text-center hero-left">
        <h2 className="fw-bold mb-3">
          Des informations simples, fiables et validées par des médecins
        </h2>
        <p className="text-muted mb-4">
          Découvrez les symptômes, les causes, les conseils alimentaires
          et les options de traitements naturels expliqués de manière claire et compréhensible.
        </p>

        <div className="d-flex gap-2 justify-content-lg-start justify-content-center">
          <Link href="/about" className="btn btn-outline-primary btn-lg">
            En savoir plus
          </Link>

          {diseases && diseases[0] && (
            <Link
              href={`/disease/${diseases[0].slug}`}
              className="btn btn-primary btn-lg"
            >
              Guide des maladies
            </Link>
          )}
        </div>
      </div>

      {/* ===== Center Kidney Image ===== */}
      <div className="col-lg-4 text-center">
        <img
          src="/images/kidney-hero2.png"
          alt="Illustration du rein humain"
          className="img-fluid hero-img"
          style={{
            maxHeight: "360px",
            filter: "drop-shadow(0 20px 30px rgba(0,0,0,0.15))",
          }}
        />
      </div>

      {/* ===== Right Form ===== */}
      <div className="col-lg-4">
        <div className="bg-white p-3 rounded hero-form">
          <ContactFormWrapper />
        </div>
      </div>

    </div>
  </div>
</section>


{/* ================= FREE CONSULTATION CTA ================= */}
<section
  className="py-4"
  style={{
    background: "linear-gradient(90deg, #436f96, #02203a)",
  }}
>
 <div className="container">
  <div className="row align-items-center g-3 text-center text-md-start">

    {/* ===== FLAG ===== */}
    <div className="col-md-2 d-flex justify-content-center justify-content-md-start">
      <img
        src="https://upload.wikimedia.org/wikipedia/en/c/c3/Flag_of_France.svg"
        alt="France Flag"
        loading="lazy"
        className="flag-img"
        style={{
          width: 90,
          borderRadius: 6,
          boxShadow: "0 6px 15px rgba(0,0,0,0.25)",
        }}
      />
    </div>

    {/* ===== TEXT ===== */}
    <div className="col-md-7">
      <h3 className="mb-1 text-white fw-bold">
        Consultation gratuite
      </h3>
      <p className="mb-0 text-light">
        Parlez à un spécialiste des reins.
      </p>
    </div>

    {/* ===== ACTION ===== */}
    <div className="col-md-3 text-center text-md-end">
      <a
        href="/contact"
        rel="nofollow"
        className="btn btn-warning fw-bold px-4 py-2"
        style={{
          borderRadius: 10,
          boxShadow: "0 6px 15px rgba(0,0,0,0.25)",
        }}
      >
        RÉSERVER
      </a>
      <div className="small text-light mt-1">
        N’attendez pas
      </div>
    </div>

  </div>
</div>


  {/* ================= STYLE ================= */}
  <style>{`
    @media (max-width: 768px) {
      section h3 {
        font-size: 1.3rem;
      }
    }
  `}</style>
</section>
      <main className="container">
        {/* ================= ABOUT / TRUST SECTION ================= */}
<section
  id="about"
  className="py-5"
  style={{ background: "#f8fbff" }}
>
<div className="container">

  {/* Heading */}
  <div className="mb-4">
    <h2 className="fw-bold text-start">
      Un hôpital de confiance pour la guérison naturelle des reins
    </h2>
  </div>

  <div className="row align-items-center g-4">

    {/* ================= LEFT CONTENT ================= */}
    <div className="col-md-7">
      <p>
        Karma Ayurveda USA est un hôpital spécialisé dans les soins naturels des
        reins, combinant l’Ayurveda et la science moderne sous la direction de{" "}
        <a
          href="https://www.karmaayurvedausa.com/doctor"
          target="_blank"
          rel="noopener noreferrer"
        >
          Dr Puneet Dhawan
        </a>.
      </p>

      <p>
        Forts de plus de <strong>84 ans d’expertise</strong>, nous traitons les
        maladies rénales grâce à des thérapies naturelles éprouvées.
      </p>

      <p>
        Certifié <strong>NABH &amp; FDA</strong>, notre hôpital garantit des soins
        sûrs, transparents et centrés sur le patient.
      </p>

      {/* CTA */}
      <a
        href="#contact"
        className="btn btn-lg mt-3"
        style={{
          backgroundColor: "#ff8a00",
          borderColor: "#ff8a00",
          color: "#fff",
        }}
      >
        Demander un avis
      </a>
    </div>

    {/* ================= RIGHT IMAGE ================= */}
    <div className="col-md-5 text-center">
      <img
        loading="lazy"
        src="https://www.karmaayurvedausa.com/assets/serve_static.php?file=image/about-3-2.gif"
        alt="Karma Ayurveda USA - Certifié FDA"
        className="img-fluid"
        style={{
          maxWidth: "420px",
          filter: "drop-shadow(0 15px 25px rgba(0,0,0,0.15))",
        }}
      />
    </div>

  </div>
</div>


  {/* Small style tweaks */}
  <style>{`
    #about p {
      font-size: 1rem;
      line-height: 1.8;
      color: #333;
    }
    #about a {
      color: #0d6efd;
      font-weight: 500;
      text-decoration: none;
    }
    #about a:hover {
      text-decoration: underline;
    }
  `}</style>
</section>



      <DiseasesSection diseases={diseases} />

{/* ================= ABOUT US SECTION ================= */}
<section className="py-5" style={{ background: "#ffffff" }}>
  <div className="container">

    <div className="row align-items-center g-5">

      {/* ===== Left Image ===== */}
      <div className="col-lg-4 text-center">
        <img
          src="/images/Dr.puneet-dhawan.jpg"
          alt="Experts en soins rénaux"
          className="img-fluid rounded-4 shadow"
          style={{ maxHeight: "420px" }}
        />
      </div>

      {/* ===== Right Content ===== */}
      <div className="col-lg-8">
        <span className="badge bg-primary mb-3 px-3 py-2">
          À propos de nous
        </span>

        <h2 className="fw-bold mb-3">
          Un accompagnement fiable pour une meilleure santé des reins
        </h2>

        <p className="text-muted mb-3">
          Nous nous engageons à fournir des informations claires, fiables et
          faciles à comprendre sur la santé rénale, afin d’aider les patients
          et leurs proches à mieux comprendre les maladies des reins.
        </p>

        <p className="text-muted mb-4">
          Grâce à notre expérience en sensibilisation à la santé rénale, nous
          rendons les informations médicales accessibles au quotidien, pour
          vous permettre de prendre des décisions éclairées en toute confiance.
        </p>

        {/* ===== Highlights ===== */}
        <div className="row g-3 mb-4">
          <div className="col-6 d-flex align-items-center">
            <span className="me-2 text-primary fs-4">✔</span>
            <span>Contenu validé par des médecins</span>
          </div>

          <div className="col-6 d-flex align-items-center">
            <span className="me-2 text-primary fs-4">✔</span>
            <span>Langage simple et compréhensible</span>
          </div>

          <div className="col-6 d-flex align-items-center">
            <span className="me-2 text-primary fs-4">✔</span>
            <span>Conseils sur l’alimentation et le mode de vie</span>
          </div>

          <div className="col-6 d-flex align-items-center">
            <span className="me-2 text-primary fs-4">✔</span>
            <span>Réseau de cliniques de confiance</span>
          </div>
        </div>

        {/* ===== CTA ===== */}
        <div className="d-flex gap-3">
          <Link href="/about" className="btn btn-primary btn-lg">
            En savoir plus
          </Link>

          <Link href="/contact" className="btn btn-outline-primary btn-lg">
            Nous contacter
          </Link>
        </div>
      </div>

    </div>
  </div>
</section>


   <TestimonialSlider />

{/* ================= WHY CHOOSE US ================= */}
<section
  id="why-us"
  className="py-5"
  style={{ background: "#ffffff" }}
>
  <div className="container">
    <div className="row align-items-center g-4">

    
{/* ================= LEFT STAMP (ROTATING) ================= */}
<div className="col-md-4">
  <div
    className="d-flex align-items-center justify-content-center h-100 p-4"
    style={{
      background: "#003b72",
      borderRadius: "14px",
      boxShadow: "0 10px 30px rgba(0,0,0,0.15)",
    }}
  >
    <div className="stamp-wrapper position-relative">
      
      {/* 🔄 ROTATING IMAGE */}
      <img
        src="https://www.karmaayurvedausa.com/assets/image/1.png"
        alt="Trusted by US Patients"
        className="stamp-rotate"
      />

      {/* 🎯 CENTER IMAGE */}
      <img
        src="/images/france.png"
        alt="Certification Badge"
        className="stamp-center"
      />

    </div>
  </div>
</div>


      {/* ================= RIGHT CONTENT ================= */}
      <div className="col-md-8">
      <h2 className="fw-bold mb-3">
  Pourquoi choisir Karma Ayurveda ?
</h2>

<p className="text-muted mb-4">
  Choisir l’Ayurveda est une décision personnelle, basée sur vos besoins et
  votre approche du bien-être. Cette médecine traditionnelle, pratiquée depuis
  des milliers d’années, aide de nombreuses personnes à mieux comprendre leur
  corps et à prendre soin de leur santé de manière naturelle.
</p>


        {/* ================= FEATURES ================= */}
<div className="row g-3">

  <div className="col-6 col-md-3">
    <div className="card text-center h-100 shadow-sm border-0">
      <div className="card-body">
        <img
          src="https://www.karmaayurvedausa.com/assets/image/why2.webp"
          alt="100% authentique et naturel"
          className="img-fluid mb-2"
          style={{ maxHeight: 80 }}
        />
        <p className="small fw-semibold mb-0">
          100 % naturel <br /> et authentique
        </p>
      </div>
    </div>
  </div>

  <div className="col-6 col-md-3">
    <div className="card text-center h-100 shadow-sm border-0">
      <div className="card-body">
        <img
          src="https://www.karmaayurvedausa.com/assets/image/why1.webp"
          alt="Naturel et non invasif"
          className="img-fluid mb-2"
          style={{ maxHeight: 80 }}
        />
        <p className="small fw-semibold mb-0">
          Naturel & <br /> non invasif
        </p>
      </div>
    </div>
  </div>

  <div className="col-6 col-md-3">
    <div className="card text-center h-100 shadow-sm border-0">
      <div className="card-body">
        <img
          src="https://www.karmaayurvedausa.com/assets/image/why3.webp"
          alt="Tradition éprouvée"
          className="img-fluid mb-2"
          style={{ maxHeight: 80 }}
        />
        <p className="small fw-semibold mb-0">
          Tradition <br /> éprouvée
        </p>
      </div>
    </div>
  </div>

  <div className="col-6 col-md-3">
    <div className="card text-center h-100 shadow-sm border-0">
      <div className="card-body">
        <img
          src="https://www.karmaayurvedausa.com/assets/image/NABH-Logo.webp"
          alt="Certifié NABH"
          className="img-fluid mb-2"
          style={{ maxHeight: 80 }}
        />
        <p className="small fw-semibold mb-0">
          Certifié NABH <br />
          <span className="text-muted">
            2023 – 2026
          </span>
        </p>
      </div>
    </div>
  </div>

</div>

      </div>

    </div>
  </div>

  {/* ================= STYLE ================= */}
  <style>{`
    #why-us h2 {
      color: #003b72;
    }
    #why-us p {
      line-height: 1.7;
    }
    #why-us .card:hover {
      transform: translateY(-4px);
      transition: 0.3s;
    }
      .stamp-wrapper {
  width: 240px;
  height: 240px;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
}

.stamp-rotate {
  width: 100%;
  height: 100%;
  animation: spin 18s linear infinite;
}

.stamp-center {
  position: absolute;
  width: 210px;
  height: auto;
}

@keyframes spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}
  `}</style>
</section>


        {/* CLINICS */}
        {/* <section className="mb-5">
          <h3 className="mb-2">Our Clinics</h3>
          <p className="text-muted mb-3">Visit trusted clinics with expert care.</p>

          <div className="row g-3">
            {clinics.length === 0 ? (
              <div className="col-12 text-center text-muted">No clinics added yet.</div>
            ) : (
              clinics.map((c) => (
                <ClinicCard key={c.slug} slug={c.slug} name={c.name} icon={c.icon} location={c.location || ""} />
              ))
            )}
          </div>
        </section> */}


 {/*============= Recent Blogs ================== */}
  <RecentBlogs />
{/* ================= CONTACT CTA ================= */}
<section className="mb-5">
  <div
    className="card border-0 shadow-lg p-5 text-white position-relative overflow-hidden"
    style={{
      background:
        "linear-gradient(135deg, #0d6efd 0%, #084298 100%)",
      borderRadius: "20px",
    }}
  >
    <div className="row align-items-center g-4">

      {/* ===== Left Content ===== */}
      <div className="col-lg-8 text-lg-start text-center">
        <h2 className="fw-bold mb-2">
          Besoin d’aide ? Parlez à des experts rénaux
        </h2>

        <p className="fs-5 opacity-90 mb-4">
          Conseils personnalisés selon votre situation — consultation gratuite.
        </p>

        {/* Trust Points */}
        <div className="d-flex flex-wrap gap-3 mb-4 justify-content-lg-start justify-content-center">
          <span className="badge bg-light text-primary px-3 py-2">
            ✔ Suivi médical
          </span>
          <span className="badge bg-light text-primary px-3 py-2">
            ✔ Gratuit
          </span>
          <span className="badge bg-light text-primary px-3 py-2">
            ✔ Confidentiel
          </span>
        </div>

        {/* CTA Buttons */}
        <div className="d-flex gap-3 flex-wrap justify-content-lg-start justify-content-center">
          <Link
            href="/contact"
            className="btn btn-light btn-lg fw-semibold"
          >
            Consultation gratuite
          </Link>

          <a
            href="tel:+919999999999"
            className="btn btn-outline-light btn-lg"
          >
            Appeler
          </a>
        </div>
      </div>

      {/* ===== Right Visual ===== */}
      <div className="col-lg-4 text-center d-none d-lg-block">
        <img
          src="/images/kidney-hero2.png"
          alt="Consultation médicale"
          className="img-fluid"
          style={{
            maxHeight: "220px",
            filter: "drop-shadow(0 15px 30px rgba(0,0,0,0.35))",
          }}
        />
      </div>
    </div>

    {/* Decorative Glow */}
    <div
      style={{
        position: "absolute",
        top: "-60px",
        right: "-60px",
        width: "180px",
        height: "180px",
        background: "rgba(255,255,255,0.15)",
        borderRadius: "50%",
      }}
    ></div>
  </div>
</section>


        {/* TIPS */}
        <section className="mb-5">
          <div className="card p-4 text-center">
            <h4 className="mb-2">Patient Testimonial Videos</h4>
            <p className="text-muted mb-0">Eat clean, sleep well, stay hydrated—small changes improve long-term health.</p>
          </div>


          <YouTubeGrid />
        </section>

     <HomeFAQs />

      {/* ================= RESPONSIVE FIXES ================= */}
      <style>{`
        /* Ensure images scale nicely */
        main img { max-width: 100%; height: auto; }

        /* HERO: stack buttons and content better on small screens */
        .hero .d-flex {
          gap: 0.5rem;
        }
        @media (max-width: 992px) {
          .hero-left, .hero-right { text-align: center !important; }
          .hero .d-flex { flex-direction: column; align-items: center; }
          .hero .d-flex .btn { width: 100%; max-width: 320px; }
          .hero-img { max-height: 240px !important; }
          .hero-form { max-width: none !important; width: 100%; padding: 1rem; margin: 0 auto; }
        }

        @media (max-width: 576px) {
          .hero h1.display-5 { font-size: 1.6rem; }
          .hero h2 { font-size: 1.05rem; }
          .stamp-wrapper { width: 140px; height: 140px; }
          .stamp-center { width: 210px; }
          .stamp-rotate { width: 100%; height: 100%; }
          #about p { font-size: .95rem; line-height: 1.6; }
          #why-us .card-body img { max-height: 60px; }
          #about img { max-width: 100%; max-height: 260px; margin: 0 auto; }
          .container { padding-left: 15px; padding-right: 15px; }
          .btn-lg { padding: .5rem 1rem; font-size: 1rem; }
          .flag-img { width: 70px !important; }

          /* Stack the phone + country input nicely in the hero form on small screens */
          .hero-form .d-flex { flex-direction: column; align-items: stretch; }
          .hero-form .d-flex > div { width: 100% !important; margin-right: 0 !important; margin-bottom: 0.5rem; }
          .hero-form .form-control { width: 100%; }
        }
      `}</style>

      </main>

    </>
  );
}
