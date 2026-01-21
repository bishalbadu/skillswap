// "use client";

// import { useState } from "react";

// export default function AdminLogin() {
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const [error, setError] = useState("");

//   async function login() {
//     setError("");

//     const res = await fetch("/api/admin/login", {
//       method: "POST",
//       headers: { "Content-Type": "application/json" },
//       body: JSON.stringify({ email, password }),
//       credentials: "include",
//     });

//     if (res.ok) {
//       window.location.href = "/admin/dashboard";
//     } else {
//       setError("Invalid credentials. Please check your email and password.");
//     }
//   }

//   return (
//     <div className="min-h-screen flex items-center justify-center bg-[#f7f7f7]">
//       <div className="w-full max-w-md bg-white rounded-2xl shadow-lg p-8 space-y-6">
//         {/* HEADER */}
//         <div className="space-y-1">
//           <span className="inline-block text-sm px-3 py-1 rounded-full bg-[#eef2ea] text-[#4a5e27] font-medium">
//             Admin Login
//           </span>

//           <h1 className="text-2xl font-bold text-gray-900">
//             Sign in to the control panel
//           </h1>

//           <p className="text-sm text-gray-600">
//             This area is restricted to platform administrators.
//           </p>
//         </div>

//         {/* FORM */}
//         <div className="space-y-4">
//           <div>
//             <label className="text-sm font-medium text-gray-700">
//               Admin email
//             </label>
//             <input
//               type="email"
//               placeholder="admin@skillswap.com"
//               className="mt-1 w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#4a5e27]"
//               value={email}
//               onChange={(e) => setEmail(e.target.value)}
//             />
//           </div>

//           <div>
//             <label className="text-sm font-medium text-gray-700">
//               Password
//             </label>
//             <input
//               type="password"
//               placeholder="Enter your password"
//               className="mt-1 w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#4a5e27]"
//               value={password}
//               onChange={(e) => setPassword(e.target.value)}
//             />
//           </div>

//           {/* ERROR */}
//           {error && (
//             <div className="border border-red-300 bg-red-50 text-red-700 text-sm rounded-lg p-3">
//               {error}
//             </div>
//           )}

//           {/* BUTTON */}
//           <button
//             onClick={login}
//             className="w-full bg-[#4a5e27] text-white py-2.5 rounded-lg font-semibold hover:bg-[#3f5120] transition"
//           >
//             Login as Admin
//           </button>
//         </div>

//         {/* FOOTER NOTE */}
//         <p className="text-xs text-gray-500 text-center pt-2">
//           Restricted Access — Authorized personnel only.
//         </p>
//       </div>
//     </div>
//   );
// }


"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function AdminLogin() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  /* ============================
     🔐 CHECK EXISTING ADMIN SESSION
  ============================ */
  useEffect(() => {
    fetch("/api/admin/me", {
      credentials: "include",
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.admin) {
          router.replace("/admin/dashboard");
        } else {
          setLoading(false);
        }
      })
      .catch(() => {
        setLoading(false);
      });
  }, [router]);

  /* ============================
     ⏳ LOADING SESSION CHECK
  ============================ */
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        Checking admin session...
      </div>
    );
  }

  /* ============================
     🔐 LOGIN HANDLER
  ============================ */
  async function login() {
    if (submitting) return;

    setSubmitting(true);
    setError("");

    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ email, password }),
      });

      if (!res.ok) {
        setError("Invalid credentials. Please check your email and password.");
        setSubmitting(false);
        return;
      }

      router.replace("/admin/dashboard");
    } catch {
      setError("Login failed. Please try again.");
      setSubmitting(false);
    }
  }

  /* ============================
     ✅ UI (UNCHANGED)
  ============================ */
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#f7f7f7]">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-lg p-8 space-y-6">
        {/* HEADER */}
        <div className="space-y-1">
          <span className="inline-block text-sm px-3 py-1 rounded-full bg-[#eef2ea] text-[#4a5e27] font-medium">
            Admin Login
          </span>

          <h1 className="text-2xl font-bold text-gray-900">
            Sign in to the control panel
          </h1>

          <p className="text-sm text-gray-600">
            This area is restricted to platform administrators.
          </p>
        </div>

        {/* FORM */}
        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium text-gray-700">
              Admin email
            </label>
            <input
              type="email"
              placeholder="admin@skillswap.com"
              className="mt-1 w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#4a5e27]"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={submitting}
            />
          </div>

          <div>
            <label className="text-sm font-medium text-gray-700">
              Password
            </label>
            <input
              type="password"
              placeholder="Enter your password"
              className="mt-1 w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#4a5e27]"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={submitting}
            />
          </div>

          {/* ERROR */}
          {error && (
            <div className="border border-red-300 bg-red-50 text-red-700 text-sm rounded-lg p-3">
              {error}
            </div>
          )}

          {/* BUTTON */}
          <button
            onClick={login}
            disabled={submitting}
            className="w-full bg-[#4a5e27] text-white py-2.5 rounded-lg font-semibold hover:bg-[#3f5120] transition disabled:opacity-60"
          >
            {submitting ? "Signing in..." : "Login as Admin"}
          </button>
        </div>

        {/* FOOTER NOTE */}
        <p className="text-xs text-gray-500 text-center pt-2">
          Restricted Access — Authorized personnel only.
        </p>
      </div>
    </div>
  );
}
