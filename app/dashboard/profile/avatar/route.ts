import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import jwt from "jsonwebtoken";
import fs from "fs";
import path from "path";

export async function POST(req: Request) {
  try {
    // =============== READ TOKEN ===============
    const cookie = req.headers.get("cookie") || "";
    const token = cookie.includes("token=") ? cookie.split("token=")[1] : null;
    if (!token) {
      console.log("❗ ERROR: Missing token");
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    // =============== DECODE USER ID ===============
    const decoded: any = jwt.verify(token, process.env.JWT_SECRET!);
    const userId = decoded.id;
    if (!userId) {
      console.log("❗ ERROR: Invalid user");
      return NextResponse.json({ error: "Invalid user" }, { status: 403 });
    }

    // =============== READ UPLOADED FILE ===============
    const data = await req.formData();
    const file = data.get("avatar") as File;

    if (!file) {
      console.log("❗ ERROR: No file received");
      return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
    }

    // =============== SAVE FILE TO /public/uploads ===============
    const buffer = Buffer.from(await file.arrayBuffer());
    const filename = `avatar_${userId}_${Date.now()}.png`;
    const uploadPath = path.join(process.cwd(), "public", "uploads", filename);

    // create uploads folder if missing
    if (!fs.existsSync(path.join(process.cwd(), "public", "uploads"))) {
      fs.mkdirSync(path.join(process.cwd(), "public", "uploads"));
    }

    fs.writeFileSync(uploadPath, buffer);

    // update DB
    await prisma.user.update({
      where: { id: userId },
      data: { avatar: "/uploads/" + filename }
    });

    console.log("✔ UPLOAD OK:", filename);

    return NextResponse.json({
      success: true,
      user: { avatar: "/uploads/" + filename }
    });

  } catch (err) {
    console.error("❗ UPLOAD ERROR:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
