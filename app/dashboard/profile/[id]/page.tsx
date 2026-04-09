// // any can sent request even if not in want list

// "use client";

// import { useEffect, useState } from "react";
// import { useParams } from "next/navigation";
// import RequestSwapModal from "../../find-skills/RequestSwapModal";

// /*  Star Rating */
// function StarRating({ rating }: { rating: number }) {
//   return (
//     <div className="text-yellow-500 text-sm">
//       {"★".repeat(Math.floor(rating))}
//       {"☆".repeat(5 - Math.floor(rating))}
//     </div>
//   );
// }

// export default function PublicProfilePage() {
//   const { id } = useParams();

//   const [loading, setLoading] = useState(true);
//   const [profile, setProfile] = useState<any>(null);

//   /* modal */
//   const [open, setOpen] = useState(false);
//   const [selectedSkill, setSelectedSkill] = useState<any>(null);
//   const [selectedSlot, setSelectedSlot] = useState<any>(null);

//   useEffect(() => {
//     loadProfile();
//   }, []);

//   async function loadProfile() {
//     const res = await fetch(`/api/profile/public/${id}`);
//     const data = await res.json();
//     setProfile(data);
//     setLoading(false);
//   }

//   if (loading) return <div className="p-10">Loading profile...</div>;
//   if (!profile?.user) return <div className="p-10">User not found.</div>;

//   const { user, skillsOffered } = profile;

//   return (
//     <div className="max-w-5xl mx-auto p-10 space-y-8">

//       {/* PROFILE HEADER */}
//       <div className="bg-white border rounded-2xl p-6 flex gap-6">
//         {user.avatar ? (
//           <img
//             src={user.avatar}
//             className="w-24 h-24 rounded-full object-cover border"
//           />
//         ) : (
//           <div className="w-24 h-24 rounded-full bg-[#4a5e27] text-white flex items-center justify-center text-3xl font-bold">
//             {user.firstName[0]}
//             {user.lastName[0]}
//           </div>
//         )}

//         <div>
//           <h1 className="text-2xl font-bold">
//             {user.firstName} {user.lastName}
//           </h1>

//           <div className="flex items-center gap-2 mt-1">
//             <StarRating rating={user.rating} />
//             <span className="text-sm text-gray-600">
//               {user.rating} ({user.reviewsCount} reviews)
//             </span>
//           </div>

//           <p className="text-gray-700 mt-3 max-w-xl">
//             {user.bio || "No bio provided."}
//           </p>
//         </div>
//       </div>

//       {/* SKILLS OFFERED */}
//       <div>
//         <h2 className="text-xl font-semibold mb-4">Skills Offered</h2>

//         <div className="grid grid-cols-2 gap-5">
//           {skillsOffered.map((skill: any) => (
//             <div key={skill.id} className="bg-white border rounded-xl p-5">

//               <div className="text-lg font-bold">{skill.name}</div>
//               <p className="text-sm text-gray-600">{skill.description}</p>

//               <div className="text-sm mt-3 space-y-1 text-gray-700">
//                 <div>Level: {skill.level}</div>
//                 <div>Platform: {skill.platform}</div>
//                 <div>Session: {skill.sessionLength} mins</div>
//               </div>

//               {/*  AVAILABILITY WITH DATE */}
//               <div className="mt-4 space-y-2">
//                 <p className="text-sm font-medium">Available slots:</p>

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
//                       {new Date(slot.date).toLocaleDateString()} {" "}
//                       {slot.timeFrom}-{slot.timeTo}
//                     </button>
//                   ))}
//                 </div>
//               </div>

//               {/*  REQUEST SWAP BUTTON RESTORED */}
//               <button
//                 onClick={() => {
//                   setSelectedSkill(skill);
//                   setSelectedSlot(skill.slots[0]);
//                   setOpen(true);
//                 }}
//                 className="mt-4 w-full bg-[#4a5e27] text-white rounded py-2"
//               >
//                 Request Swap
//               </button>
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
//   user={user}   //  ADD THIS
//   onClose={() => setOpen(false)}
// />

//       )}
//     </div>
//   );
// }



"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import RequestSwapModal from "../../find-skills/RequestSwapModal";
import ReportUserModal from "@/components/ReportUserModal";
import PremiumModal from "@/components/PremiumModal";



/*  Star Rating */
function StarRating({ rating }: { rating: number }) {
  return (
    <div className="text-yellow-500 text-sm">
      {"★".repeat(Math.floor(rating))}
      {"☆".repeat(5 - Math.floor(rating))}
    </div>
  );
}

export default function PublicProfilePage() {
const params = useParams<{ id: string }>();
const id = params?.id;

  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState<any>(null);

  const [open, setOpen] = useState(false);
  const [selectedSkill, setSelectedSkill] = useState<any>(null);
  const [selectedSlot, setSelectedSlot] = useState<any>(null);

  const [errors, setErrors] = useState<Record<number, string>>({});
  
  const [optimisticRequested, setOptimisticRequested] = useState<Record<number, boolean>>({});

  const [reportOpen, setReportOpen] = useState(false);
  const [premiumOpen, setPremiumOpen] = useState(false);

  const FREE_LIMIT = 1;
const [completedSwaps, setCompletedSwaps] = useState(0);
const [premiumUntil, setPremiumUntil] = useState<string | null>(null);


 useEffect(() => {
  loadProfile();
  loadMyPlanStatus(); //  IMPORTANT
}, []);

  async function loadProfile() {
    const res = await fetch(`/api/profile/public/${id}`, {
      credentials: "include",
    });
    const data = await res.json();
    setProfile(data);
    setLoading(false);
  }
async function loadMyPlanStatus() {
  try {
    const res = await fetch("/api/users/me", {
      credentials: "include",
    });

    const data = await res.json();

    console.log("PLAN DATA:", data); // 

    if (data.user) {
      setCompletedSwaps(data.user.completedSwaps || 0);
      setPremiumUntil(data.user.premiumUntil || null);
    }
  } catch (err) {
    console.log("PLAN ERROR", err);
  }
}

  if (loading) return <div className="p-10">Loading profile...</div>;
  if (!profile?.user) return <div className="p-10">User not found.</div>;

  const { user, skillsOffered } = profile;
  const isPremiumActive =
  premiumUntil && new Date(premiumUntil).getTime() > Date.now();

  return (
    <div className="max-w-5xl mx-auto p-10 space-y-8">

      {/* ================= PROFILE HEADER ================= */}
      <div className="bg-white border rounded-2xl p-6 flex justify-between items-start">

      <div className="flex gap-6">
  {user.avatar ? (
    <img
      src={user.avatar}
      className="w-24 h-24 rounded-full object-cover border"
    />
  ) : (
    <div className="w-24 h-24 rounded-full bg-[#4a5e27] text-white flex items-center justify-center text-3xl font-bold">
      {user.firstName[0]}
      {user.lastName[0]}
    </div>
  )}

  <div>
    <div className="flex items-center gap-3">
  <h1 className="text-2xl font-bold">
    {user.firstName} {user.lastName}
  </h1>

  {user.membership === "PREMIUM" && (
    <span className="bg-yellow-500 text-white text-xs px-2 py-1 rounded">
       PREMIUM
    </span>
  )}
</div>


    <div className="flex items-center gap-2 mt-1">
      <StarRating rating={user.rating} />
      <span className="text-sm text-gray-600">
        {user.rating} ({user.reviewsCount} reviews)
      </span>
    </div>

    <p className="text-gray-700 mt-3 max-w-xl">
      {user.bio || "No bio provided."}
    </p>
  </div>
</div>

 {/* RIGHT: Report button */}
  <button
    onClick={() => setReportOpen(true)}
    className="text-sm border border-red-500 text-red-600 px-3 py-1 rounded hover:bg-red-50"
  >
     Report User
  </button>
</div>


      {/* ================= SKILLS OFFERED ================= */}
      <div>
        <h2 className="text-xl font-semibold mb-4">Skills Offered</h2>

        <div className="grid grid-cols-2 gap-5">
          {skillsOffered.map((skill: any) => {

             const isRequestedForSlot = (slotId: number) =>
  optimisticRequested[slotId] || false;

  const canShowButton =
  skill.canRequest && skill.slots.length > 0;


            return (
              <div key={skill.id} className="bg-white border rounded-xl p-5">

                {/* ===== Skill Info ===== */}
                <div className="text-lg font-bold">{skill.name}</div>
                <p className="text-sm text-gray-600">{skill.description}</p>

                <div className="text-sm mt-3 space-y-1 text-gray-700">
                  <div>Level: {skill.level}</div>
                  <div>Session: {skill.sessionLength} mins</div>
                </div>

                {/* ================= SLOTS ================= */}
                <div className="mt-4 space-y-2">
                  <p className="text-sm font-medium">Available slots:</p>

                 {skill.slots.length === 0 && (
  <span className="text-xs text-gray-400">
    No upcoming slots
  </span>
)}

                  <div className="flex flex-wrap gap-2">
{skill.slots
  .filter((slot: any) => {
  const now = new Date();

  const d = new Date(slot.date);
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");

  const slotStart = new Date(
    `${year}-${month}-${day}T${slot.timeFrom}:00`
  );

  return slotStart > now;
})


  .map((slot: any) => {
  const isRequested = isRequestedForSlot(slot.id);

  return isRequested ? (
    <span
      key={slot.id}
      className="px-3 py-1 text-xs rounded-full bg-yellow-100 text-yellow-800 font-medium"
    >
      ✓ Request Sent
    </span>
  ) : (
    <button
      key={slot.id}
      onClick={() => {
        setSelectedSkill(skill);
        setSelectedSlot(slot);
        setErrors((prev) => ({
          ...prev,
          [skill.id]: "",
        }));
      }}
      className={`px-3 py-1 text-xs rounded-full border transition ${
        selectedSlot?.id === slot.id &&
        selectedSkill?.id === skill.id
          ? "bg-[#4a5e27] text-white"
          : "bg-[#eef2ea] hover:bg-[#4a5e27] hover:text-white"
      }`}
    >
      {new Date(slot.date).toLocaleDateString()}{" "}
      {slot.timeFrom}-{slot.timeTo}
    </button>
  );
})}

                  </div>
                </div>
{/* ================= REQUEST BUTTON ================= */}
{canShowButton && (
  <>
    <button
      onClick={() => {
        if (!selectedSlot || selectedSkill?.id !== skill.id) {
          setErrors((prev) => ({
            ...prev,
            [skill.id]: "Please choose a slot first",
          }));
          return;
        }

       if (completedSwaps >= FREE_LIMIT && !isPremiumActive) {
  setPremiumOpen(true);
  return;
}

setOpen(true);
      }}
      className="mt-3 w-full bg-[#4a5e27] text-white rounded py-2"
    >
      Request Swap
    </button>

    {errors[skill.id] && (
      <p className="text-red-500 text-xs mt-2 text-center">
        {errors[skill.id]}
      </p>
    )}
  </>
)}

{/* ================= REQUEST SENT ================= */}
{skill.slots.some((slot: any) => slot.alreadyRequested) && (
  <div className="mt-3 text-center text-sm bg-yellow-100 text-yellow-800 rounded py-2">
    ✓ Request Sent
  </div>
)}

              </div>
            );
          })}
        </div>
      </div>

      {/* ================= MODAL ================= */}
{selectedSkill && selectedSlot && (
  <RequestSwapModal
    open={open}
    skill={selectedSkill}
    slot={selectedSlot}
    user={user}
    onClose={() => setOpen(false)}
    onSuccess={() => {
      setOptimisticRequested((prev) => ({
        ...prev,
        [selectedSlot.id]: true,
      }));
    }}
    onPremiumRequired={() => {
      setOpen(false);       // close request modal
      setPremiumOpen(true); // open premium modal
    }}
  />
)}

{/* ================= PREMIUM MODAL ================= */}
<PremiumModal
  open={premiumOpen}
  onClose={() => setPremiumOpen(false)}
/>
{/* ================= REPORT USER MODAL ================= */}
<ReportUserModal
  open={reportOpen}
  reportedUserId={user.id}
  onClose={() => setReportOpen(false)}
/>


    </div>
  );
}

