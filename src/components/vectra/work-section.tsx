"use client";

import { useRef, useState, useEffect, useCallback } from "react";
import { motion, useMotionValue, useTransform, animate, useReducedMotion } from "framer-motion";
import { ArrowUpRight, ArrowLeft, ArrowRight } from "lucide-react";
import { Reveal } from "./animations";
import { useSectionTracking, trackCtaClick } from "./analytics";

type Project = {
  title: string;
  description: string;
  /** Lucide icon component rendered in the circular graphic */
  icon: React.ComponentType<{ className?: string; strokeWidth?: number }>;
};

const PROJECTS: Project[] = [
  {
    title: "Conception web sur mesure",
    description:
      "Des sites web sur mesure, conçus pour convertir et refléter votre marque, qui captivent votre audience dès le premier scroll.",
    icon: ({ className, strokeWidth }) => (
      <svg
        className={className}
        viewBox="0 0 64 64"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        strokeWidth={strokeWidth}
      >
        <rect
          x="6"
          y="12"
          width="52"
          height="40"
          rx="4"
          stroke="currentColor"
        />
        <path d="M6 22 H58" stroke="currentColor" />
        <circle cx="12" cy="17" r="1.4" fill="currentColor" />
        <circle cx="17" cy="17" r="1.4" fill="currentColor" />
        <circle cx="22" cy="17" r="1.4" fill="currentColor" />
        <path
          d="M16 32 H40 M16 38 H48 M16 44 H34"
          stroke="currentColor"
          strokeLinecap="round"
          opacity="0.7"
        />
      </svg>
    ),
  },
  {
    title: "E-commerce & applications web",
    description:
      "Boutiques headless, tableaux de bord et produits SaaS conçus pour la vitesse, l'évolutivité et une expérience utilisateur sans faille.",
    icon: ({ className, strokeWidth }) => (
      <svg
        className={className}
        viewBox="0 0 64 64"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        strokeWidth={strokeWidth}
      >
        <path
          d="M8 14 H56 V40 H8 Z"
          stroke="currentColor"
          strokeLinejoin="round"
        />
        <path d="M8 20 H56" stroke="currentColor" />
        <path
          d="M22 48 L18 54 H46 L42 48"
          stroke="currentColor"
          strokeLinejoin="round"
          strokeLinecap="round"
        />
        <circle cx="22" cy="58" r="2.5" stroke="currentColor" />
        <circle cx="42" cy="58" r="2.5" stroke="currentColor" />
        <path
          d="M28 28 L24 32 L28 36 M36 28 L40 32 L36 36"
          stroke="currentColor"
          strokeLinecap="round"
          strokeLinejoin="round"
          opacity="0.8"
        />
      </svg>
    ),
  },
  {
    title: "Branding & stratégie UX",
    description:
      "Des wireframes aux prototypes haute-fidélité, nous concevons des interfaces et des identités qui sont aussi agréables à utiliser qu'à regarder.",
    icon: ({ className, strokeWidth }) => (
      <svg
        className={className}
        viewBox="0 0 64 64"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        strokeWidth={strokeWidth}
      >
        <path
          d="M14 50 L26 38 L38 50 L26 56 Z"
          stroke="currentColor"
          strokeLinejoin="round"
        />
        <path
          d="M26 38 L48 16 L52 20 L30 42"
          stroke="currentColor"
          strokeLinejoin="round"
        />
        <path
          d="M22 44 L26 48"
          stroke="currentColor"
          strokeLinecap="round"
        />
        <path
          d="M48 12 L48 8 M48 12 L52 12 M48 12 L44 12"
          stroke="currentColor"
          strokeLinecap="round"
        />
        <path
          d="M14 14 L16 16 L14 18 L12 16 Z"
          stroke="currentColor"
          strokeLinejoin="round"
          opacity="0.7"
        />
      </svg>
    ),
  },
  {
    title: "Design UI/UX",
    description:
      "Des interfaces centrées utilisateur, validées par la recherche, les tests et l'accessibilité. Des parcours élégants qui convertissent les visiteurs en clients.",
    icon: ({ className, strokeWidth }) => (
      <svg
        className={className}
        viewBox="0 0 64 64"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        strokeWidth={strokeWidth}
      >
        <path
          d="M14 12 H50 V40 C50 48 44 52 36 52 H14 Z"
          stroke="currentColor"
          strokeLinejoin="round"
        />
        <path d="M14 12 V52" stroke="currentColor" />
        <circle cx="22" cy="20" r="2" fill="currentColor" />
        <circle cx="30" cy="20" r="2" fill="currentColor" opacity="0.7" />
        <circle cx="38" cy="20" r="2" fill="currentColor" opacity="0.5" />
        <path
          d="M22 30 H42 M22 36 H38 M22 42 H34"
          stroke="currentColor"
          strokeLinecap="round"
          opacity="0.6"
        />
      </svg>
    ),
  },
  {
    title: "Expériences mobile-first",
    description:
      "Chaque produit que nous livrons est responsive par défaut. Nous concevons et développons des parcours mobile-first qui se chargent vite et semblent natifs sur tout appareil.",
    icon: ({ className, strokeWidth }) => (
      <svg
        className={className}
        viewBox="0 0 64 64"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        strokeWidth={strokeWidth}
      >
        <rect
          x="20"
          y="6"
          width="24"
          height="52"
          rx="4"
          stroke="currentColor"
        />
        <path d="M20 14 H44 M20 50 H44" stroke="currentColor" />
        <circle cx="32" cy="10" r="1" fill="currentColor" />
        <path
          d="M25 20 H39 M25 26 H39 M25 32 H35"
          stroke="currentColor"
          strokeLinecap="round"
          opacity="0.7"
        />
        <rect
          x="25"
          y="40"
          width="14"
          height="6"
          rx="1.5"
          stroke="currentColor"
          opacity="0.8"
        />
      </svg>
    ),
  },
  {
    title: "SEO & analytique",
    description:
      "SEO technique, données structurées et tableaux de bord analytiques. Nous nous assurons que les bonnes personnes vous trouvent — et que vous puissiez le mesurer.",
    icon: ({ className, strokeWidth }) => (
      <svg
        className={className}
        viewBox="0 0 64 64"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        strokeWidth={strokeWidth}
      >
        <circle cx="22" cy="22" r="10" stroke="currentColor" />
        <path
          d="M29 29 L42 42"
          stroke="currentColor"
          strokeLinecap="round"
        />
        <path
          d="M17 22 V26 M22 22 V30 M27 22 V24"
          stroke="currentColor"
          strokeLinecap="round"
          opacity="0.85"
        />
        <path
          d="M44 36 V52 M50 32 V52 M56 40 V52"
          stroke="currentColor"
          strokeLinecap="round"
        />
      </svg>
    ),
  },
  {
    title: "Optimisation des performances",
    description:
      "Temps de chargement sous la seconde, scores Lighthouse parfaits et Core Web Vitals au vert. La vitesse est une fonctionnalité — et nous la livrons.",
    icon: ({ className, strokeWidth }) => (
      <svg
        className={className}
        viewBox="0 0 64 64"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        strokeWidth={strokeWidth}
      >
        <path
          d="M8 44 A24 24 0 0 1 56 44"
          stroke="currentColor"
          strokeLinecap="round"
        />
        <path
          d="M14 44 A18 18 0 0 1 50 44"
          stroke="currentColor"
          strokeLinecap="round"
          opacity="0.4"
        />
        <path
          d="M32 44 L44 28"
          stroke="currentColor"
          strokeLinecap="round"
        />
        <circle cx="32" cy="44" r="3" fill="currentColor" />
        <path
          d="M8 44 L5 44 M56 44 L59 44 M20 26 L18 23 M44 26 L46 23"
          stroke="currentColor"
          strokeLinecap="round"
          opacity="0.7"
        />
      </svg>
    ),
  },
];

export default function WorkSection() {
  const trackRef = useRef<HTMLDivElement>(null);
  const viewportRef = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);
  const reduceMotion = useReducedMotion();
  const [maxScroll, setMaxScroll] = useState(0);
  const [activeIndex, setActiveIndex] = useState(0);
  const [atStart, setAtStart] = useState(true);
  const [atEnd, setAtEnd] = useState(false);

  // Recompute scroll bounds on resize / mount
  useEffect(() => {
    const compute = () => {
      const track = trackRef.current;
      if (!track) return;
      const trackWidth = track.scrollWidth;
      const viewportWidth = track.clientWidth;
      const ms = Math.max(0, trackWidth - viewportWidth);
      setMaxScroll(ms);
      // Re-evaluate atEnd based on current x
      const currentX = x.get();
      setAtStart(currentX >= -4);
      setAtEnd(-currentX >= ms - 4);
    };
    compute();
    window.addEventListener("resize", compute);
    return () => window.removeEventListener("resize", compute);
  }, [x]);

  // Track active index + edge states based on x position
  useEffect(() => {
    const unsub = x.on("change", (latest) => {
      const track = trackRef.current;
      if (!track) return;
      const card = track.querySelector<HTMLElement>("[data-card]");
      if (!card) return;
      const cardWidth = card.offsetWidth + 24; // gap-6 = 24px
      const idx = Math.min(
        PROJECTS.length - 1,
        Math.max(0, Math.round(-latest / cardWidth))
      );
      setActiveIndex(idx);
      setAtStart(latest >= -4);
      setAtEnd(-latest >= maxScroll - 4);
    });
    return () => unsub();
  }, [x, maxScroll]);

  const scrollToIndex = useCallback(
    (idx: number) => {
      const clamped = Math.max(0, Math.min(PROJECTS.length - 1, idx));
      const track = trackRef.current;
      if (!track) return;
      const card = track.querySelector<HTMLElement>("[data-card]");
      if (!card) return;
      const cardWidth = card.offsetWidth + 24;
      const target = Math.min(maxScroll, clamped * cardWidth);
      animate(x, -target, {
        type: "spring",
        stiffness: reduceMotion ? 1000 : 180,
        damping: reduceMotion ? 100 : 26,
        mass: 0.8,
      });
      // Move focus to the target card WITHOUT scrolling the page (preventScroll: true)
      const targetCard = track.querySelectorAll<HTMLElement>("[data-card]")[clamped];
      targetCard?.focus({ preventScroll: true });
    },
    [maxScroll, reduceMotion, x]
  );

  const handlePrev = useCallback(() => {
    scrollToIndex(activeIndex - 1);
  }, [activeIndex, scrollToIndex]);

  const handleNext = useCallback(() => {
    scrollToIndex(activeIndex + 1);
  }, [activeIndex, scrollToIndex]);

  // Keyboard navigation: when carousel viewport is focused, Left/Right move
  const onKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === "ArrowLeft") {
        e.preventDefault();
        handlePrev();
      } else if (e.key === "ArrowRight") {
        e.preventDefault();
        handleNext();
      } else if (e.key === "Home") {
        e.preventDefault();
        scrollToIndex(0);
      } else if (e.key === "End") {
        e.preventDefault();
        scrollToIndex(PROJECTS.length - 1);
      }
    },
    [handlePrev, handleNext, scrollToIndex]
  );

  // Faux gradient fade on the right edge to hint at more content
  const opacityRight = useTransform(x, (latest) => {
    if (maxScroll === 0) return 0;
    return -latest > maxScroll - 40 ? 0 : 1;
  });
  const opacityLeft = useTransform(x, (latest) => {
    if (maxScroll === 0) return 0;
    return -latest < 40 ? 0 : 1;
  });

  return (
    <section
      id="work"
      className="relative w-full bg-[#2b2344] py-24 lg:py-32 px-6 lg:px-[120px]"
    >
      {/* Top glow */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 h-96 opacity-80"
        style={{
          background:
            "radial-gradient(ellipse 70% 80% at 50% 0%, rgba(123,57,252,0.30) 0%, transparent 70%)",
        }}
      />

      <div className="relative max-w-[1280px] mx-auto">
        {/* Header row: title (left) + controls (right) */}
        <Reveal className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6 mb-14">
          <div className="flex flex-col items-start max-w-xl">
            <span
              className="inline-flex items-center rounded-full border border-[rgba(164,132,215,0.4)] bg-[rgba(123,57,252,0.15)] px-3 py-1 text-[12px] font-medium text-white/90 mb-5"
              style={{ fontFamily: "var(--font-cabin)" }}
            >
              Ce que nous créons
            </span>
            <h2
              className="text-white text-4xl md:text-5xl lg:text-6xl leading-[1.1] tracking-[-0.02em] mb-4"
              style={{ fontFamily: "var(--font-instrument-serif)" }}
            >
              {"Construire avec Vectra, c'est "}<em className="italic">simple</em>
            </h2>
            <p
              className="text-white/70 text-[17px] leading-relaxed"
              style={{ fontFamily: "var(--font-inter)" }}
            >
              Vectra simplifie la conception, le développement et le lancement
              de votre site web — pour que vous puissiez vous concentrer sur
              votre activité, pas sur la construction.
            </p>
          </div>

          {/* Arrow controls (desktop) */}
          <div className="hidden lg:flex items-center gap-2">
            <button
              type="button"
              onClick={handlePrev}
              disabled={atStart}
              aria-label={`Service précédent (actuellement ${activeIndex + 1} sur ${PROJECTS.length})`}
              className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-white/15 bg-white/[0.04] text-white transition-all duration-200 hover:bg-white/10 hover:border-[rgba(164,132,215,0.5)] disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:bg-white/[0.04] disabled:hover:border-white/15"
            >
              <ArrowLeft className="h-4 w-4" strokeWidth={2} aria-hidden="true" />
            </button>
            <button
              type="button"
              onClick={handleNext}
              disabled={atEnd}
              aria-label={`Service suivant (actuellement ${activeIndex + 1} sur ${PROJECTS.length})`}
              className="inline-flex h-11 w-11 items-center justify-center rounded-full bg-[#7b39fc] text-white transition-all duration-200 hover:bg-[#8a4dff] hover:shadow-[0_8px_24px_rgba(123,57,252,0.45)] disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:bg-[#7b39fc] disabled:hover:shadow-none"
            >
              <ArrowRight className="h-4 w-4" strokeWidth={2} aria-hidden="true" />
            </button>
          </div>
        </Reveal>

        {/* Carousel viewport */}
        <div
          ref={viewportRef}
          className="relative overflow-hidden"
          role="region"
          aria-roledescription="carousel"
          aria-label="Carrousel de services — utilisez les flèches pour naviguer"
          tabIndex={0}
          onKeyDown={onKeyDown}
        >
          {/* Left fade */}
          <motion.div
            aria-hidden="true"
            style={{ opacity: opacityLeft }}
            className="pointer-events-none absolute left-0 top-0 bottom-0 z-10 w-16 bg-gradient-to-r from-[#2b2344] to-transparent"
          />
          {/* Right fade */}
          <motion.div
            aria-hidden="true"
            style={{ opacity: opacityRight }}
            className="pointer-events-none absolute right-0 top-0 bottom-0 z-10 w-16 bg-gradient-to-l from-[#2b2344] to-transparent"
          />

          {/* Draggable track */}
          <motion.div
            ref={trackRef}
            drag="x"
            dragConstraints={{ left: -maxScroll, right: 0 }}
            dragElastic={0.08}
            dragTransition={{ power: 0.2, timeConstant: 200, modifyTarget: (t) => Math.round(t) }}
            style={{ x, touchAction: "pan-y" } as React.CSSProperties}
            className="flex gap-6 cursor-grab active:cursor-grabbing"
          >
            {PROJECTS.map((project, i) => {
              const Icon = project.icon;
              const isActive = i === activeIndex;
              return (
                <motion.a
                  key={project.title}
                  href="#contact"
                  data-card
                  tabIndex={0}
                  role="group"
                  aria-roledescription="slide"
                  aria-label={`Service ${i + 1} sur ${PROJECTS.length} : ${project.title}`}
                  animate={{
                    scale: isActive ? 1 : 0.94,
                    opacity: isActive ? 1 : 0.6,
                  }}
                  whileHover={{ y: -8, scale: isActive ? 1.02 : 0.96, opacity: 1 }}
                  whileTap={{ scale: 0.96 }}
                  transition={{ type: "spring", stiffness: 250, damping: 22 }}
                  className="group relative flex flex-col items-center text-center overflow-hidden rounded-2xl border bg-gradient-to-b from-white/[0.06] to-white/[0.02] p-8 lg:p-9 shrink-0 w-[300px] sm:w-[340px] lg:w-[360px] shadow-[0_4px_20px_rgba(0,0,0,0.15)]"
                  style={{
                    borderColor: isActive
                      ? "rgba(164,132,215,0.7)"
                      : "rgba(255,255,255,0.10)",
                    boxShadow: isActive
                      ? "0 24px 60px rgba(123,57,252,0.35), 0 0 0 1px rgba(164,132,215,0.3) inset"
                      : "0 4px 20px rgba(0,0,0,0.15)",
                  }}
                >
                  {/* Top accent line — appears on hover */}
                  <span
                    aria-hidden="true"
                    className="pointer-events-none absolute top-0 left-1/2 -translate-x-1/2 h-[2px] w-0 bg-gradient-to-r from-transparent via-[#7b39fc] to-transparent transition-all duration-500 group-hover:w-full"
                  />
                  {/* Inner radial glow (subtle, base state) */}
                  <div
                    aria-hidden="true"
                    className="pointer-events-none absolute inset-0 opacity-80"
                    style={{
                      background:
                        "radial-gradient(ellipse 80% 60% at 50% 0%, rgba(123,57,252,0.15) 0%, transparent 60%)",
                    }}
                  />
                  {/* Hover glow boost */}
                  <motion.div
                    aria-hidden="true"
                    className="pointer-events-none absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                    style={{
                      background:
                        "radial-gradient(ellipse 100% 70% at 50% 25%, rgba(123,57,252,0.28) 0%, transparent 65%)",
                    }}
                  />

                  {/* Icon graphic (centered, with circular violet glow) */}
                  <div className="relative mb-6">
                    {/* Animated halo */}
                    <motion.div
                      aria-hidden="true"
                      className="absolute inset-0 -m-5 rounded-full blur-xl"
                      animate={{
                        background: [
                          "radial-gradient(circle, rgba(123,57,252,0.30) 0%, transparent 70%)",
                          "radial-gradient(circle, rgba(123,57,252,0.55) 0%, transparent 70%)",
                          "radial-gradient(circle, rgba(123,57,252,0.30) 0%, transparent 70%)",
                        ],
                      }}
                      transition={{
                        duration: 3,
                        repeat: Infinity,
                        ease: "easeInOut",
                        delay: i * 0.4,
                      }}
                    />
                    <motion.div
                      className="relative inline-flex h-20 w-20 items-center justify-center rounded-full border border-[rgba(164,132,215,0.5)] bg-[rgba(123,57,252,0.15)] text-[#c4a4ff] transition-colors duration-300 group-hover:bg-[#7b39fc] group-hover:text-white group-hover:border-[#a484d7]"
                      whileHover={{ scale: 1.08, rotate: 2 }}
                      transition={{ type: "spring", stiffness: 350, damping: 18 }}
                    >
                      <Icon className="h-10 w-10" strokeWidth={1.5} />
                    </motion.div>
                  </div>

                  {/* Title */}
                  <h3
                    className="relative text-white text-xl lg:text-[22px] font-semibold mb-3"
                    style={{ fontFamily: "var(--font-manrope)" }}
                  >
                    {project.title}
                  </h3>

                  {/* Description */}
                  <p
                    className="relative text-white/75 text-[14.5px] leading-relaxed max-w-[280px] transition-colors duration-300 group-hover:text-white/85"
                    style={{ fontFamily: "var(--font-inter)" }}
                  >
                    {project.description}
                  </p>

                  {/* Tiny index marker — animated underline on hover */}
                  <span
                    aria-hidden="true"
                    className="relative mt-6 inline-flex flex-col items-center gap-1.5 text-[11px] font-medium tracking-wider text-[#a484d7] uppercase transition-colors duration-300 group-hover:text-[#c4a4ff]"
                    style={{ fontFamily: "var(--font-cabin)" }}
                  >
                    0{i + 1} — Explorer
                    <span className="block h-px w-0 bg-[#7b39fc] transition-all duration-400 group-hover:w-12" />
                  </span>

                  {/* Hover arrow (top-right corner) — magnetic */}
                  <motion.div
                    className="absolute top-5 right-5 inline-flex h-9 w-9 items-center justify-center rounded-full bg-white/5 border border-white/15 text-white/70 backdrop-blur-sm opacity-0 -translate-y-1 transition-all duration-300 group-hover:opacity-100 group-hover:translate-y-0 group-hover:bg-[#7b39fc] group-hover:text-white group-hover:border-[#7b39fc]"
                    whileHover={{ scale: 1.12 }}
                    whileTap={{ scale: 0.92 }}
                  >
                    <ArrowUpRight className="h-4 w-4" strokeWidth={2} aria-hidden="true" />
                  </motion.div>
                </motion.a>
              );
            })}
          </motion.div>
        </div>

        {/* Progress bar + dots (mobile + desktop) */}
        <div
          className="mt-10 flex items-center justify-center lg:justify-start gap-3"
          role="tablist"
          aria-label="Navigation du carrousel"
        >
          {/* Dots */}
          <div className="flex items-center gap-1.5">
            {PROJECTS.map((p, i) => (
              <button
                key={i}
                type="button"
                role="tab"
                aria-selected={i === activeIndex}
                aria-label={`Aller au service ${i + 1} : ${p.title}`}
                onClick={() => scrollToIndex(i)}
                className={`h-1.5 rounded-full transition-all duration-300 ${
                  i === activeIndex
                    ? "w-8 bg-[#7b39fc]"
                    : "w-1.5 bg-white/30 hover:bg-white/50"
                }`}
              />
            ))}
          </div>
        </div>

        {/* Mobile arrow controls */}
        <div className="flex lg:hidden items-center justify-center gap-2 mt-6">
          <button
            type="button"
            onClick={handlePrev}
            disabled={atStart}
            aria-label="Précédent"
            className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/15 bg-white/[0.04] text-white transition-all duration-200 hover:bg-white/10 disabled:opacity-30 disabled:cursor-not-allowed"
          >
            <ArrowLeft className="h-4 w-4" strokeWidth={2} aria-hidden="true" />
          </button>
          <button
            type="button"
            onClick={handleNext}
            disabled={atEnd}
            aria-label="Suivant"
            className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-[#7b39fc] text-white transition-all duration-200 hover:bg-[#8a4dff] disabled:opacity-30 disabled:cursor-not-allowed"
          >
            <ArrowRight className="h-4 w-4" strokeWidth={2} aria-hidden="true" />
          </button>
        </div>

        {/* Bottom CTA */}
        <Reveal delay={0.1} className="flex justify-center mt-14">
          <a
            href="#contact"
            className="inline-flex items-center gap-2 rounded-[10px] bg-[#7b39fc] px-7 py-3.5 text-white text-[15px] font-medium transition-all duration-200 hover:bg-[#8a4dff] hover:shadow-[0_10px_30px_rgba(123,57,252,0.45)]"
            style={{ fontFamily: "var(--font-cabin)" }}
          >
            Lancer votre projet
            <ArrowUpRight className="h-4 w-4" strokeWidth={2} aria-hidden="true" />
          </a>
        </Reveal>
      </div>
    </section>
  );
}
