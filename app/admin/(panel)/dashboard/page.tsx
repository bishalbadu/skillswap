

"use client";

import { useEffect, useState } from "react";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";

type AdminData = {
  users: number;
  skills: number;
  swaps: number;
  premium: number;
  revenue: number;
  completedSessions: number;
  recentUsers: any[];
  recentSwaps: any[];
};


export default function AdminDashboard() {
  const [data, setData] = useState<AdminData | null>(null);
  const [loading, setLoading] = useState(true);

  async function loadStats() {
    try {
      const res = await fetch("/api/admin/states", {
        credentials: "include",
      });
      const json = await res.json();
      setData(json);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadStats();
  }, []);

  // ================= CHART DATA =================
const barData = [
  { name: "Users", value: data?.users || 0, fill: "#3b82f6" },     // blue
  { name: "Skills", value: data?.skills || 0, fill: "#8b5cf6" },   // purple
  { name: "Swaps", value: data?.swaps || 0, fill: "#eab308" },     // yellow
  { name: "Sessions", value: data?.completedSessions || 0, fill: "#22c55e" }, // green
];

const pieData = [
  { name: "Premium", value: data?.premium || 0 },
  { name: "Free", value: (data?.users || 0) - (data?.premium || 0) },
];

// ================= EARNINGS CHART DATA =================
const earningsData = [
  { name: "Revenue", value: data?.revenue || 0, fill: "#16a34a" }, 
  { name: "Premium Users", value: data?.premium || 0, fill: "#f97316" }, 
];

const COLORS = [
  "#ea580c", // Premium (orange)
  "#c28a2c", // Free (mustard yellow)
];


  return (
    <div className="space-y-10 animate-fadeIn">

      {/* ================= HEADER ================= */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">
          Dashboard Overview
        </h1>
        <p className="text-gray-500 text-sm mt-1">
          Monitor SkillSwap health, growth and revenue.
        </p>
      </div>

      {/* ================= STATS ================= */}
      <div className="grid grid-cols-1 md:grid-cols-3 xl:grid-cols-6 gap-6">

        <StatCard
          title="Total Users"
          value={loading ? "—" : data?.users ?? 0}
          color="blue"
        />

        <StatCard
          title="Total Skills"
          value={loading ? "—" : data?.skills ?? 0}
          color="purple"
        />

        <StatCard
          title="Swap Requests"
          value={loading ? "—" : data?.swaps ?? 0}
          color="yellow"
        />

        <StatCard
          title="Premium Users"
          value={loading ? "—" : data?.premium ?? 0}
          color="orange"
        />

        <StatCard
          title="Completed Sessions"
          value={loading ? "—" : data?.completedSessions ?? 0}
          color="green"
        />

        <StatCard
          title="Total Revenue"
          value={loading ? "—" : `Rs ${data?.revenue ?? 0}`}
          color="emerald"
        />
      </div>

{/* ================= CHARTS ================= */}
<div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

  {/* BAR CHART */}
  <div className="bg-white rounded-2xl shadow-md p-6">
    <h3 className="font-semibold text-lg mb-4">Platform Overview</h3>

    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={barData}>
        <XAxis dataKey="name" />
        <YAxis />
        <Tooltip />
       <Bar dataKey="value" radius={[6, 6, 0, 0]}>
  {barData.map((entry, index) => (
    <Cell key={index} fill={entry.fill} />
  ))}
</Bar>
      </BarChart>
    </ResponsiveContainer>
  </div>

  {/* PIE CHART */}
  <div className="bg-white rounded-2xl shadow-md p-6">
    <h3 className="font-semibold text-lg mb-4">
      Membership Distribution
    </h3>

    <ResponsiveContainer width="100%" height={300}>
      <PieChart>
        <Pie
          data={pieData}
          dataKey="value"
          outerRadius={100}
          label
        >
          {pieData.map((_, index) => (
            <Cell key={index} fill={COLORS[index]} />
          ))}
        </Pie>
        <Tooltip />
      </PieChart>
    </ResponsiveContainer>
  </div>

</div>

      {/* ================= TABLES ================= */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

        {/* ================= RECENT USERS =================
        <div className="bg-white rounded-2xl shadow-md p-6 hover:shadow-xl transition duration-300">
          <h3 className="font-semibold text-lg mb-4">Recent Users</h3>

          <table className="w-full text-sm">
            <thead className="text-left text-gray-500 border-b">
              <tr>
                <th className="pb-2">Name</th>
                <th className="pb-2">Status</th>
                <th className="pb-2">Membership</th>
              </tr>
            </thead>

            <tbody>
              {data?.recentUsers.map((u) => (
                <tr
                  key={u.id}
                  className="border-t hover:bg-gray-50 transition"
                >
                  <td className="py-3 font-medium">
                    {u.firstName} {u.lastName}
                  </td>

                  <td>
                    <Badge
                      color={
                        u.status === "ACTIVE"
                          ? "green"
                          : "red"
                      }
                    >
                      {u.status}
                    </Badge>
                  </td>

                  <td>
                    <Badge
                      color={
                        u.membership === "PREMIUM"
                          ? "orange"
                          : "gray"
                      }
                    >
                      {u.membership}
                    </Badge>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div> */}

        {/* ================= EARNINGS CHART ================= */}
<div className="bg-white rounded-2xl shadow-md p-6 hover:shadow-xl transition duration-300">
  <h3 className="font-semibold text-lg mb-4">
    Earnings Overview
  </h3>

  <ResponsiveContainer width="100%" height={300}>
    <BarChart data={earningsData}>
      <XAxis dataKey="name" />
      <YAxis />
      <Tooltip />
      <Bar dataKey="value" radius={[6, 6, 0, 0]}>
  {earningsData.map((entry, index) => (
    <Cell key={index} fill={entry.fill} />
  ))}
</Bar>
    </BarChart>
  </ResponsiveContainer>
</div>

        {/* ================= RECENT SWAPS ================= */}
        <div className="bg-white rounded-2xl shadow-md p-6 hover:shadow-xl transition duration-300">
          <h3 className="font-semibold text-lg mb-4">
            Recent Swap Requests
          </h3>

          <ul className="space-y-3 text-sm">
            {data?.recentSwaps.map((s) => (
              <li
                key={s.id}
                className="flex justify-between items-center border-b pb-2 hover:bg-gray-50 px-2 rounded transition"
              >
                <span className="font-medium">
                  {s.requester.firstName} → {s.receiver.firstName}
                </span>

                <Badge
                  color={
                    s.status === "PENDING"
                      ? "yellow"
                      : s.status === "ACCEPTED"
                      ? "green"
                      : "red"
                  }
                >
                  {s.status}
                </Badge>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

/* ================= STAT CARD ================= */
function StatCard({
  title,
  value,
  color,
}: {
  title: string;
  value: any;
  color: string;
}) {
  const colors: any = {
    blue: "from-blue-500 to-blue-600",
    purple: "from-purple-500 to-purple-600",
    yellow: "from-yellow-400 to-yellow-500",
    orange: "from-orange-500 to-orange-600",
    green: "from-green-500 to-green-600",
    emerald: "from-emerald-500 to-emerald-600",
  };

  return (
    <div className="group bg-white rounded-2xl p-6 shadow-md hover:shadow-2xl transition-all duration-300 hover:-translate-y-1">
      <p className="text-sm text-gray-500 mb-2">{title}</p>

      <h2 className="text-3xl font-bold tracking-tight group-hover:scale-105 transition-transform">
        {value}
      </h2>

      <div
        className={`h-1 mt-4 rounded-full bg-gradient-to-r ${colors[color]}`}
      />
    </div>
  );
}

/* ================= BADGE ================= */
function Badge({ children, color }: any) {
  const colors: any = {
    green: "bg-green-100 text-green-700",
    red: "bg-red-100 text-red-700",
    yellow: "bg-yellow-100 text-yellow-700",
    orange: "bg-orange-100 text-orange-700",
    gray: "bg-gray-100 text-gray-700",
  };

  return (
    <span
      className={`px-3 py-1 rounded-full text-xs font-semibold ${colors[color]} transition`}
    >
      {children}
    </span>
  );
}
