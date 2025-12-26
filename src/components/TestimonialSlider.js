"use client";

import { useEffect, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination } from "swiper/modules";

import "swiper/css";
import "swiper/css/pagination";

export default function TestimonialSlider() {
  const [items, setItems] = useState([]);

  useEffect(() => {
    fetch("/api/admin/testimonials")
      .then((res) => res.json())
      .then((data) => {
        // only active testimonials
        setItems(data.filter((t) => t.status === "active"));
      });
  }, []);

  if (!items.length) return null;

  return (
    <section id="testimonials" className="py-5" style={{ background: "#f5faff" }}>
      <div className="container">

        {/* Heading */}
        <div className="mb-4">
          <h2 className="fw-bold">Patient Testimonials</h2>
          <p className="text-muted">
            Real stories from patients who trusted our Ayurvedic care
          </p>
        </div>

        <Swiper
          modules={[Autoplay, Pagination]}
          autoplay={{ delay: 4000, disableOnInteraction: false }}
          pagination={{ clickable: true }}
          spaceBetween={24}
          slidesPerView={1}
          breakpoints={{
            768: { slidesPerView: 2 },
            1200: { slidesPerView: 3 },
          }}
        >
          {items.map((t) => (
            <SwiperSlide key={t.id}>
              <div
                className="h-100 bg-white shadow-sm rounded-4 p-4 position-relative"
                style={{ minHeight: 320 }}
              >
                {/* Quote Icon */}
                <div
                  className="position-absolute top-0 end-0 fs-1 text-primary opacity-25"
                  style={{ margin: 16 }}
                >
                  ❝
                </div>

                {/* Image */}
                <div className="text-center mb-3">
                  <img
                    src={t.image || "/images/user.png"}
                    alt={t.name}
                    width="90"
                    height="90"
                    className="rounded-circle shadow"
                    style={{ objectFit: "cover" }}
                  />
                </div>

                {/* Message */}
                <p className="text-muted small mb-3">
                  “{t.message.slice(0, 220)}{t.message.length > 220 && "..."}”
                </p>

                {/* Name */}
                <h6 className="fw-bold mb-0">{t.name}</h6>
                <small className="text-primary">{t.disease}</small>

                {/* Rating */}
                <div className="mt-2 text-warning">
                  {"★".repeat(t.rating || 5)}
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>

      </div>
    </section>
  );
}
