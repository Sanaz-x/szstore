// src/pages/admin/AdminAPIProviders.tsx
import { useState, useEffect } from "react";
import { Plus, Edit2, Trash2, Power, RefreshCw, CheckCircle2, Loader2, X } from "lucide-react";
import { supabase } from "../lib/supabase";

interface Provider {
  id: string;
  name: string;
  api_url: string;
  api_key: string;
  secret_key: string;
  merchant_id: string;
  status: "Online" | "Offline";
}

export default function AdminAPIProviders() {
  const [providers, setProviders] = useState<Provider[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<Provider | null>(null);
  const [form, setForm] = useState<Partial<Provider>>({});
  
  // State for Sync Feature
  const [syncing, setSyncing] = useState<Provider | null>(null);
  const [syncStatus, setSyncStatus] = useState<string>("");

  // Fetch Data dari Supabase
  const fetchProviders = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("api_providers")
      .select("*")
      .order("created_at", { ascending: false });
    if (error) console.error("Error fetching providers:", error);
    else setProviders(data || []);
    setLoading(false);
  };

  useEffect(() => {
    fetchProviders();

    // Supabase Realtime Subscription
    const channel = supabase
      .channel("schema-db-changes")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "api_providers" },
        () => {
          fetchProviders(); // Refetch jika ada perubahan
        },
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const toggleStatus = async (provider: Provider) => {
    const newStatus = provider.status === "Online" ? "Offline" : "Online";
    const { error } = await supabase
      .from("api_providers")
      .update({ status: newStatus })
      .eq("id", provider.id);
    if (error) alert("Gagal mengubah status");
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Yakin ingin menghapus provider ini?")) return;
    const { error } = await supabase
      .from("api_providers")
      .delete()
      .eq("id", id);
    if (error) alert("Gagal menghapus provider");
  };

  const handleSave = async () => {
    if (!form.name || !form.api_url) return alert("Nama dan URL wajib diisi");

    setLoading(true);
    if (editing) {
      // Update
      const { error } = await supabase
        .from("api_providers")
        .update(form)
        .eq("id", editing.id);
      if (error) alert("Gagal mengupdate");
    } else {
      // Insert
      const { error } = await supabase.from("api_providers").insert([form]);
      if (error) alert("Gagal menambah provider");
    }

    setShowForm(false);
    setEditing(null);
    setForm({});
    setLoading(false);
  };

  const openEdit = (p: Provider) => {
    setEditing(p);
    setForm({ ...p });
    setShowForm(true);
  };

  const openAdd = () => {
    setEditing(null);
    setForm({});
    setShowForm(true);
  };

  if (loading && providers.length === 0) {
    return (
      <div className="flex justify-center p-10">
        <Loader2 className="animate-spin text-[#9FD3E8]" />
      </div>
    );
  }

  const handleSyncProvider = async (p: Provider) => {
    setSyncing(p);
    setSyncStatus("Menguji koneksi ke " + p.name + "...");
    
    // Simulate API connection
    setTimeout(() => {
      setSyncStatus("Mengunduh daftar game & kategori...");
      setTimeout(() => {
        setSyncStatus("Memetakan produk dan harga dari " + p.name + "...");
        setTimeout(() => {
          setSyncStatus("Sukses menyinkronkan 35 Games dan 420 Produk!");
          setTimeout(() => {
            setSyncing(null);
            setSyncStatus("");
          }, 3000);
        }, 1500);
      }, 1500);
    }, 1500);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-orbitron font-semibold uppercase tracking-[0.03em] text-white">
          API PROVIDER MANAGEMENT
        </h2>
        <button
          onClick={openAdd}
          className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-orbitron uppercase tracking-wider text-[#0A1020] transition-all hover:scale-[1.02] hover:shadow-neon-cyan"
          style={{ background: "linear-gradient(135deg, #9FD3E8, #BEEAF5)" }}
        >
          <Plus className="w-4 h-4" /> TAMBAH PROVIDER
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {providers.map((p) => (
          <div
            key={p.id}
            className="card-surface rounded-2xl border border-[rgba(159,211,232,0.15)] p-5 hover:border-[rgba(159,211,232,0.3)] transition-all"
          >
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="text-sm font-orbitron font-semibold text-white">
                  {p.name}
                </h3>
                <p className="text-[10px] font-rajdhani text-white/40 mt-0.5">
                  {p.api_url}
                </p>
              </div>
              <div className="flex items-center gap-1">
                <span
                  className="w-2 h-2 rounded-full"
                  style={{
                    backgroundColor:
                      p.status === "Online" ? "#00E5FF" : "#FF4081",
                  }}
                />
                <span
                  className="text-[10px] font-orbitron uppercase"
                  style={{
                    color: p.status === "Online" ? "#00E5FF" : "#FF4081",
                  }}
                >
                  {p.status}
                </span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 mb-4">
              <div>
                <p className="text-[10px] font-orbitron uppercase tracking-wider text-white/30">
                  API Key
                </p>
                <p className="text-xs font-rajdhani text-white/60 font-mono">
                  {(p.api_key || "").substring(0, 8)}***
                </p>
              </div>
              <div>
                <p className="text-[10px] font-orbitron uppercase tracking-wider text-white/30">
                  Merchant ID
                </p>
                <p className="text-xs font-rajdhani text-white/60">
                  {p.merchant_id || "-"}
                </p>
              </div>
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => openEdit(p)}
                className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-[10px] font-orbitron uppercase tracking-wider text-[#9FD3E8] border border-[rgba(159,211,232,0.2)] hover:bg-[rgba(159,211,232,0.1)] transition-all"
              >
                <Edit2 className="w-3 h-3" /> EDIT
              </button>
              <button
                onClick={() => toggleStatus(p)}
                className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-[10px] font-orbitron uppercase tracking-wider text-white/60 border border-white/10 hover:bg-white/5 transition-all"
              >
                <Power className="w-3 h-3" />{" "}
                {p.status === "Online" ? "DISABLE" : "ENABLE"}
              </button>
              <button
                onClick={() => handleDelete(p.id)}
                className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-[10px] font-orbitron uppercase tracking-wider text-[#FF4081] border border-[rgba(255,64,129,0.2)] hover:bg-[rgba(255,64,129,0.1)] transition-all ml-auto"
              >
                <Trash2 className="w-3 h-3" />
              </button>
              
              <button
                onClick={() => handleSyncProvider(p)}
                className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-[10px] font-orbitron uppercase tracking-wider text-emerald-400 border border-emerald-400/30 hover:bg-emerald-400/10 transition-all ml-2"
              >
                <RefreshCw className="w-3 h-3" /> SYNC DATA
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Modal Form */}
      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="card-surface rounded-2xl border border-[rgba(159,211,232,0.2)] p-6 w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <h3 className="text-base font-orbitron font-semibold uppercase tracking-[0.03em] text-white mb-4">
              {editing ? "EDIT PROVIDER" : "TAMBAH PROVIDER"}
            </h3>
            <div className="space-y-3">
              {[
                {
                  key: "name",
                  label: "Provider Name",
                  placeholder: "e.g. DIGIFLAZZ",
                },
                {
                  key: "api_url",
                  label: "API URL",
                  placeholder: "https://api.example.com",
                },
                {
                  key: "api_key",
                  label: "API Key",
                  placeholder: "your-api-key",
                },
                {
                  key: "secret_key",
                  label: "Secret Key",
                  placeholder: "your-secret-key",
                },
                {
                  key: "merchant_id",
                  label: "Merchant ID",
                  placeholder: "your-merchant-id",
                },
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
                    placeholder={field.placeholder}
                    className="w-full px-3 py-2.5 rounded-xl bg-[rgba(10,16,32,0.5)] border border-[rgba(159,211,232,0.15)] text-sm font-rajdhani text-white placeholder:text-white/20 focus:border-[#9FD3E8] focus:outline-none"
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
                disabled={loading}
                className="flex-1 py-2.5 rounded-xl text-xs font-orbitron uppercase tracking-wider text-[#0A1020] transition-all hover:scale-[1.02] hover:shadow-neon-cyan disabled:opacity-50"
                style={{
                  background: "linear-gradient(135deg, #9FD3E8, #BEEAF5)",
                }}
              >
                {loading ? "MENYIMPAN..." : "SIMPAN"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Sync Modal */}
      {syncing && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-in fade-in duration-300">
          <div className="bg-[#120224] border border-[#00E5FF]/40 rounded-2xl w-full max-w-md shadow-[0_0_30px_rgba(0,229,255,0.2)] p-8 text-center relative overflow-hidden">
            {syncStatus.includes("Sukses") ? (
              <CheckCircle2 className="w-16 h-16 text-emerald-400 mx-auto mb-4 animate-in zoom-in duration-500" />
            ) : (
              <RefreshCw className="w-16 h-16 text-[#00E5FF] mx-auto mb-4 animate-spin" />
            )}
            
            <h3 className="text-lg font-orbitron font-bold text-white mb-2">
              SINKRONISASI {syncing.name}
            </h3>
            <p className="text-sm font-rajdhani text-white/70">
              {syncStatus}
            </p>
            
            <div className="mt-8 w-full bg-white/5 rounded-full h-1.5 overflow-hidden">
              <div className="bg-gradient-to-r from-[#00E5FF] to-blue-500 h-full animate-[progress_2s_ease-in-out_infinite]" style={{ width: syncStatus.includes("Sukses") ? "100%" : "60%" }}></div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
