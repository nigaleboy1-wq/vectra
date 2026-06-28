"use client";

import CrudEditor from "@/components/vectra/crud-editor";

const FIELDS = [
  { key: "name", label: "Nom", type: "text" as const, required: true },
  { key: "role", label: "Rôle / Entreprise", type: "text" as const },
  { key: "initials", label: "Initiales", type: "text" as const },
  { key: "quote", label: "Citation", type: "textarea" as const, required: true },
  { key: "accent", label: "Gradient accent (class Tailwind)", type: "text" as const },
  { key: "order", label: "Ordre", type: "number" as const },
];

export default function TestimonialsPage() {
  return (
    <CrudEditor
      title="Témoignages"
      apiPath="/api/testimonials"
      fields={FIELDS}
      itemName="témoignage"
      renderPreview={(item) => (
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-3">
            <div
              className={`inline-flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br ${item.accent || "from-[#7b39fc] to-[#a484d7]"} text-white text-[12px] font-semibold border border-white/15`}
            >
              {String(item.initials || "")}
            </div>
            <div className="flex flex-col">
              <h3 className="text-white text-[15px] font-semibold" style={{ fontFamily: "var(--font-manrope)" }}>
                {String(item.name)}
              </h3>
              <span className="text-white/50 text-[12px]" style={{ fontFamily: "var(--font-inter)" }}>
                {String(item.role || "")}
              </span>
            </div>
          </div>
          <p className="text-white/60 text-[13px] italic line-clamp-3 mt-1" style={{ fontFamily: "var(--font-inter)" }}>
            "{String(item.quote)}"
          </p>
        </div>
      )}
    />
  );
}
