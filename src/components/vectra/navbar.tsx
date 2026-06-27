'use client';

import { useState, useEffect, useRef, useCallback } from "react";
import { motion } from "framer-motion";
import { ChevronDown, Menu, X, ArrowRight } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

type NavLink = {
  label: string;
  href: string;
  hasDropdown?: boolean;
  children?: { label: string; href: string; description?: string }[];
};

const SERVICES_MENU = [
  { label: "Conception web sur mesure", href: "#work", description: "Sites sur mesure" },
  { label: "E-commerce & applications web", href: "#work", description: "Boutiques headless" },
  { label: "Branding & stratégie UX", href: "#work", description: "Identité & prototypes" },
  { label: "Optimisation des performances", href: "#work", description: "Chargements sous la seconde" },
];

const NAV_LINKS: NavLink[] = [
  { label: "Accueil", href: "#home" },
  { label: "Services", href: "#work", hasDropdown: true, children: SERVICES_MENU },
  { label: "Nos réalisations", href: "#gallery" },
  { label: "Contact", href: "#contact" },
];

function VectraLogo() {
  return (
    <a
      href="#home"
      aria-label="Vectra home"
      className="group flex items-center gap-2.5 text-white"
    >
      <span className="relative inline-flex h-9 w-9 items-center justify-center">
        {/* Glow behind logo */}
        <span
          aria-hidden="true"
          className="absolute inset-0 rounded-xl opacity-70 blur-md transition-opacity duration-300 group-hover:opacity-100"
          style={{
            background:
              "radial-gradient(circle, rgba(123,57,252,0.55) 0%, transparent 70%)",
          }}
        />
        <svg
          width="32"
          height="32"
          viewBox="0 0 32 32"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="relative"
          aria-hidden="true"
        >
          {/* Rounded square background with gradient */}
          <defs>
            <linearGradient id="vectra-logo-gradient" x1="0" y1="0" x2="32" y2="32" gradientUnits="userSpaceOnUse">
              <stop stopColor="#7b39fc" />
              <stop offset="1" stopColor="#5b2db8" />
            </linearGradient>
          </defs>
          <rect width="32" height="32" rx="8" fill="url(#vectra-logo-gradient)" />
          {/* Letter V */}
          <path
            d="M8 10 L16 23 L24 10"
            stroke="white"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            fill="none"
          />
        </svg>
      </span>
      <span
        className="text-white text-[20px] font-semibold tracking-tight"
        style={{ fontFamily: "var(--font-manrope)" }}
      >
        Vectra
      </span>
    </a>
  );
}

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const mobileMenuRef = useRef<HTMLDivElement>(null);
  const lastFocusedRef = useRef<HTMLElement | null>(null);

  // Detect scroll to add glass background
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Lock body scroll + manage focus when mobile menu open
  useEffect(() => {
    if (mobileOpen) {
      // Save current focus to restore later
      lastFocusedRef.current = document.activeElement as HTMLElement;
      document.body.style.overflow = "hidden";

      // Move focus into the menu
      const focusable = mobileMenuRef.current?.querySelector<HTMLElement>(
        'a, button, [tabindex]:not([tabindex="-1"])'
      );
      focusable?.focus();
    } else {
      document.body.style.overflow = "";
      // Restore focus
      lastFocusedRef.current?.focus();
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  // Close mobile menu on Escape key
  useEffect(() => {
    if (!mobileOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        setMobileOpen(false);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [mobileOpen]);

  // Trap focus inside mobile menu while open
  useEffect(() => {
    if (!mobileOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== "Tab") return;
      const root = mobileMenuRef.current;
      if (!root) return;
      const focusables = Array.from(
        root.querySelectorAll<HTMLElement>(
          'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])'
        )
      );
      if (focusables.length === 0) return;
      const first = focusables[0];
      const last = focusables[focusables.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [mobileOpen]);

  const closeMobile = useCallback(() => setMobileOpen(false), []);

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-40 w-full">
        <div
          className={`mx-auto flex items-center justify-between px-6 lg:px-10 transition-all duration-500 ${
            scrolled
              ? "mt-3 max-w-[1280px] rounded-2xl border border-white/10 bg-[rgba(43,35,68,0.6)] backdrop-blur-xl py-2.5 shadow-[0_8px_32px_rgba(0,0,0,0.3)]"
              : "max-w-none border border-transparent bg-transparent py-4 lg:py-5"
          }`}
          style={{ width: scrolled ? "calc(100% - 24px)" : "100%" }}
        >
          {/* Left: Logo */}
          <VectraLogo />

          {/* Center: Nav links (desktop only) */}
          <nav
            className="hidden lg:flex items-center gap-1"
            aria-label="Primary"
          >
            {NAV_LINKS.map((link) =>
              link.hasDropdown ? (
                <DropdownMenu key={link.label}>
                  <DropdownMenuTrigger asChild>
                    <button
                      type="button"
                      className="group relative inline-flex items-center gap-1 rounded-lg px-3.5 py-2 text-white/85 text-[14px] font-medium transition-all duration-200 hover:text-white hover:bg-white/5"
                      style={{ fontFamily: "var(--font-manrope)" }}
                    >
                      {link.label}
                      <ChevronDown
                        className="h-3.5 w-3.5 text-white/50 transition-transform duration-200 group-hover:translate-y-0.5 group-hover:text-white group-data-[state=open]:rotate-180"
                        strokeWidth={2}
                        aria-hidden="true"
                      />
                    </button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent
                    align="center"
                    sideOffset={8}
                    className="w-64 rounded-xl border-white/10 bg-[rgba(26,21,48,0.95)] backdrop-blur-xl p-2 text-white"
                  >
                    {link.children?.map((child) => (
                      <DropdownMenuItem
                        key={child.label}
                        asChild
                        className="rounded-lg px-3 py-2.5 focus:bg-white/10 focus:text-white cursor-pointer"
                      >
                        <a href={child.href}>
                          <div className="flex flex-col">
                            <span
                              className="text-[14px] font-medium"
                              style={{ fontFamily: "var(--font-manrope)" }}
                            >
                              {child.label}
                            </span>
                            {child.description ? (
                              <span
                                className="text-[12px] text-white/50"
                                style={{ fontFamily: "var(--font-inter)" }}
                              >
                                {child.description}
                              </span>
                            ) : null}
                          </div>
                        </a>
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                <motion.a
                  key={link.label}
                  href={link.href}
                  whileHover={{ y: -1 }}
                  transition={{ type: "spring", stiffness: 400, damping: 25 }}
                  className="group relative inline-flex items-center gap-1 rounded-lg px-3.5 py-2 text-white/85 text-[14px] font-medium transition-colors duration-200 hover:text-white"
                  style={{ fontFamily: "var(--font-manrope)" }}
                >
                  {link.label}
                  {/* Animated underline */}
                  <span
                    aria-hidden="true"
                    className="pointer-events-none absolute bottom-1 left-3.5 right-3.5 h-px bg-gradient-to-r from-transparent via-[#7b39fc] to-transparent scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-center"
                  />
                </motion.a>
              )
            )}
          </nav>

          {/* Right: Action buttons (desktop only) */}
          <div className="hidden lg:flex items-center gap-2">
            <motion.a
              href="#contact"
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.96 }}
              transition={{ type: "spring", stiffness: 400, damping: 18 }}
              className="rounded-[10px] border border-white/15 bg-white/5 backdrop-blur-sm px-4 py-2 text-white text-[14px] font-semibold transition-colors duration-200 hover:bg-white/10 hover:border-white/30"
              style={{ fontFamily: "var(--font-manrope)" }}
            >
              Espace client
            </motion.a>
            <motion.a
              href="#contact"
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.96 }}
              transition={{ type: "spring", stiffness: 400, damping: 18 }}
              className="group relative inline-flex items-center gap-1.5 rounded-[10px] bg-[#7b39fc] px-4 py-2 text-[#fafafa] text-[14px] font-semibold overflow-hidden transition-colors duration-200 hover:bg-[#8a4dff] hover:shadow-[0_8px_24px_rgba(123,57,252,0.55)]"
              style={{ fontFamily: "var(--font-manrope)" }}
            >
              {/* Sheen effect */}
              <span
                aria-hidden="true"
                className="pointer-events-none absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/30 to-transparent transition-transform duration-700 group-hover:translate-x-full"
              />
              <span className="relative">Lancer un projet</span>
              <motion.span
                className="relative"
                whileHover={{ x: 3 }}
              >
                <ArrowRight
                  className="h-3.5 w-3.5"
                  strokeWidth={2.5}
                  aria-hidden="true"
                />
              </motion.span>
            </motion.a>
          </div>

          {/* Mobile: Hamburger */}
          <button
            type="button"
            onClick={() => setMobileOpen(true)}
            aria-label="Ouvrir le menu"
            aria-expanded={mobileOpen}
            aria-controls="mobile-menu"
            className="lg:hidden inline-flex items-center justify-center rounded-lg p-2 text-white transition-colors hover:bg-white/5"
          >
            <Menu className="h-5 w-5" strokeWidth={2} aria-hidden="true" />
          </button>
        </div>
      </header>

      {/* Mobile fullscreen overlay menu */}
      {mobileOpen && (
        <div
          id="mobile-menu"
          ref={mobileMenuRef}
          role="dialog"
          aria-modal="true"
          aria-label="Menu de navigation mobile"
          className="fixed inset-0 z-50 bg-[#2b2344] flex flex-col"
        >
          {/* Top bar */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-white/10">
            <VectraLogo />
            <button
              type="button"
              onClick={closeMobile}
              aria-label="Fermer le menu"
              className="inline-flex items-center justify-center rounded-lg p-2 text-white transition-colors hover:bg-white/5"
            >
              <X className="h-5 w-5" strokeWidth={2} aria-hidden="true" />
            </button>
          </div>

          {/* Links */}
          <ul
            className="flex flex-col gap-2 px-6 mt-8"
            style={{ fontFamily: "var(--font-manrope)" }}
          >
            {NAV_LINKS.map((link, i) => (
              <li
                key={link.label}
                style={{
                  animation: `slideIn 0.4s ease ${i * 0.06}s both`,
                }}
              >
                <a
                  href={link.href}
                  onClick={closeMobile}
                  className="group flex items-center justify-between rounded-xl px-4 py-4 text-white text-2xl font-medium border border-transparent transition-all duration-200 hover:bg-white/5 hover:border-white/10"
                >
                  <span className="flex items-center gap-2">
                    {link.label}
                    {link.hasDropdown && (
                      <ChevronDown
                        className="h-5 w-5 text-white/40"
                        strokeWidth={2}
                        aria-hidden="true"
                      />
                    )}
                  </span>
                  <ArrowRight
                    className="h-5 w-5 text-white/40 transition-all duration-200 group-hover:text-white group-hover:translate-x-1"
                    strokeWidth={2}
                    aria-hidden="true"
                  />
                </a>
              </li>
            ))}
          </ul>

          {/* Action buttons */}
          <div className="flex flex-col gap-3 px-6 mt-auto pb-10">
            <a
              href="#contact"
              onClick={closeMobile}
              className="rounded-[10px] border border-white/15 bg-white/5 px-4 py-3.5 text-white text-[14px] font-semibold text-center"
              style={{ fontFamily: "var(--font-manrope)" }}
            >
              Espace client
            </a>
            <a
              href="#contact"
              onClick={closeMobile}
              className="inline-flex items-center justify-center gap-1.5 rounded-[10px] bg-[#7b39fc] px-4 py-3.5 text-[#fafafa] text-[14px] font-semibold shadow-[0_8px_24px_rgba(123,57,252,0.35)]"
              style={{ fontFamily: "var(--font-manrope)" }}
            >
              Lancer un projet
              <ArrowRight className="h-4 w-4" strokeWidth={2.5} aria-hidden="true" />
            </a>
          </div>

          <style>{`
            @keyframes slideIn {
              from { opacity: 0; transform: translateX(-12px); }
              to { opacity: 1; transform: translateX(0); }
            }
          `}</style>
        </div>
      )}
    </>
  );
}
