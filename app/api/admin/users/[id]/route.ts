// import { NextResponse } from "next/server";
// import prisma from "@/lib/prisma";
// import { verifyAdmin } from "@/lib/auth";

// export async function PATCH(
//   req: Request,
//   { params }: { params: { id: string } }
// ) {
//   const admin = await verifyAdmin();
//   if (!admin) {
//     return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
//   }

//   const { status } = await req.json();
//   const userId = Number(params.id);

//   // 🔹 Get previous status
//   const existingUser = await prisma.user.findUnique({
//     where: { id: userId },
//     select: { status: true },
//   });

//   if (!existingUser) {
//     return NextResponse.json({ error: "USER_NOT_FOUND" }, { status: 404 });
//   }

//   // 🔹 Update status
//   const user = await prisma.user.update({
//     where: { id: userId },
//     data: { status },
//   });

//   /* ================= SUSPEND NOTIFICATION ================= */
//   if (
//     existingUser.status === "ACTIVE" &&
//     status === "SUSPENDED"
//   ) {
//     const latestReport = await prisma.report.findFirst({
//       where: {
//         reportedUserId: userId,
//         status: "REVIEWED",
//       },
//       orderBy: { createdAt: "desc" },
//     });

//     let reasonText = "Violation of platform rules";

//     if (latestReport) {
//       if (latestReport.reason === "OTHER" && latestReport.message) {
//         reasonText = latestReport.message;
//       } else {
//         reasonText = latestReport.reason.replace("_", " ");
//       }
//     }

//     await prisma.notification.create({
//       data: {
//         userId,
//         type: "ACCOUNT_SUSPENDED",
//         title: "Account Suspended",
//         message: `Your account has been suspended for: ${reasonText}`,
//         link: "/dashboard/profile",
//       },
//     });
//   }

//   /* ================= REACTIVATION NOTIFICATION ================= */
//   if (
//     existingUser.status === "SUSPENDED" &&
//     status === "ACTIVE"
//   ) {
//     await prisma.notification.create({
//       data: {
//         userId,
//         type: "ACCOUNT_REACTIVATED",
//         title: "Account Reactivated",
//         message:
//           "Your SkillSwap account has been reactivated by the admin. You can now access all features and continue using the platform. Please make sure to follow SkillSwap’s community guidelines while using the platform.",
//         link: "/dashboard/profile",
//       },
//     });
//   }

//   return NextResponse.json({ user });
// }



import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { verifyAdmin } from "@/lib/auth";

/* ======================================================
   GET USER DETAILS (Admin View)
====================================================== */
export async function GET(
  _: Request,
  { params }: { params: { id: string } }
) {
  const admin = await verifyAdmin();
  if (!admin) {
    return NextResponse.json({ error: "UNAUTHORIZED" }, { status: 401 });
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
  premiumUntil: true,
  completedSwaps: true,
  status: true,
  createdAt: true,
  skills: {
    select: {
      name: true,
      type: true,
    },
  },
}

  });

  if (!user) {
    return NextResponse.json({ error: "USER_NOT_FOUND" }, { status: 404 });
  }

  return NextResponse.json({ user });
}

/* ======================================================
   UPDATE USER STATUS (Suspend / Activate)
====================================================== */
export async function PATCH(
  req: Request,
  { params }: { params: { id: string } }
) {
  const admin = await verifyAdmin();
  if (!admin) {
    return NextResponse.json({ error: "UNAUTHORIZED" }, { status: 401 });
  }

  const userId = Number(params.id);
  const { status } = await req.json();

  const existingUser = await prisma.user.findUnique({
    where: { id: userId },
    select: { status: true },
  });

  if (!existingUser) {
    return NextResponse.json({ error: "USER_NOT_FOUND" }, { status: 404 });
  }

  const user = await prisma.user.update({
    where: { id: userId },
    data: { status },
  });

  /* ================= SUSPENSION NOTIFICATION ================= */
  if (existingUser.status === "ACTIVE" && status === "SUSPENDED") {
    const latestReport = await prisma.report.findFirst({
      where: {
        reportedUserId: userId,
        status: "REVIEWED",
      },
      orderBy: { createdAt: "desc" },
    });

    let reasonText = "Violation of platform rules";

    if (latestReport) {
      if (latestReport.reason === "OTHER" && latestReport.message) {
        reasonText = latestReport.message;
      } else {
        reasonText = latestReport.reason.replace("_", " ");
      }
    }

    await prisma.notification.create({
      data: {
        userId,
        type: "ACCOUNT_SUSPENDED",
        title: "Account Suspended",
        message: `Your account has been suspended for: ${reasonText}`,
        link: "/dashboard/profile",
      },
    });
  }

  /* ================= REACTIVATION NOTIFICATION ================= */
  if (existingUser.status === "SUSPENDED" && status === "ACTIVE") {
    await prisma.notification.create({
      data: {
        userId,
        type: "ACCOUNT_REACTIVATED",
        title: "Account Reactivated",
        message:
          "Your SkillSwap account has been reactivated by the admin. You can now access all features and continue using the platform. Please make sure to follow SkillSwap’s community guidelines while using the platform.",
        link: "/dashboard/profile",
      },
    });
  }

  return NextResponse.json({ user });
}

/* ======================================================
   DELETE USER (Permanent Ban)
====================================================== */
export async function DELETE(
  _: Request,
  { params }: { params: { id: string } }
) {
  const admin = await verifyAdmin();
  if (!admin) {
    return NextResponse.json({ error: "UNAUTHORIZED" }, { status: 401 });
  }

  const userId = Number(params.id);

  // ❌ Prevent admin deleting themselves
  // if (admin.id === userId) {
  //   return NextResponse.json(
  //     { error: "CANNOT_DELETE_SELF" },
  //     { status: 400 }
  //   );
  // }

  const user = await prisma.user.findUnique({
    where: { id: userId },
  });

  if (!user) {
    return NextResponse.json(
      { error: "USER_NOT_FOUND" },
      { status: 404 }
    );
  }

  /* ================= FULL CLEAN DELETE ================= */
  await prisma.$transaction([
    prisma.notification.deleteMany({
      where: { userId },
    }),

    prisma.swapRequest.deleteMany({
      where: {
        OR: [
          { requesterId: userId },
          { receiverId: userId },
        ],
      },
    }),

    prisma.skillSlot.deleteMany({
      where: { skill: { userId } },
    }),

    prisma.skill.deleteMany({
      where: { userId },
    }),

    prisma.user.delete({
      where: { id: userId },
    }),
  ]);

  return NextResponse.json({ success: true });
}
