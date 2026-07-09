import { useState, useEffect } from "react";
import { Plus, Trash2, Loader2, Send } from "lucide-react";
import { supabase } from "../lib/supabase";

export default function AdminNotifications() {
  const [notifs, setNotifs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showForm, setShowForm] = useState(false);

  const [form, setForm] = useState({
    title: "",
    message: "",
    target_user_id: "",
  });

  const fetchNotifs = async () => {
    setLoading(true);
    const { data } = await supabase
      .from("notifications")
      .select("*")
      .order("created_at", { ascending: false });
    setNotifs(data || []);
    setLoading(false);
  };

  useEffect(() => {
    fetchNotifs();
    const channel = supabase
      .channel("notif_changes")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "notifications" },
        () => fetchNotifs(),
      )
      .subscribe();
    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const handleSave = async () => {
    if (!form.title || !form.message)
      return alert("Judul dan pesan wajib diisi!");
    setSaving(true);

    const payload = {
      title: form.title,
      message: form.message,
      target_user_id: form.target_user_id || null,
    };

    await supabase.from("notifications").insert([payload]);

    setShowForm(false);
    setForm({ title: "", message: "", target_user_id: "" });
    setSaving(false);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Hapus notifikasi ini?")) return;
    await supabase.from("notifications").delete().eq("id", id);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-orbitron font-semibold uppercase text-white">
          SISTEM NOTIFIKASI
        </h2>
        <button
          onClick={() => setShowForm(true)}
          className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-orbitron uppercase text-[#0A1020] bg-gradient-to-r from-[#9FD3E8] to-[#BEEAF5]"
        >
          <Plus className="w-4 h-4" /> BUAT NOTIFIKASI
        </button>
      </div>

      <div className="bg-[rgba(10,16,32,0.5)] rounded-2xl border border-[rgba(159,211,232,0.15)] overflow-hidden">
        <table className="w-full text-left">
          <thead>
            <tr className="border-b border-white/5 text-[10px] font-orbitron uppercase text-white/40">
              <th className="px-4 py-3">Judul</th>
              <th className="px-4 py-3">Pesan</th>
              <th className="px-4 py-3">Target</th>
              <th className="px-4 py-3 text-right">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={4} className="py-10 text-center">
                  <Loader2 className="animate-spin w-6 h-6 mx-auto text-[#9FD3E8]" />
                </td>
              </tr>
            ) : (
              notifs.map((n) => (
                <tr
                  key={n.id}
                  className="border-b border-white/5 hover:bg-white/5"
                >
                  <td className="px-4 py-3 text-sm text-white font-semibold">
                    {n.title}
                  </td>
                  <td className="px-4 py-3 text-xs text-white/70 max-w-xs truncate">
                    {n.message}
                  </td>
                  <td className="px-4 py-3 text-[10px] font-orbitron">
                    {n.target_user_id ? (
                      <span className="text-[#E040FB]">Spesifik User</span>
                    ) : (
                      <span className="text-[#00E5FF]">Semua User</span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <button
                      onClick={() => handleDelete(n.id)}
                      className="p-2 text-[#FF4081] hover:bg-[#FF4081]/10 rounded-lg"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
          <div className="card-surface rounded-2xl border border-[rgba(159,211,232,0.2)] p-6 w-full max-w-md bg-[#0A1020]">
            <h3 className="text-base font-orbitron font-semibold text-white mb-4">
              KIRIM NOTIFIKASI BARU
            </h3>
            <div className="space-y-3">
              <div>
                <label className="text-[10px] font-orbitron text-white/40 mb-1 block">
                  Judul
                </label>
                <input
                  type="text"
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-[rgba(10,16,32,0.5)] border border-[rgba(159,211,232,0.15)] text-sm text-white outline-none"
                />
              </div>
              <div>
                <label className="text-[10px] font-orbitron text-white/40 mb-1 block">
                  Pesan
                </label>
                <textarea
                  value={form.message}
                  onChange={(e) =>
                    setForm({ ...form, message: e.target.value })
                  }
                  className="w-full px-3 py-2 rounded-xl bg-[rgba(10,16,32,0.5)] border border-[rgba(159,211,232,0.15)] text-sm text-white outline-none h-24"
                />
              </div>
              <div>
                <label className="text-[10px] font-orbitron text-white/40 mb-1 block">
                  Target User ID (Kosongkan jika untuk semua)
                </label>
                <input
                  type="text"
                  value={form.target_user_id}
                  onChange={(e) =>
                    setForm({ ...form, target_user_id: e.target.value })
                  }
                  placeholder="Contoh: 123e4567-e89b-12d3..."
                  className="w-full px-3 py-2 rounded-xl bg-[rgba(10,16,32,0.5)] border border-[rgba(159,211,232,0.15)] text-sm text-white outline-none font-mono"
                />
              </div>
            </div>
            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setShowForm(false)}
                className="flex-1 py-2 rounded-xl text-xs font-orbitron text-white/60 border border-white/10 hover:bg-white/5"
              >
                BATAL
              </button>
              <button
                onClick={handleSave}
                disabled={saving}
                className="flex-1 py-2 flex justify-center items-center gap-2 rounded-xl text-xs font-orbitron text-[#0A1020] bg-[#9FD3E8] disabled:opacity-50"
              >
                <Send className="w-3 h-3" /> {saving ? "MENGIRIM..." : "KIRIM"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
