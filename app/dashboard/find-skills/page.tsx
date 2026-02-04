// any can sent request even if not in want list

// "use client";

// import { useEffect, useState } from "react";
// import RequestSwapModal from "./RequestSwapModal";
// import Link from "next/link";

// /* ⭐ Star Rating */
// function StarRating({ rating }: { rating: number }) {
//   return (
//     <div className="flex items-center gap-1 text-yellow-500 text-sm">
//       {"★".repeat(Math.floor(rating))}
//       {"☆".repeat(5 - Math.floor(rating))}
//     </div>
//   );
// }

// /* ⭐ Format date helper */
// function formatDate(date: string) {
//   const d = new Date(date);

//   return d.toLocaleDateString("en-US", {
//     day: "2-digit",
//     month: "short",
//   });
// }

// export default function FindSkillsPage() {
//   const [loading, setLoading] = useState(true);
//   const [skills, setSkills] = useState<any[]>([]);

//   /* 🔍 FILTER STATE */
//   const [search, setSearch] = useState("");
//   const [level, setLevel] = useState("");
//   const [format, setFormat] = useState("");

//   /* MODAL STATE */
//   const [open, setOpen] = useState(false);
//   const [selectedSkill, setSelectedSkill] = useState<any>(null);
//   const [selectedSlot, setSelectedSlot] = useState<any>(null);

//   useEffect(() => {
//     loadSkills();
//   }, []);

//   async function loadSkills() {
//     const res = await fetch("/api/find-skills", { credentials: "include" });
//     const json = await res.json();
//     setSkills(json.skills || []);
//     setLoading(false);
//   }

//   /* ✅ APPLY FILTERS */
//   const filtered = skills.filter((skill) => {
//     const matchSearch =
//       skill.name.toLowerCase().includes(search.toLowerCase());

//     const matchLevel = level ? skill.level === level : true;
//     const matchFormat = format ? skill.platform === format : true;

//     return matchSearch && matchLevel && matchFormat;
//   });

//   return (
//     <div className="flex bg-[#f7f7f7] min-h-screen">

//       {/* ================= LEFT FILTER ================= */}
//       <div className="w-80 bg-white border-r p-6 space-y-4">
//         <input
//           className="border rounded px-3 py-2 w-full"
//           placeholder="Search skill..."
//           value={search}
//           onChange={(e) => setSearch(e.target.value)}
//         />

//         <select
//           className="border rounded px-3 py-2 w-full"
//           value={level}
//           onChange={(e) => setLevel(e.target.value)}
//         >
//           <option value="">Any level</option>
//           <option>Beginner</option>
//           <option>Intermediate</option>
//           <option>Advanced</option>
//         </select>

//         <select
//           className="border rounded px-3 py-2 w-full"
//           value={format}
//           onChange={(e) => setFormat(e.target.value)}
//         >
//           <option value="">Any format</option>
//           <option>Google Meet</option>
//           <option>Zoom</option>
//         </select>
//       </div>

//       {/* ================= MAIN CONTENT ================= */}
//       <div className="flex-1 p-10">
//         <h1 className="text-2xl font-bold mb-6">Find skills to learn</h1>

//         {loading && <p>Loading...</p>}
//         {!loading && filtered.length === 0 && <p>No matches found.</p>}

//         <div className="grid grid-cols-2 gap-5">
//           {filtered.map((skill) => (
//             <div
//               key={skill.id}
//               className="bg-white border rounded-xl p-5 shadow-sm hover:shadow-md transition"
//             >
//               {/* USER */}
//               <div className="flex items-center gap-4">
//                 {skill.user.avatar ? (
//                   <img
//                     src={skill.user.avatar}
//                     className="w-12 h-12 rounded-full object-cover border"
//                   />
//                 ) : (
//                   <div className="w-12 h-12 rounded-full bg-[#4a5e27] text-white flex items-center justify-center font-bold">
//                     {skill.user.firstName[0]}
//                     {skill.user.lastName[0]}
//                   </div>
//                 )}

//                 <div>
//                   <div className="font-semibold">
//                     {skill.user.firstName} {skill.user.lastName}
//                   </div>

//                   <div className="flex items-center gap-2">
//                     <StarRating rating={skill.rating} />
//                     <span className="text-xs text-gray-500">
//                       {skill.rating} ({skill.reviewsCount})
//                     </span>
//                   </div>
//                 </div>
//               </div>

//               {/* SKILL */}
//               <div className="mt-4">
//                 <div className="text-lg font-bold">{skill.name}</div>
//                 <p className="text-sm text-gray-600">{skill.description}</p>
//               </div>

//               {/* ⭐ SLOTS WITH DATE */}
//               <div className="mt-4 space-y-2">
//                 <p className="text-sm font-medium text-gray-700">
//                   Available slots:
//                 </p>

//                 <div className="flex flex-wrap gap-2">
//                   {skill.slots.map((slot: any) => (
//                     <button
//                       key={slot.id}
//                       onClick={() => {
//                         setSelectedSkill(skill);
//                         setSelectedSlot(slot);
//                         setOpen(true);
//                       }}
//                       className="
//                         px-3 py-1 text-xs rounded-full
//                         border bg-[#eef2ea]
//                         hover:bg-[#4a5e27] hover:text-white
//                         transition
//                       "
//                     >
//                       📅 {slot.day} • {formatDate(slot.date)} • {slot.timeFrom}–{slot.timeTo}
//                     </button>
//                   ))}
//                 </div>
//               </div>

//               {/* PROFILE LINK */}
//               <div className="mt-4">
//                 <Link
//                   href={`/dashboard/profile/${skill.user.id}`}
//                   className="
//                     block text-center
//                     border border-gray-300
//                     rounded-lg py-2
//                     font-medium text-gray-700
//                     transition
//                     hover:bg-[#4a5e27]
//                     hover:text-white
//                   "
//                 >
//                   View Profile
//                 </Link>
//               </div>
//             </div>
//           ))}
//         </div>
//       </div>

//       {/* MODAL */}
//       {selectedSkill && selectedSlot && (
//         <RequestSwapModal
//   open={open}
//   skill={selectedSkill}
//   slot={selectedSlot}
//   user={selectedSkill.user}   // ⭐ ADD THIS
//   onClose={() => setOpen(false)}
// />

//       )}
//     </div>
//   );
// }


"use client";

import { useEffect, useState } from "react";
import RequestSwapModal from "./RequestSwapModal";
import Link from "next/link";

/* ⭐ Star Rating */
function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-1 text-yellow-500 text-sm">
      {"★".repeat(Math.floor(rating))}
      {"☆".repeat(5 - Math.floor(rating))}
    </div>
  );
}

/* ⭐ Format date helper */
function formatDate(date: string) {
  const d = new Date(date);

  return d.toLocaleDateString("en-US", {
    day: "2-digit",
    month: "short",
  });
}

export default function FindSkillsPage() {
  const [loading, setLoading] = useState(true);
  const [skills, setSkills] = useState<any[]>([]);

  /* 🔍 FILTER STATE */
  const [search, setSearch] = useState("");
  const [level, setLevel] = useState("");
  const [format, setFormat] = useState("");

  /* MODAL STATE */
  const [open, setOpen] = useState(false);
  const [selectedSkill, setSelectedSkill] = useState<any>(null);
  const [selectedSlot, setSelectedSlot] = useState<any>(null);

  useEffect(() => {
    loadSkills();
  }, []);

  async function loadSkills() {
    const res = await fetch("/api/find-skills", { credentials: "include" });
    const json = await res.json();
    setSkills(json.skills || []);
    setLoading(false);
  }

  /* ================= FILTER ================= */
  const filtered = skills.filter((skill) => {
    const matchSearch =
      skill.name.toLowerCase().includes(search.toLowerCase());

    const matchLevel = level ? skill.level === level : true;
    const matchFormat = format ? skill.platform === format : true;

    return matchSearch && matchLevel && matchFormat;
  });

  return (
    <div className="flex bg-[#f7f7f7] min-h-screen">

      {/* ================= LEFT FILTER ================= */}
      <div className="w-80 bg-white border-r p-6 space-y-4">
        <input
          className="border rounded px-3 py-2 w-full"
          placeholder="Search skill..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <select
          className="border rounded px-3 py-2 w-full"
          value={level}
          onChange={(e) => setLevel(e.target.value)}
        >
          <option value="">Any level</option>
          <option>Beginner</option>
          <option>Intermediate</option>
          <option>Advanced</option>
        </select>

        <select
          className="border rounded px-3 py-2 w-full"
          value={format}
          onChange={(e) => setFormat(e.target.value)}
        >
          <option value="">Any format</option>
          <option>Google Meet</option>
          <option>Zoom</option>
        </select>
      </div>

      {/* ================= MAIN CONTENT ================= */}
      <div className="flex-1 p-10">
        <h1 className="text-2xl font-bold mb-6">Find skills to learn</h1>

        {loading && <p>Loading...</p>}
        {!loading && filtered.length === 0 && <p>No matches found.</p>}

        <div className="grid grid-cols-2 gap-5">
          {filtered.map((skill) => (
            <div
              key={skill.id}
              className="bg-white border rounded-xl p-5 shadow-sm hover:shadow-md transition"
            >
              {/* ================= USER ================= */}
              <div className="flex items-center gap-4">
                {skill.user.avatar ? (
                  <img
                    src={skill.user.avatar}
                    className="w-12 h-12 rounded-full object-cover border"
                  />
                ) : (
                  <div className="w-12 h-12 rounded-full bg-[#4a5e27] text-white flex items-center justify-center font-bold">
                    {skill.user.firstName[0]}
                    {skill.user.lastName[0]}
                  </div>
                )}

                <div>
                  <div className="font-semibold">
                    {skill.user.firstName} {skill.user.lastName}
                  </div>

                  <div className="flex items-center gap-2">
                    <StarRating rating={skill.rating} />
                    <span className="text-xs text-gray-500">
                      {skill.rating} ({skill.reviewsCount})
                    </span>
                  </div>
                </div>
              </div>

              {/* ================= SKILL INFO ================= */}
              <div className="mt-4">
                <div className="text-lg font-bold">{skill.name}</div>
                <p className="text-sm text-gray-600">{skill.description}</p>
              </div>

              {/* ================= SLOTS ================= */}
              <div className="mt-4 space-y-2">
                <p className="text-sm font-medium text-gray-700">
                  Available slots:
                </p>

                <div className="flex flex-wrap gap-2">

                  {skill.slots.map((slot: any) => {

                    /* ===== STATUS LOGIC ===== */
                    if (!skill.canRequest) {
                      return null; // hide completely
                    }

                    if (skill.alreadyRequested) {
                      return (
                        <span
                          key={slot.id}
                          className="
                            px-3 py-1 text-xs rounded-full
                            bg-yellow-100 text-yellow-800
                            font-medium
                          "
                        >
                          ✓ Request Sent
                        </span>
                      );
                    }

                    return (
                      <button
                        key={slot.id}
                        onClick={() => {
                          setSelectedSkill(skill);
                          setSelectedSlot(slot);
                          setOpen(true);
                        }}
                        className="
                          px-3 py-1 text-xs rounded-full
                          border bg-[#eef2ea]
                          hover:bg-[#4a5e27] hover:text-white
                          transition
                        "
                      >
                        📅 {slot.day} • {formatDate(slot.date)} • {slot.timeFrom}–{slot.timeTo}
                      </button>
                    );
                  })}

                </div>
              </div>

              {/* ================= PROFILE LINK ================= */}
              <div className="mt-4">
                <Link
                  href={`/dashboard/profile/${skill.user.id}`}
                  className="
                    block text-center
                    border border-gray-300
                    rounded-lg py-2
                    font-medium text-gray-700
                    transition
                    hover:bg-[#4a5e27]
                    hover:text-white
                  "
                >
                  View Profile
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ================= MODAL ================= */}
      {selectedSkill && selectedSlot && (
        <RequestSwapModal
          open={open}
          skill={selectedSkill}
          slot={selectedSlot}
          user={selectedSkill.user}
          onClose={() => setOpen(false)}
        />
      )}
    </div>
  );
}
