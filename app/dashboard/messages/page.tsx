"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";


export default function MessagesPage() {
  const [tab, setTab] = useState<"received" | "sent">("received");
  const [loading, setLoading] = useState(true);
  const [received, setReceived] = useState<any[]>([]);
  const [sent, setSent] = useState<any[]>([]);
  const [suspended, setSuspended] = useState(false);
  const router = useRouter();


  /* ⭐ Star Rating */
function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-1 text-yellow-500 text-sm">
      {"★".repeat(Math.floor(rating))}
      {"☆".repeat(5 - Math.floor(rating))}
    </div>
  );
}
  function formatDate(date?: string) {
  if (!date) return "";
  return new Date(date).toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

  useEffect(() => {
    tab === "received" ? loadReceived() : loadSent();
  }, [tab]);


  
  async function loadReceived() {
    setLoading(true);
    const res = await fetch("/api/swap-request/inbox", {
      credentials: "include",
    });
    const data = await res.json();
    setReceived(data.requests || []);
    setSuspended(Boolean(data.suspended));
    setLoading(false);
  }

  async function loadSent() {
    setLoading(true);
    const res = await fetch("/api/swap-request/sent", {
      credentials: "include",
    });
    const data = await res.json();
    setSent(data.requests || []);
    setLoading(false);
  }

  async function updateStatus(
  requestId: string,
  action: "accept" | "reject"
) {
  const res = await fetch(`/api/swap-request/${action}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify({ requestId }),
  });

  if (!res.ok) {
    alert("Something went wrong");
    return;
  }

  // ✅ If accepted → redirect to skillmeet
  if (action === "accept") {
    router.push("/dashboard/skillmeet");
    return;
  }

  // If rejected → just reload
  loadReceived();
}


  return (
    <div className="p-10 space-y-6">
      <h1 className="text-2xl font-bold">Messages</h1>

      {suspended && (
  <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
    🚫 Your account is currently suspended.  
    You can view messages, but actions are disabled.
  </div>
)}


      {/* TABS */}
      <div className="flex gap-3">
        <button
          onClick={() => setTab("received")}
          className={`px-4 py-2 rounded ${
            tab === "received"
              ? "bg-[#4a5e27] text-white"
              : "border"
          }`}
        >
          Received Requests
        </button>

        <button
          onClick={() => setTab("sent")}
          className={`px-4 py-2 rounded ${
            tab === "sent"
              ? "bg-[#4a5e27] text-white"
              : "border"
          }`}
        >
          Sent Requests
        </button>
      </div>

      {loading && <p>Loading...</p>}

      {/* ================= RECEIVED REQUESTS ================= */}
      {tab === "received" &&
        !loading &&
        received.map((r) => (
          <div
            key={r.id}
            className="bg-white border rounded-xl p-5 shadow space-y-3"
          >
            {/* HEADER */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                {r.requester.avatar ? (
                  <img
                    src={r.requester.avatar}
                    className="w-12 h-12 rounded-full object-cover"
                  />
                ) : (
                  <div className="w-12 h-12 rounded-full bg-gray-300 flex items-center justify-center font-bold">
                    {r.requester.firstName[0]}
                  </div>
                )}

               <div>
  <div className="font-semibold">
    {r.requester.firstName} {r.requester.lastName}
  </div>

  <div className="flex items-center gap-2 mt-1">
    <StarRating rating={r.rating || 0} />
    <span className="text-xs text-gray-500">
      {r.rating || 0} ({r.reviewsCount || 0})
    </span>
  </div>
</div>

              </div>

            <div className="flex flex-col gap-2">
  <Link
    href={`/dashboard/profile/${r.requester.id}`}
    className="
      px-4 py-2
      border rounded-lg
      text-sm font-medium
      text-[#4a5e27]
      border-[#4a5e27]
      hover:bg-[#4a5e27]
      hover:text-white
      transition text-center
    "
  >
    View Profile
  </Link>

  {r.status === "ACCEPTED" && (
    <Link
     href={`/dashboard/chat?sessionId=${r.session.id}`}
      className="
        px-4 py-2
        rounded-lg
        text-sm font-medium
        bg-[#7e9c6c]
        text-white
        hover:bg-[#6c875e]
        transition text-center
      "
    >
      💬 Chat
    </Link>
  )}
</div>
            </div>

            {/* CONTEXT */}
            <div className="text-sm">
              Wants to learn <b>{r.skill.name}</b>
              {r.skill.level && ` (${r.skill.level})`}
            </div>

            {r.slot && (
  <div className="text-sm text-gray-600 space-y-1">
    <div>
      Slot: {r.slot.day} {r.slot.timeFrom}–{r.slot.timeTo}
    </div>
    {r.slot.date && (
      <div className="text-xs text-gray-500">
        Date: {formatDate(r.slot.date)}
      </div>
    )}
  </div>
)}

            {r.message && (
              <div className="text-sm italic text-gray-700">
                “{r.message}”
              </div>
            )}

            {/* ACTIONS */}
            <div className="flex items-center gap-3 pt-2">
             {r.status === "PENDING" && (
  <>
    <button
      disabled={suspended}
      onClick={() => updateStatus(r.id, "accept")}
      className={`px-4 py-1 rounded text-white
        ${suspended
          ? "bg-gray-300 cursor-not-allowed"
          : "bg-[#4a5e27]"
        }`}
    >
      Accept
    </button>

    <button
      disabled={suspended}
      onClick={() => updateStatus(r.id, "reject")}
      className={`px-4 py-1 rounded border
        ${suspended
          ? "bg-gray-100 text-gray-400 cursor-not-allowed"
          : ""
        }`}
    >
      Reject
    </button>
  </>
)}


              {r.status === "ACCEPTED" && (
                <span className="text-green-600 font-semibold">
                  Accepted
                </span>
              )}

              {r.status === "REJECTED" && (
                <span className="text-red-500 font-semibold">
                  Rejected
                </span>
              )}
            </div>
          </div>
        ))}

      {/* ================= SENT REQUESTS ================= */}
      {tab === "sent" &&
        !loading &&
        sent.map((r) => (
          <div
            key={r.id}
            className="bg-white border rounded-xl p-5 shadow space-y-3"
          >
            {/* HEADER */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                {r.receiver.avatar ? (
                  <img
                    src={r.receiver.avatar}
                    className="w-12 h-12 rounded-full object-cover"
                  />
                ) : (
                  <div className="w-12 h-12 rounded-full bg-gray-300 flex items-center justify-center font-bold">
                    {r.receiver.firstName[0]}
                  </div>
                )}

                <div>
  <div className="font-semibold">
    {r.receiver.firstName} {r.receiver.lastName}
  </div>

  <div className="flex items-center gap-2 mt-1">
    <StarRating rating={r.rating || 0} />
    <span className="text-xs text-gray-500">
      {r.rating || 0} ({r.reviewsCount || 0})
    </span>
  </div>
</div>

              </div>
<div className="flex flex-col gap-2">
  <Link
    href={`/dashboard/profile/${r.receiver.id}`}
    className="
      px-4 py-2
      border rounded-lg
      text-sm font-medium
      text-[#4a5e27]
      border-[#4a5e27]
      hover:bg-[#4a5e27]
      hover:text-white
      transition text-center
    "
  >
    View Profile
  </Link>

  {r.status === "ACCEPTED" && (
    <Link
      href={`/dashboard/chat?requestId=${r.id}`}
      className="
        px-4 py-2
        rounded-lg
        text-sm font-medium
        bg-[#7e9c6c]
        text-white
        hover:bg-[#6c875e]
        transition text-center
      "
    >
      💬 Chat
    </Link>
  )}
</div>
            </div>

            {/* CONTEXT */}
            <div className="text-sm">
              Your swap request for <b>{r.skill.name}</b>
              {r.skill.level && ` (${r.skill.level})`}
            </div>

            {r.slot && (
  <div className="text-sm text-gray-600 space-y-1">
    <div>
      Slot: {r.slot.day} {r.slot.timeFrom}–{r.slot.timeTo}
    </div>
    {r.slot.date && (
      <div className="text-xs text-gray-500">
        Date: {formatDate(r.slot.date)}
      </div>
    )}
  </div>
)}


            {r.message && (
              <div className="text-sm italic text-gray-700">
                “{r.message}”
              </div>
            )}

            {/* STATUS */}
            <div className="font-semibold">
              {r.status === "ACCEPTED" && (
                <span className="text-green-600">Accepted</span>
              )}
              {r.status === "REJECTED" && (
                <span className="text-red-500">Rejected</span>
              )}
              {r.status === "PENDING" && (
                <span className="text-gray-500">Pending</span>
              )}
            </div>
          </div>
        ))}
    </div>
  );
}
