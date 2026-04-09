// "use client";

// import { useEffect, useState } from "react";
// import { useParams, useRouter } from "next/navigation";

// import {
//   LiveKitRoom,
//   GridLayout,
//   ParticipantTile,
//   ControlBar,
//   useTracks,
// } from "@livekit/components-react";
// import { Track } from "livekit-client";
// import "@livekit/components-styles";

// /* ================= ROOM CONTENT ================= */

// function RoomContent() {
//   const tracks = useTracks([
//     { source: Track.Source.Camera, withPlaceholder: true },
//   ]);

//   if (tracks.length === 0) {
//     return (
//       <div className="h-full w-full flex items-center justify-center text-white text-lg">
//         Waiting for participant...
//       </div>
//     );
//   }

//   return (
//     <>
//       <div className="flex-1 min-h-0 flex items-center justify-center p-4">
//         {tracks.length === 1 ? (
//           <div className="w-full max-w-5xl aspect-video rounded-2xl overflow-hidden bg-neutral-900 border border-neutral-800 shadow-xl">
//             <ParticipantTile trackRef={tracks[0]} />
//           </div>
//         ) : tracks.length === 2 ? (
//           <div className="relative w-full max-w-6xl aspect-video rounded-2xl overflow-hidden bg-neutral-950 border border-neutral-800 shadow-xl">
//             {/* Main video */}
//             <div className="absolute inset-0">
//               <ParticipantTile trackRef={tracks[0]} />
//             </div>

//             {/* Small corner video */}
//             <div className="absolute bottom-4 right-4 w-56 h-36 rounded-xl overflow-hidden border border-white/20 shadow-2xl bg-black">
//               <ParticipantTile trackRef={tracks[1]} />
//             </div>
//           </div>
//         ) : (
//           <div className="w-full h-full">
//             <GridLayout tracks={tracks}>
//               <ParticipantTile />
//             </GridLayout>
//           </div>
//         )}
//       </div>

//       <div className="pb-4">
//         <ControlBar />
//       </div>
//     </>
//   );
// }

// /* ================= MAIN PAGE ================= */

// export default function JoinClassPage() {
//   const params = useParams();
//   const router = useRouter();
//   const id = params?.id as string;

//   const [session, setSession] = useState<any>(null);
//   const [loading, setLoading] = useState(true);
//   const [ending, setEnding] = useState(false);
//   const [token, setToken] = useState<string | null>(null);

//   /* ================= LOAD SESSION ================= */

//   async function load() {
//     try {
//       const res = await fetch(`/api/sessions/${id}`, {
//         credentials: "include",
//         cache: "no-store",
//       });

//       const data = await res.json();
//       setSession(data.session || null);
//     } catch (err) {
//       console.error("SESSION LOAD ERROR:", err);
//     } finally {
//       setLoading(false);
//     }
//   }

//   useEffect(() => {
//     load();
//     const t = setInterval(load, 5000);
//     return () => clearInterval(t);
//   }, [id]);

//     /* ================= SAVE ACTIVE SESSION ================= */
  
//   useEffect(() => {
//     if (session?.status === "LIVE") {
//       localStorage.setItem("activeSession", session.id);
//     }
//   }, [session]);

//   /* ================= GET LIVEKIT TOKEN ================= */

//   useEffect(() => {
//     if (!session?.meetingRoom) return;

//     async function getToken() {
//       try {
//         const res = await fetch("/api/livekit/token", {
//           method: "POST",
//           headers: {
//             "Content-Type": "application/json",
//           },
//           body: JSON.stringify({
//             room: session.meetingRoom,
//           }),
//         });

//         const data = await res.json();
//         setToken(data.token);
//       } catch (err) {
//         console.error("TOKEN ERROR:", err);
//       }
//     }

//     getToken();
//   }, [session]);

//   /* ================= HANDLE END SESSION ================= */
// async function handleEndSession() {
//   if (!session) return;

//   const confirmEnd = confirm("Are you sure you want to end this session?");
//   if (!confirmEnd) return;

//   try {
//     setEnding(true);

//     await fetch("/api/sessions/end", {
//       method: "POST",
//       headers: { "Content-Type": "application/json" },
//       credentials: "include",
//       body: JSON.stringify({ sessionId: session.id }),
//     });

//     // clear active session (important)
//     localStorage.removeItem("activeSession");

//     router.push(`/dashboard/review/${session.id}`);
//   } catch (err) {
//     console.error("END SESSION ERROR:", err);
//     setEnding(false);
//   }
// }

//   /* ================= UI STATES ================= */

//   if (loading)
//     return <div className="p-6 text-gray-600">Loading...</div>;

//   if (!session)
//     return <div className="p-6 text-gray-600">Session not found.</div>;

//   if (!session.meetingRoom) {
//     return (
//       <div className="p-6">
//         <h2 className="text-xl font-semibold">
//           Waiting for host to start...
//         </h2>
//         <p className="text-gray-500 mt-2">
//           Join will enable once host clicks start session.
//         </p>
//       </div>
//     );
//   }

//   if (!token) {
//     return (
//       <div className="h-screen flex items-center justify-center bg-black text-white">
//         Connecting to session...
//       </div>
//     );
//   }

//   /* ================= MAIN UI ================= */

//   return (
//     <div className="h-screen w-screen bg-black text-white flex flex-col overflow-hidden">

//       {/* TOP BAR */}
//       <div className="flex items-center justify-between px-6 py-3 bg-black/80 border-b border-gray-800">
//         <div className="font-semibold text-lg">
//           SkillSwap Live Session
//         </div>

//         <div className="text-sm text-gray-300">
//           Room: <span className="text-white">{session.meetingRoom}</span>
//         </div>
//       </div>

//       {/* END BUTTON */}
//       <div className="flex justify-end p-3 bg-black">
//         <button
//           onClick={handleEndSession}
//           disabled={ending}
//           className={`px-4 py-2 rounded text-white ${
//             ending ? "bg-gray-400" : "bg-red-500 hover:bg-red-600"
//           }`}
//         >
//           {ending ? "Ending..." : "End Session"}
//         </button>
//       </div>

//       {/* LIVEKIT VIDEO */}
//       <div className="flex-1 flex items-center justify-center bg-black p-4">
//   <div className="w-full h-full rounded-2xl overflow-hidden flex flex-col bg-black">
//     <LiveKitRoom
//       token={token}
//       serverUrl={process.env.NEXT_PUBLIC_LIVEKIT_URL}
//       connect={true}
//       video={true}
//       audio={true}
//       onDisconnected={() => {
//         router.push("/dashboard/skillmeet");
//       }}
//     >
//       <RoomContent />
//     </LiveKitRoom>
//   </div>
// </div>
//     </div>
//   );
// }


"use client";

import { useEffect, useMemo, useState } from "react";
import { useParams, useRouter } from "next/navigation";

import {
  LiveKitRoom,
  GridLayout,
  ParticipantTile,
  ControlBar,
  useTracks,
} from "@livekit/components-react";
import { Track } from "livekit-client";
import "@livekit/components-styles";

/* ================= ROOM CONTENT ================= */

function RoomContent() {
  const tracks = useTracks([
    { source: Track.Source.Camera, withPlaceholder: true },
  ]);

  const sortedTracks = useMemo(() => {
    if (!tracks || tracks.length === 0) return [];

    // Put remote participant first (big screen),
    // and local participant later (small corner)
    return [...tracks].sort((a: any, b: any) => {
      const aLocal = a.participant?.isLocal ? 1 : 0;
      const bLocal = b.participant?.isLocal ? 1 : 0;
      return aLocal - bLocal;
    });
  }, [tracks]);

  if (sortedTracks.length === 0) {
    return (
      <>
        <div className="flex-1 min-h-0 flex items-center justify-center bg-[#202124]">
          <div className="text-center text-white">
            <div className="text-lg font-medium">Waiting for participant...</div>
            <p className="text-sm text-gray-400 mt-2">
              The call room is ready. Other user can join any time.
            </p>
          </div>
        </div>

        <div className="border-t border-white/10 bg-[#202124] px-4 py-3 flex justify-center">
          <ControlBar />
        </div>
      </>
    );
  }

  if (sortedTracks.length === 1) {
    return (
      <>
        <div className="flex-1 min-h-0 flex items-center justify-center bg-[#202124] px-4 py-5">
          <div className="w-full max-w-[1100px] aspect-video rounded-2xl overflow-hidden bg-black shadow-2xl border border-white/10">
            <ParticipantTile trackRef={sortedTracks[0]} />
          </div>
        </div>

        <div className="border-t border-white/10 bg-[#202124] px-4 py-3 flex justify-center">
          <ControlBar />
        </div>
      </>
    );
  }

  if (sortedTracks.length === 2) {
    return (
      <>
        <div className="flex-1 min-h-0 bg-[#202124] px-4 py-5">
          <div className="mx-auto h-full w-full max-w-[1200px] flex items-center justify-center">
            <div className="relative w-full aspect-video rounded-2xl overflow-hidden bg-black shadow-2xl border border-white/10">
              {/* BIG MAIN VIDEO (remote first) */}
              <div className="absolute inset-0">
                <ParticipantTile trackRef={sortedTracks[0]} />
              </div>

              {/* SMALL SELF VIDEO */}
              <div className="absolute bottom-4 right-4 w-[220px] h-[140px] rounded-2xl overflow-hidden border border-white/20 bg-black shadow-2xl">
                <ParticipantTile trackRef={sortedTracks[1]} />
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-white/10 bg-[#202124] px-4 py-3 flex justify-center">
          <ControlBar />
        </div>
      </>
    );
  }

  return (
    <>
      <div className="flex-1 min-h-0 bg-[#202124] px-4 py-5">
        <div className="mx-auto h-full w-full max-w-[1300px]">
          <GridLayout tracks={sortedTracks} className="h-full w-full">
            <ParticipantTile />
          </GridLayout>
        </div>
      </div>

      <div className="border-t border-white/10 bg-[#202124] px-4 py-3 flex justify-center">
        <ControlBar />
      </div>
    </>
  );
}

/* ================= MAIN PAGE ================= */

export default function JoinClassPage() {
  const params = useParams();
  const router = useRouter();
  const id = params?.id as string;

  const [session, setSession] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [ending, setEnding] = useState(false);
  const [token, setToken] = useState<string | null>(null);

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
    const t = setInterval(load, 5000);
    return () => clearInterval(t);
  }, [id]);

  /* ================= SAVE ACTIVE SESSION ================= */

  useEffect(() => {
    if (session?.status === "LIVE") {
      localStorage.setItem("activeSession", String(session.id));
    }
  }, [session]);

  /* ================= GET LIVEKIT TOKEN ================= */

  useEffect(() => {
    if (!session?.meetingRoom) return;

    async function getToken() {
      try {
        const res = await fetch("/api/livekit/token", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            room: session.meetingRoom,
          }),
        });

        const data = await res.json();
        setToken(data.token);
      } catch (err) {
        console.error("TOKEN ERROR:", err);
      }
    }

    getToken();
  }, [session]);

  /* ================= HANDLE END SESSION ================= */

  async function handleEndSession() {
    if (!session) return;

    const confirmEnd = confirm("Are you sure you want to end this session?");
    if (!confirmEnd) return;

    try {
      setEnding(true);

      await fetch("/api/sessions/end", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ sessionId: session.id }),
      });

      localStorage.removeItem("activeSession");
      router.push(`/dashboard/review/${session.id}`);
    } catch (err) {
      console.error("END SESSION ERROR:", err);
      setEnding(false);
    }
  }

  /* ================= UI STATES ================= */

  if (loading) {
    return <div className="p-6 text-gray-600">Loading...</div>;
  }

  if (!session) {
    return <div className="p-6 text-gray-600">Session not found.</div>;
  }

  if (!session.meetingRoom) {
    return (
      <div className="p-6">
        <h2 className="text-xl font-semibold">Waiting for host to start...</h2>
        <p className="text-gray-500 mt-2">
          Join will enable once host clicks start session.
        </p>
      </div>
    );
  }

  if (!token) {
    return (
      <div className="h-screen flex items-center justify-center bg-[#202124] text-white">
        Connecting to session...
      </div>
    );
  }

  /* ================= MAIN UI ================= */

  return (
    <div className="h-screen w-full bg-[#202124] text-white flex flex-col overflow-hidden">
      {/* TOP BAR */}
      <div className="flex items-center justify-between px-6 py-4 bg-[#202124] border-b border-white/10">
        <div className="flex flex-col">
          <div className="font-semibold text-lg">SkillSwap Live Session</div>
          <div className="text-xs text-gray-400 mt-1">
            Room: {session.meetingRoom}
          </div>
        </div>

        <div className="flex items-center gap-3">
          
        </div>
      </div>

      {/* LIVEKIT VIDEO */}
      <div className="flex-1 min-h-0">
        <LiveKitRoom
          token={token}
          serverUrl={process.env.NEXT_PUBLIC_LIVEKIT_URL}
          connect={true}
          video={true}
          audio={true}
          onDisconnected={() => {
            console.log("User temporarily disconnected");
            router.push("/dashboard/skillmeet");
          }}
          className="h-full w-full"
        >
          <RoomContent />
        </LiveKitRoom>
      </div>
    </div>
  );
}