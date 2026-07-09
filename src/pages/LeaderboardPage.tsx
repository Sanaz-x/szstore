import { useState, useEffect } from "react";
import { Trophy, Crown, Medal, Star, Loader2, Flame } from "lucide-react";
import { supabase } from "../lib/supabase";
import TopNavigation from "../components/TopNavigation";
import Footer from "../components/Footer";

export default function LeaderboardPage() {
  const [leaders, setLeaders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchLeaderboard() {
      // Get all successful transactions
      const { data: txns } = await supabase
        .from("transactions")
        .select("user_id, amount, profiles(full_name, email)")
        .eq("status", "Success");

      if (!txns) {
        setLoading(false);
        return;
      }

      // Aggregate totals by user
      const aggregated: Record<string, { name: string; total: number; count: number }> = {};
      for (const t of txns) {
        const uid = t.user_id;
        if (!uid) continue;
        const name = (t.profiles as any)?.full_name || (t.profiles as any)?.email?.split("@")[0] || "Anonim";
        if (!aggregated[uid]) {
          aggregated[uid] = { name, total: 0, count: 0 };
        }
        aggregated[uid].total += t.amount || 0;
        aggregated[uid].count += 1;
      }

      const sorted = Object.values(aggregated)
        .sort((a, b) => b.total - a.total)
        .slice(0, 20);

      setLeaders(sorted);
      setLoading(false);
    }
    fetchLeaderboard();
  }, []);

  const getRankIcon = (rank: number) => {
    if (rank === 0) return <Crown className="w-6 h-6 text-[#FFD740]" />;
    if (rank === 1) return <Medal className="w-6 h-6 text-[#C0C0C0]" />;
    if (rank === 2) return <Medal className="w-6 h-6 text-[#CD7F32]" />;
    return <span className="text-white/40 font-orbitron text-sm font-bold">#{rank + 1}</span>;
  };

  const getRankStyle = (rank: number) => {
    if (rank === 0) return "border-[#FFD740]/40 bg-gradient-to-r from-[#FFD740]/10 to-transparent";
    if (rank === 1) return "border-[#C0C0C0]/30 bg-gradient-to-r from-[#C0C0C0]/5 to-transparent";
    if (rank === 2) return "border-[#CD7F32]/30 bg-gradient-to-r from-[#CD7F32]/5 to-transparent";
    return "border-white/5";
  };

  const getAvatar = (name: string, rank: number) => {
    const colors = ["#FF007F", "#00E5FF", "#FFD740", "#7367F0", "#00FF87"];
    const bg = colors[rank % colors.length];
    return (
      <div
        className="w-10 h-10 rounded-full flex items-center justify-center font-orbitron font-bold text-sm text-white shrink-0"
        style={{ background: `linear-gradient(135deg, ${bg}80, ${bg}30)`, border: `1px solid ${bg}50` }}
      >
        {name.charAt(0).toUpperCase()}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-[#1c0a30] text-white font-rajdhani">
      <TopNavigation />
      <div className="pt-[80px]" />

      {/* Hero */}
      <div className="relative overflow-hidden bg-gradient-to-b from-[#2d0a4a] to-[#1c0a30] py-14">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 left-1/3 w-80 h-80 bg-[#FFD740]/10 rounded-full blur-3xl" />
          <div className="absolute bottom-0 right-1/3 w-80 h-80 bg-[#FF007F]/10 rounded-full blur-3xl" />
        </div>
        <div className="relative max-w-3xl mx-auto px-4 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-[#FFD740]/30 bg-[#FFD740]/10 mb-4">
            <Trophy className="w-4 h-4 text-[#FFD740]" />
            <span className="text-[#FFD740] text-xs font-orbitron uppercase tracking-widest">Leaderboard</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-orbitron font-black text-white mb-3">
            Top <span className="text-[#FFD740]">Spender</span> SZStore
          </h1>
          <p className="text-white/50 max-w-md mx-auto">
            Pengguna paling berdedikasi dan setia kami! Total belanja diakumulasi dari semua transaksi sukses.
          </p>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-2xl mx-auto px-4 py-10">
        {loading ? (
          <div className="flex justify-center py-20">
            <Loader2 className="animate-spin w-10 h-10 text-[#FFD740]" />
          </div>
        ) : leaders.length === 0 ? (
          <div className="text-center py-20">
            <Trophy className="w-16 h-16 text-white/10 mx-auto mb-4" />
            <p className="text-white/30">Belum ada data transaksi untuk ditampilkan.</p>
          </div>
        ) : (
          <>
            {/* Top 3 Podium */}
            {leaders.length >= 3 && (
              <div className="flex items-end justify-center gap-4 mb-10">
                {/* 2nd */}
                <div className="flex flex-col items-center gap-2 pb-2">
                  {getAvatar(leaders[1]?.name, 1)}
                  <div className="h-20 w-24 bg-[#C0C0C0]/10 border border-[#C0C0C0]/30 rounded-t-xl flex flex-col items-center justify-center">
                    <Medal className="w-6 h-6 text-[#C0C0C0] mb-1" />
                    <span className="text-[#C0C0C0] font-orbitron font-bold text-sm">#2</span>
                  </div>
                  <p className="text-white/70 text-xs text-center max-w-[80px] truncate">{leaders[1]?.name}</p>
                  <p className="text-[#C0C0C0] font-bold text-xs">Rp {leaders[1]?.total?.toLocaleString("id-ID")}</p>
                </div>

                {/* 1st */}
                <div className="flex flex-col items-center gap-2">
                  <div className="relative">
                    {getAvatar(leaders[0]?.name, 0)}
                    <Flame className="absolute -top-2 -right-1 w-4 h-4 text-[#FF007F] animate-pulse" />
                  </div>
                  <div className="h-28 w-28 bg-[#FFD740]/10 border border-[#FFD740]/40 rounded-t-xl flex flex-col items-center justify-center shadow-[0_0_30px_rgba(255,215,64,0.2)]">
                    <Crown className="w-8 h-8 text-[#FFD740] mb-1" />
                    <span className="text-[#FFD740] font-orbitron font-black text-base">#1</span>
                  </div>
                  <p className="text-white font-bold text-xs text-center max-w-[100px] truncate">{leaders[0]?.name}</p>
                  <p className="text-[#FFD740] font-bold text-sm">Rp {leaders[0]?.total?.toLocaleString("id-ID")}</p>
                </div>

                {/* 3rd */}
                <div className="flex flex-col items-center gap-2 pb-2">
                  {getAvatar(leaders[2]?.name, 2)}
                  <div className="h-14 w-24 bg-[#CD7F32]/10 border border-[#CD7F32]/30 rounded-t-xl flex flex-col items-center justify-center">
                    <Medal className="w-6 h-6 text-[#CD7F32] mb-1" />
                    <span className="text-[#CD7F32] font-orbitron font-bold text-sm">#3</span>
                  </div>
                  <p className="text-white/70 text-xs text-center max-w-[80px] truncate">{leaders[2]?.name}</p>
                  <p className="text-[#CD7F32] font-bold text-xs">Rp {leaders[2]?.total?.toLocaleString("id-ID")}</p>
                </div>
              </div>
            )}

            {/* Full List */}
            <div className="space-y-2">
              {leaders.map((l, idx) => (
                <div
                  key={idx}
                  className={`flex items-center gap-4 px-4 py-3.5 rounded-xl border transition-all ${getRankStyle(idx)}`}
                >
                  <div className="w-8 flex justify-center">{getRankIcon(idx)}</div>
                  {getAvatar(l.name, idx)}
                  <div className="flex-1 min-w-0">
                    <p className="font-bold text-white truncate">{l.name}</p>
                    <p className="text-xs text-white/30">{l.count} transaksi sukses</p>
                  </div>
                  <div className="text-right">
                    <p className={`font-orbitron font-bold text-sm ${idx === 0 ? "text-[#FFD740]" : idx === 1 ? "text-[#C0C0C0]" : idx === 2 ? "text-[#CD7F32]" : "text-[#00E5FF]"}`}>
                      Rp {l.total?.toLocaleString("id-ID")}
                    </p>
                    <div className="flex items-center gap-1 justify-end mt-0.5">
                      <Star className="w-3 h-3 text-[#FFD740]" />
                      <span className="text-[10px] text-white/30">Top Spender</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>

      <Footer />
    </div>
  );
}
