// src/admin/AdminPromos.tsx — UPGRADED
// ============================================================
// Manajemen Promo & Kode Promo — SZSTORE Admin Panel
// ============================================================
import { useState, useEffect } from "react";
import {
  Plus,
  Edit2,
  Trash2,
  Loader2,
  X,
  Save,
  Tag,
  Percent,
  DollarSign,
  Calendar,
  BarChart2,
  Copy,
  Check,
  Image as ImageIcon,
  Link as LinkIcon,
} from "lucide-react";
import { supabase } from "../lib/supabase";

const emptyForm = {
  // Banner / Promo Display
  title: "",
  description: "",
  banner_url: "",
  discount_percent: 0,
  // Kode Promo
  code: "",
  type: "percent" as "percent" | "flat",
  amount: 0,
  min_purchase: 0,
  max_discount: 0,
  quota: -1,
  // Dates & Status
  start_date: "",
  end_date: "",
  status: true,
};

export default function AdminPromos() {
  const [promos, setPromos] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<any | null>(null);
  const [form, setForm] = useState({ ...emptyForm });
  const [activeTab, setActiveTab] = useState<"banner" | "code">("banner");
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  const fetchPromos = async () => {
    setLoading(true);
    const { data } = await supabase
      .from("promos")
      .select("*, promo_usages(count)")
      .order("created_at", { ascending: false });
    setPromos(data || []);
    setLoading(false);
  };

  useEffect(() => {
    fetchPromos();
    const channel = supabase
      .channel("promos_changes")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "promos" },
        fetchPromos
      )
      .subscribe();
    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const openForm = (promo: any = null) => {
    if (promo) {
      setEditing(promo);
      setForm({
        title: promo.title || "",
        description: promo.description || "",
        banner_url: promo.banner_url || "",
        discount_percent: promo.discount_percent || 0,
        code: promo.code || "",
        type: promo.type || "percent",
        amount: promo.amount || 0,
        min_purchase: promo.min_purchase || 0,
        max_discount: promo.max_discount || 0,
        quota: promo.quota ?? -1,
        start_date: promo.start_date || "",
        end_date: promo.end_date || "",
        status: promo.status !== false,
      });
    } else {
      setEditing(null);
      setForm({ ...emptyForm });
    }
    setShowForm(true);
    setActiveTab("banner");
  };

  const closeForm = () => {
    setShowForm(false);
    setEditing(null);
    setForm({ ...emptyForm });
  };

  const handleSave = async () => {
    if (!form.title.trim()) return alert("Judul promo wajib diisi!");
    setSaving(true);

    const payload: any = {
      title: form.title.trim(),
      description: form.description.trim(),
      banner_url: form.banner_url.trim(),
      discount_percent: Number(form.discount_percent),
      status: form.status,
      start_date: form.start_date || null,
      end_date: form.end_date || null,
    };

    // Kode promo fields (hanya jika ada kode)
    if (form.code.trim()) {
      payload.code = form.code.trim().toUpperCase();
      payload.type = form.type;
      payload.amount = Number(form.amount);
      payload.min_purchase = Number(form.min_purchase);
      payload.max_discount = Number(form.max_discount);
      payload.quota = form.quota === -1 ? -1 : Number(form.quota);
    }

    if (editing) {
      const { error } = await supabase
        .from("promos")
        .update(payload)
        .eq("id", editing.id);
      if (error) alert("Gagal: " + error.message);
    } else {
      const { error } = await supabase.from("promos").insert([payload]);
      if (error) alert("Gagal: " + error.message);
    }

    setSaving(false);
    closeForm();
    fetchPromos();
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Yakin hapus promo ini?")) return;
    await supabase.from("promos").delete().eq("id", id);
    fetchPromos();
  };

  const toggleStatus = async (id: string, current: boolean) => {
    await supabase.from("promos").update({ status: !current }).eq("id", id);
    fetchPromos();
  };

  const copyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  // Promos dengan kode vs hanya banner
  const promosWithCode = promos.filter((p) => p.code);
  const bannerPromos = promos.filter((p) => !p.code);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-base font-orbitron font-bold uppercase text-white">
            Promo & Kode Promo
          </h2>
          <p className="text-xs text-white/40 mt-0.5">
            Kelola banner promo dan kode diskon
          </p>
        </div>
        <button
          onClick={() => openForm()}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-orbitron uppercase text-[#0A1020] bg-gradient-to-r from-[#9FD3E8] to-[#BEEAF5] hover:scale-[1.02] transition-all shadow-lg"
        >
          <Plus className="w-4 h-4" /> Tambah Promo
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { label: "Total Promo", value: promos.length, color: "text-[#9FD3E8]" },
          { label: "Kode Aktif", value: promosWithCode.filter((p) => p.status).length, color: "text-emerald-400" },
          { label: "Banner", value: bannerPromos.length, color: "text-[#FF007F]" },
          { label: "Total Dipakai", value: promos.reduce((s, p) => s + (p.used_count || 0), 0), color: "text-amber-400" },
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

      {/* KODE PROMO Section */}
      {promosWithCode.length > 0 && (
        <div>
          <h3 className="text-xs font-orbitron text-white/50 uppercase mb-3 flex items-center gap-2">
            <Tag className="w-3.5 h-3.5" /> Kode Promo ({promosWithCode.length})
          </h3>
          <div className="bg-[#0A1020] rounded-2xl border border-[rgba(159,211,232,0.1)] overflow-hidden">
            <table className="w-full text-left text-sm">
              <thead className="border-b border-white/5">
                <tr className="text-[10px] font-orbitron text-white/30 uppercase">
                  <th className="px-4 py-3">Kode</th>
                  <th className="px-4 py-3">Diskon</th>
                  <th className="px-4 py-3">Min. Belanja</th>
                  <th className="px-4 py-3 text-center">Kuota</th>
                  <th className="px-4 py-3 text-center">Dipakai</th>
                  <th className="px-4 py-3 text-center">Status</th>
                  <th className="px-4 py-3 text-center">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {promosWithCode.map((p) => (
                  <tr key={p.id} className="hover:bg-white/[0.02] transition-colors">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-[#00E5FF] font-bold text-sm bg-[#00E5FF]/10 px-2.5 py-1 rounded-lg">
                          {p.code}
                        </span>
                        <button
                          onClick={() => copyCode(p.code)}
                          className="text-white/30 hover:text-white transition-colors"
                        >
                          {copiedCode === p.code ? (
                            <Check className="w-3.5 h-3.5 text-emerald-400" />
                          ) : (
                            <Copy className="w-3.5 h-3.5" />
                          )}
                        </button>
                      </div>
                      <p className="text-[10px] text-white/30 mt-0.5 truncate max-w-[140px]">
                        {p.title}
                      </p>
                    </td>
                    <td className="px-4 py-3">
                      <span className="font-bold text-[#FF007F]">
                        {p.type === "percent"
                          ? `${p.amount}%`
                          : `Rp ${(p.amount || 0).toLocaleString("id-ID")}`}
                      </span>
                      {p.max_discount > 0 && (
                        <p className="text-[10px] text-white/30">
                          Max Rp {p.max_discount.toLocaleString("id-ID")}
                        </p>
                      )}
                    </td>
                    <td className="px-4 py-3 text-white/60 text-xs">
                      {p.min_purchase > 0
                        ? `Rp ${p.min_purchase.toLocaleString("id-ID")}`
                        : "—"}
                    </td>
                    <td className="px-4 py-3 text-center">
                      <span className="text-xs text-white/60">
                        {p.quota === -1 ? "∞" : p.quota}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-center">
                      <div className="flex flex-col items-center">
                        <span className="text-xs font-bold text-white">
                          {p.used_count || 0}
                        </span>
                        {p.quota > 0 && (
                          <div className="w-12 bg-white/10 rounded-full h-1 mt-1">
                            <div
                              className="bg-[#9FD3E8] h-1 rounded-full"
                              style={{
                                width: `${Math.min(100, ((p.used_count || 0) / p.quota) * 100)}%`,
                              }}
                            />
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="px-4 py-3 text-center">
                      <button
                        onClick={() => toggleStatus(p.id, p.status)}
                        className={`px-2.5 py-1 rounded-lg text-[10px] font-bold transition-all ${
                          p.status
                            ? "bg-emerald-500/15 text-emerald-400 border border-emerald-500/30"
                            : "bg-white/5 text-white/30 border border-white/10"
                        }`}
                      >
                        {p.status ? "AKTIF" : "OFF"}
                      </button>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-center gap-1.5">
                        <button
                          onClick={() => openForm(p)}
                          className="p-1.5 rounded-lg border border-[#9FD3E8]/20 text-[#9FD3E8]/60 hover:text-[#9FD3E8] hover:bg-[#9FD3E8]/10 transition-all"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleDelete(p.id)}
                          className="p-1.5 rounded-lg border border-[#FF007F]/20 text-[#FF007F]/60 hover:text-[#FF007F] hover:bg-[#FF007F]/10 transition-all"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* BANNER PROMO Section */}
      {loading ? (
        <div className="flex justify-center py-10">
          <Loader2 className="animate-spin text-[#9FD3E8] w-8 h-8" />
        </div>
      ) : promos.length === 0 ? (
        <div className="text-center py-12 text-white/30 bg-[#0A1020] rounded-2xl border border-white/5">
          <ImageIcon className="w-10 h-10 mx-auto mb-2 opacity-30" />
          <p className="text-sm">Belum ada promo.</p>
        </div>
      ) : bannerPromos.length > 0 ? (
        <div>
          <h3 className="text-xs font-orbitron text-white/50 uppercase mb-3 flex items-center gap-2">
            <ImageIcon className="w-3.5 h-3.5" /> Banner Promo ({bannerPromos.length})
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {bannerPromos.map((p) => (
              <div
                key={p.id}
                className="rounded-2xl border border-[rgba(159,211,232,0.15)] overflow-hidden bg-[rgba(10,16,32,0.5)]"
              >
                <div className="h-32 bg-[rgba(10,16,32,0.8)] relative flex items-center justify-center overflow-hidden">
                  {p.banner_url ? (
                    <img
                      src={p.banner_url}
                      alt={p.title}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <ImageIcon className="w-8 h-8 text-white/20" />
                  )}
                  {p.discount_percent > 0 && (
                    <div className="absolute top-2 right-2 px-2 py-1 bg-[#FF007F] text-white text-[10px] font-bold rounded-lg">
                      -{p.discount_percent}%
                    </div>
                  )}
                  <div
                    className={`absolute top-2 left-2 px-2 py-0.5 rounded-lg text-[10px] font-bold ${
                      p.status
                        ? "bg-emerald-500 text-white"
                        : "bg-white/20 text-white/50"
                    }`}
                  >
                    {p.status ? "AKTIF" : "NONAKTIF"}
                  </div>
                </div>
                <div className="p-3">
                  <h3 className="text-sm font-orbitron font-semibold text-white mb-1 truncate">
                    {p.title}
                  </h3>
                  <p className="text-xs text-white/40 mb-3 line-clamp-1">
                    {p.description}
                  </p>
                  <div className="flex gap-2">
                    <button
                      onClick={() => toggleStatus(p.id, p.status)}
                      className={`flex-1 py-1.5 rounded-lg text-xs border transition-all ${
                        p.status
                          ? "border-amber-400/30 text-amber-400 hover:bg-amber-400/10"
                          : "border-emerald-400/30 text-emerald-400 hover:bg-emerald-400/10"
                      }`}
                    >
                      {p.status ? "NONAKTIFKAN" : "AKTIFKAN"}
                    </button>
                    <button
                      onClick={() => openForm(p)}
                      className="p-1.5 rounded-lg border border-[#9FD3E8]/30 text-[#9FD3E8] hover:bg-[#9FD3E8]/10"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => handleDelete(p.id)}
                      className="p-1.5 rounded-lg border border-[#FF007F]/30 text-[#FF007F] hover:bg-[#FF007F]/10"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : null}

      {/* MODAL FORM */}
      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
          <div
            className="w-full max-w-lg rounded-2xl border border-[rgba(159,211,232,0.2)] overflow-hidden"
            style={{
              background: "linear-gradient(145deg, #0D1425, #0A1020)",
              boxShadow: "0 0 60px rgba(159,211,232,0.1)",
            }}
          >
            {/* Header */}
            <div className="flex items-center justify-between px-5 py-4 border-b border-white/10">
              <h3 className="text-sm font-orbitron font-bold text-white">
                {editing ? "Edit Promo" : "Tambah Promo Baru"}
              </h3>
              <button onClick={closeForm} className="text-white/40 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Tabs */}
            <div className="flex border-b border-white/10">
              {(["banner", "code"] as const).map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`flex-1 py-2.5 text-xs font-orbitron uppercase transition-all ${
                    activeTab === tab
                      ? "text-[#9FD3E8] border-b-2 border-[#9FD3E8]"
                      : "text-white/40 hover:text-white"
                  }`}
                >
                  {tab === "banner" ? "📢 Banner" : "🏷️ Kode Promo"}
                </button>
              ))}
            </div>

            <div className="p-5 max-h-[60vh] overflow-y-auto">
              {activeTab === "banner" ? (
                <div className="space-y-4">
                  {/* Banner URL */}
                  <div>
                    <label className="text-[10px] font-orbitron uppercase text-white/40 mb-1.5 block">
                      URL Banner
                    </label>
                    <div className="relative">
                      <LinkIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
                      <input
                        type="url"
                        value={form.banner_url}
                        onChange={(e) => setForm({ ...form, banner_url: e.target.value })}
                        placeholder="https://i.imgur.com/xxxxx.jpg"
                        className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-white/5 border border-white/10 text-sm text-white outline-none focus:border-[#9FD3E8]/50"
                      />
                    </div>
                    {form.banner_url && (
                      <div className="mt-2 h-24 rounded-xl overflow-hidden bg-white/5 border border-white/10">
                        <img
                          src={form.banner_url}
                          alt="preview"
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            (e.target as HTMLImageElement).src = "";
                          }}
                        />
                      </div>
                    )}
                  </div>

                  {/* Judul */}
                  <div>
                    <label className="text-[10px] font-orbitron uppercase text-white/40 mb-1.5 block">
                      Judul Promo *
                    </label>
                    <input
                      type="text"
                      value={form.title}
                      onChange={(e) => setForm({ ...form, title: e.target.value })}
                      placeholder="Contoh: Promo Spesial 7.7"
                      className="w-full px-3 py-2.5 rounded-xl bg-white/5 border border-white/10 text-sm text-white outline-none focus:border-[#9FD3E8]/50"
                    />
                  </div>

                  {/* Deskripsi */}
                  <div>
                    <label className="text-[10px] font-orbitron uppercase text-white/40 mb-1.5 block">
                      Deskripsi
                    </label>
                    <textarea
                      value={form.description}
                      onChange={(e) => setForm({ ...form, description: e.target.value })}
                      rows={2}
                      placeholder="Deskripsi singkat..."
                      className="w-full px-3 py-2.5 rounded-xl bg-white/5 border border-white/10 text-sm text-white outline-none focus:border-[#9FD3E8]/50 resize-none"
                    />
                  </div>

                  {/* Diskon & Status */}
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-[10px] font-orbitron uppercase text-white/40 mb-1.5 block">
                        Diskon Tampil (%)
                      </label>
                      <div className="relative">
                        <Percent className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
                        <input
                          type="number"
                          min="0"
                          max="100"
                          value={form.discount_percent}
                          onChange={(e) =>
                            setForm({ ...form, discount_percent: Number(e.target.value) })
                          }
                          className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-white/5 border border-white/10 text-sm text-white outline-none"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="text-[10px] font-orbitron uppercase text-white/40 mb-1.5 block">
                        Status
                      </label>
                      <button
                        onClick={() => setForm({ ...form, status: !form.status })}
                        className={`w-full py-2.5 rounded-xl text-xs font-orbitron border transition-all ${
                          form.status
                            ? "bg-emerald-500/20 border-emerald-500/40 text-emerald-400"
                            : "bg-white/5 border-white/10 text-white/40"
                        }`}
                      >
                        {form.status ? "✓ AKTIF" : "✗ NONAKTIF"}
                      </button>
                    </div>
                  </div>

                  {/* Tanggal */}
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-[10px] font-orbitron uppercase text-white/40 mb-1.5 block">
                        Tanggal Mulai
                      </label>
                      <input
                        type="date"
                        value={form.start_date}
                        onChange={(e) => setForm({ ...form, start_date: e.target.value })}
                        className="w-full px-3 py-2.5 rounded-xl bg-white/5 border border-white/10 text-sm text-white outline-none"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] font-orbitron uppercase text-white/40 mb-1.5 block">
                        Tanggal Selesai
                      </label>
                      <input
                        type="date"
                        value={form.end_date}
                        onChange={(e) => setForm({ ...form, end_date: e.target.value })}
                        className="w-full px-3 py-2.5 rounded-xl bg-white/5 border border-white/10 text-sm text-white outline-none"
                      />
                    </div>
                  </div>
                </div>
              ) : (
                // TAB KODE PROMO
                <div className="space-y-4">
                  <div className="flex items-start gap-2 p-3 rounded-xl bg-[#00E5FF]/5 border border-[#00E5FF]/20">
                    <BarChart2 className="w-4 h-4 text-[#00E5FF] shrink-0 mt-0.5" />
                    <p className="text-xs text-white/60">
                      <span className="text-[#00E5FF] font-bold">Tips:</span> Kode promo bersifat opsional. Jika diisi, user bisa input kode ini di halaman checkout untuk mendapat diskon.
                    </p>
                  </div>

                  {/* Kode */}
                  <div>
                    <label className="text-[10px] font-orbitron uppercase text-white/40 mb-1.5 block">
                      Kode Promo
                    </label>
                    <input
                      type="text"
                      value={form.code}
                      onChange={(e) =>
                        setForm({ ...form, code: e.target.value.toUpperCase() })
                      }
                      placeholder="Contoh: SZSTORE10"
                      className="w-full px-3 py-2.5 rounded-xl bg-white/5 border border-white/10 text-sm text-white font-mono outline-none focus:border-[#9FD3E8]/50 tracking-widest uppercase"
                    />
                  </div>

                  {/* Jenis Diskon */}
                  <div>
                    <label className="text-[10px] font-orbitron uppercase text-white/40 mb-1.5 block">
                      Jenis Diskon
                    </label>
                    <div className="grid grid-cols-2 gap-2">
                      {(["percent", "flat"] as const).map((t) => (
                        <button
                          key={t}
                          onClick={() => setForm({ ...form, type: t })}
                          className={`py-2.5 rounded-xl text-xs font-orbitron border flex items-center justify-center gap-2 transition-all ${
                            form.type === t
                              ? "bg-[#9FD3E8]/20 border-[#9FD3E8]/50 text-[#9FD3E8]"
                              : "bg-white/5 border-white/10 text-white/40"
                          }`}
                        >
                          {t === "percent" ? (
                            <Percent className="w-3.5 h-3.5" />
                          ) : (
                            <DollarSign className="w-3.5 h-3.5" />
                          )}
                          {t === "percent" ? "Persentase" : "Nominal (Rp)"}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Nominal */}
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-[10px] font-orbitron uppercase text-white/40 mb-1.5 block">
                        {form.type === "percent" ? "Persentase (%)" : "Nominal (Rp)"}
                      </label>
                      <input
                        type="number"
                        min="0"
                        value={form.amount}
                        onChange={(e) =>
                          setForm({ ...form, amount: Number(e.target.value) })
                        }
                        className="w-full px-3 py-2.5 rounded-xl bg-white/5 border border-white/10 text-sm text-white outline-none focus:border-[#9FD3E8]/50"
                      />
                    </div>
                    {form.type === "percent" && (
                      <div>
                        <label className="text-[10px] font-orbitron uppercase text-white/40 mb-1.5 block">
                          Max Diskon (Rp)
                        </label>
                        <input
                          type="number"
                          min="0"
                          value={form.max_discount}
                          onChange={(e) =>
                            setForm({ ...form, max_discount: Number(e.target.value) })
                          }
                          placeholder="0 = no limit"
                          className="w-full px-3 py-2.5 rounded-xl bg-white/5 border border-white/10 text-sm text-white outline-none focus:border-[#9FD3E8]/50"
                        />
                      </div>
                    )}
                  </div>

                  {/* Min Belanja & Kuota */}
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-[10px] font-orbitron uppercase text-white/40 mb-1.5 block">
                        Minimum Belanja
                      </label>
                      <input
                        type="number"
                        min="0"
                        value={form.min_purchase}
                        onChange={(e) =>
                          setForm({ ...form, min_purchase: Number(e.target.value) })
                        }
                        placeholder="0 = tanpa minimum"
                        className="w-full px-3 py-2.5 rounded-xl bg-white/5 border border-white/10 text-sm text-white outline-none focus:border-[#9FD3E8]/50"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] font-orbitron uppercase text-white/40 mb-1.5 block">
                        Kuota (-1 = ∞)
                      </label>
                      <input
                        type="number"
                        min="-1"
                        value={form.quota}
                        onChange={(e) =>
                          setForm({ ...form, quota: Number(e.target.value) })
                        }
                        className="w-full px-3 py-2.5 rounded-xl bg-white/5 border border-white/10 text-sm text-white outline-none focus:border-[#9FD3E8]/50"
                      />
                    </div>
                  </div>

                  {/* Tanggal */}
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-[10px] font-orbitron uppercase text-white/40 mb-1.5 block">
                        <Calendar className="inline w-3 h-3 mr-1" />
                        Mulai
                      </label>
                      <input
                        type="date"
                        value={form.start_date}
                        onChange={(e) => setForm({ ...form, start_date: e.target.value })}
                        className="w-full px-3 py-2.5 rounded-xl bg-white/5 border border-white/10 text-sm text-white outline-none"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] font-orbitron uppercase text-white/40 mb-1.5 block">
                        <Calendar className="inline w-3 h-3 mr-1" />
                        Berakhir
                      </label>
                      <input
                        type="date"
                        value={form.end_date}
                        onChange={(e) => setForm({ ...form, end_date: e.target.value })}
                        className="w-full px-3 py-2.5 rounded-xl bg-white/5 border border-white/10 text-sm text-white outline-none"
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="flex gap-3 p-5 border-t border-white/10">
              <button
                onClick={closeForm}
                className="flex-1 py-2.5 rounded-xl text-xs font-orbitron text-white/60 border border-white/10 hover:bg-white/5"
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
