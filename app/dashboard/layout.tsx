"use client";

import Sidebar from "@/components/Sidebar";
import DashboardTopbar from "@/components/DashboardTopbar";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-[#f4f5f1] font-['Inter']">
      
      {/* TOP BAR -- stays always */}
      <DashboardTopbar />

      <div className="flex">

        {/* GLOBAL SIDEBAR -- stays always */}
        <Sidebar />

        {/* PAGE CONTENT */}
        <main className="flex-1 p-8">
          {children}
        </main>

      </div>

    </div>
  );
}
