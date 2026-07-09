import { useState } from "react";
import { TrendingUp, RefreshCw } from "lucide-react";
import TopNavigation from "../../components/TopNavigation";
import Footer from "../../components/Footer";

export default function WinRateCalculator() {
  const [currentWins, setCurrentWins] = useState("");
  const [currentGames, setCurrentGames] = useState("");
  const [targetRate, setTargetRate] = useState("");
  const [result, setResult] = useState<number | null>(null);
  const [error, setError] = useState("");

  const calculate = () => {
    setError("");
    const w = parseFloat(currentWins);
    const g = parseFloat(currentGames);
    const t = parseFloat(targetRate) / 100;

    if (!w || !g || !t || g <= 0 || t <= 0 || t >= 1) {
      setError("Pastikan semua nilai valid dan target win rate antara 1-99%.");
      setResult(null);
      return;
    }
    if (w > g) {
      setError("Jumlah menang tidak boleh lebih dari total game.");
      setResult(null);
      return;
    }
    const currentRate = w / g;
    if (currentRate >= t) {
      setError("Win rate kamu sudah melebihi target!");
      setResult(null);
      return;
    }
    // (w + x) / (g + x) = t  => x = (t*g - w) / (1 - t)
    const x = Math.ceil((t * g - w) / (1 - t));
    setResult(x);
  };

  const reset = () => {
    setCurrentWins(""); setCurrentGames(""); setTargetRate(""); setResult(null); setError("");
  };

  const currentRate = currentWins && currentGames && parseFloat(currentGames) > 0
    ? ((parseFloat(currentWins) / parseFloat(currentGames)) * 100).toFixed(1)
    : null;

  return (
    <div className="min-h-screen bg-[#1c0a30] text-white font-rajdhani">
      <TopNavigation />
      <div className="pt-[80px]" />

      <div className="relative overflow-hidden bg-gradient-to-b from-[#2d0a4a] to-[#1c0a30] py-14">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 left-1/4 w-80 h-80 bg-[#00E5FF]/10 rounded-full blur-3xl" />
        </div>
        <div className="relative max-w-3xl mx-auto px-4 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-[#00E5FF]/30 bg-[#00E5FF]/10 mb-4">
            <TrendingUp className="w-4 h-4 text-[#00E5FF]" />
            <span className="text-[#00E5FF] text-xs font-orbitron uppercase tracking-widest">Kalkulator</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-orbitron font-black text-white mb-3">
            Win Rate <span className="text-[#00E5FF]">Calculator</span>
          </h1>
          <p className="text-white/50 max-w-md mx-auto">
            Hitung jumlah match yang harus kamu menangkan untuk mencapai target win rate yang diinginkan.
          </p>
        </div>
      </div>

      <div className="max-w-lg mx-auto px-4 py-10">
        <div className="bg-[#120520] border border-white/10 rounded-2xl p-6 space-y-5">
          <div>
            <label className="text-[10px] font-orbitron uppercase tracking-wider text-white/40 mb-1.5 block">Total Pertandingan Saat Ini</label>
            <input type="number" value={currentGames} onChange={e => setCurrentGames(e.target.value)}
              placeholder="Contoh: 500"
              className="w-full px-4 py-3 rounded-xl bg-[#1c0a30] border border-white/10 text-white font-rajdhani text-sm focus:outline-none focus:border-[#00E5FF]/50 transition-colors" />
          </div>
          <div>
            <label className="text-[10px] font-orbitron uppercase tracking-wider text-white/40 mb-1.5 block">Total Kemenangan Saat Ini</label>
            <input type="number" value={currentWins} onChange={e => setCurrentWins(e.target.value)}
              placeholder="Contoh: 260"
              className="w-full px-4 py-3 rounded-xl bg-[#1c0a30] border border-white/10 text-white font-rajdhani text-sm focus:outline-none focus:border-[#00E5FF]/50 transition-colors" />
          </div>
          {currentRate && (
            <div className="px-4 py-2.5 rounded-xl bg-[#00E5FF]/10 border border-[#00E5FF]/20">
              <p className="text-xs text-white/50">Win Rate Kamu Saat Ini: <span className="text-[#00E5FF] font-bold">{currentRate}%</span></p>
            </div>
          )}
          <div>
            <label className="text-[10px] font-orbitron uppercase tracking-wider text-white/40 mb-1.5 block">Target Win Rate (%)</label>
            <input type="number" value={targetRate} onChange={e => setTargetRate(e.target.value)}
              placeholder="Contoh: 60"
              className="w-full px-4 py-3 rounded-xl bg-[#1c0a30] border border-white/10 text-white font-rajdhani text-sm focus:outline-none focus:border-[#00E5FF]/50 transition-colors" />
          </div>

          {error && <p className="text-red-400 text-sm text-center">{error}</p>}

          <div className="flex gap-3">
            <button onClick={reset} className="flex items-center gap-2 px-4 py-3 rounded-xl border border-white/10 text-white/50 hover:text-white hover:border-white/30 transition-all text-sm">
              <RefreshCw className="w-4 h-4" /> Reset
            </button>
            <button onClick={calculate}
              className="flex-1 py-3 rounded-xl bg-gradient-to-r from-[#00E5FF] to-[#00b3cc] text-[#0a0a1a] font-orbitron font-bold text-sm hover:scale-[1.02] transition-all">
              HITUNG
            </button>
          </div>

          {result !== null && (
            <div className="mt-4 p-5 rounded-2xl bg-gradient-to-br from-[#00E5FF]/10 to-transparent border border-[#00E5FF]/30 text-center">
              <p className="text-white/50 text-sm mb-2">Kamu perlu menang sebanyak</p>
              <p className="text-5xl font-orbitron font-black text-[#00E5FF]">{result}</p>
              <p className="text-white/50 text-sm mt-2">pertandingan berturut-turut untuk mencapai <span className="text-white">{targetRate}%</span> win rate</p>
            </div>
          )}
        </div>
      </div>

      <Footer />
    </div>
  );
}
