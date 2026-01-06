// "use client";

// import { useState } from "react";

// export default function RequestSwapModal({
//   open,
//   skill,
//   slot,
//   onClose,
// }: {
//   open: boolean;
//   skill: any;
//   slot: any;
//   onClose: () => void;
// }) {
//   const [message, setMessage] = useState("");
//   const [loading, setLoading] = useState(false);

//   if (!open) return null;

//   async function sendRequest() {
//     setLoading(true);

//     const res = await fetch("/api/swap-request", {
//       method: "POST",
//       headers: { "Content-Type": "application/json" },
//       credentials: "include",
//       body: JSON.stringify({
//         skillId: skill.id,
//         slotId: slot.id,
//         receiverId: skill.user.id,
//         message,
//       }),
//     });

//     setLoading(false);

//     if (res.ok) {
//       alert("Swap request sent!");
//       setMessage("");
//       onClose();
//     } else {
//       const data = await res.json();
//       alert(data.error || "Failed to send request");
//     }
//   }

//   return (
//     <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
//       <div className="bg-white rounded-xl p-6 w-full max-w-md space-y-4">

//         <h2 className="text-xl font-semibold">Request Swap</h2>

//         <div className="text-sm text-gray-600">
//           <p><b>Skill:</b> {skill.name}</p>
//           <p>
//             <b>Slot:</b> {slot.day} {slot.timeFrom} – {slot.timeTo}
//           </p>
//           <p>
//             <b>Teacher:</b> {skill.user.firstName} {skill.user.lastName}
//           </p>
//         </div>

//         <textarea
//           className="w-full border rounded p-2 text-sm"
//           placeholder="Optional message..."
//           value={message}
//           onChange={(e) => setMessage(e.target.value)}
//         />

//         <div className="flex justify-end gap-3 pt-2">
//           <button
//             onClick={onClose}
//             className="px-4 py-2 border rounded"
//           >
//             Cancel
//           </button>

//           <button
//             onClick={sendRequest}
//             disabled={loading}
//             className="px-4 py-2 bg-[#4a5e27] text-white rounded"
//           >
//             {loading ? "Sending..." : "Send Request"}
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// }





"use client";

import { useState } from "react";

export default function RequestSwapModal({
  open,
  skill,
  slot,
  onClose,
}: {
  open: boolean;
  skill: any;
  slot: any;
  onClose: () => void;
}) {
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  if (!open) return null;

  async function sendRequest() {
    setLoading(true);

    const res = await fetch("/api/swap-request", {
      method: "POST", // ✅ CORRECT
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({
        skillId: skill.id,
        slotId: slot.id,
        message,
      }),
    });

    setLoading(false);

    // ✅ SAFETY CHECK
    if (!res.ok) {
      let error = "Failed to send request";
      try {
        const data = await res.json();
        error = data.error || error;
      } catch {}
      alert(error);
      return;
    }

    alert("Swap request sent!");
    setMessage("");
    onClose();
  }

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl p-6 w-full max-w-md space-y-4">
        <h2 className="text-xl font-semibold">Request Swap</h2>

        <p className="text-sm text-gray-600">
          <b>Skill:</b> {skill.name}
          <br />
          <b>Slot:</b> {slot.day} {slot.timeFrom}–{slot.timeTo}
          <br />
          <b>To:</b> {skill.user.firstName} {skill.user.lastName}
        </p>

        <textarea
          className="w-full border rounded p-2 text-sm"
          placeholder="Optional message..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        />

        <div className="flex justify-end gap-3 pt-2">
          <button
            onClick={onClose}
            className="px-4 py-2 border rounded"
          >
            Cancel
          </button>

          <button
            onClick={sendRequest}
            disabled={loading}
            className="px-4 py-2 bg-[#4a5e27] text-white rounded"
          >
            {loading ? "Sending..." : "Send Request"}
          </button>
        </div>
      </div>
    </div>
  );
}

