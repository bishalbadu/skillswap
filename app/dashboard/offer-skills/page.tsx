// "use client";

// import { useState } from "react";

// export default function OfferSkillsPage() {
//   const [teachSkill, setTeachSkill] = useState("");
//   const [teachLevel, setTeachLevel] = useState("Intermediate");
//   const [teachDesc, setTeachDesc] = useState("");

//   const [sessionLength, setSessionLength] = useState("60");
//   const [selectedDays, setSelectedDays] = useState<string[]>([]);
//   const [fromTime, setFromTime] = useState("");
//   const [toTime, setToTime] = useState("");
//   const [platform, setPlatform] = useState("Google Meet");
//   const [publicListing, setPublicListing] = useState(true);

//   const [busy, setBusy] = useState(false);

//   const dayOptions = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
//   const timeOptions = ["30", "60", "90"];

//   function toggleDay(day: string) {
//     setSelectedDays(prev =>
//       prev.includes(day)
//         ? prev.filter(d => d !== day)
//         : [...prev, day]
//     );
//   }

//   async function saveSkill() {
//     // 🔴 VALIDATION
//     if (!teachSkill.trim()) {
//       alert("Please enter a skill you can teach.");
//       return;
//     }

//     if ((fromTime && !toTime) || (!fromTime && toTime)) {
//       alert("Please provide both start and end time.");
//       return;
//     }

//     setBusy(true);

//     const res = await fetch("/api/skills/offer", {
//       method: "POST",
//       headers: { "Content-Type": "application/json" },
//       credentials: "include",
//       body: JSON.stringify({
//         teachSkill,
//         teachLevel,
//         teachDesc,
//         sessionLength,
//         selectedDays,
//         fromTime,
//         toTime,
//         platform,
//         publicListing,
//       }),
//     });

//     setBusy(false);

//     if (!res.ok) {
//       alert("Failed to save skill. Please try again.");
//       return;
//     }

//     // Reset form
//     setTeachSkill("");
//     setTeachDesc("");
//     setSelectedDays([]);
//     setFromTime("");
//     setToTime("");

//     alert("Skill offered successfully!");
//   }

//   return (
//     <div className="min-h-screen bg-[#f3f5ed] flex justify-center py-12 px-6">
//       <div className="bg-white border rounded-2xl shadow-lg p-7 space-y-8 w-full max-w-3xl">

//         <h1 className="text-3xl font-bold text-[#2b3d1f]">
//           Offer a Skill
//         </h1>
//         <p className="text-gray-600">
//           Share a skill you can teach and help others learn.
//         </p>

//         {/* TEACH SECTION */}
//         <div className="space-y-4">
//           <h2 className="text-lg font-semibold">Skill Details</h2>

//           <div className="flex gap-3">
//             <input
//               type="text"
//               value={teachSkill}
//               onChange={e => setTeachSkill(e.target.value)}
//               placeholder="e.g., Python, Guitar, Calculus"
//               className="w-full border px-4 py-2 rounded-lg"
//             />

//             <select
//               value={teachLevel}
//               onChange={e => setTeachLevel(e.target.value)}
//               className="border px-4 py-2 rounded-lg"
//             >
//               <option>Beginner</option>
//               <option>Intermediate</option>
//               <option>Advanced</option>
//             </select>
//           </div>

//           <textarea
//             value={teachDesc}
//             onChange={e => setTeachDesc(e.target.value)}
//             placeholder="Brief description of how you teach (optional)"
//             className="w-full border px-4 py-2 rounded-lg"
//             rows={3}
//           />
//         </div>

//         {/* SESSION LENGTH */}
//         <div>
//           <p className="text-sm font-medium mb-2">Session length</p>
//           <div className="flex gap-3">
//             {timeOptions.map((t) => (
//               <button
//                 key={t}
//                 onClick={() => setSessionLength(t)}
//                 className={`px-4 py-2 rounded-lg border ${
//                   sessionLength === t
//                     ? "bg-[#7e9c6c] text-white"
//                     : "bg-[#eef2ea]"
//                 }`}
//               >
//                 {t} min
//               </button>
//             ))}
//           </div>
//         </div>

//         {/* AVAILABILITY */}
//         <div>
//           <p className="text-sm font-medium mb-2">Availability (optional)</p>

//           <div className="flex gap-2 mb-3">
//             {dayOptions.map((d) => (
//               <button
//                 key={d}
//                 onClick={() => toggleDay(d)}
//                 className={`px-3 py-1 rounded-full text-sm border ${
//                   selectedDays.includes(d)
//                     ? "bg-[#7e9c6c] text-white"
//                     : "bg-[#eef2ea]"
//                 }`}
//               >
//                 {d}
//               </button>
//             ))}
//           </div>

//           <div className="flex gap-3 items-center">
//             <input
//               type="time"
//               value={fromTime}
//               onChange={e => setFromTime(e.target.value)}
//               className="border px-3 py-1 rounded-lg"
//             />
//             <span>to</span>
//             <input
//               type="time"
//               value={toTime}
//               onChange={e => setToTime(e.target.value)}
//               className="border px-3 py-1 rounded-lg"
//             />
//           </div>
//         </div>

//         {/* PLATFORM */}
//         <div>
//           <p className="text-sm font-medium mb-2">Session platform</p>
//           <div className="flex gap-3">
//             {["Google Meet", "Zoom"].map((p) => (
//               <button
//                 key={p}
//                 onClick={() => setPlatform(p)}
//                 className={`px-4 py-2 rounded-lg border ${
//                   platform === p
//                     ? "bg-[#7e9c6c] text-white"
//                     : "bg-[#eef2ea]"
//                 }`}
//               >
//                 {p}
//               </button>
//             ))}
//           </div>
//         </div>

//         {/* PUBLIC LISTING */}
//         <div className="flex items-center gap-3">
//           <input
//             type="checkbox"
//             checked={publicListing}
//             onChange={() => setPublicListing(!publicListing)}
//           />
//           <p className="text-sm">
//             Show this skill on my public profile
//           </p>
//         </div>

//         {/* ACTION */}
//         <div className="flex justify-end">
//           <button
//             onClick={saveSkill}
//             disabled={busy}
//             className={`px-6 py-2 rounded-lg text-white ${
//               busy
//                 ? "bg-gray-400"
//                 : "bg-[#7e9c6c] hover:bg-[#6c875e]"
//             }`}
//           >
//             {busy ? "Saving..." : "Offer Skill"}
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// }


"use client";

import { useState } from "react";

export default function OfferSkillsPage() {
  const [teachSkill, setTeachSkill] = useState("");
  const [teachLevel, setTeachLevel] = useState("Intermediate");
  const [teachDesc, setTeachDesc] = useState("");

  const [sessionLength, setSessionLength] = useState("60");
  const [selectedDays, setSelectedDays] = useState<string[]>([]);
  const [fromTime, setFromTime] = useState("");
  const [toTime, setToTime] = useState("");
  const [platform, setPlatform] = useState("Google Meet");
  const [publicListing, setPublicListing] = useState(true);

  const [busy, setBusy] = useState(false);

  const dayOptions = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
  const timeOptions = ["30", "60", "90"];

  function toggleDay(day: string) {
    setSelectedDays((prev) =>
      prev.includes(day)
        ? prev.filter((d) => d !== day)
        : [...prev, day]
    );
  }

  async function saveSkill() {
    if (!teachSkill.trim()) {
      alert("Please enter a skill you can teach.");
      return;
    }

    if (
      selectedDays.length > 0 &&
      (!fromTime || !toTime)
    ) {
      alert("Please provide time range for selected days.");
      return;
    }

    setBusy(true);

    const res = await fetch("/api/skills/offer", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({
        teachSkill,
        teachLevel,
        teachDesc,
        sessionLength,
        selectedDays,
        fromTime,
        toTime,
        platform,
        publicListing,
      }),
    });

    setBusy(false);

    if (!res.ok) {
      alert("Failed to save skill.");
      return;
    }

    // Reset
    setTeachSkill("");
    setTeachDesc("");
    setSelectedDays([]);
    setFromTime("");
    setToTime("");

    alert("Skill and availability added successfully!");
  }

  return (
    <div className="min-h-screen bg-[#f3f5ed] flex justify-center py-12 px-6">
      <div className="bg-white border rounded-2xl shadow-lg p-7 space-y-8 w-full max-w-3xl">

        <h1 className="text-3xl font-bold text-[#2b3d1f]">
          Offer a Skill
        </h1>

        {/* SKILL DETAILS */}
        <div className="space-y-4">
          <h2 className="text-lg font-semibold">Skill Details</h2>

          <div className="flex gap-3">
            <input
              value={teachSkill}
              onChange={(e) => setTeachSkill(e.target.value)}
              placeholder="e.g., Python, Guitar"
              className="w-full border px-4 py-2 rounded-lg"
            />

            <select
              value={teachLevel}
              onChange={(e) => setTeachLevel(e.target.value)}
              className="border px-4 py-2 rounded-lg"
            >
              <option>Beginner</option>
              <option>Intermediate</option>
              <option>Advanced</option>
            </select>
          </div>

          <textarea
            value={teachDesc}
            onChange={(e) => setTeachDesc(e.target.value)}
            placeholder="How you teach (optional)"
            className="w-full border px-4 py-2 rounded-lg"
            rows={3}
          />
        </div>

        {/* SESSION LENGTH */}
        <div>
          <p className="text-sm font-medium mb-2">Session length</p>
          <div className="flex gap-3">
            {timeOptions.map((t) => (
              <button
                key={t}
                onClick={() => setSessionLength(t)}
                className={`px-4 py-2 rounded-lg border ${
                  sessionLength === t
                    ? "bg-[#7e9c6c] text-white"
                    : "bg-[#eef2ea]"
                }`}
              >
                {t} min
              </button>
            ))}
          </div>
        </div>

        {/* AVAILABILITY */}
        <div>
          <p className="text-sm font-medium mb-2">
            Availability (creates bookable slots)
          </p>

          <div className="flex gap-2 mb-3 flex-wrap">
            {dayOptions.map((d) => (
              <button
                key={d}
                onClick={() => toggleDay(d)}
                className={`px-3 py-1 rounded-full border ${
                  selectedDays.includes(d)
                    ? "bg-[#7e9c6c] text-white"
                    : "bg-[#eef2ea]"
                }`}
              >
                {d}
              </button>
            ))}
          </div>

          <div className="flex gap-3 items-center">
            <input
              type="time"
              value={fromTime}
              onChange={(e) => setFromTime(e.target.value)}
              className="border px-3 py-1 rounded-lg"
            />
            <span>to</span>
            <input
              type="time"
              value={toTime}
              onChange={(e) => setToTime(e.target.value)}
              className="border px-3 py-1 rounded-lg"
            />
          </div>
        </div>

        {/* PLATFORM */}
        <div>
          <p className="text-sm font-medium mb-2">Session platform</p>
          <div className="flex gap-3">
            {["Google Meet", "Zoom"].map((p) => (
              <button
                key={p}
                onClick={() => setPlatform(p)}
                className={`px-4 py-2 rounded-lg border ${
                  platform === p
                    ? "bg-[#7e9c6c] text-white"
                    : "bg-[#eef2ea]"
                }`}
              >
                {p}
              </button>
            ))}
          </div>
        </div>

        {/* PUBLIC LISTING */}
        <div className="flex items-center gap-3">
          <input
            type="checkbox"
            checked={publicListing}
            onChange={() => setPublicListing(!publicListing)}
          />
          <p className="text-sm">Show this skill publicly</p>
        </div>

        {/* ACTION */}
        <div className="flex justify-end">
          <button
            onClick={saveSkill}
            disabled={busy}
            className={`px-6 py-2 rounded-lg text-white ${
              busy
                ? "bg-gray-400"
                : "bg-[#7e9c6c] hover:bg-[#6c875e]"
            }`}
          >
            {busy ? "Saving..." : "Offer Skill"}
          </button>
        </div>
      </div>
    </div>
  );
}
