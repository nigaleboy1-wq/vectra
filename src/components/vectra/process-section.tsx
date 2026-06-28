"use client";

import { motion } from "framer-motion";
import { Check } from "lucide-react";
import SectionHeadingComponent from "./section-heading";

type Step = {
  no: string;
  title: string;
  duration: string;
  description: string;
  deliverables: string[];
};

const STEPS: Step[] = [
  {
    no: "01",
    title: "Découverte",
    duration: "Semaine 1",
    description:
      "Nous commençons par une immersion dans votre activité, vos utilisateurs et vos objectifs. Ateliers, audits et un brief projet clair que tout le monde valide.",
    deliverables: ["Brief projet", "Ateliers parties prenantes", "Audit technique"],
  },
  {
    no: "02",
    title: "Design",
    duration: "Semaines 2–3",
    description:
      "Wireframes, prototypes et UI haute-fidélité. Nous itérons avec vous chaque semaine jusqu'à ce que chaque écran soit juste — aucune surprise à la livraison.",
    deliverables: ["Wireframes", "Maquettes UI haute-fidélité", "Bibliothèque de composants"],
  },
  {
    no: "03",
    title: "Développement",
    duration: "Semaines 4–6",
    description:
      "Code de production en Next.js + TypeScript. Déploiement continu, URLs de preview quotidiennes et transparence totale sur un board partagé.",
    deliverables: ["Code de production", "Pipeline CI/CD", "Previews quotidiennes"],
  },
  {
    no: "04",
    title: "Lancement",
    duration: "Semaine 7",
    description:
      "QA, optimisation des performances, SEO et mise en ligne en douceur. Ensuite, nous surveillons, mesurons et itérons — votre lancement est une ligne de départ, pas une ligne d'arrivée.",
    deliverables: ["QA + optimisation perf", "Configuration SEO", "Mise en ligne + monitoring"],
  },
];

export default function ProcessSection() {
  return (
    <section
      id="process"
      className="relative w-full bg-[#2b2344] py-24 lg:py-32 px-6 lg:px-[120px]"
      aria-labelledby="process-heading"
    >
      {/* Ambient top glow */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 h-80 opacity-60"
        style={{
          background:
            "radial-gradient(ellipse 70% 60% at 50% 0%, rgba(123,57,252,0.20) 0%, transparent 65%)",
        }}
      />

      <div className="relative max-w-[1200px] mx-auto">
        <SectionHeadingComponent
          eyebrow="Notre méthode"
          title={
            <span id="process-heading">
              {"Un processus éprouvé, "}<em className="italic">zéro</em>{" surprise"}
            </span>
          }
          description="Du lancement à la mise en ligne, vous saurez toujours ce qui se passe, ce qui vient ensuite, et pourquoi. La plupart des projets sont livrés en 6 à 8 semaines."
          className="mb-16"
        />

        {/* Roadmap — editorial list of rows */}
        <ol className="relative flex flex-col">
          {/* Vertical rail behind the rows (desktop) */}
          <div
            aria-hidden="true"
            className="hidden md:block absolute left-[88px] top-4 bottom-4 w-px bg-gradient-to-b from-[rgba(164,132,215,0.5)] via-white/10 to-transparent"
          />

          {STEPS.map((step, i) => (
            <motion.li
              key={step.no}
              initial={{ opacity: 0, y: 28 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{
                duration: 0.65,
                delay: i * 0.08,
                ease: [0.22, 1, 0.36, 1],
              }}
              className="group relative grid grid-cols-1 md:grid-cols-[140px_1fr_240px] gap-4 md:gap-8 items-start py-7 md:py-8 border-t border-white/8 first:border-t-0 transition-colors duration-300 hover:bg-white/[0.02]"
            >
              {/* Left: big serif number + duration + node */}
              <div className="relative flex md:flex-col items-baseline md:items-start gap-3 md:gap-2">
                {/* Node on the rail (desktop) */}
                <span
                  aria-hidden="true"
                  className="hidden md:block absolute -left-[37px] top-2 h-3 w-3 rounded-full border-2 border-[#2b2344] bg-[#7b39fc] shadow-[0_0_12px_rgba(123,57,252,0.6)] transition-transform duration-300 group-hover:scale-125"
                />
                <span
                  className="text-[#c4a4ff] text-[64px] md:text-[72px] leading-none font-semibold transition-colors duration-300 group-hover:text-[#7b39fc]"
                  style={{ fontFamily: "var(--font-instrument-serif)" }}
                >
                  {step.no}
                </span>
                <span
                  className="md:mt-2 inline-flex items-center text-[11px] uppercase tracking-wider text-white/75 rounded-full border border-white/20 px-2.5 py-1 bg-white/[0.04]"
                  style={{ fontFamily: "var(--font-cabin)" }}
                >
                  {step.duration}
                </span>
              </div>

              {/* Middle: title + description */}
              <div className="flex flex-col gap-3">
                <h3
                  className="text-white text-2xl md:text-3xl font-semibold leading-tight"
                  style={{ fontFamily: "var(--font-manrope)" }}
                >
                  {step.title}
                </h3>
                <p
                  className="text-white/75 text-[15px] md:text-[16px] leading-relaxed max-w-[520px]"
                  style={{ fontFamily: "var(--font-inter)" }}
                >
                  {step.description}
                </p>
              </div>

              {/* Right: deliverables list */}
              <div className="md:pl-6 md:border-l md:border-white/10">
                <p
                  className="text-[11px] uppercase tracking-wider text-white/45 mb-3"
                  style={{ fontFamily: "var(--font-cabin)" }}
                >
                  Livrables
                </p>
                <ul className="flex flex-col gap-2">
                  {step.deliverables.map((d) => (
                    <li
                      key={d}
                      className="flex items-center gap-2.5 text-white/85 text-[14px]"
                      style={{ fontFamily: "var(--font-inter)" }}
                    >
                      <span
                        aria-hidden="true"
                        className="inline-flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-[rgba(123,57,252,0.2)] border border-[rgba(164,132,215,0.4)] text-[#c4a4ff]"
                      >
                        <Check className="h-2.5 w-2.5" strokeWidth={3} />
                      </span>
                      <span>{d}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </motion.li>
          ))}
        </ol>

        {/* Footer note */}
        <motion.p
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-40px" }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="mt-12 text-center text-white/60 text-[14px]"
          style={{ fontFamily: "var(--font-inter)" }}
        >
          Chaque étape est livrée avec un board Notion partagé, des appels démo hebdomadaires et un canal Slack unique — pas de boîte noire.
        </motion.p>
      </div>
    </section>
  );
}
