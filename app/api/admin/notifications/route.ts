import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { verifyAdmin } from "@/lib/auth";

export async function GET() {
  const admin = await verifyAdmin();
  if (!admin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // 🔥 Example logic (you can expand later)
  const reports = await prisma.report.count({
    where: { status: "PENDING" },
  });

  const suspendedUsers = await prisma.user.count({
    where: { status: "SUSPENDED" },
  });

  const notifications = [
    {
      id: 1,
      title: "New Reports",
      message: `${reports} reports pending review`,
      type: "REPORT",
    },
    {
      id: 2,
      title: "Suspended Users",
      message: `${suspendedUsers} users currently suspended`,
      type: "USER",
    },
  ];

  return NextResponse.json({
    notifications,
    unreadCount: notifications.length,
  });
}