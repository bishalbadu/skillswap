import { cookies } from "next/headers";
import jwt from "jsonwebtoken";
import prisma from "@/lib/prisma";

export async function verifyAdmin() {
  try {
    const cookieStore = await cookies(); // ✅ FIX
    const token = cookieStore.get("admin_token")?.value;

    if (!token) return null;

    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET!
    ) as { id: string; role: string };

    if (decoded.role !== "ADMIN") return null;

    const admin = await prisma.admin.findUnique({
      where: { id: decoded.id },
      select: {
        id: true,
        email: true,
        role: true,
      },
    });

    return admin;
  } catch (err) {
    console.error("verifyAdmin error:", err);
    return null;
  }
}
