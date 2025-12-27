"use client";

import { useEffect, useState } from "react";
import RequestSwapModal from "./RequestSwapModal";
import Link from "next/link";


/* ⭐ Star Rating Component */
function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-1 text-yellow-500 text-sm">
      {"★".repeat(Math.floor(rating))}
      {"☆".repeat(5 - Math.floor(rating))}
    </div>
  );
}

export default function FindSkillsPage() {
  const [loading, setLoading] = useState(true);
  const [skills, setSkills] = useState<any[]>([]);
  const [me, setMe] = useState<any>(null);

  const [search, setSearch] = useState("");
  const [level, setLevel] = useState("");
  const [format, setFormat] = useState("");

  const [open, setOpen] = useState(false);
  const [selectedSkill, setSelectedSkill] = useState<any>(null);

  useEffect(() => {
    loadSkills();
  }, []);

  async function loadSkills() {
    const res = await fetch("/api/find-skills", { credentials: "include" });
    const json = await res.json();
    setSkills(json.skills || []);
    setMe(json.me || null);
    setLoading(false);
  }

  const filtered = skills.filter(
    (s) =>
      s.name.toLowerCase().includes(search.toLowerCase()) &&
      (level ? s.level === level : true) &&
      (format ? s.platform === format : true)
  );

  return (
    <div className="flex bg-[#f7f7f7] min-h-screen">

      {/* LEFT FILTER */}
      <div className="w-80 bg-white border-r p-6 space-y-4">
        <input
          className="border rounded px-3 py-2 w-full"
          placeholder="Search skill..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <select
          className="border rounded px-3 py-2 w-full"
          value={level}
          onChange={(e) => setLevel(e.target.value)}
        >
          <option value="">Any level</option>
          <option>Beginner</option>
          <option>Intermediate</option>
          <option>Advanced</option>
        </select>

        <select
          className="border rounded px-3 py-2 w-full"
          value={format}
          onChange={(e) => setFormat(e.target.value)}
        >
          <option value="">Any format</option>
          <option>Google Meet</option>
          <option>Zoom</option>
        </select>
      </div>

      {/* MAIN */}
      <div className="flex-1 p-10">
        <h1 className="text-2xl font-bold mb-6">Find skills to learn</h1>

        {loading && <p>Loading...</p>}
        {!loading && filtered.length === 0 && <p>No matches found.</p>}

        <div className="grid grid-cols-2 gap-5">
          {filtered.map((skill) => (
            <div key={skill.id} className="bg-white border rounded-xl p-5 shadow-sm">

              {/* USER HEADER */}
              <div className="flex items-center gap-4">
                {skill.user.avatar ? (
                  <img
                    src={skill.user.avatar}
                    alt="avatar"
                    className="w-12 h-12 rounded-full object-cover border"
                  />
                ) : (
                  <div className="w-12 h-12 rounded-full bg-[#4a5e27] text-white flex items-center justify-center font-bold">
                    {skill.user.firstName[0]}
                    {skill.user.lastName[0]}
                  </div>
                )}

                <div>
                  <div className="font-semibold">
                    {skill.user.firstName} {skill.user.lastName}
                  </div>

                  {/* ⭐ Rating */}
                  <div className="flex items-center gap-2">
                    <StarRating rating={skill.rating} />
                    <span className="text-xs text-gray-500">
                      {skill.rating} ({skill.reviewsCount} reviews)
                    </span>
                  </div>
                </div>
              </div>

              {/* SKILL INFO */}
              <div className="mt-4">
                <div className="text-lg font-bold">{skill.name}</div>
                <p className="text-sm text-gray-600">{skill.description}</p>
              </div>

              {/* ACTIONS */}
              <div className="flex gap-2 mt-5">
                <button
                  className="flex-1 bg-[#4a5e27] text-white rounded py-2"
                  onClick={() => {
                    setSelectedSkill(skill);
                    setOpen(true);
                  }}
                >
                  Request Swap
                </button>

          <Link
  href={`/dashboard/profile/${skill.user.id}`}
  className="
    flex-1 
    border 
    border-gray-300
    rounded-lg 
    py-2 
    text-center 
    font-medium
    text-gray-700
    transition-all 
    duration-200
    hover:bg-[rgb(188,200,153)] 
    hover:text-white 
    hover:border-[#4a5e27]
    hover:shadow-md
    active:scale-[0.98]
  "
>
  View Profile
</Link>


              </div>
            </div>
          ))}
        </div>
      </div>

      {selectedSkill && (
        <RequestSwapModal
          open={open}
          skill={selectedSkill}
          onClose={() => setOpen(false)}
        />
      )}
    </div>
  );
}
