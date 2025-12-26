
"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import DiseaseCard from "@/components/DiseaseCard";
import DiseaseSearch from "@/components/DiseaseSearch";

export default function DiseasesSection({ diseases }) {
  const [query, setQuery] = useState("");

  // 🔹 Search filter (safe)
  const filteredDiseases = useMemo(() => {
    return diseases.filter(d =>
      (d.title || "").toLowerCase().includes(query.toLowerCase())
    );
  }, [query, diseases]);

  // 🔹 Group diseases by category
  const groupedDiseases = useMemo(() => {
    return filteredDiseases.reduce((acc, d) => {
      const catName = d.category_name || "Other";
      if (!acc[catName]) {
        acc[catName] = {
          slug: d.category_slug || "",
          items: [],
        };
      }
      acc[catName].items.push(d);
      return acc;
    }, {});
  }, [filteredDiseases]);

  // 🔹 Fixed category order (optional but recommended)
  const orderedCategories = ["Kidney", "Parkinson", "Liver", "Other"];

  // Render present categories: preferred order first, then any other categories
  const categoriesToRender = [
    ...orderedCategories.filter((c) => groupedDiseases[c]),
    ...Object.keys(groupedDiseases).filter((c) => !orderedCategories.includes(c)),
  ];

  return (
    <section className="mb-5">
      {/* Header */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h3 className="mb-0">Explore Diseases</h3>
          <small className="text-muted">
            Symptoms, causes & home treatments
          </small>
        </div>

        <DiseaseSearch onSearch={setQuery} />
      </div>

      {/* Category-wise rendering */}
      {Object.keys(groupedDiseases).length === 0 ? (
        <div className="text-center text-muted">
          No diseases found.
        </div>
      ) : (
        categoriesToRender.map((category) => {
          const group = groupedDiseases[category];
          if (!group) return null;

          return (
            <div key={category} className="mb-5">
              {/* ✅ Category Name */}
              <div className="d-flex justify-content-between align-items-center mb-3">
                <h4 className="mb-0 fw-bold">
                  {group.slug ? (
                    <Link
                      href={`/disease-category/${group.slug}`}
                      className="text-decoration-none"
                    >
                      {category}
                    </Link>
                  ) : (
                    category
                  )}
                </h4>

                {group.slug && (
                  <Link
                    href={`/disease-category/${group.slug}`}
                    className="small text-primary"
                  >
                    View all →
                  </Link>
                )}
              </div>

              {/* ✅ Diseases under this category */}
              <div className="row g-3">
                {group.items.map((d) => (
                  <DiseaseCard
                    key={d.slug}
                    slug={d.slug}
                    title={d.title}
                    icon={d.icon}
                  />
                ))}
              </div>
            </div>
          );
        })
      )}
    </section>
  );
}
