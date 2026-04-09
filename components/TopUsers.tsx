"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

type User = {
  id: number;
  firstName: string;
  lastName: string;
  avatar?: string;
  totalRequests: number;
};

export default function TopUsers() {
  const [users, setUsers] = useState<User[]>([]);

  useEffect(() => {
    const fetchTopUsers = async () => {
      const res = await fetch("/api/top-users");
      const data = await res.json();
      setUsers(data);
    };

    fetchTopUsers();
  }, []);

  return (
   <section className="relative py-20 overflow-hidden bg-[#eef2e3] text-center">

  {/*  soft radial glow (theme gold) */}
  <div className="pointer-events-none absolute inset-0
    bg-[radial-gradient(circle_at_30%_20%,rgba(184,134,11,0.15),transparent_60%),
        radial-gradient(circle_at_80%_80%,rgba(85,107,47,0.12),transparent_60%)]" />

  {/*  subtle grid texture */}
  <div className="pointer-events-none absolute inset-0 opacity-[0.06]
    [background-image:linear-gradient(#556B2F_1px,transparent_1px),linear-gradient(90deg,#556B2F_1px,transparent_1px)]
    [background-size:40px_40px]" />

  {/*  floating soft blobs */}
  <div className="pointer-events-none absolute -top-24 -left-24 w-72 h-72 bg-[#B8860B]/20 blur-[120px] rounded-full animate-pulse" />
  <div className="pointer-events-none absolute -bottom-24 -right-24 w-72 h-72 bg-[#556B2F]/20 blur-[120px] rounded-full animate-pulse" />

  {/*  CONTENT */}
  <div className="relative max-w-7xl mx-auto px-6">
    <h3 className="text-4xl md:text-5xl font-bold mb-14 text-[#556B2F]">
      Top Users of This Week
    </h3>

    <div className="flex justify-center gap-16 flex-wrap">
      {users.slice(0, 3).map((user, i) => (
        <div key={i} className="relative group">

          {/* hover wrapper */}
          <div className="transition-transform duration-500 group-hover:scale-105 group-hover:-rotate-1">

            {/* glow on hover */}
            <div className="absolute inset-0 bg-[#B8860B]/20 blur-xl opacity-0 group-hover:opacity-100 transition rounded-xl" />

            {/* card */}
            <div className="relative bg-[#B8860B] rounded-xl shadow-lg w-64 p-4 h-[360px] text-center card-animate">

              {i === 0 && (
                <div className="absolute inset-0 rounded-xl ring-2 ring-yellow-300/50 animate-pulse pointer-events-none" />
              )}

              <Image
                src={user.avatar?.trim() ? user.avatar : "/default-avatar.png"}
                alt={user.firstName}
                width={250}
                height={250}
                className="w-full h-72 object-cover rounded-lg"
              />

              <h4 className="mt-3 font-semibold text-white text-base leading-tight">
                {i === 0 && "🥇 "}
                {i === 1 && "🥈 "}
                {i === 2 && "🥉 "}
                {user.firstName} {user.lastName}
              </h4>

              <p className="text-sm text-white/80">
                {user.totalRequests} swaps
              </p>
            </div>
          </div>
        </div>
      ))}
    </div>
  </div>
</section>
  );
}