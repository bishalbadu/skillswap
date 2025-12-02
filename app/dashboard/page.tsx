"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import DashboardTopbar from "@/components/DashboardTopbar";

export default function Dashboard() {
  const [user, setUser] = useState<any>(null);
  const router = useRouter();

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
    <div className="min-h-screen bg-[#f4f5f1] font-['Inter']">


      <div className="flex">

        {/* MAIN CONTENT */}
        <main className="flex-1 p-10">
          <h1 className="text-3xl font-bold text-[#2c3a21]">
            Welcome {user.firstName} 👋
          </h1>

          {/* CARDS */}
          <div className="grid grid-cols-2 gap-6 my-10">
            <CardItem title="Your Active Swaps" desc="You have 2 active skill sessions." btn="View Swaps" />
            <CardItem title="Pending Requests" desc="1 new request." btn="Review" />
            <CardItem title="Discover New Skills" desc="Explore skills offered by others." btn="Browse" />
            <CardItem title="Offer Your Skills" desc="Share expertise with the community." btn="Add Skill" />
          </div>

          {/* RECENT ACTIVITY */}
          <h2 className="text-2xl font-bold text-[#2c3a21] mb-6">Recent Activity</h2>

          <div className="space-y-4">
            {[
              "New message from Bishal",
              "Skill Swap completed.",
              "New message from Sne",
              "New message from Evan",
            ].map((item, i) => (
              <div
                key={i}
                className="flex justify-between bg-white border p-3 rounded shadow hover:scale-[1.01] transition"
              >
                <span>{item}</span>
                <button className="px-4 py-1 bg-[#2c3a21] text-white rounded hover:bg-[#1e2815]">
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

function SidebarItem({ text, href, active }: any) {
  return (
    <Link
      href={href}
      className={`block px-4 py-2 rounded-md transition transform
        ${active ? "bg-white text-[#2c3a21]" : "bg-white/10 text-white"}
        hover:bg-white hover:text-[#2c3a21] hover:translate-x-1`}
    >
      {text}
    </Link>
  );
}

function CardItem({ title, desc, btn }: any) {
  return (
    <div className="bg-[#d8b26e] p-6 rounded-xl shadow hover:shadow-lg transition hover:-translate-y-1">
      <h3 className="font-bold">{title}</h3>
      <p className="text-sm opacity-90">{desc}</p>
      <button className="mt-4 bg-white px-4 py-1 rounded shadow hover:scale-[1.05] transition">
        {btn}
      </button>
    </div>
  );
}


