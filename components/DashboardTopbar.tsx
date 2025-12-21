"use client";
import { useEffect, useState } from "react";
import Link from "next/link";

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

  return (
    <div className="bg-[#E9EDE1] h-14 px-6 flex justify-between items-center shadow-sm">
      <h2 className="text-lg font-bold text-[#556B2F]">SkillSwap</h2>

      {user && (
        <div className="relative">
          {/* 🔽 USER BUTTON */}
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

            {/* FULL NAME */}
            <span className="font-medium">
              {user.firstName} {user.lastName}
            </span>

            <span className="text-sm">▼</span>
          </button>

          {/* 🔽 DROPDOWN */}
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
