"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LogoutButton({ className }) {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleLogout = async () => {
    if (loading) return;
    setLoading(true);
    try {
      const res = await fetch("/api/admin/logout", { method: "POST" });
      // even if server returns non-OK, we should clear client state and redirect
      // because cookie is HttpOnly, we verify server cleared it by redirecting to login
      router.push("/admin/login");
    } catch (err) {
      console.error("Logout error:", err);
      router.push("/admin/login");
    } finally {
      setLoading(false);
    }
  };

  return (
    <button onClick={handleLogout} className={className || "btn btn-outline-secondary"} disabled={loading}>
      {loading ? "Logging out..." : "Logout"}
    </button>
  );
}
