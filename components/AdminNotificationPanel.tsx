"use client";

import { useEffect, useState } from "react";
import { FiAlertTriangle, FiUser, FiFileText } from "react-icons/fi";

type Notification = {
  id: number;
  title: string;
  message: string;
  type?: string;
  link?: string;
};

type Props = {
  open: boolean;
  onClose: () => void;
  setUnreadCount?: (n: number) => void;
};

export default function AdminNotificationPanel({
  open,
  onClose,
  setUnreadCount,
}: Props) {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);

  /* ================= LOAD ADMIN NOTIFICATIONS ================= */
  useEffect(() => {
    if (!open) return;

    (async () => {
      try {
        setLoading(true);

        const res = await fetch("/api/admin/notifications", {
          credentials: "include",
        });

        const data = await res.json();

        setNotifications(data.notifications || []);

        if (setUnreadCount) {
          setUnreadCount(data.unreadCount || 0);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    })();
  }, [open]);

  if (!open) return null;

  /* ================= ICON BASED ON TYPE ================= */
  function getIcon(type?: string) {
    switch (type) {
      case "REPORT":
        return <FiAlertTriangle className="text-red-500" />;
      case "USER":
        return <FiUser className="text-yellow-500" />;
      default:
        return <FiFileText className="text-gray-500" />;
    }
  }
return (
  <div className="fixed inset-0 z-50 flex">

    {/* OVERLAY (only on content, not sidebar) */}
    <div
      className="fixed top-0 left-[256px] right-0 bottom-0 bg-black/40 backdrop-blur-sm z-40"
      onClick={onClose}
    />

    {/* PANEL (opens from left, after sidebar) */}
    <div className="fixed top-0 left-[256px] h-full w-[360px] bg-white shadow-2xl flex flex-col z-50">

      {/* HEADER */}
      <div className="flex items-center justify-between px-5 py-4 border-b">
        <h2 className="text-lg font-semibold text-[#243124]">
          Admin Alerts
        </h2>

        <button
          onClick={onClose}
          className="text-gray-400 hover:text-black text-xl"
        >
          ✕
        </button>
      </div>

      {/* CONTENT */}
      <div className="flex-1 overflow-y-auto">

        {loading ? (
          <p className="p-4 text-sm text-gray-500">
            Loading alerts...
          </p>
        ) : notifications.length === 0 ? (
          <p className="p-4 text-sm text-gray-500">
            No new alerts.
          </p>
        ) : (
          notifications.map((n) => (
            <div
              key={n.id}
              onClick={() => {
                if (n.link) window.location.href = n.link;
              }}
              className="flex items-start gap-3 px-5 py-4 border-b hover:bg-[#f6f7f3] cursor-pointer transition"
            >
              {/* ICON */}
              <div className="mt-1 text-lg">
                {getIcon(n.type)}
              </div>

              {/* TEXT */}
              <div className="flex-1">
                <p className="text-sm font-medium text-[#243124] leading-tight">
                  {n.title}
                </p>
                <p className="text-xs text-gray-600 mt-1">
                  {n.message}
                </p>
              </div>

              {/* UNREAD DOT */}
              <span className="w-2 h-2 bg-red-500 rounded-full mt-2" />
            </div>
          ))
        )}

      </div>
    </div>
  </div>


  );
}