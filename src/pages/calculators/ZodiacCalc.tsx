import { useState } from "react";
import { Stars, RefreshCw, Info } from "lucide-react";
import TopNavigation from "../../components/TopNavigation";
import Footer from "../../components/Footer";

// Zodiac in MLBB: 12 zodiac skins, you get 1 every 12 spins (pity)
// Each spin costs 150 diamonds
const COST_PER_SPIN = 150;
const PITY_AT = 12;

export default function ZodiacCalc() {
  const [currentSpin, setCurrentSpin] = useState("");
  const [result, setResult] = useState<{ diamonds: number; spins: number } | null>(null);
  const [error, setError] = useState("");

  const calculate = () => {
    setError("");
    const spin = parseInt(currentSpin);
    if (isNaN(spin) || spin < 0 || spin >= PITY_AT) {
      setError(`Masukkan jumlah spin saat ini antara 0-${PITY_AT - 1}.`);
      setResult(null);
      return;
    }
    const spinsLeft = PITY_AT - spin;
    const diamonds = spinsLeft * COST_PER_SPIN;
    setResult({ diamonds, spins: spinsLeft });
  };

  const reset = () => { setCurrentSpin(""); setResult(null); setError(""); };

  return (
    <div className="min-h-screen bg-[#1c0a30] text-white font-rajdhani">
      <TopNavigation />
      <div className="pt-[80px]" />

      <div className="relative overflow-hidden bg-gradient-to-b from-[#2d0a4a] to-[#1c0a30] py-14">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 left-1/3 w-80 h-80 bg-[#7367F0]/10 rounded-full blur-3xl" />
        </div>
        <div className="relative max-w-3xl mx-auto px-4 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-[#7367F0]/30 bg-[#7367F0]/10 mb-4">
            <Stars className="w-4 h-4 text-[#7367F0]" />
            <span className="text-[#7367F0] text-xs font-orbitron uppercase tracking-widest">Kalkulator</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-orbitron font-black text-white mb-3">
            Zodiac <span className="text-[#7367F0]">Calculator</span>
          </h1>
          <p className="text-white/50 max-w-md mx-auto">
            Hitung total diamond yang dibutuhkan untuk mendapatkan skin Zodiac MLBB yang kamu inginkan.
          </p>
        </div>
      </div>

      <div className="max-w-lg mx-auto px-4 py-10">
        {/* Info Card */}
        <div className="flex items-start gap-3 p-4 rounded-xl bg-[#7367F0]/10 border border-[#7367F0]/20 mb-6">
          <Info className="w-5 h-5 text-[#7367F0] shrink-0 mt-0.5" />
          <p className="text-sm text-white/70">
            Zodiac di MLBB menjamin 1 skin tiap <strong className="text-white">{PITY_AT} spin</strong>. Setiap spin membutuhkan <strong className="text-[#7367F0]">{COST_PER_SPIN} Diamond</strong>. Biaya maksimum per skin adalah <strong className="text-[#7367F0]">{(PITY_AT * COST_PER_SPIN).toLocaleString("id-ID")} Diamond</strong>.
          </p>
        </div>

        <div className="bg-[#120520] border border-white/10 rounded-2xl p-6 space-y-5">
          <div>
            <label className="text-[10px] font-orbitron uppercase tracking-wider text-white/40 mb-1.5 block">
              Sudah berapa kali spin di siklus ini? (0-{PITY_AT - 1})
            </label>
            <input
              type="number"
              value={currentSpin}
              onChange={e => setCurrentSpin(e.target.value)}
              placeholder={`Contoh: 5`}
              min="0" max={PITY_AT - 1}
              className="w-full px-4 py-3 rounded-xl bg-[#1c0a30] border border-white/10 text-white font-rajdhani text-sm focus:outline-none focus:border-[#7367F0]/50 transition-colors"
            />
            {currentSpin !== "" && parseInt(currentSpin) >= 0 && parseInt(currentSpin) < PITY_AT && (
              <div className="mt-3">
                <div className="flex justify-between text-xs text-white/30 mb-1">
                  <span>Progress Pity</span>
                  <span>{currentSpin}/{PITY_AT}</span>
                </div>
                <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-[#7367F0] to-[#FF007F] rounded-full transition-all"
                    style={{ width: `${(parseInt(currentSpin) / PITY_AT) * 100}%` }}
                  />
                </div>
              </div>
            )}
          </div>

          {error && <p className="text-red-400 text-sm text-center">{error}</p>}

          <div className="flex gap-3">
            <button onClick={reset} className="flex items-center gap-2 px-4 py-3 rounded-xl border border-white/10 text-white/50 hover:text-white hover:border-white/30 transition-all text-sm">
              <RefreshCw className="w-4 h-4" /> Reset
            </button>
            <button onClick={calculate}
              className="flex-1 py-3 rounded-xl bg-gradient-to-r from-[#7367F0] to-[#5E50EE] text-white font-orbitron font-bold text-sm hover:scale-[1.02] transition-all">
              HITUNG
            </button>
          </div>

          {result !== null && (
            <div className="mt-4 p-5 rounded-2xl bg-gradient-to-br from-[#7367F0]/10 to-transparent border border-[#7367F0]/30 text-center space-y-3">
              <p className="text-white/50 text-sm">Kamu membutuhkan</p>
              <div>
                <p className="text-5xl font-orbitron font-black text-[#7367F0]">{result.diamonds.toLocaleString("id-ID")}</p>
                <p className="text-white/50 text-sm mt-1">Diamond</p>
              </div>
              <div className="flex justify-center gap-6 pt-2 border-t border-white/10">
                <div>
                  <p className="font-orbitron font-bold text-white text-lg">{result.spins}</p>
                  <p className="text-xs text-white/30">Sisa Spin</p>
                </div>
                <div>
                  <p className="font-orbitron font-bold text-[#7367F0] text-lg">{PITY_AT - result.spins}</p>
                  <p className="text-xs text-white/30">Sudah Dipakai</p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Zodiac List */}
        <div className="mt-6 bg-[#120520] border border-white/10 rounded-2xl p-4">
          <p className="text-[10px] font-orbitron uppercase tracking-wider text-white/30 mb-3">12 Zodiac MLBB</p>
          <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
            {["Aries", "Taurus", "Gemini", "Cancer", "Leo", "Virgo", "Libra", "Scorpio", "Sagittarius", "Capricorn", "Aquarius", "Pisces"].map((z, i) => (
              <div key={i} className="text-center px-2 py-2.5 bg-[#7367F0]/10 rounded-xl border border-[#7367F0]/20">
                <p className="text-xs text-white/70 font-semibold">{z}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
