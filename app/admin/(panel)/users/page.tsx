// "use client";

// import { useEffect, useState } from "react";

// export default function AdminUsersPage() {
//   const [users, setUsers] = useState<any[]>([]);
//   const [query, setQuery] = useState("");
//   const [status, setStatus] = useState("");
//   const [membership, setMembership] = useState("");
//   const [selectedUser, setSelectedUser] = useState<any>(null);

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

//       {/* FILTERS */}
//       <div className="flex gap-3">
//         <input
//           placeholder="Search name or email"
//           value={query}
//           onChange={(e) => setQuery(e.target.value)}
//           className="border px-3 py-2 rounded-md"
//         />

//         <select
//           value={status}
//           onChange={(e) => setStatus(e.target.value)}
//           className="border px-3 py-2 rounded-md"
//         >
//           <option value="">All Status</option>
//           <option value="ACTIVE">Active</option>
//           <option value="SUSPENDED">Suspended</option>
//         </select>

//         <select
//           value={membership}
//           onChange={(e) => setMembership(e.target.value)}
//           className="border px-3 py-2 rounded-md"
//         >
//           <option value="">All Memberships</option>
//           <option value="FREE">Free</option>
//           <option value="PREMIUM">Premium</option>
//         </select>

//         <button
//           onClick={loadUsers}
//           className="bg-[#4a5e27] text-white px-4 rounded-md"
//         >
//           Apply
//         </button>
//       </div>

//       {/* TABLE */}
//       <div className="bg-white rounded-xl shadow overflow-hidden">
//         <table className="w-full text-sm">
//           <thead className="bg-gray-50 text-gray-600">
//             <tr>
//               <th className="p-3 text-left">Name</th>
//               <th>Email</th>
//               <th>Membership</th>
//               <th>Status</th>
//               <th>Joined</th>
//               <th className="text-right pr-4">Actions</th>
//             </tr>
//           </thead>
//           <tbody>
//             {users.map((u) => (
//               <tr key={u.id} className="border-t">
//                 <td className="p-3">
//                   {u.firstName} {u.lastName}
//                 </td>
//                 <td>{u.email}</td>
//                 <td>
//                   <span className="px-2 py-1 rounded text-xs bg-gray-100">
//                     {u.membership}
//                   </span>
//                 </td>
//                 <td>
//                   <span
//                     className={`px-2 py-1 rounded text-xs ${
//                       u.status === "ACTIVE"
//                         ? "bg-green-100 text-green-700"
//                         : "bg-red-100 text-red-700"
//                     }`}
//                   >
//                     {u.status}
//                   </span>
//                 </td>
//                 <td>{new Date(u.createdAt).toLocaleDateString()}</td>
//                 <td className="text-right pr-4 space-x-3">
//                   <button
//                     onClick={() => viewProfile(u.id)}
//                     className="text-green-700 hover:underline"
//                   >
//                     View profile
//                   </button>
//                   <button
//                     onClick={() => toggleUser(u.id, u.status)}
//                     className="text-blue-600 hover:underline"
//                   >
//                     {u.status === "ACTIVE" ? "Suspend" : "Activate"}
//                   </button>
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
//           <p className="text-sm text-gray-600">{selectedUser.email}</p>

//           <div className="grid grid-cols-2 gap-6 mt-4 text-sm">
//             <div>
//               <strong>Membership:</strong> {selectedUser.membership}
//             </div>
//             <div>
//               <strong>Status:</strong> {selectedUser.status}
//             </div>
//             <div>
//               <strong>Joined:</strong>{" "}
//               {new Date(selectedUser.createdAt).toLocaleDateString()}
//             </div>
//             <div>
//               <strong>Skills:</strong>{" "}
//               {selectedUser.skills.map((s: any) => s.name).join(", ")}
//             </div>
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

import { useEffect, useState } from "react";

export default function AdminUsersPage() {
  const [users, setUsers] = useState<any[]>([]);
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState("");
  const [membership, setMembership] = useState("");
  const [selectedUser, setSelectedUser] = useState<any>(null);

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

  /* ================= VIEW PROFILE ================= */
  async function viewProfile(id: number) {
    const res = await fetch(`/api/admin/users/${id}`, {
      credentials: "include",
    });

    const data = await res.json();
    setSelectedUser(data.user);
  }

  /* ================================================= */
  return (
    <div className="space-y-6">

      {/* HEADER */}
      <h1 className="text-2xl font-bold">User Management</h1>

      {/* ================= FILTER BAR ================= */}
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

      {/* ================= TABLE ================= */}
      <div className="bg-white rounded-xl shadow overflow-hidden">
        <table className="w-full text-sm">

          {/* TABLE HEAD */}
          <thead className="bg-gray-50 text-gray-600">
            <tr>
              <th className="px-6 py-3 text-left">Name</th>
              <th className="px-6 py-3 text-left">Email</th>
              <th className="px-6 py-3 text-left">Membership</th>
              <th className="px-6 py-3 text-left">Status</th>
              <th className="px-6 py-3 text-left">Joined</th>

              {/* ⭐ FIXED WIDTH ACTIONS */}
              <th className="px-6 py-3 text-right w-[200px]">
                Actions
              </th>
            </tr>
          </thead>

          {/* TABLE BODY */}
          <tbody>
            {users.map((u) => (
              <tr key={u.id} className="border-t hover:bg-gray-50/60">

                {/* NAME */}
                <td className="px-6 py-4 font-medium">
                  {u.firstName} {u.lastName}
                </td>

                {/* EMAIL */}
                <td className="px-6 py-4 text-gray-600">
                  {u.email}
                </td>

                {/* MEMBERSHIP BADGE */}
                <td className="px-6 py-4">
                  <span
                    className={`px-2 py-1 rounded text-xs font-medium
                      ${u.membership === "PREMIUM"
                        ? "bg-orange-100 text-orange-700"
                        : "bg-gray-100 text-gray-700"}
                    `}
                  >
                    {u.membership}
                  </span>
                </td>

                {/* STATUS BADGE */}
                <td className="px-6 py-4">
                  <span
                    className={`px-2 py-1 rounded text-xs font-medium
                      ${u.status === "ACTIVE"
                        ? "bg-green-100 text-green-700"
                        : "bg-red-100 text-red-700"}
                    `}
                  >
                    {u.status}
                  </span>
                </td>

                {/* CREATED DATE */}
                <td className="px-6 py-4 text-gray-600">
                  {new Date(u.createdAt).toLocaleDateString()}
                </td>

                {/* ⭐ PROFESSIONAL ACTIONS CELL */}
                <td className="px-6 py-4 text-right whitespace-nowrap w-[200px]">
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

                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* ================= PROFILE DRAWER ================= */}
      {selectedUser && (
        <div className="bg-white rounded-xl shadow p-6">

          <h3 className="font-semibold text-lg">
            {selectedUser.firstName} {selectedUser.lastName}
          </h3>

          <p className="text-sm text-gray-600">
            {selectedUser.email}
          </p>

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
