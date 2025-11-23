"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import Link from "next/link";

export default function DashboardTopbar() {
  const [user, setUser] = useState<any>(null);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    async function loadUser() {
      const res = await fetch("/api/auth/me");
      const data = await res.json();
      setUser(data.user);
    }
    loadUser();
  }, []);

  const initials =
    user ? `${user.firstName[0]}${user.lastName[0]}` : "";

  const logout = async () => {
    await fetch("/api/auth/logout");
    window.location.href = "/login";
  };

  return (
    <header className="sticky top-0 z-40 bg-[#E9EDE1] border-b border-[#D8DCC9] h-14 flex items-center justify-between px-6">

      {/* LEFT LOGO */}
      <div className="flex items-center gap-2">
        <Image src="/LOGO.png" alt="SkillSwap Logo" width={36} height={36} />
        <span className="text-xl font-bold text-[#556B2F]">
          Skill<span className="text-[#4F6F52]">Swap</span>
        </span>
      </div>

      {/* RIGHT USER MENU */}
      {user && (
        <div className="relative">
          <button
            onClick={() => setOpen(!open)}
            className="flex items-center gap-2"
          >
            <div className="h-8 w-8 flex items-center justify-center rounded-full bg-[#556B2F] text-white text-sm font-bold">
              {initials}
            </div>

            <span className="text-sm font-medium text-gray-800">
              {user.firstName} {user.lastName}
            </span>

            <span className="text-xs">▼</span>
          </button>

          {open && (
            <div className="absolute right-0 mt-2 bg-white shadow-lg rounded-md w-40 py-2">
              <Link
                href="/profile"
                className="block px-4 py-2 hover:bg-gray-100"
              >
                Profile
              </Link>

              <button
                onClick={logout}
                className="w-full text-left px-4 py-2 text-red-600 hover:bg-gray-100"
              >
                Logout
              </button>
            </div>
          )}
        </div>
      )}
    </header>
  );
}
