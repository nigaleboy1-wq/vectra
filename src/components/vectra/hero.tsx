'use client';

import { motion, useReducedMotion } from "framer-motion";

const VIDEO_URL =
  "https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260210_031346_d87182fb-b0af-4273-84d1-c6fd17d6bf0f.mp4";

// Staggered reveal for the headline lines
const lineParent = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.12, delayChildren: 0.15 },
  },
};
const lineChild = (reduce: boolean) => ({
  hidden: { opacity: 0, y: reduce ? 0 : 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: reduce ? 0 : 0.8, ease: [0.22, 1, 0.36, 1] as const },
  },
});

export default function Hero() {
  const reduce = useReducedMotion() ?? false;

  return (
    <section
      id="home"
      className="relative min-h-screen w-full overflow-hidden bg-[#2b2344]"
      aria-label="Hero Vectra"
    >
      {/* Full-screen video background — decorative */}
      <video
        className="absolute inset-0 h-full w-full object-cover"
        autoPlay
        loop
        muted
        playsInline
        preload="auto"
        aria-hidden="true"
      >
        <source src={VIDEO_URL} type="video/mp4" />
      </video>

      {/* Full-coverage dark scrim — uniform opacity for readability across all breakpoints */}
      <div
        aria-hidden="true"
        className="absolute inset-0 z-[5]"
        style={{
          background:
            "linear-gradient(180deg, rgba(26,21,48,0.82) 0%, rgba(26,21,48,0.88) 50%, rgba(26,21,48,0.95) 100%)",
        }}
      />

      {/* Subtle radial accent — adds depth without sacrificing contrast */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 z-[5]"
        style={{
          background:
            "radial-gradient(ellipse 70% 60% at 30% 40%, rgba(123,57,252,0.18) 0%, transparent 60%)",
        }}
      />

      {/* Bottom gradient fade — smooth transition into next section */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 bottom-0 h-48 z-[6]"
        style={{
          background:
            "linear-gradient(to bottom, transparent 0%, rgba(43,35,68,0.6) 60%, #2b2344 100%)",
        }}
      />

      {/* Hero content */}
      <div
        id="main-content"
        className="relative z-10 min-h-screen flex flex-col"
      >
        {/* Top meta strip — centered on mobile, left on desktop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: reduce ? 0 : 0.6 }}
          className="px-6 lg:px-[120px] pt-28 lg:pt-32 text-center lg:text-left"
        >
          <p
            className="text-white/70 text-[13px] tracking-wider uppercase"
            style={{ fontFamily: "var(--font-manrope)" }}
          >
            Studio Vectra
            <span aria-hidden="true" className="mx-2 text-white/30">·</span>
            Agence de développement web
            <span aria-hidden="true" className="mx-2 text-white/30">·</span>
            Depuis 2021
          </p>
        </motion.div>

        {/* Main editorial grid — centered column on mobile, asymmetric on desktop */}
        <div className="flex-1 px-6 lg:px-[120px] flex flex-col lg:flex-row items-center lg:items-end gap-10 lg:gap-16 py-12 lg:py-20">
          {/* Left: oversized headline — centered on mobile */}
          <motion.div
            variants={lineParent}
            initial="hidden"
            animate="visible"
            className="flex-1 max-w-[820px] flex flex-col items-center lg:items-start text-center lg:text-left"
          >
            <h1
              className="text-white leading-[0.98] tracking-[-0.025em]"
              style={{
                fontFamily: "var(--font-instrument-serif)",
                fontSize: "clamp(2.75rem, 11vw, 7.5rem)",
              }}
            >
              <motion.span variants={lineChild(reduce)} className="block">
                Nous concevons le
              </motion.span>
              <motion.span variants={lineChild(reduce)} className="block">
                site web que votre{" "}
                <em className="italic font-normal text-[#c4a4ff]">produit</em>
              </motion.span>
              <motion.span variants={lineChild(reduce)} className="block">
                mérite réellement.
              </motion.span>
            </h1>

            <motion.p
              initial={{ opacity: 0, y: reduce ? 0 : 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: reduce ? 0 : 0.7, delay: 0.7 }}
              className="mt-8 max-w-[520px] text-white/80 text-[17px] leading-relaxed"
              style={{ fontFamily: "var(--font-inter)" }}
            >
              Des solutions web sur mesure, des applications personnalisées et
              des expériences numériques fluides — conçues avec un développement
              de pointe, une livraison rapide et un support dédié pour votre
              présence en ligne.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: reduce ? 0 : 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: reduce ? 0 : 0.7, delay: 0.85 }}
              className="mt-9 w-full max-w-[420px] lg:max-w-none flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-4"
            >
              <a
                href="#contact"
                className="rounded-[10px] bg-[#7b39fc] px-7 py-3.5 text-white text-[16px] font-medium text-center sm:text-left transition-all duration-200 hover:bg-[#8a4dff] hover:shadow-[0_10px_30px_rgba(123,57,252,0.45)]"
                style={{ fontFamily: "var(--font-cabin)" }}
              >
                Réserver une consultation gratuite
              </a>
              <a
                href="#gallery"
                className="rounded-[10px] border border-white/25 bg-transparent px-7 py-3.5 text-white text-[16px] font-medium text-center sm:text-left transition-all duration-200 hover:bg-white/10 hover:border-white/40"
                style={{ fontFamily: "var(--font-cabin)" }}
              >
                Voir nos réalisations
              </a>
            </motion.div>
          </motion.div>

          {/* Right: field-log card */}
          <motion.aside
            initial={{ opacity: 0, x: reduce ? 0 : 40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{
              duration: reduce ? 0 : 0.9,
              delay: 0.5,
              ease: [0.22, 1, 0.36, 1],
            }}
            aria-label="Journal de bord du studio"
            className="w-full max-w-[420px] lg:max-w-none lg:w-[300px] shrink-0 rounded-xl border border-white/15 bg-[rgba(26,21,48,0.55)] backdrop-blur-md p-6"
          >
            <div
              className="flex items-center justify-between text-[11px] uppercase tracking-wider text-white/55 pb-3 border-b border-white/10"
              style={{ fontFamily: "var(--font-manrope)" }}
            >
              <span>Journal de bord</span>
              <time dateTime="2026-W27">S27 · 2026</time>
            </div>

            <dl className="mt-4 space-y-3">
              <div className="flex items-baseline justify-between gap-3">
                <dt
                  className="text-white/60 text-[13px]"
                  style={{ fontFamily: "var(--font-manrope)" }}
                >
                  En cours de création
                </dt>
                <dd
                  className="text-white text-[14px] font-medium text-right"
                  style={{ fontFamily: "var(--font-inter)" }}
                >
                  3 sites web
                </dd>
              </div>
              <div className="flex items-baseline justify-between gap-3">
                <dt
                  className="text-white/60 text-[13px]"
                  style={{ fontFamily: "var(--font-manrope)" }}
                >
                  Livrés cette année
                </dt>
                <dd
                  className="text-white text-[14px] font-medium text-right"
                  style={{ fontFamily: "var(--font-inter)" }}
                >
                  18 projets
                </dd>
              </div>
              <div className="flex items-baseline justify-between gap-3">
                <dt
                  className="text-white/60 text-[13px]"
                  style={{ fontFamily: "var(--font-manrope)" }}
                >
                  Prochaine disponibilité
                </dt>
                <dd
                  className="text-white text-[14px] font-medium text-right"
                  style={{ fontFamily: "var(--font-inter)" }}
                >
                  Septembre
                </dd>
              </div>
            </dl>

            <div className="mt-5 pt-4 border-t border-white/10 flex items-center gap-2">
              <span
                aria-hidden="true"
                className="relative inline-flex h-2 w-2"
              >
                <span className="absolute inline-flex h-full w-full rounded-full bg-[#7b39fc] opacity-60 animate-ping" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-[#7b39fc]" />
              </span>
              <span
                className="text-white/80 text-[12px]"
                style={{ fontFamily: "var(--font-inter)" }}
              >
                Nous prenons 2 nouveaux projets
              </span>
            </div>
          </motion.aside>
        </div>
      </div>
    </section>
  );
}
