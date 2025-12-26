"use client";

import React, { useMemo, useState } from "react";
import Link from "next/link";
import { Search, Stethoscope, ArrowRight, FileSearch } from "lucide-react";
import { motion } from "framer-motion";

export default function CategoryDiseasesClient({ initialItems = [], category = {} }) {
  const [q, setQ] = useState("");
  const [sort, setSort] = useState("title");

  const items = useMemo(() => {
    let res = initialItems.slice();
    if (q.trim()) {
      const qq = q.toLowerCase();
      res = res.filter(
        (r) => r.title.toLowerCase().includes(qq) || (r.intro || "").toLowerCase().includes(qq)
      );
    }
    if (sort === "title") res.sort((a, b) => a.title.localeCompare(b.title));
    return res;
  }, [initialItems, q, sort]);

  return (
    <>
      {/* Search + Controls */}
      <div className="d-flex align-items-center justify-content-between mb-3 gap-2 flex-wrap">
        <div className="input-group search-input" style={{ maxWidth: 520 }}>
          <span className="input-group-text bg-white border-end-0"><Search size={18} /></span>
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            className="form-control border-start-0"
            placeholder={`Search ${category.name || "diseases"}...`}
            aria-label="Search diseases"
          />
        </div>

        <div className="d-flex align-items-center gap-2">
          <div className="small text-muted me-2">{items.length} result{items.length !== 1 ? "s" : ""}</div>
          <select className="form-select form-select-sm w-auto" value={sort} onChange={(e) => setSort(e.target.value)}>
            <option value="title">Sort A-Z</option>
          </select>
        </div>
      </div>

      {/* Grid */}
      <div className="row g-4">
        {items.length === 0 ? (
          <div className="col-12 text-center py-5 text-muted">
            <FileSearch size={48} className="mb-3 text-muted" />
            <div className="h5">No diseases found</div>
            <div className="small">Try searching with a different term or check back later.</div>
          </div>
        ) : (
          items.map((d) => (
            <div className="col-md-4" key={d.id}>
              <motion.div
                whileHover={{ scale: 1.02 }}
                className="card shadow-sm h-100 disease-card"
              >
                <div className="card-body d-flex flex-column">
                  <div className="d-flex align-items-start gap-3 mb-2">
                    <div className="card-icon bg-light d-inline-flex align-items-center justify-content-center">
                      {d.icon ? (
                        <img src={`/uploads/diseases/${d.icon}`} alt={d.title} style={{ width: 28, height: 28, objectFit: "cover", borderRadius: 6 }} />
                      ) : (
                        <Stethoscope size={20} className="text-primary" />
                      )}
                    </div>
                    <div>
                      <h5 className="fw-semibold mb-1">{d.title}</h5>
                      {d.intro && <p className="small text-muted mb-0">{d.intro}</p>}
                    </div>
                  </div>

                  <div className="mt-auto d-flex align-items-center justify-content-between pt-3">
                    <Link href={`/disease/${d.slug}`} className="btn btn-sm btn-outline-primary">
                      Read More <ArrowRight size={14} className="ms-1" />
                    </Link>
                    <div className="small text-muted">{d.affected || "—"}</div>
                  </div>
                </div>
              </motion.div>
            </div>
          ))
        )}
      </div>
    </>
  );
}
