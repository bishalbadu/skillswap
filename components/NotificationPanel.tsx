"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  FaCheckCircle,
  FaTimesCircle,
  FaExchangeAlt,
  FaBell
} from "react-icons/fa";

export default function NotificationPanel({
  open,
  onClose,
  setUnreadCount
}: {
  open: boolean;
  onClose: () => void;
  setUnreadCount: (n: number) => void;
}) {
  const [notifications, setNotifications] = useState<any[]>([]);
  const router = useRouter();

  useEffect(() => {
    if (open) load();
  }, [open]);

  async function load() {
    const res = await fetch("/api/notifications", {
      credentials: "include"
    });

    const data = await res.json();
    setNotifications(data.notifications || []);

    const unread = data.notifications.filter((n: any) => !n.read).length;
    setUnreadCount(unread);
  }

  async function markRead(n: any) {
    await fetch(`/api/notifications/${n.id}`, {
      method: "PATCH",
      credentials: "include"
    });

    setNotifications((prev) =>
      prev.map((x) =>
        x.id === n.id ? { ...x, read: true } : x
      )
    );

    setUnreadCount(
  notifications.filter((x) => !x.read && x.id !== n.id).length
);


    // ✅ REDIRECT AFTER CLICK
    if (n.link) {
      onClose();
      router.push(n.link);
    }
  }

  function getIcon(type: string) {
    switch (type) {
      case "SKILL_APPROVED":
        return <FaCheckCircle className="text-green-600" />;
      case "SKILL_DISABLED":
        return <FaTimesCircle className="text-red-600" />;
      case "SWAP_ACCEPTED":
      case "SWAP_REJECTED":
        return <FaExchangeAlt className="text-blue-600" />;
      case "ACCOUNT_SUSPENDED":
        return <FaTimesCircle className="text-red-600" />;
     case "ACCOUNT_REACTIVATED":
  return <FaCheckCircle className="text-green-600" />;


      default:
        return <FaBell className="text-gray-500" />;
    }
  }

  if (!open) return null;

  return (
    <>
      {/* Dark overlay */}
      <div
        className="fixed inset-0 bg-black/40 z-40"
        onClick={onClose}
      />

      {/* Slide panel */}
      <div
        className="
          fixed top-0 left-72
          w-[380px] h-screen
          bg-white shadow-2xl
          z-50
          animate-slideIn
          flex flex-col
        "
      >
        {/* Header */}
        <div className="p-4 border-b font-semibold text-lg flex justify-between">
          Notifications
          <button onClick={onClose} className="text-gray-500 hover:text-black">
            ✕
          </button>
        </div>

        {/* Body */}
        <div className="overflow-y-auto flex-1">
          {notifications.length === 0 && (
            <p className="p-6 text-gray-400 text-center">
              No notifications
            </p>
          )}

          {notifications.map((n) => (
            <button
              key={n.id}
              onClick={() => markRead(n)}
              className={`
                w-full text-left
                px-4 py-4 border-b
                flex gap-3 items-start
                transition
                ${!n.read ? "bg-[#eef2ea]" : "bg-white"}
                hover:bg-[#dfe7d6]
              `}
            >
              {/* Icon */}
              <div className="mt-1 text-lg">
                {getIcon(n.type)}
              </div>

              {/* Content */}
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-900">
                  {n.message}
                </p>

                <p className="text-xs text-gray-500 mt-1">
                  {new Date(n.createdAt).toLocaleString()}
                </p>
              </div>

              {/* Unread dot */}
              {!n.read && (
                <span className="w-2 h-2 mt-2 bg-red-500 rounded-full" />
              )}
            </button>
          ))}
        </div>
      </div>
    </>
  );
}
