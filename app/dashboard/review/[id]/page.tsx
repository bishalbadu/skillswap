"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";

export default function ReviewPage() {
  const params = useParams();
  const router = useRouter();
  const sessionId = params.id as string;

  const [loading, setLoading] = useState(true);
  const [session, setSession] = useState<any>(null);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  async function loadSession() {
    const res = await fetch(`/api/sessions/${sessionId}`, {
      credentials: "include",
    });

    const data = await res.json();
    setSession(data.session || null);
    setLoading(false);
  }

  useEffect(() => {
    loadSession();
  }, []);

  async function submitReview() {
    if (rating < 1) {
      setError("Please select rating");
      return;
    }

    setSubmitting(true);
    setError("");

    const res = await fetch("/api/reviews", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({
        sessionId: Number(sessionId),
        rating,
        comment,
      }),
    });

    const data = await res.json();

    if (!res.ok) {
      setError(data.error || "Something went wrong");
      setSubmitting(false);
      return;
    }

    router.push("/dashboard/skillmeet");
  }

  if (loading)
    return <div className="p-10">Loading...</div>;

  if (!session)
    return <div className="p-10">Session not found</div>;

  return (
    <div className="flex justify-center items-center min-h-[80vh] bg-[#f7f7f7]">
      <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-md space-y-6">

        <h2 className="text-xl font-bold text-center">
          Rate your session
        </h2>

        <p className="text-sm text-gray-600 text-center">
          How was your session?
        </p>

        {/* ⭐ STAR RATING */}
        <div className="flex justify-center gap-2 text-3xl">
          {[1,2,3,4,5].map((star) => (
            <button
              key={star}
              onClick={() => setRating(star)}
              className={
                star <= rating
                  ? "text-yellow-500"
                  : "text-gray-300"
              }
            >
              ★
            </button>
          ))}
        </div>

        {/* COMMENT */}
        <textarea
          placeholder="Write a short review (optional)"
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          className="w-full border rounded-lg p-3 text-sm"
          rows={4}
        />

        {error && (
          <p className="text-red-500 text-sm text-center">
            {error}
          </p>
        )}

        <button
          onClick={submitReview}
          disabled={submitting}
          className="w-full bg-[#4a5e27] text-white py-2 rounded-lg"
        >
          {submitting ? "Submitting..." : "Submit Review"}
        </button>

      </div>
    </div>
  );
}
