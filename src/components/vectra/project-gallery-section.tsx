"use client";

import { useRef, useState, useEffect, useCallback } from "react";
import { motion, useMotionValue, useTransform, animate, useReducedMotion } from "framer-motion";
import { ArrowUpRight, ArrowLeft, ArrowRight } from "lucide-react";
import { Reveal } from "./animations";
import { useSectionTracking, trackCtaClick } from "./analytics";

type Project = {
  title: string;
  category: string;
  description: string;
  mockupGradient: string;
  accent: string;
  domain: string;
  year: string;
};

const PROJECTS: Project[] = [
  {
    title: "Lumen Finance",
    category: "Fintech · Application web",
    description:
      "Un tableau de bord bancaire moderne avec analytique en temps réel, authentification biométrique et transitions de page sous 200ms.",
    mockupGradient: "linear-gradient(135deg, #7b39fc 0%, #2b2344 100%)",
    accent: "#c4a4ff",
    domain: "lumen.finance",
    year: "2025",
  },
  {
    title: "Atlas Studio",
    category: "Créatif · Portfolio",
    description:
      "Un portfolio primé pour un studio de design berlinois — transitions WebGL et CMS sur mesure.",
    mockupGradient: "linear-gradient(135deg, #2b2344 0%, #7b39fc 100%)",
    accent: "#c4a4ff",
    domain: "atlas.studio",
    year: "2025",
  },
  {
    title: "Nimbus Commerce",
    category: "E-commerce · Headless",
    description:
      "Boutique Shopify headless avec LCP de 1,2s et un checkout personnalisé qui a augmenté le panier moyen de 22%.",
    mockupGradient: "linear-gradient(135deg, #a484d7 0%, #2b2344 100%)",
    accent: "#7b39fc",
    domain: "nimbus.shop",
    year: "2024",
  },
  {
    title: "Pulse Health",
    category: "SaaS · Santé",
    description:
      "Un portail patient connectant 14 cliniques. Conforme HIPAA, WCAG AA, 99,98% de disponibilité.",
    mockupGradient: "linear-gradient(135deg, #2b2344 0%, #5b2db8 100%)",
    accent: "#c4a4ff",
    domain: "pulse.health",
    year: "2024",
  },
  {
    title: "Orbit Labs",
    category: "IA · Outils développeur",
    description:
      "Une plateforme développeur avec playground API en direct, recherche de docs par IA et un bac à sable de code sur mesure.",
    mockupGradient: "linear-gradient(135deg, #5b2db8 0%, #2b2344 100%)",
    accent: "#7b39fc",
    domain: "orbit.dev",
    year: "2024",
  },
  {
    title: "Maison Noir",
    category: "Luxe · Site de marque",
    description:
      "Un site éditoriel haute-couture avec scroll cinématographique, typographie sur mesure et un lookbook shoppable.",
    mockupGradient: "linear-gradient(135deg, #2b2344 0%, #a484d7 100%)",
    accent: "#c4a4ff",
    domain: "maisonnoir.com",
    year: "2023",
  },
];

function WebsiteMockup({ project }: { project: Project }) {
  return (
    <div
      className="relative w-full overflow-hidden rounded-xl border border-white/15 bg-[#2b2344]"
      style={{ aspectRatio: "4 / 3" }}
    >
      {/* Browser chrome */}
      <div className="flex items-center gap-1.5 border-b border-white/10 bg-white/[0.05] px-3 py-2">
        <span className="h-2 w-2 rounded-full bg-white/30" />
        <span className="h-2 w-2 rounded-full bg-white/30" />
        <span className="h-2 w-2 rounded-full bg-white/30" />
        <div
          className="ml-2 flex-1 truncate rounded-md bg-white/8 px-2 py-0.5 text-[10px] text-white/50"
          style={{ fontFamily: "var(--font-inter)" }}
        >
          {project.domain}
        </div>
      </div>

      {/* Mockup body */}
      <div className="relative h-[calc(100%-32px)] w-full overflow-hidden">
        <div
          className="absolute inset-0"
          style={{ background: project.mockupGradient }}
        />
        {/* Animated light sweep */}
        <motion.div
          aria-hidden="true"
          className="absolute inset-0 opacity-50 mix-blend-overlay"
          style={{
            background:
              "radial-gradient(circle at 30% 20%, rgba(255,255,255,0.5) 0, transparent 45%), radial-gradient(circle at 75% 80%, rgba(0,0,0,0.5) 0, transparent 50%)",
          }}
        />
        {/* Subtle moving sheen */}
        <motion.div
          aria-hidden="true"
          className="absolute inset-y-0 -left-1/3 w-1/3 bg-gradient-to-r from-transparent via-white/10 to-transparent"
          animate={{ x: ["0%", "300%"] }}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: "linear",
            repeatDelay: 3,
          }}
        />

        {/* Mock hero content */}
        <div className="absolute inset-x-5 top-6 flex flex-col gap-2">
          <div className="h-2.5 w-1/2 rounded-full bg-white/65" />
          <div className="h-2 w-2/3 rounded-full bg-white/35" />
          <div className="mt-2 flex items-center gap-1.5">
            <div
              className="h-5 w-16 rounded-full"
              style={{ background: "rgba(255,255,255,0.9)" }}
            />
            <div className="h-5 w-10 rounded-full border border-white/50" />
          </div>
        </div>

        {/* Mock cards row */}
        <div className="absolute inset-x-5 bottom-5 grid grid-cols-3 gap-2">
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              className="rounded-md border border-white/20 bg-black/30 p-1.5"
            >
              <div
                className="h-1 w-2/3 rounded-full"
                style={{ background: project.accent, opacity: 0.95 }}
              />
              <div className="mt-1 h-1 w-full rounded-full bg-white/35" />
              <div className="mt-0.5 h-1 w-1/2 rounded-full bg-white/20" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default function ProjectGallerySection() {
  const trackRef = useRef<HTMLDivElement>(null);
  const viewportRef = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);
  const reduce = useReducedMotion() ?? false;
  const [maxScroll, setMaxScroll] = useState(0);
  const [activeIndex, setActiveIndex] = useState(0);
  const [atStart, setAtStart] = useState(true);
  const [atEnd, setAtEnd] = useState(false);
  const [items, setItems] = useState(PROJECTS);

  // Fetch depuis l'API au montage, fallback sur les données statiques
  useEffect(() => {
    fetch("/api/projects")
      .then((r) => r.json())
      .then((data) => {
        if (Array.isArray(data) && data.length > 0) {
          setItems(data);
        }
      })
      .catch(() => {});
  }, []);

  useEffect(() => {
    const compute = () => {
      const track = trackRef.current;
      if (!track) return;
      const ms = Math.max(0, track.scrollWidth - track.clientWidth);
      setMaxScroll(ms);
      const cx = x.get();
      setAtStart(cx >= -4);
      setAtEnd(-cx >= ms - 4);
    };
    compute();
    window.addEventListener("resize", compute);
    return () => window.removeEventListener("resize", compute);
  }, [x]);

  useEffect(() => {
    const unsub = x.on("change", (latest) => {
      const track = trackRef.current;
      if (!track) return;
      const card = track.querySelector<HTMLElement>("[data-card]");
      if (!card) return;
      const cardWidth = card.offsetWidth + 24;
      const idx = Math.min(
        items.length - 1,
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
      const clamped = Math.max(0, Math.min(items.length - 1, idx));
      const track = trackRef.current;
      if (!track) return;
      const card = track.querySelector<HTMLElement>("[data-card]");
      if (!card) return;
      const cardWidth = card.offsetWidth + 24;
      const target = Math.min(maxScroll, clamped * cardWidth);
      animate(x, -target, {
        type: "spring",
        stiffness: reduce ? 1000 : 180,
        damping: reduce ? 100 : 26,
        mass: 0.8,
      });
    },
    [maxScroll, reduce, x, items.length]
  );

  const handlePrev = useCallback(
    () => scrollToIndex(activeIndex - 1),
    [activeIndex, scrollToIndex]
  );
  const handleNext = useCallback(
    () => scrollToIndex(activeIndex + 1),
    [activeIndex, scrollToIndex]
  );

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
        scrollToIndex(items.length - 1);
      }
    },
    [handlePrev, handleNext, scrollToIndex, items.length]
  );

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
      id="gallery"
      className="relative w-full bg-[#2b2344] py-24 lg:py-32 px-6 lg:px-[120px]"
      aria-labelledby="gallery-heading"
    >
      {/* Background ambient glow */}
      <motion.div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-70"
        style={{
          background:
            "radial-gradient(ellipse 70% 50% at 50% 0%, rgba(123,57,252,0.18) 0%, transparent 65%)",
        }}
      />

      <div className="relative max-w-[1280px] mx-auto">
        {/* Header */}
        <Reveal className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6 mb-14">
          <div className="flex flex-col items-start max-w-xl">
            <motion.span
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="inline-flex items-center rounded-full border border-[rgba(164,132,215,0.45)] bg-[rgba(123,57,252,0.18)] px-3 py-1 text-[12px] font-medium text-white/95 mb-5"
              style={{ fontFamily: "var(--font-cabin)" }}
            >
              Galerie de sites web
            </motion.span>
            <h2
              id="gallery-heading"
              className="text-white text-4xl md:text-5xl lg:text-6xl leading-[1.05] tracking-[-0.02em]"
              style={{ fontFamily: "var(--font-instrument-serif)" }}
            >
              {"Sites web "}<em className="italic">récents</em>{" que nous avons créés"}
            </h2>
          </div>

          {/* Arrow controls (desktop) */}
          <div className="hidden lg:flex items-center gap-2">
            <motion.button
              type="button"
              onClick={handlePrev}
              disabled={atStart}
              aria-label={`Projet précédent (actuellement ${activeIndex + 1} sur ${items.length})`}
              whileHover={{ scale: 1.08 }}
              whileTap={{ scale: 0.92 }}
              className="inline-flex h-12 w-12 items-center justify-center rounded-full border border-white/20 bg-white/[0.05] text-white backdrop-blur-sm transition-colors duration-200 hover:bg-white/10 hover:border-[rgba(164,132,215,0.6)] disabled:opacity-30 disabled:cursor-not-allowed"
            >
              <ArrowLeft className="h-4 w-4" strokeWidth={2} aria-hidden="true" />
            </motion.button>
            <motion.button
              type="button"
              onClick={handleNext}
              disabled={atEnd}
              aria-label={`Projet suivant (actuellement ${activeIndex + 1} sur ${items.length})`}
              whileHover={{ scale: 1.08 }}
              whileTap={{ scale: 0.92 }}
              className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-[#7b39fc] text-white shadow-[0_8px_24px_rgba(123,57,252,0.4)] transition-colors duration-200 hover:bg-[#8a4dff] disabled:opacity-30 disabled:cursor-not-allowed"
            >
              <ArrowRight className="h-4 w-4" strokeWidth={2} aria-hidden="true" />
            </motion.button>
          </div>
        </Reveal>

        {/* Carousel viewport */}
        <div
          ref={viewportRef}
          className="relative overflow-hidden"
          role="region"
          aria-roledescription="carousel"
          aria-label="Galerie de projets — utilisez les flèches pour naviguer"
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
            {items.map((project, i) => {
              const isActive = i === activeIndex;
              return (
                <motion.a
                  key={project.title}
                  href="#contact"
                  data-card
                  data-projects-card
                  tabIndex={0}
                  role="group"
                  aria-roledescription="slide"
                  aria-label={`Projet ${i + 1} sur ${items.length} : ${project.title}`}
                  animate={{
                    scale: isActive ? 1 : 0.94,
                    opacity: isActive ? 1 : 0.6,
                  }}
                  whileHover={{ y: -8, scale: isActive ? 1.02 : 0.96, opacity: 1 }}
                  whileTap={{ scale: 0.96 }}
                  transition={{ type: "spring", stiffness: 250, damping: 22 }}
                  className="group relative flex flex-col overflow-hidden rounded-2xl border bg-gradient-to-b from-white/[0.06] to-white/[0.02] p-5 shrink-0 w-[300px] sm:w-[340px] lg:w-[380px]"
                  style={{
                    borderColor: isActive
                      ? "rgba(164,132,215,0.65)"
                      : "rgba(255,255,255,0.12)",
                    boxShadow: isActive
                      ? "0 24px 60px rgba(123,57,252,0.35), 0 0 0 1px rgba(164,132,215,0.3) inset"
                      : "0 4px 20px rgba(0,0,0,0.18)",
                  }}
                >
                {/* Top accent line */}
                <span
                  aria-hidden="true"
                  className="pointer-events-none absolute top-0 left-1/2 -translate-x-1/2 h-[2px] w-0 bg-gradient-to-r from-transparent via-[#7b39fc] to-transparent transition-all duration-500 group-hover:w-full z-20"
                />

                {/* Mockup */}
                <div className="relative">
                  <WebsiteMockup project={project} />

                  {/* Year badge (top-left of mockup) */}
                  <div className="absolute top-3 left-3 inline-flex items-center rounded-full bg-black/50 backdrop-blur-md border border-white/20 px-2.5 py-1 text-[10px] font-semibold text-white tracking-wider">
                    {project.year}
                  </div>

                  {/* Hover arrow (top-right of mockup) — magnetic */}
                  <motion.div
                    aria-hidden="true"
                    className="absolute top-3 right-3 inline-flex h-10 w-10 items-center justify-center rounded-full bg-black/50 backdrop-blur-md border border-white/25 text-white opacity-0 -translate-y-1 transition-all duration-300 group-hover:opacity-100 group-hover:translate-y-0 group-hover:bg-[#7b39fc] group-hover:border-[#7b39fc]"
                    whileHover={{ scale: 1.15, rotate: 8 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    <ArrowUpRight className="h-4 w-4" strokeWidth={2.5} />
                  </motion.div>
                </div>

                {/* Title */}
                <h3
                  className="text-white text-xl font-semibold mt-5"
                  style={{ fontFamily: "var(--font-manrope)" }}
                >
                  {project.title}
                </h3>

                {/* Category */}
                <p
                  className="text-[#c4a4ff] text-[12px] font-medium uppercase tracking-wider mt-1"
                  style={{ fontFamily: "var(--font-cabin)" }}
                >
                  {project.category}
                </p>

                {/* Description */}
                <p
                  className="text-white/75 text-[14px] leading-relaxed mt-3 transition-colors duration-300 group-hover:text-white/90"
                  style={{ fontFamily: "var(--font-inter)" }}
                >
                  {project.description}
                </p>

                {/* Bottom "view case" line — slides in on hover */}
                <div className="mt-4 flex items-center gap-2 text-[#a484d7] text-[12px] font-medium uppercase tracking-wider opacity-0 -translate-x-2 transition-all duration-300 group-hover:opacity-100 group-hover:translate-x-0" style={{ fontFamily: "var(--font-cabin)" }}>
                  Voir l'étude de cas
                  <ArrowUpRight className="h-3.5 w-3.5" strokeWidth={2.5} />
                </div>
                </motion.a>
              );
            })}
          </motion.div>
        </div>

        {/* Dots */}
        <div
          className="mt-10 flex items-center justify-center lg:justify-start gap-3"
          role="tablist"
          aria-label="Navigation de la galerie de projets"
        >
          <div className="flex items-center gap-1.5">
            {items.map((p, i) => (
              <button
                key={i}
                type="button"
                role="tab"
                aria-selected={i === activeIndex}
                aria-label={`Aller au projet ${i + 1} : ${p.title}`}
                onClick={() => scrollToIndex(i)}
                className={`h-1.5 rounded-full transition-all duration-300 ${
                  i === activeIndex
                    ? "w-10 bg-[#7b39fc]"
                    : "w-1.5 bg-white/30 hover:bg-white/50"
                }`}
              />
            ))}
          </div>
        </div>

        {/* Mobile arrow controls */}
        <div className="flex lg:hidden items-center justify-center gap-2 mt-6">
          <motion.button
            type="button"
            onClick={handlePrev}
            disabled={atStart}
            aria-label="Précédent"
            whileTap={{ scale: 0.9 }}
            className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-white/20 bg-white/[0.05] text-white transition-colors hover:bg-white/10 disabled:opacity-30 disabled:cursor-not-allowed"
          >
            <ArrowLeft className="h-4 w-4" strokeWidth={2} aria-hidden="true" />
          </motion.button>
          <motion.button
            type="button"
            onClick={handleNext}
            disabled={atEnd}
            aria-label="Suivant"
            whileTap={{ scale: 0.9 }}
            className="inline-flex h-11 w-11 items-center justify-center rounded-full bg-[#7b39fc] text-white transition-colors hover:bg-[#8a4dff] disabled:opacity-30 disabled:cursor-not-allowed"
          >
            <ArrowRight className="h-4 w-4" strokeWidth={2} aria-hidden="true" />
          </motion.button>
        </div>
      </div>
    </section>
  );
}
