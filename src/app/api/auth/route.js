// src/app/api/auth/route.js
import { NextResponse } from "next/server";

export async function POST(request) {
  try {
    const { password } = await request.json();
    const correctPassword = process.env.DASHBOARD_PASSWORD || "kirkland2026";

    if (password === correctPassword) {
      const response = NextResponse.json({ success: true });
      
      // Set a secure HttpOnly cookie valid for 1 day
      response.cookies.set({
        name: "tkg_auth_token",
        value: "authenticated",
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        path: "/",
        maxAge: 60 * 60 * 24, // 24 hours
      });

      return response;
    }

    return NextResponse.json({ success: false, message: "Incorrect password" }, { status: 401 });
  } catch (err) {
    return NextResponse.json({ success: false, message: "Server error" }, { status: 500 });
  }
}