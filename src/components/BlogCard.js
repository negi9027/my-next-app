"use client";

import Link from "next/link";
import PropTypes from "prop-types";

/**
 * BlogCard (Client)
 * Props:
 *  - slug, title, image, excerpt, dateText, readTime, tags
 */

export default function BlogCard({ slug, title, image, excerpt, dateText, readTime, tags = [] }) {
  return (
    <article className="blog-card">
      <Link href={`/blog/${slug}`} className="cover-link" aria-label={`Read ${title}`}>
        <div className="image-wrap">
          {image ? (
            // simple <img> so it works with your uploads folder
            <img src={image} alt={title} className="cover" />
          ) : (
            <div className="cover placeholder">📰</div>
          )}
        </div>
      </Link>

      <div className="card-body">
        <div className="meta-row">
          <small className="date">{dateText}</small>
          <small className="readtime">{readTime} min read</small>
        </div>

        <h3 className="title">
          <Link href={`/blog/${slug}`} className="text-link">{title}</Link>
        </h3>

        <p className="excerpt">{excerpt}</p>

        <div className="foot-row">
          <div className="tags">
            {tags.slice(0, 3).map((t, i) => (
              <span key={i} className="tag">{t}</span>
            ))}
          </div>

          <Link href={`/blog/${slug}`} className="btn-read">
            Read more →
          </Link>
        </div>
      </div>

      {/* styled-jsx (client-only, safe here) */}
      <style jsx>{`
        .blog-card {
          display: flex;
          flex-direction: column;
          height: 100%;
          border-radius: 12px;
          overflow: hidden;
          background: #fff;
          transition: transform .22s cubic-bezier(.2,.9,.2,1), box-shadow .22s;
          box-shadow: 0 6px 16px rgba(20,30,50,0.06);
          border: 1px solid rgba(20,30,50,0.04);
        }

        .blog-card:hover {
          transform: translateY(-8px);
          box-shadow: 0 26px 50px rgba(12, 45, 78, 0.12);
        }

        .image-wrap {
          width: 100%;
          height: 180px;
          background: linear-gradient(180deg, #f6f9ff, #ffffff);
          display: flex;
          align-items: center;
          justify-content: center;
          overflow: hidden;
        }

        .cover {
          width: 100%;
          height: 100%;
          object-fit: cover;
          display: block;
        }

        .placeholder {
          font-size: 3rem;
        }

        .card-body {
          padding: 18px;
          display: flex;
          flex-direction: column;
          gap: 12px;
          flex: 1 1 auto;
        }

        .meta-row {
          display: flex;
          justify-content: space-between;
          gap: 8px;
          align-items: center;
          color: #6b7280;
          font-size: 0.85rem;
        }

        .title {
          margin: 0;
          font-size: 1.05rem;
          line-height: 1.25;
        }

        .text-link {
          color: #0b57ff;
          text-decoration: none;
        }
        .text-link:hover { text-decoration: underline; }

        .excerpt {
          margin: 0;
          color: #475569;
          font-size: 0.95rem;
          line-height: 1.5;
          max-height: 4.5rem; /* clamp roughly 3 lines */
          overflow: hidden;
        }

        .foot-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 12px;
          margin-top: auto;
        }

        .tags { display:flex; gap:8px; flex-wrap:wrap; }
        .tag {
          background: rgba(11,87,255,0.08);
          color: #0b57ff;
          padding: 6px 8px;
          border-radius: 999px;
          font-size: 0.75rem;
        }

        .btn-read {
          background: linear-gradient(90deg,#0b57ff,#0066ff);
          color: #fff;
          padding: 8px 12px;
          border-radius: 8px;
          text-decoration: none;
          font-weight: 600;
          font-size: 0.9rem;
          transition: transform .12s, opacity .12s;
        }
        .btn-read:hover { transform: translateY(-2px); opacity: 0.98; }

        /* responsive tweaks */
        @media (max-width: 768px) {
          .image-wrap { height: 150px; }
          .card-body { padding: 14px; }
        }
      `}</style>
    </article>
  );
}

BlogCard.propTypes = {
  slug: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  image: PropTypes.string,
  excerpt: PropTypes.string,
  dateText: PropTypes.string,
  readTime: PropTypes.number,
  tags: PropTypes.array,
};
