
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
FaCalendarAlt,
FaPaperPlane
} from "react-icons/fa";

import NotificationPanel from "@/components/NotificationPanel";

export default function Sidebar() {

const path = usePathname();

const [openNotif, setOpenNotif] = useState(false);
const [unreadCount, setUnreadCount] = useState(0);

//  NEW: chat unread count
const [chatUnread, setChatUnread] = useState(0);

/* ==========================
LOAD NOTIFICATION COUNT
========================== */

useEffect(() => {
(async () => {
const res = await fetch("/api/notifications", { credentials: "include" });
const data = await res.json();
setUnreadCount(data.unreadCount || 0);
})();
}, []);

/* ==========================
LOAD CHAT UNREAD COUNT
========================== */

useEffect(() => {
(async () => {

  const res = await fetch("/api/chat/conversations", {
    credentials: "include"
  });

  const data = await res.json();

  const totalUnread =
    (data.conversations || []).reduce(
      (sum: number, c: any) => sum + (c.unread || 0),
      0
    );

  setChatUnread(totalUnread);

})();


}, []);

const items = [


{ text: "Dashboard", href: "/dashboard", icon: <FaHome size={17} /> },

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

//  UPDATED CHAT ITEM WITH BADGE
{
  text: "Chat",
  href: "/dashboard/chat",
  icon: <FaPaperPlane size={17} />,
  badge: chatUnread
},

{ text: "Profile", href: "/dashboard/profile", icon: <FaUser size={17} /> },

{ text: "Settings", href: "/dashboard/settings", icon: <FaCog size={17} /> },


];

return (
<> <aside className="w-72 bg-[#7e9c6c] text-white p-5 space-y-2 min-h-screen shadow-xl transition-all duration-300">


    {items.map((item: any, i) => {

      //  Notification action button
      if (item.action) {

        return (
         <button
  key={i}
  onClick={item.action}
  className="group flex items-center justify-between w-full px-4 py-2 rounded-md
  bg-white/10 hover:bg-white hover:text-[#2c3a21]
  transition-all duration-300 transform hover:scale-[1.02] hover:translate-x-1"
>
  <div className="flex items-center gap-3">

    <span className="transition-transform duration-300 group-hover:scale-110">
      {item.icon}
    </span>

    <span className="group-hover:font-semibold transition-all">
      {item.text}
    </span>
  </div>

  {item.badge > 0 && (
  <span className="bg-red-500 text-xs px-2 py-1 rounded-full animate-pulse">
    {item.badge > 9 ? "9+" : item.badge}
  </span>
)}
</button>
        );
      }


      //  Normal links
      return (
        <Link
  key={i}
  href={item.href}
  className={`group flex items-center justify-between px-4 py-2 rounded-md transition-all duration-300
    transform
    ${
      path === item.href
        ? "bg-white text-[#2c3a21] scale-[1.03] shadow-md"
        : "bg-white/10 hover:bg-white hover:text-[#2c3a21] hover:scale-[1.02] hover:translate-x-1"
    }`}
>
  <div className="flex items-center gap-3">

    <span className="transition-transform duration-300 group-hover:scale-110">
      {item.icon}
    </span>

    <span className="transition-all duration-300 group-hover:font-semibold">
      {item.text}
    </span>
  </div>

  {item.badge > 0 && (
    <span className="bg-red-500 text-xs px-2 py-1 rounded-full animate-pulse">
      {item.badge}
    </span>
  )}
</Link>
      );

    })}

  </aside>

  <NotificationPanel
    open={openNotif}
    onClose={() => setOpenNotif(false)}
    setUnreadCount={setUnreadCount}
  />

</>


);
}
