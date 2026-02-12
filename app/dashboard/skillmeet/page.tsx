// "use client";

// import { useEffect, useMemo, useState } from "react";
// import Link from "next/link";

// type Tab = "UPCOMING" | "COMPLETED" | "CANCELLED";

// function fmtDate(d: string) {
//   const date = new Date(d);
//   return date.toLocaleDateString("en-US", { weekday: "short", month: "short", day: "2-digit", year: "numeric" });
// }

// export default function SkillMeetPage() {
//   const [tab, setTab] = useState<Tab>("UPCOMING");
//   const [q, setQ] = useState("");
//   const [sessions, setSessions] = useState<any[]>([]);
//   const [loading, setLoading] = useState(true);

//   async function load() {
//     setLoading(true);
//     const res = await fetch(`/api/sessions?status=${tab}`, { credentials: "include", cache: "no-store" });
//     const data = await res.json();
//     setSessions(data.sessions || []);
//     setLoading(false);
//   }

//   useEffect(() => {
//     load();
//     const t = setInterval(load, 5000); // ✅ "real time" by polling
//     return () => clearInterval(t);
//   }, [tab]);

//   const filtered = useMemo(() => {
//     const term = q.trim().toLowerCase();
//     if (!term) return sessions;
//     return sessions.filter((s) => {
//       const name = `${s.host.firstName} ${s.host.lastName} ${s.guest.firstName} ${s.guest.lastName}`.toLowerCase();
//       const skill = (s.skill?.name || "").toLowerCase();
//       return name.includes(term) || skill.includes(term);
//     });
//   }, [q, sessions]);

//   return (
//     <div className="min-h-screen">
//       {/* header like your UI */}
//       <div className="flex items-center justify-between mb-6">
//         <div>
//           <h1 className="text-2xl font-semibold text-gray-900">My Skill Session</h1>
//           <p className="text-gray-500 text-sm">Track your upcoming, active, and past classes in one place.</p>
//         </div>

//         <div className="w-[420px]">
//           <input
//             value={q}
//             onChange={(e) => setQ(e.target.value)}
//             placeholder="Search session with skill name"
//             className="w-full border rounded-full px-4 py-2 text-sm outline-none focus:ring-2 focus:ring-green-200"
//           />
//         </div>
//       </div>

//       {/* tabs */}
//       <div className="flex items-center gap-2 mb-5">
//         <TabBtn active={tab === "UPCOMING"} onClick={() => setTab("UPCOMING")}>Upcoming</TabBtn>
//         <TabBtn active={tab === "COMPLETED"} onClick={() => setTab("COMPLETED")}>Completed</TabBtn>
//         <TabBtn active={tab === "CANCELLED"} onClick={() => setTab("CANCELLED")}>Cancelled</TabBtn>
//       </div>

//       {loading ? (
//         <p className="text-gray-500">Loading...</p>
//       ) : filtered.length === 0 ? (
//         <p className="text-gray-500">No classes found.</p>
//       ) : (
//         <div className="grid grid-cols-3 gap-4">
//           {filtered.map((s) => {
//             const isLive = s.status === "LIVE";
//             const waiting = !s.meetingRoom && s.status === "UPCOMING";
//             const completed = s.status === "COMPLETED";
//             const canJoin = !!s.meetingRoom && (isLive || s.status === "UPCOMING");

//             // if user is host show Start/End
//             return (
//               <div key={s.id} className="bg-white border rounded-2xl p-4 shadow-sm">
//                 <div className="flex items-start justify-between">
//                   <div>
//                     <h3 className="font-semibold text-gray-900">
//                       {s.skill?.name || "Session"}
//                     </h3>
//                     <p className="text-xs text-gray-500">
//                       With: {s.host.firstName} {s.host.lastName} / {s.guest.firstName} {s.guest.lastName}
//                     </p>
//                   </div>

//                   <Pill status={s.status} waiting={waiting} />
//                 </div>

//                 <div className="mt-3 text-sm text-gray-700 space-y-1">
//                   <div className="flex justify-between">
//                     <span className="text-gray-500">Date</span>
//                     <span>{s.slot?.date ? fmtDate(s.slot.date) : "-"}</span>
//                   </div>
//                   <div className="flex justify-between">
//                     <span className="text-gray-500">Time</span>
//                     <span>{s.slot?.timeFrom} - {s.slot?.timeTo}</span>
//                   </div>
//                   <div className="flex justify-between">
//                     <span className="text-gray-500">Mode</span>
//                     <span>Online</span>
//                   </div>
//                 </div>

//                 <div className="mt-4 flex items-center gap-2">
//                   <Link
//                     href={canJoin ? `/dashboard/skillmeet/${s.id}` : "#"}
//                     className={`px-4 py-2 rounded-full text-sm font-medium ${
//                       canJoin ? "bg-green-600 text-white hover:bg-green-700" : "bg-gray-200 text-gray-500 cursor-not-allowed"
//                     }`}
//                     onClick={(e) => {
//                       if (!canJoin) e.preventDefault();
//                     }}
//                   >
//                     Join Class
//                   </Link>

//                   {/* host actions */}
//                   <HostControls session={s} onDone={load} />
//                 </div>

//                 <div className="mt-2 text-xs text-gray-500">
//                   {waiting && "Join will be enabled once host starts the class"}
//                   {completed && "Class already completed"}
//                 </div>
//               </div>
//             );
//           })}
//         </div>
//       )}
//     </div>
//   );
// }

// function TabBtn({ active, onClick, children }: any) {
//   return (
//     <button
//       onClick={onClick}
//       className={`px-4 py-2 rounded-full text-sm border ${
//         active ? "bg-green-600 text-white border-green-600" : "bg-white text-gray-700"
//       }`}
//     >
//       {children}
//     </button>
//   );
// }

// function Pill({ status, waiting }: any) {
//   if (waiting) return <span className="text-xs px-3 py-1 rounded-full bg-gray-100 text-gray-600">Waiting for link</span>;
//   if (status === "UPCOMING") return <span className="text-xs px-3 py-1 rounded-full bg-green-100 text-green-700">Upcoming</span>;
//   if (status === "LIVE") return <span className="text-xs px-3 py-1 rounded-full bg-blue-100 text-blue-700">Live</span>;
//   if (status === "COMPLETED") return <span className="text-xs px-3 py-1 rounded-full bg-gray-100 text-gray-600">Completed</span>;
//   if (status === "CANCELLED") return <span className="text-xs px-3 py-1 rounded-full bg-red-100 text-red-700">Cancelled</span>;
//   return <span className="text-xs px-3 py-1 rounded-full bg-gray-100 text-gray-600">{status}</span>;
// }

// function HostControls({ session, onDone }: any) {
//   const [me, setMe] = useState<any>(null);
//   const [loading, setLoading] = useState(false);

//   useEffect(() => {
//     fetch("/api/auth/me", { credentials: "include" })
//       .then((r) => r.json())
//       .then((d) => setMe(d.user));
//   }, []);

//   if (!me) return null;
//   const isHost = me.id === session.hostId;

//   if (!isHost) return null;

//   async function start() {
//     setLoading(true);
//     await fetch("/api/sessions/start", {
//       method: "POST",
//       headers: { "Content-Type": "application/json" },
//       credentials: "include",
//       body: JSON.stringify({ sessionId: session.id }),
//     });
//     setLoading(false);
//     onDone();
//   }

//   async function end() {
//     setLoading(true);
//     await fetch("/api/sessions/end", {
//       method: "POST",
//       headers: { "Content-Type": "application/json" },
//       credentials: "include",
//       body: JSON.stringify({ sessionId: session.id }),
//     });
//     setLoading(false);
//     onDone();
//   }

//   return (
//     <>
//       {session.status === "UPCOMING" && (
//         <button
//           disabled={loading}
//           onClick={start}
//           className="px-4 py-2 rounded-full text-sm border bg-white hover:bg-gray-50"
//         >
//           Start
//         </button>
//       )}

//       {session.status === "LIVE" && (
//         <button
//           disabled={loading}
//           onClick={end}
//           className="px-4 py-2 rounded-full text-sm border bg-white hover:bg-gray-50"
//         >
//           End
//         </button>
//       )}
//     </>
//   );
// }




"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";

type Tab = "UPCOMING" | "COMPLETED" | "CANCELLED" | "EXPIRED";

function fmtDate(d: string) {
  const date = new Date(d);
  return date.toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "2-digit",
    year: "numeric",
  });
}

export default function SkillMeetPage() {
  const [tab, setTab] = useState<Tab>("UPCOMING");
  const [q, setQ] = useState("");
  const [sessions, setSessions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  async function load() {
    setLoading(true);
    const res = await fetch(`/api/sessions?status=${tab}`, {
      credentials: "include",
      cache: "no-store",
    });
    const data = await res.json();
    setSessions(data.sessions || []);
    setLoading(false);
  }

  useEffect(() => {
    load();
    const t = setInterval(load, 5000); // polling
    return () => clearInterval(t);
  }, [tab]);

  const filtered = useMemo(() => {
    const term = q.trim().toLowerCase();
    if (!term) return sessions;
    return sessions.filter((s) => {
      const name = `${s.host.firstName} ${s.host.lastName} ${s.guest.firstName} ${s.guest.lastName}`.toLowerCase();
      const skill = (s.skill?.name || "").toLowerCase();
      return name.includes(term) || skill.includes(term);
    });
  }, [q, sessions]);

  return (
    <div className="min-h-screen">
      {/* HEADER */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">
            My Skill Sessions
          </h1>
          <p className="text-gray-500 text-sm">
            Track your upcoming, active, and past sessions.
          </p>
        </div>

        <div className="w-[420px]">
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search session with skill name"
            className="w-full border rounded-full px-4 py-2 text-sm outline-none focus:ring-2 focus:ring-green-200"
          />
        </div>
      </div>

      {/* TABS */}
      <div className="flex items-center gap-2 mb-5">
        <TabBtn active={tab === "UPCOMING"} onClick={() => setTab("UPCOMING")}>
          Upcoming
        </TabBtn>
        <TabBtn active={tab === "COMPLETED"} onClick={() => setTab("COMPLETED")}>
          Completed
        </TabBtn>
        <TabBtn active={tab === "CANCELLED"} onClick={() => setTab("CANCELLED")}>
          Cancelled
        </TabBtn>
        <TabBtn active={tab === "EXPIRED"} onClick={() => setTab("EXPIRED")}>
          Expired
        </TabBtn>
      </div>

      {loading ? (
        <p className="text-gray-500">Loading...</p>
      ) : filtered.length === 0 ? (
        <p className="text-gray-500">No sessions found.</p>
      ) : (
        <div className="grid grid-cols-3 gap-4">
          {filtered.map((s) => {
            const isLive = s.status === "LIVE";
            const isExpired = s.status === "EXPIRED";
            const isCompleted = s.status === "COMPLETED";

            const waiting =
              !s.meetingRoom && s.status === "UPCOMING";

            const canJoin =
              !!s.meetingRoom &&
              (s.status === "LIVE" || s.status === "UPCOMING");

            return (
              <div
                key={s.id}
                className="bg-white border rounded-2xl p-4 shadow-sm"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-semibold text-gray-900">
                      {s.skill?.name || "Session"}
                    </h3>
                    <p className="text-xs text-gray-500">
                      With: {s.host.firstName} {s.host.lastName} /{" "}
                      {s.guest.firstName} {s.guest.lastName}
                    </p>
                  </div>

                  <Pill status={s.status} waiting={waiting} />
                </div>

                <div className="mt-3 text-sm text-gray-700 space-y-1">
                  <div className="flex justify-between">
                    <span className="text-gray-500">Date</span>
                    <span>
                      {s.slot?.date ? fmtDate(s.slot.date) : "-"}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Time</span>
                    <span>
                      {s.slot?.timeFrom} - {s.slot?.timeTo}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Mode</span>
                    <span>Online</span>
                  </div>
                </div>

                <div className="mt-4 flex items-center gap-2">
                  <Link
                    href={canJoin ? `/dashboard/skillmeet/${s.id}` : "#"}
                    className={`px-4 py-2 rounded-full text-sm font-medium ${
                      canJoin
                        ? "bg-green-600 text-white hover:bg-green-700"
                        : "bg-gray-200 text-gray-500 cursor-not-allowed"
                    }`}
                    onClick={(e) => {
                      if (!canJoin) e.preventDefault();
                    }}
                  >
                    Join Session
                  </Link>

                  <HostControls session={s} onDone={load} />
                </div>

                <div className="mt-2 text-xs text-gray-500">
                  {waiting &&
                    "Join will be enabled once host starts the session."}
                  {isExpired &&
                    "This session expired because no one joined."}
                  {isCompleted &&
                    "This session has been completed."}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

/* ================= TAB BUTTON ================= */

function TabBtn({ active, onClick, children }: any) {
  return (
    <button
      onClick={onClick}
      className={`px-4 py-2 rounded-full text-sm border ${
        active
          ? "bg-green-600 text-white border-green-600"
          : "bg-white text-gray-700"
      }`}
    >
      {children}
    </button>
  );
}

/* ================= STATUS PILL ================= */

function Pill({ status, waiting }: any) {
  if (waiting)
    return (
      <span className="text-xs px-3 py-1 rounded-full bg-gray-100 text-gray-600">
        Waiting
      </span>
    );

  if (status === "UPCOMING")
    return (
      <span className="text-xs px-3 py-1 rounded-full bg-green-100 text-green-700">
        Upcoming
      </span>
    );

  if (status === "LIVE")
    return (
      <span className="text-xs px-3 py-1 rounded-full bg-blue-100 text-blue-700">
        Live
      </span>
    );

  if (status === "COMPLETED")
    return (
      <span className="text-xs px-3 py-1 rounded-full bg-gray-100 text-gray-600">
        Completed
      </span>
    );

  if (status === "CANCELLED")
    return (
      <span className="text-xs px-3 py-1 rounded-full bg-red-100 text-red-700">
        Cancelled
      </span>
    );

  if (status === "EXPIRED")
    return (
      <span className="text-xs px-3 py-1 rounded-full bg-yellow-100 text-yellow-700">
        Expired
      </span>
    );

  return (
    <span className="text-xs px-3 py-1 rounded-full bg-gray-100 text-gray-600">
      {status}
    </span>
  );
}

/* ================= HOST CONTROLS ================= */

function HostControls({ session, onDone }: any) {
  const [me, setMe] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetch("/api/auth/me", { credentials: "include" })
      .then((r) => r.json())
      .then((d) => setMe(d.user));
  }, []);

  if (!me) return null;
  const isHost = me.id === session.hostId;

  if (!isHost) return null;

  async function start() {
    setLoading(true);
    await fetch("/api/sessions/start", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ sessionId: session.id }),
    });
    setLoading(false);
    onDone();
  }

  async function end() {
    setLoading(true);
    await fetch("/api/sessions/end", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ sessionId: session.id }),
    });
    setLoading(false);
    onDone();
  }

  return (
    <>
      {session.status === "UPCOMING" && (
        <button
          disabled={loading}
          onClick={start}
          className="px-4 py-2 rounded-full text-sm border bg-white hover:bg-gray-50"
        >
          Start
        </button>
      )}

      {session.status === "LIVE" && (
        <button
          disabled={loading}
          onClick={end}
          className="px-4 py-2 rounded-full text-sm border bg-white hover:bg-gray-50"
        >
          End
        </button>
      )}
    </>
  );
}
