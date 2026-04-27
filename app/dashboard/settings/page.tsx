
// "use client";
// import { useEffect, useMemo, useState } from "react";
// import Link from "next/link";
// import {
//   FaBell,
//   FaCheckCircle,
//   FaClock,
//   FaInfoCircle,
//   FaLock,
//   FaUser,
// } from "react-icons/fa";

// type UserType = {
//   id: number;
//   firstName: string;
//   lastName: string;
//   email: string;
//   membership?: string;
//   premiumUntil?: string | null;
//   completedSwaps?: number;
//   rating?: number;
//   reviewsCount?: number;
// };

// type SettingsType = {
//   notifySwapRequests: boolean;
//   notifyMessages: boolean;
//   notifySessionReminders: boolean;
//   notifySkillApproval: boolean;
//   quietHoursEnabled: boolean;
//   quietHoursFrom: string;
//   quietHoursTo: string;
//   profileVisibility: "public" | "members";
//   showOfferedSkills: boolean;
//   showAvailabilitySlots: boolean;
//   autoReminderBeforeSession: boolean;
// };

// const defaultSettings: SettingsType = {
//   notifySwapRequests: true,
//   notifyMessages: true,
//   notifySessionReminders: true,
//   notifySkillApproval: true,
//   quietHoursEnabled: false,
//   quietHoursFrom: "22:00",
//   quietHoursTo: "07:00",
//   profileVisibility: "public",
//   showOfferedSkills: true,
//   showAvailabilitySlots: true,
//   autoReminderBeforeSession: true,
// };

// function ToggleRow({
//   title,
//   description,
//   checked,
//   onChange,
// }: {
//   title: string;
//   description: string;
//   checked: boolean;
//   onChange: (value: boolean) => void;
// }) {
//   return (
//     <div className="flex items-start justify-between gap-4 rounded-2xl border border-[#dfe8d8] bg-[#fbfcf8] p-4">
//       <div className="pr-2">
//         <h3 className="font-semibold text-[#22301c]">{title}</h3>
//         <p className="mt-1 text-sm leading-6 text-gray-600">{description}</p>
//       </div>

//       <button
//         type="button"
//         onClick={() => onChange(!checked)}
//         aria-pressed={checked}
//         className={`relative mt-1 h-7 w-14 shrink-0 rounded-full transition ${
//           checked ? "bg-[#5f7c50]" : "bg-gray-300"
//         }`}
//       >
//         <span
//           className={`absolute top-1 h-5 w-5 rounded-full bg-white shadow transition ${
//             checked ? "left-8" : "left-1"
//           }`}
//         />
//       </button>
//     </div>
//   );
// }

// function SectionCard({
//   icon,
//   title,
//   description,
//   children,
// }: {
//   icon: React.ReactNode;
//   title: string;
//   description: string;
//   children: React.ReactNode;
// }) {
//   return (
//     <section className="rounded-3xl border border-[#e2eadb] bg-white p-5 shadow-sm sm:p-6">
//       <div className="mb-5 flex items-center gap-3">
//         <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#edf3e7] text-[#4a5e27]">
//           {icon}
//         </div>
//         <div>
//           <h2 className="text-xl font-bold text-[#22301c]">{title}</h2>
//           <p className="text-sm text-gray-600">{description}</p>
//         </div>
//       </div>
//       {children}
//     </section>
//   );
// }

// export default function SettingsPage() {
//   const [user, setUser] = useState<UserType | null>(null);
//   const [settings, setSettings] = useState<SettingsType>(defaultSettings);
//   const [loading, setLoading] = useState(true);
//   const [saving, setSaving] = useState(false);
//   const [message, setMessage] = useState("");

//   const disabledCount = useMemo(() => {
//     return [
//       settings.notifySwapRequests,
//       settings.notifyMessages,
//       settings.notifySessionReminders,
//       settings.notifySkillApproval,
//       settings.autoReminderBeforeSession,
//     ].filter((item) => !item).length;
//   }, [settings]);

//   useEffect(() => {
//     async function loadPage() {
//       try {
//         const [userRes, settingsRes] = await Promise.all([
//           fetch("/api/auth/me", { credentials: "include" }),
//           fetch("/api/settings", { credentials: "include" }),
//         ]);

//         const userData = await userRes.json();
//         setUser(userData.user || null);

//         if (settingsRes.ok) {
//           const settingsData = await settingsRes.json();
//           setSettings({ ...defaultSettings, ...settingsData });
//         }
//       } catch (error) {
//         console.error("Failed to load settings page:", error);
//         setMessage("Could not load settings. Please refresh the page.");
//       } finally {
//         setLoading(false);
//       }
//     }

//     loadPage();
//   }, []);

//   async function handleSave() {
//     try {
//       setSaving(true);
//       setMessage("");

//       const res = await fetch("/api/settings", {
//         method: "PUT",
//         headers: { "Content-Type": "application/json" },
//         credentials: "include",
//         body: JSON.stringify(settings),
//       });

//       const data = await res.json();

//       if (!res.ok) {
//         throw new Error(data.error || "Failed to save settings");
//       }

//       setSettings({ ...defaultSettings, ...data });
//       setMessage("Settings saved successfully.");
//     } catch (error) {
//       console.error("Save failed:", error);
//       setMessage("Could not save settings. Please try again.");
//     } finally {
//       setSaving(false);
//     }
//   }

//   if (loading) {
//     return (
//       <div className="min-h-screen bg-[#f4f5f1] px-6 py-10">
//         <div className="rounded-2xl bg-white p-6 text-lg font-semibold text-[#22301c] shadow-sm">
//           Loading settings...
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen bg-[#f4f5f1] px-4 py-8 font-['Inter'] sm:px-6 lg:px-10">
//       <div className="mb-8 flex flex-col justify-between gap-4 lg:flex-row lg:items-end">
//         <div>
//           <p className="mb-2 text-sm font-semibold uppercase tracking-wide text-[#6f8f5d]">
//             Account controls
//           </p>
//           <h1 className="text-3xl font-bold text-[#22301c]">Settings</h1>
//           <p className="mt-2 max-w-2xl text-gray-600">
//             Manage notification preferences, visibility, and reminder options for your SkillSwap account.
//           </p>
//         </div>

//         <button
//           onClick={handleSave}
//           disabled={saving}
//           className={`rounded-2xl px-6 py-3 font-semibold text-white shadow-sm transition ${
//             saving
//               ? "cursor-not-allowed bg-[#a3b593]"
//               : "bg-[#5f7c50] hover:bg-[#4f6b42]"
//           }`}
//         >
//           {saving ? "Saving..." : "Save Settings"}
//         </button>
//       </div>

//       {message && (
//         <div className="mb-6 flex items-center gap-2 rounded-2xl border border-[#dfe8d8] bg-white p-4 font-medium text-[#4a5e27] shadow-sm">
//           <FaCheckCircle />
//           {message}
//         </div>
//       )}

//       <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
//         <div className="space-y-6 xl:col-span-2">
//           <SectionCard
//             icon={<FaBell />}
//             title="Notifications"
//             description="Choose which important updates you want to receive."
//           >
//             <div className="space-y-4">
//               <ToggleRow
//                 title="Swap Requests"
//                 description="Notify me when another user sends a new swap request."
//                 checked={settings.notifySwapRequests}
//                 onChange={(value) =>
//                   setSettings((prev) => ({ ...prev, notifySwapRequests: value }))
//                 }
//               />
//               <ToggleRow
//                 title="Messages"
//                 description="Notify me when I receive a new chat message."
//                 checked={settings.notifyMessages}
//                 onChange={(value) =>
//                   setSettings((prev) => ({ ...prev, notifyMessages: value }))
//                 }
//               />
//               <ToggleRow
//                 title="Session Reminders"
//                 description="Notify me before accepted or upcoming learning sessions."
//                 checked={settings.notifySessionReminders}
//                 onChange={(value) =>
//                   setSettings((prev) => ({ ...prev, notifySessionReminders: value }))
//                 }
//               />
//               <ToggleRow
//                 title="Skill Approval Updates"
//                 description="Notify me when admin approves or disables one of my offered skills."
//                 checked={settings.notifySkillApproval}
//                 onChange={(value) =>
//                   setSettings((prev) => ({ ...prev, notifySkillApproval: value }))
//                 }
//               />
//             </div>
//           </SectionCard>

//           <SectionCard
//             icon={<FaClock />}
//             title="Quiet Hours & Reminders"
//             description="Reduce unnecessary interruptions during your selected time."
//           >
//             <div className="space-y-4">
//               <ToggleRow
//                 title="Quiet Hours"
//                 description="Keep notifications silent during your preferred rest time."
//                 checked={settings.quietHoursEnabled}
//                 onChange={(value) =>
//                   setSettings((prev) => ({ ...prev, quietHoursEnabled: value }))
//                 }
//               />

//               {settings.quietHoursEnabled && (
//                 <div className="grid grid-cols-1 gap-4 rounded-2xl border border-[#dfe8d8] bg-[#fbfcf8] p-4 sm:grid-cols-2">
//                   <div>
//                     <label className="mb-2 block text-sm font-semibold text-[#22301c]">
//                       From
//                     </label>
//                     <input
//                       type="time"
//                       value={settings.quietHoursFrom}
//                       onChange={(e) =>
//                         setSettings((prev) => ({
//                           ...prev,
//                           quietHoursFrom: e.target.value,
//                         }))
//                       }
//                       className="w-full rounded-xl border border-[#d8e0d0] px-4 py-3 outline-none focus:ring-2 focus:ring-[#91ad80]"
//                     />
//                   </div>
//                   <div>
//                     <label className="mb-2 block text-sm font-semibold text-[#22301c]">
//                       To
//                     </label>
//                     <input
//                       type="time"
//                       value={settings.quietHoursTo}
//                       onChange={(e) =>
//                         setSettings((prev) => ({
//                           ...prev,
//                           quietHoursTo: e.target.value,
//                         }))
//                       }
//                       className="w-full rounded-xl border border-[#d8e0d0] px-4 py-3 outline-none focus:ring-2 focus:ring-[#91ad80]"
//                     />
//                   </div>
//                 </div>
//               )}

//               <ToggleRow
//                 title="Auto Reminder Before Session"
//                 description="Keep this enabled so you do not miss accepted sessions."
//                 checked={settings.autoReminderBeforeSession}
//                 onChange={(value) =>
//                   setSettings((prev) => ({ ...prev, autoReminderBeforeSession: value }))
//                 }
//               />
//             </div>
//           </SectionCard>

//           <SectionCard
//             icon={<FaLock />}
//             title="Privacy & Visibility"
//             description="Control how your profile and offered skills appear to others."
//           >
//             <div className="space-y-4">
//               <div className="rounded-2xl border border-[#dfe8d8] bg-[#fbfcf8] p-4">
//                 <label className="mb-2 block text-sm font-semibold text-[#22301c]">
//                   Profile Visibility
//                 </label>
//                 <select
//                   value={settings.profileVisibility}
//                   onChange={(e) =>
//                     setSettings((prev) => ({
//                       ...prev,
//                       profileVisibility: e.target.value as "public" | "members",
//                     }))
//                   }
//                   className="w-full rounded-xl border border-[#d8e0d0] px-4 py-3 outline-none focus:ring-2 focus:ring-[#91ad80]"
//                 >
//                   <option value="public">Public profile</option>
//                   <option value="members">Only logged-in users</option>
//                 </select>
//               </div>

//               <ToggleRow
//                 title="Show Offered Skills"
//                 description="Display my approved offered skills on my public profile and matching pages."
//                 checked={settings.showOfferedSkills}
//                 onChange={(value) =>
//                   setSettings((prev) => ({ ...prev, showOfferedSkills: value }))
//                 }
//               />

//               <ToggleRow
//                 title="Show Availability Slots"
//                 description="Allow other users to see my open slots for offered skills."
//                 checked={settings.showAvailabilitySlots}
//                 onChange={(value) =>
//                   setSettings((prev) => ({ ...prev, showAvailabilitySlots: value }))
//                 }
//               />
//             </div>
//           </SectionCard>
//         </div>

//         <div className="space-y-6">
//           <SectionCard
//             icon={<FaUser />}
//             title="Account Overview"
//             description="Quick summary of your current account."
//           >
//             {user ? (
//               <div className="space-y-4">
//                 <div className="rounded-2xl border border-[#e8ede3] bg-[#fbfcf8] p-4">
//                   <p className="text-sm text-gray-500">Name</p>
//                   <p className="font-semibold text-[#22301c]">
//                     {user.firstName} {user.lastName}
//                   </p>
//                 </div>
//                 <div className="rounded-2xl border border-[#e8ede3] bg-[#fbfcf8] p-4">
//                   <p className="text-sm text-gray-500">Email</p>
//                   <p className="break-all font-semibold text-[#22301c]">{user.email}</p>
//                 </div>
//                 <div className="grid grid-cols-2 gap-3">
//                   <div className="rounded-2xl border border-[#e8ede3] bg-[#fbfcf8] p-4">
//                     <p className="text-sm text-gray-500">Membership</p>
//                     <p className="font-semibold text-[#22301c]">{user.membership || "FREE"}</p>
//                   </div>
//                   <div className="rounded-2xl border border-[#e8ede3] bg-[#fbfcf8] p-4">
//                     <p className="text-sm text-gray-500">Rating</p>
//                     <p className="font-semibold text-[#22301c]">{user.rating ?? 0} / 5</p>
//                   </div>
//                 </div>
//                 <div className="rounded-2xl border border-[#e8ede3] bg-[#fbfcf8] p-4">
//                   <p className="text-sm text-gray-500">Completed Swaps</p>
//                   <p className="font-semibold text-[#22301c]">{user.completedSwaps ?? 0}</p>
//                 </div>
//                 <Link
//                   href="/dashboard/profile"
//                   className="block w-full rounded-2xl bg-[#edf3e7] px-4 py-3 text-center font-semibold text-[#22301c] transition hover:bg-[#dfead6]"
//                 >
//                   Go to Profile
//                 </Link>
//               </div>
//             ) : (
//               <p className="text-gray-600">Could not load account info.</p>
//             )}
//           </SectionCard>

//           <SectionCard icon={<FaInfoCircle />} title="Setting Status" description="Current preference summary.">
//             <div className="space-y-3 text-sm leading-6 text-gray-600">
//               <p>
//                 {disabledCount === 0
//                   ? "All main notifications are enabled."
//                   : `${disabledCount} main notification option(s) are disabled.`}
//               </p>
//               <p>
//                 Profile is visible to {settings.profileVisibility === "public" ? "everyone" : "logged-in users only"}.
//               </p>
//               <p>Your settings are saved in database and can be used across devices.</p>
//             </div>
//           </SectionCard>
//         </div>
//       </div>
//     </div>
//   );
// }


"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  FaBell,
  FaCheckCircle,
  FaExclamationCircle,
  FaInfoCircle,
  FaUser,
} from "react-icons/fa";

type UserType = {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  membership?: string;
  completedSwaps?: number;
  rating?: number;
  reviewsCount?: number;
  isActive: boolean; 
};

type SettingsType = {
  notifySwapRequests: boolean;
  notifyMessages: boolean;
  notifySessionReminders: boolean;
  notifySkillApproval: boolean;
  autoReminderBeforeSession: boolean;
};

const defaultSettings: SettingsType = {
  notifySwapRequests: true,
  notifyMessages: true,
  notifySessionReminders: true,
  notifySkillApproval: true,
  autoReminderBeforeSession: true,
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
    <div className="flex items-start justify-between gap-4 rounded-xl border border-[#E4E8DD] bg-[#FAFBF7] p-4">
      <div>
        <h3 className="font-semibold text-[#243124]">{title}</h3>
        <p className="mt-1 text-sm text-gray-600">{description}</p>
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
  const [settings, setSettings] = useState<SettingsType>(defaultSettings);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");
  const [showDeactivateModal, setShowDeactivateModal] = useState(false);
  

  useEffect(() => {
    loadPageData();
  }, []);

  async function loadPageData() {
    try {
      setLoading(true);

      const [userRes, settingsRes] = await Promise.all([
        fetch("/api/auth/me", { credentials: "include" }),
        fetch("/api/settings", { credentials: "include" }),
      ]);

      const userData = await userRes.json();
      const settingsData = await settingsRes.json();

      setUser(userData.user || null);

      if (settingsRes.ok && settingsData.settings) {
        setSettings({
          ...defaultSettings,
          ...settingsData.settings,
        });
      }
    } catch (err) {
      console.error(err);
      setError("Failed to load settings.");
    } finally {
      setLoading(false);
    }
  }

  async function handleSave() {
    try {
      setSaving(true);
      setSuccess("");
      setError("");

      const res = await fetch("/api/settings", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(settings),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to save settings");
      }

      setSettings({
        ...defaultSettings,
        ...data.settings,
      });

      setSuccess("Settings saved successfully.");
    } catch (err) {
      console.error(err);
      setError("Could not save settings.");
    } finally {
      setSaving(false);
    }
  }

  async function confirmDeactivate() {
  try {
    setShowDeactivateModal(false);

    const res = await fetch("/api/users/deactivate", {
      method: "POST",
      credentials: "include",
    });

    const data = await res.json();

    if (!res.ok) {
      setError(data.error || "Could not deactivate account.");
      return;
    }

    setSuccess("Account deactivated successfully.");
    window.location.reload();
  } catch (err) {
    console.error(err);
    setError("Failed to deactivate account.");
  }
}

async function handleReactivate() {
  try {
    const res = await fetch("/api/users/reactivate", {
      method: "POST",
      credentials: "include",
    });

    const data = await res.json();

    if (!res.ok) {
      alert(data.error);
      return;
    }

    alert("Account reactivated successfully.");
    window.location.reload();
  } catch (err) {
    console.error(err);
    alert("Failed to reactivate.");
  }
}

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F4F2EC] px-6 py-10">
        <p className="text-lg font-semibold text-[#2f3e2c]">
          Loading settings...
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F4F2EC] px-4 py-8 sm:px-6 lg:px-10">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-[#2f3e2c]">Settings</h1>
        <p className="mt-2 text-gray-600">
          Manage your account notifications and session preferences.
        </p>
      </div>

      {(success || error) && (
        <div
          className={`mb-6 flex items-center gap-3 rounded-xl border px-4 py-3 text-sm font-medium ${
            success
              ? "border-green-200 bg-green-50 text-green-700"
              : "border-red-200 bg-red-50 text-red-700"
          }`}
        >
          {success ? <FaCheckCircle /> : <FaExclamationCircle />}
          {success || error}
        </div>
      )}

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
        <div className="space-y-6 xl:col-span-2">
          <section className="rounded-2xl border border-[#E4E8DD] bg-white p-6 shadow-sm">
            <div className="mb-5 flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#e8f1e4] text-[#7e9c6c]">
                <FaBell />
              </div>
              <div>
                <h2 className="text-xl font-bold text-[#243124]">
                  Notifications
                </h2>
                <p className="text-sm text-gray-600">
                  Choose which updates you want to receive.
                </p>
              </div>
            </div>

            <div className="space-y-4">
              <ToggleRow
                title="Swap Requests"
                description="Notify me when someone sends a new swap request."
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
                description="Notify me when I receive a new chat message."
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
                description="Notify me before upcoming learning sessions."
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
                description="Notify me when admin approves or reviews my offered skill."
                checked={settings.notifySkillApproval}
                onChange={(value) =>
                  setSettings((prev) => ({
                    ...prev,
                    notifySkillApproval: value,
                  }))
                }
              />
            </div>
          </section>

          <section className="rounded-2xl border border-[#E4E8DD] bg-white p-6 shadow-sm">
            <div className="mb-5 flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#e8f1e4] text-[#7e9c6c]">
                <FaInfoCircle />
              </div>
              <div>
                <h2 className="text-xl font-bold text-[#243124]">
                  Session Preference
                </h2>
                <p className="text-sm text-gray-600">
                  Keep useful session controls simple.
                </p>
              </div>
            </div>

            <ToggleRow
              title="Auto Reminder Before Session"
              description="Keep reminders enabled so I do not miss accepted sessions."
              checked={settings.autoReminderBeforeSession}
              onChange={(value) =>
                setSettings((prev) => ({
                  ...prev,
                  autoReminderBeforeSession: value,
                }))
              }
            />
          </section>

          <button
            onClick={handleSave}
            disabled={saving}
            className={`rounded-xl px-6 py-3 font-semibold text-white shadow-sm transition ${
              saving
                ? "cursor-not-allowed bg-[#7DA3A3]"
                : "bg-[#7e9c6c] hover:bg-[#6f8d5e]"
            }`}
          >
            {saving ? "Saving..." : "Save Settings"}
          </button>
        </div>

        <div className="space-y-6">
          <section className="rounded-2xl border border-[#E4E8DD] bg-white p-6 shadow-sm">
            <div className="mb-5 flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#e8f1e4] text-[#7e9c6c]">
                <FaUser />
              </div>
              <div>
                <h2 className="text-xl font-bold text-[#243124]">
                  Account Overview
                </h2>
                <p className="text-sm text-gray-600">
                  Your current SkillSwap account.
                </p>
              </div>
            </div>

            {user ? (
              <div className="space-y-4">
                <InfoBox label="Name" value={`${user.firstName} ${user.lastName}`} />
                <InfoBox label="Email" value={user.email} />
                <InfoBox label="Membership" value={user.membership || "FREE"} />
                <InfoBox
                  label="Completed Swaps"
                  value={String(user.completedSwaps ?? 0)}
                />
                <InfoBox label="Rating" value={`${user.rating ?? 0} / 5`} />

                <Link
                  href="/dashboard/profile"
                 className="block w-full rounded-xl bg-[#e8f1e4] px-4 py-3 text-center font-semibold text-[#2f3e2c] transition hover:bg-[#d9e7d2]">
                  Go to Profile
                </Link>
              </div>
            ) : (
              <p className="text-sm text-gray-600">
                Could not load account information.
              </p>
            )}
          </section>

          {user?.isActive ? (
  <section className="rounded-2xl border border-red-200 bg-red-50 p-6 shadow-sm">
    <h2 className="mb-2 text-lg font-bold text-red-700">
      Deactivate Account
    </h2>

    <p className="text-sm text-red-600 mb-4">
      You can temporarily deactivate your account. You won’t appear in searches or receive new requests.
      You can reactivate anytime.
    </p>

    <button
    onClick={() => setShowDeactivateModal(true)}
      className="rounded-xl px-5 py-2 text-sm font-semibold text-white bg-red-600 hover:bg-red-700 transition"
    >
      Deactivate My Account
    </button>
  </section>
) : (
  <section className="rounded-2xl border border-green-200 bg-green-50 p-6 shadow-sm">
    <h2 className="mb-2 text-lg font-bold text-green-700">
      Reactivate Account
    </h2>

    <p className="text-sm text-green-600 mb-4">
      Your account is currently deactivated. Reactivate to start using SkillSwap again.
    </p>

    <button
      onClick={handleReactivate}
      className="rounded-xl px-5 py-2 text-sm font-semibold text-white bg-[#7e9c6c] hover:bg-[#6f8d5e] transition"
    >
      Reactivate My Account
    </button>
  </section>
  

)}


          <section className="rounded-2xl border border-[#E4E8DD] bg-white p-6 shadow-sm">
            <h2 className="mb-2 text-lg font-bold text-[#243124]">Note</h2>
           <p className="text-sm leading-6 text-gray-600">
  Your preferences are securely saved to your account. They’ll stay the same across devices and after you log in again.
</p>
          </section>
        </div>
      </div>

      {showDeactivateModal && (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
    <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl">
      <h2 className="text-xl font-bold text-[#243124]">
        Deactivate Account?
      </h2>

      <p className="mt-3 text-sm leading-6 text-gray-600">
        Are you sure you want to deactivate your account? Your profile will be
        hidden and you will not be able to use most SkillSwap features until you
        reactivate it.
      </p>

      <div className="mt-6 flex justify-end gap-3">
        <button
          onClick={() => setShowDeactivateModal(false)}
          className="rounded-xl border border-[#E4E8DD] px-5 py-2 text-sm font-semibold text-[#2f3e2c] hover:bg-[#F4F2EC]"
        >
          Cancel
        </button>

        <button
          onClick={confirmDeactivate}
          className="rounded-xl bg-red-600 px-5 py-2 text-sm font-semibold text-white hover:bg-red-700"
        >
          Yes, Deactivate
        </button>
      </div>
    </div>
  </div>
)}
    </div>
  );
}

function InfoBox({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-[#E4E8DD] bg-[#FAFBF7] p-4">
      <p className="text-sm text-gray-500">{label}</p>
      <p className="break-all font-semibold text-[#243124]">{value}</p>
    </div>
  );
}