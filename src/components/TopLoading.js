"use client";

import { useEffect, useState } from "react";
import Router from "next/router";

export default function TopLoading() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    let timeout;

    const handleStart = () => {
      // small delay before showing to avoid flicker on very fast navigations
      timeout = setTimeout(() => setVisible(true), 60);
    };

    const handleStop = () => {
      clearTimeout(timeout);
      // keep visible briefly so user can notice it
      setTimeout(() => setVisible(false), 250);
    };

    // Router events (works for pages router)
    if (Router?.events) {
      Router.events.on("routeChangeStart", handleStart);
      Router.events.on("routeChangeComplete", handleStop);
      Router.events.on("routeChangeError", handleStop);
    }

    // Click handler for internal links (app router compatibility)
    const onClick = (e) => {
      const a = e.target.closest && e.target.closest("a");
      if (!a) return;
      const href = a.getAttribute("href");
      if (!href) return;

      // ignore external links and anchors
      if (href.startsWith("http") && !href.startsWith(window.location.origin)) return;
      if (href.startsWith("#")) return;

      handleStart();
    };

    document.addEventListener("click", onClick, true);

    // History API patch to detect client-side navigations
    const patchHistory = () => {
      const originalPush = history.pushState;
      const originalReplace = history.replaceState;

      history.pushState = function (...args) {
        originalPush.apply(this, args);
        window.dispatchEvent(new Event("pushstate"));
        window.dispatchEvent(new Event("locationchange"));
      };

      history.replaceState = function (...args) {
        originalReplace.apply(this, args);
        window.dispatchEvent(new Event("replacestate"));
        window.dispatchEvent(new Event("locationchange"));
      };

      window.addEventListener("popstate", () => {
        window.dispatchEvent(new Event("locationchange"));
      });
    };

    patchHistory();

    // When a location change is detected, treat it as navigation complete
    const onLocationChange = () => handleStop();
    window.addEventListener("locationchange", onLocationChange);

    return () => {
      clearTimeout(timeout);
      if (Router?.events) {
        Router.events.off("routeChangeStart", handleStart);
        Router.events.off("routeChangeComplete", handleStop);
        Router.events.off("routeChangeError", handleStop);
      }
      document.removeEventListener("click", onClick, true);
      window.removeEventListener("locationchange", onLocationChange);
    };
  }, []);

  return (
    <div className={`top-loading ${visible ? "active" : "hidden"}`} aria-hidden={!visible}>
      <div className="bar" />
    </div>
  );
}
