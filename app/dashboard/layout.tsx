// "use client";

// import { useEffect, useState } from "react";
// import { useRouter } from "next/navigation";
// import Sidebar from "@/components/Sidebar";
// import DashboardTopbar from "@/components/DashboardTopbar";

// export default function DashboardLayout({
//   children,
// }: {
//   children: React.ReactNode;
// }) {
//   const router = useRouter();

//   const [user, setUser] = useState<any>(null);
//   const [loading, setLoading] = useState(true);
//   const [redirecting, setRedirecting] = useState(false);

//   /* ============================
//      🔐 AUTH CHECK (SAFE)
//   ============================ */
//   useEffect(() => {
//     const controller = new AbortController();

//     fetch("/api/auth/me", {
//       credentials: "include", // ✅ ensure cookies are sent
//       signal: controller.signal,
//     })
//       .then((res) => res.json())
//       .then((data) => {
//         setUser(data.user ?? null);
//         setLoading(false);
//       })
//       .catch((err) => {
//         if (err.name !== "AbortError") {
//           setLoading(false);
//         }
//       });

//     return () => controller.abort();
//   }, []);

//   /* ============================
//      🚪 REDIRECT IF UNAUTH
//   ============================ */
//   useEffect(() => {
//     if (!loading && !user && !redirecting) {
//       setRedirecting(true);
//       router.replace("/login");
//     }
//   }, [loading, user, redirecting, router]);

//   /* ============================
//      ⏳ LOADING STATE
//   ============================ */
//   if (loading) {
//     return (
//       <div className="h-screen flex items-center justify-center text-lg">
//         Loading dashboard...
//       </div>
//     );
//   }

//   /* ============================
//      ⛔ BLOCK RENDER DURING REDIRECT
//   ============================ */
//   if (!user) {
//     return null;
//   }

//   /* ============================
//      ✅ AUTHENTICATED LAYOUT
//   ============================ */
//   return (
//     <div className="min-h-screen bg-[#f4f5f1] font-['Inter']">
//       {/* TOP BAR */}
//       <DashboardTopbar />

//       <div className="flex">
//         {/* SIDEBAR */}
//         <Sidebar />

//         {/* PAGE CONTENT */}
//         <main className="flex-1 p-8">{children}</main>
//       </div>
//     </div>
//   );
// }


"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Sidebar from "@/components/Sidebar";
import DashboardTopbar from "@/components/DashboardTopbar";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();

  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  /* ============================
     🔐 AUTH CHECK (SINGLE SOURCE)
  ============================ */
  useEffect(() => {
    const controller = new AbortController();

    fetch("/api/auth/me", {
      credentials: "include",
      signal: controller.signal,
    })
      .then((res) => res.json())
      .then((data) => {
        setUser(data.user ?? null);
        setLoading(false);
      })
      .catch((err) => {
        if (err.name !== "AbortError") {
          setLoading(false);
        }
      });

    return () => controller.abort();
  }, []);

  /* ============================
     🚪 REDIRECT IF UNAUTH
  ============================ */
  useEffect(() => {
    if (!loading && user === null) {
      router.replace("/login");
    }
  }, [loading, user, router]);

  /* ============================
     ⏳ LOADING STATE
  ============================ */
  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center text-lg">
        Loading dashboard...
      </div>
    );
  }

  /* ============================
     ⛔ BLOCK RENDER WHILE REDIRECTING
  ============================ */
  if (!user) {
    return null;
  }

  /* ============================
     ✅ AUTHENTICATED LAYOUT
  ============================ */
  return (
    <div className="min-h-screen bg-[#f4f5f1] font-['Inter']">
      {/* TOP BAR */}
      <DashboardTopbar />

      <div className="flex">
        {/* SIDEBAR */}
        <Sidebar />

        {/* PAGE CONTENT */}
        <main className="flex-1 p-8">{children}</main>
      </div>
    </div>
  );
}
