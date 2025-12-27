// import { NextResponse } from "next/server";

// export async function POST(req: Request) {
//   try {
//     const form = await req.formData();
//     const file = form.get("file") as File;

//     if (!file) {
//       return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
//     }

//     const bytes = await file.arrayBuffer();
//     const buffer = new Uint8Array(bytes);

//     // Cloudinary Upload URL
//     const uploadUrl = `https://api.cloudinary.com/v1_1/${process.env.CLOUDINARY_CLOUD_NAME}/upload`;

//     const cloudForm = new FormData();
//     cloudForm.append("file", new Blob([buffer], { type: file.type }));
//     cloudForm.append("upload_preset", process.env.CLOUDINARY_UPLOAD_PRESET!);

//     const uploadRes = await fetch(uploadUrl, {
//       method: "POST",
//       body: cloudForm,
//     });

//     const data = await uploadRes.json();

//     if (!data.secure_url) {
//       return NextResponse.json({ error: "Cloudinary upload failed", details: data }, { status: 500 });
//     }

//     return NextResponse.json({ url: data.secure_url });
//   } catch (err) {
//     console.error(err);
//     return NextResponse.json({ error: "Upload failed" }, { status: 500 });
//   }
// }


import { NextResponse } from "next/server";
import { getUserFromRequest } from "@/lib/auth";

export async function POST(req: Request) {
  try {
    // ✅ FIX: call with NO arguments
    const user = await getUserFromRequest();

    if (!user) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const form = await req.formData();
    const file = form.get("file") as File;

    if (!file) {
      return NextResponse.json(
        { error: "No file uploaded" },
        { status: 400 }
      );
    }

    const bytes = await file.arrayBuffer();
    const buffer = new Uint8Array(bytes);

    const uploadUrl = `https://api.cloudinary.com/v1_1/${process.env.CLOUDINARY_CLOUD_NAME}/upload`;

    const cloudForm = new FormData();
    cloudForm.append("file", new Blob([buffer], { type: file.type }));
    cloudForm.append(
      "upload_preset",
      process.env.CLOUDINARY_UPLOAD_PRESET!
    );

    const uploadRes = await fetch(uploadUrl, {
      method: "POST",
      body: cloudForm,
    });

    const data = await uploadRes.json();

    if (!data.secure_url) {
      return NextResponse.json(
        { error: "Cloudinary upload failed", details: data },
        { status: 500 }
      );
    }

    return NextResponse.json({ url: data.secure_url });
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: "Upload failed" },
      { status: 500 }
    );
  }
}
