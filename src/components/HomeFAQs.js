import pool from "@/lib/db";
import FaqSchema from "./FaqSchema";

export default async function HomeFAQs() {
  try {
    const conn = await pool.getConnection();
    const [faqs] = await conn.execute(
      "SELECT * FROM faqs WHERE page='home' AND is_enabled=1 ORDER BY position ASC"
    );
    conn.release();

    if (!faqs.length) return null;

    return (
      <>
        <FaqSchema faqs={faqs} />

        <section className="container my-5">
          <h2 className="text-center mb-4">Frequently Asked Questions</h2>

          <div className="accordion" id="faqAccordion">
            {faqs.map((f, i) => (
              <div className="accordion-item" key={f.id}>
                <h3 className="accordion-header">
                  <button
                    className={`accordion-button ${i !== 0 ? "collapsed" : ""}`}
                    data-bs-toggle="collapse"
                    data-bs-target={`#faq${f.id}`}
                  >
                    {f.question}
                  </button>
                </h3>

                <div
                  id={`faq${f.id}`}
                  className={`accordion-collapse collapse ${i === 0 ? "show" : ""}`}
                  data-bs-parent="#faqAccordion"
                >
                  <div className="accordion-body">
                    {f.answer}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      </>
    );
  } catch (err) {
    console.warn("HomeFAQs: DB unavailable:", err?.message || err);
    return null;
  }

  return (
    <>
      <FaqSchema faqs={faqs} />

      <section className="container my-5">
        <h2 className="text-center mb-4">Frequently Asked Questions</h2>

        <div className="accordion" id="faqAccordion">
          {faqs.map((f, i) => (
            <div className="accordion-item" key={f.id}>
              <h3 className="accordion-header">
                <button
                  className={`accordion-button ${i !== 0 ? "collapsed" : ""}`}
                  data-bs-toggle="collapse"
                  data-bs-target={`#faq${f.id}`}
                >
                  {f.question}
                </button>
              </h3>

              <div
                id={`faq${f.id}`}
                className={`accordion-collapse collapse ${i === 0 ? "show" : ""}`}
                data-bs-parent="#faqAccordion"
              >
                <div className="accordion-body">
                  {f.answer}
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}
