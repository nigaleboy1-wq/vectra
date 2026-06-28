"use client";

import { useEffect, useState, type ReactNode } from "react";
import { Plus, Trash2, Save, X, Pencil, GripVertical, AlertCircle, Upload, Image as ImageIcon } from "lucide-react";

type FieldDef = {
  key: string;
  label: string;
  type: "text" | "textarea" | "number" | "color" | "image";
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
  const [error, setError] = useState<string | null>(null);
  const [toast, setToast] = useState<string | null>(null);

  useEffect(() => {
    fetch(apiPath)
      .then((r) => r.json())
      .then((data) => {
        setItems(Array.isArray(data) ? data : []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [apiPath]);

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  };

  const handleSave = async (data: Record<string, unknown>) => {
    setSaving(true);
    setError(null);
    const method = editing ? "PUT" : "POST";
    const url = editing ? `${apiPath}/${editing.id}` : apiPath;

    try {
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!res.ok) {
        const errText = await res.text().catch(() => "Erreur inconnue");
        throw new Error(`Erreur ${res.status}: ${errText}`);
      }

      const saved = await res.json();
      if (editing) {
        setItems((prev) => prev.map((i) => (i.id === saved.id ? saved : i)));
        showToast(`${itemName} modifié avec succès ✓`);
      } else {
        setItems((prev) => [...prev, saved]);
        showToast(`${itemName} créé avec succès ✓`);
      }
      setEditing(null);
      setCreating(false);
    } catch (e) {
      const msg = e instanceof Error ? e.message : "Erreur de sauvegarde";
      setError(msg);
      console.error("Save error:", e);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm(`Supprimer cet ${itemName} ?`)) return;
    try {
      const res = await fetch(`${apiPath}/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Erreur de suppression");
      setItems((prev) => prev.filter((i) => i.id !== id));
      showToast(`${itemName} supprimé ✓`);
    } catch (e) {
      const msg = e instanceof Error ? e.message : "Erreur de suppression";
      setError(msg);
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
      {/* Toast notification */}
      {toast && (
        <div className="fixed top-6 right-6 z-[60] rounded-lg bg-[#7b39fc] px-5 py-3 text-white text-[14px] font-medium shadow-[0_10px_30px_rgba(123,57,252,0.4)] animate-in fade-in slide-in-from-top-4" style={{ fontFamily: "var(--font-inter)" }}>
          {toast}
        </div>
      )}

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
            setError(null);
          }}
          className="inline-flex items-center gap-2 rounded-lg bg-[#7b39fc] px-4 py-2.5 text-white text-[13px] font-semibold hover:bg-[#8a4dff] transition-all"
          style={{ fontFamily: "var(--font-manrope)" }}
        >
          <Plus className="h-4 w-4" strokeWidth={2} />
          Ajouter
        </button>
      </div>

      {/* Error banner */}
      {error && (
        <div className="flex items-start gap-3 rounded-lg border border-red-500/30 bg-red-500/10 p-4">
          <AlertCircle className="h-5 w-5 text-red-400 shrink-0 mt-0.5" />
          <div className="flex-1">
            <p className="text-red-400 text-[13px] font-medium" style={{ fontFamily: "var(--font-inter)" }}>
              Erreur
            </p>
            <p className="text-white/70 text-[12px] mt-0.5" style={{ fontFamily: "var(--font-inter)" }}>
              {error}
            </p>
          </div>
          <button onClick={() => setError(null)} className="text-white/40 hover:text-white">
            <X className="h-4 w-4" />
          </button>
        </div>
      )}

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
                    setError(null);
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
            setError(null);
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
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  const handleImageUpload = async (fieldKey: string, file: File) => {
    setUploading(true);
    setUploadError(null);
    try {
      const fd = new FormData();
      fd.append("file", file);
      const res = await fetch("/api/upload", { method: "POST", body: fd });
      if (!res.ok) {
        const err = await res.json().catch(() => ({ error: "Upload échoué" }));
        throw new Error(err.error || "Upload échoué");
      }
      const data = await res.json();
      setFormData((prev) => ({ ...prev, [fieldKey]: data.url }));
    } catch (e) {
      setUploadError(e instanceof Error ? e.message : "Erreur d'upload");
    } finally {
      setUploading(false);
    }
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
        <div className="flex items-center justify-between p-5 border-b border-white/10 sticky top-0 bg-[#2b2344] z-10">
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
              ) : field.type === "image" ? (
                <div className="flex flex-col gap-3">
                  {/* Image preview */}
                  {formData[field.key] ? (
                    <div className="relative rounded-lg overflow-hidden border border-white/12 h-32">
                      <img
                        src={String(formData[field.key])}
                        alt="Aperçu"
                        className="w-full h-full object-cover"
                      />
                      <button
                        type="button"
                        onClick={() => setFormData({ ...formData, [field.key]: "" })}
                        className="absolute top-2 right-2 inline-flex h-7 w-7 items-center justify-center rounded-full bg-black/60 text-white hover:bg-red-500/80 transition-colors"
                        aria-label="Supprimer l'image"
                      >
                        <X className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  ) : (
                    <div className="flex items-center justify-center h-32 rounded-lg border border-dashed border-white/20 bg-white/[0.02]">
                      <ImageIcon className="h-8 w-8 text-white/20" />
                    </div>
                  )}
                  {/* Upload button */}
                  <label className={`inline-flex items-center justify-center gap-2 rounded-lg border border-white/15 bg-white/[0.04] px-4 py-2.5 text-white text-[13px] font-medium cursor-pointer hover:bg-white/10 transition-all ${uploading ? "opacity-60 pointer-events-none" : ""}`}>
                    {uploading ? (
                      <>
                        <span className="inline-block h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        Upload en cours…
                      </>
                    ) : (
                      <>
                        <Upload className="h-4 w-4" strokeWidth={2} />
                        {formData[field.key] ? "Changer l'image" : "Télécharger une image"}
                      </>
                    )}
                    <input
                      type="file"
                      accept="image/*,.png,.jpg,.jpeg,.gif,.webp,.svg,.bmp,.avif,.ico,.tiff,.tif"
                      className="hidden"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) handleImageUpload(field.key, file);
                      }}
                    />
                  </label>
                  {/* URL input (alternative) */}
                  <input
                    type="text"
                    value={String(formData[field.key] || "")}
                    onChange={(e) => setFormData({ ...formData, [field.key]: e.target.value })}
                    placeholder="ou collez une URL d'image…"
                    className="h-10 bg-white/[0.04] border border-white/12 text-white placeholder:text-white/30 rounded-lg px-3 text-[13px] focus:outline-none focus:border-[#7b39fc]"
                    style={{ fontFamily: "var(--font-inter)" }}
                  />
                  {uploadError && (
                    <p className="text-red-400 text-[12px]">{uploadError}</p>
                  )}
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
              className="inline-flex items-center gap-2 rounded-lg bg-[#7b39fc] px-5 py-2.5 text-white text-[14px] font-semibold hover:bg-[#8a4dff] disabled:opacity-60 disabled:cursor-wait transition-all"
              style={{ fontFamily: "var(--font-cabin)" }}
            >
              {saving ? (
                <>
                  <span className="inline-block h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Enregistrement…
                </>
              ) : (
                <>
                  <Save className="h-4 w-4" strokeWidth={2} />
                  Enregistrer
                </>
              )}
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
