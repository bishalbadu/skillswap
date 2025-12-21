// "use client";
// import { useEffect, useState } from "react";
// import Link from "next/link";

// export default function AuthNavbar() {
//   const [user, setUser] = useState<any>(null);
//   const [open, setOpen] = useState(false);

//   // ⭐ Fetch user + watch profile updates
//   useEffect(() => {
//     async function fetchUser() {
//       const res = await fetch("/api/auth/me", { cache: "no-store" });
//       const data = await res.json();
//       setUser(data.user);
//     }

//     fetchUser();

//     // 🔥 Listen for profile updates from profile page
//     const handler = () => fetchUser();
//     window.addEventListener("profile-updated", handler);

//     return () => window.removeEventListener("profile-updated", handler);
//   }, []);

//   const handleLogout = async () => {
//     await fetch("/api/auth/logout");
//     window.location.href = "/login";
//   };

//   return (
//     <nav className="bg-[#E9EDE1] py-4 px-8 flex justify-between shadow-sm">
//       <h2 className="text-xl font-bold text-[#556B2F]">SkillSwap</h2>

//       {user ? (
//         <div className="relative">
//           {/* 🔽 BUTTON (Avatar + Name + Arrow) */}
//           <button
//             onClick={() => setOpen(!open)}
//             className="flex items-center gap-2 px-4 py-2 rounded-md bg-white border shadow-sm hover:bg-gray-50"
//           >
//             {/* Avatar OR Initials */}
//             {user.avatar ? (
//               <img
//                 src={user.avatar}
//                 className="w-8 h-8 rounded-full object-cover border"
//               />
//             ) : (
//               <div className="w-8 h-8 rounded-full bg-[#556B2F] text-white flex items-center justify-center font-bold">
//                 {user.firstName?.[0]}
//                 {user.lastName?.[0]}
//               </div>
//             )}

//             {/* Name */}
//             <span className="text-[#556B2F] font-medium">
//               {user.firstName} {user.lastName?.slice(0, 5)}
//             </span>

//             <span className="text-[#556B2F]">▼</span>
//           </button>

//           {/* 🔽 DROPDOWN MENU */}
//           {open && (
//             <div className="absolute right-0 mt-2 bg-white shadow-lg w-44 rounded-md border">
//               <Link
//                 href="/dashboard/profile"
//                 className="block px-4 py-2 hover:bg-gray-100"
//               >
//                 Profile
//               </Link>

//               <button
//                 onClick={handleLogout}
//                 className="w-full text-left px-4 py-2 hover:bg-gray-100 text-red-600"
//               >
//                 Logout
//               </button>
//             </div>
//           )}
//         </div>
//       ) : (
//         // If not logged in
//         <div className="flex gap-3">
//           <Link href="/login" className="text-[#556B2F]">
//             Login
//           </Link>
//           <Link href="/register" className="text-[#B8860B]">
//             Register
//           </Link>
//         </div>
//       )}
//     </nav>
//   );
// }


"use client";
import { useEffect, useState } from "react";
import Link from "next/link";

export default function AuthNavbar() {
  const [user, setUser] = useState<any>(null);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    async function fetchUser() {
      const res = await fetch("/api/auth/me", {
        credentials: "include",
        cache: "no-store",
      });
      const data = await res.json();
      setUser(data.user);
    }

    fetchUser();

    // 🔥 Listen for profile updates
    const handler = () => fetchUser();
    window.addEventListener("profile-updated", handler);

    return () => window.removeEventListener("profile-updated", handler);
  }, []);

  const handleLogout = async () => {
    await fetch("/api/auth/logout", { credentials: "include" });
    window.location.href = "/login";
  };

  return (
    <nav className="bg-[#E9EDE1] py-4 px-8 flex justify-between shadow-sm">
      <h2 className="text-xl font-bold text-[#556B2F]">SkillSwap</h2>

      {user ? (
        <div className="relative">
          <button
            onClick={() => setOpen(!open)}
            className="flex items-center gap-2 px-4 py-2 rounded-md bg-white border shadow-sm hover:bg-gray-50"
          >
            {/* Avatar OR Initials */}
            {user.avatar ? (
              <img
                src={`${user.avatar}?t=${Date.now()}`}
                className="w-8 h-8 rounded-full object-cover border"
              />
            ) : (
              <div className="w-8 h-8 rounded-full bg-[#556B2F] text-white flex items-center justify-center font-bold">
                {user.firstName?.[0]}
                {user.lastName?.[0]}
              </div>
            )}

            <span className="text-[#556B2F] font-medium">
              {user.firstName} {user.lastName?.slice(0, 5)}
            </span>

            <span className="text-[#556B2F]">▼</span>
          </button>

          {open && (
            <div className="absolute right-0 mt-2 bg-white shadow-lg w-44 rounded-md border">
              <Link
                href="/dashboard/profile"
                className="block px-4 py-2 hover:bg-gray-100"
              >
                Profile
              </Link>

              <button
                onClick={handleLogout}
                className="w-full text-left px-4 py-2 hover:bg-gray-100 text-red-600"
              >
                Logout
              </button>
            </div>
          )}
        </div>
      ) : (
        <div className="flex gap-3">
          <Link href="/login" className="text-[#556B2F]">
            Login
          </Link>
          <Link href="/register" className="text-[#B8860B]">
            Register
          </Link>
        </div>
      )}
    </nav>
  );
}
