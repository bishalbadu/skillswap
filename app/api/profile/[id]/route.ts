// import { NextResponse } from "next/server";
// import prisma from "@/lib/prisma";

// export async function GET(
//   req: Request,
//   { params }: { params: { id: string } }
// ) {
//   const userId = Number(params.id);

//   const user = await prisma.user.findUnique({
//     where: { id: userId },
//     include: {
//       skillsOffered: true,
//       skillsWanted: true,
//     },
//   });

//   if (!user) {
//     return NextResponse.json({ error: "User not found" }, { status: 404 });
//   }

//   return NextResponse.json({ user });
// }





import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const userId = Number(params.id);
    if (isNaN(userId)) {
      return NextResponse.json(
        { error: "INVALID_USER_ID" },
        { status: 400 }
      );
    }

    // 🔹 Fetch user with ALL skills
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        skills: true,
      },
    });

    if (!user) {
      return NextResponse.json(
        { error: "USER_NOT_FOUND" },
        { status: 404 }
      );
    }

    // 🔹 Apply moderation + visibility rules
    const skillsOffered = user.skills.filter(
      (s) =>
        s.type === "OFFER" &&
        s.status === "APPROVED" &&
        s.publicListing === true
    );

    const skillsWanted = user.skills.filter(
      (s) => s.type === "WANT"
    );

    return NextResponse.json({
      user: {
        id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        avatar: user.avatar,
        bio: user.bio,
        createdAt: user.createdAt,
      },
      skillsOffered,
      skillsWanted,
    });
  } catch (err) {
    console.error("PROFILE API ERROR:", err);
    return NextResponse.json(
      { error: "SERVER_ERROR" },
      { status: 500 }
    );
  }
}
