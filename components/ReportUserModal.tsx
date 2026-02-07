"use client";

import { useState } from "react";

export default function ReportUserModal({
  open,
  reportedUserId,
  onClose,
}: {
  open: boolean;
  reportedUserId: number;
  onClose: () => void;
}) {
  const [reason, setReason] = useState("SCAM");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  if (!open) return null;

  async function submitReport() {
    setLoading(true);

    const res = await fetch("/api/report", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({
        reportedUserId,
        reason,
        message,
      }),
    });

    setLoading(false);

    if (!res.ok) {
      alert("Failed to submit report");
      return;
    }

    alert("Report submitted. Admin will review it.");
    setMessage("");
    onClose();
  }

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl p-6 w-full max-w-md space-y-4">
        <h2 className="text-lg font-semibold text-red-600">
          🚨 Report User
        </h2>

        <select
          value={reason}
          onChange={(e) => setReason(e.target.value)}
          className="w-full border rounded p-2"
        >
          <option value="FAKE_ACCOUNT">Fake Account</option>
          <option value="SCAM">Scam</option>
          <option value="HARASSMENT">Harassment</option>
          <option value="ILLEGAL_ACTIVITY">Illegal Activity</option>
          <option value="OTHER">Other</option>
        </select>

        <textarea
          placeholder="Describe the issue..."
          className="w-full border rounded p-2 text-sm"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        />

        <div className="flex justify-end gap-3">
          <button onClick={onClose} className="border px-4 py-2 rounded">
            Cancel
          </button>
          <button
            onClick={submitReport}
            disabled={loading}
            className="bg-red-600 text-white px-4 py-2 rounded"
          >
            {loading ? "Submitting..." : "Submit Report"}
          </button>
        </div>
      </div>
    </div>
  );
}
