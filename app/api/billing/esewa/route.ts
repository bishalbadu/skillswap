import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { generateEsewaSignature } from "@/lib/generateEsewaSignature";
import { v4 as uuidv4 } from "uuid";
import { getUserFromRequest } from "@/lib/auth";

export async function POST(req: Request) {
  try {
    const user = await getUserFromRequest();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { plan } = await req.json();

    let amount = 0;

    if (plan === "MONTH_1") {
      amount = 2000;
    } else if (plan === "MONTH_6") {
      amount = 6000;
    } else {
      return NextResponse.json({ error: "Invalid plan" }, { status: 400 });
    }

    /* ===============================
       1️⃣ Generate UUID
    =============================== */
    const transaction_uuid = `${Date.now()}-${uuidv4()}`;

    /* ===============================
       2️⃣ Save Payment
    =============================== */
    await prisma.payment.create({
      data: {
        userId: user.id,
        plan,
        amount,
        status: "PENDING",
        esewaTransactionUuid: transaction_uuid,
      },
    });

    /* ===============================
       3️⃣ Create eSewa Payload
    =============================== */
    const payload = {
      amount,
      tax_amount: 0,
      total_amount: amount,
      transaction_uuid,
      product_code: process.env.ESEWA_MERCHANT_CODE!,
      product_service_charge: 0,
      product_delivery_charge: 0,
      success_url: `${process.env.BASE_URL}/premium-success?uuid=${transaction_uuid}&`,
      failure_url: `${process.env.BASE_URL}/dashboard`,
      signed_field_names: "total_amount,transaction_uuid,product_code",
    };

    const signatureString =
      `total_amount=${payload.total_amount},transaction_uuid=${payload.transaction_uuid},product_code=${payload.product_code}`;

    const signature = generateEsewaSignature(
      process.env.ESEWA_SECRET_KEY!,
      signatureString
    );

    return NextResponse.json({
      esewaUrl: process.env.ESEWA_FORM_URL,
      payload: {
        ...payload,
        signature,
      },
    });

  } catch (err) {
    console.error("Payment Init Error:", err);
    return NextResponse.json(
      { error: "Payment initiation failed" },
      { status: 500 }
    );
  }
}
