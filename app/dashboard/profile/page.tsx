"use client";

import { useEffect, useState } from "react";

export default function ProfilePage() {
  const [user, setUser] = useState<any>(null);
  const [skillsOffered, setSkillsOffered] = useState<any[]>([]);
  const [skillsWanted, setSkillsWanted] = useState<any[]>([]);

  const [teachSkillInput, setTeachSkillInput] = useState("");
  const [learnSkillInput, setLearnSkillInput] = useState("");

  const [editingBio, setEditingBio] = useState(false);
  const [bioInput, setBioInput] = useState("");

  useEffect(() => {
    loadUser();
    loadOfferedSkills();
    loadWantedSkills();
  }, []);

  async function loadUser() {
    const res = await fetch("/api/auth/me", { credentials: "include" });
    const data = await res.json();
    setUser(data.user);
    setBioInput(data.user.bio || "");
  }

  async function loadOfferedSkills() {
    const res = await fetch("/api/skills/offer", { credentials: "include" });
    const data = await res.json();
    setSkillsOffered(data.skills); // skill objects
  }

  async function loadWantedSkills() {
    const res = await fetch("/api/skills/want", { credentials: "include" });
    const data = await res.json();
    setSkillsWanted(data.skills); // skill objects
  }

  async function submitTeachSkill() {
    if (!teachSkillInput.trim()) return;

    await fetch("/api/skills/offer", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({
        teachSkill: teachSkillInput,
        teachLevel: "Beginner",
        teachDesc: "",
        learnSkill: "",
        learnLevel: "",
        learnGoal: "",
        sessionLength: "60",
        selectedDays: [],
        fromTime: "",
        toTime: "",
        platform: "Google Meet",
        publicListing: true
      }),
    });

    setTeachSkillInput("");
    loadOfferedSkills();
  }

  async function submitLearnSkill() {
    if (!learnSkillInput.trim()) return;

    await fetch("/api/skills/want", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ skill: learnSkillInput }),
    });

    setLearnSkillInput("");
    loadWantedSkills();
  }

  async function deleteSkill(skillName: string, type: string) {
    await fetch("/api/skills/delete", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ skill: skillName, type }),
    });

    if (type === "offer") loadOfferedSkills();
    else loadWantedSkills();
  }

  async function saveBio() {
    await fetch("/api/profile/bio", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ bio: bioInput }),
    });
    setEditingBio(false);
  }

  if (!user) return <div className="text-xl p-10">Loading...</div>;

  return (
    <div className="px-12 py-10 bg-[#f7f7f7] min-h-screen font-['Inter']">

      {/* HEADER */}
      <div className="text-3xl font-bold text-[#2b3d1f] mb-1">My Profile</div>
      <div className="text-gray-600 mb-8">
        Update what you teach and what you want to learn to match better.
      </div>

      {/* TOP CARD */}
      <div className="bg-white border border-[#d8dccf] rounded-2xl shadow p-6 flex justify-between mb-6">
        <div className="flex gap-5">
          <img
            src={user.avatar || "https://i.pravatar.cc/100"}
            className="rounded-full w-16 h-16"
          />
          <div>
            <div className="font-semibold text-lg">{user.firstName} {user.lastName}</div>
            <div className="text-sm text-gray-500">{user.email}</div>

            <div className="flex flex-wrap gap-1 mt-2">
              {skillsOffered.map((s: any, i: number) => (
                <span key={i} className="px-2 py-0.5 text-xs bg-[#d8dccf] rounded-full">
                  Teaches: {s.name}
                </span>
              ))}
              {skillsWanted.map((s: any, i: number) => (
                <span key={i} className="px-2 py-0.5 text-xs bg-[#f0d9b5] rounded-full">
                  Wants: {s.name}
                </span>
              ))}
            </div>
          </div>
        </div>

        <button className="text-[#4a5e27] hover:text-[#2b3d1f] text-sm underline">
          View public profile
        </button>
      </div>

      <div className="grid grid-cols-2 gap-6">

        {/* LEFT */}
        <div className="space-y-6">

          <SkillCard
            title="Skills I can teach"
            color="green"
            skills={skillsOffered}
            input={teachSkillInput}
            placeholder="e.g. Python, Guitar"
            setInput={setTeachSkillInput}
            onAdd={submitTeachSkill}
            onDelete={(s: string) => deleteSkill(s, "offer")}
          />

          <SkillCard
            title="Skills I want to learn"
            color="yellow"
            skills={skillsWanted}
            input={learnSkillInput}
            placeholder="e.g. UI/UX, Japanese"
            setInput={setLearnSkillInput}
            onAdd={submitLearnSkill}
            onDelete={(s: string) => deleteSkill(s, "want")}
          />

        </div>

        {/* RIGHT */}
        <div>
          <div className="bg-white border border-[#d8dccf] rounded-2xl shadow p-6 mb-6">

            <div className="font-semibold mb-2">Profile summary</div>
            <div className="text-sm text-gray-600 mb-2">About me</div>

            {!editingBio ? (
              <p className="text-sm text-gray-700">
                {bioInput || "No bio added yet."}
              </p>
            ) : (
              <textarea
                className="w-full border px-3 py-2 rounded text-sm"
                rows={3}
                value={bioInput}
                onChange={(e) => setBioInput(e.target.value)}
              />
            )}

            <div className="flex justify-end mt-3">
              {editingBio ? (
                <div className="flex gap-2">
                  <button
                    onClick={saveBio}
                    className="px-4 py-1 text-sm bg-[#4a5e27] text-white rounded"
                  >
                    Save
                  </button>
                  <button
                    onClick={() => setEditingBio(false)}
                    className="px-4 py-1 text-sm border rounded"
                  >
                    Cancel
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => setEditingBio(true)}
                  className="px-4 py-1 text-sm border rounded bg-[#eef2ea]"
                >
                  Edit summary
                </button>
              )}
            </div>

          </div>
        </div>

      </div>
    </div>
  );
}

function SkillCard({ title, color, skills, input, placeholder, setInput, onAdd, onDelete }: any) {

  return (
    <div className="bg-white border border-[#d8dccf] rounded-2xl shadow p-6">

      <div className="font-semibold mb-2">{title}</div>

      <div className="flex flex-wrap gap-2 mb-3">
        {skills.map((s: any, i: number) => (
          <div key={i} className="flex items-center gap-2 px-3 py-1 text-xs rounded-full border bg-[#eef2ea]">
            <span>{s.name}</span>
            <button
              onClick={() => onDelete(s.name)}
              className="text-red-500 hover:text-red-700 text-sm font-bold"
            >
              ✕
            </button>
          </div>
        ))}
      </div>

      <div className="flex gap-2">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className="border border-[#cdd6c5] px-3 py-1 text-sm rounded w-full"
          placeholder={placeholder}
        />
        <button
          onClick={onAdd}
          className="px-4 py-1 rounded text-sm bg-[#4a5e27] text-white"
        >
          Add
        </button>
      </div>

    </div>
  );
}
