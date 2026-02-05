"use client";

import { useState } from "react";

export default function YouTubeGridClient({ videos }) {
  const [playingId, setPlayingId] = useState(null);

  return (
    <div className="row">
      {videos.map((v) => (
        <div key={v.id} className="col-lg-4 col-md-6 col-sm-12 mb-3">
          <div className="ratio ratio-16x9 rounded overflow-hidden shadow-sm position-relative">

            {playingId === v.id ? (
              <iframe
                src={`https://www.youtube.com/embed/${v.youtube_id}?autoplay=1`}
                title={v.title}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="w-100 h-100"
              />
            ) : (
              <div
                onClick={() => setPlayingId(v.id)}
                role="button"
                className="position-absolute top-0 start-0 w-100 h-100"
                style={{
                  backgroundImage: `url(${v.custom_thumbnail || `https://img.youtube.com/vi/${v.youtube_id}/hqdefault.jpg`})`,
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                  cursor: "pointer",
                }}
              >
                {/* Dark overlay + play icon */}
                <div
                  className="w-100 h-100 d-flex align-items-center justify-content-center"
                  style={{ background: "rgba(0,0,0,0.35)" }}
                >
                  <svg width="70" height="70" viewBox="0 0 100 100">
                    <circle cx="50" cy="50" r="45" fill="rgba(0,0,0,0.6)" />
                    <polygon points="40,30 70,50 40,70" fill="#fff" />
                  </svg>
                </div>
              </div>
            )}

          </div>
        </div>
      ))}
    </div>
  );
}
