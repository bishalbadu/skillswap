// import { NextResponse } from "next/server";
// import prisma from "@/lib/prisma";
// import { verifyAdmin } from "@/lib/auth";


// export async function PATCH(
//   req: Request,
//   { params }: { params: { id: string } }
// ) {
//   const admin = await verifyAdmin();
//   if (!admin) {
//     return NextResponse.json({ error: "UNAUTHORIZED" }, { status: 401 });
//   }

//   const skillId = Number(params.id);
//   const { action } = await req.json();

//   if (action === "APPROVE") {
//     await prisma.skill.update({
//       where: { id: skillId },
//       data: { status: "APPROVED" },
//     });
//   }

//   if (action === "DISABLE") {
//     await prisma.skill.update({
//       where: { id: skillId },
//       data: { status: "DISABLED" },
//     });
//   }

//   if (action === "ENABLE") {
//     await prisma.skill.update({
//       where: { id: skillId },
//       data: { status: "APPROVED" },
//     });
//   }

//   return NextResponse.json({ success: true });
// }


import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { verifyAdmin } from "@/lib/auth";

export async function PATCH(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    /* ================= AUTH ================= */
    const admin = await verifyAdmin();
    if (!admin) {
      return NextResponse.json({ error: "UNAUTHORIZED" }, { status: 401 });
    }

    const { status } = await req.json(); // APPROVED | DISABLED
    if (!["APPROVED", "DISABLED"].includes(status)) {
      return NextResponse.json({ error: "INVALID_STATUS" }, { status: 400 });
    }

    /* ================= UPDATE SKILL ================= */
    const skill = await prisma.skill.update({
      where: { id: Number(params.id) },
      data: { status },
    });

    /* ================= NOTIFICATION ================= */
    const skillTypeLabel = skill.type === "OFFER" ? "Offer" : "Want";
    const isApproved = status === "APPROVED";

    await prisma.notification.create({
      data: {
        userId: skill.userId,
        type: isApproved ? "SKILL_APPROVED" : "SKILL_DISABLED",
        title: isApproved ? "Skill Approved" : "Skill Disabled",
        message: isApproved
          ? `Admin approved your ${skill.name} ${skillTypeLabel} skill`
          : `Admin disabled your ${skill.name} ${skillTypeLabel} skill`,
        link:
          skill.type === "OFFER"
            ? "/dashboard/offer-skills"
            : "/dashboard/profile",
      },
    });

    return NextResponse.json({ success: true });

  } catch (err) {
    console.error("ADMIN SKILL PATCH ERROR:", err);
    return NextResponse.json({ error: "SERVER_ERROR" }, { status: 500 });
  }
}
