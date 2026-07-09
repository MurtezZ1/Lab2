import { NavLink, Outlet } from "react-router-dom";
import { Bell, Boxes, ClipboardList, FileClock, Gauge, LayoutPanelTop, Menu, Package, Rocket, ServerCog, Settings, ShieldCheck, Users, X } from "lucide-react";
import { useState } from "react";
import AdminDemoModeBanner from "@/components/AdminDemoModeBanner";

const links = [
  { to: "/admin/dashboard", label: "Dashboard", icon: Gauge },
  { to: "/admin/launch-readiness", label: "Launch Readiness", icon: Rocket },
  { to: "/admin/system-monitor", label: "System Monitor", icon: ServerCog },
  { to: "/admin/users", label: "Users", icon: Users },
  { to: "/admin/roles", label: "Roles & Permissions", icon: ShieldCheck },
  { to: "/admin/products", label: "Products", icon: Package },
  { to: "/admin/orders", label: "Orders", icon: ClipboardList },
  { to: "/admin/reports", label: "Reports", icon: Boxes },
  { to: "/admin/audit-logs", label: "Audit Logs", icon: FileClock },
  { to: "/admin/cms", label: "CMS", icon: LayoutPanelTop },
  { to: "/admin/notifications", label: "Notifications", icon: Bell },
  { to: "/admin/settings", label: "Settings", icon: Settings },
];

export default function AdminLayout() {
  const [isOpen, setIsOpen] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <div className="container mx-auto px-6 py-8">
      <div className="mb-4 flex items-center justify-between lg:hidden">
        <h1 className="text-xl font-black text-white">Admin</h1>
        <button className="rounded-xl border border-white/10 p-2 text-white" onClick={() => setIsOpen(true)}>
          <Menu className="h-5 w-5" />
        </button>
      </div>

      <div className="grid gap-6 lg:grid-cols-[auto_1fr]">
        <aside className={`${isOpen ? "fixed inset-0 z-50 block bg-black/60 p-4" : "hidden"} lg:static lg:block lg:bg-transparent lg:p-0`}>
          <div className={`glass-card h-full rounded-2xl border border-white/10 p-4 transition-all lg:min-h-[calc(100vh-8rem)] ${isCollapsed ? "lg:w-20" : "lg:w-72"}`}>
            <div className="mb-5 flex items-center justify-between">
              {!isCollapsed && <p className="text-lg font-black text-white">Admin Panel</p>}
              <div className="flex gap-2">
                <button className="hidden rounded-lg border border-white/10 p-2 text-gray-300 hover:text-white lg:inline-flex" onClick={() => setIsCollapsed((value) => !value)}>
                  <Menu className="h-4 w-4" />
                </button>
                <button className="rounded-lg border border-white/10 p-2 text-gray-300 hover:text-white lg:hidden" onClick={() => setIsOpen(false)}>
                  <X className="h-4 w-4" />
                </button>
              </div>
            </div>
            <nav className="space-y-2">
              {links.map((link) => {
                const Icon = link.icon;
                return (
                  <NavLink
                    key={link.to}
                    to={link.to}
                    onClick={() => setIsOpen(false)}
                    className={({ isActive }) =>
                      `flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-bold transition-colors ${
                        isActive ? "bg-primary text-white" : "text-gray-300 hover:bg-white/10 hover:text-white"
                      }`
                    }
                  >
                    <Icon className="h-5 w-5 shrink-0" />
                    {!isCollapsed && <span>{link.label}</span>}
                  </NavLink>
                );
              })}
            </nav>
          </div>
        </aside>

        <div className="min-w-0">
          <AdminDemoModeBanner />
          <Outlet />
        </div>
      </div>
    </div>
  );
}
