export const dynamic = "force-dynamic";

import Link from "next/link";
import pool from "@/lib/db";

import YouTubeGrid from "@/components/YouTubeGrid";
import HomeFAQs from "@/components/HomeFAQs";
import RecentBlogs from "@/components/RecentBlogs";
import ContactFormWrapper from "@/components/ContactFormWrapper";
import DiseasesSection from "@/components/DiseasesSection";
import TestimonialSlider from "@/components/TestimonialSlider";

export const metadata = {
  title: "Home — My Health Site",
  description: "Trusted health information, clinics, guides, and healthy lifestyle tips.",
};

export default async function Home() {
  let diseases = [];
  let clinics = [];
  let homeSections = {};
  let homeFeatures = {};

  try {
    const conn = await pool.getConnection();

    // Fetch diseases & clinics
    const [diseasesRows] = await conn.execute(
      "SELECT d.slug, d.title, d.icon, COALESCE(c.name, 'Other') AS category_name, COALESCE(c.slug, '') AS category_slug FROM diseases d LEFT JOIN disease_categories c ON d.category_id = c.id WHERE d.status='active' ORDER BY d.id ASC"
    );

    const [clinicsRows] = await conn.execute(
      "SELECT slug, name, icon, location FROM clinics WHERE status='active' LIMIT 12"
    );

    // Fetch home sections
    const [sectionsRows] = await conn.execute(
      "SELECT * FROM home_sections WHERE is_active = TRUE ORDER BY display_order ASC"
    );

    // Fetch home features
    const [featuresRows] = await conn.execute(
      "SELECT * FROM home_features WHERE is_active = TRUE ORDER BY section_key, display_order ASC"
    );

    conn.release();

    diseases = diseasesRows;
    clinics = clinicsRows;

    // Convert sections to object for easy access
    homeSections = sectionsRows.reduce((acc, section) => {
      acc[section.section_key] = {
        ...section,
        extra_data: section.extra_data ? JSON.parse(section.extra_data) : {}
      };
      return acc;
    }, {});

    // Group features by section_key
    homeFeatures = featuresRows.reduce((acc, feature) => {
      if (!acc[feature.section_key]) acc[feature.section_key] = [];
      acc[feature.section_key].push(feature);
      return acc;
    }, {});

  } catch (err) {
    console.warn("Home: DB unavailable:", err?.message || err);
  }

  // Get section data with fallbacks
  const getSection = (key, fallback = {}) => homeSections[key] || fallback;
  const getFeatures = (key) => homeFeatures[key] || [];

  const hero = getSection('hero', {
    title: 'Votre guide de confiance pour la santé des reins',
    content: 'Comprenez les maladies rénales, obtenez des conseils d\'experts et connectez-vous avec des cliniques fiables.',
    image_url: '/images/kidney-hero2.png',
    extra_data: {
      subtitle: 'Des informations simples, fiables et validées par des médecins',
      description: 'Découvrez les symptômes, les causes, les conseils alimentaires et les options de traitements naturels expliqués de manière claire et compréhensible.',
      background: 'linear-gradient(135deg, rgba(203, 227, 255, 1) 0%, rgb(131 193 255) 100%)'
    }
  });

  const consultationBanner = getSection('consultation_banner', {
    title: 'Consultation gratuite',
    content: 'Parlez à un spécialiste des reins.',
    image_url: 'https://upload.wikimedia.org/wikipedia/en/c/c3/Flag_of_France.svg',
    cta_text: 'RÉSERVER',
    cta_link: '/contact',
    extra_data: {
      background: 'linear-gradient(90deg, #436f96, #02203a)',
      badge_text: 'N\'attendez pas'
    }
  });

  const trustSection = getSection('trust_section', {
    title: 'Un hôpital de confiance pour la guérison naturelle des reins',
    content: 'Karma Ayurveda USA est un hôpital spécialisé dans les soins naturels des reins.',
    image_url: 'https://www.karmaayurvedausa.com/assets/serve_static.php?file=image/about-3-2.gif',
    cta_text: 'Demander un avis',
    cta_link: '#contact',
    extra_data: { background: '#f8fbff' }
  });

  const aboutUs = getSection('about_us', {
    title: 'Un accompagnement fiable pour une meilleure santé des reins',
    content: 'Nous nous engageons à fournir des informations claires, fiables et faciles à comprendre sur la santé rénale.',
    image_url: '/images/Dr.puneet-dhawan.jpg',
    cta_text: 'En savoir plus',
    cta_link: '/about',
    cta_text_2: 'Nous contacter',
    cta_link_2: '/contact',
    extra_data: { badge: 'À propos de nous' }
  });

  const aboutFeatures = getFeatures('about_us').length > 0 ? getFeatures('about_us') : [
    { title: 'Contenu validé par des médecins' },
    { title: 'Langage simple et compréhensible' },
    { title: 'Conseils sur l\'alimentation et le mode de vie' },
    { title: 'Réseau de cliniques de confiance' }
  ];

  const whyChooseUs = getSection('why_choose_us', {
    title: 'Pourquoi choisir Karma Ayurveda ?',
    content: 'Choisir l\'Ayurveda est une décision personnelle, basée sur vos besoins et votre approche du bien-être.',
    image_url: 'https://www.karmaayurvedausa.com/assets/image/1.png',
    extra_data: {
      stamp_image: '/images/france.png',
      background_color: '#003b72'
    }
  });

  const whyFeatures = getFeatures('why_choose_us').length > 0 ? getFeatures('why_choose_us') : [
    { title: '100 % naturel et authentique', icon_url: 'https://www.karmaayurvedausa.com/assets/image/why2.webp' },
    { title: 'Naturel & non invasif', icon_url: 'https://www.karmaayurvedausa.com/assets/image/why1.webp' },
    { title: 'Tradition éprouvée', icon_url: 'https://www.karmaayurvedausa.com/assets/image/why3.webp' },
    { title: 'Certifié NABH', description: '2023 – 2026', icon_url: 'https://www.karmaayurvedausa.com/assets/image/NABH-Logo.webp' }
  ];

  const contactCta = getSection('contact_cta', {
    title: 'Besoin d\'aide ? Parlez à des experts rénaux',
    content: 'Conseils personnalisés selon votre situation — consultation gratuite.',
    image_url: '/images/kidney-hero2.png',
    cta_text: 'Consultation gratuite',
    cta_link: '/contact',
    cta_text_2: 'Appeler',
    cta_link_2: 'tel:+919999999999',
    extra_data: {
      background: 'linear-gradient(135deg, #0d6efd 0%, #084298 100%)',
      badges: ['✔ Suivi médical', '✔ Gratuit', '✔ Confidentiel']
    }
  });

  return (
    <>
      {/* ================= HERO SECTION ================= */}
      <section
        className="py-5 position-relative overflow-hidden hero"
        style={{
          background: hero.extra_data.background || "linear-gradient(135deg, rgba(203, 227, 255, 1) 0%, rgb(131 193 255) 100%)",
        }}
      >
        <div className="container">
          <div className="text-center mb-5">
            <h1 className="display-5 fw-bold text-primary">
              {hero.title}
            </h1>
            <p className="lead text-muted mt-2">
              {hero.content}
            </p>
          </div>

          <div className="row align-items-center g-4">
            <div className="col-lg-4 text-lg-start text-center hero-left">
              <h2 className="fw-bold mb-3">
                {hero.extra_data.subtitle}
              </h2>
              <p className="text-muted mb-4">
                {hero.extra_data.description}
              </p>

              <div className="d-flex gap-2 justify-content-lg-start justify-content-center">
                {hero.cta_text && hero.cta_link && (
                  <Link href={hero.cta_link} className="btn btn-outline-primary btn-lg">
                    {hero.cta_text}
                  </Link>
                )}

                {hero.cta_text_2 && hero.cta_link_2 && (
                  <Link href={hero.cta_link_2} className="btn btn-primary btn-lg">
                    {hero.cta_text_2}
                  </Link>
                )}
              </div>
            </div>

            <div className="col-lg-4 text-center">
              <img
                src={hero.image_url}
                alt={hero.image_alt || "Hero image"}
                className="img-fluid hero-img"
                style={{
                  maxHeight: "360px",
                  filter: "drop-shadow(0 20px 30px rgba(0,0,0,0.15))",
                }}
              />
            </div>

            <div className="col-lg-4">
              <div className="bg-white p-3 rounded hero-form">
                <ContactFormWrapper />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ================= CONSULTATION BANNER ================= */}
      <section
        className="py-4"
        style={{
          background: consultationBanner.extra_data.background || "linear-gradient(90deg, #436f96, #02203a)",
        }}
      >
        <div className="container">
          <div className="row align-items-center g-3 text-center text-md-start">
            <div className="col-md-2 d-flex justify-content-center justify-content-md-start">
              <img
                src={consultationBanner.image_url}
                alt={consultationBanner.image_alt || "Flag"}
                loading="lazy"
                className="flag-img"
                style={{
                  width: 90,
                  borderRadius: 6,
                  boxShadow: "0 6px 15px rgba(0,0,0,0.25)",
                }}
              />
            </div>

            <div className="col-md-7">
              <h3 className="mb-1 text-white fw-bold">
                {consultationBanner.title}
              </h3>
              <p className="mb-0 text-light">
                {consultationBanner.content}
              </p>
            </div>

            <div className="col-md-3 text-center text-md-end">
              {consultationBanner.cta_text && consultationBanner.cta_link && (
                <a
                  href={consultationBanner.cta_link}
                  rel="nofollow"
                  className="btn btn-warning fw-bold px-4 py-2"
                  style={{
                    borderRadius: 10,
                    boxShadow: "0 6px 15px rgba(0,0,0,0.25)",
                  }}
                >
                  {consultationBanner.cta_text}
                </a>
              )}
              {consultationBanner.extra_data.badge_text && (
                <div className="small text-light mt-1">
                  {consultationBanner.extra_data.badge_text}
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      <main className="container">
        {/* ================= TRUST SECTION ================= */}
        <section
          id="about"
          className="py-5"
          style={{ background: trustSection.extra_data.background || "#f8fbff" }}
        >
          <div className="container">
            <div className="mb-4">
              <h2 className="fw-bold text-start">
                {trustSection.title}
              </h2>
            </div>

            <div className="row align-items-center g-4">
              <div className="col-md-7">
                <div dangerouslySetInnerHTML={{ __html: trustSection.content.replace(/\n/g, '</p><p>') }} />

                {trustSection.cta_text && trustSection.cta_link && (
                  <a
                    href={trustSection.cta_link}
                    className="btn btn-lg mt-3"
                    style={{
                      backgroundColor: "#ff8a00",
                      borderColor: "#ff8a00",
                      color: "#fff",
                    }}
                  >
                    {trustSection.cta_text}
                  </a>
                )}
              </div>

              <div className="col-md-5 text-center">
                <img
                  loading="lazy"
                  src={trustSection.image_url}
                  alt={trustSection.image_alt || "Trust section image"}
                  className="img-fluid"
                  style={{
                    maxWidth: "420px",
                    filter: "drop-shadow(0 15px 25px rgba(0,0,0,0.15))",
                  }}
                />
              </div>
            </div>
          </div>
        </section>

        <DiseasesSection diseases={diseases} />

        {/* ================= ABOUT US SECTION ================= */}
        <section className="py-5" style={{ background: "#ffffff" }}>
          <div className="container">
            <div className="row align-items-center g-5">
              <div className="col-lg-4 text-center">
                <img
                  src={aboutUs.image_url}
                  alt={aboutUs.image_alt || "About us image"}
                  className="img-fluid rounded-4 shadow"
                  style={{ maxHeight: "420px" }}
                />
              </div>

              <div className="col-lg-8">
                {aboutUs.extra_data.badge && (
                  <span className="badge bg-primary mb-3 px-3 py-2">
                    {aboutUs.extra_data.badge}
                  </span>
                )}

                <h2 className="fw-bold mb-3">
                  {aboutUs.title}
                </h2>

                <div dangerouslySetInnerHTML={{ __html: aboutUs.content.replace(/\n/g, '</p><p>') }} />

                {/* Features */}
                <div className="row g-3 mb-4">
                  {aboutFeatures.map((feature, idx) => (
                    <div key={idx} className="col-6 d-flex align-items-center">
                      <span className="me-2 text-primary fs-4">✔</span>
                      <span>{feature.title}</span>
                    </div>
                  ))}
                </div>

                <div className="d-flex gap-3">
                  {aboutUs.cta_text && aboutUs.cta_link && (
                    <Link href={aboutUs.cta_link} className="btn btn-primary btn-lg">
                      {aboutUs.cta_text}
                    </Link>
                  )}

                  {aboutUs.cta_text_2 && aboutUs.cta_link_2 && (
                    <Link href={aboutUs.cta_link_2} className="btn btn-outline-primary btn-lg">
                      {aboutUs.cta_text_2}
                    </Link>
                  )}
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
              <div className="col-md-4">
                <div
                  className="d-flex align-items-center justify-content-center h-100 p-4"
                  style={{
                    background: whyChooseUs.extra_data.background_color || "#003b72",
                    borderRadius: "14px",
                    boxShadow: "0 10px 30px rgba(0,0,0,0.15)",
                  }}
                >
                  <div className="stamp-wrapper position-relative">
                    <img
                      src={whyChooseUs.image_url}
                      alt={whyChooseUs.image_alt || "Stamp image"}
                      className="stamp-rotate"
                    />

                    {whyChooseUs.extra_data.stamp_image && (
                      <img
                        src={whyChooseUs.extra_data.stamp_image}
                        alt="Certification Badge"
                        className="stamp-center"
                      />
                    )}
                  </div>
                </div>
              </div>

              <div className="col-md-8">
                <h2 className="fw-bold mb-3">
                  {whyChooseUs.title}
                </h2>

                <p className="text-muted mb-4">
                  {whyChooseUs.content}
                </p>

                <div className="row g-3">
                  {whyFeatures.map((feature, idx) => (
                    <div key={idx} className="col-6 col-md-3">
                      <div className="card text-center h-100 shadow-sm border-0">
                        <div className="card-body">
                          {feature.icon_url && (
                            <img
                              src={feature.icon_url}
                              alt={feature.icon_alt || feature.title}
                              className="img-fluid mb-2"
                              style={{ maxHeight: 80 }}
                            />
                          )}
                          <p className="small fw-semibold mb-0">
                            {feature.title}
                            {feature.description && (
                              <>
                                <br />
                                <span className="text-muted">
                                  {feature.description}
                                </span>
                              </>
                            )}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <style>{`
            #why-us h2 { color: #003b72; }
            #why-us p { line-height: 1.7; }
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
              from { transform: rotate(0deg); }
              to { transform: rotate(360deg); }
            }
          `}</style>
        </section>

        <RecentBlogs />

        {/* ================= CONTACT CTA ================= */}
        <section className="mb-5">
          <div
            className="card border-0 shadow-lg p-5 text-white position-relative overflow-hidden"
            style={{
              background: contactCta.extra_data.background || "linear-gradient(135deg, #0d6efd 0%, #084298 100%)",
              borderRadius: "20px",
            }}
          >
            <div className="row align-items-center g-4">
              <div className="col-lg-8 text-lg-start text-center">
                <h2 className="fw-bold mb-2">
                  {contactCta.title}
                </h2>

                <p className="fs-5 opacity-90 mb-4">
                  {contactCta.content}
                </p>

                {contactCta.extra_data.badges && (
                  <div className="d-flex flex-wrap gap-3 mb-4 justify-content-lg-start justify-content-center">
                    {contactCta.extra_data.badges.map((badge, idx) => (
                      <span key={idx} className="badge bg-light text-primary px-3 py-2">
                        {badge}
                      </span>
                    ))}
                  </div>
                )}

                <div className="d-flex gap-3 flex-wrap justify-content-lg-start justify-content-center">
                  {contactCta.cta_text && contactCta.cta_link && (
                    <Link
                      href={contactCta.cta_link}
                      className="btn btn-light btn-lg fw-semibold"
                    >
                      {contactCta.cta_text}
                    </Link>
                  )}

                  {contactCta.cta_text_2 && contactCta.cta_link_2 && (
                    <a
                      href={contactCta.cta_link_2}
                      className="btn btn-outline-light btn-lg"
                    >
                      {contactCta.cta_text_2}
                    </a>
                  )}
                </div>
              </div>

              <div className="col-lg-4 text-center d-none d-lg-block">
                <img
                  src={contactCta.image_url}
                  alt={contactCta.image_alt || "Contact CTA image"}
                  className="img-fluid"
                  style={{
                    maxHeight: "220px",
                    filter: "drop-shadow(0 15px 30px rgba(0,0,0,0.35))",
                  }}
                />
              </div>
            </div>

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
          main img { max-width: 100%; height: auto; }
          .hero .d-flex { gap: 0.5rem; }
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
            .hero-form .d-flex { flex-direction: column; align-items: stretch; }
            .hero-form .d-flex > div { width: 100% !important; margin-right: 0 !important; margin-bottom: 0.5rem; }
            .hero-form .form-control { width: 100%; }
          }
        `}</style>
      </main>
    </>
  );
}
