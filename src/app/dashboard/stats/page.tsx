"use client";

import CrudEditor from "@/components/vectra/crud-editor";

const FIELDS = [
  { key: "label", label: "Libellé", type: "text" as const, required: true },
  { key: "value", label: "Valeur", type: "number" as const, required: true },
  { key: "suffix", label: "Suffixe (+, %, /5…)", type: "text" as const },
  { key: "decimals", label: "Décimales", type: "number" as const },
  { key: "order", label: "Ordre", type: "number" as const },
];

export default function StatsPage() {
  return (
    <CrudEditor
      title="Statistiques"
      apiPath="/api/stats"
      fields={FIELDS}
      itemName="statistique"
      renderPreview={(item) => (
        <div className="flex items-center gap-4">
          <div className="flex flex-col">
            <span className="text-white text-3xl font-semibold" style={{ fontFamily: "var(--font-instrument-serif)" }}>
              {String(item.value)}{String(item.suffix || "")}
            </span>
            <span className="text-white/55 text-[12px] uppercase tracking-wider mt-1" style={{ fontFamily: "var(--font-cabin)" }}>
              {String(item.label)}
            </span>
          </div>
        </div>
      )}
    />
  );
}
