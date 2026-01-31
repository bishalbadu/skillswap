"use client";

import { useEffect, useMemo, useState } from "react";

type SkillRow = {
  id: number;
  name: string;
  type: "OFFER" | "WANT";

  // OFFER fields
  description: string | null;
  level: string | null;
  platform: string | null;
  sessionLength: number | null;

  // WANT field
  learnGoal: string | null;

  publicListing: boolean;
  status: "PENDING" | "APPROVED" | "DISABLED";
  createdAt: string;

  user: {
    id: number;
    firstName: string;
    lastName: string;
    email: string;
    status: "ACTIVE" | "SUSPENDED";
    membership: "FREE" | "PREMIUM";
  };

  slots: Array<{
    id: number;
    day: string;
    timeFrom: string;
    timeTo: string;
    isBooked: boolean;
  }>;
};


export default function AdminSkillsPage() {
  const [skills, setSkills] = useState<SkillRow[]>([]);
  const [loading, setLoading] = useState(true);

  const [q, setQ] = useState("");
  const [type, setType] = useState("");
  const [status, setStatus] = useState("");
  const [listing, setListing] = useState("");

  const [selectedId, setSelectedId] = useState<number | null>(null);
  const selected = useMemo(
    () => skills.find((s) => s.id === selectedId) || null,
    [skills, selectedId]
  );

  async function loadSkills() {
    setLoading(true);
    try {
      const res = await fetch(
        `/api/admin/skills?q=${encodeURIComponent(q)}&type=${type}&status=${status}&listing=${listing}`,
        { credentials: "include" }
      );

      const data = await res.json();
      setSkills(data.skills || []);
    } finally {
      setLoading(false);
    }
  }

  async function action(skillId: number, action: string) {
    await fetch(`/api/admin/skills/${skillId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ action }),
    });
    await loadSkills();
  }

  useEffect(() => {
    loadSkills();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="space-y-6">
      {/* HEADER */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Skill Moderation</h1>
          <p className="text-gray-600 mt-1">
            Review skill listings, approve valid content, and disable inappropriate or spam skills.
          </p>
        </div>

        <button
          onClick={loadSkills}
          className="px-4 py-2 rounded-lg bg-[#4a5e27] text-white text-sm"
        >
          Refresh
        </button>
      </div>

      {/* FILTER BAR */}
      <div className="bg-white rounded-xl shadow p-4 flex flex-wrap gap-3 items-center">
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Search skill, user name, or email..."
          className="border rounded-lg px-3 py-2 text-sm w-[280px]"
        />

        <select
          value={type}
          onChange={(e) => setType(e.target.value)}
          className="border rounded-lg px-3 py-2 text-sm"
        >
          <option value="">All Types</option>
          <option value="OFFER">Offer</option>
          <option value="WANT">Want</option>
        </select>

        <select
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          className="border rounded-lg px-3 py-2 text-sm"
        >
          <option value="">All Status</option>
          <option value="PENDING">Pending</option>
          <option value="APPROVED">Approved</option>
          <option value="DISABLED">Disabled</option>
        </select>

        <select
          value={listing}
          onChange={(e) => setListing(e.target.value)}
          className="border rounded-lg px-3 py-2 text-sm"
        >
          <option value="">All Listings</option>
          <option value="PUBLIC">Public</option>
          <option value="PRIVATE">Private</option>
        </select>

        <button
          onClick={loadSkills}
          className="px-4 py-2 rounded-lg bg-gray-900 text-white text-sm"
        >
          Apply
        </button>

        {loading && (
          <span className="text-sm text-gray-500 ml-2">Loading…</span>
        )}
      </div>

      {/* TABLE */}
      <div className="bg-white rounded-xl shadow overflow-hidden">
        <div className="px-5 py-4 border-b flex items-center justify-between">
          <h3 className="font-semibold">All Skills</h3>
          <span className="text-sm text-gray-500">
            {skills.length} result(s)
          </span>
        </div>

        <table className="w-full text-sm">
          <thead className="bg-gray-50 text-gray-600">
            <tr>
              <th className="p-3 text-left">Skill</th>
              <th className="text-left">Type</th>
              <th className="text-left">Owner</th>
              <th className="text-left">Visibility</th>
              <th className="text-left">Moderation</th>
              <th className="text-left">Created</th>
              <th className="text-right pr-4">Actions</th>
            </tr>
          </thead>

          <tbody>
            {skills.map((s) => (
              <tr key={s.id} className="border-t hover:bg-gray-50/60">
                <td className="p-3">
                  <div className="font-medium">{s.name}</div>
                  <div className="text-xs text-gray-500">
                    {s.level ? `Level: ${s.level}` : "—"}{" "}
                    {s.platform ? `• Platform: ${s.platform}` : ""}
                  </div>
                </td>

                <td>
                  <Badge
                    text={s.type === "OFFER" ? "Offer" : "Want"}
                    tone={s.type === "OFFER" ? "green" : "blue"}
                  />
                </td>

                <td>
                  <div className="font-medium">
                    {s.user.firstName} {s.user.lastName}
                  </div>
                  <div className="text-xs text-gray-500">{s.user.email}</div>
                  <div className="mt-1 flex gap-2">
                    <Badge
                      text={s.user.membership}
                      tone={s.user.membership === "PREMIUM" ? "orange" : "gray"}
                    />
                    <Badge
                      text={s.user.status}
                      tone={s.user.status === "ACTIVE" ? "green" : "red"}
                    />
                  </div>
                </td>

                <td>
                  <Badge
                    text={s.publicListing ? "Public" : "Private"}
                    tone={s.publicListing ? "green" : "gray"}
                  />
                </td>

                <td>
                  <Badge
                    text={s.status}
                    tone={
                      s.status === "APPROVED"
                        ? "green"
                        : s.status === "PENDING"
                        ? "yellow"
                        : "red"
                    }
                  />
                </td>

                <td className="text-gray-600">
                  {new Date(s.createdAt).toLocaleDateString()}
                </td>

                <td className="text-right pr-4 space-x-3">
                  <button
                    onClick={() => setSelectedId(s.id)}
                    className="text-green-700 hover:underline"
                  >
                    View
                  </button>

                  {s.status === "PENDING" && (
                    <button
                      onClick={() => action(s.id, "APPROVE")}
                      className="text-blue-700 hover:underline"
                    >
                      Approve
                    </button>
                  )}

                  {s.status !== "DISABLED" ? (
                    <button
                      onClick={() => action(s.id, "DISABLE")}
                      className="text-red-700 hover:underline"
                    >
                      Disable
                    </button>
                  ) : (
                    <button
                      onClick={() => action(s.id, "ENABLE")}
                      className="text-blue-700 hover:underline"
                    >
                      Enable
                    </button>
                  )}

                  <button
                    onClick={() => action(s.id, "TOGGLE_LISTING")}
                    className="text-gray-700 hover:underline"
                  >
                    Toggle listing
                  </button>
                </td>
              </tr>
            ))}

            {!loading && skills.length === 0 && (
              <tr>
                <td className="p-6 text-gray-500" colSpan={7}>
                  No skills found. Try changing filters.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* DETAILS DRAWER */}
      {selected && (
        <div className="bg-white rounded-xl shadow p-6">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h3 className="text-lg font-semibold">{selected.name}</h3>
              <p className="text-sm text-gray-600 mt-1">
                Owner:{" "}
                <span className="font-medium">
                  {selected.user.firstName} {selected.user.lastName}
                </span>{" "}
                • <span className="text-gray-700">{selected.user.email}</span>
              </p>
              <div className="mt-2 flex flex-wrap gap-2">
                <Badge text={selected.type} tone="gray" />
                <Badge text={selected.status} tone="yellow" />
                <Badge
                  text={selected.publicListing ? "Public" : "Private"}
                  tone={selected.publicListing ? "green" : "gray"}
                />
                <Badge
                  text={selected.user.membership}
                  tone={selected.user.membership === "PREMIUM" ? "orange" : "gray"}
                />
                <Badge
                  text={selected.user.status}
                  tone={selected.user.status === "ACTIVE" ? "green" : "red"}
                />
              </div>
            </div>

            <button
              onClick={() => setSelectedId(null)}
              className="px-4 py-2 rounded-lg border text-sm"
            >
              Close
            </button>
          </div>

          <div className="grid grid-cols-2 gap-6 mt-6 text-sm">
            <div className="space-y-2">
              <div>
                <span className="text-gray-500">Level:</span>{" "}
                <span className="font-medium">{selected.level || "—"}</span>
              </div>
              <div>
                <span className="text-gray-500">Platform:</span>{" "}
                <span className="font-medium">{selected.platform || "—"}</span>
              </div>
              <div>
                <span className="text-gray-500">Created:</span>{" "}
                <span className="font-medium">
                  {new Date(selected.createdAt).toLocaleString()}
                </span>
              </div>
            </div>

            <div className="space-y-2">
              <div className="text-gray-500">Description / Goal</div>
              <div className="p-3 rounded-lg bg-gray-50 text-gray-800">
                {selected.type === "OFFER"
                  ? selected.description || "—"
                  : selected.learnGoal || "—"}
              </div>
            </div>
          </div>

          <div className="mt-6">
            <h4 className="font-semibold mb-2">Availability Slots</h4>
            {selected.slots.length === 0 ? (
              <p className="text-sm text-gray-500">No slots added.</p>
            ) : (
              <div className="grid grid-cols-2 gap-3">
                {selected.slots.map((slot) => (
                  <div
                    key={slot.id}
                    className="border rounded-lg p-3 flex items-center justify-between"
                  >
                    <div className="text-sm">
                      <div className="font-medium">{slot.day}</div>
                      <div className="text-gray-600">
                        {slot.timeFrom} - {slot.timeTo}
                      </div>
                    </div>
                    <Badge
                      text={slot.isBooked ? "Booked" : "Free"}
                      tone={slot.isBooked ? "red" : "green"}
                    />
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="mt-6 flex gap-3 justify-end">
            {selected.status === "PENDING" && (
              <button
                onClick={() => action(selected.id, "APPROVE")}
                className="px-4 py-2 rounded-lg bg-blue-600 text-white text-sm"
              >
                Approve Skill
              </button>
            )}

            {selected.status !== "DISABLED" ? (
              <button
                onClick={() => action(selected.id, "DISABLE")}
                className="px-4 py-2 rounded-lg bg-red-600 text-white text-sm"
              >
                Disable Skill
              </button>
            ) : (
              <button
                onClick={() => action(selected.id, "ENABLE")}
                className="px-4 py-2 rounded-lg bg-gray-900 text-white text-sm"
              >
                Enable Skill
              </button>
            )}

            <button
              onClick={() => action(selected.id, "TOGGLE_LISTING")}
              className="px-4 py-2 rounded-lg border text-sm"
            >
              Toggle Public Listing
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

function Badge({
  text,
  tone,
}: {
  text: string;
  tone: "green" | "blue" | "yellow" | "orange" | "red" | "gray";
}) {
  const styles =
    tone === "green"
      ? "bg-green-100 text-green-700"
      : tone === "blue"
      ? "bg-blue-100 text-blue-700"
      : tone === "yellow"
      ? "bg-yellow-100 text-yellow-700"
      : tone === "orange"
      ? "bg-orange-100 text-orange-700"
      : tone === "red"
      ? "bg-red-100 text-red-700"
      : "bg-gray-100 text-gray-700";

  return (
    <span className={`px-2 py-1 rounded text-xs ${styles}`}>{text}</span>
  );
}
