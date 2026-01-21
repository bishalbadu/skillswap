import { cookies } from "next/headers";
import jwt from "jsonwebtoken";
import prisma from "@/lib/prisma";

const JWT_SECRET = process.env.JWT_SECRET!;

/* =========================
   USER AUTH (NORMAL USERS)
========================= */
export async function getUserFromRequest() {
  try {
    const cookieStore = await cookies(); // ✅ MUST await
    const token = cookieStore.get("token")?.value;

    if (!token) return null;

    const decoded = jwt.verify(token, JWT_SECRET) as {
      id: number;
    };

    if (typeof decoded.id !== "number") return null;

    return prisma.user.findUnique({
      where: { id: decoded.id },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        email: true,
        avatar: true,
        status: true,
      },
    });
  } catch (err) {
    console.error("getUserFromRequest error:", err);
    return null;
  }
}

/* =========================
   ADMIN AUTH (ADMIN USERS)
========================= */
export async function verifyAdmin() {
  try {
    const cookieStore = await cookies(); // ✅ FIXED (this was missing)
    const token = cookieStore.get("admin_token")?.value;

    if (!token) return null;

    const decoded = jwt.verify(token, JWT_SECRET) as {
      adminId: string;
      role: string;
    };

    if (!decoded.adminId || decoded.role !== "ADMIN") return null;

    return prisma.admin.findUnique({
      where: { id: decoded.adminId }, // ✅ SAFE & UNIQUE
      select: {
        id: true,
        email: true,
        role: true,
      },
    });
  } catch (err) {
    console.error("verifyAdmin error:", err);
    return null;
  }
}
