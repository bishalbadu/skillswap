import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { verifyAdmin } from "@/lib/auth";

export async function GET(
  _req: Request,
  { params }: { params: { id: string } }
) {
  const admin = await verifyAdmin();
  if (!admin) {
    return NextResponse.json({ error: "UNAUTHORIZED" }, { status: 401 });
  }

  const skillId = Number(params.id);

  const skill = await prisma.skill.findUnique({
    where: { id: skillId },
    select: {
      id: true,
      name: true,
      type: true,
      description: true,
      level: true,
      platform: true,
      sessionLength: true,
      learnGoal: true,
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
          createdAt: true,
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
  });

  if (!skill) {
    return NextResponse.json({ error: "NOT_FOUND" }, { status: 404 });
  }

  return NextResponse.json({ skill });
}

export async function PATCH(
  req: Request,
  { params }: { params: { id: string } }
) {
  const admin = await verifyAdmin();
  if (!admin) {
    return NextResponse.json({ error: "UNAUTHORIZED" }, { status: 401 });
  }

  const skillId = Number(params.id);
  const body = await req.json();
  const action = body?.action as
    | "APPROVE"
    | "DISABLE"
    | "ENABLE"
    | "TOGGLE_LISTING";

  const skill = await prisma.skill.findUnique({ where: { id: skillId } });
  if (!skill) return NextResponse.json({ error: "NOT_FOUND" }, { status: 404 });

  if (action === "APPROVE") {
    const updated = await prisma.skill.update({
      where: { id: skillId },
      data: { status: "APPROVED" as any },
    });
    return NextResponse.json({ skill: updated });
  }

  if (action === "DISABLE") {
    const updated = await prisma.skill.update({
      where: { id: skillId },
      data: { status: "DISABLED" as any },
    });
    return NextResponse.json({ skill: updated });
  }

  if (action === "ENABLE") {
    // enabling goes back to APPROVED (not PENDING)
    const updated = await prisma.skill.update({
      where: { id: skillId },
      data: { status: "APPROVED" as any },
    });
    return NextResponse.json({ skill: updated });
  }

  if (action === "TOGGLE_LISTING") {
    const updated = await prisma.skill.update({
      where: { id: skillId },
      data: { publicListing: !skill.publicListing },
    });
    return NextResponse.json({ skill: updated });
  }

  return NextResponse.json({ error: "INVALID_ACTION" }, { status: 400 });
}
