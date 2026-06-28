"use client";

import { useEffect, useState, type ReactNode } from "react";
import { Plus, Trash2, Save, X, Pencil, GripVertical } from "lucide-react";

type FieldDef = {
  key: string;
  label: string;
  type: "text" | "textarea" | "number" | "color";
  required?: boolean;
};

type Item = Record<string, unknown> & { id: string };

export default function CrudEditor({
  title,
  apiPath,
  fields,
  itemName,
  renderPreview,
}: {
  title: string;
  apiPath: string;
  fields: FieldDef[];
  itemName: string;
  renderPreview?: (item: Item) => ReactNode;
}) {
  const [items, setItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<Item | null>(null);
  const [creating, setCreating] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetch(apiPath)
      .then((r) => r.json())
      .then((data) => {
        setItems(Array.isArray(data) ? data : []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [apiPath]);

  const handleSave = async (data: Record<string, unknown>) => {
    setSaving(true);
    const method = editing ? "PUT" : "POST";
    const url = editing ? `${apiPath}/${editing.id}` : apiPath;

    try {
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (res.ok) {
        const saved = await res.json();
        if (editing) {
          setItems((prev) => prev.map((i) => (i.id === saved.id ? saved : i)));
        } else {
          setItems((prev) => [...prev, saved]);
        }
        setEditing(null);
        setCreating(false);
      }
    } catch (e) {
      console.error("Save error:", e);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm(`Supprimer cet ${itemName} ?`)) return;
    try {
      await fetch(`${apiPath}/${id}`, { method: "DELETE" });
      setItems((prev) => prev.filter((i) => i.id !== id));
    } catch (e) {
      console.error("Delete error:", e);
    }
  };

  if (loading) {
    return (
      <div className="text-white/50 text-[14px]" style={{ fontFamily: "var(--font-inter)" }}>
        Chargement…
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1
            className="text-white text-3xl font-semibold mb-1"
            style={{ fontFamily: "var(--font-instrument-serif)" }}
          >
            {title}
          </h1>
          <p className="text-white/50 text-[14px]" style={{ fontFamily: "var(--font-inter)" }}>
            {items.length} {itemName}(s)
          </p>
        </div>
        <button
          onClick={() => {
            setCreating(true);
            setEditing(null);
          }}
          className="inline-flex items-center gap-2 rounded-lg bg-[#7b39fc] px-4 py-2.5 text-white text-[13px] font-semibold hover:bg-[#8a4dff] transition-all"
          style={{ fontFamily: "var(--font-manrope)" }}
        >
          <Plus className="h-4 w-4" strokeWidth={2} />
          Ajouter
        </button>
      </div>

      {/* Items list */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {items.map((item, i) => (
          <div
            key={item.id}
            className="group relative rounded-xl border border-white/10 bg-white/[0.03] p-5 hover:border-[rgba(164,132,215,0.4)] transition-colors"
          >
            <div className="flex items-start justify-between gap-3 mb-3">
              <div className="flex items-center gap-2">
                <GripVertical className="h-4 w-4 text-white/20" />
                <span className="text-white/40 text-[11px] font-mono">#{i + 1}</span>
              </div>
              <div className="flex items-center gap-1">
                <button
                  onClick={() => {
                    setEditing(item);
                    setCreating(false);
                  }}
                  className="inline-flex h-8 w-8 items-center justify-center rounded-lg text-white/50 hover:text-white hover:bg-white/10 transition-all"
                  aria-label="Modifier"
                >
                  <Pencil className="h-3.5 w-3.5" />
                </button>
                <button
                  onClick={() => handleDelete(item.id)}
                  className="inline-flex h-8 w-8 items-center justify-center rounded-lg text-white/50 hover:text-red-400 hover:bg-red-500/10 transition-all"
                  aria-label="Supprimer"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>

            {renderPreview ? renderPreview(item) : (
              <div className="flex flex-col gap-1">
                <h3 className="text-white text-[15px] font-semibold" style={{ fontFamily: "var(--font-manrope)" }}>
                  {String(item.title || item.name || item.label || "Sans titre")}
                </h3>
                {item.description && (
                  <p className="text-white/55 text-[13px] line-clamp-2" style={{ fontFamily: "var(--font-inter)" }}>
                    {String(item.description)}
                  </p>
                )}
              </div>
            )}
          </div>
        ))}
      </div>

      {items.length === 0 && !creating && (
        <div className="text-center py-12 text-white/40 text-[14px]">
          Aucun {itemName} pour le moment. Cliquez sur "Ajouter" pour en créer un.
        </div>
      )}

      {/* Edit/Create modal */}
      {(editing || creating) && (
        <EditModal
          fields={fields}
          item={editing}
          itemName={itemName}
          saving={saving}
          onSave={handleSave}
          onClose={() => {
            setEditing(null);
            setCreating(false);
          }}
        />
      )}
    </div>
  );
}

function EditModal({
  fields,
  item,
  itemName,
  saving,
  onSave,
  onClose,
}: {
  fields: FieldDef[];
  item: Item | null;
  itemName: string;
  saving: boolean;
  onSave: (data: Record<string, unknown>) => void;
  onClose: () => void;
}) {
  const [formData, setFormData] = useState<Record<string, unknown>>(() => {
    const data: Record<string, unknown> = {};
    fields.forEach((f) => {
      data[f.key] = item?.[f.key] ?? (f.type === "number" ? 0 : "");
    });
    if (item) data.id = item.id;
    return data;
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <div
      className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div
        className="w-full max-w-[560px] max-h-[90vh] overflow-y-auto rounded-2xl border border-white/15 bg-[#2b2344] shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between p-5 border-b border-white/10">
          <h2 className="text-white text-lg font-semibold" style={{ fontFamily: "var(--font-manrope)" }}>
            {item ? "Modifier" : "Créer"} — {itemName}
          </h2>
          <button onClick={onClose} className="text-white/50 hover:text-white p-1" aria-label="Fermer">
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-5 flex flex-col gap-4">
          {fields.map((field) => (
            <div key={field.key} className="flex flex-col gap-1.5">
              <label className="text-white/75 text-[12px] font-medium" style={{ fontFamily: "var(--font-cabin)" }}>
                {field.label} {field.required && <span className="text-[#c4a4ff]">*</span>}
              </label>
              {field.type === "textarea" ? (
                <textarea
                  value={String(formData[field.key] || "")}
                  onChange={(e) => setFormData({ ...formData, [field.key]: e.target.value })}
                  required={field.required}
                  rows={3}
                  className="bg-white/[0.04] border border-white/12 text-white placeholder:text-white/30 rounded-lg px-3 py-2 text-[14px] focus:outline-none focus:border-[#7b39fc] focus:ring-2 focus:ring-[#7b39fc]/25 resize-none"
                  style={{ fontFamily: "var(--font-inter)" }}
                />
              ) : field.type === "color" ? (
                <div className="flex items-center gap-3">
                  <input
                    type="color"
                    value={String(formData[field.key] || "#7b39fc")}
                    onChange={(e) => setFormData({ ...formData, [field.key]: e.target.value })}
                    className="h-10 w-14 rounded-lg border border-white/15 bg-transparent cursor-pointer"
                  />
                  <input
                    type="text"
                    value={String(formData[field.key] || "")}
                    onChange={(e) => setFormData({ ...formData, [field.key]: e.target.value })}
                    className="flex-1 bg-white/[0.04] border border-white/12 text-white rounded-lg px-3 py-2 text-[14px] font-mono focus:outline-none focus:border-[#7b39fc]"
                  />
                </div>
              ) : (
                <input
                  type={field.type === "number" ? "number" : "text"}
                  value={String(formData[field.key] ?? "")}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      [field.key]: field.type === "number" ? Number(e.target.value) : e.target.value,
                    })
                  }
                  required={field.required}
                  className="h-11 bg-white/[0.04] border border-white/12 text-white placeholder:text-white/30 rounded-lg px-3 text-[14px] focus:outline-none focus:border-[#7b39fc] focus:ring-2 focus:ring-[#7b39fc]/25"
                  style={{ fontFamily: "var(--font-inter)" }}
                />
              )}
            </div>
          ))}

          <div className="flex items-center gap-3 mt-2">
            <button
              type="submit"
              disabled={saving}
              className="inline-flex items-center gap-2 rounded-lg bg-[#7b39fc] px-5 py-2.5 text-white text-[14px] font-semibold hover:bg-[#8a4dff] disabled:opacity-60 transition-all"
              style={{ fontFamily: "var(--font-cabin)" }}
            >
              <Save className="h-4 w-4" strokeWidth={2} />
              {saving ? "Enregistrement…" : "Enregistrer"}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg border border-white/15 px-5 py-2.5 text-white/70 text-[14px] hover:bg-white/5 transition-all"
              style={{ fontFamily: "var(--font-cabin)" }}
            >
              Annuler
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
