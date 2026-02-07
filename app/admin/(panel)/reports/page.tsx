// "use client";

// import { useEffect, useState } from "react";
// import Link from "next/link";

// export default function AdminReportsPage() {
//   const [reports, setReports] = useState<any[]>([]);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     loadReports();
//   }, []);

//   async function loadReports() {
//     const res = await fetch("/api/admin/reports", {
//       credentials: "include",
//     });
//     const data = await res.json();
//     setReports(data.reports || []);
//     setLoading(false);
//   }

//   async function markReviewed(id: number) {
//     await fetch(`/api/admin/reports/${id}`, {
//       method: "PATCH",
//       credentials: "include",
//     });
//     loadReports();
//   }

//   if (loading) return <p>Loading reports...</p>;

//   return (
//     <div className="space-y-6">
//       <h1 className="text-2xl font-bold">User Reports</h1>

//       {reports.length === 0 && (
//         <p className="text-gray-500">No reports submitted.</p>
//       )}

//       {reports.map((r) => (
//         <div
//           key={r.id}
//           className="bg-white border rounded-xl p-5 space-y-2"
//         >
//           <div className="flex justify-between">
//             <div>
//               <p className="font-semibold">
//                 🚨 {r.reason.replace("_", " ")}
//               </p>
//               <p className="text-sm text-gray-600">
//                 Reported on {new Date(r.createdAt).toLocaleString()}
//               </p>
//             </div>

//             <span
//   className={`inline-flex items-center w-fit text-xs px-2 py-0.5 rounded ${
//     r.status === "PENDING"
//       ? "bg-yellow-100 text-yellow-800"
//       : "bg-green-100 text-green-700"
//   }`}
// >
//   {r.status}
// </span>

//           </div>

//           <p className="text-sm">
//             <b>Reporter:</b> {r.reporter.firstName} {r.reporter.lastName} ({r.reporter.email})
//           </p>

//           <p className="text-sm">
//             <b>Reported User:</b> {r.reportedUser.firstName} {r.reportedUser.lastName} ({r.reportedUser.email})
//           </p>

//           {r.message && (
//             <p className="text-sm italic bg-gray-50 p-3 rounded">
//               “{r.message}”
//             </p>
//           )}

//           <div className="flex gap-3 pt-2">
//             {r.status === "PENDING" && (
//               <button
//                 onClick={() => markReviewed(r.id)}
//                 className="px-4 py-2 text-sm border rounded hover:bg-gray-100"
//               >
//                 Mark as Reviewed
//               </button>
//             )}

//             <Link
//               href={`/admin/users?highlight=${r.reportedUser.id}`}
//               className="px-4 py-2 text-sm border rounded text-[#4a5e27] hover:bg-[#eef2ea]"
//             >
//               Take Action →
//             </Link>
//           </div>
//         </div>
//       ))}
//     </div>
//   );
// }

"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

export default function AdminReportsPage() {
  const [reports, setReports] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadReports();
  }, []);

  async function loadReports() {
    const res = await fetch("/api/admin/reports", {
      credentials: "include",
    });
    const data = await res.json();
    setReports(data.reports || []);
    setLoading(false);
  }

  async function markReviewed(id: number) {
    await fetch(`/api/admin/reports/${id}`, {
      method: "PATCH",
      credentials: "include",
    });
    loadReports();
  }

  if (loading) {
    return <p className="text-gray-500">Loading reports...</p>;
  }

  return (
    <div className="space-y-6">
      {/* HEADER */}
      <h1 className="text-2xl font-bold">User Reports</h1>

      {/* EMPTY STATE */}
      {reports.length === 0 && (
        <p className="text-gray-500">No reports submitted.</p>
      )}

      {/* REPORT CARDS */}
      {reports.map((r) => (
        <div
          key={r.id}
          className="bg-white border rounded-xl p-5 space-y-3"
        >
          {/* HEADER */}
          <div className="flex justify-between items-start">
            <div>
              <p className="font-semibold">
                🚨 {r.reason.replace("_", " ")}
              </p>
              <p className="text-sm text-gray-600">
                Reported on {new Date(r.createdAt).toLocaleString()}
              </p>
            </div>

            {/* STATUS BADGE (SMALL WIDTH) */}
            <span
              className={`inline-flex items-center w-fit text-xs px-2 py-0.5 rounded ${
                r.status === "PENDING"
                  ? "bg-yellow-100 text-yellow-800"
                  : "bg-green-100 text-green-700"
              }`}
            >
              {r.status}
            </span>
          </div>

          {/* REPORTER */}
          <p className="text-sm">
            <b>Reporter:</b> {r.reporter.firstName}{" "}
            {r.reporter.lastName} ({r.reporter.email})
          </p>

          {/* REPORTED USER */}
          <p className="text-sm">
            <b>Reported User:</b> {r.reportedUser.firstName}{" "}
            {r.reportedUser.lastName} ({r.reportedUser.email})
          </p>

          {/* MESSAGE */}
          {r.message && (
            <p className="text-sm italic bg-gray-50 p-3 rounded">
              “{r.message}”
            </p>
          )}

          {/* ACTIONS */}
          <div className="flex gap-3 pt-2">
            {r.status === "PENDING" && (
              <button
                onClick={() => markReviewed(r.id)}
                className="px-4 py-2 text-sm border rounded hover:bg-gray-100"
              >
                Mark as Reviewed
              </button>
            )}

            <Link
              href={`/admin/users?highlight=${r.reportedUser.id}`}
              className="px-4 py-2 text-sm border rounded text-[#4a5e27] hover:bg-[#eef2ea]"
            >
              Take Action →
            </Link>
          </div>
        </div>
      ))}
    </div>
  );
}
