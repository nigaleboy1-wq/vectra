"use client";

import { motion } from "framer-motion";
import { Reveal } from "./animations";
import { useSectionTracking, trackCtaClick } from "./analytics";

export default function CTASection() {
  return (
    <section
      id="contact"
      className="relative w-full bg-[#2b2344] py-24 lg:py-36 px-6 lg:px-[120px] overflow-hidden"
      aria-labelledby="cta-heading"
    >
      {/* Decorative glow + grid */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 70% 60% at 50% 50%, rgba(123,57,252,0.25) 0%, transparent 65%)",
        }}
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-[0.04]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)",
          backgroundSize: "60px 60px",
        }}
      />

      <Reveal className="relative max-w-[900px] mx-auto flex flex-col items-center text-center gap-8">
        <span
          className="inline-flex items-center gap-2.5 h-[38px] rounded-[10px] px-2.5 pr-4"
          style={{
            background: "rgba(85, 80, 110, 0.4)",
            backdropFilter: "blur(12px)",
            WebkitBackdropFilter: "blur(12px)",
            border: "1px solid rgba(164, 132, 215, 0.5)",
          }}
        >
          <span
            className="inline-flex items-center justify-center rounded-[6px] bg-[#7b39fc] px-2 py-0.5 text-white text-[12px] font-semibold leading-none"
            style={{ fontFamily: "var(--font-cabin)" }}
          >
            Gratuit
          </span>
          <span
            className="text-white text-[14px] font-medium leading-none"
            style={{ fontFamily: "var(--font-cabin)" }}
          >
            Appel stratégique de 30 minutes
          </span>
        </span>

        <h2
          id="cta-heading"
          className="text-white text-4xl sm:text-5xl md:text-6xl lg:text-7xl leading-[1.05] tracking-[-0.02em] max-w-[800px]"
          style={{ fontFamily: "var(--font-instrument-serif)" }}
        >
          {"Construisons quelque chose d'"}<em className="italic">extraordinaire</em>
        </h2>

        <p
          className="text-white/70 text-[17px] md:text-[18px] leading-relaxed max-w-[560px]"
          style={{ fontFamily: "var(--font-inter)" }}
        >
          Parlez-nous de votre projet. Nous revenons vers vous sous 24 heures avec les prochaines étapes, un calendrier approximatif et un devis clair — sans pression, sans pitch commercial.
        </p>

        <motion.div
          className="flex flex-col sm:flex-row items-center gap-3 sm:gap-4 mt-2"
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.15 }}
        >
          <a
            href="#contact"
            className="w-full sm:w-auto rounded-[10px] bg-[#7b39fc] px-7 py-3.5 text-white text-[16px] font-medium transition-all duration-200 hover:bg-[#8a4dff] hover:shadow-[0_10px_30px_rgba(123,57,252,0.5)]"
            style={{ fontFamily: "var(--font-cabin)" }}
          >
            Réserver une consultation gratuite
          </a>
          <a
            href="#gallery"
            className="w-full sm:w-auto rounded-[10px] bg-[#2b2344] border border-white/15 px-7 py-3.5 text-[#f6f7f9] text-[16px] font-medium transition-all duration-200 hover:bg-[#3a3056] hover:border-white/25"
            style={{ fontFamily: "var(--font-cabin)" }}
          >
            Voir nos réalisations
          </a>
        </motion.div>

        <div
          className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-white/65 text-[13px] mt-4"
          style={{ fontFamily: "var(--font-inter)" }}
        >
          <span>~24h de délai de réponse</span>
          <span className="hidden sm:inline">·</span>
          <span>Sans engagement</span>
          <span className="hidden sm:inline">·</span>
          <span>hello@vectra.studio</span>
        </div>
      </Reveal>
    </section>
  );
}
