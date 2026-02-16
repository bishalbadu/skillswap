// "use client";

// import { useEffect, useState, useRef } from "react";
// import { useSearchParams } from "next/navigation";

// export default function AdminUsersPage() {
//   const [users, setUsers] = useState<any[]>([]);
//   const [query, setQuery] = useState("");
//   const [status, setStatus] = useState("");
//   const [membership, setMembership] = useState("");
//   const [selectedUser, setSelectedUser] = useState<any>(null);

//   const searchParams = useSearchParams();
//   const highlightId = Number(searchParams.get("highlight"));

//   const rowRefs = useRef<Record<number, HTMLTableRowElement | null>>({});

//   /* ================= LOAD USERS ================= */
//   async function loadUsers() {
//     const res = await fetch(
//       `/api/admin/users?q=${query}&status=${status}&membership=${membership}`,
//       { credentials: "include" }
//     );

//     const data = await res.json();
//     setUsers(data.users || []);
//   }

//   useEffect(() => {
//     loadUsers();
//   }, []);

//   /* ================= AUTO SCROLL TO HIGHLIGHT ================= */
//   useEffect(() => {
//     if (highlightId && rowRefs.current[highlightId]) {
//       rowRefs.current[highlightId]?.scrollIntoView({
//         behavior: "smooth",
//         block: "center",
//       });
//     }
//   }, [users, highlightId]);

//   /* ================= TOGGLE STATUS ================= */
//   async function toggleUser(id: number, current: string) {
//     await fetch(`/api/admin/users/${id}`, {
//       method: "PATCH",
//       headers: { "Content-Type": "application/json" },
//       credentials: "include",
//       body: JSON.stringify({
//         status: current === "ACTIVE" ? "SUSPENDED" : "ACTIVE",
//       }),
//     });

//     loadUsers();
//   }

//   /* ================= VIEW PROFILE ================= */
//   async function viewProfile(id: number) {
//     const res = await fetch(`/api/admin/users/${id}`, {
//       credentials: "include",
//     });

//     const data = await res.json();
//     setSelectedUser(data.user);
//   }

//   return (
//     <div className="space-y-6">
//       <h1 className="text-2xl font-bold">User Management</h1>

//       {/* FILTER BAR */}
//       <div className="bg-white rounded-xl shadow p-4 flex gap-3 flex-wrap">
//         <input
//           placeholder="Search name or email"
//           value={query}
//           onChange={(e) => setQuery(e.target.value)}
//           className="border px-3 py-2 rounded-md text-sm w-[260px]"
//         />

//         <select
//           value={status}
//           onChange={(e) => setStatus(e.target.value)}
//           className="border px-3 py-2 rounded-md text-sm"
//         >
//           <option value="">All Status</option>
//           <option value="ACTIVE">Active</option>
//           <option value="SUSPENDED">Suspended</option>
//         </select>

//         <select
//           value={membership}
//           onChange={(e) => setMembership(e.target.value)}
//           className="border px-3 py-2 rounded-md text-sm"
//         >
//           <option value="">All Memberships</option>
//           <option value="FREE">Free</option>
//           <option value="PREMIUM">Premium</option>
//         </select>

//         <button
//           onClick={loadUsers}
//           className="bg-[#4a5e27] text-white px-4 rounded-md text-sm"
//         >
//           Apply
//         </button>
//       </div>

//       {/* TABLE */}
//       <div className="bg-white rounded-xl shadow overflow-hidden">
//         <table className="w-full text-sm">
//           <thead className="bg-gray-50 text-gray-600">
//             <tr>
//               <th className="px-6 py-3 text-left">Name</th>
//               <th className="px-6 py-3 text-left">Email</th>
//               <th className="px-6 py-3 text-left">Membership</th>
//               <th className="px-6 py-3 text-left">Status</th>
//               <th className="px-6 py-3 text-left">Joined</th>
//               <th className="px-6 py-3 text-right w-[200px]">Actions</th>
//             </tr>
//           </thead>

//           <tbody>
//             {users.map((u) => (
//              <tr
//   key={u.id}
//   ref={(el) => {
//     rowRefs.current[u.id] = el;
//   }}
//   className={`border-t hover:bg-gray-50/60 ${
//     u.id === highlightId
//       ? "bg-yellow-100 ring-2 ring-yellow-400"
//       : ""
//   }`}
// >

//                 <td className="px-6 py-4 font-medium">
//                   {u.firstName} {u.lastName}
//                 </td>

//                 <td className="px-6 py-4 text-gray-600">
//                   {u.email}
//                 </td>

//                 <td className="px-6 py-4">
//                   <span className="px-2 py-1 rounded text-xs font-medium bg-gray-100">
//                     {u.membership}
//                   </span>
//                 </td>

//                 <td className="px-6 py-4">
//                   <span
//                     className={`px-2 py-1 rounded text-xs font-medium ${
//                       u.status === "ACTIVE"
//                         ? "bg-green-100 text-green-700"
//                         : "bg-red-100 text-red-700"
//                     }`}
//                   >
//                     {u.status}
//                   </span>
//                 </td>

//                 <td className="px-6 py-4 text-gray-600">
//                   {new Date(u.createdAt).toLocaleDateString()}
//                 </td>

//                 <td className="px-6 py-4 text-right">
//                   <div className="flex justify-end gap-4">
//                     <button
//                       onClick={() => viewProfile(u.id)}
//                       className="text-green-700 hover:underline font-medium"
//                     >
//                       View
//                     </button>

//                     <button
//                       onClick={() => toggleUser(u.id, u.status)}
//                       className="text-blue-600 hover:underline font-medium"
//                     >
//                       {u.status === "ACTIVE" ? "Suspend" : "Activate"}
//                     </button>
//                   </div>
//                 </td>
//               </tr>
//             ))}
//           </tbody>
//         </table>
//       </div>

//       {/* PROFILE DRAWER */}
//       {selectedUser && (
//         <div className="bg-white rounded-xl shadow p-6">
//           <h3 className="font-semibold text-lg">
//             {selectedUser.firstName} {selectedUser.lastName}
//           </h3>

//           <p className="text-sm text-gray-600">
//             {selectedUser.email}
//           </p>

//           <div className="grid grid-cols-2 gap-6 mt-4 text-sm">
//             <div><strong>Membership:</strong> {selectedUser.membership}</div>
//             <div><strong>Status:</strong> {selectedUser.status}</div>
//             <div><strong>Joined:</strong> {new Date(selectedUser.createdAt).toLocaleDateString()}</div>
//             <div><strong>Skills:</strong> {selectedUser.skills.map((s: any) => s.name).join(", ")}</div>
//           </div>

//           <div className="mt-4 text-right">
//             <button
//               onClick={() => setSelectedUser(null)}
//               className="px-4 py-1 border rounded"
//             >
//               Close
//             </button>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }


"use client";

import { useEffect, useState, useRef } from "react";
import { useSearchParams } from "next/navigation";

export default function AdminUsersPage() {
  const [users, setUsers] = useState<any[]>([]);
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState("");
  const [membership, setMembership] = useState("");
  const [selectedUser, setSelectedUser] = useState<any>(null);

  const searchParams = useSearchParams();
  const highlightId = Number(searchParams.get("highlight"));

  const rowRefs = useRef<Record<number, HTMLTableRowElement | null>>({});

  /* ================= LOAD USERS ================= */
  async function loadUsers() {
    const res = await fetch(
      `/api/admin/users?q=${query}&status=${status}&membership=${membership}`,
      { credentials: "include" }
    );
    const data = await res.json();
    setUsers(data.users || []);
  }

  useEffect(() => {
    loadUsers();
  }, []);

  /* ================= AUTO SCROLL TO HIGHLIGHT ================= */
  useEffect(() => {
    if (highlightId && rowRefs.current[highlightId]) {
      rowRefs.current[highlightId]?.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
    }
  }, [users, highlightId]);

  /* ================= TOGGLE STATUS ================= */
  async function toggleUser(id: number, current: string) {
    await fetch(`/api/admin/users/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({
        status: current === "ACTIVE" ? "SUSPENDED" : "ACTIVE",
      }),
    });

    loadUsers();
  }

  /* ================= DELETE USER ================= */
  async function deleteUser(id: number, name: string) {
    const ok = confirm(
      `⚠️ Are you sure you want to permanently delete ${name}?\n\nThis action CANNOT be undone.`
    );

    if (!ok) return;

    const res = await fetch(`/api/admin/users/${id}`, {
      method: "DELETE",
      credentials: "include",
    });

    if (!res.ok) {
      const data = await res.json();
      alert(data.error || "Failed to delete user");
      return;
    }

    loadUsers();
  }

  /* ================= VIEW PROFILE ================= */
  async function viewProfile(id: number) {
    const res = await fetch(`/api/admin/users/${id}`, {
      credentials: "include",
    });

    const data = await res.json();
    setSelectedUser(data.user);
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">User Management</h1>

      {/* FILTER BAR */}
      <div className="bg-white rounded-xl shadow p-4 flex gap-3 flex-wrap">
        <input
          placeholder="Search name or email"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="border px-3 py-2 rounded-md text-sm w-[260px]"
        />

        <select
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          className="border px-3 py-2 rounded-md text-sm"
        >
          <option value="">All Status</option>
          <option value="ACTIVE">Active</option>
          <option value="SUSPENDED">Suspended</option>
        </select>

        <select
          value={membership}
          onChange={(e) => setMembership(e.target.value)}
          className="border px-3 py-2 rounded-md text-sm"
        >
          <option value="">All Memberships</option>
          <option value="FREE">Free</option>
          <option value="PREMIUM">Premium</option>
        </select>

        <button
          onClick={loadUsers}
          className="bg-[#4a5e27] text-white px-4 rounded-md text-sm"
        >
          Apply
        </button>
      </div>

      {/* TABLE */}
      <div className="bg-white rounded-xl shadow overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 text-gray-600">
            <tr>
              <th className="px-6 py-3 text-left">Name</th>
              <th className="px-6 py-3 text-left">Email</th>
              <th className="px-6 py-3 text-left">Membership</th>
              <th className="px-6 py-3 text-left">Status</th>
              <th className="px-6 py-3 text-left">Joined</th>
              <th className="px-6 py-3 text-left">Premium Until</th>
              <th className="px-6 py-3 text-left">Completed Swaps</th>
              <th className="px-6 py-3 text-right w-[240px]">Actions</th>
              

            </tr>
          </thead>

          <tbody>
            {users.map((u) => (
              <tr
                key={u.id}
                ref={(el) => {
                  rowRefs.current[u.id] = el;
                }}
                className={`border-t hover:bg-gray-50/60 ${
                  u.id === highlightId
                    ? "bg-yellow-100 ring-2 ring-yellow-400"
                    : ""
                }`}
              >
                <td className="px-6 py-4 font-medium">
                  {u.firstName} {u.lastName}
                </td>

                <td className="px-6 py-4 text-gray-600">{u.email}</td>

                <td className="px-6 py-4">
                  <span className="px-2 py-1 rounded text-xs font-medium bg-gray-100">
                    {u.membership}
                  </span>
                </td>

                <td className="px-6 py-4">
                  <span
                    className={`px-2 py-1 rounded text-xs font-medium ${
                      u.status === "ACTIVE"
                        ? "bg-green-100 text-green-700"
                        : "bg-red-100 text-red-700"
                    }`}
                  >
                    {u.status}
                  </span>
                </td>

                <td className="px-6 py-4 text-gray-600">
                  {new Date(u.createdAt).toLocaleDateString()}
                </td>
              

              <td className="px-6 py-4 text-gray-600">
  {u.premiumUntil
    ? new Date(u.premiumUntil).toLocaleDateString()
    : "-"}
</td>

<td className="px-6 py-4 text-gray-600">
  {u.completedSwaps}
</td>

                {/* ACTIONS */}
                <td className="px-6 py-4 text-right">
                  <div className="flex justify-end gap-4">
                    <button
                      onClick={() => viewProfile(u.id)}
                      className="text-green-700 hover:underline font-medium"
                    >
                      View
                    </button>

                    <button
                      onClick={() => toggleUser(u.id, u.status)}
                      className="text-blue-600 hover:underline font-medium"
                    >
                      {u.status === "ACTIVE" ? "Suspend" : "Activate"}
                    </button>

                    <button
                      onClick={() =>
                        deleteUser(u.id, `${u.firstName} ${u.lastName}`)
                      }
                      className="text-red-600 hover:underline font-medium"
                    >
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* PROFILE DRAWER */}
      {selectedUser && (
        <div className="bg-white rounded-xl shadow p-6">
          <h3 className="font-semibold text-lg">
            {selectedUser.firstName} {selectedUser.lastName}
          </h3>

          <p className="text-sm text-gray-600">{selectedUser.email}</p>

          <div className="grid grid-cols-2 gap-6 mt-4 text-sm">
            <div>
              <strong>Membership:</strong> {selectedUser.membership}
            </div>
            <div>
              <strong>Status:</strong> {selectedUser.status}
            </div>
            <div>
              <strong>Joined:</strong>{" "}
              {new Date(selectedUser.createdAt).toLocaleDateString()}
            </div>
            <div>
              <strong>Skills:</strong>{" "}
              {selectedUser.skills.map((s: any) => s.name).join(", ")}
            </div>
          </div>

          <div className="mt-4 text-right">
            <button
              onClick={() => setSelectedUser(null)}
              className="px-4 py-1 border rounded"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
