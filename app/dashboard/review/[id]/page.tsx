// "use client";

// import { useEffect, useState } from "react";
// import { useParams, useRouter } from "next/navigation";

// export default function ReviewPage() {
//   const params = useParams();
//   const router = useRouter();
//   const sessionId = params.id as string;

//   const [loading, setLoading] = useState(true);
//   const [session, setSession] = useState<any>(null);
//   const [rating, setRating] = useState(0);
//   const [comment, setComment] = useState("");
//   const [submitting, setSubmitting] = useState(false);
//   const [error, setError] = useState("");

//   async function loadSession() {
//     const res = await fetch(`/api/sessions/${sessionId}`, {
//       credentials: "include",
//     });

//     const data = await res.json();
//     setSession(data.session || null);
//     setLoading(false);
//   }

//   useEffect(() => {
//     loadSession();
//   }, []);

//   async function submitReview() {
//     if (rating < 1) {
//       setError("Please select rating");
//       return;
//     }

//     setSubmitting(true);
//     setError("");

//     const res = await fetch("/api/reviews", {
//       method: "POST",
//       headers: { "Content-Type": "application/json" },
//       credentials: "include",
//       body: JSON.stringify({
//         sessionId: Number(sessionId),
//         rating,
//         comment,
//       }),
//     });

//     const data = await res.json();

//     if (!res.ok) {
//       setError(data.error || "Something went wrong");
//       setSubmitting(false);
//       return;
//     }

//     router.push("/dashboard/skillmeet");
//   }

//   if (loading)
//     return <div className="p-10">Loading...</div>;

//   if (!session)
//     return <div className="p-10">Session not found</div>;

//   return (
//     <div className="flex justify-center items-center min-h-[80vh] bg-[#f7f7f7]">
//       <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-md space-y-6">

//         <h2 className="text-xl font-bold text-center">
//           Rate your session
//         </h2>

//         <p className="text-sm text-gray-600 text-center">
//           How was your session?
//         </p>

//         {/*  STAR RATING */}
//         <div className="flex justify-center gap-2 text-3xl">
//           {[1,2,3,4,5].map((star) => (
//             <button
//               key={star}
//               onClick={() => setRating(star)}
//               className={
//                 star <= rating
//                   ? "text-yellow-500"
//                   : "text-gray-300"
//               }
//             >
//               ★
//             </button>
//           ))}
//         </div>

//         {/* COMMENT */}
//         <textarea
//           placeholder="Write a short review (optional)"
//           value={comment}
//           onChange={(e) => setComment(e.target.value)}
//           className="w-full border rounded-lg p-3 text-sm"
//           rows={4}
//         />

//         {error && (
//           <p className="text-red-500 text-sm text-center">
//             {error}
//           </p>
//         )}

//         <button
//           onClick={submitReview}
//           disabled={submitting}
//           className="w-full bg-[#4a5e27] text-white py-2 rounded-lg"
//         >
//           {submitting ? "Submitting..." : "Submit Review"}
//         </button>

//       </div>
//     </div>
//   );
// }


"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";

export default function ReviewPage() {
  const params = useParams();
  const router = useRouter();
  const sessionId = params?.id as string;

  const [loading, setLoading] = useState(true);
  const [session, setSession] = useState<any>(null);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [submitting, setSubmitting] = useState(false);

  /* ✅ TOAST STATE */
  const [toast, setToast] = useState<{
    message: string;
    type: "success" | "error" | "info";
  } | null>(null);

  function showToast(
    message: string,
    type: "success" | "error" | "info" = "info"
  ) {
    setToast({ message, type });

    setTimeout(() => {
      setToast(null);
    }, 3000);
  }

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

  /* ================= SUBMIT REVIEW ================= */
  async function submitReview() {
    if (rating < 1) {
      showToast("Please select a rating", "error");
      return;
    }

    setSubmitting(true);

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
      showToast(data.error || "Something went wrong", "error");
      setSubmitting(false);
      return;
    }

    /* ✅ SUCCESS */
    showToast("Review submitted successfully", "success");

    setTimeout(() => {
      router.push("/dashboard/skillmeet");
    }, 1500);
  }

  if (loading) return <div className="p-10">Loading...</div>;
  if (!session) return <div className="p-10">Session not found</div>;

  return (
    <div className="flex justify-center items-center min-h-[80vh] bg-[#f7f7f7]">

      {/* ✅ TOAST UI */}
      {toast && (
        <div className="fixed top-6 right-6 z-50">
          <div
            className={`flex items-center gap-4 px-6 py-4 rounded-xl shadow-xl min-w-[320px]
            ${toast.type === "success" && "bg-green-50 border border-green-200 text-green-800"}
            ${toast.type === "error" && "bg-red-50 border border-red-200 text-red-800"}
            ${toast.type === "info" && "bg-blue-50 border border-blue-200 text-blue-800"}
          `}
          >
            <div
              className={`w-10 h-10 flex items-center justify-center rounded-full font-bold
              ${toast.type === "success" && "bg-green-200"}
              ${toast.type === "error" && "bg-red-200"}
              ${toast.type === "info" && "bg-blue-200"}
            `}
            >
              {toast.type === "success" && "✓"}
              {toast.type === "error" && "✕"}
              {toast.type === "info" && "i"}
            </div>

            <div className="flex-1 text-base font-semibold">
              {toast.message}
            </div>

            <button onClick={() => setToast(null)}>✕</button>
          </div>
        </div>
      )}

      <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-md space-y-6">

        <h2 className="text-xl font-bold text-center">
          Rate your session
        </h2>

        <p className="text-sm text-gray-600 text-center">
          How was your session?
        </p>

        {/* ⭐ STAR RATING */}
        <div className="flex justify-center gap-2 text-3xl">
          {[1, 2, 3, 4, 5].map((star) => (
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

        {/* BUTTON */}
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