// "use client";

// import { useEffect, useState } from "react";
// import { useRouter } from "next/navigation";
// import PremiumModal from "@/components/PremiumModal";

// export default function Dashboard() {

//   const FREE_LIMIT = 5;

//   const router = useRouter();

//   const [activeSwaps, setActiveSwaps] = useState(0);
//   const [pendingRequests, setPendingRequests] = useState(0);
//   const [recentActivity, setRecentActivity] = useState<string[]>([]);

//   const [completedSwaps, setCompletedSwaps] = useState(0);
//   const [premiumUntil, setPremiumUntil] = useState<string | null>(null);

//   const [loadingPremium, setLoadingPremium] = useState(true);
//   const [premiumOpen, setPremiumOpen] = useState(false);
//   const [premiumToast, setPremiumToast] = useState(false);

//   /* ================= LOAD DATA ================= */

//   useEffect(() => {
//     loadPremiumStatus();
//     loadSwaps();
//     loadNotifications();
//   }, []);

//   useEffect(() => {
//     const params = new URLSearchParams(window.location.search);
//     const premium = params.get("premium");

//     if (premium === "success") {
//       async function refresh() {
//         await loadPremiumStatus();
//         setPremiumToast(true);
//         window.history.replaceState({}, "", "/dashboard");
//       }
//       refresh();
//     }
//   }, []);

//   async function loadPremiumStatus() {
//     try {
//       const res = await fetch("/api/users/me", {
//         credentials: "include",
//       });

//       const data = await res.json();

//       if (data.user) {
//         setCompletedSwaps(data.user.completedSwaps || 0);
//         setPremiumUntil(data.user.premiumUntil || null);
//       }

//     } catch {
//       setCompletedSwaps(0);
//       setPremiumUntil(null);
//     } finally {
//       setLoadingPremium(false);
//     }
//   }

//   async function loadSwaps() {
//     try {
//       const res = await fetch("/api/swap-request/inbox", {
//         credentials: "include",
//       });

//       const data = await res.json();

//       const accepted =
//         data.requests?.filter((r: any) => r.status === "ACCEPTED").length || 0;

//       const pending =
//         data.requests?.filter((r: any) => r.status === "PENDING").length || 0;

//       setActiveSwaps(accepted);
//       setPendingRequests(pending);

//     } catch {
//       setActiveSwaps(0);
//       setPendingRequests(0);
//     }
//   }

//   async function loadNotifications() {
//     try {
//       const res = await fetch("/api/notifications", {
//         credentials: "include",
//       });

//       const data = await res.json();

//       const recent = data.notifications
//         ?.slice(0, 4)
//         .map((n: any) => n.message);

//       setRecentActivity(recent || []);

//     } catch {
//       setRecentActivity([]);
//     }
//   }

//   /* ================= PREMIUM LOGIC ================= */

//   const isPremiumActive =
//     premiumUntil && new Date(premiumUntil).getTime() > Date.now();

//   const isPremiumExpired =
//     premiumUntil && new Date(premiumUntil).getTime() <= Date.now();

//   const progressPercent = Math.min(
//     (completedSwaps / FREE_LIMIT) * 100,
//     100
//   );

//   return (
//     <div className="min-h-screen bg-[#f6f7f2]">
//       <div className="p-10">

//         <h1 className="text-3xl font-bold text-[#2c3a21] mb-8">
//           Welcome 
//         </h1>

//         {/* ================= PREMIUM SECTION ================= */}

//         <div className="bg-white p-6 rounded-2xl shadow-md border transition hover:shadow-lg">

//           {loadingPremium ? (

//             <p className="text-gray-500">Loading...</p>

//           ) : isPremiumActive ? (

//             <>
//               <h2 className="text-xl font-bold text-yellow-600">
//                  Premium Active
//               </h2>

//               <p className="text-gray-600 mt-2">
//                 Unlimited swaps until {new Date(premiumUntil!).toLocaleDateString()}
//               </p>

//               <div className="mt-4 bg-yellow-100 text-yellow-700 px-4 py-2 rounded-lg">
//                 You now have unlimited swaps 
//               </div>
//             </>

//           ) : isPremiumExpired ? (

//             <>
//               <h2 className="text-xl font-bold text-red-600">
//                  Premium Expired
//               </h2>

//               <p className="text-gray-600 mt-2">
//                 Your premium subscription has expired.
//               </p>

//               <button
//                 onClick={() => setPremiumOpen(true)}
//                 className="mt-4 px-6 py-2 bg-[#2c3a21] text-white rounded-lg"
//               >
//                 Renew Premium
//               </button>
//             </>

//           ) : (

//             <>
//               <h2 className="text-xl font-bold text-[#2c3a21]">
//                 Free Plan
//               </h2>

//               <p className="text-gray-600 mt-2">
//                 {completedSwaps} / {FREE_LIMIT} completed swaps used
//               </p>

//               <div className="w-full bg-gray-200 rounded-full h-3 mt-4 overflow-hidden">
//                 <div
//                   className="bg-[#2c3a21] h-3 rounded-full transition-all duration-700"
//                   style={{ width: `${progressPercent}%` }}
//                 />
//               </div>

//               {completedSwaps >= FREE_LIMIT && (
//                 <div className="mt-6">
//                   <p className="text-red-600 font-semibold">
//                      You have reached your free swap limit.
//                   </p>

//                   <button
//                     onClick={() => setPremiumOpen(true)}
//                     className="mt-3 px-6 py-2 bg-[#2c3a21] text-white rounded-lg"
//                   >
//                     Upgrade to Premium
//                   </button>
//                 </div>
//               )}
//             </>

//           )}

//         </div>

//         {/* ================= DASHBOARD CARDS ================= */}

//         <div className="grid grid-cols-2 gap-6 my-10">

//           <DashboardCard
//             title="Your Active Swaps"
//             desc={`You have ${activeSwaps} active session${activeSwaps !== 1 ? "s" : ""}.`}
//             btn="View Swaps"
//             onClick={() => router.push("/dashboard/messages")}
//           />

//           <DashboardCard
//             title="Pending Requests"
//             desc={`${pendingRequests} new request${pendingRequests !== 1 ? "s" : ""}.`}
//             btn="Review"
//             onClick={() => router.push("/dashboard/messages")}
//           />

//           <DashboardCard
//             title="Discover New Skills"
//             desc="Explore skills offered by others."
//             btn="Browse"
//             onClick={() => router.push("/dashboard/find-skills")}
//           />

//           <DashboardCard
//             title="Offer Your Skills"
//             desc="Share expertise with the community."
//             btn="Add Skill"
//             onClick={() => router.push("/dashboard/offer-skills")}
//           />

//         </div>

//         {/* ================= RECENT ACTIVITY ================= */}

//         <h2 className="text-2xl font-bold text-[#2c3a21] mb-6">
//           Recent Activity
//         </h2>

//         <div className="space-y-4">

//           {recentActivity.length === 0 && (
//             <p className="text-gray-500">No recent activity.</p>
//           )}

//           {recentActivity.map((item, i) => (
//             <div
//               key={i}
//               className="flex justify-between items-center bg-white border p-4 rounded-xl shadow-sm"
//             >
//               <span>{item}</span>

//               <button
//                 onClick={() => router.push("/dashboard/messages")}
//                 className="px-4 py-1 bg-[#2c3a21] text-white rounded-lg"
//               >
//                 View
//               </button>

//             </div>
//           ))}

//         </div>

//       </div>

//       {/* ================= PREMIUM TOAST ================= */}

//       {premiumToast && (
//         <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
//           <div className="bg-white rounded-xl p-8 shadow-lg text-center space-y-3">

//             <h2 className="text-2xl font-bold text-green-600">
//                Premium Activated!
//             </h2>

//             <p className="text-gray-600">
//               You now have unlimited swaps.
//             </p>

//             <button
//               onClick={() => setPremiumToast(false)}
//               className="mt-3 px-6 py-2 bg-[#2c3a21] text-white rounded"
//             >
//               Continue
//             </button>

//           </div>
//         </div>
//       )}

//       <PremiumModal
//         open={premiumOpen}
//         onClose={() => setPremiumOpen(false)}
//       />

//     </div>
//   );
// }

// /* ================= CARD COMPONENT ================= */

// function DashboardCard({
//   title,
//   desc,
//   btn,
//   onClick,
// }: {
//   title: string;
//   desc: string;
//   btn: string;
//   onClick: () => void;
// }) {

//   return (
//     <div className="bg-[#d8b26e] p-6 rounded-2xl shadow-md hover:shadow-xl transition">

//       <h3 className="font-bold text-lg">{title}</h3>

//       <p className="text-sm opacity-90 mt-2">{desc}</p>

//       <button
//         onClick={onClick}
//         className="mt-4 bg-white px-5 py-2 rounded-lg shadow"
//       >
//         {btn}
//       </button>

//     </div>
//   );
// }


// deactiavte

"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import PremiumModal from "@/components/PremiumModal";

export default function Dashboard() {

  const FREE_LIMIT = 5;

  const router = useRouter();

  const [activeSwaps, setActiveSwaps] = useState(0);
  const [pendingRequests, setPendingRequests] = useState(0);
  const [recentActivity, setRecentActivity] = useState<string[]>([]);

  const [completedSwaps, setCompletedSwaps] = useState(0);
  const [premiumUntil, setPremiumUntil] = useState<string | null>(null);

  const [loadingPremium, setLoadingPremium] = useState(true);
  const [premiumOpen, setPremiumOpen] = useState(false);
  const [premiumToast, setPremiumToast] = useState(false);
  const [user, setUser] = useState<any>(null);

  /* ================= LOAD DATA ================= */

  useEffect(() => {
    loadPremiumStatus();
    loadSwaps();
    loadNotifications();
  }, []);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const premium = params.get("premium");

    if (premium === "success") {
      async function refresh() {
        await loadPremiumStatus();
        setPremiumToast(true);
        window.history.replaceState({}, "", "/dashboard");
      }
      refresh();
    }
  }, []);

async function loadPremiumStatus() {
  try {
    const res = await fetch("/api/auth/me", {
      credentials: "include",
    });

    const data = await res.json();

    if (data.user) {
      setUser(data.user); // ✅ ADD THIS
      setCompletedSwaps(data.user.completedSwaps || 0);
      setPremiumUntil(data.user.premiumUntil || null);
    }

  } catch {
    setCompletedSwaps(0);
    setPremiumUntil(null);
  } finally {
    setLoadingPremium(false);
  }
}


  async function loadSwaps() {
    try {
      const res = await fetch("/api/swap-request/inbox", {
        credentials: "include",
      });

      const data = await res.json();

      const accepted =
        data.requests?.filter((r: any) => r.status === "ACCEPTED").length || 0;

      const pending =
        data.requests?.filter((r: any) => r.status === "PENDING").length || 0;

      setActiveSwaps(accepted);
      setPendingRequests(pending);

    } catch {
      setActiveSwaps(0);
      setPendingRequests(0);
    }
  }

  async function loadNotifications() {
    try {
      const res = await fetch("/api/notifications", {
        credentials: "include",
      });

      const data = await res.json();

      const recent = data.notifications
        ?.slice(0, 4)
        .map((n: any) => n.message);

      setRecentActivity(recent || []);

    } catch {
      setRecentActivity([]);
    }
  }

  /* ================= PREMIUM LOGIC ================= */

  const isPremiumActive =
    premiumUntil && new Date(premiumUntil).getTime() > Date.now();

  const isPremiumExpired =
    premiumUntil && new Date(premiumUntil).getTime() <= Date.now();

  const progressPercent = Math.min(
    (completedSwaps / FREE_LIMIT) * 100,
    100
  );

  return (
    <div className="min-h-screen bg-[#f6f7f2]">
      <div className="p-10">

        <h1 className="text-3xl font-bold text-[#2c3a21] mb-8">
          Welcome 
        </h1>

{user && user.isActive === false && (
  <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-6 py-4 rounded-xl">
    <p className="font-semibold">
      Your account is currently deactivated.
    </p>
    <p className="text-sm mt-1">
      You cannot perform actions. Please go to Settings to reactivate your account.
    </p>

    <button
      onClick={() => router.push("/dashboard/settings")}
      className="mt-3 px-4 py-2 text-sm font-semibold bg-red-600 text-white rounded-lg hover:bg-red-700"
    >
      Go to Settings
    </button>
  </div>
)}

        {/* ================= PREMIUM SECTION ================= */}

        <div className="bg-white p-6 rounded-2xl shadow-md border transition hover:shadow-lg">

          {loadingPremium ? (

            <p className="text-gray-500">Loading...</p>

          ) : isPremiumActive ? (

            <>
              <h2 className="text-xl font-bold text-yellow-600">
                 Premium Active
              </h2>

              <p className="text-gray-600 mt-2">
                Unlimited swaps until {new Date(premiumUntil!).toLocaleDateString()}
              </p>

              <div className="mt-4 bg-yellow-100 text-yellow-700 px-4 py-2 rounded-lg">
                You now have unlimited swaps 
              </div>
            </>

          ) : isPremiumExpired ? (

            <>
              <h2 className="text-xl font-bold text-red-600">
                 Premium Expired
              </h2>

              <p className="text-gray-600 mt-2">
                Your premium subscription has expired.
              </p>

              <button
                onClick={() => setPremiumOpen(true)}
                className="mt-4 px-6 py-2 bg-[#2c3a21] text-white rounded-lg"
              >
                Renew Premium
              </button>
            </>

          ) : (

            <>
              <h2 className="text-xl font-bold text-[#2c3a21]">
                Free Plan
              </h2>

              <p className="text-gray-600 mt-2">
                {completedSwaps} / {FREE_LIMIT} completed swaps used
              </p>

              <div className="w-full bg-gray-200 rounded-full h-3 mt-4 overflow-hidden">
                <div
                  className="bg-[#2c3a21] h-3 rounded-full transition-all duration-700"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>

              {completedSwaps >= FREE_LIMIT && (
                <div className="mt-6">
                  <p className="text-red-600 font-semibold">
                     You have reached your free swap limit.
                  </p>

                  <button
                    onClick={() => setPremiumOpen(true)}
                    className="mt-3 px-6 py-2 bg-[#2c3a21] text-white rounded-lg"
                  >
                    Upgrade to Premium
                  </button>
                </div>
              )}
            </>

          )}

        </div>

        {/* ================= DASHBOARD CARDS ================= */}

        <div className="grid grid-cols-2 gap-6 my-10">

          <DashboardCard
            title="Your Active Swaps"
            desc={`You have ${activeSwaps} active session${activeSwaps !== 1 ? "s" : ""}.`}
            btn="View Swaps"
         onClick={() => {
    if (user && user.isActive === false) {
      alert("Your account is deactivated.");
      return;
    }
    router.push("/dashboard/messages");
  }}
          />

          <DashboardCard
            title="Pending Requests"
            desc={`${pendingRequests} new request${pendingRequests !== 1 ? "s" : ""}.`}
            btn="Review"
           onClick={() => {
    if (user && user.isActive === false) {
      alert("Your account is deactivated.");
      return;
    }
    router.push("/dashboard/messages");
  }}
          />

          <DashboardCard
            title="Discover New Skills"
            desc="Explore skills offered by others."
            btn="Browse"
            onClick={() => {
    if (user && user.isActive === false) {
      alert("Your account is deactivated.");
      return;
    }
    router.push("/dashboard/fild-skills");
  }}
          />

          <DashboardCard
            title="Offer Your Skills"
            desc="Share expertise with the community."
            btn="Add Skill"
            onClick={() => {
    if (user && user.isActive === false) {
      alert("Your account is deactivated.");
      return;
    }
    router.push("/dashboard/offer-skills");
  }}
          />

        </div>

        {/* ================= RECENT ACTIVITY ================= */}

        <h2 className="text-2xl font-bold text-[#2c3a21] mb-6">
          Recent Activity
        </h2>

        <div className="space-y-4">

          {recentActivity.length === 0 && (
            <p className="text-gray-500">No recent activity.</p>
          )}

          {recentActivity.map((item, i) => (
            <div
              key={i}
              className="flex justify-between items-center bg-white border p-4 rounded-xl shadow-sm"
            >
              <span>{item}</span>

              <button
  onClick={() => {
    if (user && user.isActive === false) {
      alert("Your account is deactivated.");
      return;
    }
    router.push("/dashboard/messages");
  }}
                className="px-4 py-1 bg-[#2c3a21] text-white rounded-lg"
              >
                View
              </button>

            </div>
          ))}

        </div>

      </div>

      {/* ================= PREMIUM TOAST ================= */}

      {premiumToast && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-8 shadow-lg text-center space-y-3">

            <h2 className="text-2xl font-bold text-green-600">
               Premium Activated!
            </h2>

            <p className="text-gray-600">
              You now have unlimited swaps.
            </p>

            <button
              onClick={() => setPremiumToast(false)}
              className="mt-3 px-6 py-2 bg-[#2c3a21] text-white rounded"
            >
              Continue
            </button>

          </div>
        </div>
      )}

      <PremiumModal
        open={premiumOpen}
        onClose={() => setPremiumOpen(false)}
      />

    </div>
  );
}

/* ================= CARD COMPONENT ================= */

function DashboardCard({
  title,
  desc,
  btn,
  onClick,
}: {
  title: string;
  desc: string;
  btn: string;
  onClick: () => void;
}) {

  return (
    <div className="bg-[#d8b26e] p-6 rounded-2xl shadow-md hover:shadow-xl transition">

      <h3 className="font-bold text-lg">{title}</h3>

      <p className="text-sm opacity-90 mt-2">{desc}</p>

      <button
        onClick={onClick}
        className="mt-4 bg-white px-5 py-2 rounded-lg shadow"
      >
        {btn}
      </button>

    </div>
  );
}