
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";

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

const handler = () => fetchUser();
window.addEventListener("profile-updated", handler);

return () => window.removeEventListener("profile-updated", handler);


}, []);

const handleLogout = async () => {
await fetch("/api/auth/logout", { credentials: "include" });
window.location.href = "/login";
};

return ( <nav className="bg-[#E9EDE1] shadow-sm py-4 px-8 flex justify-between items-center border-b border-[#D8DCC9] sticky top-0 z-50">


  {/* LEFT — LOGO */}
  <div className="flex items-center space-x-2 hover:scale-105 transition">
    <Image
      src="/logo.png"   
      alt="SkillSwap Logo"
      width={42}
      height={42}
      priority
    />
    <Link
      href="/"
      className="text-2xl font-bold text-[#556B2F]"
    >
      Skill<span className="text-[#4F6F52]">Swap</span>
    </Link>
  </div>

  {/* RIGHT SIDE */}
  {user ? (
    <div className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-2 px-4 py-2 rounded-md bg-white border shadow-sm hover:bg-gray-50 transition"
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

        <span className="text-[#556B2F] text-sm">▼</span>
      </button>

      {/* DROPDOWN */}
      {open && (
        <div className="absolute right-0 mt-2 bg-white shadow-lg w-44 rounded-md border overflow-hidden">
          <Link
            href="/dashboard/profile"
            className="block px-4 py-2 hover:bg-gray-100 transition"
          >
            Profile
          </Link>

          <button
            onClick={handleLogout}
            className="w-full text-left px-4 py-2 hover:bg-gray-100 text-red-600 transition"
          >
            Logout
          </button>
        </div>
      )}
    </div>
  ) : (
    <div className="flex gap-4">
      <Link
        href="/login"
        className="border border-[#556B2F] text-[#556B2F] px-4 py-2 rounded-md hover:bg-[#556B2F] hover:text-white transition"
      >
        Login
      </Link>

      <Link
        href="/register"
        className="bg-[#B8860B] text-white px-4 py-2 rounded-md hover:bg-[#a0750b] transition"
      >
        Register
      </Link>
    </div>
  )}
</nav>


);
}
