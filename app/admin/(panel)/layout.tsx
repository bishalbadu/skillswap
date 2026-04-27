// "use client";

// import Link from "next/link";
// import { usePathname } from "next/navigation";
// import { useState, useEffect } from "react"

// import {
//   FiHome,
//   FiUsers,
//   FiLayers,
//   FiRepeat,
//   FiBarChart2,
//   FiTrendingUp
 
// } from "react-icons/fi";


// export default function AdminLayout({
//   children,
// }: {
//   children: React.ReactNode;
// }) {
//   return (
//     <div className="flex min-h-screen bg-[#f6f7f3]">
//       {/* SIDEBAR */}
//       <aside className="w-64 bg-[#7e9c6c] text-white flex flex-col shadow-xl">
        
//         {/* BRAND */}
//         <div className="p-6 border-b border-white/10">
//           <h2 className="text-2xl font-bold tracking-wide">
//             SkillSwap
//           </h2>
//           <p className="text-xs text-white/70 mt-1">
//             Admin Panel
//           </p>
//         </div>

//         {/* NAV */}
//         <nav className="flex-1 px-3 py-6 space-y-2">
//           <SidebarLink
//             href="/admin/dashboard"
//             label="Dashboard"
//             icon={<FiHome />}
//           />
//           <SidebarLink
//             href="/admin/users"
//             label="Users"
//             icon={<FiUsers />}
//           />
//           <SidebarLink
//             href="/admin/skills"
//             label="Skills"
//             icon={<FiLayers />}
//           />
//           <SidebarLink
//             href="/admin/swaps"
//             label="Swaps"
//             icon={<FiRepeat />}
//           />
          
//     <SidebarLink
//   href="/admin/earnings"
//   label="Earnings"
//   icon={<FiTrendingUp />}
// />

//           <SidebarLink
//             href="/admin/reports"
//             label="Reports"
//             icon={<FiBarChart2 />}
//           />
//         </nav>

//         {/* FOOTER */}
//         <div className="p-4 border-t border-white/10 text-xs text-white/70">
//           Logged in as admin <br />
//           All actions are monitored
//         </div>
//       </aside>

//       {/* MAIN CONTENT */}
//       <main className="flex-1 p-10">
//         {children}
//       </main>
//     </div>
//   );
// }

// /* ===================== SIDEBAR LINK ===================== */

// function SidebarLink({
//   href,
//   label,
//   icon,
//   badge,
// }: {
//   href: string;
//   label: string;
//   icon: React.ReactNode;
//   badge?: number;
// }) {
//   const pathname = usePathname();
//   const isActive = pathname === href;
//   const [openNotif, setOpenNotif] = useState(false);
// const [unreadCount, setUnreadCount] = useState(0);

// useEffect(() => {
//   (async () => {
//     const res = await fetch("/api/notifications", {
//       credentials: "include",
//     });
//     const data = await res.json();
//     setUnreadCount(data.unreadCount || 0);
//   })();
// }, []);

//   return (
//     <Link
//       href={href}
//       className={`flex items-center justify-between gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200
//         ${
//           isActive
//             ? "bg-white text-[#3f5120] shadow-md"
//             : "bg-white/10 hover:bg-white/20 text-white"
//         }
//         hover:scale-[1.03]
//       `}
//     >
//       {/* LEFT */}
//       <div className="flex items-center gap-3">
//         <span className="text-lg">{icon}</span>
//         <span>{label}</span>
//       </div>

//       {/* BADGE */}
//       {badge && (
//         <span className="bg-[#d36d5c] text-white text-xs px-2 py-0.5 rounded-full">
//           {badge}
//         </span>
//       )}
//     </Link>
//   );
// }

"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";

import {
  FiHome,
  FiUsers,
  FiLayers,
  FiRepeat,
  FiBarChart2,
  FiTrendingUp,
  FiBell,
} from "react-icons/fi";

import AdminNotificationPanel from "@/components/AdminNotificationPanel";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [openNotif, setOpenNotif] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const pathname = usePathname();

  /* ================= LOAD ADMIN NOTIFICATIONS ================= */
  useEffect(() => {
    (async () => {
      const res = await fetch("/api/admin/notifications", {
        credentials: "include",
      });
      const data = await res.json();
      setUnreadCount(data.unreadCount || 0);
    })();
  }, []);

  return (
    <div className="flex min-h-screen bg-[#f6f7f3]">
      {/* SIDEBAR */}
      <aside className="w-64 bg-[#7e9c6c] text-white flex flex-col shadow-xl">
        
        {/* BRAND */}
        <div className="p-6 border-b border-white/10">
          <h2 className="text-2xl font-bold tracking-wide">
            SkillSwap
          </h2>
          <p className="text-xs text-white/70 mt-1">
            Admin Panel
          </p>
        </div>

        {/* NAV */}
        <nav className="flex-1 px-3 py-6 space-y-2">

          <SidebarLink
            href="/admin/dashboard"
            label="Dashboard"
            icon={<FiHome />}
          />

          {/* NOTIFICATION ITEM (NOW SAME SIZE & STYLE) */}
          <button
  onClick={() => setOpenNotif(true)}
  className={`w-full flex items-center justify-between px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200
    ${
      pathname === "/admin/notifications"
        ? "bg-white text-[#3f5120] shadow-md"
        : "bg-white/20 hover:bg-white/30 text-white"
    }
    hover:scale-[1.03]
  `}
>
  <div className="flex items-center gap-3">
    <span className="text-lg">
      <FiBell />
    </span>
    <span>Notifications</span>
  </div>

  {unreadCount > 0 && (
    <span className="bg-red-500 text-xs px-2 py-0.5 rounded-full">
      {unreadCount > 9 ? "9+" : unreadCount}
    </span>
  )}
</button>

          <SidebarLink
            href="/admin/users"
            label="Users"
            icon={<FiUsers />}
          />
          <SidebarLink
            href="/admin/skills"
            label="Skills"
            icon={<FiLayers />}
          />
          <SidebarLink
            href="/admin/swaps"
            label="Swaps"
            icon={<FiRepeat />}
          />
          <SidebarLink
            href="/admin/earnings"
            label="Earnings"
            icon={<FiTrendingUp />}
          />
          <SidebarLink
            href="/admin/reports"
            label="Reports"
            icon={<FiBarChart2 />}
          />
        </nav>

        {/* FOOTER */}
        <div className="p-4 border-t border-white/10 text-xs text-white/70">
          Logged in as admin <br />
          All actions are monitored
        </div>
      </aside>

      {/* MAIN CONTENT */}
      <main className="flex-1 p-10">{children}</main>

      {/* NOTIFICATION PANEL */}
      <AdminNotificationPanel
  open={openNotif}
  onClose={() => setOpenNotif(false)}
  setUnreadCount={setUnreadCount}
/>
    </div>
  );
}

/* ===================== SIDEBAR LINK ===================== */

function SidebarLink({
  href,
  label,
  icon,
}: {
  href: string;
  label: string;
  icon: React.ReactNode;
}) {
  const pathname = usePathname();
  const isActive = pathname === href;

  return (
    <Link
      href={href}
      className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200
        ${
          isActive
            ? "bg-white text-[#3f5120] shadow-md"
            : "bg-white/10 hover:bg-white/20 text-white"
        }
        hover:scale-[1.03]
      `}
    >
      <span className="text-lg">{icon}</span>
      <span>{label}</span>
    </Link>
  );
}