

// "use client";

// import { useEffect, useState } from "react";

// type SkillRow = {
// id: number;
// name: string;
// type: "OFFER" | "WANT";
// level: string | null;
// platform: string | null;
// status: "PENDING" | "APPROVED" | "DISABLED";
// createdAt: string;

// certificationUrl?: string | null;
// certificationType?: string | null;

// user: {
// firstName: string;
// lastName: string;
// email: string;
// };
// };

// export default function AdminSkillsPage() {
// const [skills, setSkills] = useState<SkillRow[]>([]);
// const [loading, setLoading] = useState(true);

// const [q, setQ] = useState("");
// const [type, setType] = useState("");
// const [status, setStatus] = useState("");

// const [proofUrl, setProofUrl] = useState<string | null>(null);
// const [proofType, setProofType] = useState<"IMAGE" | "VIDEO" | null>(null);

// async function loadSkills() {
// setLoading(true);


// const res = await fetch(
//   `/api/admin/skills?q=${q}&type=${type}&status=${status}`,
//   { credentials: "include" }
// );

// const data = await res.json();
// setSkills(data.skills || []);
// setLoading(false);


// }

// async function action(id: number, action: string) {
// const status =
// action === "APPROVE"
// ? "APPROVED"
// : action === "DISABLE"
// ? "DISABLED"
// : "APPROVED";


// await fetch(`/api/admin/skills/${id}`, {
//   method: "PATCH",
//   headers: { "Content-Type": "application/json" },
//   credentials: "include",
//   body: JSON.stringify({ status }),
// });

// loadSkills();


// }

// useEffect(() => {
// loadSkills();
// }, []);

// return ( <div className="space-y-6">

// ```
//   {/* HEADER */}
//   <div className="flex justify-between">
//     <h1 className="text-2xl font-bold">Skill Moderation</h1>

//     <button
//       onClick={loadSkills}
//       className="px-4 py-2 bg-[#4a5e27] text-white rounded"
//     >
//       Refresh
//     </button>
//   </div>

//   {/* FILTER BAR */}
//   <div className="bg-white p-4 rounded-xl shadow flex gap-3">
//     <input
//       placeholder="Search..."
//       value={q}
//       onChange={(e) => setQ(e.target.value)}
//       className="border px-3 py-2 rounded w-64"
//     />

//     <select
//       value={type}
//       onChange={(e) => setType(e.target.value)}
//       className="border px-3 py-2 rounded"
//     >
//       <option value="">All Types</option>
//       <option value="OFFER">Offer</option>
//       <option value="WANT">Want</option>
//     </select>

//     <select
//       value={status}
//       onChange={(e) => setStatus(e.target.value)}
//       className="border px-3 py-2 rounded"
//     >
//       <option value="">All Status</option>
//       <option value="PENDING">Pending</option>
//       <option value="APPROVED">Approved</option>
//       <option value="DISABLED">Disabled</option>
//     </select>

//     <button
//       onClick={loadSkills}
//       className="px-4 py-2 bg-black text-white rounded"
//     >
//       Apply
//     </button>
//   </div>

//   {/* TABLE */}
//   <div className="bg-white rounded-xl shadow overflow-hidden">
//     <table className="w-full text-sm table-fixed">
//       <thead className="bg-gray-50 text-gray-600">
//         <tr>
//           <th className="px-6 py-3 text-left w-[28%]">Skill</th>
//           <th className="px-6 py-3 text-left w-[10%]">Type</th>
//           <th className="px-6 py-3 text-left w-[28%]">Owner</th>
//           <th className="px-6 py-3 text-left w-[12%]">Proof</th>
//           <th className="px-6 py-3 text-left w-[14%]">Status</th>
//           <th className="px-6 py-3 text-left w-[12%]">Created</th>
//           <th className="px-6 py-3 text-right w-[8%]">Actions</th>
//         </tr>
//       </thead>

//       <tbody>
//         {skills.map((s) => (
//           <tr key={s.id} className="border-t hover:bg-gray-50">

//             {/* Skill */}
//             <td className="px-6 py-4">
//               <div className="font-medium">{s.name}</div>
//               <div className="text-xs text-gray-500">
//                 {s.level || "—"} {s.platform && `• ${s.platform}`}
//               </div>
//             </td>

//             {/* Type */}
//             <td className="px-6 py-4">
//               <Badge
//                 text={s.type === "OFFER" ? "Offer" : "Want"}
//                 tone={s.type === "OFFER" ? "green" : "blue"}
//               />
//             </td>

//             {/* Owner */}
//             <td className="px-6 py-4">
//               <div className="font-medium">
//                 {s.user.firstName} {s.user.lastName}
//               </div>
//               <div className="text-xs text-gray-500">
//                 {s.user.email}
//               </div>
//             </td>

//             {/* Proof */}
//             <td className="px-6 py-4">
//               {s.certificationUrl ? (
//                 <button
//                   onClick={() => {
//                     setProofUrl(s.certificationUrl || null);
//                     setProofType(
//                       s.certificationType === "VIDEO" ? "VIDEO" : "IMAGE"
//                     );
//                   }}
//                   className="text-blue-600 hover:underline text-sm"
//                 >
//                   View Proof
//                 </button>
//               ) : (
//                 <span className="text-gray-400 text-sm">No proof</span>
//               )}
//             </td>

//             {/* Status */}
//             <td className="px-6 py-4">
//               <Badge
//                 text={s.status}
//                 tone={
//                   s.status === "APPROVED"
//                     ? "green"
//                     : s.status === "PENDING"
//                     ? "yellow"
//                     : "red"
//                 }
//               />
//             </td>

//             {/* Created */}
//             <td className="px-6 py-4">
//               {new Date(s.createdAt).toLocaleDateString()}
//             </td>

//             {/* Actions */}
//             <td className="px-6 py-4 text-right whitespace-nowrap w-[160px]">
//               <div className="flex justify-end gap-4">

//                 {s.status === "PENDING" && (
//                   <button
//                     onClick={() => action(s.id, "APPROVE")}
//                     className="text-blue-600 hover:underline font-medium"
//                   >
//                     Approve
//                   </button>
//                 )}

//                 {s.status !== "DISABLED" ? (
//                   <button
//                     onClick={() => action(s.id, "DISABLE")}
//                     className="text-red-600 hover:underline font-medium"
//                   >
//                     Disable
//                   </button>
//                 ) : (
//                   <button
//                     onClick={() => action(s.id, "ENABLE")}
//                     className="text-green-600 hover:underline font-medium"
//                   >
//                     Enable
//                   </button>
//                 )}

//               </div>
//             </td>

//           </tr>
//         ))}
//       </tbody>
//     </table>

//     {loading && (
//       <div className="p-4 text-gray-500">Loading…</div>
//     )}
//   </div>

//   {/* PROOF MODAL */}
//   {proofUrl && (
//     <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">

//       <div className="bg-white rounded-xl p-6 max-w-3xl w-full relative">

//         <button
//           onClick={() => {
//             setProofUrl(null);
//             setProofType(null);
//           }}
//           className="absolute top-3 right-4 text-gray-600 text-lg"
//         >
//           ✕
//         </button>

//         {proofType === "VIDEO" ? (
//           <video
//             src={proofUrl}
//             controls
//             className="w-full rounded-lg"
//           />
//         ) : (
//           <img
//             src={proofUrl}
//             alt="Certification Proof"
//             className="w-full rounded-lg"
//           />
//         )}

//       </div>

//     </div>
//   )}

// </div>


// );
// }

// function Badge({ text, tone }: any) {
// const styles =
// tone === "green"
// ? "bg-green-100 text-green-700"
// : tone === "blue"
// ? "bg-blue-100 text-blue-700"
// : tone === "yellow"
// ? "bg-yellow-100 text-yellow-700"
// : "bg-red-100 text-red-700";

// return (
// <span className={`px-2 py-1 text-xs rounded ${styles}`}>
// {text} </span>
// );
// }


"use client";

import { useEffect, useState } from "react";

/* ======================================================
TYPES
====================================================== */

type SkillProof = {
id: number;
url: string;
type: "IMAGE" | "VIDEO";
};

type SkillRow = {
id: number;
name: string;
type: "OFFER" | "WANT";
level: string | null;
platform: string | null;
status: "PENDING" | "APPROVED" | "DISABLED";
createdAt: string;

proofs?: SkillProof[];

user: {
firstName: string;
lastName: string;
email: string;
};
};

/* ======================================================
COMPONENT
====================================================== */

export default function AdminSkillsPage() {

const [skills, setSkills] = useState<SkillRow[]>([]);
const [loading, setLoading] = useState(true);

const [q, setQ] = useState("");
const [type, setType] = useState("");
const [status, setStatus] = useState("");

const [selectedProofs, setSelectedProofs] = useState<SkillProof[]>([]);
const [openProofModal, setOpenProofModal] = useState(false);

/* ======================================================
LOAD SKILLS
====================================================== */

async function loadSkills() {


setLoading(true);

const res = await fetch(
  `/api/admin/skills?q=${q}&type=${type}&status=${status}`,
  { credentials: "include" }
);

const data = await res.json();

setSkills(data.skills || []);
setLoading(false);


}

/* ======================================================
ACTIONS
====================================================== */

async function action(id: number, action: string) {


const status =
  action === "APPROVE"
    ? "APPROVED"
    : action === "DISABLE"
    ? "DISABLED"
    : "APPROVED";

await fetch(`/api/admin/skills/${id}`, {
  method: "PATCH",
  headers: { "Content-Type": "application/json" },
  credentials: "include",
  body: JSON.stringify({ status })
});

loadSkills();


}

/* ======================================================
LOAD ON START
====================================================== */

useEffect(() => {
loadSkills();
}, []);

/* ======================================================
UI
====================================================== */

return ( <div className="space-y-6">


  {/* HEADER */}

  <div className="flex justify-between">
    <h1 className="text-2xl font-bold">Skill Moderation</h1>

    <button
      onClick={loadSkills}
      className="px-4 py-2 bg-[#4a5e27] text-white rounded"
    >
      Refresh
    </button>
  </div>

  {/* FILTER BAR */}

  <div className="bg-white p-4 rounded-xl shadow flex gap-3">

    <input
      placeholder="Search skill..."
      value={q}
      onChange={(e) => setQ(e.target.value)}
      className="border px-3 py-2 rounded w-64"
    />

    <select
      value={type}
      onChange={(e) => setType(e.target.value)}
      className="border px-3 py-2 rounded"
    >
      <option value="">All Types</option>
      <option value="OFFER">Offer</option>
      <option value="WANT">Want</option>
    </select>

    <select
      value={status}
      onChange={(e) => setStatus(e.target.value)}
      className="border px-3 py-2 rounded"
    >
      <option value="">All Status</option>
      <option value="PENDING">Pending</option>
      <option value="APPROVED">Approved</option>
      <option value="DISABLED">Disabled</option>
    </select>

    <button
      onClick={loadSkills}
      className="px-4 py-2 bg-black text-white rounded"
    >
      Apply
    </button>

  </div>

  {/* TABLE */}

  <div className="bg-white rounded-xl shadow overflow-hidden">

    <table className="w-full text-sm table-fixed">

      <thead className="bg-gray-50 text-gray-600">

        <tr>
          <th className="px-6 py-3 text-left w-[28%]">Skill</th>
          <th className="px-6 py-3 text-left w-[10%]">Type</th>
          <th className="px-6 py-3 text-left w-[28%]">Owner</th>
          <th className="px-6 py-3 text-left w-[12%]">Proofs</th>
          <th className="px-6 py-3 text-left w-[14%]">Status</th>
          <th className="px-6 py-3 text-left w-[12%]">Created</th>
          <th className="px-6 py-3 text-right w-[8%]">Actions</th>
        </tr>

      </thead>

      <tbody>

        {skills.map((s) => (

          <tr key={s.id} className="border-t hover:bg-gray-50">

            {/* SKILL */}

            <td className="px-6 py-4">

              <div className="font-medium">{s.name}</div>

              <div className="text-xs text-gray-500">
                {s.level || "—"} {s.platform && `• ${s.platform}`}
              </div>

            </td>

            {/* TYPE */}

            <td className="px-6 py-4">

              <Badge
                text={s.type === "OFFER" ? "Offer" : "Want"}
                tone={s.type === "OFFER" ? "green" : "blue"}
              />

            </td>

            {/* OWNER */}

            <td className="px-6 py-4">

              <div className="font-medium">
                {s.user.firstName} {s.user.lastName}
              </div>

              <div className="text-xs text-gray-500">
                {s.user.email}
              </div>

            </td>

            {/* PROOFS */}

            <td className="px-6 py-4">

              {s.proofs && s.proofs.length > 0 ? (

                <button
                  onClick={() => {
                    setSelectedProofs(s.proofs || []);
                    setOpenProofModal(true);
                  }}
                  className="text-blue-600 hover:underline text-sm"
                >
                  View Proofs ({s.proofs.length})
                </button>

              ) : (

                <span className="text-gray-400 text-sm">
                  No proof
                </span>

              )}

            </td>

            {/* STATUS */}

            <td className="px-6 py-4">

              <Badge
                text={s.status}
                tone={
                  s.status === "APPROVED"
                    ? "green"
                    : s.status === "PENDING"
                    ? "yellow"
                    : "red"
                }
              />

            </td>

            {/* CREATED */}

            <td className="px-6 py-4">
              {new Date(s.createdAt).toLocaleDateString()}
            </td>

            {/* ACTIONS */}

            <td className="px-6 py-4 text-right">

              <div className="flex justify-end gap-4">

                {s.status === "PENDING" && (

                  <button
                    onClick={() => action(s.id, "APPROVE")}
                    className="text-blue-600 hover:underline font-medium"
                  >
                    Approve
                  </button>

                )}

                {s.status !== "DISABLED" ? (

                  <button
                    onClick={() => action(s.id, "DISABLE")}
                    className="text-red-600 hover:underline font-medium"
                  >
                    Disable
                  </button>

                ) : (

                  <button
                    onClick={() => action(s.id, "ENABLE")}
                    className="text-green-600 hover:underline font-medium"
                  >
                    Enable
                  </button>

                )}

              </div>

            </td>

          </tr>

        ))}

      </tbody>

    </table>

    {loading && (
      <div className="p-4 text-gray-500">Loading…</div>
    )}

  </div>

  {/* ======================================================
     PROOF MODAL (MULTIPLE PROOFS)
  ====================================================== */}

  {openProofModal && (

    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">

      <div className="bg-white rounded-xl p-6 max-w-4xl w-full relative space-y-4">

        <button
          onClick={() => setOpenProofModal(false)}
          className="absolute top-3 right-4 text-gray-600 text-lg"
        >
          ✕
        </button>

        <h2 className="text-lg font-semibold">
          Skill Proofs
        </h2>

        <div className="grid grid-cols-2 gap-4">

          {selectedProofs.map((p) => (

            <div key={p.id}>

              {p.type === "VIDEO" ? (

                <video
                  src={p.url}
                  controls
                  className="w-full rounded"
                />

              ) : (

                <img
                  src={p.url}
                  className="w-full rounded"
                />

              )}

            </div>

          ))}

        </div>

      </div>

    </div>

  )}

</div>


);
}

/* ======================================================
BADGE COMPONENT
====================================================== */

function Badge({ text, tone }: any) {

const styles =
tone === "green"
? "bg-green-100 text-green-700"
: tone === "blue"
? "bg-blue-100 text-blue-700"
: tone === "yellow"
? "bg-yellow-100 text-yellow-700"
: "bg-red-100 text-red-700";

return (
<span className={`px-2 py-1 text-xs rounded ${styles}`}>
{text} </span>
);
}
