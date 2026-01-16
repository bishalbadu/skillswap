"use client";
import { useEffect } from "react";
import { useSearchParams } from "next/navigation";

export default function VerifyEmailPage() {
  const params = useSearchParams();
  const token = params.get("token");

  useEffect(() => {
    if (token) {
      window.location.href = `/api/auth/verify-email?token=${token}`;
    }
  }, [token]);

  return <div className="p-10 text-center">Verifying email...</div>;
}
