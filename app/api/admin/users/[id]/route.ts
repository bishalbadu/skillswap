import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { verifyAdmin } from "@/lib/auth";

export async function GET(
  _: Request,
  { params }: { params: { id: string } }
) {
  const admin = await verifyAdmin();
  if (!admin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const user = await prisma.user.findUnique({
    where: { id: Number(params.id) },
    select: {
      id: true,
      firstName: true,
      lastName: true,
      email: true,
      avatar: true,
      bio: true,
      membership: true,
      status: true,
      createdAt: true,
      skills: {
        select: {
          name: true,
          type: true,
        },
      },
    },
  });

  return NextResponse.json({ user });
}

export async function PATCH(
  req: Request,
  { params }: { params: { id: string } }
) {
  const admin = await verifyAdmin();
  if (!admin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { status } = await req.json();

  const user = await prisma.user.update({
    where: { id: Number(params.id) },
    data: { status },
  });

  return NextResponse.json({ user });
}
