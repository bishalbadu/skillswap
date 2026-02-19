"use client";

import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";

export default function PremiumSuccess() {
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    async function verifyPayment() {
      const rawUuid = searchParams.get("uuid");

      if (!rawUuid) {
        router.replace("/dashboard");
        return;
      }

      // 🔥 FIX: remove accidental "?data=" part
      const uuid = rawUuid.split("?")[0];

      try {
        const res = await fetch("/api/billing/esewa/verify", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ uuid }),
        });

        if (!res.ok) {
          console.error("Verification failed");
          router.replace("/dashboard");
          return;
        }

        router.replace("/dashboard?premium=success");

      } catch (err) {
        console.error(err);
        router.replace("/dashboard");
      }
    }

    verifyPayment();
  }, [router, searchParams]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="bg-white p-8 rounded-xl shadow text-center">
        <h1 className="text-2xl font-bold text-green-600">
          🎉 Activating Premium...
        </h1>
        <p className="mt-3 text-gray-600">
          Please wait while we verify your payment...
        </p>
      </div>
    </div>
  );
}
