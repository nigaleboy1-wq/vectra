"use client";

import CrudEditor from "@/components/vectra/crud-editor";

const FIELDS = [
  { key: "no", label: "Numéro (01, 02...)", type: "text" as const, required: true },
  { key: "title", label: "Titre", type: "text" as const, required: true },
  { key: "duration", label: "Durée", type: "text" as const },
  { key: "description", label: "Description", type: "textarea" as const, required: true },
  { key: "deliverables", label: "Livrables (séparés par virgule)", type: "text" as const },
  { key: "order", label: "Ordre", type: "number" as const },
];

export default function ProcessPage() {
  return (
    <CrudEditor
      title="Étapes du processus"
      apiPath="/api/process-steps"
      fields={FIELDS}
      itemName="étape"
      renderPreview={(item) => {
        const deliverables = Array.isArray(item.deliverables) ? item.deliverables : [];
        return (
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-3">
              <span className="text-[#c4a4ff] text-2xl font-semibold" style={{ fontFamily: "var(--font-instrument-serif)" }}>
                {String(item.no || "")}
              </span>
              <div className="flex flex-col">
                <h3 className="text-white text-[15px] font-semibold" style={{ fontFamily: "var(--font-manrope)" }}>
                  {String(item.title)}
                </h3>
                <span className="text-white/50 text-[11px] uppercase tracking-wider" style={{ fontFamily: "var(--font-cabin)" }}>
                  {String(item.duration || "")}
                </span>
              </div>
            </div>
            <p className="text-white/55 text-[13px] line-clamp-2" style={{ fontFamily: "var(--font-inter)" }}>
              {String(item.description)}
            </p>
            {deliverables.length > 0 && (
              <div className="flex flex-wrap gap-1 mt-1">
                {deliverables.slice(0, 3).map((d: string, i: number) => (
                  <span key={i} className="text-[10px] text-white/45 bg-white/5 rounded px-1.5 py-0.5">
                    {d}
                  </span>
                ))}
              </div>
            )}
          </div>
        );
      }}
    />
  );
}
