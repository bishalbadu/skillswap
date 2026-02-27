// "use client";

// import { useState } from "react";
// import { useSearchParams } from "next/navigation";
// import { useEffect } from "react";

// export default function OfferSkillsPage() {
//   const searchParams = useSearchParams();

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

//    useEffect(() => {
//     const skillFromProfile = searchParams.get("skill");
//     if (skillFromProfile) {
//       setTeachSkill(skillFromProfile);
//     }
//   }, [searchParams]);

//   const dayOptions = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
//   const timeOptions = ["30", "60", "90"];
  

//   function toggleDay(day: string) {
//     setSelectedDays((prev) =>
//       prev.includes(day)
//         ? prev.filter((d) => d !== day)
//         : [...prev, day]
//     );
//   }

//   async function saveSkill() {
//     if (!teachSkill.trim()) {
//       alert("Please enter a skill you can teach.");
//       return;
//     }

//     if (
//       selectedDays.length > 0 &&
//       (!fromTime || !toTime)
//     ) {
//       alert("Please provide time range for selected days.");
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
//       alert("Failed to save skill.");
//       return;
//     }

//     // Reset
//     setTeachSkill("");
//     setTeachDesc("");
//     setSelectedDays([]);
//     setFromTime("");
//     setToTime("");

//     alert("Skill and availability added successfully!");
//   }

//   return (
//     <div className="min-h-screen bg-[#f3f5ed] flex justify-center py-12 px-6">
//       <div className="bg-white border rounded-2xl shadow-lg p-7 space-y-8 w-full max-w-3xl">

//         <h1 className="text-3xl font-bold text-[#2b3d1f]">
//           Offer a Skill
//         </h1>

//         {/* SKILL DETAILS */}
//         <div className="space-y-4">
//           <h2 className="text-lg font-semibold">Skill Details</h2>

//           <div className="flex gap-3">
//             <input
//               value={teachSkill}
//               onChange={(e) => setTeachSkill(e.target.value)}
//               placeholder="e.g., Python, Guitar"
//               className="w-full border px-4 py-2 rounded-lg"
//             />

//             <select
//               value={teachLevel}
//               onChange={(e) => setTeachLevel(e.target.value)}
//               className="border px-4 py-2 rounded-lg"
//             >
//               <option>Beginner</option>
//               <option>Intermediate</option>
//               <option>Advanced</option>
//             </select>
//           </div>

//           <textarea
//             value={teachDesc}
//             onChange={(e) => setTeachDesc(e.target.value)}
//             placeholder="How you teach (optional)"
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
//           <p className="text-sm font-medium mb-2">
//             Availability (creates bookable slots)
//           </p>

//           <div className="flex gap-2 mb-3 flex-wrap">
//             {dayOptions.map((d) => (
//               <button
//                 key={d}
//                 onClick={() => toggleDay(d)}
//                 className={`px-3 py-1 rounded-full border ${
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
//               onChange={(e) => setFromTime(e.target.value)}
//               className="border px-3 py-1 rounded-lg"
//             />
//             <span>to</span>
//             <input
//               type="time"
//               value={toTime}
//               onChange={(e) => setToTime(e.target.value)}
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
//           <p className="text-sm">Show this skill publicly</p>
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

import { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";

export default function OfferSkillsPage() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const editId = searchParams.get("edit");

  const [teachSkill, setTeachSkill] = useState("");
  const [teachLevel, setTeachLevel] = useState("Intermediate");
  const [teachDesc, setTeachDesc] = useState("");

  const [sessionLength, setSessionLength] = useState("60");

  const [selectedDate, setSelectedDate] = useState("");
  const [fromTime, setFromTime] = useState("");
  const [toTime, setToTime] = useState("");

  const [platform, setPlatform] = useState("Google Meet");
  const [publicListing, setPublicListing] = useState(true);

  const [busy, setBusy] = useState(false);

  const timeOptions = ["30", "60", "90"];

  const [mySkills, setMySkills] = useState<any[]>([]);

  /* =====================================================
     LOAD ALL OFFERED SKILLS (FOR RIGHT SUMMARY)
  ===================================================== */
  useEffect(() => {
    loadAllSkills();
  }, []);

  async function loadAllSkills() {
    const res = await fetch("/api/skills/offer", {
      credentials: "include",
    });

    const data = await res.json();

    if (data.skills) {
      setMySkills(data.skills);
    }
  }

  /* =====================================================
     LOAD EXISTING SKILL (EDIT MODE)
  ===================================================== */
  useEffect(() => {
    if (editId) {
      loadSkill();
    }
  }, [editId]);

  async function loadSkill() {
    const res = await fetch(`/api/skills/offer?id=${editId}`, {
      credentials: "include",
    });

    const data = await res.json();

    if (!data.skill) return;

    const s = data.skill;

    setTeachSkill(s.name);
    setTeachLevel(s.level || "Intermediate");
    setTeachDesc(s.description || "");
    setSessionLength(String(s.sessionLength || "60"));
    setPlatform(s.platform || "Google Meet");
    setPublicListing(s.publicListing ?? true);

    if (s.slots && s.slots.length > 0) {
      const firstSlot = s.slots[0];

      setSelectedDate(firstSlot.date.split("T")[0]);
      setFromTime(firstSlot.timeFrom);
      setToTime(firstSlot.timeTo);
    }
  }

  /* =====================================================
     AUTO SET END TIME
  ===================================================== */
  function handleFromTimeChange(value: string) {
    setFromTime(value);

    if (!value) return;

    const minutes = Number(sessionLength);

    const start = new Date(`1970-01-01T${value}`);
    const end = new Date(start.getTime() + minutes * 60000);

    setToTime(end.toTimeString().slice(0, 5));
  }

  /* =====================================================
     SAVE SKILL
  ===================================================== */
  async function saveSkill() {
    if (!teachSkill.trim()) {
      alert("Please enter a skill.");
      return;
    }

    if (!selectedDate || !fromTime || !toTime) {
      alert("Please select date and time.");
      return;
    }

    const diffMinutes =
      (new Date(`1970-01-01T${toTime}`).getTime() -
        new Date(`1970-01-01T${fromTime}`).getTime()) /
      60000;

    if (diffMinutes !== Number(sessionLength)) {
      alert("Time must match session length exactly.");
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
        selectedDate,
        fromTime,
        toTime,
        platform,
        publicListing,
        editId,
      }),
    });

    const data = await res.json();
    setBusy(false);

    if (!res.ok) {
      alert(data.error || "Failed to save.");
      return;
    }

    alert(editId ? "Slot added successfully!" : "Skill created successfully!");

    loadAllSkills();

    if (editId) {
      setSelectedDate("");
      setFromTime("");
      setToTime("");
    } else {
      router.refresh();
    }
  }

  /* =====================================================
     UI
  ===================================================== */
  return (
    <div className="min-h-screen bg-[#f3f5ed] py-12 px-6">
      <div className="max-w-6xl mx-auto grid grid-cols-2 gap-8">

        {/* ================= LEFT FORM ================= */}
        <div className="bg-white border rounded-2xl shadow-lg p-7 space-y-8">

          <h1 className="text-3xl font-bold text-[#2b3d1f]">
            {editId ? "Edit Skill Availability" : "Offer a Skill"}
          </h1>

          <div className="space-y-4">
            <h2 className="text-lg font-semibold">Skill Details</h2>

            <div className="flex gap-3">
              <input
                value={teachSkill}
                onChange={(e) => setTeachSkill(e.target.value)}
                disabled={!!editId}
                placeholder="e.g., Python, Guitar"
                className="w-full border px-4 py-2 rounded-lg"
              />

              <select
                value={teachLevel}
                onChange={(e) => setTeachLevel(e.target.value)}
                disabled={!!editId}
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
              disabled={!!editId}
              placeholder="How you teach (optional)"
              className="w-full border px-4 py-2 rounded-lg"
              rows={3}
            />
          </div>

          <div>
            <p className="text-sm font-medium mb-2">Session length</p>
            <div className="flex gap-3">
              {timeOptions.map((t) => (
                <button
                  key={t}
                  onClick={() => setSessionLength(t)}
                  disabled={!!editId}
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

          <div>
            <p className="text-sm font-medium mb-2">
              Availability (exact session time)
            </p>

            <div className="flex gap-3 items-center">
              <input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="border px-3 py-1 rounded-lg"
              />

              <input
                type="time"
                value={fromTime}
                onChange={(e) => handleFromTimeChange(e.target.value)}
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

          <div>
            <p className="text-sm font-medium mb-2">Session platform</p>
            <div className="flex gap-3">
              {["Google Meet", "Zoom"].map((p) => (
                <button
                  key={p}
                  onClick={() => setPlatform(p)}
                  disabled={!!editId}
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

          <div className="flex items-center gap-3">
            <input
              type="checkbox"
              checked={publicListing}
              onChange={() => setPublicListing(!publicListing)}
              disabled={!!editId}
            />
            <p className="text-sm">Show this skill publicly</p>
          </div>

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


        {/* ================= RIGHT SUMMARY ================= */}
        <div className="bg-white border rounded-2xl shadow-lg p-6 h-fit">

          <h2 className="text-lg font-semibold mb-4">
            Your Scheduled Slots
          </h2>

          {mySkills.length === 0 && (
            <p className="text-sm text-gray-500">
              No skills created yet.
            </p>
          )}

          <div className="space-y-5">
            {mySkills.map((skill) => (
              <div key={skill.id} className="border rounded-lg p-4">

                <div className="font-semibold text-[#2b3d1f] mb-2">
                  {skill.name}
                </div>

                <div className="text-xs mb-2">
                  Status:{" "}
                  <span
                    className={
                      skill.status === "APPROVED"
                        ? "text-green-600"
                        : skill.status === "PENDING"
                        ? "text-yellow-600"
                        : "text-red-600"
                    }
                  >
                    {skill.status}
                  </span>
                </div>

                {skill.slots.length === 0 && (
                  <div className="text-xs text-gray-400">
                    No slots scheduled
                  </div>
                )}

                <div className="space-y-2">
                  {skill.slots.map((slot: any) => (
                    <div
                      key={slot.id}
                      className="text-sm bg-[#f8faf7] p-2 rounded"
                    >
                      📅 {slot.day} •{" "}
                      {new Date(slot.date).toLocaleDateString("en-US", {
                        day: "2-digit",
                        month: "short",
                      })}{" "}
                      • {slot.timeFrom} – {slot.timeTo}
                    </div>
                  ))}
                </div>

              </div>
            ))}
          </div>

        </div>

      </div>
    </div>
  );
}