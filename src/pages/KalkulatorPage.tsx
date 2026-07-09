// src/pages/KalkulatorPage.tsx
import { useState } from "react";
import TopNavigation from "../components/TopNavigation";
import Footer from "../components/Footer";
import { Calculator, Percent, ShieldAlert, Sparkles } from "lucide-react";

export default function KalkulatorPage() {
  const [totalMatch, setTotalMatch] = useState("");
  const [currentWr, setCurrentWr] = useState("");
  const [targetWr, setTargetWr] = useState("");
  const [wrResult, setWrResult] = useState<number | null>(null);

  const [magicPoints, setMagicPoints] = useState("");
  const [zodiacStar, setZodiacStar] = useState("");

  const calculateWinRate = (e: React.FormEvent) => {
    e.preventDefault();
    const tMatch = parseInt(totalMatch);
    const cWr = parseFloat(currentWr);
    const tWr = parseFloat(targetWr);

    if (!tMatch || !cWr || !tWr || tWr <= cWr || tWr >= 100) {
      alert(
        "Masukkan data yang valid! Target WR harus lebih tinggi dari WR saat ini.",
      );
      return;
    }

    const currentWin = Math.round(tMatch * (cWr / 100));
    const tWinResult = Math.ceil(
      (tWr * tMatch - 100 * currentWin) / (100 - tWr),
    );
    setWrResult(tWinResult > 0 ? tWinResult : 0);
  };

  return (
    <div className="min-h-screen bg-[#1c0a30] text-white overflow-x-hidden font-rajdhani">
      <TopNavigation />
      <div className="pt-[100px]"></div>

      <main className="container mx-auto px-4 max-w-5xl py-6">
        <section className="bg-[#120224] border border-white/5 rounded-2xl p-6 shadow-2xl">
          <div className="flex items-center gap-2 mb-6 border-b border-white/5 pb-4">
            <Calculator className="w-5 h-5 text-[#FF007F]" />
            <h2 className="text-lg font-orbitron font-bold uppercase tracking-wider text-white">
              Kalkulator MLBB
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* CARD WIN RATE */}
            <div className="bg-[#2D2D35] p-5 rounded-xl border border-white/5 space-y-3">
              <div className="flex items-center gap-2 text-white font-bold font-orbitron text-sm">
                <Percent className="w-4 h-4 text-[#00D4FF]" /> Win Rate
              </div>
              <p className="text-[11px] text-white/50 leading-relaxed">
                Digunakan untuk menghitung total jumlah match yang harus
                ditempuh untuk mencapai target win rate yang diinginkan.
              </p>
              <form
                onSubmit={calculateWinRate}
                className="space-y-2 text-xs pt-2"
              >
                <input
                  type="number"
                  placeholder="Total Match Anda"
                  value={totalMatch}
                  onChange={(e) => setTotalMatch(e.target.value)}
                  className="w-full bg-[#1c0a30] border border-white/10 p-2.5 rounded-lg text-white outline-none"
                />
                <input
                  type="number"
                  step="0.1"
                  placeholder="WR Saat Ini"
                  value={currentWr}
                  onChange={(e) => setCurrentWr(e.target.value)}
                  className="w-full bg-[#1c0a30] border border-white/10 p-2.5 rounded-lg text-white outline-none"
                />
                <input
                  type="number"
                  step="0.1"
                  placeholder="Target WR"
                  value={targetWr}
                  onChange={(e) => setTargetWr(e.target.value)}
                  className="w-full bg-[#1c0a30] border border-white/10 p-2.5 rounded-lg text-white outline-none"
                />
                <button
                  type="submit"
                  className="w-full bg-[#FF007F] py-2 rounded-lg font-bold font-orbitron text-[11px] cursor-pointer"
                >
                  HITUNG
                </button>
              </form>
              {wrResult !== null && (
                <div className="mt-3 p-3 bg-[#120224] rounded-lg border border-[#00D4FF]/30 text-center">
                  <p className="text-[10px] text-white/50 uppercase">
                    Match Win Beruntun
                  </p>
                  <p className="text-lg font-bold text-[#00D4FF]">
                    {wrResult} Match
                  </p>
                </div>
              )}
            </div>

            {/* CARD MAGIC WHEEL */}
            <div className="bg-[#2D2D35] p-5 rounded-xl border border-white/5 space-y-3">
              <div className="flex items-center gap-2 text-white font-bold font-orbitron text-sm">
                <Sparkles className="w-4 h-4 text-[#FFD740]" /> Magic Wheel
              </div>
              <p className="text-[11px] text-white/50 leading-relaxed">
                Digunakan untuk mengetahui total maksimal diamond yang
                dibutuhkan untuk mendapatkan skin Legends.
              </p>
              <div className="space-y-2 text-xs pt-2">
                <input
                  type="number"
                  max="200"
                  placeholder="Poin Magic Wheel Saat Ini"
                  value={magicPoints}
                  onChange={(e) => setMagicPoints(e.target.value)}
                  className="w-full bg-[#1c0a30] border border-white/10 p-2.5 rounded-lg text-white outline-none"
                />
                <div className="p-3 bg-[#120224] rounded-lg border border-white/5 text-center">
                  <p className="text-[10px] text-white/50 uppercase">
                    Sisa Diamond Maksimal
                  </p>
                  <p className="text-lg font-bold text-[#FFD740]">
                    {Math.max(0, (200 - (parseInt(magicPoints) || 0)) * 60)} DM
                  </p>
                </div>
              </div>
            </div>

            {/* CARD ZODIAC */}
            <div className="bg-[#2D2D35] p-5 rounded-xl border border-white/5 space-y-3">
              <div className="flex items-center gap-2 text-white font-bold font-orbitron text-sm">
                <ShieldAlert className="w-4 h-4 text-purple-400" /> Zodiac
              </div>
              <p className="text-[11px] text-white/50 leading-relaxed">
                Digunakan untuk mengetahui total diamond maksimal yang
                dibutuhkan untuk mendapatkan skin Zodiacs.
              </p>
              <div className="space-y-2 text-xs pt-2">
                <input
                  type="number"
                  max="100"
                  placeholder="Star Power Saat Ini"
                  value={zodiacStar}
                  onChange={(e) => setZodiacStar(e.target.value)}
                  className="w-full bg-[#1c0a30] border border-white/10 p-2.5 rounded-lg text-white outline-none"
                />
                <div className="p-3 bg-[#120224] rounded-lg border border-white/5 text-center">
                  <p className="text-[10px] text-white/50 uppercase">
                    Sisa Diamond Maksimal
                  </p>
                  <p className="text-lg font-bold text-purple-400">
                    {Math.max(0, (100 - (parseInt(zodiacStar) || 0)) * 20)} DM
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
