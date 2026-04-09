
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";

export default function DashboardTopbar() {
const [user, setUser] = useState<any>(null);
const [open, setOpen] = useState(false);

async function fetchUser() {
const res = await fetch("/api/auth/me", {
credentials: "include",
cache: "no-store",
});
const data = await res.json();
setUser(data.user);
}

useEffect(() => {
fetchUser();


const handler = () => fetchUser();
window.addEventListener("profile-updated", handler);
return () => window.removeEventListener("profile-updated", handler);


}, []);

const handleLogout = async () => {
await fetch("/api/auth/logout", { credentials: "include" });
window.location.href = "/login";
};

return ( <div className="bg-[#E9EDE1] h-16 px-6 flex justify-between items-center shadow-sm border-b border-[#D8DCC9] sticky top-0 z-50">


  {/*  LEFT — LOGO (THIS WAS MISSING) */}
  <div className="flex items-center space-x-2">
    <Image
      src="/logo.png"
      alt="SkillSwap Logo"
      width={40}
      height={40}
    />
    <Link
  href="/"
  className="text-2xl font-extrabold tracking-tight text-[#556B2F]"
>
  Skill<span className="text-[#4F6F52]">Swap</span>
</Link>

  </div>

  {/*  RIGHT — USER */}
  {user && (
    <div className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-2 text-[#556B2F] hover:opacity-90"
      >
        {/* Avatar */}
        {user.avatar ? (
          <img
            src={`${user.avatar}?t=${Date.now()}`}
            className="w-9 h-9 rounded-full object-cover border border-[#556B2F]"
          />
        ) : (
          <div className="w-9 h-9 rounded-full bg-[#556B2F] text-white flex items-center justify-center font-bold">
            {user.firstName?.[0]}
            {user.lastName?.[0]}
          </div>
        )}

        <span className="font-medium">
          {user.firstName} {user.lastName}
        </span>

        <span className="text-sm">▼</span>
      </button>

      {open && (
        <div className="absolute right-0 mt-2 w-44 bg-white border rounded-md shadow">
          <Link
            href="/dashboard/profile"
            className="block px-4 py-2 hover:bg-gray-100"
          >
            Profile
          </Link>

          <button
            onClick={handleLogout}
            className="w-full text-left px-4 py-2 text-red-600 hover:bg-gray-100"
          >
            Logout
          </button>
        </div>
      )}
    </div>
  )}
</div>


);
}
