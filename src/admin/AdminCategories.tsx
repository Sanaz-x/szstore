// src/admin/AdminCategories.tsx
// ============================================================
// Manajemen Kategori Produk — SZSTORE Admin Panel
// ============================================================
import { useState, useEffect } from "react";
import {
  Plus,
  Edit2,
  Trash2,
  Loader2,
  X,
  Save,
  GripVertical,
  Tag,
  Image as ImageIcon,
  ToggleLeft,
  ToggleRight,
} from "lucide-react";
import { supabase } from "../lib/supabase";

const emptyForm = {
  name: "",
  slug: "",
  icon_url: "",
  sort_order: 0,
  is_active: true,
};

function slugify(str: string) {
  return str
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9-]/g, "")
    .replace(/-+/g, "-");
}

export default function AdminCategories() {
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<any | null>(null);
  const [form, setForm] = useState({ ...emptyForm });

  const fetchCategories = async () => {
    setLoading(true);
    const { data } = await supabase
      .from("categories")
      .select("*")
      .order("sort_order", { ascending: true });
    setCategories(data || []);
    setLoading(false);
  };

  useEffect(() => {
    fetchCategories();
    const channel = supabase
      .channel("categories_changes")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "categories" },
        fetchCategories
      )
      .subscribe();
    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const openForm = (cat: any = null) => {
    if (cat) {
      setEditing(cat);
      setForm({
        name: cat.name || "",
        slug: cat.slug || "",
        icon_url: cat.icon_url || "",
        sort_order: cat.sort_order || 0,
        is_active: cat.is_active !== false,
      });
    } else {
      setEditing(null);
      setForm({ ...emptyForm, sort_order: categories.length + 1 });
    }
    setShowForm(true);
  };

  const closeForm = () => {
    setShowForm(false);
    setEditing(null);
    setForm({ ...emptyForm });
  };

  const handleNameChange = (val: string) => {
    setForm((f) => ({
      ...f,
      name: val,
      slug: editing ? f.slug : slugify(val),
    }));
  };

  const handleSave = async () => {
    if (!form.name.trim()) return alert("Nama kategori wajib diisi!");
    if (!form.slug.trim()) return alert("Slug wajib diisi!");
    setSaving(true);

    const payload = {
      name: form.name.trim(),
      slug: form.slug.trim(),
      icon_url: form.icon_url.trim(),
      sort_order: Number(form.sort_order),
      is_active: form.is_active,
      updated_at: new Date().toISOString(),
    };

    if (editing) {
      const { error } = await supabase
        .from("categories")
        .update(payload)
        .eq("id", editing.id);
      if (error) alert("Gagal menyimpan: " + error.message);
    } else {
      const { error } = await supabase.from("categories").insert([payload]);
      if (error) alert("Gagal menyimpan: " + error.message);
    }

    setSaving(false);
    closeForm();
    fetchCategories();
  };

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Yakin hapus kategori "${name}"? Semua game di kategori ini akan tidak berkategori.`))
      return;
    setDeleting(id);
    await supabase.from("categories").delete().eq("id", id);
    setDeleting(null);
    fetchCategories();
  };

  const toggleActive = async (id: string, current: boolean) => {
    await supabase
      .from("categories")
      .update({ is_active: !current, updated_at: new Date().toISOString() })
      .eq("id", id);
    fetchCategories();
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-base font-orbitron font-bold uppercase text-white">
            Kategori Produk
          </h2>
          <p className="text-xs text-white/40 mt-0.5">
            Kelola kategori untuk game & layanan
          </p>
        </div>
        <button
          onClick={() => openForm()}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-orbitron uppercase text-[#0A1020] bg-gradient-to-r from-[#9FD3E8] to-[#BEEAF5] hover:scale-[1.02] transition-all shadow-lg"
        >
          <Plus className="w-4 h-4" /> Tambah Kategori
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { label: "Total", value: categories.length, color: "text-[#9FD3E8]" },
          { label: "Aktif", value: categories.filter((c) => c.is_active).length, color: "text-emerald-400" },
          { label: "Nonaktif", value: categories.filter((c) => !c.is_active).length, color: "text-amber-400" },
          { label: "Terurut", value: "Manual", color: "text-white/50" },
        ].map((s) => (
          <div
            key={s.label}
            className="bg-[#0A1020] border border-[rgba(159,211,232,0.1)] rounded-xl p-3"
          >
            <p className="text-[10px] font-orbitron uppercase text-white/30 mb-1">
              {s.label}
            </p>
            <p className={`text-xl font-bold ${s.color}`}>{s.value}</p>
          </div>
        ))}
      </div>

      {/* Category List */}
      <div className="bg-[#0A1020] rounded-2xl border border-[rgba(159,211,232,0.1)] overflow-hidden">
        <div className="p-4 border-b border-white/5">
          <p className="text-xs font-orbitron text-white/40 uppercase">
            Daftar Kategori ({categories.length})
          </p>
        </div>

        {loading ? (
          <div className="flex justify-center py-12">
            <Loader2 className="animate-spin text-[#9FD3E8] w-8 h-8" />
          </div>
        ) : categories.length === 0 ? (
          <div className="text-center py-12 text-white/30">
            <Tag className="w-10 h-10 mx-auto mb-2 opacity-30" />
            <p className="text-sm">Belum ada kategori. Klik "Tambah Kategori".</p>
          </div>
        ) : (
          <div className="divide-y divide-white/5">
            {categories.map((cat, idx) => (
              <div
                key={cat.id}
                className="flex items-center gap-4 px-4 py-3.5 hover:bg-white/[0.03] transition-colors group"
              >
                {/* Drag handle (visual only) */}
                <GripVertical className="w-4 h-4 text-white/20 shrink-0 group-hover:text-white/40 transition-colors" />

                {/* Sort order */}
                <span className="text-xs font-mono text-white/30 w-5 text-center shrink-0">
                  {idx + 1}
                </span>

                {/* Icon */}
                <div className="w-10 h-10 shrink-0 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center overflow-hidden">
                  {cat.icon_url ? (
                    <img
                      src={cat.icon_url}
                      alt={cat.name}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        (e.target as HTMLImageElement).style.display = "none";
                      }}
                    />
                  ) : (
                    <Tag className="w-4 h-4 text-[#9FD3E8]" />
                  )}
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-white truncate">
                    {cat.name}
                  </p>
                  <p className="text-[11px] text-white/40 font-mono">
                    /{cat.slug}
                  </p>
                </div>

                {/* Status */}
                <button
                  onClick={() => toggleActive(cat.id, cat.is_active)}
                  className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[11px] font-semibold transition-all ${
                    cat.is_active
                      ? "bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 hover:bg-emerald-500/25"
                      : "bg-white/5 text-white/30 border border-white/10 hover:bg-white/10"
                  }`}
                >
                  {cat.is_active ? (
                    <ToggleRight className="w-3.5 h-3.5" />
                  ) : (
                    <ToggleLeft className="w-3.5 h-3.5" />
                  )}
                  {cat.is_active ? "Aktif" : "Nonaktif"}
                </button>

                {/* Actions */}
                <div className="flex items-center gap-1.5 shrink-0">
                  <button
                    onClick={() => openForm(cat)}
                    className="p-1.5 rounded-lg border border-[#9FD3E8]/20 text-[#9FD3E8]/60 hover:text-[#9FD3E8] hover:bg-[#9FD3E8]/10 transition-all"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => handleDelete(cat.id, cat.name)}
                    disabled={deleting === cat.id}
                    className="p-1.5 rounded-lg border border-[#FF007F]/20 text-[#FF007F]/60 hover:text-[#FF007F] hover:bg-[#FF007F]/10 transition-all disabled:opacity-40"
                  >
                    {deleting === cat.id ? (
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    ) : (
                      <Trash2 className="w-3.5 h-3.5" />
                    )}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* MODAL FORM */}
      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
          <div
            className="w-full max-w-md rounded-2xl border border-[rgba(159,211,232,0.2)] overflow-hidden"
            style={{
              background: "linear-gradient(145deg, #0D1425, #0A1020)",
              boxShadow: "0 0 60px rgba(159,211,232,0.1)",
            }}
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between px-5 py-4 border-b border-white/10">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 bg-[#9FD3E8]/15 rounded-lg flex items-center justify-center">
                  <Tag className="w-4 h-4 text-[#9FD3E8]" />
                </div>
                <h3 className="text-sm font-orbitron font-bold text-white">
                  {editing ? "Edit Kategori" : "Tambah Kategori Baru"}
                </h3>
              </div>
              <button
                onClick={closeForm}
                className="text-white/40 hover:text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-5 space-y-4">
              {/* Nama */}
              <div>
                <label className="text-[10px] font-orbitron uppercase text-white/40 mb-1.5 block">
                  Nama Kategori *
                </label>
                <input
                  type="text"
                  value={form.name}
                  onChange={(e) => handleNameChange(e.target.value)}
                  placeholder="Contoh: Top Up Games"
                  className="w-full px-3 py-2.5 rounded-xl bg-white/5 border border-white/10 text-sm text-white outline-none focus:border-[#9FD3E8]/50 transition-colors"
                />
              </div>

              {/* Slug */}
              <div>
                <label className="text-[10px] font-orbitron uppercase text-white/40 mb-1.5 block">
                  Slug (URL) *
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30 text-xs font-mono">
                    /
                  </span>
                  <input
                    type="text"
                    value={form.slug}
                    onChange={(e) =>
                      setForm({ ...form, slug: slugify(e.target.value) })
                    }
                    placeholder="top-up-games"
                    className="w-full pl-6 pr-3 py-2.5 rounded-xl bg-white/5 border border-white/10 text-sm text-white font-mono outline-none focus:border-[#9FD3E8]/50 transition-colors"
                  />
                </div>
              </div>

              {/* Icon URL */}
              <div>
                <label className="text-[10px] font-orbitron uppercase text-white/40 mb-1.5 block">
                  URL Icon (Opsional)
                </label>
                <div className="flex gap-2">
                  <input
                    type="url"
                    value={form.icon_url}
                    onChange={(e) =>
                      setForm({ ...form, icon_url: e.target.value })
                    }
                    placeholder="https://..."
                    className="flex-1 px-3 py-2.5 rounded-xl bg-white/5 border border-white/10 text-sm text-white outline-none focus:border-[#9FD3E8]/50 transition-colors"
                  />
                  {form.icon_url ? (
                    <div className="w-10 h-10 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center overflow-hidden shrink-0">
                      <img
                        src={form.icon_url}
                        alt="preview"
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = "";
                        }}
                      />
                    </div>
                  ) : (
                    <div className="w-10 h-10 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center shrink-0">
                      <ImageIcon className="w-4 h-4 text-white/20" />
                    </div>
                  )}
                </div>
              </div>

              {/* Sort Order & Status */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[10px] font-orbitron uppercase text-white/40 mb-1.5 block">
                    Urutan
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={form.sort_order}
                    onChange={(e) =>
                      setForm({ ...form, sort_order: Number(e.target.value) })
                    }
                    className="w-full px-3 py-2.5 rounded-xl bg-white/5 border border-white/10 text-sm text-white outline-none focus:border-[#9FD3E8]/50"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-orbitron uppercase text-white/40 mb-1.5 block">
                    Status
                  </label>
                  <button
                    onClick={() =>
                      setForm({ ...form, is_active: !form.is_active })
                    }
                    className={`w-full py-2.5 rounded-xl text-xs font-orbitron border transition-all ${
                      form.is_active
                        ? "bg-emerald-500/20 border-emerald-500/40 text-emerald-400"
                        : "bg-white/5 border-white/10 text-white/40"
                    }`}
                  >
                    {form.is_active ? "✓ AKTIF" : "✗ NONAKTIF"}
                  </button>
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="flex gap-3 p-5 pt-0">
              <button
                onClick={closeForm}
                className="flex-1 py-2.5 rounded-xl text-xs font-orbitron text-white/60 border border-white/10 hover:bg-white/5 transition-all"
              >
                BATAL
              </button>
              <button
                onClick={handleSave}
                disabled={saving}
                className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-xs font-orbitron text-[#0A1020] bg-gradient-to-r from-[#9FD3E8] to-[#BEEAF5] disabled:opacity-50 hover:scale-[1.02] transition-all"
              >
                {saving ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Save className="w-4 h-4" />
                )}
                {saving ? "MENYIMPAN..." : "SIMPAN"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
