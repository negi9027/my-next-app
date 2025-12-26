// src/app/api/admin/login/route.js
import pool from "@/lib/db";
import bcrypt from "bcrypt";
import { signToken, COOKIE_NAME } from "@/lib/auth";
import { serialize } from "cookie";

export async function POST(req) {
  try {
    const body = await req.json();
    const { username, password } = body;

    if (!username || !password) {
      return new Response(JSON.stringify({ error: "Missing credentials" }), { status: 400 });
    }

    const [rows] = await pool.execute("SELECT id, username, password, role FROM admins WHERE username = ? OR email = ? LIMIT 1", [username, username]);

    if (!rows.length) {
      return new Response(JSON.stringify({ error: "Invalid credentials" }), { status: 401 });
    }

    const admin = rows[0];
    const match = await bcrypt.compare(password, admin.password);

    if (!match) {
      return new Response(JSON.stringify({ error: "Invalid credentials" }), { status: 401 });
    }

    // create token (store minimal payload)
    const token = signToken({ id: admin.id, username: admin.username, role: admin.role });

    // set HttpOnly cookie
    const cookie = serialize(COOKIE_NAME, token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 8, // 8 hours
    });

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: {
        "Set-Cookie": cookie,
        "Content-Type": "application/json",
      },
    });
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), { status: 500 });
  }
}
