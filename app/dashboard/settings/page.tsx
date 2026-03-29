"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  FaBell,
  FaLock,
  FaCog,
  FaUser,
  FaCheckCircle,
  FaInfoCircle,
} from "react-icons/fa";

type UserType = {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  membership?: string;
  premiumUntil?: string | null;
  completedSwaps?: number;
  rating?: number;
  reviewsCount?: number;
};

type SettingsType = {
  notifySwapRequests: boolean;
  notifyMessages: boolean;
  notifySessionReminders: boolean;
  notifySkillApproval: boolean;

  quietHoursEnabled: boolean;
  quietHoursFrom: string;
  quietHoursTo: string;

  profileVisibility: "public" | "members";
  showOfferedSkills: boolean;
  showAvailabilitySlots: boolean;

  maxActiveSwaps: string;
  autoReminderBeforeSession: boolean;
  autoArchiveCompletedChats: boolean;
};

const defaultSettings: SettingsType = {
  notifySwapRequests: true,
  notifyMessages: true,
  notifySessionReminders: true,
  notifySkillApproval: true,

  quietHoursEnabled: false,
  quietHoursFrom: "22:00",
  quietHoursTo: "07:00",

  profileVisibility: "public",
  showOfferedSkills: true,
  showAvailabilitySlots: true,

  maxActiveSwaps: "3",
  autoReminderBeforeSession: true,
  autoArchiveCompletedChats: false,
};

function ToggleRow({
  title,
  description,
  checked,
  onChange,
}: {
  title: string;
  description: string;
  checked: boolean;
  onChange: (value: boolean) => void;
}) {
  return (
    <div className="flex items-start justify-between gap-4 rounded-xl border border-[#e8ede3] bg-[#f9fbf7] p-4">
      <div>
        <h3 className="font-semibold text-[#2c3a21]">{title}</h3>
        <p className="text-sm text-gray-600 mt-1">{description}</p>
      </div>

      <button
        type="button"
        onClick={() => onChange(!checked)}
        className={`relative h-7 w-14 rounded-full transition ${
          checked ? "bg-[#7e9c6c]" : "bg-gray-300"
        }`}
      >
        <span
          className={`absolute top-1 h-5 w-5 rounded-full bg-white transition ${
            checked ? "left-8" : "left-1"
          }`}
        />
      </button>
    </div>
  );
}

export default function SettingsPage() {
  const [user, setUser] = useState<UserType | null>(null);
  const [loading, setLoading] = useState(true);

  const [settings, setSettings] = useState<SettingsType>(defaultSettings);

  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    loadUser();
    loadLocalSettings();
  }, []);

  async function loadUser() {
    try {
      const res = await fetch("/api/auth/me", {
        credentials: "include",
      });
      const data = await res.json();
      setUser(data.user || null);
    } catch (error) {
      console.error("Failed to load user:", error);
    } finally {
      setLoading(false);
    }
  }

  function loadLocalSettings() {
    try {
      const raw = localStorage.getItem("skillswap-settings");
      if (!raw) return;

      const parsed = JSON.parse(raw);
      setSettings({ ...defaultSettings, ...parsed });
    } catch (error) {
      console.error("Failed to load settings:", error);
    }
  }

  async function handleSave() {
    try {
      setSaving(true);
      setSaved(false);

      localStorage.setItem("skillswap-settings", JSON.stringify(settings));

      setTimeout(() => {
        setSaved(true);
        setSaving(false);
      }, 700);
    } catch (error) {
      console.error("Save failed:", error);
      setSaving(false);
      alert("Could not save settings");
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-[#f4f5f1] px-6 py-10">
        <div className="text-xl text-[#2c3a21] font-semibold">
          Loading settings...
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f4f5f1] px-4 sm:px-6 lg:px-10 py-8 font-['Inter']">
      {/* HEADER */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-[#2c3a21]">Settings</h1>
        <p className="text-gray-600 mt-2">
          Manage your SkillSwap account preferences, privacy, and useful platform controls.
        </p>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* LEFT SIDE */}
        <div className="xl:col-span-2 space-y-6">
          {/* NOTIFICATIONS */}
          <section className="bg-white rounded-2xl shadow-sm border border-[#e7ecdf] p-6">
            <div className="flex items-center gap-3 mb-5">
              <div className="h-10 w-10 rounded-full bg-[#edf3e7] flex items-center justify-center text-[#4a5e27]">
                <FaBell />
              </div>
              <div>
                <h2 className="text-xl font-bold text-[#2c3a21]">Notifications</h2>
                <p className="text-sm text-gray-600">
                  Control which platform updates you want to receive.
                </p>
              </div>
            </div>

            <div className="space-y-4">
              <ToggleRow
                title="Swap Requests"
                description="Get notified when someone sends you a new swap request."
                checked={settings.notifySwapRequests}
                onChange={(value) =>
                  setSettings((prev) => ({
                    ...prev,
                    notifySwapRequests: value,
                  }))
                }
              />

              <ToggleRow
                title="Messages"
                description="Receive alerts when you get a new chat message."
                checked={settings.notifyMessages}
                onChange={(value) =>
                  setSettings((prev) => ({
                    ...prev,
                    notifyMessages: value,
                  }))
                }
              />

              <ToggleRow
                title="Session Reminders"
                description="Get reminders before your upcoming learning sessions."
                checked={settings.notifySessionReminders}
                onChange={(value) =>
                  setSettings((prev) => ({
                    ...prev,
                    notifySessionReminders: value,
                  }))
                }
              />

              <ToggleRow
                title="Skill Approval Updates"
                description="Get informed when your offered skills are approved or reviewed by admin."
                checked={settings.notifySkillApproval}
                onChange={(value) =>
                  setSettings((prev) => ({
                    ...prev,
                    notifySkillApproval: value,
                  }))
                }
              />

              <div className="rounded-xl border border-[#e8ede3] bg-[#f9fbf7] p-4">
                <div className="flex items-start justify-between gap-4 mb-4">
                  <div>
                    <h3 className="font-semibold text-[#2c3a21]">Quiet Hours</h3>
                    <p className="text-sm text-gray-600 mt-1">
                      Reduce interruptions during your selected time period.
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={() =>
                      setSettings((prev) => ({
                        ...prev,
                        quietHoursEnabled: !prev.quietHoursEnabled,
                      }))
                    }
                    className={`relative h-7 w-14 rounded-full transition ${
                      settings.quietHoursEnabled ? "bg-[#7e9c6c]" : "bg-gray-300"
                    }`}
                  >
                    <span
                      className={`absolute top-1 h-5 w-5 rounded-full bg-white transition ${
                        settings.quietHoursEnabled ? "left-8" : "left-1"
                      }`}
                    />
                  </button>
                </div>

                {settings.quietHoursEnabled && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-2">
                    <div>
                      <label className="block text-sm font-medium text-[#2c3a21] mb-2">
                        From
                      </label>
                      <input
                        type="time"
                        value={settings.quietHoursFrom}
                        onChange={(e) =>
                          setSettings((prev) => ({
                            ...prev,
                            quietHoursFrom: e.target.value,
                          }))
                        }
                        className="w-full border border-[#d8e0d0] rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-[#91ad80]"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-[#2c3a21] mb-2">
                        To
                      </label>
                      <input
                        type="time"
                        value={settings.quietHoursTo}
                        onChange={(e) =>
                          setSettings((prev) => ({
                            ...prev,
                            quietHoursTo: e.target.value,
                          }))
                        }
                        className="w-full border border-[#d8e0d0] rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-[#91ad80]"
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>
          </section>

          {/* PRIVACY */}
          <section className="bg-white rounded-2xl shadow-sm border border-[#e7ecdf] p-6">
            <div className="flex items-center gap-3 mb-5">
              <div className="h-10 w-10 rounded-full bg-[#edf3e7] flex items-center justify-center text-[#4a5e27]">
                <FaLock />
              </div>
              <div>
                <h2 className="text-xl font-bold text-[#2c3a21]">Privacy & Visibility</h2>
                <p className="text-sm text-gray-600">
                  Choose how much of your profile and activity should be visible.
                </p>
              </div>
            </div>

            <div className="space-y-5">
              <div className="rounded-xl border border-[#e8ede3] bg-[#f9fbf7] p-4">
                <label className="block text-sm font-medium text-[#2c3a21] mb-2">
                  Profile Visibility
                </label>
                <select
                  value={settings.profileVisibility}
                  onChange={(e) =>
                    setSettings((prev) => ({
                      ...prev,
                      profileVisibility: e.target.value as "public" | "members",
                    }))
                  }
                  className="w-full border border-[#d8e0d0] rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-[#91ad80]"
                >
                  <option value="public">Public</option>
                  <option value="members">Only Logged-in Users</option>
                </select>
              </div>

              <ToggleRow
                title="Show Offered Skills"
                description="Display the skills you are offering on your profile."
                checked={settings.showOfferedSkills}
                onChange={(value) =>
                  setSettings((prev) => ({
                    ...prev,
                    showOfferedSkills: value,
                  }))
                }
              />

              <ToggleRow
                title="Show Availability Slots"
                description="Let others see the time slots you have made available."
                checked={settings.showAvailabilitySlots}
                onChange={(value) =>
                  setSettings((prev) => ({
                    ...prev,
                    showAvailabilitySlots: value,
                  }))
                }
              />
            </div>
          </section>

          {/* SKILLSWAP CONTROLS */}
          <section className="bg-white rounded-2xl shadow-sm border border-[#e7ecdf] p-6">
            <div className="flex items-center gap-3 mb-5">
              <div className="h-10 w-10 rounded-full bg-[#edf3e7] flex items-center justify-center text-[#4a5e27]">
                <FaCog />
              </div>
              <div>
                <h2 className="text-xl font-bold text-[#2c3a21]">SkillSwap Controls</h2>
                <p className="text-sm text-gray-600">
                  Small platform settings that make your experience cleaner and more manageable.
                </p>
              </div>
            </div>

            <div className="space-y-5">
              <div className="rounded-xl border border-[#e8ede3] bg-[#f9fbf7] p-4">
                <label className="block text-sm font-medium text-[#2c3a21] mb-2">
                  Max Active Swaps
                </label>
                <select
                  value={settings.maxActiveSwaps}
                  onChange={(e) =>
                    setSettings((prev) => ({
                      ...prev,
                      maxActiveSwaps: e.target.value,
                    }))
                  }
                  className="w-full border border-[#d8e0d0] rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-[#91ad80]"
                >
                  <option value="1">1 active swap</option>
                  <option value="3">3 active swaps</option>
                  <option value="5">5 active swaps</option>
                  <option value="unlimited">Unlimited</option>
                </select>
              </div>

              <ToggleRow
                title="Auto Reminder Before Session"
                description="Keep reminders enabled so you do not miss accepted sessions."
                checked={settings.autoReminderBeforeSession}
                onChange={(value) =>
                  setSettings((prev) => ({
                    ...prev,
                    autoReminderBeforeSession: value,
                  }))
                }
              />

              <ToggleRow
                title="Auto Archive Completed Chats"
                description="Move completed session chats into a cleaner state after the session is done."
                checked={settings.autoArchiveCompletedChats}
                onChange={(value) =>
                  setSettings((prev) => ({
                    ...prev,
                    autoArchiveCompletedChats: value,
                  }))
                }
              />
            </div>
          </section>

          {/* SAVE BUTTON */}
          <div className="flex flex-wrap items-center gap-4">
            <button
              onClick={handleSave}
              disabled={saving}
              className={`px-6 py-3 rounded-xl font-semibold text-white shadow-sm transition ${
                saving
                  ? "bg-[#a3b593] cursor-not-allowed"
                  : "bg-[#6f8f5d] hover:bg-[#5f7c50]"
              }`}
            >
              {saving ? "Saving..." : "Save Settings"}
            </button>

            {saved && (
              <div className="flex items-center gap-2 text-[#4a5e27] font-medium">
                <FaCheckCircle />
                Settings saved successfully
              </div>
            )}
          </div>
        </div>

        {/* RIGHT SIDE */}
        <div className="space-y-6">
          {/* ACCOUNT OVERVIEW */}
          <section className="bg-white rounded-2xl shadow-sm border border-[#e7ecdf] p-6">
            <div className="flex items-center gap-3 mb-5">
              <div className="h-10 w-10 rounded-full bg-[#edf3e7] flex items-center justify-center text-[#4a5e27]">
                <FaUser />
              </div>
              <div>
                <h2 className="text-xl font-bold text-[#2c3a21]">Account Overview</h2>
                <p className="text-sm text-gray-600">
                  Quick summary of your current account.
                </p>
              </div>
            </div>

            {user ? (
              <div className="space-y-4">
                <div className="rounded-xl bg-[#f9fbf7] border border-[#e8ede3] p-4">
                  <p className="text-sm text-gray-500">Name</p>
                  <p className="font-semibold text-[#2c3a21]">
                    {user.firstName} {user.lastName}
                  </p>
                </div>

                <div className="rounded-xl bg-[#f9fbf7] border border-[#e8ede3] p-4">
                  <p className="text-sm text-gray-500">Email</p>
                  <p className="font-semibold text-[#2c3a21] break-all">
                    {user.email}
                  </p>
                </div>

                <div className="rounded-xl bg-[#f9fbf7] border border-[#e8ede3] p-4">
                  <p className="text-sm text-gray-500">Membership</p>
                  <p className="font-semibold text-[#2c3a21]">
                    {user.membership || "FREE"}
                  </p>
                </div>

                <div className="rounded-xl bg-[#f9fbf7] border border-[#e8ede3] p-4">
                  <p className="text-sm text-gray-500">Completed Swaps</p>
                  <p className="font-semibold text-[#2c3a21]">
                    {user.completedSwaps ?? 0}
                  </p>
                </div>

                <div className="rounded-xl bg-[#f9fbf7] border border-[#e8ede3] p-4">
                  <p className="text-sm text-gray-500">Rating</p>
                  <p className="font-semibold text-[#2c3a21]">
                    {user.rating ?? 0} / 5
                  </p>
                </div>

                <Link
                  href="/dashboard/profile"
                  className="block w-full text-center rounded-xl bg-[#edf3e7] hover:bg-[#dfead6] text-[#2c3a21] font-semibold px-4 py-3 transition"
                >
                  Go to Profile
                </Link>
              </div>
            ) : (
              <p className="text-gray-600">Could not load account info.</p>
            )}
          </section>

          {/* INFO CARD */}
          <section className="bg-white rounded-2xl shadow-sm border border-[#e7ecdf] p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="h-10 w-10 rounded-full bg-[#edf3e7] flex items-center justify-center text-[#4a5e27]">
                <FaInfoCircle />
              </div>
              <div>
                <h2 className="text-lg font-bold text-[#2c3a21]">Note</h2>
              </div>
            </div>

            <p className="text-sm text-gray-600 leading-6">
              This version saves settings locally in the browser for now.
              Later, you can connect these settings to Prisma and database APIs
              so they stay saved permanently for each user account.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}