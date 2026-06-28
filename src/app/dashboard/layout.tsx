"use client";

import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import { useState, useEffect, Component, type ReactNode, type ErrorInfo } from "react";
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
  AlertTriangle,
  ListChecks,
} from "lucide-react";
import { DashboardAuthProvider, useDashboardAuth } from "@/components/vectra/dashboard-auth";

// Error boundary pour éviter que toute la page crash
class DashboardErrorBoundary extends Component<{ children: ReactNode }, { hasError: boolean; error: Error | null }> {
  constructor(props: { children: ReactNode }) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error("[Dashboard Error]", error, info.componentStack);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex flex-col items-center gap-4 py-16 text-center px-6">
          <AlertTriangle className="h-10 w-10 text-amber-400" aria-hidden="true" />
          <h2 className="text-white text-lg font-semibold" style={{ fontFamily: "var(--font-manrope)" }}>
            Une erreur est survenue
          </h2>
          <p className="text-white/60 text-[13px] max-w-sm break-words" style={{ fontFamily: "var(--font-inter)" }}>
            {this.state.error?.message || "Erreur inconnue. Rechargez la page ou réessayez."}
          </p>
          <button
            onClick={() => this.setState({ hasError: false, error: null })}
            className="mt-2 rounded-lg bg-[#7b39fc] px-4 py-2 text-white text-[13px] font-semibold hover:bg-[#8a4dff]"
          >
            Réessayer
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}

const NAV_ITEMS = [
  { href: "/dashboard", label: "Overview", icon: LayoutDashboard },
  { href: "/dashboard/services", label: "Services", icon: Briefcase },
  { href: "/dashboard/projects", label: "Projets", icon: FolderKanban },
  { href: "/dashboard/process", label: "Processus", icon: ListChecks },
  { href: "/dashboard/testimonials", label: "Témoignages", icon: Quote },
  { href: "/dashboard/stats", label: "Stats", icon: BarChart3 },
];

function DashboardShell({ children }: { children: ReactNode }) {
  const { isAuthed, isReady, logout } = useDashboardAuth();
  const pathname = usePathname();
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!isReady || !mounted) return;
    if (!isAuthed && pathname !== "/dashboard/login") {
      router.replace("/dashboard/login");
    } else if (isAuthed && pathname === "/dashboard/login") {
      router.replace("/dashboard");
    }
  }, [isAuthed, isReady, mounted, pathname, router]);

  // Lock body scroll quand sidebar mobile est ouverte
  useEffect(() => {
    if (sidebarOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [sidebarOpen]);

  if (!mounted) {
    return (
      <div className="min-h-screen bg-[#2b2344] flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="h-8 w-8 border-2 border-white/20 border-t-[#7b39fc] rounded-full animate-spin" />
          <div className="text-white/40 text-[13px]" style={{ fontFamily: "var(--font-inter)" }}>
            Chargement…
          </div>
        </div>
      </div>
    );
  }

  if (pathname === "/dashboard/login") {
    return <>{children}</>;
  }

  if (!isAuthed) {
    return (
      <div className="min-h-screen bg-[#2b2344] flex items-center justify-center">
        <div className="text-white/40 text-[14px]" style={{ fontFamily: "var(--font-inter)" }}>
          Redirection…
        </div>
      </div>
    );
  }

  const handleLogout = () => {
    logout();
    router.push("/dashboard/login");
  };

  // Trouver le label de la page actuelle pour le header mobile
  const currentItem = NAV_ITEMS.find((item) => pathname === item.href);

  return (
    <div className="min-h-screen bg-[#2b2344] flex flex-col lg:flex-row">
      {/* === Sidebar — desktop === */}
      <aside className="hidden lg:flex w-[240px] shrink-0 flex-col border-r border-white/10 bg-[#1f1a33] p-4 fixed lg:sticky top-0 h-screen">
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

        <nav className="flex flex-col gap-1 flex-1 overflow-y-auto">
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
                <Icon className="h-4 w-4 shrink-0" strokeWidth={2} aria-hidden="true" />
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
            <ExternalLink className="h-4 w-4 shrink-0" strokeWidth={2} aria-hidden="true" />
            Voir le site
          </a>
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-[13px] text-white/55 hover:text-red-400 hover:bg-red-500/10 transition-all"
            style={{ fontFamily: "var(--font-manrope)" }}
          >
            <LogOut className="h-4 w-4 shrink-0" strokeWidth={2} aria-hidden="true" />
            Déconnexion
          </button>
        </div>
      </aside>

      {/* === Mobile header === */}
      <header className="lg:hidden sticky top-0 z-30 bg-[#1f1a33]/95 backdrop-blur-md border-b border-white/10 px-4 py-3 flex items-center justify-between safe-area-top">
        <div className="flex items-center gap-2.5">
          <svg width="26" height="26" viewBox="0 0 32 32" fill="none" aria-hidden="true">
            <rect width="32" height="32" rx="8" fill="#7b39fc" />
            <path d="M8 10 L16 23 L24 10" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
          </svg>
          <div className="flex flex-col leading-tight">
            <span className="text-white text-[14px] font-semibold" style={{ fontFamily: "var(--font-manrope)" }}>
              {currentItem?.label || "Dashboard"}
            </span>
          </div>
        </div>
        <button
          onClick={() => setSidebarOpen(true)}
          aria-label="Ouvrir le menu"
          aria-expanded={sidebarOpen}
          className="inline-flex items-center justify-center h-10 w-10 rounded-lg text-white active:bg-white/10 transition-colors touch-manipulation"
        >
          <Menu className="h-5 w-5" strokeWidth={2} />
        </button>
      </header>

      {/* === Mobile sidebar overlay === */}
      {sidebarOpen && (
        <div
          className="lg:hidden fixed inset-0 z-50 bg-black/70 backdrop-blur-sm"
          onClick={() => setSidebarOpen(false)}
          role="dialog"
          aria-modal="true"
          aria-label="Menu de navigation"
        >
          <div
            className="absolute left-0 top-0 bottom-0 w-[280px] max-w-[85vw] bg-[#1f1a33] flex flex-col animate-in slide-in-from-left"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header du drawer */}
            <div className="flex items-center justify-between px-5 py-4 border-b border-white/10">
              <div className="flex items-center gap-2.5">
                <svg width="28" height="28" viewBox="0 0 32 32" fill="none" aria-hidden="true">
                  <rect width="32" height="32" rx="8" fill="#7b39fc" />
                  <path d="M8 10 L16 23 L24 10" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
                </svg>
                <div className="flex flex-col leading-tight">
                  <span className="text-white text-[14px] font-semibold" style={{ fontFamily: "var(--font-manrope)" }}>
                    Vectra
                  </span>
                  <span className="text-white/40 text-[10px] uppercase tracking-wider" style={{ fontFamily: "var(--font-cabin)" }}>
                    Dashboard
                  </span>
                </div>
              </div>
              <button
                onClick={() => setSidebarOpen(false)}
                aria-label="Fermer le menu"
                className="inline-flex items-center justify-center h-9 w-9 rounded-lg text-white/60 active:bg-white/10 transition-colors touch-manipulation"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Nav links */}
            <nav className="flex flex-col gap-1 p-3 flex-1 overflow-y-auto">
              {NAV_ITEMS.map((item) => {
                const Icon = item.icon;
                const active = pathname === item.href;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setSidebarOpen(false)}
                    className={`flex items-center gap-3 rounded-lg px-3 py-3.5 text-[15px] font-medium transition-all touch-manipulation ${
                      active
                        ? "bg-[#7b39fc] text-white shadow-[0_4px_14px_rgba(123,57,252,0.4)]"
                        : "text-white/70 active:bg-white/10"
                    }`}
                    style={{ fontFamily: "var(--font-manrope)" }}
                  >
                    <Icon className="h-5 w-5 shrink-0" strokeWidth={2} />
                    {item.label}
                  </Link>
                );
              })}
            </nav>

            {/* Footer du drawer */}
            <div className="flex flex-col gap-1 p-3 border-t border-white/10 safe-area-bottom">
              <a
                href="/"
                target="_blank"
                className="flex items-center gap-3 rounded-lg px-3 py-3 text-[14px] text-white/60 active:bg-white/10 transition-all touch-manipulation"
                style={{ fontFamily: "var(--font-manrope)" }}
              >
                <ExternalLink className="h-4 w-4 shrink-0" strokeWidth={2} />
                Voir le site
              </a>
              <button
                onClick={handleLogout}
                className="flex items-center gap-3 rounded-lg px-3 py-3 text-[14px] text-red-400 active:bg-red-500/10 transition-all touch-manipulation"
                style={{ fontFamily: "var(--font-manrope)" }}
              >
                <LogOut className="h-4 w-4 shrink-0" strokeWidth={2} />
                Déconnexion
              </button>
            </div>
          </div>
        </div>
      )}

      {/* === Main content === */}
      <main className="flex-1 min-w-0 overflow-y-auto">
        <div className="p-4 sm:p-6 lg:p-10 max-w-[1200px] mx-auto pb-24 lg:pb-10 safe-area-bottom">
          <DashboardErrorBoundary>{children}</DashboardErrorBoundary>
        </div>
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
