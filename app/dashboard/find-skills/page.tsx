// "use client";

// import { useEffect, useState } from "react";

// export default function FindSkillsPage() {
//   const [loading, setLoading] = useState(true);
//   const [skills, setSkills] = useState<any[]>([]);
//   const [me, setMe] = useState<any>(null);

//   const [search, setSearch] = useState("");
//   const [level, setLevel] = useState("");
//   const [format, setFormat] = useState("");

//   useEffect(() => {
//     loadSkills();
//   }, []);

//   async function loadSkills() {
//     try {
//       const res = await fetch("/api/find-skills", { credentials: "include" });
//       const json = await res.json();
//       setSkills(json.skills || []);
//       setMe(json.me || null);
//     } catch (err) {
//       console.log("Error:", err);
//     }
//     setLoading(false);
//   }

//   const filtered = skills.filter((s) => {
//     return (
//       s.name.toLowerCase().includes(search.toLowerCase()) &&
//       (level ? s.level === level : true) &&
//       (format ? s.platform === format : true)
//     );
//   });

//   return (
//     <div className="flex bg-[#f7f7f7] min-h-screen font-['Inter']">

//       {/* LEFT SIDEBAR FILTER */}
//       <div className="w-80 bg-white border-r border-[#e3e8dc] p-7 space-y-6">

//         <h2 className="text-lg font-semibold text-[#2b3d1f]">Search filters</h2>

//         <input
//           placeholder="Try 'Python', 'UX design'..."
//           className="w-full border rounded px-3 py-2"
//           value={search}
//           onChange={(e) => setSearch(e.target.value)}
//         />

//         {/* LEVEL */}
//         <div>
//           <p className="text-sm font-medium mb-1">Level</p>
//           <select
//             className="border w-full rounded px-3 py-2"
//             value={level}
//             onChange={(e) => setLevel(e.target.value)}
//           >
//             <option value="">Any</option>
//             <option>Beginner</option>
//             <option>Intermediate</option>
//             <option>Advanced</option>
//           </select>
//         </div>

//         {/* FORMAT */}
//         <div>
//           <p className="text-sm font-medium mb-1">Format</p>
//           <select
//             className="border w-full rounded px-3 py-2"
//             value={format}
//             onChange={(e) => setFormat(e.target.value)}
//           >
//             <option>Google Meet</option>
//             <option>Zoom</option>
//           </select>
//         </div>

//         <button
//           className="w-full bg-[#4a5e27] text-white rounded py-2 mt-4"
//           onClick={() => {
//             setSearch("");
//             setLevel("");
//             setFormat("");
//             loadSkills();
//           }}
//         >
//           Reset Filters
//         </button>
//       </div>

//       {/* MAIN CONTENT */}
//       <div className="flex-1 p-10">

//         <h1 className="text-2xl font-bold text-[#2b3d1f] mb-6">
//           Find skills to learn
//         </h1>

//         {/* SWAP PREFERENCES PANEL */}
//         {me && (
//           <div className="bg-white rounded-xl border p-5 mb-6">

//             <h3 className="font-semibold mb-2">Your swap preferences</h3>

//             <p className="text-sm text-gray-700">
//               <b>Skills you want to learn:</b>{" "}
//               {me.SkillsWanted?.map((s: any) => s.name).join(", ") || "None"}
//             </p>

//             <p className="text-sm text-gray-700 mt-1">
//               <b>Skills you can teach:</b>{" "}
//               {me.SkillsOffered?.map((s: any) => s.name).join(", ") || "None"}
//             </p>
//           </div>
//         )}

//         {/* LOADING */}
//         {loading && <div className="text-lg">Loading...</div>}

//         {/* RESULTS */}
//         {!loading && (
//           <>
//             {filtered.length === 0 ? (
//               <div className="text-gray-600 text-lg">No matches found.</div>
//             ) : (
//               <div className="grid grid-cols-2 gap-5">
//                 {filtered.map((skill) => (
//                   <SkillCard key={skill.id} skill={skill} />
//                 ))}
//               </div>
//             )}
//           </>
//         )}
//       </div>
//     </div>
//   );
// }

// function SkillCard({ skill }: any) {
//   return (
//     <div className="bg-white rounded-xl border shadow p-5 space-y-3">

//       <div className="flex items-center gap-3">
//         <img
//           src={skill.user.avatar || "https://i.pravatar.cc/80"}
//           className="w-12 h-12 rounded-full"
//         />
//         <div>
//           <div className="font-semibold">
//             {skill.user.firstName} {skill.user.lastName}
//           </div>
//           <div className="text-xs text-gray-500">{skill.level}</div>
//         </div>
//       </div>

//       <div className="font-bold text-lg">{skill.name}</div>
//       <p className="text-sm text-gray-600">{skill.description}</p>

//       <div className="flex gap-2 flex-wrap">
//         {skill.platform && (
//           <span className="px-2 py-1 rounded bg-[#eef2ea] text-xs border">
//             {skill.platform}
//           </span>
//         )}
//       </div>

//       <div className="flex gap-2 pt-2">
//         <button className="flex-1 bg-[#4a5e27] text-white rounded py-2">
//           Request swap
//         </button>
//        <button
//    className="flex-1 border rounded py-2"
//    onClick={() => window.location.href = `/dashboard/profile/${skill.user.id}`}
// >
//   View profile
// </button>

//       </div>
//     </div>
//   );
// }



"use client";

import { useEffect, useState } from "react";
import RequestSwapModal from "./RequestSwapModal";



export default function FindSkillsPage() {
  const [loading, setLoading] = useState(true);
  const [skills, setSkills] = useState<any[]>([]);
  const [me, setMe] = useState<any>(null);

  const [search, setSearch] = useState("");
  const [level, setLevel] = useState("");
  const [format, setFormat] = useState("");

  const [open, setOpen] = useState(false);
  const [selectedSkill, setSelectedSkill] = useState<any>(null);

  useEffect(() => {
    loadSkills();
  }, []);

  async function loadSkills() {
    const res = await fetch("/api/find-skills", { credentials: "include" });
    const json = await res.json();
    setSkills(json.skills || []);
    setMe(json.me || null);
    setLoading(false);
  }

  const filtered = skills.filter((s) =>
    s.name.toLowerCase().includes(search.toLowerCase()) &&
    (level ? s.level === level : true) &&
    (format ? s.platform === format : true)
  );

  return (
    <div className="flex bg-[#f7f7f7] min-h-screen">

      {/* LEFT FILTER */}
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

      {/* MAIN */}
      <div className="flex-1 p-10">
        <h1 className="text-2xl font-bold mb-6">Find skills to learn</h1>

        {loading && <p>Loading...</p>}

        {!loading && filtered.length === 0 && <p>No matches found.</p>}

        <div className="grid grid-cols-2 gap-5">
          {filtered.map((skill) => (
            <div key={skill.id} className="bg-white border rounded-xl p-5">
              <div className="font-semibold">
                {skill.user.firstName} {skill.user.lastName}
              </div>

              <div className="text-lg font-bold mt-2">{skill.name}</div>
              <p className="text-sm text-gray-600">{skill.description}</p>

              <div className="flex gap-2 mt-4">
                <button
                  className="flex-1 bg-[#4a5e27] text-white rounded py-2"
                  onClick={() => {
                    setSelectedSkill(skill);
                    setOpen(true);
                  }}
                >
                  Request Swap
                </button>

                <button
                  className="flex-1 border rounded py-2"
                  onClick={() =>
                    (window.location.href = `/dashboard/profile/${skill.user.id}`)
                  }
                >
                  View Profile
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {selectedSkill && (
        <RequestSwapModal
          open={open}
          skill={selectedSkill}
          onClose={() => setOpen(false)}
        />
      )}
    </div>
  );
}
