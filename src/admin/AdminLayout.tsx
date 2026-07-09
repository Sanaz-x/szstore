// src/admin/AdminLayout.tsx
import { useState } from "react";
import { Outlet, Link, useLocation, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  ClipboardList,
  FileText,
  Package,
  Gamepad2,
  Users,
  Tag,
  Layers,
  CreditCard,
  Plug,
  Activity,
  Bell,
  Settings,
  MessageCircle,
  LogOut,
  Menu,
  X,
} from "lucide-react";

const navItems = [
  { path: "/admin", icon: LayoutDashboard, label: "DASHBOARD" },
  { path: "/admin/transactions", icon: ClipboardList, label: "TRANSAKSI" },
  { path: "/admin/orders", icon: FileText, label: "ORDER MANUAL" },
  { path: "/admin/products", icon: Package, label: "PRODUK" },
  { path: "/admin/games", icon: Gamepad2, label: "GAME" },
  { path: "/admin/categories", icon: Layers, label: "KATEGORI" },
  { path: "/admin/users", icon: Users, label: "USER" },
  { path: "/admin/promos", icon: Tag, label: "PROMO" },
  { path: "/admin/payments", icon: CreditCard, label: "PAYMENT GATEWAY" },
  { path: "/admin/providers", icon: Plug, label: "API PROVIDER" },
  { path: "/admin/logs", icon: Activity, label: "WEBSITE LOG" },
  { path: "/admin/notifications", icon: Bell, label: "NOTIFIKASI" },
  { path: "/admin/settings", icon: Settings, label: "PENGATURAN" },
  { path: "/admin/contacts", icon: MessageCircle, label: "LIVE KONTAKS" },
];

export default function AdminLayout() {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    // Implementasi logout Supabase nanti di sini
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-[#050816] flex">
      {mobileOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      <aside
        className={`fixed lg:static inset-y-0 left-0 z-50 bg-[#0A1020] border-r border-[rgba(159,211,232,0.1)] transition-all duration-300 ${
          collapsed ? "w-[60px]" : "w-[260px]"
        } ${mobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}`}
      >
        <div className="h-full flex flex-col p-4">
          <div className="flex items-center gap-3 mb-8 px-2">
            <div className="w-8 h-8 bg-blue-500 rounded-lg"></div>
            {!collapsed && (
              <span className="text-[10px] font-orbitron uppercase tracking-[0.1em] text-[rgba(159,211,232,0.5)]">
                ADMIN PANEL
              </span>
            )}
          </div>

          <button
            onClick={() => setCollapsed(!collapsed)}
            className="hidden lg:flex absolute -right-3 top-20 w-6 h-6 rounded-full bg-[#2E3350] border border-[rgba(159,211,232,0.2)] items-center justify-center text-[#9FD3E8] hover:bg-[#3d4460] transition-colors z-10"
          >
            {collapsed ? (
              <Menu className="w-3 h-3" />
            ) : (
              <X className="w-3 h-3" />
            )}
          </button>

          <button
            onClick={() => setMobileOpen(false)}
            className="lg:hidden absolute top-4 right-4 text-white/60"
          >
            <X className="w-5 h-5" />
          </button>

          <nav className="flex-1 flex flex-col gap-1 overflow-y-auto">
            {navItems.map((item) => {
              const isActive = location.pathname === item.path;
              const Icon = item.icon;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setMobileOpen(false)}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 ${
                    isActive
                      ? "bg-[rgba(159,211,232,0.1)] text-[#9FD3E8] border-l-[3px] border-l-[#9FD3E8]"
                      : "text-white/50 hover:bg-[rgba(159,211,232,0.05)] hover:text-white border-l-[3px] border-l-transparent"
                  }`}
                >
                  <Icon className="w-[18px] h-[18px] shrink-0" />
                  {!collapsed && (
                    <span className="text-xs font-rajdhani font-medium tracking-wide truncate">
                      {item.label}
                    </span>
                  )}
                </Link>
              );
            })}
          </nav>

          <div className="mt-4 pt-4 border-t border-white/5">
            <button
              onClick={handleLogout}
              className="flex items-center gap-3 w-full px-3 py-2.5 rounded-xl text-white/50 hover:bg-[rgba(255,64,81,0.1)] hover:text-[#FF4081] transition-all"
            >
              <LogOut className="w-[18px] h-[18px] shrink-0" />
              {!collapsed && (
                <span className="text-xs font-rajdhani font-medium">
                  LOGOUT
                </span>
              )}
            </button>
          </div>
        </div>
      </aside>

      <div className="flex-1 flex flex-col min-w-0">
        <header className="h-16 flex items-center justify-between px-4 lg:px-8 border-b border-[rgba(159,211,232,0.1)]">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setMobileOpen(true)}
              className="lg:hidden text-white/60 p-1"
            >
              <Menu className="w-5 h-5" />
            </button>
            <h1 className="text-base lg:text-lg font-orbitron font-bold uppercase tracking-[0.03em] text-white">
              {navItems.find((n) => n.path === location.pathname)?.label ||
                "DASHBOARD"}
            </h1>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-4 lg:p-8">
          {/* Outlet akan merender komponen sesuai route */}
          <Outlet />
        </main>
      </div>
    </div>
  );
}
