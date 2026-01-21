export default function AdminDashboard() {
  return (
    <div className="space-y-8">
      {/* HEADER */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">Dashboard Overview</h1>
          <p className="text-gray-600 text-sm">
            Monitor SkillSwap health, activity, and membership.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <input
            placeholder="Search users, swaps, reports..."
            className="border rounded-lg px-3 py-2 text-sm"
          />
          <div className="w-9 h-9 rounded-full bg-[#0f3d2e] text-white flex items-center justify-center font-bold">
            AD
          </div>
        </div>
      </div>

      {/* STATS */}
      <div className="grid grid-cols-5 gap-4">
        {[
          ["Total Users", "12,480", "+320 this week"],
          ["Active Skill Swaps", "842", "Sessions in progress"],
          ["Pending Requests", "97", "Awaiting response"],
          ["Premium Users", "1,034", "21 new this month"],
          ["Reported Skills", "14", "Needs review"],
        ].map(([title, value, note]) => (
          <div key={title} className="bg-white rounded-xl p-5 shadow-sm">
            <p className="text-sm text-gray-600">{title}</p>
            <h2 className="text-2xl font-bold">{value}</h2>
            <p className="text-xs text-gray-500 mt-1">{note}</p>
          </div>
        ))}
      </div>

      {/* TABLES */}
      <div className="grid grid-cols-2 gap-6">
        {/* USERS */}
        <div className="bg-white rounded-xl shadow p-5">
          <h3 className="font-semibold mb-4">Recent Users</h3>
          <table className="w-full text-sm">
            <thead className="text-left text-gray-500">
              <tr>
                <th>Name</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {[
                ["Jane Miller", "Active"],
                ["Arun Patel", "Active"],
                ["Lea Schneider", "Premium"],
                ["Carlos Lopez", "Suspended"],
              ].map(([name, status]) => (
                <tr key={name} className="border-t">
                  <td className="py-2">{name}</td>
                  <td>
                    <span
                      className={`px-2 py-1 rounded text-xs ${
                        status === "Active"
                          ? "bg-green-100 text-green-700"
                          : status === "Premium"
                          ? "bg-orange-100 text-orange-700"
                          : "bg-red-100 text-red-700"
                      }`}
                    >
                      {status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* SWAPS */}
        <div className="bg-white rounded-xl shadow p-5">
          <h3 className="font-semibold mb-4">Swap Requests</h3>
          <ul className="space-y-3 text-sm">
            {[
              ["Ana → Sam", "Pending"],
              ["Mei → Jordan", "Accepted"],
              ["Omar → Dana", "Rejected"],
            ].map(([pair, status]) => (
              <li key={pair} className="flex justify-between">
                <span>{pair}</span>
                <span
                  className={`px-2 py-1 rounded text-xs ${
                    status === "Pending"
                      ? "bg-yellow-100 text-yellow-700"
                      : status === "Accepted"
                      ? "bg-green-100 text-green-700"
                      : "bg-red-100 text-red-700"
                  }`}
                >
                  {status}
                </span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
