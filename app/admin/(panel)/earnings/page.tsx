// "use client";

// import { useEffect, useState } from "react";
// import { FiTrendingUp, FiCreditCard } from "react-icons/fi";

// type Payment = {
//   id: number;
//   amount: number;
//   paidAt: string | null;
//   user: {
//     firstName: string;
//     lastName: string;
//     email: string;
//   };
// };

// export default function AdminEarningsPage() {
//   const [loading, setLoading] = useState(true);
//   const [earnings, setEarnings] = useState(0);
//   const [payments, setPayments] = useState<Payment[]>([]);

//   // ✅ Pagination state
//   const [page, setPage] = useState(1);
//   const itemsPerPage = 9;

//   useEffect(() => {
//     async function fetchEarnings() {
//       try {
//         const res = await fetch("/api/admin/earnings", {
//           credentials: "include",
//         });

//         const data = await res.json();

//         setEarnings(data.totalEarnings || 0);
//         setPayments(data.payments || []);
//       } catch (err) {
//         console.error("Failed to load earnings", err);
//       } finally {
//         setLoading(false);
//       }
//     }

//     fetchEarnings();
//   }, []);

//   // ✅ Pagination logic
//   const totalPages = Math.ceil(payments.length / itemsPerPage);

//   const start = (page - 1) * itemsPerPage;
//   const currentPayments = payments.slice(start, start + itemsPerPage);

//   if (loading) {
//     return (
//       <div className="min-h-screen bg-[#f4f5f1] px-6 py-10">
//         <p className="text-lg font-semibold text-gray-900">
//           Loading earnings...
//         </p>
//       </div>
//     );
//   }

  

//   return (
//     <div className="min-h-screen bg-[#f4f5f1] px-6 md:px-10 py-10 text-gray-900">

//       {/* HEADER */}
//       <div className="mb-8">
//         <h1 className="text-2xl font-bold">Earnings Overview</h1>
//         <p className="mt-2 text-sm text-gray-500">
//           Track premium membership revenue and completed transactions.
//         </p>
//       </div>

//       {/* SUMMARY */}
//       <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">

//         <div className="bg-white rounded-2xl shadow-sm border p-6 flex justify-between items-center">
//           <div>
//             <p className="text-sm text-gray-500">Total Earnings</p>
//             <h2 className="mt-2 text-4xl font-bold text-green-600">
//               NPR {earnings.toLocaleString()}
//             </h2>
//           </div>
//           <FiTrendingUp className="text-2xl text-green-600" />
//         </div>

//         <div className="bg-white rounded-2xl shadow-sm border p-6 flex justify-between items-center">
//           <div>
//             <p className="text-sm text-gray-500">Total Transactions</p>
//             <h2 className="mt-2 text-4xl font-bold">
//               {payments.length}
//             </h2>
//           </div>
//           <FiCreditCard className="text-2xl" />
//         </div>

//       </div>

//       {/* TABLE */}
//       <div className="bg-white rounded-2xl shadow-sm border overflow-hidden">

//         <div className="px-6 py-4 border-b">
//           <h3 className="text-xl font-semibold">Recent Premium Payments</h3>
//         </div>

//         <table className="w-full text-sm">
//           <thead className="bg-[#eef2eb] text-left">
//             <tr>
//               <th className="px-6 py-4">User</th>
//               <th className="px-6 py-4">Email</th>
//               <th className="px-6 py-4">Amount</th>
//               <th className="px-6 py-4">Date</th>
//             </tr>
//           </thead>

//           <tbody>
//             {currentPayments.length === 0 ? (
//               <tr>
//                 <td colSpan={4} className="px-6 py-10 text-center text-gray-500">
//                   No earnings yet
//                 </td>
//               </tr>
//             ) : (
//               currentPayments.map((p) => (
//                 <tr key={p.id} className="border-t hover:bg-gray-50">
//                   <td className="px-6 py-4 font-medium">
//                     {p.user.firstName} {p.user.lastName}
//                   </td>
//                   <td className="px-6 py-4 text-gray-700">{p.user.email}</td>
//                   <td className="px-6 py-4 text-green-600 font-semibold">
//                     NPR {p.amount.toLocaleString()}
//                   </td>
//                   <td className="px-6 py-4 text-gray-700">
//                     {p.paidAt
//                       ? new Date(p.paidAt).toLocaleDateString()
//                       : "—"}
//                   </td>
//                 </tr>
//               ))
//             )}
//           </tbody>
//         </table>

//         {/* ✅ PAGINATION */}
//         <div className="flex justify-between items-center px-6 py-4 border-t">
          
//           <button
//             onClick={() => setPage((p) => p - 1)}
//             disabled={page === 1}
//             className="px-4 py-2 text-sm border rounded disabled:opacity-50 hover:bg-gray-100"
//           >
//             ← Prev
//           </button>

//           <p className="text-sm text-gray-600">
//             Page {page} of {totalPages || 1}
//           </p>

//           <button
//             onClick={() => setPage((p) => p + 1)}
//             disabled={page === totalPages || totalPages === 0}
//             className="px-4 py-2 text-sm border rounded disabled:opacity-50 hover:bg-gray-100"
//           >
//             Next →
//           </button>

//         </div>

//       </div>
//     </div>
//   );
// }


"use client";

import { useEffect, useState } from "react";
import { FiTrendingUp, FiCreditCard } from "react-icons/fi";

type Payment = {
  id: number;
  amount: number;
  paidAt: string | null;
  user: {
    firstName: string;
    lastName: string;
    email: string;
  };
};

export default function AdminEarningsPage() {
  const [loading, setLoading] = useState(true);
  const [earnings, setEarnings] = useState(0);
  const [payments, setPayments] = useState<Payment[]>([]);

  const [page, setPage] = useState(1);
  const itemsPerPage = 5;

  const [selectedUser, setSelectedUser] = useState<any>(null);
  const [openModal, setOpenModal] = useState(false);

  useEffect(() => {
    async function fetchEarnings() {
      try {
        const res = await fetch("/api/admin/earnings", {
          credentials: "include",
        });

        const data = await res.json();

        setEarnings(data.totalEarnings || 0);
        setPayments(data.payments || []);
        setPage(1);
      } catch (err) {
        console.error("Failed to load earnings", err);
      } finally {
        setLoading(false);
      }
    }

    fetchEarnings();
  }, []);

  // ================= GROUP =================
  const grouped = Object.values(
    payments.reduce((acc: any, p) => {
      const key = p.user.email;

      if (!acc[key]) {
        acc[key] = {
          name: `${p.user.firstName} ${p.user.lastName}`,
          email: p.user.email,
          totalAmount: 0,
          count: 0,
          dates: [],
        };
      }

      acc[key].totalAmount += p.amount;
      acc[key].count += 1;

      if (p.paidAt) {
        acc[key].dates.push(
          new Date(p.paidAt).toLocaleDateString()
        );
      }

      return acc;
    }, {})
  );

  // ================= PAGINATION =================
  const totalPages = Math.ceil(grouped.length / itemsPerPage);
  const start = (page - 1) * itemsPerPage;
  const currentUsers = grouped.slice(start, start + itemsPerPage);

  function handleViewMore(user: any) {
    setSelectedUser(user);
    setOpenModal(true);
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-[#f4f5f1] px-6 py-10">
        <p className="text-lg font-semibold text-gray-900">
          Loading earnings...
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f4f5f1] px-6 md:px-10 py-10 text-gray-900">

      {/* HEADER */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold">Earnings Overview</h1>
        <p className="mt-2 text-sm text-gray-500">
          Track premium membership revenue and usage.
        </p>
      </div>

      {/* SUMMARY */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">

        <div className="bg-white rounded-2xl shadow-sm border p-6 flex justify-between items-center">
          <div>
            <p className="text-sm text-gray-500">Total Earnings</p>
            <h2 className="mt-2 text-4xl font-bold text-green-600">
              NPR {earnings.toLocaleString()}
            </h2>
          </div>
          <FiTrendingUp className="text-2xl text-green-600" />
        </div>

        <div className="bg-white rounded-2xl shadow-sm border p-6 flex justify-between items-center">
          <div>
            <p className="text-sm text-gray-500">Total Transactions</p>
            <h2 className="mt-2 text-4xl font-bold">
              {payments.length}
            </h2>
          </div>
          <FiCreditCard className="text-2xl" />
        </div>

      </div>

      {/* TABLE */}
      <div className="bg-white rounded-2xl shadow-sm border overflow-hidden">

        <div className="px-6 py-4 border-b">
          <h3 className="text-xl font-semibold">
            Premium Usage by Users
          </h3>
        </div>

        <table className="w-full text-sm">
          <thead className="bg-[#eef2eb] text-left">
            <tr>
              <th className="px-6 py-4">User</th>
              <th className="px-6 py-4">Email</th>
              <th className="px-6 py-4">Times Used</th>
              <th className="px-6 py-4">Total Spent</th>
              <th className="px-6 py-4">Dates</th>
            </tr>
          </thead>

          <tbody>
            {currentUsers.map((u: any, i) => (
              <tr key={i} className="border-t hover:bg-gray-50">

                <td className="px-6 py-4 font-medium">
                  {u.name}
                </td>

                <td className="px-6 py-4 text-gray-700">
                  {u.email}
                </td>

                <td className="px-6 py-4 font-semibold">
                  {u.count}
                </td>

                <td className="px-6 py-4 text-green-600 font-semibold">
                  NPR {u.totalAmount.toLocaleString()}
                </td>

                <td className="px-6 py-4 text-xs">

                  <div className="flex items-center gap-2">

                    {/* ONLY 1 DATE */}
                    {u.dates.length > 0 && (
                      <span className="bg-gray-100 px-2 py-1 rounded text-xs">
                        {u.dates[0]}
                      </span>
                    )}

                    {/* + MORE */}
                    {u.dates.length > 1 && (
                      <button
                        onClick={() => handleViewMore(u)}
                        className="text-blue-600 text-xs hover:underline"
                      >
                        +{u.dates.length - 1} more
                      </button>
                    )}

                  </div>

                </td>

              </tr>
            ))}
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

      {/* MODAL */}
      {openModal && selectedUser && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">

          <div className="bg-white rounded-xl p-6 max-w-lg w-full relative">

            <button
              onClick={() => setOpenModal(false)}
              className="absolute top-3 right-4 text-gray-500"
            >
              ✕
            </button>

            <h2 className="text-lg font-semibold mb-4">
              {selectedUser.name} - Premium Usage
            </h2>

            <div className="space-y-2 text-sm">

              {selectedUser.dates.map((date: string, idx: number) => (
                <div
                  key={idx}
                  className="flex justify-between border-b pb-1"
                >
                  <span>Usage #{idx + 1}</span>
                  <span>{date}</span>
                </div>
              ))}

            </div>

          </div>

        </div>
      )}

    </div>
  );
}