"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import DashboardTopbar from "@/components/DashboardTopbar";

export default function Dashboard() {
  const [user, setUser] = useState<any>(null);
  const router = useRouter();

  // Load user
  useEffect(() => {
    async function load() {
      const res = await fetch("/api/auth/me");
      const data = await res.json();

      if (!data.user) router.push("/login");
      else setUser(data.user);
    }
    load();
  }, []);

  if (!user) return <div className="p-10">Loading...</div>;

  return (
    <div className="min-h-screen bg-[#f7f7f7]">

      {/* ⭐ TOP BAR (shows initials + name + dropdown) */}
      <DashboardTopbar />

      <div className="flex">

        {/* LEFT SIDEBAR */}
        <aside className="w-64 bg-[#c8d4b0] p-6 space-y-4 min-h-screen">
          <a className="block bg-white px-4 py-2 rounded shadow">Dashboard</a>
          <a className="block bg-white px-4 py-2 rounded shadow">Find Skills</a>
          <a className="block bg-white px-4 py-2 rounded shadow">Offer Skills</a>
          <a className="block bg-white px-4 py-2 rounded shadow">Messages</a>
          <a className="block bg-white px-4 py-2 rounded shadow">Profile</a>
          <a className="block bg-white px-4 py-2 rounded shadow">Settings</a>
        </aside>

        {/* MAIN CONTENT */}
        <main className="flex-1 p-10">
          <h1 className="text-3xl font-bold text-[#4a5e27]">
            Welcome {user.firstName} !
          </h1>

          {/* CARDS */}
          <div className="grid grid-cols-2 gap-6 my-10">
            <div className="bg-[#d8b26e] p-6 rounded-xl shadow">
              <h3 className="font-bold">Your Active Swaps</h3>
              <p className="text-sm opacity-70">You have 2 active skill sessions.</p>
              <button className="mt-4 bg-white px-4 py-1 rounded shadow">View Swaps</button>
            </div>

            <div className="bg-[#d8b26e] p-6 rounded-xl shadow">
              <h3 className="font-bold">Pending Requests</h3>
              <p className="text-sm opacity-70">1 new request.</p>
              <button className="mt-4 bg-white px-4 py-1 rounded shadow">Review</button>
            </div>

            <div className="bg-[#d8b26e] p-6 rounded-xl shadow">
              <h3 className="font-bold">Discover New Skills</h3>
              <p className="text-sm opacity-70">Explore skills offered by others.</p>
              <button className="mt-4 bg-white px-4 py-1 rounded shadow">Browse</button>
            </div>

            <div className="bg-[#d8b26e] p-6 rounded-xl shadow">
              <h3 className="font-bold">Offer Your Skills</h3>
              <p className="text-sm opacity-70">Share expertise with the community.</p>
              <button className="mt-4 bg-white px-4 py-1 rounded shadow">Add Skill</button>
            </div>
          </div>

          {/* RECENT ACTIVITY */}
          <h2 className="text-2xl font-bold text-[#4a5e27] mb-6">Recent Activity</h2>

          <div className="space-y-4">
            {[
              "New message from Bishal",
              "Skill Swap completed.",
              "New message from Sne",
              "New message from Evan",
            ].map((item, i) => (
              <div
                key={i}
                className="flex justify-between bg-white border p-3 rounded shadow"
              >
                <span>{item}</span>
                <button className="px-4 py-1 bg-[#4a5e27] text-white rounded">
                  View
                </button>
              </div>
            ))}
          </div>
        </main>
      </div>
    </div>
  );
}
