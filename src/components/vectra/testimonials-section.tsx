"use client";

import { useRef, useState, useEffect, useCallback } from "react";
import { motion, useMotionValue, useTransform, animate, useReducedMotion } from "framer-motion";
import { Star, ArrowLeft, ArrowRight } from "lucide-react";
import { Reveal } from "./animations";
import SectionHeading from "./section-heading";
import { useSectionTracking, trackCtaClick } from "./analytics";

type Testimonial = {
  quote: string;
  name: string;
  role: string;
  initials: string;
  accent: string;
};

const TESTIMONIALS: Testimonial[] = [
  {
    quote:
      "Vectra a entièrement reconstruit notre tableau de bord SaaS. La nouvelle version se charge en moins d'une seconde et notre conversion d'essai vers payant a bondi de 31% au premier trimestre.",
    name: "Sarah Chen",
    role: "CEO, Pulse Health",
    initials: "SC",
    accent: "from-[#7b39fc] to-[#a484d7]",
  },
  {
    quote:
      "L'équipe la plus rigoureuse avec laquelle nous ayons travaillé. Ils se souciaient de l'expérience de nos clients autant que nous — et ça se voit dans chaque pixel.",
    name: "Marcus Bauer",
    role: "Fondateur, Atlas Studio",
    initials: "MB",
    accent: "from-[#a484d7] to-[#2b2344]",
  },
  {
    quote:
      "Nous avons livré une refonte headless commerce en 7 semaines. La vitesse de page est passée de 4,2s à 1,1s et notre trafic organique a doublé en trois mois. Vraiment au-dessus du lot.",
    name: "Léa Park",
    role: "Head of Growth, Nimbus",
    initials: "LP",
    accent: "from-[#2b2344] to-[#7b39fc]",
  },
  {
    quote:
      "Un accompagnement sans faille du brief au déploiement. Communication limpide, tenue parfaite des délais, et un résultat qui a dépassé nos attentes sur tous les fronts.",
    name: "Antoine Mercier",
    role: "Cofondateur, Orbit Labs",
    initials: "AM",
    accent: "from-[#5b2db8] to-[#a484d7]",
  },
  {
    quote:
      "Vectra a transformé notre vision en une plateforme web rapide, élégante et maintenable. Nos équipes internes ont pris le relais sans aucune friction.",
    name: "Camille Roux",
    role: "CTO, Maison Noir",
    initials: "CR",
    accent: "from-[#a484d7] to-[#5b2db8]",
  },
];

export default function TestimonialsSection() {
  const trackRef = useRef<HTMLDivElement>(null);
  const viewportRef = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);
  const reduce = useReducedMotion() ?? false;
  const [maxScroll, setMaxScroll] = useState(0);
  const [activeIndex, setActiveIndex] = useState(0);
  const [atStart, setAtStart] = useState(true);
  const [atEnd, setAtEnd] = useState(false);
  const [items, setItems] = useState(TESTIMONIALS);

  // Fetch depuis l'API au montage, fallback sur les données statiques
  useEffect(() => {
    fetch("/api/testimonials")
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
      className="relative w-full bg-[#2b2344] py-24 lg:py-32 px-6 lg:px-[120px]"
      aria-labelledby="testimonials-heading"
    >
      {/* Background glow */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-70"
        style={{
          background:
            "radial-gradient(ellipse 60% 50% at 50% 100%, rgba(123,57,252,0.18) 0%, transparent 60%)",
        }}
      />

      <div className="relative max-w-[1280px] mx-auto">
        {/* Header */}
        <Reveal className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6 mb-14">
          <div className="flex flex-col items-start max-w-xl">
            <span
              className="inline-flex items-center rounded-full border border-[rgba(164,132,215,0.45)] bg-[rgba(123,57,252,0.18)] px-3 py-1 text-[12px] font-medium text-white/95 mb-5"
              style={{ fontFamily: "var(--font-cabin)" }}
            >
              Témoignages clients
            </span>
            <h2
              id="testimonials-heading"
              className="text-white text-4xl md:text-5xl lg:text-6xl leading-[1.05] tracking-[-0.02em]"
              style={{ fontFamily: "var(--font-instrument-serif)" }}
            >
              {"Adoré par les fondateurs & les "}<em className="italic">équipes</em>
            </h2>
          </div>

          {/* Arrow controls (desktop) */}
          <div className="hidden lg:flex items-center gap-2">
            <motion.button
              type="button"
              onClick={handlePrev}
              disabled={atStart}
              aria-label={`Précédent (actuellement ${activeIndex + 1} sur ${items.length})`}
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
              aria-label={`Suivant (actuellement ${activeIndex + 1} sur ${items.length})`}
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
          aria-label="Témoignages clients — utilisez les flèches pour naviguer"
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
            {items.map((t, i) => {
              const isActive = i === activeIndex;
              return (
                <motion.figure
                  key={t.name}
                  data-card
                  tabIndex={0}
                  role="group"
                  aria-roledescription="slide"
                  aria-label={`Témoignage ${i + 1} sur ${items.length}: ${t.name}, ${t.role}`}
                  animate={{
                    scale: isActive ? 1 : 0.94,
                    opacity: isActive ? 1 : 0.6,
                  }}
                  whileHover={{ y: -8, scale: isActive ? 1.02 : 0.96, opacity: 1 }}
                  whileTap={{ scale: 0.96 }}
                  transition={{ type: "spring", stiffness: 250, damping: 22 }}
                  className="group relative flex flex-col gap-6 p-7 lg:p-8 rounded-2xl border bg-gradient-to-b from-white/[0.06] to-white/[0.02] shrink-0 w-[300px] sm:w-[380px] lg:w-[440px]"
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
                    className="pointer-events-none absolute top-0 left-1/2 -translate-x-1/2 h-[2px] w-0 bg-gradient-to-r from-transparent via-[#7b39fc] to-transparent transition-all duration-500 group-hover:w-full"
                  />
                  {/* Quote mark watermark */}
                  <span
                    aria-hidden="true"
                    className="pointer-events-none absolute top-2 right-5 text-[90px] leading-none font-semibold text-white/[0.05] select-none"
                    style={{ fontFamily: "var(--font-instrument-serif)" }}
                  >
                    &rdquo;
                  </span>

                  {/* Stars */}
                  <div
                    className="flex gap-1 relative"
                    aria-label="Note : 5 étoiles sur 5"
                    role="img"
                  >
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star
                        key={i}
                        className="h-4 w-4 fill-[#c4a4ff] text-[#c4a4ff]"
                        strokeWidth={0}
                        aria-hidden="true"
                      />
                    ))}
                  </div>

                  <blockquote
                    className="relative text-white/90 text-[16px] leading-relaxed flex-1"
                    style={{ fontFamily: "var(--font-inter)" }}
                  >
                    &ldquo;{t.quote}&rdquo;
                  </blockquote>

                  <figcaption className="relative flex items-center gap-3 pt-4 border-t border-white/10">
                    <div
                      className={`inline-flex h-11 w-11 items-center justify-center rounded-full bg-gradient-to-br ${t.accent} text-white text-[14px] font-semibold border border-white/15`}
                      style={{ fontFamily: "var(--font-manrope)" }}
                      aria-hidden="true"
                    >
                      {t.initials}
                    </div>
                    <div className="flex flex-col">
                      <span
                        className="text-white text-[15px] font-semibold"
                        style={{ fontFamily: "var(--font-manrope)" }}
                      >
                        {t.name}
                      </span>
                      <span
                        className="text-white/70 text-[13px]"
                        style={{ fontFamily: "var(--font-inter)" }}
                      >
                        {t.role}
                      </span>
                    </div>
                  </figcaption>
                </motion.figure>
              );
            })}
          </motion.div>
        </div>

        {/* Dots */}
        <div
          className="mt-10 flex items-center justify-center lg:justify-start gap-3"
          role="tablist"
          aria-label="Navigation des témoignages"
        >
          <div className="flex items-center gap-1.5">
            {items.map((t, i) => (
              <button
                key={i}
                type="button"
                role="tab"
                aria-selected={i === activeIndex}
                aria-label={`Aller au témoignage ${i + 1}: ${t.name}`}
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
