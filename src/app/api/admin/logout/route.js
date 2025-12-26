// src/app/api/admin/logout/route.js
import { serialize } from "cookie";
import { COOKIE_NAME } from "@/lib/auth"; // or use the same string if not exported

const cookieName = COOKIE_NAME || "admin_token";

export async function POST() {
  // clear cookie by sending Set-Cookie with maxAge=0
  const cookie = serialize(cookieName, "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 0,
  });

  return new Response(JSON.stringify({ success: true }), {
    status: 200,
    headers: {
      "Set-Cookie": cookie,
      "Content-Type": "application/json",
    },
  });
}
