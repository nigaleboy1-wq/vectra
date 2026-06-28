"use client";

import type { ReactNode } from "react";
import { Reveal } from "./animations";

type Props = {
  eyebrow: string;
  title: ReactNode;
  description?: ReactNode;
  align?: "center" | "left";
  className?: string;
};

/**
 * Reusable section header — eyebrow pill + title + description.
 * Consolidates the 5 duplicated patterns across Vectra sections.
 */
export default function SectionHeading({
  eyebrow,
  title,
  description,
  align = "center",
  className = "",
}: Props) {
  const isCenter = align === "center";
  return (
    <Reveal
      className={`${
        isCenter
          ? "flex flex-col items-center text-center max-w-2xl mx-auto"
          : "flex flex-col items-start max-w-xl"
      } ${className}`}
    >
      <span
        className="inline-flex items-center rounded-full border border-[rgba(164,132,215,0.4)] bg-[rgba(123,57,252,0.15)] px-3 py-1 text-[12px] font-medium text-white/90 mb-5"
        style={{ fontFamily: "var(--font-cabin)" }}
      >
        {eyebrow}
      </span>
      <h2
        className="text-white text-4xl md:text-5xl lg:text-6xl leading-[1.1] tracking-[-0.02em] mb-5"
        style={{ fontFamily: "var(--font-instrument-serif)" }}
      >
        {title}
      </h2>
      {description ? (
        <p
          className={`text-white/70 text-[17px] leading-relaxed ${
            isCenter ? "" : ""
          }`}
          style={{ fontFamily: "var(--font-inter)" }}
        >
          {description}
        </p>
      ) : null}
    </Reveal>
  );
}
