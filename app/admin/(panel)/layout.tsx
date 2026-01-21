import Link from "next/link";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen bg-[#f6f7f3]">
      {/* SIDEBAR */}
      <aside className="w-64 bg-[#4a5e27] text-white flex flex-col">
        {/* BRAND */}
        <div className="p-6 border-b border-white/10">
          <h2 className="text-2xl font-bold">SkillSwap Admin</h2>
          <p className="text-xs text-white/70 mt-1">
            Control Panel
          </p>
        </div>

        {/* NAV */}
        <nav className="flex-1 px-4 py-6 space-y-1 text-sm">
          <SidebarLink href="/admin/dashboard" label="Dashboard Overview" />
          <SidebarLink href="/admin/users" label="User Management" />
          <SidebarLink href="/admin/skills" label="Skill Moderation" />
          <SidebarLink href="/admin/swaps" label="Swap Requests" />
        </nav>

        {/* FOOTER */}
        <div className="p-4 border-t border-white/10 text-xs text-white/70">
          Logged in as admin<br />
          All actions are monitored
        </div>
      </aside>

      {/* MAIN CONTENT */}
      <main className="flex-1 p-10">
        {children}
      </main>
    </div>
  );
}

function SidebarLink({
  href,
  label,
}: {
  href: string;
  label: string;
}) {
  return (
    <Link
      href={href}
      className="block px-4 py-2 rounded-md transition
                 hover:bg-[#3f5120]
                 hover:pl-5"
    >
      {label}
    </Link>
  );
}
