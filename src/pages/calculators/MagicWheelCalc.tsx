import { useState } from "react";
import { Gem, RefreshCw, Info } from "lucide-react";
import TopNavigation from "../../components/TopNavigation";
import Footer from "../../components/Footer";

// Magic Wheel spins: each spin costs diamonds, and at spin 50 you guarantee the skin
const SPIN_COSTS = Array.from({ length: 50 }, (_, i) => {
  // Cost increases with each spin
  if (i < 10) return 250;
  if (i < 20) return 275;
  if (i < 30) return 300;
  if (i < 40) return 325;
  return 350;
});

export default function MagicWheelCalc() {
  const [currentSpin, setCurrentSpin] = useState("");
  const [result, setResult] = useState<{ diamonds: number; spins: number } | null>(null);
  const [error, setError] = useState("");

  const calculate = () => {
    setError("");
    const spin = parseInt(currentSpin);
    if (!spin || spin < 0 || spin >= 50) {
      setError("Masukkan jumlah spin saat ini antara 0-49.");
      setResult(null);
      return;
    }
    const remaining = SPIN_COSTS.slice(spin);
    const totalDiamonds = remaining.reduce((sum, c) => sum + c, 0);
    setResult({ diamonds: totalDiamonds, spins: remaining.length });
  };

  const reset = () => { setCurrentSpin(""); setResult(null); setError(""); };

  const totalCost = SPIN_COSTS.reduce((s, c) => s + c, 0);

  return (
    <div className="min-h-screen bg-[#1c0a30] text-white font-rajdhani">
      <TopNavigation />
      <div className="pt-[80px]" />

      <div className="relative overflow-hidden bg-gradient-to-b from-[#2d0a4a] to-[#1c0a30] py-14">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 right-1/4 w-80 h-80 bg-[#FF007F]/10 rounded-full blur-3xl" />
        </div>
        <div className="relative max-w-3xl mx-auto px-4 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-[#FF007F]/30 bg-[#FF007F]/10 mb-4">
            <Gem className="w-4 h-4 text-[#FF007F]" />
            <span className="text-[#FF007F] text-xs font-orbitron uppercase tracking-widest">Kalkulator</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-orbitron font-black text-white mb-3">
            Magic Wheel <span className="text-[#FF007F]">Calculator</span>
          </h1>
          <p className="text-white/50 max-w-md mx-auto">
            Ketahui total diamond maksimal yang kamu butuhkan untuk mendapatkan skin Legends di Magic Wheel.
          </p>
        </div>
      </div>

      <div className="max-w-lg mx-auto px-4 py-10">
        {/* Info Card */}
        <div className="flex items-start gap-3 p-4 rounded-xl bg-[#FF007F]/10 border border-[#FF007F]/20 mb-6">
          <Info className="w-5 h-5 text-[#FF007F] shrink-0 mt-0.5" />
          <p className="text-sm text-white/70">
            Magic Wheel MLBB menjamin skin Legends pada spin ke-<strong className="text-white">50</strong>. Total maksimum biaya adalah <strong className="text-[#FF007F]">~{totalCost.toLocaleString("id-ID")} Diamond</strong>.
          </p>
        </div>

        <div className="bg-[#120520] border border-white/10 rounded-2xl p-6 space-y-5">
          <div>
            <label className="text-[10px] font-orbitron uppercase tracking-wider text-white/40 mb-1.5 block">
              Sudah Berapa Kali Spin? (0 = belum sama sekali)
            </label>
            <input
              type="number"
              value={currentSpin}
              onChange={e => setCurrentSpin(e.target.value)}
              placeholder="Contoh: 20"
              min="0" max="49"
              className="w-full px-4 py-3 rounded-xl bg-[#1c0a30] border border-white/10 text-white font-rajdhani text-sm focus:outline-none focus:border-[#FF007F]/50 transition-colors"
            />
          </div>

          {error && <p className="text-red-400 text-sm text-center">{error}</p>}

          <div className="flex gap-3">
            <button onClick={reset} className="flex items-center gap-2 px-4 py-3 rounded-xl border border-white/10 text-white/50 hover:text-white hover:border-white/30 transition-all text-sm">
              <RefreshCw className="w-4 h-4" /> Reset
            </button>
            <button onClick={calculate}
              className="flex-1 py-3 rounded-xl bg-gradient-to-r from-[#FF007F] to-[#cc0066] text-white font-orbitron font-bold text-sm hover:scale-[1.02] transition-all">
              HITUNG
            </button>
          </div>

          {result !== null && (
            <div className="mt-4 p-5 rounded-2xl bg-gradient-to-br from-[#FF007F]/10 to-transparent border border-[#FF007F]/30 text-center space-y-3">
              <p className="text-white/50 text-sm">Kamu membutuhkan</p>
              <div>
                <p className="text-5xl font-orbitron font-black text-[#FF007F]">{result.diamonds.toLocaleString("id-ID")}</p>
                <p className="text-white/50 text-sm mt-1">Diamond</p>
              </div>
              <div className="flex justify-center gap-6 pt-2 border-t border-white/10">
                <div>
                  <p className="font-orbitron font-bold text-white text-lg">{result.spins}</p>
                  <p className="text-xs text-white/30">Sisa Spin</p>
                </div>
                <div>
                  <p className="font-orbitron font-bold text-[#FFD740] text-lg">{50 - result.spins}</p>
                  <p className="text-xs text-white/30">Sudah Dipakai</p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Spin Cost Reference */}
        <div className="mt-6 bg-[#120520] border border-white/10 rounded-2xl p-4">
          <p className="text-[10px] font-orbitron uppercase tracking-wider text-white/30 mb-3">Referensi Biaya Per Spin</p>
          <div className="grid grid-cols-2 gap-2 text-xs">
            {[
              { label: "Spin 1-10", cost: "250 Diamond/spin" },
              { label: "Spin 11-20", cost: "275 Diamond/spin" },
              { label: "Spin 21-30", cost: "300 Diamond/spin" },
              { label: "Spin 31-40", cost: "325 Diamond/spin" },
              { label: "Spin 41-50", cost: "350 Diamond/spin" },
            ].map((r, i) => (
              <div key={i} className="flex justify-between bg-white/5 rounded-lg px-3 py-2">
                <span className="text-white/50">{r.label}</span>
                <span className="text-[#FF007F] font-bold">{r.cost}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
