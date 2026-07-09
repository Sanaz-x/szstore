// src/pages/InvoicePage.tsx — UPGRADED
// ============================================================
// Halaman Invoice: 2-kolom layout, countdown, progress steps, 
// refresh status, copy invoice — SZSTORE theme
// ============================================================
import { useState, useEffect, useCallback } from "react";
import { useParams, Link } from "react-router-dom";
import {
  CheckCircle,
  Clock,
  XCircle,
  ArrowLeft,
  RefreshCw,
  Loader2,
  Copy,
  Check,
  Phone,
  ShoppingBag,
  Zap,
  AlertCircle,
} from "lucide-react";
import { supabase } from "../lib/supabase";
import TopNavigation from "../components/TopNavigation";
import Footer from "../components/Footer";

// ── Progress Steps ──
const PROGRESS_STEPS = [
  {
    key: "created",
    label: "Pesanan Dibuat",
    desc: "Pesanan berhasil dibuat.",
    icon: CheckCircle,
  },
  {
    key: "payment",
    label: "Pembayaran",
    desc: "Menunggu pembayaran pelanggan.",
    icon: Clock,
  },
  {
    key: "processing",
    label: "Sedang Diproses",
    desc: "Transaksi sedang diproses provider.",
    icon: Zap,
  },
  {
    key: "done",
    label: "Transaksi Selesai",
    desc: "Transaksi berhasil diselesaikan.",
    icon: CheckCircle,
  },
];

function getProgressIndex(status: string, isPaid: boolean): number {
  if (status === "Success") return 3;
  if (status === "Processing") return 2;
  if (isPaid) return 1;
  return 0; // Pending
}

// ── Countdown Timer ──
function CountdownTimer({ expiredAt }: { expiredAt: string | null }) {
  const [timeLeft, setTimeLeft] = useState<string>("");
  const [expired, setExpired] = useState(false);

  useEffect(() => {
    if (!expiredAt) return;
    const interval = setInterval(() => {
      const diff = new Date(expiredAt).getTime() - Date.now();
      if (diff <= 0) {
        setExpired(true);
        setTimeLeft("00:00:00");
        clearInterval(interval);
        return;
      }
      const h = Math.floor(diff / 3600000);
      const m = Math.floor((diff % 3600000) / 60000);
      const s = Math.floor((diff % 60000) / 1000);
      setTimeLeft(
        `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`
      );
    }, 1000);
    return () => clearInterval(interval);
  }, [expiredAt]);

  if (!expiredAt) return null;

  return (
    <div className="bg-[#1c0a30] border border-white/10 rounded-xl p-4 text-center">
      <p className="text-[10px] font-orbitron uppercase text-white/30 mb-2">
        Pesanan akan kedaluwarsa pada
      </p>
      <div
        className={`text-2xl font-mono font-black rounded-xl py-2 px-4 inline-block ${
          expired
            ? "bg-red-500/20 text-red-400 border border-red-500/30"
            : "bg-gradient-to-r from-[#FF007F]/20 to-purple-600/20 text-[#FF007F] border border-[#FF007F]/30 shadow-[0_0_15px_rgba(255,0,127,0.2)]"
        }`}
      >
        {timeLeft || "—"}
      </div>
      <p className="text-[10px] text-white/30 mt-2">
        Hitung mundur berjalan otomatis selama invoice masih aktif.
      </p>
    </div>
  );
}

export default function InvoicePage() {
  const { invoiceCode } = useParams<{ invoiceCode: string }>();
  const [transaction, setTransaction] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [copied, setCopied] = useState(false);

  const fetchTransaction = useCallback(async () => {
    if (!invoiceCode) return;
    setLoading(true);
    const { data } = await supabase
      .from("transactions")
      .select(
        "*, products(name, sell_price, games(name, thumbnail_url, slug))"
      )
      .eq("invoice", invoiceCode)
      .single();
    setTransaction(data);
    setLoading(false);
  }, [invoiceCode]);

  useEffect(() => {
    fetchTransaction();
  }, [fetchTransaction]);

  // Auto-refresh every 30s if status is Pending
  useEffect(() => {
    if (!transaction || transaction.status !== "Pending") return;
    const interval = setInterval(async () => {
      const { data } = await supabase
        .from("transactions")
        .select("status, is_paid")
        .eq("invoice", invoiceCode)
        .single();
      if (data && data.status !== "Pending") {
        fetchTransaction();
      }
    }, 30000);
    return () => clearInterval(interval);
  }, [transaction, invoiceCode, fetchTransaction]);

  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchTransaction();
    setRefreshing(false);
  };

  const copyInvoice = () => {
    navigator.clipboard.writeText(invoiceCode || "");
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const StatusConfig: Record<string, any> = {
    Success: {
      label: "Transaksi Berhasil",
      color: "text-emerald-400",
      bg: "bg-emerald-500/15 border-emerald-500/30",
      badgeBg: "bg-emerald-500/20 text-emerald-300",
      glow: "rgba(52,211,153,0.15)",
      icon: CheckCircle,
    },
    Pending: {
      label: "Menunggu Pembayaran",
      color: "text-amber-400",
      bg: "bg-amber-500/15 border-amber-500/30",
      badgeBg: "bg-amber-500/20 text-amber-300",
      glow: "rgba(251,191,36,0.15)",
      icon: Clock,
    },
    Processing: {
      label: "Sedang Diproses",
      color: "text-blue-400",
      bg: "bg-blue-500/15 border-blue-500/30",
      badgeBg: "bg-blue-500/20 text-blue-300",
      glow: "rgba(59,130,246,0.15)",
      icon: Zap,
    },
    Failed: {
      label: "Transaksi Gagal",
      color: "text-red-400",
      bg: "bg-red-500/15 border-red-500/30",
      badgeBg: "bg-red-500/20 text-red-300",
      glow: "rgba(239,68,68,0.15)",
      icon: XCircle,
    },
  };

  return (
    <div className="min-h-screen bg-[#1c0a30] text-white font-rajdhani">
      <TopNavigation />
      <div className="pt-[80px]" />

      <div className="max-w-5xl mx-auto px-4 py-10">
        <Link
          to="/cek-transaksi"
          className="inline-flex items-center gap-2 text-white/50 hover:text-white transition-colors text-sm mb-6 font-orbitron"
        >
          <ArrowLeft className="w-4 h-4" /> Kembali ke Cek Transaksi
        </Link>

        {loading ? (
          <div className="flex justify-center py-20">
            <Loader2 className="animate-spin w-10 h-10 text-[#00E5FF]" />
          </div>
        ) : !transaction ? (
          <div className="text-center py-20 bg-[#120520] border border-white/10 rounded-2xl">
            <XCircle className="w-12 h-12 text-white/20 mx-auto mb-3" />
            <p className="text-white font-bold font-orbitron mb-2">
              Invoice Tidak Ditemukan
            </p>
            <p className="text-white/40 text-sm">
              Invoice{" "}
              <span className="text-white/60">{invoiceCode}</span> tidak ada
              dalam sistem kami.
            </p>
          </div>
        ) : (
          (() => {
            const status = transaction.status || "Pending";
            const cfg = StatusConfig[status] || StatusConfig["Pending"];
            const StatusIcon = cfg.icon;
            const progressIdx = getProgressIndex(status, transaction.is_paid);

            return (
              <div className="space-y-5">
                {/* ── STATUS BANNER ── */}
                <div
                  className={`flex items-center justify-between p-5 rounded-2xl border ${cfg.bg}`}
                  style={{ boxShadow: `0 0 40px ${cfg.glow}` }}
                >
                  <div className="flex items-center gap-3">
                    <StatusIcon className={`w-8 h-8 ${cfg.color} shrink-0`} />
                    <div>
                      <h1
                        className={`text-lg font-orbitron font-black ${cfg.color}`}
                      >
                        {cfg.label}
                      </h1>
                      <p className="text-white/40 text-xs">
                        {new Date(transaction.created_at).toLocaleString("id-ID", {
                          dateStyle: "full",
                          timeStyle: "short",
                        })}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={handleRefresh}
                    disabled={refreshing}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs text-white/60 border border-white/10 hover:border-white/30 hover:text-white transition-all font-orbitron"
                  >
                    <RefreshCw
                      className={`w-3.5 h-3.5 ${refreshing ? "animate-spin" : ""}`}
                    />
                    Refresh
                  </button>
                </div>

                {/* ── MAIN 2-COLUMN LAYOUT ── */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
                  {/* LEFT: Game Detail */}
                  <div className="space-y-4">
                    {/* Game Card */}
                    <div className="bg-[#120520] border border-white/10 rounded-2xl overflow-hidden">
                      {transaction.products?.games?.thumbnail_url && (
                        <div className="relative h-40 overflow-hidden">
                          <img
                            src={transaction.products.games.thumbnail_url}
                            alt="game"
                            className="w-full h-full object-cover"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-[#120520] to-transparent" />
                          <div className="absolute bottom-0 left-0 p-4">
                            <h2 className="text-lg font-orbitron font-black text-white uppercase">
                              {transaction.products.games.name}
                            </h2>
                            <p className="text-xs text-white/60">
                              {transaction.products?.name}
                            </p>
                          </div>
                        </div>
                      )}
                      <div className="p-4 space-y-2.5">
                        {[
                          transaction.nickname
                            ? { label: "Nickname", value: transaction.nickname }
                            : null,
                          {
                            label: "User ID",
                            value: transaction.target_data || "—",
                          },
                          transaction.target_additional_data &&
                          transaction.target_additional_data !== "-"
                            ? {
                                label: "Zone / Server",
                                value: transaction.target_additional_data,
                              }
                            : null,
                        ]
                          .filter(Boolean)
                          .map((row: any) => (
                            <div
                              key={row.label}
                              className="flex items-center justify-between"
                            >
                              <span className="text-xs text-white/40">
                                {row.label}
                              </span>
                              <span className="text-sm font-semibold text-white font-mono">
                                {row.value}
                              </span>
                            </div>
                          ))}
                      </div>
                    </div>

                    {/* Rincian Pembayaran */}
                    <div className="bg-[#120520] border border-white/10 rounded-2xl p-4 space-y-2">
                      <p className="text-[10px] font-orbitron uppercase text-white/30 mb-3">
                        Rincian Pembayaran
                      </p>
                      {[
                        {
                          label: "Subtotal",
                          value: `Rp ${(transaction.amount + (transaction.discount_amount || 0)).toLocaleString("id-ID")}`,
                        },
                        transaction.discount_amount > 0
                          ? {
                              label: `Diskon (${transaction.promo_code || "Promo"})`,
                              value: `- Rp ${transaction.discount_amount?.toLocaleString("id-ID")}`,
                              highlight: true,
                            }
                          : null,
                        {
                          label: "Total Harga",
                          value: `Rp ${transaction.amount?.toLocaleString("id-ID")}`,
                          bold: true,
                          yellow: true,
                        },
                      ]
                        .filter(Boolean)
                        .map((row: any) => (
                          <div
                            key={row.label}
                            className="flex items-center justify-between"
                          >
                            <span className="text-xs text-white/40">
                              {row.label}
                            </span>
                            <span
                              className={`text-sm font-semibold ${
                                row.yellow
                                  ? "text-[#FFD740] font-orbitron"
                                  : row.highlight
                                  ? "text-emerald-400"
                                  : "text-white"
                              }`}
                            >
                              {row.value}
                            </span>
                          </div>
                        ))}
                    </div>

                    {/* Kontak */}
                    {(transaction.whatsapp || transaction.email) && (
                      <div className="bg-[#120520] border border-white/10 rounded-2xl p-4">
                        <p className="text-[10px] font-orbitron uppercase text-white/30 mb-3">
                          Kontak
                        </p>
                        <div className="space-y-2">
                          {transaction.whatsapp && (
                            <div className="flex items-center gap-2 text-sm">
                              <Phone className="w-4 h-4 text-white/30" />
                              <span className="text-white">
                                {transaction.whatsapp}
                              </span>
                            </div>
                          )}
                          {transaction.email && (
                            <div className="flex items-center gap-2 text-sm">
                              <AlertCircle className="w-4 h-4 text-white/30" />
                              <span className="text-white/60">
                                {transaction.email}
                              </span>
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* RIGHT: Payment Detail */}
                  <div className="space-y-4">
                    {/* Payment Method */}
                    <div className="bg-[#120520] border border-white/10 rounded-2xl p-4">
                      <p className="text-[10px] font-orbitron uppercase text-white/30 mb-3">
                        Metode Pembayaran
                      </p>
                      <p className="text-base font-bold text-white">
                        {transaction.payment_method || "QRIS"}
                      </p>

                      <div className="mt-4 space-y-3">
                        {/* Invoice Number */}
                        <div className="flex items-center justify-between bg-[#1c0a30] rounded-xl px-3 py-2.5 border border-white/10">
                          <div>
                            <p className="text-[10px] font-orbitron uppercase text-white/30">
                              Nomor Invoice
                            </p>
                            <p className="font-mono text-sm font-bold text-[#00E5FF]">
                              {invoiceCode}
                            </p>
                          </div>
                          <button
                            onClick={copyInvoice}
                            className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-[11px] transition-all ${
                              copied
                                ? "bg-emerald-500 text-white"
                                : "bg-white/5 text-white/50 hover:text-white border border-white/10"
                            }`}
                          >
                            {copied ? (
                              <Check className="w-3.5 h-3.5" />
                            ) : (
                              <Copy className="w-3.5 h-3.5" />
                            )}
                            {copied ? "Tersalin!" : "Salin"}
                          </button>
                        </div>

                        {/* Status Badges */}
                        <div className="grid grid-cols-2 gap-2">
                          <div className="bg-[#1c0a30] rounded-xl p-3 border border-white/10">
                            <p className="text-[10px] font-orbitron uppercase text-white/30 mb-1.5">
                              Status Transaksi
                            </p>
                            <span
                              className={`px-2.5 py-1 rounded-lg text-[11px] font-bold ${cfg.badgeBg}`}
                            >
                              {status.toUpperCase()}
                            </span>
                          </div>
                          <div className="bg-[#1c0a30] rounded-xl p-3 border border-white/10">
                            <p className="text-[10px] font-orbitron uppercase text-white/30 mb-1.5">
                              Status Pembayaran
                            </p>
                            <span
                              className={`px-2.5 py-1 rounded-lg text-[11px] font-bold ${
                                transaction.is_paid
                                  ? "bg-emerald-500/20 text-emerald-300"
                                  : "bg-red-500/20 text-red-300"
                              }`}
                            >
                              {transaction.is_paid ? "PAID" : "UNPAID"}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Countdown */}
                    {status === "Pending" && (
                      <CountdownTimer expiredAt={transaction.expired_at} />
                    )}

                    {/* QR Code Placeholder */}
                    {status === "Pending" && !transaction.is_paid && (
                      <div className="bg-[#120520] border border-white/10 rounded-2xl p-4 text-center">
                        <p className="text-[10px] font-orbitron uppercase text-white/30 mb-3">
                          QR Code Pembayaran
                        </p>
                        {transaction.payment_qr_url ? (
                          <img
                            src={transaction.payment_qr_url}
                            alt="QR Code"
                            className="w-40 h-40 mx-auto rounded-xl"
                          />
                        ) : (
                          <div className="w-40 h-40 mx-auto bg-white/5 rounded-xl flex items-center justify-center border border-white/10">
                            <div className="text-center">
                              <div className="grid grid-cols-3 gap-1 mb-2">
                                {[...Array(9)].map((_, i) => (
                                  <div
                                    key={i}
                                    className="w-3 h-3 bg-white/20 rounded-sm"
                                  />
                                ))}
                              </div>
                              <p className="text-[9px] text-white/30 font-orbitron">
                                QR CODE
                              </p>
                            </div>
                          </div>
                        )}
                        <p className="text-[10px] text-white/30 mt-2">
                          Scan QR Code untuk membayar
                        </p>
                      </div>
                    )}

                    {/* Actions */}
                    <div className="grid grid-cols-1 gap-3">
                      <button
                        onClick={handleRefresh}
                        disabled={refreshing}
                        className="flex items-center justify-center gap-2 py-3 rounded-xl border border-white/10 text-white/60 hover:text-white hover:border-white/30 transition-all text-sm font-orbitron"
                      >
                        <RefreshCw
                          className={`w-4 h-4 ${refreshing ? "animate-spin" : ""}`}
                        />
                        Refresh Status
                      </button>
                      <Link
                        to="/"
                        className="flex items-center justify-center gap-2 py-3 rounded-xl bg-gradient-to-r from-[#FF007F] to-purple-600 text-white font-orbitron font-bold text-sm hover:scale-[1.02] transition-all shadow-[0_0_20px_rgba(255,0,127,0.2)]"
                      >
                        <ShoppingBag className="w-4 h-4" /> Belanja Lagi
                      </Link>
                    </div>
                  </div>
                </div>

                {/* ── PROGRESS STEPS ── */}
                <div className="bg-[#120520] border border-white/10 rounded-2xl p-5">
                  <p className="text-[10px] font-orbitron uppercase text-white/30 mb-5">
                    Progress Transaksi
                  </p>
                  <div className="relative">
                    {/* Progress line */}
                    <div className="absolute top-5 left-5 right-5 h-0.5 bg-white/10" />
                    <div
                      className="absolute top-5 left-5 h-0.5 bg-gradient-to-r from-[#FF007F] to-purple-600 transition-all duration-700"
                      style={{
                        width: `${(progressIdx / (PROGRESS_STEPS.length - 1)) * 100}%`,
                      }}
                    />
                    <div className="relative grid grid-cols-4 gap-2">
                      {PROGRESS_STEPS.map((step, i) => {
                        const Icon = step.icon;
                        const isDone = i < progressIdx;
                        const isCurrent = i === progressIdx;
                        return (
                          <div
                            key={step.key}
                            className="flex flex-col items-center text-center"
                          >
                            <div
                              className={`relative z-10 w-10 h-10 rounded-full flex items-center justify-center mb-2 border-2 transition-all duration-500 ${
                                isDone
                                  ? "bg-emerald-500 border-emerald-500 shadow-[0_0_15px_rgba(52,211,153,0.5)]"
                                  : isCurrent
                                  ? "bg-[#FF007F]/20 border-[#FF007F] shadow-[0_0_15px_rgba(255,0,127,0.4)]"
                                  : "bg-[#1c0a30] border-white/20"
                              }`}
                            >
                              <Icon
                                className={`w-4 h-4 ${
                                  isDone
                                    ? "text-white"
                                    : isCurrent
                                    ? "text-[#FF007F]"
                                    : "text-white/30"
                                }`}
                              />
                              {isCurrent && status === "Pending" && (
                                <span className="absolute -top-1 -right-1 w-3 h-3 bg-[#FF007F] rounded-full animate-ping" />
                              )}
                            </div>
                            <p
                              className={`text-[10px] font-orbitron font-bold leading-tight ${
                                isDone
                                  ? "text-emerald-400"
                                  : isCurrent
                                  ? "text-[#FF007F]"
                                  : "text-white/30"
                              }`}
                            >
                              {step.label}
                            </p>
                            <p className="text-[9px] text-white/30 mt-0.5 hidden sm:block">
                              {step.desc}
                            </p>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </div>
            );
          })()
        )}
      </div>

      <Footer />
    </div>
  );
}
