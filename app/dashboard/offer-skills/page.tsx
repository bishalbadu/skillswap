"use client";

import { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";

export default function OfferSkillsPage() {

  const searchParams = useSearchParams();
  const skillFromProfile = searchParams?.get("skill");
  const router = useRouter();

  const editId = searchParams?.get("edit"); //  FIX

  const [teachSkill, setTeachSkill] = useState("");
  const [teachLevel, setTeachLevel] = useState("Intermediate");
  const [teachDesc, setTeachDesc] = useState("");

  const [sessionLength, setSessionLength] = useState("60");

  const [selectedDate, setSelectedDate] = useState("");
  const [fromTime, setFromTime] = useState("");
  const [toTime, setToTime] = useState("");

  const [platform, setPlatform] = useState("Google Meet");
  const [publicListing, setPublicListing] = useState(true);

  const [busy, setBusy] = useState(false);

  const timeOptions = ["30", "60", "90"];
  const [skillStatus, setSkillStatus] = useState("");

  const [mySkills, setMySkills] = useState<any[]>([]);
  const [proofs, setProofs] = useState<
  { url: string; type: "IMAGE" | "VIDEO"; name: string }[]
>([]);

const [toast, setToast] = useState<{
  message: string;
  type: "success" | "error" | "info";
} | null>(null);

const [uploading, setUploading] = useState(false);

  /* =====================================================
     LOAD ALL OFFERED SKILLS
  ===================================================== */

  useEffect(() => {
    loadAllSkills();
  }, []);

  async function loadAllSkills() {

    const res = await fetch("/api/skills/offer", {
      credentials: "include",
    });

    const data = await res.json();

    if (data.skills) {
      setMySkills(data.skills);
    }

  }

  useEffect(() => {
  if (skillFromProfile && !editId) {
    setTeachSkill(skillFromProfile);
  }
}, [skillFromProfile, editId]);


  /* =====================================================
     LOAD EXISTING SKILL (EDIT MODE)
  ===================================================== */

  useEffect(() => {

    if (editId) {
      loadSkill();
    }

  }, [editId]);

  async function loadSkill() {

    const res = await fetch(`/api/skills/offer?id=${editId}`, {
      credentials: "include",
    });


    const data = await res.json();

    if (!data.skill) return;

    const s = data.skill;

    setTeachSkill(s.name);
    setTeachLevel(s.level || "Intermediate");
    setTeachDesc(s.description || "");
    setSessionLength(String(s.sessionLength || "60"));
    setPlatform(s.platform || "Google Meet");
    setPublicListing(s.publicListing ?? true);
    setSkillStatus(s.status);
    

    if (s.slots && s.slots.length > 0) {

      const firstSlot = s.slots[0];

      setSelectedDate(firstSlot.date.split("T")[0]);
      setFromTime(firstSlot.timeFrom);
      setToTime(firstSlot.timeTo);

    }

  }

  /* =====================================================
     AUTO SET END TIME
  ===================================================== */

  function handleFromTimeChange(value: string) {

    setFromTime(value);

    if (!value) return;

    const minutes = Number(sessionLength);

    const start = new Date(`1970-01-01T${value}`);
    const end = new Date(start.getTime() + minutes * 60000);

    setToTime(end.toTimeString().slice(0, 5));

  }

async function handleUpload(e: any) {
  const files = Array.from(e.target.files || []) as File[];
  if (files.length === 0) return;

//  Count existing proofs
const existingImages = proofs.filter(p => p.type === "IMAGE").length;
const existingVideos = proofs.filter(p => p.type === "VIDEO").length;

//  Count new files
let newImages = 0;
let newVideos = 0;

//  First pass: count types
for (const file of files) {
  if (file.type.startsWith("image")) newImages++;
  else if (file.type.startsWith("video")) newVideos++;
}

//  TOTAL LIMIT (max 3)
if (proofs.length + files.length > 3) {
  showToast("Maximum 3 files allowed to upload (2 files + 1 video)","info");
  return;
}
//  VIDEO LIMIT (max 1)
if (existingVideos + newVideos > 1) {
  showToast("Only 1 video allowed","error");
  return;
}

setUploading(true);

 for (const file of files) {

if (!file.type.startsWith("image") && !file.type.startsWith("video")) {
 showToast(`${file.name} is not supported. Only images/videos allowed.`, "error");

  const input = document.getElementById("fileInput") as HTMLInputElement;
  if (input) input.value = "";

  setUploading(false); 
  return;
}

  const MAX_SIZE = 10 * 1024 * 1024;

if (file.size > MAX_SIZE) {
  showToast(`${file.name} is too large (max 10MB)`,"error");
  continue;
}

    const form = new FormData();
    form.append("file", file);

    const res = await fetch("/api/upload", {
      method: "POST",
      body: form,
      credentials: "include",
    });

    const data = await res.json();

    if (!res.ok) {
      showToast("Upload failed", "error");
      continue;
    }

    const type = file.type.startsWith("video") ? "VIDEO" : "IMAGE";
    setProofs((prev) => [
  ...prev,
  { url: data.url, type, name: file.name } 
]);
  }

  setUploading(false); 

  const input = document.getElementById("fileInput") as HTMLInputElement;
if (input) input.value = "";

}



function resetForm() {
  setTeachSkill("");
  setTeachLevel("Intermediate");
  setTeachDesc("");
  setSessionLength("60");
  setSelectedDate("");
  setFromTime("");
  setToTime("");
  setPlatform("Google Meet");
  setPublicListing(true);
  setProofs([]);
}

function showToast(message: string, type: "success" | "error" | "info" = "info") {
  setToast({ message, type });

  setTimeout(() => {
    setToast(null);
  }, 3000); // disappears after 3 sec
}
  /* =====================================================
     SAVE SKILL
  ===================================================== */

  async function saveSkill() {

    if (!teachSkill.trim()) {
     showToast("Please enter a skill.", "error");
      return;
    }

    if (!selectedDate || !fromTime || !toTime) {
      showToast("Please select date and time.", "error");
      return;
    }

    const diffMinutes =
      (new Date(`1970-01-01T${toTime}`).getTime() -
        new Date(`1970-01-01T${fromTime}`).getTime()) / 60000;

    if (diffMinutes !== Number(sessionLength)) {
      showToast("Time must match session length exactly.","error");
      return;
    }
if (!editId && proofs.length === 0) {
 showToast("Please upload at least one proof.","error");
  return;
}
    setBusy(true);

    const res = await fetch("/api/skills/offer", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({
  teachSkill,
  teachLevel,
  teachDesc,
  sessionLength,
  selectedDate,
  fromTime,
  toTime,
  platform,
  publicListing,
  editId,
  proofs
}),
    });

    const data = await res.json();

    setBusy(false);

   if (!res.ok) {

  let message = "Something went wrong";

  if (data.error === "CANNOT_CREATE_PAST_SLOT") {
    message = "You cannot create a slot in the past.";
  } else if (data.error === "TIME_MUST_EQUAL_SESSION_LENGTH") {
    message = "Session time does not match selected duration.";
  } else if (data.error === "DATE_TIME_REQUIRED") {
    message = "Please select date and time.";
  }

  showToast(message, "error");
  return;
}


  showToast(
  editId ? "Slot added successfully!" : "Skill created successfully!",
  "success"
);

resetForm();           
loadAllSkills();       
router.refresh();      

  }

  /* =====================================================
     UI
  ===================================================== */

  return (

    <div className="min-h-screen bg-[#f3f5ed] py-12 px-6">

{toast && (
  <div className="fixed top-6 right-6 z-50 animate-slideIn">
    <div
      className={`flex items-center gap-4 px-6 py-4 rounded-xl shadow-xl min-w-[320px] max-w-[360px]
      ${toast.type === "success" && "bg-green-50 border border-green-200 text-green-800"}
      ${toast.type === "error" && "bg-red-50 border border-red-200 text-red-800"}
      ${toast.type === "info" && "bg-blue-50 border border-blue-200 text-blue-800"}
      `}
    >
      {/* ICON (circle style like your screenshot) */}
      <div
        className={`flex items-center justify-center w-10 h-10 rounded-full text-lg font-bold
        ${toast.type === "success" && "bg-green-200 text-green-700"}
        ${toast.type === "error" && "bg-red-200 text-red-700"}
        ${toast.type === "info" && "bg-blue-200 text-blue-700"}
        `}
      >
        {toast.type === "success" && "✓"}
        {toast.type === "error" && "✕"}
        {toast.type === "info" && "i"}
      </div>

      {/* MESSAGE */}
      <div className="flex-1 text-base font-semibold">
        {toast.message}
      </div>

      {/* CLOSE */}
      <button
        onClick={() => setToast(null)}
        className="text-lg opacity-60 hover:opacity-100"
      >
        ✕
      </button>
    </div>
  </div>
)}
      <div className="max-w-7xl mx-auto grid grid-cols-12 gap-8 items-start">

        {/* ================= LEFT FORM ================= */}

       <div className="col-span-8 bg-white border rounded-2xl shadow-lg p-7 space-y-5 h-fit">

          <h1 className="text-3xl font-bold text-[#2b3d1f]">
            {editId ? "Edit Skill Availability" : "Offer a Skill"}
          </h1>

           <div className="space-y-4">
            <h2 className="text-lg font-semibold">Skill Details</h2>

            <div className="flex gap-3">
              <input
                value={teachSkill}
                onChange={(e) => setTeachSkill(e.target.value)}
               disabled={!!editId && skillStatus === "APPROVED"}
                placeholder="e.g., Python, Guitar"
                className="w-full border px-4 py-2 rounded-lg"
              />

              <select
                value={teachLevel}
                onChange={(e) => setTeachLevel(e.target.value)}
             disabled={!!editId && skillStatus === "APPROVED"}
                className="border px-4 py-2 rounded-lg"
              >
                <option>Beginner</option>
                <option>Intermediate</option>
                <option>Advanced</option>
              </select>
            </div>

            <textarea
              value={teachDesc}
              onChange={(e) => setTeachDesc(e.target.value)}
              disabled={!!editId && skillStatus === "APPROVED"}
              placeholder="How you teach (optional)"
              className="w-full border px-4 py-2 rounded-lg"
              rows={3}
            />
          </div>

          <div>
            <p className="text-sm font-medium mb-2">Session length</p>
            <div className="flex gap-3">
              {timeOptions.map((t) => (
                <button
                  key={t}
                  onClick={() => setSessionLength(t)}
                 disabled={false}  
                  className={`px-4 py-2 rounded-lg border ${
                    sessionLength === t
                      ? "bg-[#7e9c6c] text-white"
                      : "bg-[#eef2ea]"
                  }`}
                >
                  {t} min
                </button>
              ))}
            </div>
          </div>

          <div>
            <p className="text-sm font-medium mb-2">
              Availability (exact session time)
            </p>

            <div className="flex gap-3 items-center">
              <input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="border px-3 py-1 rounded-lg"
              />

              <input
                type="time"
                value={fromTime}
                onChange={(e) => handleFromTimeChange(e.target.value)}
                className="border px-3 py-1 rounded-lg"
              />

              <span>to</span>

              <input
                type="time"
                value={toTime}
                onChange={(e) => setToTime(e.target.value)}
                className="border px-3 py-1 rounded-lg"
              />
            </div>
          </div>

          <div>
  <p className="text-sm font-medium mb-2">Session Platform</p>

  <div className="bg-[#eef2ea] border rounded-lg px-4 py-3 text-sm text-gray-700">
     Sessions will be conducted using SkillSwap's built-in video system.
  </div>
</div>



<div className="space-y-4">

  {/* Certification */}
  <div>
    <p className="text-sm font-medium mb-2">
      Certification / Proof (required)
    </p>
    <p className="text-sm text-gray-500 mb-2">
  You can upload up to 3 files (maximum 2 images and 1 video, each up to 10MB).
</p>

    {skillStatus !== "APPROVED" ? (
      <>
  <input
  type="file"
  multiple
  accept="image/*,video/*"
  onChange={handleUpload}
  disabled={uploading}
  id="fileInput"
  className="border px-3 py-2 rounded-lg w-full"
/>

  {uploading && (
    <div className="flex items-center gap-2 mt-3 text-sm text-gray-600">
      <div className="w-4 h-4 border-2 border-gray-400 border-t-transparent rounded-full animate-spin"></div>
      Uploading... please wait
    </div>
  )}
</>

    ) : (
      <p className="text-sm text-gray-500">
        Certification already verified ✅
      </p>
    )}

    {proofs.length > 0 && (
      <div className="text-xs text-green-600 mt-2 space-y-1">
        {proofs.map((p, i) => (
  <div key={i} className="flex justify-between text-sm">
    <span>{p.name} ({p.type})</span>

    <button
      onClick={() =>
        setProofs(proofs.filter((_, index) => index !== i))
      }
      className="text-red-500"
    >
      ❌
    </button>
  </div>
))}
      </div>
    )}
  </div>

  {/* Button */}
  <div className="flex justify-end">
    <button
      onClick={saveSkill}
      disabled={busy}
      className={`px-6 py-2 rounded-lg text-white ${
        busy
          ? "bg-gray-400"
          : "bg-[#7e9c6c] hover:bg-[#6c875e]"
      }`}
    >
      {busy ? "Saving..." : "Offer Skill"}
    </button>
  </div>

</div>
</div>


        {/* ================= RIGHT PANEL ================= */}

        <div className="col-span-4 bg-white border rounded-2xl shadow-lg p-6 h-fit">

          <h2 className="text-lg font-semibold mb-4">
            Your Scheduled Slots
          </h2>

          {mySkills.length === 0 && (
            <p className="text-sm text-gray-500">
              No skills created yet.
            </p>
          )}

          <div className="space-y-5">

            {mySkills.map((skill) => (

              <div key={skill.id} className="border rounded-lg p-4">

                <div className="font-semibold text-[#2b3d1f] mb-2">
                  {skill.name}
                </div>

                <div className="text-xs mb-2">
                  Status:{" "}
                  <span
                    className={
                      skill.status === "APPROVED"
                        ? "text-green-600"
                        : skill.status === "PENDING"
                        ? "text-yellow-600"
                        : "text-red-600"
                    }
                  >
                    {skill.status}
                  </span>
                </div>

                {skill.slots.length === 0 && (
                  <div className="text-xs text-gray-400">
                    No slots scheduled
                  </div>
                )}

                <div className="space-y-2">

                  {skill.slots.map((slot: any) => (

                    <div
                      key={slot.id}
                      className="text-sm bg-[#f8faf7] p-2 rounded"
                    >
                      📅 {slot.day} •{" "}
                      {new Date(slot.date).toLocaleDateString("en-US", {
                        day: "2-digit",
                        month: "short",
                      })}{" "}
                      • {slot.timeFrom} – {slot.timeTo}
                    </div>

                  ))}

                </div>

              </div>

            ))}

          </div>

        </div>

      </div>

    </div>

  );

}



