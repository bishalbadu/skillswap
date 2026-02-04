import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { verifyAdmin } from "@/lib/auth";


export async function PATCH(
  req: Request,
  { params }: { params: { id: string } }
) {
  const admin = await verifyAdmin();
  if (!admin) {
    return NextResponse.json({ error: "UNAUTHORIZED" }, { status: 401 });
  }

  const skillId = Number(params.id);
  const { action } = await req.json();

  if (action === "APPROVE") {
    await prisma.skill.update({
      where: { id: skillId },
      data: { status: "APPROVED" },
    });
  }

  if (action === "DISABLE") {
    await prisma.skill.update({
      where: { id: skillId },
      data: { status: "DISABLED" },
    });
  }

  if (action === "ENABLE") {
    await prisma.skill.update({
      where: { id: skillId },
      data: { status: "APPROVED" },
    });
  }

  return NextResponse.json({ success: true });
}
