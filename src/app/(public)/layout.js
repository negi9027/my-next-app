// src/app/(public)/layout.js
import Topbar from "@/components/Topbar";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ScrollToTop from "@/components/ScrollToTop";

export default function PublicLayout({ children }) {
  return (
    <>
      {/* FIXED HEADER */}
      <div className="fixed-top shadow-sm bg-white">
        <Topbar />
        <Navbar />
      </div>

      {/* Client-side helper to ensure top scroll on route change */}
      <ScrollToTop />

      {/* PAGE CONTENT */}
      <main className="main-content">
        {children}
      </main>

      <Footer />
    </>
  );
}
