// src/admin/AdminPaymentGateways.tsx
import { useState, useEffect } from "react";
import { Plus, Edit2, Power, RefreshCw } from "lucide-react";
import { supabase } from "../lib/supabase"; // Pastikan path import supabase client kamu benar

interface Gateway {
  id: number;
  name: string;
  merchant_code: string;
  api_key: string;
  secret_key: string;
  active: boolean;
  callback_url: string;
}

export default function AdminPaymentGateways() {
  const [gateways, setGateways] = useState<Gateway[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<Gateway | null>(null);
  const [form, setForm] = useState<Partial<Gateway>>({});

  // 1. Ambil data asli dari Supabase
  const fetchGateways = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from("payment_gateways")
        .select("*")
        .order("id", { ascending: true });

      if (error) throw error;
      setGateways(data || []);
    } catch (err) {
      console.error("Gagal mengambil data gateway:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGateways();
  }, []);

  // 2. Toggle Aktif/Nonaktif langsung simpan ke Supabase
  const toggleActive = async (id: number, currentStatus: boolean) => {
    try {
      const { error } = await supabase
        .from("payment_gateways")
        .update({ active: !currentStatus })
        .eq("id", id);

      if (error) throw error;
      setGateways((prev) =>
        prev.map((g) => (g.id === id ? { ...g, active: !currentStatus } : g)),
      );
    } catch (err) {
      console.error("Gagal mengubah status:", err);
      alert("Gagal memperbarui status di database");
    }
  };

  // 3. Simpan tambah/edit data ke Supabase
  const handleSave = async () => {
    if (!form.name) return;

    const payload = {
      name: form.name,
      merchant_code: form.merchant_code || "",
      api_key: form.api_key || "",
      secret_key: form.secret_key || "",
      callback_url: form.callback_url || "",
    };

    try {
      if (editing) {
        const { error } = await supabase
          .from("payment_gateways")
          .update(payload)
          .eq("id", editing.id);

        if (error) throw error;
      } else {
        const { error } = await supabase
          .from("payment_gateways")
          .insert([{ ...payload, active: false }]);

        if (error) throw error;
      }

      fetchGateways(); // Reload data
      setShowForm(false);
      setEditing(null);
      setForm({});
    } catch (err) {
      console.error("Gagal menyimpan data:", err);
      alert("Gagal menyimpan konfigurasi ke database");
    }
  };

  return (
    <div className="space-y-4 text-white font-rajdhani">
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-orbitron font-semibold uppercase tracking-[0.03em] text-white">
          PAYMENT GATEWAY MANAGEMENT
        </h2>
        <div className="flex gap-2">
          <button
            onClick={fetchGateways}
            className="p-2 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
          </button>
          <button
            onClick={() => {
              setEditing(null);
              setForm({});
              setShowForm(true);
            }}
            className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-orbitron uppercase tracking-wider text-[#0A1020] transition-all hover:scale-[1.02]"
            style={{ background: "linear-gradient(135deg, #9FD3E8, #BEEAF5)" }}
          >
            <Plus className="w-4 h-4" /> TAMBAH GATEWAY
          </button>
        </div>
      </div>

      {loading ? (
        <div className="text-center py-8 text-white/40 text-xs">
          Menghubungkan ke Supabase Database...
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {gateways.map((g) => (
            <div
              key={g.id}
              className="bg-[#1c0a30] rounded-2xl border border-[rgba(159,211,232,0.15)] p-5 hover:border-[rgba(159,211,232,0.3)] transition-all"
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-orbitron font-semibold text-white">
                  {g.name}
                </h3>
                <button
                  onClick={() => toggleActive(g.id, g.active)}
                  className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-[10px] font-orbitron uppercase tracking-wider transition-all border ${
                    g.active
                      ? "bg-[rgba(0,229,255,0.1)] text-[#00E5FF] border-[rgba(0,229,255,0.3)]"
                      : "bg-[rgba(255,64,129,0.1)] text-[#FF4081] border-[rgba(255,64,129,0.3)]"
                  }`}
                >
                  <Power className="w-3 h-3" />
                  {g.active ? "AKTIF" : "NONAKTIF"}
                </button>
              </div>

              <div className="space-y-2.5">
                <div>
                  <p className="text-[10px] font-orbitron uppercase tracking-wider text-white/30">
                    Merchant Code
                  </p>
                  <p className="text-xs text-white/60 font-mono truncate">
                    {g.merchant_code || "-"}
                  </p>
                </div>
                <div>
                  <p className="text-[10px] font-orbitron uppercase tracking-wider text-white/30">
                    API Key
                  </p>
                  <p className="text-xs text-white/60 font-mono truncate">
                    {g.api_key || "-"}
                  </p>
                </div>
                <div>
                  <p className="text-[10px] font-orbitron uppercase tracking-wider text-white/30">
                    Secret Key
                  </p>
                  <p className="text-xs text-white/60 font-mono truncate">
                    {g.secret_key || "-"}
                  </p>
                </div>
                <div>
                  <p className="text-[10px] font-orbitron uppercase tracking-wider text-white/30">
                    Callback URL
                  </p>
                  <p className="text-[10px] text-[#9FD3E8] break-all">
                    {g.callback_url || "-"}
                  </p>
                </div>
              </div>

              <button
                onClick={() => {
                  setEditing(g);
                  setForm({ ...g });
                  setShowForm(true);
                }}
                className="mt-4 flex items-center gap-1 px-3 py-1.5 rounded-lg text-[10px] font-orbitron uppercase tracking-wider text-[#9FD3E8] border border-[rgba(159,211,232,0.2)] hover:bg-[rgba(159,211,232,0.1)] transition-all"
              >
                <Edit2 className="w-3 h-3" /> EDIT
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Form Modal */}
      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-[#120224] rounded-2xl border border-[rgba(159,211,232,0.2)] p-6 w-full max-w-lg text-white">
            <h3 className="text-base font-orbitron font-semibold uppercase tracking-[0.03em] text-white mb-4">
              {editing ? "EDIT GATEWAY" : "TAMBAH GATEWAY"}
            </h3>
            <div className="space-y-3">
              {[
                { key: "name", label: "Gateway Name" },
                { key: "merchant_code", label: "Merchant Code" },
                { key: "api_key", label: "API Key" },
                { key: "secret_key", label: "Secret Key" },
                { key: "callback_url", label: "Callback URL" },
              ].map((field) => (
                <div key={field.key}>
                  <label className="text-[10px] font-orbitron uppercase tracking-wider text-white/40 mb-1 block">
                    {field.label}
                  </label>
                  <input
                    type="text"
                    value={(form as Record<string, string>)[field.key] || ""}
                    onChange={(e) =>
                      setForm((prev) => ({
                        ...prev,
                        [field.key]: e.target.value,
                      }))
                    }
                    className="w-full px-3 py-2.5 rounded-xl bg-[#1c0a30] border border-[rgba(159,211,232,0.15)] text-sm text-white placeholder:text-white/20 focus:border-[#9FD3E8] focus:outline-none"
                  />
                </div>
              ))}
            </div>
            <div className="flex gap-3 mt-6">
              <button
                onClick={() => {
                  setShowForm(false);
                  setEditing(null);
                }}
                className="flex-1 py-2.5 rounded-xl text-xs font-orbitron uppercase tracking-wider text-white/60 border border-white/10 hover:bg-white/5 transition-all"
              >
                BATAL
              </button>
              <button
                onClick={handleSave}
                className="flex-1 py-2.5 rounded-xl text-xs font-orbitron uppercase tracking-wider text-[#0A1020] transition-all hover:scale-[1.02]"
                style={{
                  background: "linear-gradient(135deg, #9FD3E8, #BEEAF5)",
                }}
              >
                SIMPAN
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
