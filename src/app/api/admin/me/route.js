// src/app/api/admin/me/route.js
import { verifyToken, COOKIE_NAME } from "@/lib/auth";

export async function GET(req) {
  try {
    const token = req.headers.get("cookie")
      ?.split(";")
      .map(s => s.trim())
      .find(s => s.startsWith(COOKIE_NAME + "="))
      ?.split("=")[1];

    if (!token) {
      return new Response(JSON.stringify({ authenticated: false }), { status: 401 });
    }

    const payload = verifyToken(token);
    if (!payload) {
      return new Response(JSON.stringify({ authenticated: false }), { status: 401 });
    }

    return new Response(JSON.stringify({ authenticated: true, user: payload }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (err) {
    return new Response(JSON.stringify({ authenticated: false }), { status: 500 });
  }
}
