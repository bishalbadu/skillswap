"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { FaHome, FaSearch, FaGift, FaComments, FaUser, FaCog } from "react-icons/fa";

export default function Sidebar() {
  const path = usePathname();

  const items = [
    { text: "Dashboard", href: "/dashboard", icon: <FaHome size={17} /> },
    { text: "Find Skills", href: "/dashboard/find-skills", icon: <FaSearch size={17} /> },
    { text: "Offer Skills", href: "/dashboard/offer-skills", icon: <FaGift size={17} /> },
    { text: "Messages", href: "/dashboard/messages", icon: <FaComments size={17} /> },
    { text: "Profile", href: "/dashboard/profile", icon: <FaUser size={17} /> },
    { text: "Settings", href: "/dashboard/settings", icon: <FaCog size={17} /> },
  ];

  return (
    <aside className="w-80 bg-[#7e9c6c] text-white p-5 space-y-2 min-h-screen shadow-xl">

      {items.map((item, i) => (
        <Link
          key={i}
          href={item.href}
          className={`flex items-center gap-3 px-4 py-2 rounded-md transition transform
            ${path === item.href ? "bg-white text-[#2c3a21]" : "bg-white/10 text-white"}
            hover:bg-white hover:text-[#2c3a21] hover:translate-x-1`}
        >
          {item.icon}
          <span>{item.text}</span>
        </Link>
      ))}

    </aside>
  );
}
