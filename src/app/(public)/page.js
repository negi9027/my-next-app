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
        Your Trusted Kidney Health Guide
      </h1>
      <p className="lead text-muted mt-2">
        Understand kidney diseases, get expert guidance, and connect with trusted clinics.
      </p>
    </div>

    {/* ===== Main Layout ===== */}
    <div className="row align-items-center g-4">

      {/* ===== Left Content ===== */}
      <div className="col-lg-4 text-lg-start text-center hero-left">
        <h2 className="fw-bold mb-3">
          Simple, Reliable & Doctor-Backed Information
        </h2>
        <p className="text-muted mb-4">
          Learn symptoms, causes, diet tips and natural treatment options
          explained in an easy-to-understand way.
        </p>

        <div className="d-flex gap-2 justify-content-lg-start justify-content-center">
          <Link href="/about" className="btn btn-outline-primary btn-lg">
            Learn More
          </Link>

          {diseases && diseases[0] && (
            <Link
              href={`/disease/${diseases[0].slug}`}
              className="btn btn-primary btn-lg"
            >
              Disease Guide
            </Link>
          )}
        </div>
      </div>

      {/* ===== Center Kidney Image ===== */}
      <div className="col-lg-4 text-center">
        <img
          src="/images/kidney-hero2.png"
          alt="Human Kidney Illustration"
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
    background: "linear-gradient(90deg, #032b4f, #02203a)",
  }}
>
  <div className="container">
    <div className="row align-items-center g-3 text-center text-md-start">

      {/* ===== FLAG ===== */}
      <div className="col-md-2 d-flex justify-content-center justify-content-md-start">
        <img
          src="https://upload.wikimedia.org/wikipedia/en/a/a4/Flag_of_the_United_States.svg"
          alt="USA Flag"
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
          Book Your Free Consultation
        </h3>
        <p className="mb-0 text-light">
          Talk to our expert kidney specialists and get personalized guidance
          for your treatment plan.
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
          BOOK NOW
        </a>
        <div className="small text-light mt-1">
          Don’t Delay Your Kidney Treatment
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
        A Trusted Hospital for Safe &amp; Natural Kidney Healing
      </h2>
    </div>

    <div className="row align-items-center g-4">

      {/* ================= LEFT CONTENT ================= */}
      <div className="col-md-7">
        <p>
          Karma Ayurveda USA, from humble beginnings, has evolved into a
          multi-speciality healthcare institution with a unique natural kidney
          healing program that aims at healing and rejuvenating kidneys via
          natural methods. Currently led by{" "}
          <a
            href="https://www.karmaayurvedausa.com/doctor"
            target="_blank"
            rel="noopener noreferrer"
          >
            Dr Puneet Dhawan
          </a>
          , the hospital has achieved exceptionally high success rates through a
          holistic approach and its integration with modern sciences.
        </p>

        <p>
          With over <strong>84 years of expertise</strong>, we have redefined
          health dynamics. We specialise in treating a wide array of diseases
          through{" "}
          <a
            href="https://www.karmaayurvedausa.com/kidney-diseases"
            target="_blank"
            rel="noopener noreferrer"
          >
            unique natural therapies
          </a>{" "}
          like Panchakarma, Virechanam, Vamanan, and many more.
        </p>

        <p>
          As a specialised Ayurvedic kidney care hospital, we offer treatments
          for various lifestyle diseases and chronic disorders. Our team is
          well-versed in all the intricacies of{" "}
          <a
            href="https://www.karmaayurvedausa.com/blog/top-10-natural-ways-to-reduce-chronic-kidney-disease-naturally"
            target="_blank"
            rel="noopener noreferrer"
          >
            natural kidney healing
          </a>{" "}
          techniques.
        </p>

        <p>
          Certified by <strong>NABH &amp; FDA</strong>, Karma Ayurveda USA has
          in-house laboratories ensuring careful analysis of natural products.
          This transparent approach enhances patient trust and overall healing
          experience.
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
          Enquire Now
        </a>
      </div>

      {/* ================= RIGHT IMAGE ================= */}
      <div className="col-md-5 text-center">
        <img
          loading="lazy"
          src="https://www.karmaayurvedausa.com/assets/serve_static.php?file=image/about-3-2.gif"
          alt="Karma Ayurveda USA - FDA Approved"
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
          alt="Kidney Care Experts"
          className="img-fluid rounded-4 shadow"
          style={{ maxHeight: "420px" }}
        />
      </div>

      {/* ===== Right Content ===== */}
      <div className="col-lg-8">
        <span className="badge bg-primary mb-3 px-3 py-2">
          About Us
        </span>

        <h2 className="fw-bold mb-3">
          Trusted Kidney Care Guidance for Better Life
        </h2>

        <p className="text-muted mb-3">
          We are dedicated to providing reliable, easy-to-understand kidney
          health information for patients and families. Our goal is to help
          people understand kidney diseases, treatment options, diet plans,
          and lifestyle changes without confusion.
        </p>

        <p className="text-muted mb-4">
          With years of experience in kidney health awareness, we bridge the
          gap between medical knowledge and everyday understanding — so you
          can make informed decisions with confidence.
        </p>

        {/* ===== Highlights ===== */}
        <div className="row g-3 mb-4">
          <div className="col-6 d-flex align-items-center">
            <span className="me-2 text-primary fs-4">✔</span>
            <span>Doctor-Verified Content</span>
          </div>

          <div className="col-6 d-flex align-items-center">
            <span className="me-2 text-primary fs-4">✔</span>
            <span>Patient-Friendly Language</span>
          </div>

          <div className="col-6 d-flex align-items-center">
            <span className="me-2 text-primary fs-4">✔</span>
            <span>Diet & Lifestyle Guidance</span>
          </div>

          <div className="col-6 d-flex align-items-center">
            <span className="me-2 text-primary fs-4">✔</span>
            <span>Trusted Clinics Network</span>
          </div>
        </div>

        {/* ===== CTA ===== */}
        <div className="d-flex gap-3">
          <Link href="/about" className="btn btn-primary btn-lg">
            Know More
          </Link>

          <Link href="/contact" className="btn btn-outline-primary btn-lg">
            Contact Us
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
        src="https://www.karmaayurvedausa.com/assets/image/2.png"
        alt="Certification Badge"
        className="stamp-center"
      />

    </div>
  </div>
</div>


      {/* ================= RIGHT CONTENT ================= */}
      <div className="col-md-8">
        <h2 className="fw-bold mb-3">
          Why Choose Karma Ayurveda?
        </h2>

        <p className="text-muted mb-4">
          Choosing Ayurveda as a healthcare and wellness approach is a personal
          decision that depends on your individual needs, beliefs, and
          preferences. Ayurveda is an ancient system of medicine that originated
          in India over 5,000 years ago, and it continues to be practiced and
          valued by many individuals around the world.
        </p>

        {/* ================= FEATURES ================= */}
        <div className="row g-3">

          <div className="col-6 col-md-3">
            <div className="card text-center h-100 shadow-sm border-0">
              <div className="card-body">
                <img
                  src="https://www.karmaayurvedausa.com/assets/image/why2.webp"
                  alt="100% authentic and natural"
                  className="img-fluid mb-2"
                  style={{ maxHeight: 80 }}
                />
                <p className="small fw-semibold mb-0">
                  100% authentic <br /> and natural
                </p>
              </div>
            </div>
          </div>

          <div className="col-6 col-md-3">
            <div className="card text-center h-100 shadow-sm border-0">
              <div className="card-body">
                <img
                  src="https://www.karmaayurvedausa.com/assets/image/why1.webp"
                  alt="Natural and Non-Invasive"
                  className="img-fluid mb-2"
                  style={{ maxHeight: 80 }}
                />
                <p className="small fw-semibold mb-0">
                  Natural & <br /> Non-Invasive
                </p>
              </div>
            </div>
          </div>

          <div className="col-6 col-md-3">
            <div className="card text-center h-100 shadow-sm border-0">
              <div className="card-body">
                <img
                  src="https://www.karmaayurvedausa.com/assets/image/why3.webp"
                  alt="Time tested tradition"
                  className="img-fluid mb-2"
                  style={{ maxHeight: 80 }}
                />
                <p className="small fw-semibold mb-0">
                  Time-Tested <br /> Tradition
                </p>
              </div>
            </div>
          </div>

          <div className="col-6 col-md-3">
            <div className="card text-center h-100 shadow-sm border-0">
              <div className="card-body">
                <img
                  src="https://www.karmaayurvedausa.com/assets/image/NABH-Logo.webp"
                  alt="NABH Certified"
                  className="img-fluid mb-2"
                  style={{ maxHeight: 80 }}
                />
                <p className="small fw-semibold mb-0">
                  Certificate no-AH-2023-0186 <br />
                  <span className="text-muted">
                    Jan 2023 – Jan 2026
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
  width: 240px;
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
          Need Help? Talk to Kidney Health Experts
        </h2>

        <p className="fs-5 opacity-90 mb-4">
          Get personalized guidance based on your reports, symptoms
          and condition — absolutely free consultation.
        </p>

        {/* Trust Points */}
        <div className="d-flex flex-wrap gap-3 mb-4 justify-content-lg-start justify-content-center">
          <span className="badge bg-light text-primary px-3 py-2">
            ✔ Doctor Guided
          </span>
          <span className="badge bg-light text-primary px-3 py-2">
            ✔ No Cost Consultation
          </span>
          <span className="badge bg-light text-primary px-3 py-2">
            ✔ Confidential & Safe
          </span>
        </div>

        {/* CTA Buttons */}
        <div className="d-flex gap-3 flex-wrap justify-content-lg-start justify-content-center">
          <Link
            href="/contact"
            className="btn btn-light btn-lg fw-semibold"
          >
            Book Free Consultation
          </Link>

          <a
            href="tel:+919999999999"
            className="btn btn-outline-light btn-lg"
          >
            Call Now
          </a>
        </div>
      </div>

      {/* ===== Right Visual ===== */}
      <div className="col-lg-4 text-center d-none d-lg-block">
        <img
          src="/images/kidney-hero2.png"
          alt="Doctor Consultation"
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
          .stamp-center { width: 140px; }
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
