"use client";
import { useEffect, useState } from "react";
import Link from "next/link";

export default function AuthNavbar() {
  const [user, setUser] = useState<any>(null);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    async function fetchUser() {
      const res = await fetch("/api/auth/me");
      const data = await res.json();
      setUser(data.user);
    }
    fetchUser();
  }, []);

  const handleLogout = async () => {
    await fetch("/api/auth/logout");
    window.location.href = "/login";
  };

  return (
    <nav className="bg-[#E9EDE1] py-4 px-8 flex justify-between shadow-sm">
      <h2 className="text-xl font-bold text-[#556B2F]">SkillSwap</h2>

      {user ? (
        <div className="relative">
          <button
            onClick={() => setOpen(!open)}
            className="flex items-center gap-2 bg-[#556B2F] text-white px-4 py-2 rounded-md"
          >
            {user.firstName} {user.lastName}
            <span>▼</span>
          </button>

          {open && (
            <div className="absolute right-0 mt-2 bg-white shadow-lg w-40 rounded-md">
              <Link
                href="/profile"
                className="block px-4 py-2 hover:bg-gray-100"
              >
                Profile
              </Link>

              <button
                onClick={handleLogout}
                className="w-full text-left px-4 py-2 hover:bg-gray-100"
              >
                Logout
              </button>
            </div>
          )}
        </div>
      ) : (
        <div className="flex gap-3">
          <Link href="/login" className="text-[#556B2F]">Login</Link>
          <Link href="/register" className="text-[#B8860B]">Register</Link>
        </div>
      )}
    </nav>
  );
}
