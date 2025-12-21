// "use client";

// import { useEffect, useState } from "react";

// export default function ProfilePage() {
//   const [user, setUser] = useState<any>(null);
//   const [skillsOffered, setSkillsOffered] = useState<any[]>([]);
//   const [skillsWanted, setSkillsWanted] = useState<any[]>([]);

//   const [teachSkillInput, setTeachSkillInput] = useState("");
//   const [learnSkillInput, setLearnSkillInput] = useState("");

//   const [editingBio, setEditingBio] = useState(false);
//   const [bioInput, setBioInput] = useState("");

//   // NEW FIELDS FOR NAME + AVATAR
//   const [firstName, setFirstName] = useState("");
//   const [lastName, setLastName] = useState("");
//   const [avatar, setAvatar] = useState("");
//   const [editing, setEditing] = useState(false);


//   useEffect(() => {
//     loadUser();
//     loadOfferedSkills();
//     loadWantedSkills();
//   }, []);

//   async function loadUser() {
//     const res = await fetch("/api/auth/me", { credentials: "include" });
//     const data = await res.json();

//     setUser(data.user);

//     // Fill editable fields
//     setFirstName(data.user.firstName);
//     setLastName(data.user.lastName);
//     setAvatar(data.user.avatar || "");
//     setBioInput(data.user.bio || "");
//   }

//   async function loadOfferedSkills() {
//     const res = await fetch("/api/skills/offer", { credentials: "include" });
//     const data = await res.json();
//     setSkillsOffered(data.skills);
//   }

//   async function loadWantedSkills() {
//     const res = await fetch("/api/skills/want", { credentials: "include" });
//     const data = await res.json();
//     setSkillsWanted(data.skills);
//   }

//   async function submitTeachSkill() {
//     if (!teachSkillInput.trim()) return;

//     await fetch("/api/skills/offer", {
//       method: "POST",
//       headers: { "Content-Type": "application/json" },
//       credentials: "include",
//       body: JSON.stringify({
//         teachSkill: teachSkillInput,
//         teachLevel: "Beginner",
//         teachDesc: "",
//         learnSkill: "",
//         learnLevel: "",
//         learnGoal: "",
//         sessionLength: "60",
//         selectedDays: [],
//         fromTime: "",
//         toTime: "",
//         platform: "Google Meet",
//         publicListing: true
//       }),
//     });

//     setTeachSkillInput("");
//     loadOfferedSkills();
//   }

//   async function submitLearnSkill() {
//     if (!learnSkillInput.trim()) return;

//     await fetch("/api/skills/want", {
//       method: "POST",
//       headers: { "Content-Type": "application/json" },
//       credentials: "include",
//       body: JSON.stringify({ skill: learnSkillInput }),
//     });

//     setLearnSkillInput("");
//     loadWantedSkills();
//   }

//   async function deleteSkill(skillName: string, type: string) {
//     await fetch("/api/skills/delete", {
//       method: "POST",
//       headers: { "Content-Type": "application/json" },
//       credentials: "include",
//       body: JSON.stringify({ skill: skillName, type }),
//     });

//     if (type === "offer") loadOfferedSkills();
//     else loadWantedSkills();
//   }

//   // ---------- NEW: Upload Avatar ----------
//   async function handleAvatarUpload(e: any) {
//     const file = e.target.files[0];
//     if (!file) return;

//     const form = new FormData();
//     form.append("file", file);

//     const res = await fetch("/api/upload", {
//       method: "POST",
//       body: form,
//     });

//     const data = await res.json();
//     if (data.url) setAvatar(data.url);
//   }

//   // ---------- NEW: Save Name + Avatar ----------
// // async function saveBasicProfile() {
// //   await fetch("/api/profile/update", {
// //     method: "POST",
// //     headers: { "Content-Type": "application/json" },
// //     credentials: "include",
// //     body: JSON.stringify({
// //       firstName,
// //       lastName,
// //       avatar,
// //     }),
// //   });

// //   alert("Profile updated!");

// //   loadUser();        // Refresh updated data
// //   setEditing(false); // ⬅️ EXIT EDIT MODE
// // }

// async function saveBasicProfile() {
//   await fetch("/api/profile/update", {
//     method: "POST",
//     headers: { "Content-Type": "application/json" },
//     credentials: "include",
//     body: JSON.stringify({
//       firstName,
//       lastName,
//       avatar,
//     }),
//   });

//   alert("Profile updated!");

//   // 🔥 Tell navbar to refresh
//   window.dispatchEvent(new Event("profile-updated"));

//   // Exit edit mode
//   setEditing(false);

//   // Reload the profile page user data
//   loadUser();
// }


//   // ---------- Bio Save ----------
//   async function saveBio() {
//     await fetch("/api/profile/bio", {
//       method: "POST",
//       headers: { "Content-Type": "application/json" },
//       credentials: "include",
//       body: JSON.stringify({ bio: bioInput }),
//     });
//     setEditingBio(false);
//   }

//   if (!user) return <div className="text-xl p-10">Loading...</div>;

//   return (
//     <div className="px-12 py-10 bg-[#f7f7f7] min-h-screen font-['Inter']">

//       {/* HEADER */}
//       <div className="text-3xl font-bold text-[#2b3d1f] mb-1">My Profile</div>
//       <div className="text-gray-600 mb-8">
//         Update your details, photo, and your skills.
//       </div>

//       {/* ======================= */}
//       {/*   TOP CARD (UPDATED)    */}
//       {/* ======================= */}
//       {/* TOP CARD */}
// <div className="bg-white border border-[#d8dccf] rounded-2xl shadow p-6 mb-6">
//   <div className="flex justify-between">

//     {/* LEFT SIDE */}
//     <div className="flex gap-5 items-center">

//       {/* Avatar / Initials */}
//       {avatar ? (
//         <img src={avatar} className="rounded-full w-16 h-16 object-cover border" />
//       ) : (
//         <div className="w-16 h-16 rounded-full bg-[#4a5e27] text-white flex items-center justify-center text-lg font-bold">
//           {user.firstName[0]}
//           {user.lastName[0]}
//         </div>
//       )}

//       {/* VIEW MODE */}
//       {!editing && (
//         <div>
//           <div className="font-semibold text-lg">{user.firstName} {user.lastName}</div>
//           <div className="text-sm text-gray-500">{user.email}</div>

//           <button
//             onClick={() => setEditing(true)}
//             className="mt-2 px-3 py-1 border rounded bg-[#eef2ea] text-sm"
//           >
//             Edit Profile
//           </button>
//         </div>
//       )}

//       {/* EDIT MODE */}
//       {editing && (
//         <div className="space-y-2">
//           <label className="text-sm text-[#4a5e27] cursor-pointer underline">
//             Upload Photo
//             <input type="file" onChange={handleAvatarUpload} className="hidden" />
//           </label>

//           <input
//             value={firstName}
//             onChange={(e) => setFirstName(e.target.value)}
//             className="border p-2 rounded w-full"
//           />

//           <input
//             value={lastName}
//             onChange={(e) => setLastName(e.target.value)}
//             className="border p-2 rounded w-full"
//           />

//           <div className="flex gap-2 mt-2">
//             <button
//               onClick={saveBasicProfile}
//               className="px-4 py-2 bg-[#4a5e27] text-white rounded"
//             >
//               Save Changes
//             </button>

//             <button
//               onClick={() => setEditing(false)}
//               className="px-4 py-2 border rounded"
//             >
//               Cancel
//             </button>
//           </div>
//         </div>
//       )}

//     </div>

//     <button className="text-[#4a5e27] hover:text-[#2b3d1f] text-sm underline">
//       View public profile
//     </button>
//   </div>
// </div>


//       {/* SKILLS + BIO — SAME AS BEFORE */}
//       <div className="grid grid-cols-2 gap-6">

//         {/* LEFT */}
//         <div className="space-y-6">

//           <SkillCard
//             title="Skills I can teach"
//             skills={skillsOffered}
//             input={teachSkillInput}
//             placeholder="e.g. Python, Guitar"
//             setInput={setTeachSkillInput}
//             onAdd={submitTeachSkill}
//             onDelete={(s: string) => deleteSkill(s, "offer")}
//           />

//           <SkillCard
//             title="Skills I want to learn"
//             skills={skillsWanted}
//             input={learnSkillInput}
//             placeholder="e.g. UI/UX, Japanese"
//             setInput={setLearnSkillInput}
//             onAdd={submitLearnSkill}
//             onDelete={(s: string) => deleteSkill(s, "want")}
//           />

//         </div>

//         {/* RIGHT (BIO) */}
//         <div>
//           <div className="bg-white border border-[#d8dccf] rounded-2xl shadow p-6 mb-6">
//             <div className="font-semibold mb-2">About Me</div>

//             {!editingBio ? (
//               <p className="text-sm text-gray-700">{bioInput || "No bio added yet."}</p>
//             ) : (
//               <textarea
//                 className="w-full border px-3 py-2 rounded text-sm"
//                 rows={3}
//                 value={bioInput}
//                 onChange={(e) => setBioInput(e.target.value)}
//               />
//             )}

//             <div className="flex justify-end mt-3">
//               {editingBio ? (
//                 <div className="flex gap-2">
//                   <button onClick={saveBio} className="px-4 py-1 bg-[#4a5e27] text-white rounded">
//                     Save
//                   </button>
//                   <button onClick={() => setEditingBio(false)} className="px-4 py-1 border rounded">
//                     Cancel
//                   </button>
//                 </div>
//               ) : (
//                 <button
//                   onClick={() => setEditingBio(true)}
//                   className="px-4 py-1 border rounded bg-[#eef2ea]"
//                 >
//                   Edit summary
//                 </button>
//               )}
//             </div>
//           </div>
//         </div>

//       </div>
//     </div>
//   );
// }


// function SkillCard({ title, skills, input, placeholder, setInput, onAdd, onDelete }: any) {
//   return (
//     <div className="bg-white border border-[#d8dccf] rounded-2xl shadow p-6">
//       <div className="font-semibold mb-2">{title}</div>

//       <div className="flex flex-wrap gap-2 mb-3">
//         {skills.map((s: any, i: number) => (
//           <div key={i} className="flex items-center gap-2 px-3 py-1 text-xs rounded-full border bg-[#eef2ea]">
//             <span>{s.name}</span>
//             <button onClick={() => onDelete(s.name)} className="text-red-500 hover:text-red-700 text-sm font-bold">
//               ✕
//             </button>
//           </div>
//         ))}
//       </div>

//       <div className="flex gap-2">
//         <input
//           value={input}
//           onChange={(e) => setInput(e.target.value)}
//           className="border border-[#cdd6c5] px-3 py-1 text-sm rounded w-full"
//           placeholder={placeholder}
//         />
//         <button onClick={onAdd} className="px-4 py-1 rounded text-sm bg-[#4a5e27] text-white">
//           Add
//         </button>
//       </div>
//     </div>
//   );
// }





"use client";

import { useEffect, useState } from "react";

export default function ProfilePage() {
  const [user, setUser] = useState<any>(null);

  const [skillsOffered, setSkillsOffered] = useState<any[]>([]);
  const [skillsWanted, setSkillsWanted] = useState<any[]>([]);

  const [teachSkillInput, setTeachSkillInput] = useState("");
  const [learnSkillInput, setLearnSkillInput] = useState("");

  const [editingBio, setEditingBio] = useState(false);
  const [bioInput, setBioInput] = useState("");

  const [editing, setEditing] = useState(false);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [avatar, setAvatar] = useState("");

  useEffect(() => {
    loadAll();
  }, []);

  async function loadAll() {
    await Promise.all([
      loadUser(),
      loadOfferedSkills(),
      loadWantedSkills(),
    ]);
  }

  async function loadUser() {
    const res = await fetch("/api/auth/me", { credentials: "include" });
    const data = await res.json();
    if (!data.user) return;

    setUser(data.user);
    setFirstName(data.user.firstName);
    setLastName(data.user.lastName);
    setAvatar(data.user.avatar || "");
    setBioInput(data.user.bio || "");
  }

  async function loadOfferedSkills() {
    const res = await fetch("/api/skills/offer", { credentials: "include" });
    const data = await res.json();
    setSkillsOffered(data.skills || []);
  }

  async function loadWantedSkills() {
    const res = await fetch("/api/skills/want", { credentials: "include" });
    const data = await res.json();
    setSkillsWanted(data.skills || []);
  }

  // -------- SKILLS --------
  async function submitTeachSkill() {
    if (!teachSkillInput.trim()) return;

    await fetch("/api/skills/offer", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({
        teachSkill: teachSkillInput,
        teachLevel: "Beginner",
        teachDesc: "",
        sessionLength: "60",
        selectedDays: [],
        fromTime: "",
        toTime: "",
        platform: "Google Meet",
        publicListing: true,
      }),
    });

    setTeachSkillInput("");
    loadOfferedSkills();
  }

  async function submitLearnSkill() {
    if (!learnSkillInput.trim()) return;

    await fetch("/api/skills/want", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ skill: learnSkillInput }),
    });

    setLearnSkillInput("");
    loadWantedSkills();
  }

  async function deleteSkill(skillName: string, type: "offer" | "want") {
    await fetch("/api/skills/delete", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ skill: skillName, type }),
    });

    type === "offer" ? loadOfferedSkills() : loadWantedSkills();
  }

  // -------- AVATAR --------
  async function handleAvatarUpload(e: any) {
    const file = e.target.files?.[0];
    if (!file) return;

    const form = new FormData();
    form.append("file", file);

    const res = await fetch("/api/upload", { method: "POST", body: form });
    const data = await res.json();
    if (data.url) setAvatar(data.url);
  }

  async function saveBasicProfile() {
    await fetch("/api/profile/update", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ firstName, lastName, avatar }),
    });

    window.dispatchEvent(new Event("profile-updated"));
    setEditing(false);
    loadUser();
  }

  async function saveBio() {
    await fetch("/api/profile/bio", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ bio: bioInput }),
    });
    setEditingBio(false);
  }

  if (!user) return <div className="p-10 text-xl">Loading...</div>;

  return (
    <div className="px-12 py-10 bg-[#f7f7f7] min-h-screen font-['Inter']">

      {/* HEADER */}
      <h1 className="text-3xl font-bold text-[#2b3d1f]">My Profile</h1>
      <p className="text-gray-600 mb-8">Update your details, photo, and your skills.</p>

      {/* PROFILE CARD */}
      <div className="bg-white border rounded-2xl shadow p-6 mb-6 flex justify-between">
        <div className="flex items-center gap-5">

          {avatar ? (
            <img src={avatar} className="w-16 h-16 rounded-full object-cover border" />
          ) : (
            <div className="w-16 h-16 rounded-full bg-[#4a5e27] text-white flex items-center justify-center font-bold">
              {user.firstName[0]}
              {user.lastName[0]}
            </div>
          )}

          {!editing ? (
            <div>
              <div className="font-semibold text-lg">{user.firstName} {user.lastName}</div>
              <div className="text-sm text-gray-500">{user.email}</div>
              <button
                onClick={() => setEditing(true)}
                className="mt-2 px-3 py-1 border rounded bg-[#eef2ea] text-sm"
              >
                Edit Profile
              </button>
            </div>
          ) : (
            <div className="space-y-2">
              <label className="text-sm underline cursor-pointer text-[#4a5e27]">
                Upload Photo
                <input type="file" onChange={handleAvatarUpload} className="hidden" />
              </label>

              <input
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                className="border p-2 rounded w-full"
              />
              <input
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                className="border p-2 rounded w-full"
              />

              <div className="flex gap-2">
                <button onClick={saveBasicProfile} className="px-4 py-2 bg-[#4a5e27] text-white rounded">
                  Save
                </button>
                <button onClick={() => setEditing(false)} className="px-4 py-2 border rounded">
                  Cancel
                </button>
              </div>
            </div>
          )}
        </div>

        <button className="text-sm underline text-[#4a5e27]">
          View public profile
        </button>
      </div>

      {/* SKILLS + ABOUT */}
      <div className="grid grid-cols-2 gap-6">

        <div className="space-y-6">
          <SkillCard
            title="Skills I can teach"
            skills={skillsOffered}
            input={teachSkillInput}
            placeholder="e.g. Python, Guitar"
            setInput={setTeachSkillInput}
            onAdd={submitTeachSkill}
            onDelete={(s: string) => deleteSkill(s, "offer")}
          />

          <SkillCard
            title="Skills I want to learn"
            skills={skillsWanted}
            input={learnSkillInput}
            placeholder="e.g. UI/UX, Japanese"
            setInput={setLearnSkillInput}
            onAdd={submitLearnSkill}
            onDelete={(s: string) => deleteSkill(s, "want")}
          />
        </div>

        {/* ABOUT ME */}
        <div className="bg-white border rounded-2xl shadow p-6">
          <div className="font-semibold mb-2">About Me</div>

          {!editingBio ? (
            <p className="text-sm text-gray-700">{bioInput || "No bio added yet."}</p>
          ) : (
            <textarea
              className="w-full border px-3 py-2 rounded text-sm"
              rows={4}
              value={bioInput}
              onChange={(e) => setBioInput(e.target.value)}
            />
          )}

          <div className="flex justify-end mt-3">
            {editingBio ? (
              <div className="flex gap-2">
                <button onClick={saveBio} className="px-4 py-1 bg-[#4a5e27] text-white rounded">
                  Save
                </button>
                <button onClick={() => setEditingBio(false)} className="px-4 py-1 border rounded">
                  Cancel
                </button>
              </div>
            ) : (
              <button
                onClick={() => setEditingBio(true)}
                className="px-4 py-1 border rounded bg-[#eef2ea]"
              >
                Edit summary
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function SkillCard({ title, skills, input, placeholder, setInput, onAdd, onDelete }: any) {
  return (
    <div className="bg-white border rounded-2xl shadow p-6">
      <div className="font-semibold mb-2">{title}</div>

      <div className="flex flex-wrap gap-2 mb-3">
        {skills.map((s: any, i: number) => (
          <div key={i} className="flex items-center gap-2 px-3 py-1 text-xs rounded-full border bg-[#eef2ea]">
            <span>{s.name}</span>
            <button onClick={() => onDelete(s.name)} className="text-red-500 font-bold">✕</button>
          </div>
        ))}
      </div>

      <div className="flex gap-2">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className="border px-3 py-1 text-sm rounded w-full"
          placeholder={placeholder}
        />
        <button onClick={onAdd} className="px-4 py-1 bg-[#4a5e27] text-white rounded">
          Add
        </button>
      </div>
    </div>
  );
}
