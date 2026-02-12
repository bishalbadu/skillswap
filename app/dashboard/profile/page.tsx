"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";


/* ================= CONFIRM DELETE MODAL ================= */
function ConfirmDeleteModal({
  open,
  title = "Remove skill?",
  description = "Are you sure you want to remove this skill? This action cannot be undone.",
  loading,
  onCancel,
  onConfirm,
}: {
  open: boolean;
  title?: string;
  description?: string;
  loading?: boolean;
  onCancel: () => void;
  onConfirm: () => void;
}) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 px-4">
      <div className="bg-white rounded-2xl p-6 w-full max-w-sm space-y-4 shadow-xl">
        <h2 className="text-lg font-semibold text-gray-900">{title}</h2>
        <p className="text-sm text-gray-600">{description}</p>

        <div className="flex justify-end gap-3 pt-2">
          <button
            onClick={onCancel}
            disabled={loading}
            className="px-4 py-2 border rounded-lg"
          >
            Cancel
          </button>

          <button
            onClick={onConfirm}
            disabled={loading}
            className={`px-4 py-2 rounded-lg text-white ${
              loading ? "bg-red-300" : "bg-red-600 hover:bg-red-700"
            }`}
          >
            {loading ? "Deleting..." : "Delete"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default function ProfilePage() {
  const [user, setUser] = useState<any>(null);

  const [skillsOffered, setSkillsOffered] = useState<any[]>([]);
  const [skillsWanted, setSkillsWanted] = useState<any[]>([]);

  const [teachSkillInput, setTeachSkillInput] = useState("");
  const [learnSkillInput, setLearnSkillInput] = useState("");

  const [editingBio, setEditingBio] = useState(false);
  const [bioInput, setBioInput] = useState("");

  const [editing, setEditing] = useState(false);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [avatar, setAvatar] = useState("");

  /* ✅ UI/UX delete modal state */
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<{
    skillId: number;
    type: "offer" | "want";
  } | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    loadAll();
  }, []);

  async function loadAll() {
    await Promise.all([loadUser(), loadOfferedSkills(), loadWantedSkills()]);
  }

  async function loadUser() {
    const res = await fetch("/api/auth/me", { credentials: "include" });
    const data = await res.json();
    if (!data.user) return;

    setUser(data.user);
    setFirstName(data.user.firstName);
    setLastName(data.user.lastName);
    setAvatar(data.user.avatar || "");
    setBioInput(data.user.bio || "");
  }

  async function loadOfferedSkills() {
    const res = await fetch("/api/skills/offer", { credentials: "include" });
    const data = await res.json();
    setSkillsOffered(data.skills || []);
  }

  async function loadWantedSkills() {
    const res = await fetch("/api/skills/want", { credentials: "include" });
    const data = await res.json();
    setSkillsWanted(data.skills || []);
  }

  /* ================= ADD SKILLS ================= */
function submitTeachSkill() {
  if (!teachSkillInput.trim()) return;

  // redirect to full offer form with autofill
  router.push(
    `/dashboard/offer-skills?skill=${encodeURIComponent(teachSkillInput)}`
  );

  setTeachSkillInput("");
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

  /* ================= DELETE SKILL (UI MODAL) ================= */
  function openDeleteModal(skillId: number, type: "offer" | "want") {
    setDeleteTarget({ skillId, type });
    setConfirmOpen(true);
  }

  async function confirmDeleteSkill() {
    if (!deleteTarget) return;

    try {
      setDeleteLoading(true);

      const res = await fetch("/api/skills/delete", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          skillId: deleteTarget.skillId,
          type: deleteTarget.type, // kept (safe for future)
        }),
      });

      if (!res.ok) {
        let msg = "Failed to delete skill";
        try {
          const data = await res.json();
          msg = data.error || msg;
        } catch {}
        alert(msg);
        return;
      }

      // refresh list
      deleteTarget.type === "offer"
        ? await loadOfferedSkills()
        : await loadWantedSkills();

      setConfirmOpen(false);
      setDeleteTarget(null);
    } finally {
      setDeleteLoading(false);
    }
  }

  /* ================= AVATAR UPLOAD ================= */
  async function handleAvatarUpload(e: any) {
    const file = e.target.files?.[0];
    if (!file) return;

    const form = new FormData();
    form.append("file", file);

    const res = await fetch("/api/upload", { method: "POST", body: form });
    const data = await res.json();
    if (data.url) setAvatar(data.url);
  }

  async function saveBasicProfile() {
    await fetch("/api/profile/update", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ firstName, lastName, avatar }),
    });

    window.dispatchEvent(new Event("profile-updated"));
    setEditing(false);
    loadUser();
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

  if (!user) return <div className="p-10 text-xl">Loading...</div>;

  return (
    <div className="px-12 py-10 bg-[#f7f7f7] min-h-screen font-['Inter']">
      {/* HEADER */}
      <h1 className="text-3xl font-bold text-[#2b3d1f]">My Profile</h1>
      <p className="text-gray-600 mb-8">
        Update your details, photo, and your skills.
      </p>

      {/* PROFILE CARD */}
      <div className="bg-white border rounded-2xl shadow p-6 mb-6 flex justify-between">
        <div className="flex items-center gap-5">
          {avatar ? (
            <img
              src={avatar}
              className="w-16 h-16 rounded-full object-cover border"
            />
          ) : (
            <div className="w-16 h-16 rounded-full bg-[#4a5e27] text-white flex items-center justify-center font-bold">
              {user.firstName[0]}
              {user.lastName[0]}
            </div>
          )}

          {!editing ? (
            <div>
              <div className="font-semibold text-lg">
                {user.firstName} {user.lastName}
              </div>
              <div className="text-sm text-gray-500">{user.email}</div>
              <button
                onClick={() => setEditing(true)}
                className="mt-2 px-3 py-1 border rounded bg-[#eef2ea] text-sm"
              >
                Edit Profile
              </button>
            </div>
          ) : (
            <div className="space-y-2">
              <label className="text-sm underline cursor-pointer text-[#4a5e27]">
                Upload Photo
                <input
                  type="file"
                  onChange={handleAvatarUpload}
                  className="hidden"
                />
              </label>

              <input
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                className="border p-2 rounded w-full"
              />
              <input
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                className="border p-2 rounded w-full"
              />

              <div className="flex gap-2">
                <button
                  onClick={saveBasicProfile}
                  className="px-4 py-2 bg-[#4a5e27] text-white rounded"
                >
                  Save
                </button>
                <button
                  onClick={() => setEditing(false)}
                  className="px-4 py-2 border rounded"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* SKILLS + ABOUT */}
      <div className="grid grid-cols-2 gap-6">

  {/* LEFT COLUMN */}
  <div className="space-y-6">
    <SkillCard
      title="Skills I can teach"
      skills={skillsOffered}
      input={teachSkillInput}
      placeholder="e.g. Python, Guitar"
      setInput={setTeachSkillInput}
      onAdd={submitTeachSkill}
      onDeleteMultiple={(ids: number[]) => {
        ids.forEach((id) => openDeleteModal(id, "offer"));
      }}
      showStatus
    />

    <SkillCard
      title="Skills I want to learn"
      skills={skillsWanted}
      input={learnSkillInput}
      placeholder="e.g. UI/UX, Japanese"
      setInput={setLearnSkillInput}
      onAdd={submitLearnSkill}
      onDeleteMultiple={(ids: number[]) => {
        ids.forEach((id) => openDeleteModal(id, "want"));
      }}
      showStatus
    />
  </div>

  {/* RIGHT COLUMN */}
  <div className="space-y-6">

    {/* ABOUT ME */}
    <div className="bg-white border rounded-2xl shadow p-6">
      <div className="font-semibold mb-2">About Me</div>

      {!editingBio ? (
        <p className="text-sm text-gray-700">
          {bioInput || "No bio added yet."}
        </p>
      ) : (
        <textarea
          className="w-full border px-3 py-2 rounded text-sm"
          rows={4}
          value={bioInput}
          onChange={(e) => setBioInput(e.target.value)}
        />
      )}

      <div className="flex justify-end mt-3">
        {editingBio ? (
          <div className="flex gap-2">
            <button
              onClick={saveBio}
              className="px-4 py-1 bg-[#4a5e27] text-white rounded"
            >
              Save
            </button>
            <button
              onClick={() => setEditingBio(false)}
              className="px-4 py-1 border rounded"
            >
              Cancel
            </button>
          </div>
        ) : (
          <button
            onClick={() => setEditingBio(true)}
            className="px-4 py-1 border rounded bg-[#eef2ea]"
          >
            Edit summary
          </button>
        )}
      </div>
    </div>

    {/* REVIEWS — NOW DIRECTLY BELOW ABOUT */}
    <div className="bg-white border rounded-2xl shadow p-6">
      <div className="font-semibold mb-2">My Reviews</div>

      <div className="flex items-center gap-2 text-yellow-500 text-lg">
        {"★".repeat(Math.floor(user.rating || 0))}
        {"☆".repeat(5 - Math.floor(user.rating || 0))}
        <span className="text-gray-700 text-sm ml-2">
          {user.rating || 0} ({user.reviewsCount || 0} reviews)
        </span>
      </div>

      {user.recentReviews?.length === 0 && (
        <p className="text-sm text-gray-500 mt-2">
          No reviews yet.
        </p>
      )}

      <div className="mt-3 space-y-3">
        {user.recentReviews?.map((r: any) => (
          <div
            key={r.id}
            className="border rounded-lg p-3 bg-[#f8faf7]"
          >
            <div className="flex items-center gap-3 mb-1">
              {r.reviewer.avatar ? (
                <img
                  src={r.reviewer.avatar}
                  className="w-8 h-8 rounded-full"
                />
              ) : (
                <div className="w-8 h-8 rounded-full bg-[#4a5e27] text-white flex items-center justify-center text-xs">
                  {r.reviewer.firstName[0]}
                </div>
              )}

              <div className="text-sm font-medium">
                {r.reviewer.firstName} {r.reviewer.lastName}
              </div>
            </div>

            <div className="text-yellow-500 text-sm">
              {"★".repeat(r.rating)}
              {"☆".repeat(5 - r.rating)}
            </div>

            {r.comment && (
              <p className="text-sm text-gray-700 mt-1">
                {r.comment}
              </p>
            )}
          </div>
        ))}
      </div>
    </div>

  </div>
</div>

      {/* ✅ CONFIRM MODAL */}
      <ConfirmDeleteModal
        open={confirmOpen}
        loading={deleteLoading}
        onCancel={() => {
          if (deleteLoading) return;
          setConfirmOpen(false);
          setDeleteTarget(null);
        }}
        onConfirm={confirmDeleteSkill}
      />
    </div>
  );
}

function SkillCard({
  title,
  skills,
  input,
  placeholder,
  setInput,
  onAdd,
  onDeleteMultiple,
  showStatus = false,
}: any) {
  const [selectMode, setSelectMode] = useState(false);
  const [selected, setSelected] = useState<number[]>([]);

  function toggleSelect(id: number) {
    setSelected((prev) =>
      prev.includes(id)
        ? prev.filter((x) => x !== id)
        : [...prev, id]
    );
  }

  function handleDelete() {
    if (selected.length === 0) return;
    onDeleteMultiple(selected);
    setSelected([]);
    setSelectMode(false);
  }

  return (
    <div className="bg-white border rounded-2xl shadow p-6">
      {/* HEADER */}
      <div className="flex justify-between items-center mb-4">
        <div className="font-semibold">{title}</div>

        {skills.length > 0 && (
          <div className="flex gap-2">
            {!selectMode ? (
              <button
                onClick={() => setSelectMode(true)}
                className="text-sm text-red-600 font-medium hover:underline"
              >
                Delete Skills
              </button>
            ) : (
              <>
                <button
                  onClick={() => setSelectMode(false)}
                  className="text-sm border px-3 py-1 rounded"
                >
                  Cancel
                </button>

                <button
                  onClick={handleDelete}
                  className="text-sm bg-red-600 text-white px-3 py-1 rounded"
                >
                  Delete Selected
                </button>
              </>
            )}
          </div>
        )}
      </div>

      {/* LIST */}
      <div className="space-y-2 mb-4">
        {skills.map((s: any) => (
          <div
            key={s.id}
            className="flex items-center gap-3 border rounded-lg px-3 py-2 bg-[#f8faf7]"
          >
            {/* Checkbox only in select mode */}
            {selectMode && (
              <input
                type="checkbox"
                checked={selected.includes(s.id)}
                onChange={() => toggleSelect(s.id)}
              />
            )}

            <span className="text-sm font-medium">{s.name}</span>

            {showStatus && s.status && (
              <span
                className={`ml-auto px-2 py-0.5 text-xs rounded
                  ${s.status === "APPROVED" && "bg-green-100 text-green-700"}
                  ${s.status === "PENDING" && "bg-yellow-100 text-yellow-700"}
                  ${s.status === "DISABLED" && "bg-red-100 text-red-700"}
                `}
              >
                {s.status}
              </span>
            )}
          </div>
        ))}
      </div>

      {/* ADD INPUT */}
      <div className="flex gap-2">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={placeholder}
          className="border px-3 py-2 text-sm rounded w-full"
        />

        <button
          onClick={onAdd}
          className="px-4 py-2 bg-[#4a5e27] text-white rounded"
        >
          Add
        </button>
      </div>
    </div>
  );
}
