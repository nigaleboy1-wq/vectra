"use client";

import CrudEditor from "@/components/vectra/crud-editor";

const FIELDS = [
  { key: "title", label: "Titre", type: "text" as const, required: true },
  { key: "category", label: "Catégorie", type: "text" as const },
  { key: "description", label: "Description", type: "textarea" as const, required: true },
  { key: "imageUrl", label: "Image du projet", type: "image" as const },
  { key: "domain", label: "Domaine", type: "text" as const },
  { key: "year", label: "Année", type: "text" as const },
  { key: "mockupFrom", label: "Couleur début (gradient de fallback)", type: "color" as const },
  { key: "mockupTo", label: "Couleur fin (gradient de fallback)", type: "color" as const },
  { key: "accent", label: "Couleur accent", type: "color" as const },
  { key: "order", label: "Ordre", type: "number" as const },
];

export default function ProjectsPage() {
  return (
    <CrudEditor
      title="Projets"
      apiPath="/api/projects"
      fields={FIELDS}
      itemName="projet"
      renderPreview={(item) => (
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-3">
            {item.imageUrl ? (
              <img
                src={String(item.imageUrl)}
                alt={String(item.title)}
                className="h-10 w-10 rounded-lg border border-white/15 object-cover"
              />
            ) : (
              <div
                className="h-10 w-10 rounded-lg border border-white/15"
                style={{ background: `linear-gradient(135deg, ${item.mockupFrom}, ${item.mockupTo})` }}
              />
            )}
            <div className="flex flex-col">
              <h3 className="text-white text-[15px] font-semibold" style={{ fontFamily: "var(--font-manrope)" }}>
                {String(item.title)}
              </h3>
              <span className="text-[#c4a4ff] text-[11px] uppercase tracking-wider" style={{ fontFamily: "var(--font-cabin)" }}>
                {String(item.category || "")} · {String(item.year || "")}
              </span>
            </div>
          </div>
          <p className="text-white/55 text-[13px] line-clamp-2" style={{ fontFamily: "var(--font-inter)" }}>
            {String(item.description)}
          </p>
          <span className="text-white/35 text-[11px]" style={{ fontFamily: "var(--font-inter)" }}>
            {String(item.domain || "")}
          </span>
        </div>
      )}
    />
  );
}
