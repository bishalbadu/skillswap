import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET() {
  const admin = await prisma.admin.findFirst();
  return NextResponse.json({ exists: !!admin });
}
