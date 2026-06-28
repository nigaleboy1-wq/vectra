"use client";

import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import { useState, useEffect, type ReactNode } from "react";
import {
  LayoutDashboard,
  Briefcase,
  FolderKanban,
  Quote,
  BarChart3,
  LogOut,
  Menu,
  X,
  ExternalLink,
} from "lucide-react";
import { DashboardAuthProvider, useDashboardAuth } from "@/components/vectra/dashboard-auth";

const NAV_ITEMS = [
  { href: "/dashboard", label: "Overview", icon: LayoutDashboard },
  { href: "/dashboard/services", label: "Services", icon: Briefcase },
  { href: "/dashboard/projects", label: "Projets", icon: FolderKanban },
  { href: "/dashboard/testimonials", label: "Témoignages", icon: Quote },
  { href: "/dashboard/stats", label: "Statistiques", icon: BarChart3 },
];

function DashboardShell({ children }: { children: ReactNode }) {
  const { isAuthed, logout } = useDashboardAuth();
  const pathname = usePathname();
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Not authed → redirect to login (must be before any conditional return)
  useEffect(() => {
    if (!isAuthed && pathname !== "/dashboard/login") {
      router.replace("/dashboard/login");
    }
  }, [isAuthed, pathname, router]);

  // Login page renders without shell
  if (pathname === "/dashboard/login") {
    return <>{children}</>;
  }

  if (!isAuthed) {
    return null;
  }

  const handleLogout = () => {
    logout();
    router.push("/dashboard/login");
  };

  return (
    <div className="min-h-screen bg-[#2b2344] flex">
      {/* Sidebar — desktop */}
      <aside className="hidden lg:flex w-[240px] shrink-0 flex-col border-r border-white/10 bg-[#1f1a33] p-4">
        <div className="flex items-center gap-2.5 px-3 py-4 mb-4">
          <svg width="32" height="32" viewBox="0 0 32 32" fill="none" aria-hidden="true">
            <defs>
              <linearGradient id="dash-logo-grad" x1="0" y1="0" x2="32" y2="32">
                <stop stopColor="#7b39fc" />
                <stop offset="1" stopColor="#5b2db8" />
              </linearGradient>
            </defs>
            <rect width="32" height="32" rx="8" fill="url(#dash-logo-grad)" />
            <path d="M8 10 L16 23 L24 10" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
          </svg>
          <div className="flex flex-col">
            <span className="text-white text-[15px] font-semibold" style={{ fontFamily: "var(--font-manrope)" }}>
              Vectra
            </span>
            <span className="text-white/40 text-[10px] uppercase tracking-wider" style={{ fontFamily: "var(--font-cabin)" }}>
              Dashboard
            </span>
          </div>
        </div>

        <nav className="flex flex-col gap-1 flex-1">
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            const active = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-[14px] font-medium transition-all ${
                  active
                    ? "bg-[#7b39fc] text-white shadow-[0_4px_14px_rgba(123,57,252,0.4)]"
                    : "text-white/65 hover:text-white hover:bg-white/5"
                }`}
                style={{ fontFamily: "var(--font-manrope)" }}
              >
                <Icon className="h-4 w-4" strokeWidth={2} aria-hidden="true" />
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="flex flex-col gap-1 mt-auto pt-4 border-t border-white/10">
          <a
            href="/"
            target="_blank"
            className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-[13px] text-white/55 hover:text-white hover:bg-white/5 transition-all"
            style={{ fontFamily: "var(--font-manrope)" }}
          >
            <ExternalLink className="h-4 w-4" strokeWidth={2} aria-hidden="true" />
            Voir le site
          </a>
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-[13px] text-white/55 hover:text-red-400 hover:bg-red-500/10 transition-all"
            style={{ fontFamily: "var(--font-manrope)" }}
          >
            <LogOut className="h-4 w-4" strokeWidth={2} aria-hidden="true" />
            Déconnexion
          </button>
        </div>
      </aside>

      {/* Mobile header */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-30 bg-[#1f1a33] border-b border-white/10 px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <svg width="28" height="28" viewBox="0 0 32 32" fill="none" aria-hidden="true">
            <rect width="32" height="32" rx="8" fill="#7b39fc" />
            <path d="M8 10 L16 23 L24 10" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
          </svg>
          <span className="text-white text-[15px] font-semibold" style={{ fontFamily: "var(--font-manrope)" }}>
            Vectra Dashboard
          </span>
        </div>
        <button
          onClick={() => setSidebarOpen(true)}
          aria-label="Ouvrir le menu"
          className="text-white p-2"
        >
          <Menu className="h-5 w-5" strokeWidth={2} />
        </button>
      </div>

      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div className="lg:hidden fixed inset-0 z-50 bg-black/60 backdrop-blur-sm" onClick={() => setSidebarOpen(false)}>
          <div
            className="absolute left-0 top-0 bottom-0 w-[260px] bg-[#1f1a33] p-4 flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-4">
              <span className="text-white font-semibold">Menu</span>
              <button onClick={() => setSidebarOpen(false)} aria-label="Fermer" className="text-white/60 p-1">
                <X className="h-5 w-5" />
              </button>
            </div>
            <nav className="flex flex-col gap-1">
              {NAV_ITEMS.map((item) => {
                const Icon = item.icon;
                const active = pathname === item.href;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setSidebarOpen(false)}
                    className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-[14px] font-medium transition-all ${
                      active ? "bg-[#7b39fc] text-white" : "text-white/65 hover:bg-white/5"
                    }`}
                  >
                    <Icon className="h-4 w-4" strokeWidth={2} />
                    {item.label}
                  </Link>
                );
              })}
            </nav>
            <button
              onClick={handleLogout}
              className="mt-auto flex items-center gap-3 rounded-lg px-3 py-2.5 text-[13px] text-red-400 hover:bg-red-500/10"
            >
              <LogOut className="h-4 w-4" strokeWidth={2} />
              Déconnexion
            </button>
          </div>
        </div>
      )}

      {/* Main content */}
      <main className="flex-1 overflow-y-auto pt-16 lg:pt-0">
        <div className="p-6 lg:p-10 max-w-[1200px] mx-auto">{children}</div>
      </main>
    </div>
  );
}

export default function DashboardLayout({ children }: { children: ReactNode }) {
  return (
    <DashboardAuthProvider>
      <DashboardShell>{children}</DashboardShell>
    </DashboardAuthProvider>
  );
}
