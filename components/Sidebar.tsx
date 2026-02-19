// "use client";

// import Link from "next/link";
// import { usePathname } from "next/navigation";
// import { FaHome, FaSearch, FaGift, FaComments, FaUser, FaCog } from "react-icons/fa";

// export default function Sidebar() {
//   const path = usePathname();

//   const items = [
//     { text: "Dashboard", href: "/dashboard", icon: <FaHome size={17} /> },
//     { text: "Find Skills", href: "/dashboard/find-skills", icon: <FaSearch size={17} /> },
//     { text: "Offer Skills", href: "/dashboard/offer-skills", icon: <FaGift size={17} /> },
//     { text: "Request Messages", href: "/dashboard/messages", icon: <FaComments size={17} /> },
//     { text: "Profile", href: "/dashboard/profile", icon: <FaUser size={17} /> },
//     { text: "Settings", href: "/dashboard/settings", icon: <FaCog size={17} /> },
    
//   ];

//   return (
//     <aside className="w-80 bg-[#7e9c6c] text-white p-5 space-y-2 min-h-screen shadow-xl">

//       {items.map((item, i) => (
//         <Link
//           key={i}
//           href={item.href}
//           className={`flex items-center gap-3 px-4 py-2 rounded-md transition transform
//             ${path === item.href ? "bg-white text-[#2c3a21]" : "bg-white/10 text-white"}
//             hover:bg-white hover:text-[#2c3a21] hover:translate-x-1`}
//         >
//           {item.icon}
//           <span>{item.text}</span>
//         </Link>
//       ))}

//     </aside>
//   );
// }


"use client";

import { useState, useEffect } from "react"
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  FaHome,
  FaSearch,
  FaGift,
  FaComments,
  FaUser,
  FaCog,
  FaBell,
  FaCalendarAlt 
} from "react-icons/fa";

import NotificationPanel from "@/components/NotificationPanel";


export default function Sidebar() {
  const path = usePathname();

  const [openNotif, setOpenNotif] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);

useEffect(() => {
  (async () => {
    const res = await fetch("/api/notifications", { credentials: "include" });
    const data = await res.json();
    setUnreadCount(data.unreadCount || 0);
  })();
}, []);

  const items = [
    { text: "Dashboard", href: "/dashboard", icon: <FaHome size={17} /> },

    // ⭐ NOTIFICATION BUTTON
    {
      text: "Notification",
      action: () => setOpenNotif(true),
      icon: <FaBell size={17} />,
      badge: unreadCount
    },

    { text: "Find Skills", href: "/dashboard/find-skills", icon: <FaSearch size={17} /> },
    { text: "Offer Skills", href: "/dashboard/offer-skills", icon: <FaGift size={17} /> },
    { text: "Request Messages", href: "/dashboard/messages", icon: <FaComments size={17} /> },
     { text: "Skill Meet", href: "/dashboard/skillmeet", icon: <FaCalendarAlt size={17} /> },
    { text: "Profile", href: "/dashboard/profile", icon: <FaUser size={17} /> },
    { text: "Settings", href: "/dashboard/settings", icon: <FaCog size={17} /> },

  ];

  return (
    <>
      <aside className="w-72 bg-[#7e9c6c] text-white p-5 space-y-2 min-h-screen shadow-xl">

        {items.map((item: any, i) => {
          // ⭐ Action button (notification)
          if (item.action) {
            return (
              <button
                key={i}
                onClick={item.action}
                className="flex items-center justify-between w-full px-4 py-2 rounded-md bg-white/10 hover:bg-white hover:text-[#2c3a21]"
              >
                <div className="flex items-center gap-3">
                  {item.icon}
                  {item.text}
                </div>

                {item.badge > 0 && (
                  <span className="bg-red-500 text-xs px-2 py-1 rounded-full">
                    {item.badge}
                  </span>
                )}
              </button>
            );
          }

          // normal links
          return (
            <Link
              key={i}
              href={item.href}
              className={`flex items-center gap-3 px-4 py-2 rounded-md transition
                ${path === item.href ? "bg-white text-[#2c3a21]" : "bg-white/10"}`}
            >
              {item.icon}
              {item.text}
            </Link>
          );
        })}
      </aside>

      {/* ⭐ slide panel */}
      <NotificationPanel
        open={openNotif}
        onClose={() => setOpenNotif(false)}
        setUnreadCount={setUnreadCount}
      />
    </>
  );
}
