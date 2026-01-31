// "use client";

// import { useEffect, useState } from "react";

// type AdminStats = {
//   users: number;
//   skills: number;
//   swaps: number;
// };

// export default function AdminDashboard() {
//   const [stats, setStats] = useState<AdminStats | null>(null);
//   const [loading, setLoading] = useState(true);

//   async function loadStats() {
//     try {
//       const res = await fetch("/api/admin/states", {
//         credentials: "include",
//       });

//       if (!res.ok) {
//         throw new Error("Failed to load admin stats");
//       }

//       const data = await res.json();
//       setStats(data);
//     } catch (err) {
//       console.error("Admin stats error:", err);
//     } finally {
//       setLoading(false);
//     }
//   }

//   useEffect(() => {
//     loadStats();
//   }, []);

//   return (
//     <div className="space-y-8">
//       {/* HEADER */}
//       <div className="flex justify-between items-center">
//         <div>
//           <h1 className="text-2xl font-bold">Dashboard Overview</h1>
//           <p className="text-gray-600 text-sm">
//             Monitor SkillSwap health, activity, and membership.
//           </p>
//         </div>

//         <div className="flex items-center gap-3">
//           <input
//             placeholder="Search users, swaps, reports..."
//             className="border rounded-lg px-3 py-2 text-sm"
//           />
//           <div className="w-9 h-9 rounded-full bg-[#0f3d2e] text-white flex items-center justify-center font-bold">
//             AD
//           </div>
//         </div>
//       </div>

//       {/* STATS */}
//       <div className="grid grid-cols-3 gap-4">
//         <StatCard
//           title="Total Users"
//           value={loading ? "—" : stats?.users ?? 0}
//           note="Registered users"
//         />

//         <StatCard
//           title="Total Skills"
//           value={loading ? "—" : stats?.skills ?? 0}
//           note="Skills listed on platform"
//         />

//         <StatCard
//           title="Swap Requests"
//           value={loading ? "—" : stats?.swaps ?? 0}
//           note="All-time swap requests"
//         />
//       </div>

//       {/* TABLES (still static for now – we’ll wire these next) */}
//       <div className="grid grid-cols-2 gap-6">
//         {/* USERS */}
//         <div className="bg-white rounded-xl shadow p-5">
//           <h3 className="font-semibold mb-4">Recent Users</h3>
//           <table className="w-full text-sm">
//             <thead className="text-left text-gray-500">
//               <tr>
//                 <th>Name</th>
//                 <th>Status</th>
//               </tr>
//             </thead>
//             <tbody>
//               {[
//                 ["Jane Miller", "Active"],
//                 ["Arun Patel", "Active"],
//                 ["Lea Schneider", "Premium"],
//                 ["Carlos Lopez", "Suspended"],
//               ].map(([name, status]) => (
//                 <tr key={name} className="border-t">
//                   <td className="py-2">{name}</td>
//                   <td>
//                     <span
//                       className={`px-2 py-1 rounded text-xs ${
//                         status === "Active"
//                           ? "bg-green-100 text-green-700"
//                           : status === "Premium"
//                           ? "bg-orange-100 text-orange-700"
//                           : "bg-red-100 text-red-700"
//                       }`}
//                     >
//                       {status}
//                     </span>
//                   </td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         </div>

//         {/* SWAPS */}
//         <div className="bg-white rounded-xl shadow p-5">
//           <h3 className="font-semibold mb-4">Swap Requests</h3>
//           <ul className="space-y-3 text-sm">
//             {[
//               ["Ana → Sam", "Pending"],
//               ["Mei → Jordan", "Accepted"],
//               ["Omar → Dana", "Rejected"],
//             ].map(([pair, status]) => (
//               <li key={pair} className="flex justify-between">
//                 <span>{pair}</span>
//                 <span
//                   className={`px-2 py-1 rounded text-xs ${
//                     status === "Pending"
//                       ? "bg-yellow-100 text-yellow-700"
//                       : status === "Accepted"
//                       ? "bg-green-100 text-green-700"
//                       : "bg-red-100 text-red-700"
//                   }`}
//                 >
//                   {status}
//                 </span>
//               </li>
//             ))}
//           </ul>
//         </div>
//       </div>
//     </div>
//   );
// }

// /* =========================
//    REUSABLE STAT CARD
// ========================= */
// function StatCard({
//   title,
//   value,
//   note,
// }: {
//   title: string;
//   value: number | string;
//   note: string;
// }) {
//   return (
//     <div className="bg-white rounded-xl p-5 shadow-sm">
//       <p className="text-sm text-gray-600">{title}</p>
//       <h2 className="text-2xl font-bold">{value}</h2>
//       <p className="text-xs text-gray-500 mt-1">{note}</p>
//     </div>
//   );
// }


"use client";

import { useEffect, useState } from "react";

type AdminData = {
  users: number;
  skills: number;
  swaps: number;
  premium: number;
  recentUsers: any[];
  recentSwaps: any[];
};

export default function AdminDashboard() {
  const [data, setData] = useState<AdminData | null>(null);
  const [loading, setLoading] = useState(true);

  async function loadStats() {
    try {
      const res = await fetch("/api/admin/states", {
        credentials: "include",
      });

      const json = await res.json();
      setData(json);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadStats();
  }, []);

  return (
    <div className="space-y-8">

      {/* ================= HEADER ================= */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">Dashboard Overview</h1>
          <p className="text-gray-600 text-sm">
            Monitor SkillSwap health, activity, and membership.
          </p>
        </div>
      </div>

      {/* ================= STATS ================= */}
      <div className="grid grid-cols-4 gap-4">
        <StatCard title="Total Users" value={loading ? "—" : data?.users ?? 0} />
        <StatCard title="Total Skills" value={loading ? "—" : data?.skills ?? 0} />
        <StatCard title="Swap Requests" value={loading ? "—" : data?.swaps ?? 0} />
        <StatCard title="Premium Users ⭐" value={loading ? "—" : data?.premium ?? 0} />
      </div>

      {/* ================= TABLES ================= */}
      <div className="grid grid-cols-2 gap-6">

        {/* ================= RECENT USERS ================= */}
        <div className="bg-white rounded-xl shadow p-5">
          <h3 className="font-semibold mb-4">Recent Users</h3>

          <table className="w-full text-sm">
            <thead className="text-left text-gray-500">
              <tr>
                <th>Name</th>
                <th>Status</th>
                <th>Membership</th>
              </tr>
            </thead>

            <tbody>
              {data?.recentUsers.map((u) => (
                <tr key={u.id} className="border-t">
                  <td className="py-2">
                    {u.firstName} {u.lastName}
                  </td>

                  <td>
                    <Badge
                      color={
                        u.status === "ACTIVE"
                          ? "green"
                          : "red"
                      }
                    >
                      {u.status}
                    </Badge>
                  </td>

                  <td>
                    <Badge
                      color={
                        u.membership === "PREMIUM"
                          ? "orange"
                          : "gray"
                      }
                    >
                      {u.membership}
                    </Badge>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* ================= RECENT SWAPS ================= */}
        <div className="bg-white rounded-xl shadow p-5">
          <h3 className="font-semibold mb-4">Recent Swap Requests</h3>

          <ul className="space-y-3 text-sm">
            {data?.recentSwaps.map((s) => (
              <li key={s.id} className="flex justify-between">

                <span>
                  {s.requester.firstName} → {s.receiver.firstName}
                </span>

                <Badge
                  color={
                    s.status === "PENDING"
                      ? "yellow"
                      : s.status === "ACCEPTED"
                      ? "green"
                      : "red"
                  }
                >
                  {s.status}
                </Badge>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

/* ================= STAT CARD ================= */
function StatCard({ title, value }: any) {
  return (
    <div className="bg-white rounded-xl p-5 shadow-sm">
      <p className="text-sm text-gray-600">{title}</p>
      <h2 className="text-2xl font-bold">{value}</h2>
    </div>
  );
}

/* ================= BADGE ================= */
function Badge({ children, color }: any) {
  const colors: any = {
    green: "bg-green-100 text-green-700",
    red: "bg-red-100 text-red-700",
    yellow: "bg-yellow-100 text-yellow-700",
    orange: "bg-orange-100 text-orange-700",
    gray: "bg-gray-100 text-gray-700",
  };

  return (
    <span className={`px-2 py-1 rounded text-xs ${colors[color]}`}>
      {children}
    </span>
  );
}
