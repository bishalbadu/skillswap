// "use client";

// import { useEffect, useState } from "react";
// import { useParams } from "next/navigation";

// export default function JoinClassPage() {
//   const params = useParams();
//   const id = params.id as string;

//   const [session, setSession] = useState<any>(null);
//   const [loading, setLoading] = useState(true);

//   async function load() {
//     const res = await fetch(`/api/sessions/${id}`, { credentials: "include", cache: "no-store" });
//     const data = await res.json();
//     setSession(data.session || null);
//     setLoading(false);
//   }

//   useEffect(() => {
//     load();
//     const t = setInterval(load, 3000);
//     return () => clearInterval(t);
//   }, [id]);

//   if (loading) return <div className="p-6 text-gray-600">Loading...</div>;
//   if (!session) return <div className="p-6 text-gray-600">Session not found.</div>;

//   if (!session.meetingRoom) {
//     return (
//       <div className="p-6">
//         <h2 className="text-xl font-semibold">Waiting for tutor to start...</h2>
//         <p className="text-gray-500 mt-2">Join will enable once host clicks start session.</p>
//       </div>
//     );
//   }

//   const src = `https://meet.jit.si/${session.meetingRoom}`;

//   return (
//     <div className="p-2">
//       <iframe
//         src={src}
//         allow="camera; microphone; fullscreen; display-capture"
//         className="w-full h-[82vh] rounded-xl border"
//       />
//     </div>
//   );
// }



"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";

export default function JoinClassPage() {
  const params = useParams();
  const router = useRouter();
const id = params?.id as string;

  const [session, setSession] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [ending, setEnding] = useState(false);

  /* ================= LOAD SESSION ================= */

  async function load() {
    try {
      const res = await fetch(`/api/sessions/${id}`, {
        credentials: "include",
        cache: "no-store",
      });

      const data = await res.json();
      setSession(data.session || null);
    } catch (err) {
      console.error("SESSION LOAD ERROR:", err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
    const t = setInterval(load, 5000); // refresh every 5 sec
    return () => clearInterval(t);
  }, [id]);

  /* ================= HANDLE END SESSION ================= */

  async function handleEndSession() {
    if (!session) return;

    try {
      setEnding(true);

      await fetch("/api/sessions/end", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ sessionId: session.id }),
      });

      // 🔥 Redirect to Review Page
      router.push(`/dashboard/review/${session.id}`);
    } catch (err) {
      console.error("END SESSION ERROR:", err);
      setEnding(false);
    }
  }

  /* ================= UI STATES ================= */

  if (loading)
    return <div className="p-6 text-gray-600">Loading...</div>;

  if (!session)
    return <div className="p-6 text-gray-600">Session not found.</div>;

  if (!session.meetingRoom) {
    return (
      <div className="p-6">
        <h2 className="text-xl font-semibold">
          Waiting for tutor to start...
        </h2>
        <p className="text-gray-500 mt-2">
          Join will enable once host clicks start session.
        </p>
      </div>
    );
  }

  const src = `https://meet.jit.si/${session.meetingRoom}
#config.disableDeepLinking=true
&config.prejoinPageEnabled=false
&config.enableClosePage=true`;

  return (
    <div className="p-4 space-y-4">
      {/* ================= END BUTTON ================= */}
      <div className="flex justify-end">
        <button
          onClick={handleEndSession}
          disabled={ending}
          className={`px-4 py-2 rounded text-white ${
            ending ? "bg-gray-400" : "bg-red-500 hover:bg-red-600"
          }`}
        >
          {ending ? "Ending..." : "End Session"}
        </button>
      </div>

      {/* ================= JITSI IFRAME ================= */}
      <iframe
        src={src}
        allow="camera; microphone; fullscreen; display-capture"
        className="w-full h-[82vh] rounded-xl border"
      />
    </div>
  );
}
