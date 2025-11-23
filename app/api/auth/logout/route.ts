import { NextResponse } from "next/server";

export async function GET() {
  const res = NextResponse.json({ message: "Logged out" });
  res.cookies.set("token", "", { path: "/", maxAge: 0 });
  return res;
}
