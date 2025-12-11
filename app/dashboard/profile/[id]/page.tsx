// "use client";

// import { useEffect, useState } from "react";

// export default function PublicProfilePage({
//   params,
// }: {
//   params: { id: string };
// }) {
//   const id = params.id; // ✔ clean and supported

//   const [user, setUser] = useState<any>(null);

//   useEffect(() => {
//     loadUser();
//   }, []);

//   async function loadUser() {
//     const res = await fetch(`/api/profile/${id}`);
//     const data = await res.json();
//     setUser(data.user);
//   }

//   if (!user) return <div className="p-10 text-xl">Loading...</div>;

//   return (
//     <div className="min-h-screen bg-[#f8f8f5] p-10 font-['Inter']">
//       <div className="max-w-4xl mx-auto space-y-8">

//         {/* TOP CARD */}
//         <div className="bg-white border border-[#d0d8cb] rounded-2xl shadow p-8 flex items-start gap-8">
          
//           {/* Avatar */}
//           <img
//             src={user.avatar || "https://i.pravatar.cc/120"}
//             className="w-28 h-28 rounded-full border"
//           />

//           <div className="flex-1">
//             <h1 className="text-3xl font-bold text-[#2b3d1f]">
//               {user.firstName} {user.lastName}
//             </h1>

//             <p className="text-gray-600 mt-1 text-sm">
//               {user.bio || "No bio added yet."}
//             </p>

//             {/* QUICK TAGS */}
//             <div className="flex gap-2 mt-3 flex-wrap">
//               <span className="px-3 py-1 bg-[#eef2ea] border rounded-full text-xs">
//                 Joined: {new Date(user.createdAt).toLocaleDateString()}
//               </span>
//               <span className="px-3 py-1 bg-[#eef2ea] border rounded-full text-xs">
//                 {user.skillsOffered.length} skills offered
//               </span>
//               <span className="px-3 py-1 bg-[#eef2ea] border rounded-full text-xs">
//                 {user.skillsWanted.length} skills wanted
//               </span>
//             </div>

//             {/* Actions */}
//             <div className="flex gap-3 mt-5">
//               <button className="px-5 py-2 bg-[#4a5e27] text-white rounded-lg">
//                 Request Swap
//               </button>

//               <button className="px-5 py-2 border rounded-lg">
//                 Message
//               </button>
//             </div>
//           </div>
//         </div>

//         {/* SKILLS OFFERED */}
//         <div className="bg-white border border-[#d0d8cb] rounded-2xl shadow p-8">
//           <h2 className="text-xl font-semibold text-[#2b3d1f] mb-4">
//             Skills they can teach
//           </h2>

//           {user.skillsOffered.length === 0 && (
//             <p className="text-gray-600 text-sm">No skills listed.</p>
//           )}

//           <div className="space-y-4">
//             {user.skillsOffered.map((s: any) => (
//               <div
//                 key={s.id}
//                 className="border rounded-xl p-4 hover:bg-[#f4f7f1] transition"
//               >
//                 <div className="font-semibold text-lg">{s.name}</div>
//                 <div className="text-sm text-gray-600">{s.level}</div>
//                 <p className="mt-1 text-sm text-gray-700">{s.description}</p>

//                 <div className="flex gap-2 mt-2 text-xs flex-wrap">
//                   {s.platform && (
//                     <span className="px-2 py-1 bg-[#eef2ea] border rounded-full">
//                       {s.platform}
//                     </span>
//                   )}
//                   {s.sessionLength && (
//                     <span className="px-2 py-1 bg-[#eef2ea] border rounded-full">
//                       {s.sessionLength} mins
//                     </span>
//                   )}
//                 </div>
//               </div>
//             ))}
//           </div>
//         </div>

//         {/* SKILLS THEY WANT TO LEARN */}
//         <div className="bg-white border border-[#d0d8cb] rounded-2xl shadow p-8">
//           <h2 className="text-xl font-semibold text-[#2b3d1f] mb-4">
//             Skills they want to learn
//           </h2>

//           {user.skillsWanted.length === 0 && (
//             <p className="text-gray-600 text-sm">No learning goals added.</p>
//           )}

//           <div className="space-y-4">
//             {user.skillsWanted.map((s: any) => (
//               <div
//                 key={s.id}
//                 className="border rounded-xl p-4 hover:bg-[#f4f7f1] transition"
//               >
//                 <div className="font-semibold text-lg">{s.name}</div>
//                 <div className="text-sm text-gray-600">{s.learnLevel}</div>
//                 <p className="mt-1 text-sm text-gray-700">{s.learnGoal}</p>
//               </div>
//             ))}
//           </div>
//         </div>

//       </div>
//     </div>
//   );
// }


"use client";

import { useEffect, useState } from "react";

export default function PublicProfilePage({ params }: { params: { id: string } }) {
  const id = params.id;
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    fetch(`/api/profile/${id}`)
      .then((res) => res.json())
      .then((data) => setUser(data.user));
  }, []);

  if (!user) return <div className="p-10 text-xl">Loading...</div>;

  // Generate initials if no avatar
  const initials =
    user.firstName?.[0]?.toUpperCase() +
    (user.lastName?.[0]?.toUpperCase() || "");

  return (
    <div className="min-h-screen bg-[#f8f8f5] p-10 font-['Inter']">
      <div className="max-w-4xl mx-auto space-y-8">

        {/* TOP CARD */}
        <div className="bg-white border border-[#d0d8cb] rounded-2xl shadow p-8 flex items-start gap-8">

          {/* Avatar OR Initials */}
          {user.avatar ? (
            <img
              src={user.avatar}
              className="w-28 h-28 rounded-full object-cover border"
            />
          ) : (
            <div className="w-28 h-28 rounded-full bg-[#4a5e27] flex items-center justify-center text-white text-3xl font-bold border">
              {initials}
            </div>
          )}

          {/* Right side */}
          <div className="flex-1">
            <h1 className="text-3xl font-bold text-[#2b3d1f]">
              {user.firstName} {user.lastName}
            </h1>

            <p className="text-gray-600 mt-1 text-sm">
              {user.bio || "No bio added yet."}
            </p>

            {/* QUICK TAGS */}
            <div className="flex gap-2 mt-3 flex-wrap">
              <span className="px-3 py-1 bg-[#eef2ea] border rounded-full text-xs">
                Joined: {new Date(user.createdAt).toLocaleDateString()}
              </span>
              <span className="px-3 py-1 bg-[#eef2ea] border rounded-full text-xs">
                {user.skillsOffered.length} skills offered
              </span>
              <span className="px-3 py-1 bg-[#eef2ea] border rounded-full text-xs">
                {user.skillsWanted.length} skills wanted
              </span>
            </div>

            {/* Actions */}
            <div className="flex gap-3 mt-5">
              <button className="px-5 py-2 bg-[#4a5e27] text-white rounded-lg">
                Request Swap
              </button>

              <button className="px-5 py-2 border rounded-lg">
                Message
              </button>
            </div>
          </div>
        </div>

        {/* SKILLS OFFERED */}
        <div className="bg-white border border-[#d0d8cb] rounded-2xl shadow p-8">
          <h2 className="text-xl font-semibold text-[#2b3d1f] mb-4">
            Skills they can teach
          </h2>

          {user.skillsOffered.length === 0 && (
            <p className="text-gray-600 text-sm">No skills listed.</p>
          )}

          <div className="space-y-4">
            {user.skillsOffered.map((s: any) => (
              <div
                key={s.id}
                className="border rounded-xl p-4 hover:bg-[#f4f7f1] transition"
              >
                <div className="font-semibold text-lg">{s.name}</div>
                <div className="text-sm text-gray-600">{s.level}</div>
                <p className="mt-1 text-sm text-gray-700">{s.description}</p>

                <div className="flex gap-2 mt-2 text-xs flex-wrap">
                  {s.platform && (
                    <span className="px-2 py-1 bg-[#eef2ea] border rounded-full">
                      {s.platform}
                    </span>
                  )}
                  {s.sessionLength && (
                    <span className="px-2 py-1 bg-[#eef2ea] border rounded-full">
                      {s.sessionLength} mins
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* SKILLS THEY WANT TO LEARN */}
        <div className="bg-white border border-[#d0d8cb] rounded-2xl shadow p-8">
          <h2 className="text-xl font-semibold text-[#2b3d1f] mb-4">
            Skills they want to learn
          </h2>

          {user.skillsWanted.length === 0 && (
            <p className="text-gray-600 text-sm">No learning goals added.</p>
          )}

          <div className="space-y-4">
            {user.skillsWanted.map((s: any) => (
              <div
                key={s.id}
                className="border rounded-xl p-4 hover:bg-[#f4f7f1] transition"
              >
                <div className="font-semibold text-lg">{s.name}</div>
                <div className="text-sm text-gray-600">{s.learnLevel}</div>
                <p className="mt-1 text-sm text-gray-700">{s.learnGoal}</p>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
