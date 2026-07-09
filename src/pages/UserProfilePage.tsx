import { useState, useEffect } from "react";
import { User, Mail, Calendar, ShoppingBag, Clock, CheckCircle, XCircle, Edit2, Save, X, LogOut, Loader2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../lib/supabase";
import { useAuth } from "../contexts/AuthContext";
import TopNavigation from "../components/TopNavigation";
import Footer from "../components/Footer";

export default function UserProfilePage() {
  const { user, isAuthenticated, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [profile, setProfile] = useState<any>(null);
  const [transactions, setTransactions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [fullName, setFullName] = useState("");
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState<"overview" | "history">("overview");

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      navigate("/login");
    }
  }, [authLoading, isAuthenticated, navigate]);

  useEffect(() => {
    if (!user) return;
    loadData();
  }, [user]);

  const loadData = async () => {
    setLoading(true);
    const [{ data: prof }, { data: txns }] = await Promise.all([
      supabase.from("profiles").select("*").eq("id", user.id).single(),
      supabase.from("transactions").select("*, products(name, games(name))").eq("user_id", user.id).order("created_at", { ascending: false }).limit(20),
    ]);
    setProfile(prof);
    setFullName(prof?.full_name || "");
    setTransactions(txns || []);
    setLoading(false);
  };

  const handleSaveProfile = async () => {
    setSaving(true);
    if (profile) {
      await supabase.from("profiles").update({ full_name: fullName }).eq("id", user.id);
    } else {
      await supabase.from("profiles").insert([{ id: user.id, full_name: fullName, email: user.email }]);
    }
    setProfile({ ...profile, full_name: fullName });
    setEditing(false);
    setSaving(false);
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/");
  };

  const totalSpent = transactions.filter(t => t.status === "Success").reduce((s, t) => s + (t.amount || 0), 0);
  const successCount = transactions.filter(t => t.status === "Success").length;

  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-[#1c0a30] flex items-center justify-center">
        <Loader2 className="animate-spin w-8 h-8 text-[#00E5FF]" />
      </div>
    );
  }

  const statusColor: Record<string, string> = {
    Success: "text-emerald-400 bg-emerald-500/20",
    Pending: "text-amber-400 bg-amber-500/20",
    Failed: "text-red-400 bg-red-500/20",
  };
  const statusIcon: Record<string, any> = {
    Success: CheckCircle,
    Pending: Clock,
    Failed: XCircle,
  };

  return (
    <div className="min-h-screen bg-[#1c0a30] text-white font-rajdhani">
      <TopNavigation />
      <div className="pt-[80px]" />

      {/* Hero Profile Header */}
      <div className="relative overflow-hidden bg-gradient-to-b from-[#2d0a4a] to-[#1c0a30] py-10">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 left-1/4 w-80 h-80 bg-[#FF007F]/10 rounded-full blur-3xl" />
          <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-[#00E5FF]/10 rounded-full blur-3xl" />
        </div>
        <div className="relative max-w-4xl mx-auto px-4">
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
            {/* Avatar */}
            <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-[#FF007F] to-[#7367F0] flex items-center justify-center text-3xl font-orbitron font-black text-white shadow-xl shadow-[#FF007F]/30">
              {(profile?.full_name || user?.email || "?").charAt(0).toUpperCase()}
            </div>

            <div className="text-center sm:text-left flex-1">
              <div className="flex items-center justify-center sm:justify-start gap-2 mb-1">
                {editing ? (
                  <input
                    value={fullName}
                    onChange={e => setFullName(e.target.value)}
                    className="text-xl font-orbitron font-bold bg-transparent border-b border-[#00E5FF] text-white outline-none"
                    placeholder="Nama Lengkap"
                  />
                ) : (
                  <h1 className="text-2xl font-orbitron font-bold text-white">
                    {profile?.full_name || "Pengguna SZStore"}
                  </h1>
                )}
                {!editing ? (
                  <button onClick={() => setEditing(true)} className="text-white/30 hover:text-[#00E5FF] transition-colors">
                    <Edit2 className="w-4 h-4" />
                  </button>
                ) : (
                  <div className="flex items-center gap-2">
                    <button onClick={handleSaveProfile} disabled={saving} className="flex items-center gap-1 px-3 py-1 rounded-lg bg-[#00E5FF] text-[#0a0a1a] text-xs font-bold">
                      <Save className="w-3 h-3" /> {saving ? "..." : "Simpan"}
                    </button>
                    <button onClick={() => { setEditing(false); setFullName(profile?.full_name || ""); }} className="text-white/40 hover:text-white">
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                )}
              </div>
              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-4 text-sm text-white/50">
                <span className="flex items-center gap-1.5"><Mail className="w-3.5 h-3.5" />{user?.email}</span>
                <span className="flex items-center gap-1.5"><Calendar className="w-3.5 h-3.5" />Bergabung {new Date(user?.created_at || Date.now()).toLocaleDateString("id-ID", { month: "long", year: "numeric" })}</span>
              </div>
            </div>

            <button onClick={handleLogout} className="flex items-center gap-2 px-4 py-2 rounded-xl border border-[#FF007F]/30 text-[#FF007F] hover:bg-[#FF007F] hover:text-white transition-all text-sm">
              <LogOut className="w-4 h-4" /> Keluar
            </button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Stats Row */}
        <div className="grid grid-cols-3 gap-3 mb-6">
          {[
            { label: "Total Transaksi", value: transactions.length.toString(), icon: ShoppingBag, color: "#00E5FF" },
            { label: "Transaksi Sukses", value: successCount.toString(), icon: CheckCircle, color: "#00FF87" },
            { label: "Total Belanja", value: `Rp ${(totalSpent / 1000).toFixed(0)}K`, icon: ShoppingBag, color: "#FFD740" },
          ].map((s) => {
            const Icon = s.icon;
            return (
              <div key={s.label} className="bg-[#120520] border border-white/10 rounded-2xl p-4 text-center">
                <Icon className="w-6 h-6 mx-auto mb-2" style={{ color: s.color }} />
                <p className="text-xl font-orbitron font-bold text-white">{s.value}</p>
                <p className="text-[10px] text-white/40 mt-1">{s.label}</p>
              </div>
            );
          })}
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-5">
          <button
            onClick={() => setActiveTab("overview")}
            className={`px-4 py-2 rounded-xl text-xs font-orbitron uppercase transition-all ${activeTab === "overview" ? "bg-[#00E5FF] text-[#0a0a1a]" : "text-white/50 hover:text-white border border-white/10"}`}
          >
            Overview
          </button>
          <button
            onClick={() => setActiveTab("history")}
            className={`px-4 py-2 rounded-xl text-xs font-orbitron uppercase transition-all ${activeTab === "history" ? "bg-[#00E5FF] text-[#0a0a1a]" : "text-white/50 hover:text-white border border-white/10"}`}
          >
            Riwayat Transaksi
          </button>
        </div>

        {activeTab === "overview" && (
          <div className="space-y-4">
            <div className="bg-[#120520] border border-white/10 rounded-2xl p-5">
              <p className="text-[10px] font-orbitron uppercase tracking-wider text-white/40 mb-4">Informasi Akun</p>
              <div className="space-y-3">
                <div className="flex items-center justify-between py-2 border-b border-white/5">
                  <span className="text-sm text-white/50 flex items-center gap-2"><User className="w-4 h-4" /> Nama Lengkap</span>
                  <span className="text-sm text-white font-semibold">{profile?.full_name || "Belum diisi"}</span>
                </div>
                <div className="flex items-center justify-between py-2 border-b border-white/5">
                  <span className="text-sm text-white/50 flex items-center gap-2"><Mail className="w-4 h-4" /> Email</span>
                  <span className="text-sm text-white font-semibold">{user?.email}</span>
                </div>
                <div className="flex items-center justify-between py-2">
                  <span className="text-sm text-white/50 flex items-center gap-2"><Calendar className="w-4 h-4" /> Anggota Sejak</span>
                  <span className="text-sm text-white font-semibold">{new Date(user?.created_at || Date.now()).toLocaleDateString("id-ID")}</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === "history" && (
          <div className="space-y-3">
            {transactions.length === 0 ? (
              <div className="text-center py-16 bg-[#120520] border border-white/10 rounded-2xl">
                <ShoppingBag className="w-12 h-12 text-white/10 mx-auto mb-3" />
                <p className="text-white/30 text-sm">Belum ada riwayat transaksi.</p>
              </div>
            ) : (
              transactions.map((t) => {
                const StatusIcon = statusIcon[t.status] || Clock;
                return (
                  <div key={t.id} className="bg-[#120520] border border-white/10 rounded-xl p-4 flex items-center gap-4">
                    <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${statusColor[t.status] || "bg-white/10 text-white/40"}`}>
                      <StatusIcon className="w-4 h-4" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-bold text-white text-sm truncate">{t.products?.name || "Produk Tidak Diketahui"}</p>
                      <p className="text-[11px] text-white/40">{t.products?.games?.name} · {t.invoice}</p>
                    </div>
                    <div className="text-right shrink-0">
                      <p className="font-orbitron font-bold text-[#FFD740] text-sm">Rp {t.amount?.toLocaleString("id-ID")}</p>
                      <p className="text-[10px] text-white/30">{new Date(t.created_at).toLocaleDateString("id-ID")}</p>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
}
