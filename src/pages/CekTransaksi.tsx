import { useState } from "react";
import { Search, Loader2, Receipt, ExternalLink } from "lucide-react";
import { supabase } from "../lib/supabase";
import { Link } from "react-router-dom";
import TopNavigation from "../components/TopNavigation";
import Footer from "../components/Footer";

export default function CekTransaksi() {
  const [invoice, setInvoice] = useState("");
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!invoice) return;
    setLoading(true);
    setResult(null);

    const { data, error } = await supabase
      .from("transactions")
      .select("*, products(name), games(name)")
      .eq("invoice", invoice.trim())
      .single();

    if (error) {
      alert("Nomor Invoice tidak ditemukan!");
    } else {
      setResult(data);
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-[#1c0a30] text-white font-rajdhani overflow-x-hidden">
      <TopNavigation />
      <div className="pt-[100px]"></div>

      <div className="container mx-auto px-4 max-w-xl py-6 space-y-6">
        <div className="bg-[#120224] border border-white/5 rounded-2xl p-6 text-center shadow-xl">
          <h1 className="text-lg font-orbitron font-bold text-white mb-2 tracking-widest">
            LACAK PESANAN
          </h1>
          <p className="text-xs text-white/40 mb-6">
            Masukkan nomor invoice Anda untuk melihat status top up otomatis.
          </p>

          <form onSubmit={handleSearch} className="flex gap-2">
            <input
              type="text"
              value={invoice}
              onChange={(e) => setInvoice(e.target.value)}
              placeholder="Contoh: SZ-12345678"
              className="flex-1 bg-[#1c0a30] border border-white/10 p-3 rounded-xl text-sm outline-none focus:border-[#FF007F] text-white font-mono"
            />
            <button
              type="submit"
              className="p-3 bg-[#FF007F] hover:bg-[#D4006A] rounded-xl font-bold text-xs flex items-center gap-2 cursor-pointer"
            >
              <Search className="w-4 h-4" />
            </button>
          </form>
        </div>

        {loading && (
          <div className="text-center">
            <Loader2 className="animate-spin text-[#FF007F] mx-auto w-8 h-8" />
          </div>
        )}

        {result && (
          <div className="bg-[#120224] border border-white/5 rounded-2xl p-6 shadow-xl space-y-4 animate-in fade-in duration-300">
            <div className="flex items-center gap-2 border-b border-white/5 pb-3">
              <Receipt className="w-5 h-5 text-[#00D4FF]" />
              <h3 className="font-bold font-orbitron text-sm">
                DETAIL TRANSAKSI
              </h3>
            </div>
            <div className="space-y-2.5 text-xs">
              <div className="flex justify-between">
                <span>Game</span>
                <span className="font-bold text-[#00D4FF] uppercase">
                  {result.games?.name}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Item</span>
                <span className="font-bold text-white">
                  {result.products?.name}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Target Akun</span>
                <span className="bg-white/5 px-2 py-0.5 rounded font-mono">
                  {result.target_data}{" "}
                  {result.target_additional_data !== "-"
                    ? `(${result.target_additional_data})`
                    : ""}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Total Tagihan</span>
                <span className="text-[#FFD740] font-bold">
                  Rp {result.amount.toLocaleString("id-ID")}
                </span>
              </div>
              <div className="flex justify-between border-t border-white/5 pt-3 items-center">
                <span>Status Top Up</span>
                <span
                  className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${result.status === "Success" ? "bg-emerald-500/20 text-emerald-400" : result.status === "Pending" ? "bg-amber-500/20 text-amber-400" : "bg-red-500/20 text-red-400"}`}
                >
                  {result.status}
                </span>
              </div>
            </div>
            <Link
              to={`/invoice/${result.invoice}`}
              className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-all text-sm text-white/70 hover:text-white"
            >
              <ExternalLink className="w-4 h-4" /> Lihat Detail Invoice Lengkap
            </Link>
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
}
