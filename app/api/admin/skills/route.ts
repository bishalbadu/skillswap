import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { verifyAdmin } from "@/lib/auth";

export async function GET(req: Request) {
  const admin = await verifyAdmin();
  if (!admin) {
    return NextResponse.json({ error: "UNAUTHORIZED" }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const q = searchParams.get("q") || "";
  const type = searchParams.get("type") || "";
  const status = searchParams.get("status") || "";
  const listing = searchParams.get("listing") || "";

  const skills = await prisma.skill.findMany({
    where: {
      AND: [
        q
          ? {
              OR: [
                { name: { contains: q, mode: "insensitive" } },
                { description: { contains: q, mode: "insensitive" } },
                { learnGoal: { contains: q, mode: "insensitive" } },
                { user: { email: { contains: q, mode: "insensitive" } } },
                { user: { firstName: { contains: q, mode: "insensitive" } } },
                { user: { lastName: { contains: q, mode: "insensitive" } } },
              ],
            }
          : {},
        type ? { type: type as any } : {},
        status ? { status: status as any } : {},
        listing === "PUBLIC"
          ? { publicListing: true }
          : listing === "PRIVATE"
          ? { publicListing: false }
          : {},
      ],
    },
    select: {
      id: true,
      name: true,
      type: true,
      level: true,
      platform: true,
      publicListing: true,
      status: true,
      createdAt: true,
      user: {
        select: {
          id: true,
          firstName: true,
          lastName: true,
          email: true,
          status: true,
          membership: true,
        },
      },
      slots: {
        select: {
          id: true,
          day: true,
          timeFrom: true,
          timeTo: true,
          isBooked: true,
        },
        orderBy: [{ day: "asc" }, { timeFrom: "asc" }],
      },
    },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json({ skills });
}
