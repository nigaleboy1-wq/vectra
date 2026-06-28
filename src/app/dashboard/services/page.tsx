"use client";

import CrudEditor from "@/components/vectra/crud-editor";

const FIELDS = [
  { key: "title", label: "Titre", type: "text" as const, required: true },
  { key: "description", label: "Description", type: "textarea" as const, required: true },
  { key: "iconName", label: "Nom de l'icône (Lucide)", type: "text" as const },
  { key: "order", label: "Ordre", type: "number" as const },
];

export default function ServicesPage() {
  return (
    <CrudEditor
      title="Services"
      apiPath="/api/services"
      fields={FIELDS}
      itemName="service"
      renderPreview={(item) => (
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-2">
            <span className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-[rgba(123,57,252,0.15)] border border-[rgba(164,132,215,0.3)] text-[#c4a4ff] text-[10px] font-mono">
              {String(item.iconName || "•").slice(0, 2)}
            </span>
            <h3 className="text-white text-[15px] font-semibold" style={{ fontFamily: "var(--font-manrope)" }}>
              {String(item.title)}
            </h3>
          </div>
          <p className="text-white/55 text-[13px] line-clamp-2 mt-1" style={{ fontFamily: "var(--font-inter)" }}>
            {String(item.description)}
          </p>
        </div>
      )}
    />
  );
}
