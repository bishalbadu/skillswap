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

import { useEffect, useRef, useState } from "react";
import { useParams, useRouter } from "next/navigation";

/* ✅ FIX: Tell TypeScript Jitsi exists on window */
declare global {
  interface Window {
    JitsiMeetExternalAPI: any;
  }
}

export default function JoinClassPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;

  const containerRef = useRef<HTMLDivElement>(null);
  const apiRef = useRef<any>(null);

  const [session, setSession] = useState<any>(null);
  const [loading, setLoading] = useState(true);

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
  }, [id]);

  /* ================= LOAD JITSI SCRIPT ONLY ONCE ================= */

  useEffect(() => {
    if (window.JitsiMeetExternalAPI) return;

    const script = document.createElement("script");
    script.src = "https://meet.jit.si/external_api.js";
    script.async = true;
    document.body.appendChild(script);
  }, []);

  /* ================= INITIALIZE JITSI ================= */

  useEffect(() => {
    if (!session?.meetingRoom) return;
    if (!containerRef.current) return;
    if (!window.JitsiMeetExternalAPI) return;

    // Prevent duplicate mounting
    if (apiRef.current) {
      apiRef.current.dispose();
      apiRef.current = null;
    }

    const domain = "meet.jit.si";

    const options = {
      roomName: session.meetingRoom,
      parentNode: containerRef.current,
      width: "100%",
      height: "85vh",

      userInfo: {
        displayName:
          session.me?.firstName
            ? `${session.me.firstName} ${session.me.lastName}`
            : "User",
      },

      configOverwrite: {
        startWithAudioMuted: false,
        startWithVideoMuted: false,
        enableLobby: false,
        prejoinPageEnabled: false,
      },

      interfaceConfigOverwrite: {
        DISABLE_JOIN_LEAVE_NOTIFICATIONS: true,
        SHOW_JITSI_WATERMARK: false,
        TOOLBAR_BUTTONS: [
          "microphone",
          "camera",
          "hangup",
          "chat",
          "fullscreen",
        ],
      },
    };

    apiRef.current = new window.JitsiMeetExternalAPI(domain, options);

    /* ================= AUTO REDIRECT WHEN LEAVE ================= */

    apiRef.current.addListener("videoConferenceLeft", async () => {
      // 🔥 Optional: mark session completed
      await fetch("/api/sessions/end", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ sessionId: session.id }),
      });

      router.push("/dashboard/skillmeet");
    });

    return () => {
      if (apiRef.current) {
        apiRef.current.dispose();
        apiRef.current = null;
      }
    };
  }, [session]);

  /* ================= UI STATES ================= */

  if (loading)
    return <div className="p-6 text-gray-600">Loading...</div>;

  if (!session)
    return <div className="p-6 text-gray-600">Session not found.</div>;

  if (!session.meetingRoom) {
    return (
      <div className="p-6">
        <h2 className="text-xl font-semibold">
          Waiting for host to start...
        </h2>
        <p className="text-gray-500 mt-2">
          Join will enable once host clicks start session.
        </p>
      </div>
    );
  }

  return (
    <div className="p-2">
      <div
        ref={containerRef}
        className="rounded-xl overflow-hidden"
      />
    </div>
  );
}
