"use client";

import { useEffect, useState } from "react";

export default function AdminSwapsPage() {
  const [swaps, setSwaps] = useState<any[]>([]);

  useEffect(() => {
    load();
  }, []);

  async function load() {
    const res = await fetch("/api/admin/swaps");
    const data = await res.json();
    setSwaps(data.swaps || []);
  }

  async function cancelSwap(id: number) {
    if (!confirm("Force cancel this swap?")) return;

    await fetch(`/api/admin/swaps/${id}/cancel`, {
      method: "PATCH",
    });

    load();
  }

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-6">Swap Requests</h1>

      <div className="bg-white rounded-xl border shadow overflow-auto">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 text-gray-600">
            <tr>
              <th className="p-3 text-left">Requester</th>
              <th className="p-3 text-left">Receiver</th>
              <th className="p-3 text-left">Skill</th>
              <th className="p-3 text-left">Slot</th>
              <th className="p-3 text-left">Status</th>
              <th className="p-3 text-left">Date</th>
              <th className="p-3 text-left">Actions</th>
            </tr>
          </thead>

          <tbody>
            {swaps.map((s) => (
              <tr key={s.id} className="border-t">
                <td className="p-3">
                  {s.requester.firstName} {s.requester.lastName}
                  <div className="text-xs text-gray-500">{s.requester.email}</div>
                </td>

                <td className="p-3">
                  {s.receiver.firstName} {s.receiver.lastName}
                  <div className="text-xs text-gray-500">{s.receiver.email}</div>
                </td>

                <td className="p-3">{s.skill.name}</td>

                <td className="p-3">
                  {s.slot.day} {s.slot.timeFrom}-{s.slot.timeTo}
                </td>

                <td className="p-3">
                  <span
                    className={`px-2 py-1 rounded text-xs
                    ${s.status === "PENDING" && "bg-yellow-100 text-yellow-700"}
                    ${s.status === "ACCEPTED" && "bg-green-100 text-green-700"}
                    ${s.status === "REJECTED" && "bg-red-100 text-red-700"}`}
                  >
                    {s.status}
                  </span>
                </td>

                <td className="p-3">
                  {new Date(s.createdAt).toLocaleDateString()}
                </td>

                <td className="p-3">
                  {s.status === "PENDING" && (
                    <button
                      onClick={() => cancelSwap(s.id)}
                      className="text-red-600 hover:underline"
                    >
                      Cancel
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
