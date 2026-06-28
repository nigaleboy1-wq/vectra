"use client";

import { motion, useInView, useMotionValue, useTransform, animate } from "framer-motion";
import { useEffect, useRef, useState } from "react";

type Stat = { value: number; suffix: string; label: string; decimals?: number };

const STATS: Stat[] = [
  { value: 50, suffix: "+", label: "Projets livrés" },
  { value: 12, suffix: "", label: "Secteurs servis" },
  { value: 99.9, suffix: "%", label: "Disponibilité SLA", decimals: 1 },
  { value: 4.9, suffix: "/5", label: "Note client", decimals: 1 },
];

function AnimatedCounter({
  value,
  suffix,
  decimals = 0,
}: {
  value: number;
  suffix: string;
  decimals?: number;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-40px" });
  const count = useMotionValue(0);
  const rounded = useTransform(count, (v) => v.toFixed(decimals));

  useEffect(() => {
    if (!inView) return;
    const controls = animate(count, value, {
      duration: 1.6,
      ease: [0.22, 1, 0.36, 1],
    });
    return () => controls.stop();
  }, [inView, value, count]);

  return (
    <span ref={ref} className="inline-flex items-baseline">
      <motion.span>{rounded}</motion.span>
      <span>{suffix}</span>
    </span>
  );
}

export default function StatsBand() {
  const [stats, setStats] = useState(STATS);

  // Fetch depuis l'API au montage, fallback sur les données statiques
  useEffect(() => {
    fetch("/api/stats")
      .then((r) => r.json())
      .then((data) => {
        if (Array.isArray(data) && data.length > 0) {
          setStats(data);
        }
      })
      .catch(() => {});
  }, []);

  return (
    <div className="relative z-20 -mt-12 lg:-mt-16 mb-0">
      <div className="max-w-[1100px] mx-auto px-6 lg:px-10">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-40px" }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="relative grid grid-cols-2 lg:grid-cols-4"
        >
          {stats.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{
                duration: 0.6,
                delay: i * 0.1,
                ease: [0.22, 1, 0.36, 1],
              }}
              whileHover={{ y: -4 }}
              className={`group/stat relative flex flex-col items-center text-center px-4 py-6 lg:py-7 cursor-default ${
                // Vertical separator between stats (desktop) + horizontal on mobile grid break
                i > 0 ? "lg:border-l lg:border-white/15" : ""
              } ${i >= 2 ? "border-t border-white/15 lg:border-t-0" : ""}`}
            >
              {/* Per-stat glow on hover — replaces the old card background */}
              <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-0 opacity-0 group-hover/stat:opacity-100 transition-opacity duration-500"
                style={{
                  background:
                    "radial-gradient(ellipse 80% 70% at 50% 50%, rgba(123,57,252,0.18) 0%, transparent 65%)",
                }}
              />
              {/* Top accent dot — appears on hover */}
              <span
                aria-hidden="true"
                className="pointer-events-none absolute top-0 left-1/2 -translate-x-1/2 h-1 w-1 rounded-full bg-[#7b39fc] opacity-0 group-hover/stat:opacity-100 transition-opacity duration-300 shadow-[0_0_12px_rgba(123,57,252,0.8)]"
              />

              <span
                className="relative text-white text-3xl lg:text-5xl font-semibold tracking-tight transition-colors duration-300 group-hover/stat:text-[#c4a4ff]"
                style={{ fontFamily: "var(--font-instrument-serif)" }}
              >
                <AnimatedCounter
                  value={stat.value}
                  suffix={stat.suffix}
                  decimals={stat.decimals}
                />
              </span>
              <span
                className="relative text-white/70 text-[11px] lg:text-[12px] mt-2 uppercase tracking-[0.15em] transition-colors duration-300 group-hover/stat:text-white/90"
                style={{ fontFamily: "var(--font-cabin)" }}
              >
                {stat.label}
              </span>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </div>
  );
}
