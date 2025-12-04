// "use client";

// import { useState } from "react";

// export default function OfferSkillsPage() {
//   const [teachSkill, setTeachSkill] = useState("");
//   const [teachLevel, setTeachLevel] = useState("Intermediate");
//   const [teachDesc, setTeachDesc] = useState("");

//   const [learnSkill, setLearnSkill] = useState("");
//   const [learnLevel, setLearnLevel] = useState("New to it");
//   const [learnGoal, setLearnGoal] = useState("");

//   const [sessionLength, setSessionLength] = useState("60");
//   const [selectedDays, setSelectedDays] = useState<string[]>([]);
//   const [fromTime, setFromTime] = useState("");
//   const [toTime, setToTime] = useState("");
//   const [platform, setPlatform] = useState("Google Meet");
//   const [publicListing, setPublicListing] = useState(true);

//   const dayOptions = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
//   const timeOptions = ["30", "60", "90"];

//   function toggleDay(day: string) {
//     setSelectedDays(prev =>
//       prev.includes(day) ? prev.filter(d => d !== day) : [...prev, day]
//     );
//   }

//   return (
//     <div className="min-h-screen bg-[#f6f7f4] px-10 py-8">
      
//       <h1 className="text-3xl font-bold text-[#2b3d1f] mb-2">Add a Skill</h1>
//       <p className="text-gray-600 mb-8">
//         Share what you can teach and what you want to learn to get matched faster.
//       </p>

//       <div className="bg-white border border-[#e0e6d8] rounded-2xl shadow p-7 space-y-8 max-w-4xl">

//         {/* TEACH SKILL */}
//         <div className="space-y-4">
//           <h2 className="text-lg font-semibold text-[#2b3d1f]">What can you teach?</h2>

//           <div className="flex gap-3">
//             <input
//               type="text"
//               value={teachSkill}
//               onChange={e => setTeachSkill(e.target.value)}
//               placeholder="e.g., Python, Guitar, Calculus I"
//               className="w-full border border-[#ccd3c7] px-4 py-2 rounded-lg"
//             />
//             <select
//               value={teachLevel}
//               onChange={e => setTeachLevel(e.target.value)}
//               className="border border-[#ccd3c7] px-4 py-2 rounded-lg"
//             >
//               <option>Beginner</option>
//               <option>Intermediate</option>
//               <option>Advanced</option>
//             </select>
//           </div>

//           <textarea
//             value={teachDesc}
//             onChange={e => setTeachDesc(e.target.value)}
//             placeholder="Describe what you cover in a session"
//             className="w-full border border-[#ccd3c7] px-4 py-2 rounded-lg"
//             rows={3}
//           />

//           <div>
//             <p className="text-sm text-[#2b3d1f] font-medium mb-2">Preferred session length</p>
//             <div className="flex gap-3">
//               {timeOptions.map((t) => (
//                 <button
//                   key={t}
//                   onClick={() => setSessionLength(t)}
//                   className={`px-4 py-2 rounded-lg border ${sessionLength === t ? "bg-[#7e9c6c] text-white" : "bg-[#eef2ea]"}`}
//                 >
//                   {t} min
//                 </button>
//               ))}
//             </div>
//           </div>
//         </div>

//         {/* LEARN SKILL */}
//         <div className="space-y-4">
//           <h2 className="text-lg font-semibold text-[#2b3d1f]">What do you want to learn?</h2>

//           <div className="flex gap-3">
//             <input
//               type="text"
//               value={learnSkill}
//               onChange={e => setLearnSkill(e.target.value)}
//               placeholder="e.g., Graphic Design, Japanese"
//               className="w-full border border-[#ccd3c7] px-4 py-2 rounded-lg"
//             />
//             <select
//               value={learnLevel}
//               onChange={e => setLearnLevel(e.target.value)}
//               className="border border-[#ccd3c7] px-4 py-2 rounded-lg"
//             >
//               <option>New to it</option>
//               <option>Some practice</option>
//               <option>Comfortable</option>
//             </select>
//           </div>

//           <textarea
//             value={learnGoal}
//             onChange={e => setLearnGoal(e.target.value)}
//             placeholder="What do you want to achieve?"
//             className="w-full border border-[#ccd3c7] px-4 py-2 rounded-lg"
//             rows={3}
//           />
//         </div>

//         {/* AVAILABILITY */}
//         <div>
//           <h2 className="text-lg font-semibold text-[#2b3d1f] mb-3">Availability</h2>

//           <div className="flex gap-2 mb-3">
//             {dayOptions.map((d) => (
//               <button
//                 key={d}
//                 onClick={() => toggleDay(d)}
//                 className={`px-3 py-1 rounded-full text-sm border ${
//                   selectedDays.includes(d)
//                     ? "bg-[#7e9c6c] text-white border-[#7e9c6c]"
//                     : "bg-[#eef2ea] border-[#ccd3c7]"
//                 }`}
//               >
//                 {d}
//               </button>
//             ))}
//           </div>

//           <div className="flex gap-3 items-center">
//             <span className="text-sm font-medium">From</span>
//             <input
//               type="time"
//               value={fromTime}
//               onChange={e => setFromTime(e.target.value)}
//               className="border border-[#ccd3c7] px-3 py-1 rounded-lg"
//             />
//             <span className="text-sm font-medium">To</span>
//             <input
//               type="time"
//               value={toTime}
//               onChange={e => setToTime(e.target.value)}
//               className="border border-[#ccd3c7] px-3 py-1 rounded-lg"
//             />
//           </div>
//         </div>

//         {/* PLATFORM */}
//         <div>
//           <p className="text-sm text-[#2b3d1f] font-medium mb-2">Session platform preference</p>
//           <div className="flex gap-3">
//             {["Google Meet", "Zoom"].map((p) => (
//               <button
//                 key={p}
//                 onClick={() => setPlatform(p)}
//                 className={`px-4 py-2 rounded-lg border ${
//                   platform === p ? "bg-[#7e9c6c] text-white border-[#7e9c6c]" : "bg-[#eef2ea] border-[#ccd3c7]"
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
//           <p className="text-sm text-[#2b3d1f] font-medium">Show this skill on my public profile</p>
//         </div>

//         {/* ACTION BUTTONS */}
//         <div className="flex justify-end gap-4 pt-4">
//           <button className="px-5 py-2 rounded-lg border text-[#2b3d1f] hover:bg-[#f0f2ec]">
//             Cancel
//           </button>
//           <button className="px-5 py-2 bg-[#7e9c6c] text-white rounded-lg hover:bg-[#6c875e]">
//             Save Skill
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

  const [learnSkill, setLearnSkill] = useState("");
  const [learnLevel, setLearnLevel] = useState("New to it");
  const [learnGoal, setLearnGoal] = useState("");

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
    setSelectedDays(prev =>
      prev.includes(day) ? prev.filter(d => d !== day) : [...prev, day]
    );
  }

  async function saveSkill() {
    if (!teachSkill.trim()) {
      alert("Please enter a skill you can teach");
      return;
    }
    if (!learnSkill.trim()) {
      alert("Please enter a skill you want to learn");
      return;
    }

    setBusy(true);

    await fetch("/api/skills/offer", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({
        teachSkill,
        teachLevel,
        teachDesc,
        learnSkill,
        learnLevel,
        learnGoal,
        sessionLength,
        selectedDays,
        fromTime,
        toTime,
        platform,
        publicListing
      }),
    });

    setBusy(false);
    alert("Skill saved successfully!");
  }

  return (
    <div className="min-h-screen bg-[#f3f5ed] flex justify-center items-start py-12 px-6">

      <div className="bg-white border border-[#e0e6d8] rounded-2xl shadow-lg p-7 space-y-8 w-full max-w-3xl">

        <h1 className="text-3xl font-bold text-[#2b3d1f]">Add a Skill</h1>
        <p className="text-gray-600">
          Tell others what you can teach — and what you want to learn.
        </p>

        {/* TEACH SECTION */}
        <div className="space-y-4">
          <h2 className="text-lg font-semibold text-[#2b3d1f]">What can you teach?</h2>

          <div className="flex gap-3">
            <input
              type="text"
              value={teachSkill}
              onChange={e => setTeachSkill(e.target.value)}
              placeholder="e.g., Python, Guitar, Calculus I"
              className="w-full border border-[#ccd3c7] px-4 py-2 rounded-lg"
            />

            <select
              value={teachLevel}
              onChange={e => setTeachLevel(e.target.value)}
              className="border border-[#ccd3c7] px-4 py-2 rounded-lg"
            >
              <option>Beginner</option>
              <option>Intermediate</option>
              <option>Advanced</option>
            </select>
          </div>

          <textarea
            value={teachDesc}
            onChange={e => setTeachDesc(e.target.value)}
            placeholder="Describe your teaching approach..."
            className="w-full border border-[#ccd3c7] px-4 py-2 rounded-lg"
            rows={3}
          />

          <div>
            <p className="text-sm font-medium mb-2 text-[#2b3d1f]">Preferred session length</p>
            <div className="flex gap-3">
              {timeOptions.map((t) => (
                <button
                  key={t}
                  onClick={() => setSessionLength(t)}
                  className={`px-4 py-2 rounded-lg border ${
                    sessionLength === t ? "bg-[#7e9c6c] text-white border-[#7e9c6c]" : "bg-[#eef2ea]"
                  }`}
                >
                  {t} min
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* LEARN SECTION */}
        <div className="space-y-4">
          <h2 className="text-lg font-semibold text-[#2b3d1f]">What do you want to learn?</h2>

          <div className="flex gap-3">
            <input
              type="text"
              value={learnSkill}
              onChange={e => setLearnSkill(e.target.value)}
              placeholder="e.g., Japanese, Graphic Design"
              className="w-full border border-[#ccd3c7] px-4 py-2 rounded-lg"
            />

            <select
              value={learnLevel}
              onChange={e => setLearnLevel(e.target.value)}
              className="border border-[#ccd3c7] px-4 py-2 rounded-lg"
            >
              <option>New to it</option>
              <option>Some practice</option>
              <option>Comfortable</option>
            </select>
          </div>

          <textarea
            value={learnGoal}
            onChange={e => setLearnGoal(e.target.value)}
            placeholder="What do you want to achieve?"
            className="w-full border border-[#ccd3c7] px-4 py-2 rounded-lg"
            rows={3}
          />
        </div>

        {/* AVAILABILITY */}
        <div>
          <h2 className="text-lg font-semibold text-[#2b3d1f] mb-3">Availability</h2>
          <div className="flex gap-2 mb-3">
            {dayOptions.map((d) => (
              <button
                key={d}
                onClick={() => toggleDay(d)}
                className={`px-3 py-1 rounded-full text-sm border ${
                  selectedDays.includes(d)
                    ? "bg-[#7e9c6c] text-white border-[#7e9c6c]"
                    : "bg-[#eef2ea] border-[#ccd3c7]"
                }`}
              >
                {d}
              </button>
            ))}
          </div>

          <div className="flex gap-3 items-center">
            <span className="text-sm font-medium">From</span>
            <input
              type="time"
              value={fromTime}
              onChange={e => setFromTime(e.target.value)}
              className="border border-[#ccd3c7] px-3 py-1 rounded-lg"
            />
            <span className="text-sm font-medium">To</span>
            <input
              type="time"
              value={toTime}
              onChange={e => setToTime(e.target.value)}
              className="border border-[#ccd3c7] px-3 py-1 rounded-lg"
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
                  platform === p ? "bg-[#7e9c6c] text-white border-[#7e9c6c]" : "bg-[#eef2ea]"
                }`}
              >
                {p}
              </button>
            ))}
          </div>
        </div>

        {/* PUBLIC LISTING */}
        <div className="flex items-center gap-3 pt-2">
          <input type="checkbox" checked={publicListing} onChange={() => setPublicListing(!publicListing)} />
          <p className="text-sm font-medium">Show this skill on my public profile</p>
        </div>

        {/* ACTIONS */}
        <div className="flex justify-end gap-4 pt-2">
          <button className="px-5 py-2 rounded-lg border text-[#2b3d1f] hover:bg-[#f0f2ec]">
            Cancel
          </button>

          <button
            onClick={saveSkill}
            disabled={busy}
            className={`px-5 py-2 rounded-lg text-white
              ${busy ? "bg-gray-500 cursor-wait" : "bg-[#7e9c6c] hover:bg-[#6c875e]"}
            `}
          >
            {busy ? "Saving..." : "Save Skill"}
          </button>
        </div>
      </div>
    </div>
  );
}
