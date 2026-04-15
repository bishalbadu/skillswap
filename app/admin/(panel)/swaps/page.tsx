// "use client";

// import { useEffect, useState } from "react";

// export default function AdminSwapsPage() {
//   const [swaps, setSwaps] = useState<any[]>([]);

//   useEffect(() => {
//     load();
//   }, []);

//   async function load() {
//     const res = await fetch("/api/admin/swaps");
//     const data = await res.json();
//     setSwaps(data.swaps || []);
//   }

//   async function cancelSwap(id: number) {
//     if (!confirm("Force cancel this swap?")) return;

//     await fetch(`/api/admin/swaps/${id}/cancel`, {
//       method: "PATCH",
//     });

//     load();
//   }

//   return (
//     <div className="p-8">
//       <h1 className="text-2xl font-bold mb-6">Swap Requests</h1>

//       <div className="bg-white rounded-xl border shadow overflow-auto">
//         <table className="w-full text-sm">
//           <thead className="bg-gray-50 text-gray-600">
//             <tr>
//               <th className="p-3 text-left">Requester</th>
//               <th className="p-3 text-left">Receiver</th>
//               <th className="p-3 text-left">Skill</th>
//               <th className="p-3 text-left">Slot</th>
//               <th className="p-3 text-left">Status</th>
//               <th className="p-3 text-left">Date</th>
//             </tr>
//           </thead>

//           <tbody>
//             {swaps.map((s) => (
//               <tr key={s.id} className="border-t">
//                 <td className="p-3">
//                   {s.requester.firstName} {s.requester.lastName}
//                   <div className="text-xs text-gray-500">{s.requester.email}</div>
//                 </td>

//                 <td className="p-3">
//                   {s.receiver.firstName} {s.receiver.lastName}
//                   <div className="text-xs text-gray-500">{s.receiver.email}</div>
//                 </td>

//                 <td className="p-3">{s.skill.name}</td>

//                 <td className="p-3">
//                   {s.slot.day} {s.slot.timeFrom}-{s.slot.timeTo}
//                 </td>

//                 <td className="p-3">
//                   <span
//                     className={`px-2 py-1 rounded text-xs
//                     ${s.status === "PENDING" && "bg-yellow-100 text-yellow-700"}
//                     ${s.status === "ACCEPTED" && "bg-green-100 text-green-700"}
//                     ${s.status === "REJECTED" && "bg-red-100 text-red-700"}`}
//                   >
//                     {s.status}
//                   </span>
//                 </td>

//                 <td className="p-3">
//                   {new Date(s.createdAt).toLocaleDateString()}
//                 </td>
//               </tr>
//             ))}
//           </tbody>
//         </table>
//       </div>
//     </div>
//   );
// }


"use client";

import { useEffect, useState } from "react";

export default function AdminSwapsPage() {
  const [swaps, setSwaps] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // ✅ Filters
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");

  // ✅ Pagination
  const [page, setPage] = useState(1);
  const itemsPerPage = 6;

  useEffect(() => {
    load();
  }, []);

  async function load() {
    setLoading(true);

    const res = await fetch("/api/admin/swaps");
    const data = await res.json();

    setSwaps(data.swaps || []);
    setPage(1);
    setLoading(false);
  }

  async function cancelSwap(id: number) {
    if (!confirm("Force cancel this swap?")) return;

    await fetch(`/api/admin/swaps/${id}/cancel`, {
      method: "PATCH",
    });

    load();
  }

  // ================= FILTER LOGIC =================
  const filtered = swaps.filter((s) => {
    const matchSearch = s.skill.name
      .toLowerCase()
      .includes(search.toLowerCase());

    const matchStatus = status ? s.status === status : true;

    return matchSearch && matchStatus;
  });

  // ================= PAGINATION =================
  const totalPages = Math.ceil(filtered.length / itemsPerPage);
  const start = (page - 1) * itemsPerPage;
  const currentSwaps = filtered.slice(start, start + itemsPerPage);

  return (
    <div className="p-8 space-y-6">

      {/* HEADER */}
      <h1 className="text-2xl font-bold">Swap Requests</h1>

      {/* FILTER BAR */}
      <div className="bg-white p-4 rounded-xl shadow flex gap-3">

        <input
          placeholder="Search skill..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border px-3 py-2 rounded w-64"
        />

        <select
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          className="border px-3 py-2 rounded"
        >
          <option value="">All Status</option>
          <option value="PENDING">Pending</option>
          <option value="ACCEPTED">Accepted</option>
          <option value="REJECTED">Rejected</option>
        </select>

        <button
          onClick={() => setPage(1)}
          className="px-4 py-2 bg-black text-white rounded"
        >
          Apply
        </button>

      </div>

      {/* TABLE */}
      <div className="bg-white rounded-xl border shadow overflow-auto">

        <table className="w-full text-sm">
          <thead className="bg-gray-50 text-gray-600">
            <tr>
              <th className="p-3 text-left">Requester</th>
              <th className="p-3 text-left">Receiver</th>
              <th className="p-3 text-left">Skill</th>
              <th className="p-3 text-left">Slot</th>
              <th className="p-3 text-left">Status</th>
              <th className="p-3 text-left">Date</th>
            </tr>
          </thead>

          <tbody>
            {currentSwaps.length === 0 ? (
              <tr>
                <td colSpan={6} className="p-6 text-center text-gray-500">
                  No swaps found
                </td>
              </tr>
            ) : (
              currentSwaps.map((s) => (
                <tr key={s.id} className="border-t hover:bg-gray-50">

                  <td className="p-3">
                    {s.requester.firstName} {s.requester.lastName}
                    <div className="text-xs text-gray-500">
                      {s.requester.email}
                    </div>
                  </td>

                  <td className="p-3">
                    {s.receiver.firstName} {s.receiver.lastName}
                    <div className="text-xs text-gray-500">
                      {s.receiver.email}
                    </div>
                  </td>

                  <td className="p-3">{s.skill.name}</td>

                  <td className="p-3">
                    {s.slot.day} {s.slot.timeFrom}-{s.slot.timeTo}
                  </td>

                  <td className="p-3">
                    <span
                      className={`px-2 py-1 rounded text-xs
                      ${s.status === "PENDING" && "bg-yellow-100 text-yellow-700"}
                      ${s.status === "ACCEPTED" && "bg-green-100 text-green-700"}
                      ${s.status === "REJECTED" && "bg-red-100 text-red-700"}`}
                    >
                      {s.status}
                    </span>
                  </td>

                  <td className="p-3">
                    {new Date(s.createdAt).toLocaleDateString()}
                  </td>

                </tr>
              ))
            )}
          </tbody>
        </table>

        {/* PAGINATION */}
        <div className="flex justify-between items-center px-6 py-4 border-t">

          <button
            onClick={() => setPage((p) => p - 1)}
            disabled={page === 1}
            className="px-4 py-2 text-sm border rounded disabled:opacity-50 hover:bg-gray-100"
          >
            ← Prev
          </button>

          <p className="text-sm text-gray-600">
            Page {page} of {totalPages || 1}
          </p>

          <button
            onClick={() => setPage((p) => p + 1)}
            disabled={page === totalPages || totalPages === 0}
            className="px-4 py-2 text-sm border rounded disabled:opacity-50 hover:bg-gray-100"
          >
            Next →
          </button>

        </div>

      </div>
    </div>
  );
}