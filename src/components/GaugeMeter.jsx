"use client";
import { useEffect, useRef, useState } from "react";

export default function GaugeMeter({ value }) {
  const dialRef = useRef(null);
  const [displayValue, setDisplayValue] = useState(0);

  useEffect(() => {
    let start = 0;
    const duration = 1200; // ms
    const startTime = performance.now();

    const animate = (time) => {
      const progress = Math.min((time - startTime) / duration, 1);
      const current = Math.round(progress * value);

      setDisplayValue(current);

      const deg = (current * 177.5) / 100;
      if (dialRef.current) {
        dialRef.current.style.transform = `rotate(${deg}deg)`;
      }

      if (progress < 1) requestAnimationFrame(animate);
    };

    requestAnimationFrame(animate);
  }, [value]);

  return (
    <div className="gauge">
      <ul className="meter">
        <li className="low"></li>
        <li className="normal"></li>
        <li className="high"></li>
      </ul>

      <div className="dial">
        <div className="inner" ref={dialRef}>
          <div className="arrow"></div>
        </div>

        {/* CENTER CONTENT */}
        <div className="center-content">
          <img
            src="/images/kidney-hero2.png"
            alt="Kidney Icon"
            className="kidney-img"
          />
          <div className="percent">{displayValue}%</div>
        </div>
      </div>
    </div>
  );
}
