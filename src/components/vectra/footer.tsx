"use client";

import { Twitter, Linkedin, Github, Dribbble } from "lucide-react";

const FOOTER_LINKS = [
  {
    title: "Services",
    links: [
      { label: "Développement web", href: "#work" },
      { label: "Design UI/UX", href: "#work" },
      { label: "E-commerce", href: "#work" },
      { label: "Performance", href: "#work" },
    ],
  },
  {
    title: "Studio",
    links: [
      { label: "Nos réalisations", href: "#gallery" },
      { label: "Notre méthode", href: "#process" },
      { label: "Carrières", href: "#contact" },
      { label: "Contact", href: "#contact" },
    ],
  },
  {
    title: "Ressources",
    links: [
      { label: "Blog", href: "#" },
      { label: "Études de cas", href: "#gallery" },
      { label: "Espace client", href: "#contact" },
      { label: "Support", href: "#contact" },
    ],
  },
];

const SOCIALS = [
  { icon: Twitter, label: "Twitter / X", href: "#" },
  { icon: Linkedin, label: "LinkedIn", href: "#" },
  { icon: Github, label: "GitHub", href: "#" },
  { icon: Dribbble, label: "Dribbble", href: "#" },
];

export default function Footer() {
  return (
    <footer className="relative w-full bg-[#2b2344] px-6 lg:px-[120px] pt-16 pb-10" aria-labelledby="footer-heading">
      <h2 id="footer-heading" className="sr-only">Pied de page</h2>
      <div className="max-w-[1200px] mx-auto">
        {/* Top: brand + link columns */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-10 lg:gap-12 pb-12 border-b border-white/10">
          {/* Brand */}
          <div className="col-span-2 flex flex-col gap-5 max-w-xs">
            <div className="flex items-center gap-2">
              <svg
                width="28"
                height="28"
                viewBox="0 0 32 32"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                aria-hidden="true"
              >
                <defs>
                  <linearGradient id="vectra-footer-logo-gradient" x1="0" y1="0" x2="32" y2="32" gradientUnits="userSpaceOnUse">
                    <stop stopColor="#7b39fc" />
                    <stop offset="1" stopColor="#5b2db8" />
                  </linearGradient>
                </defs>
                <rect width="32" height="32" rx="8" fill="url(#vectra-footer-logo-gradient)" />
                <path
                  d="M8 10 L16 23 L24 10"
                  stroke="white"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  fill="none"
                />
              </svg>
              <span
                className="text-white text-[20px] font-semibold tracking-tight"
                style={{ fontFamily: "var(--font-manrope)" }}
              >
                Vectra
              </span>
            </div>
            <p
              className="text-white/65 text-[14px] leading-relaxed"
              style={{ fontFamily: "var(--font-inter)" }}
            >
              Une agence de développement web premium. Nous concevons, développons
              et lançons des sites web et applications sur mesure pour les équipes
              ambitieuses.
            </p>
            <nav aria-label="Réseaux sociaux" className="flex items-center gap-2 mt-1">
              {SOCIALS.map((s) => {
                const Icon = s.icon;
                return (
                  <a
                    key={s.label}
                    href={s.href}
                    aria-label={s.label}
                    className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-white/10 bg-white/[0.03] text-white/75 transition-all duration-200 hover:bg-[#7b39fc] hover:text-white hover:border-[#7b39fc]"
                  >
                    <Icon className="h-4 w-4" strokeWidth={1.75} aria-hidden="true" />
                  </a>
                );
              })}
            </nav>
          </div>

          {/* Link columns */}
          {FOOTER_LINKS.map((col) => (
            <nav key={col.title} aria-label={col.title} className="flex flex-col gap-3.5">
              <h3
                className="text-white text-[13px] font-semibold uppercase tracking-wider mb-1"
                style={{ fontFamily: "var(--font-manrope)" }}
              >
                {col.title}
              </h3>
              {col.links.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  className="text-white/65 text-[14px] transition-colors duration-200 hover:text-white"
                  style={{ fontFamily: "var(--font-inter)" }}
                >
                  {link.label}
                </a>
              ))}
            </nav>
          ))}
        </div>

        {/* Bottom: legal */}
        <div
          className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 pt-8"
          style={{ fontFamily: "var(--font-inter)" }}
        >
          <p className="text-white/60 text-[13px]">
            © {new Date().getFullYear()} Studio Vectra. Tous droits réservés.
          </p>
          <nav aria-label="Mentions légales" className="flex items-center gap-6">
            <a
              href="#"
              className="text-white/60 text-[13px] hover:text-white transition-colors"
            >
              Politique de confidentialité
            </a>
            <a
              href="#"
              className="text-white/60 text-[13px] hover:text-white transition-colors"
            >
              Conditions d'utilisation
            </a>
            <a
              href="#"
              className="text-white/60 text-[13px] hover:text-white transition-colors"
            >
              Cookies
            </a>
          </nav>
        </div>
      </div>
    </footer>
  );
}
