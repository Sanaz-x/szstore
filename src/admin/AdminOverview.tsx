// src/admin/AdminOverview.tsx
import { useState, useEffect } from "react";
import {
  TrendingUp, ShoppingCart, Users, DollarSign,
  ArrowUpRight, ArrowDownRight, Package, Loader2,
  CheckCircle, Clock, XCircle, Activity
} from "lucide-react";
import { supabase } from "../lib/supabase";

function StatCard({ label, value, sub, icon: Icon, color, trend }: {
  label: string; value: string; sub?: string; icon: any; color: string; trend?: "up" | "down" | "neutral";
}) {
  return (
    <div className={`relative overflow-hidden rounded-2xl p-5 border bg-[rgba(10,16,32,0.5)] border-white/10`}>
      <div className="flex items-start justify-between">
        <div>
          <p className="text-[10px] font-orbitron uppercase tracking-wider text-white/40 mb-1">{label}</p>
          <p className="text-2xl font-orbitron font-bold text-white">{value}</p>
          {sub && <p className="text-xs text-white/40 mt-1">{sub}</p>}
        </div>
        <div className={`w-10 h-10 rounded-xl flex items-center justify-center`} style={{ backgroundColor: `${color}20`, border: `1px solid ${color}40` }}>
          <Icon className="w-5 h-5" style={{ color }} />
        </div>
      </div>
      {trend && (
        <div className={`flex items-center gap-1 mt-3 text-xs ${trend === "up" ? "text-emerald-400" : trend === "down" ? "text-red-400" : "text-white/40"}`}>
          {trend === "up" ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
          <span>vs kemarin</span>
        </div>
      )}
      {/* Glowing dot */}
      <div className="absolute -bottom-4 -right-4 w-20 h-20 rounded-full opacity-10" style={{ backgroundColor: color }} />
    </div>
  );
}

function MiniBarChart({ data, color }: { data: number[]; color: string }) {
  const max = Math.max(...data, 1);
  return (
    <div className="flex items-end gap-1 h-16">
      {data.map((v, i) => (
        <div key={i} className="flex-1 rounded-t transition-all" style={{ height: `${(v / max) * 100}%`, backgroundColor: color, opacity: i === data.length - 1 ? 1 : 0.4 }} />
      ))}
    </div>
  );
}

export default function AdminOverview() {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalRevenue: 0,
    todayRevenue: 0,
    totalOrders: 0,
    todayOrders: 0,
    totalUsers: 0,
    pendingOrders: 0,
    successOrders: 0,
    failedOrders: 0,
  });
  const [recentTxns, setRecentTxns] = useState<any[]>([]);
  const [chartData, setChartData] = useState<number[]>(Array(7).fill(0));
  const [chartDates, setChartDates] = useState<string[]>([]);
  const [topGames, setTopGames] = useState<any[]>([]);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    const today = new Date();
    const todayStr = today.toISOString().split("T")[0];

    const [
      { data: allTxns },
      { data: todayTxns },
      { data: users },
      { data: recent },
      { data: games },
    ] = await Promise.all([
      supabase.from("transactions").select("amount, status"),
      supabase.from("transactions").select("amount, status").gte("created_at", `${todayStr}T00:00:00`),
      supabase.from("profiles").select("id", { count: "exact" }),
      supabase.from("transactions").select("id, invoice, amount, status, created_at, products(name)").order("created_at", { ascending: false }).limit(5),
      supabase.from("transactions").select("game_id, amount, games(name)").eq("status", "Success"),
    ]);

    const totalRevenue = (allTxns || []).filter(t => t.status === "Success").reduce((s, t) => s + (t.amount || 0), 0);
    const todayRevenue = (todayTxns || []).filter(t => t.status === "Success").reduce((s, t) => s + (t.amount || 0), 0);
    const pendingOrders = (allTxns || []).filter(t => t.status === "Pending").length;
    const successOrders = (allTxns || []).filter(t => t.status === "Success").length;
    const failedOrders = (allTxns || []).filter(t => t.status === "Failed").length;

    setStats({
      totalRevenue,
      todayRevenue,
      totalOrders: (allTxns || []).length,
      todayOrders: (todayTxns || []).length,
      totalUsers: (users as any)?.length || 0,
      pendingOrders,
      successOrders,
      failedOrders,
    });
    setRecentTxns(recent || []);

    // Build 7-day chart
    const days = [];
    const dayLabels = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date(today);
      d.setDate(d.getDate() - i);
      const dateStr = d.toISOString().split("T")[0];
      dayLabels.push(d.toLocaleDateString("id-ID", { weekday: "short" }));
      const { data: dayTxns } = await supabase
        .from("transactions")
        .select("amount")
        .eq("status", "Success")
        .gte("created_at", `${dateStr}T00:00:00`)
        .lt("created_at", `${dateStr}T23:59:59`);
      days.push((dayTxns || []).reduce((s, t) => s + (t.amount || 0), 0));
    }
    setChartData(days);
    setChartDates(dayLabels);

    // Top games by revenue
    const gameMap: Record<string, { name: string; total: number }> = {};
    for (const t of (games || [])) {
      const gid = t.game_id || "unknown";
      const gname = (t.games as any)?.name || "Lainnya";
      if (!gameMap[gid]) gameMap[gid] = { name: gname, total: 0 };
      gameMap[gid].total += t.amount || 0;
    }
    const topG = Object.values(gameMap).sort((a, b) => b.total - a.total).slice(0, 5);
    setTopGames(topG);

    setLoading(false);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-20">
        <Loader2 className="animate-spin text-[#9FD3E8] w-8 h-8" />
      </div>
    );
  }

  const statusColor: Record<string, string> = {
    Success: "text-emerald-400",
    Pending: "text-amber-400",
    Failed: "text-red-400",
  };
  const statusBg: Record<string, string> = {
    Success: "bg-emerald-500/20",
    Pending: "bg-amber-500/20",
    Failed: "bg-red-500/20",
  };
  const maxGame = Math.max(...topGames.map(g => g.total), 1);

  return (
    <div className="space-y-5">
      <h2 className="text-sm font-orbitron font-semibold uppercase tracking-wider text-white">
        DASHBOARD OVERVIEW
      </h2>

      {/* Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <StatCard label="Total Pendapatan" value={`Rp ${(stats.totalRevenue / 1000000).toFixed(1)}Jt`} sub={`Hari ini: Rp ${stats.todayRevenue.toLocaleString("id-ID")}`} icon={DollarSign} color="#00E5FF" trend="up" />
        <StatCard label="Total Pesanan" value={stats.totalOrders.toString()} sub={`Hari ini: ${stats.todayOrders}`} icon={ShoppingCart} color="#FF007F" trend="up" />
        <StatCard label="Total Pengguna" value={stats.totalUsers.toString()} sub="Pengguna terdaftar" icon={Users} color="#FFD740" trend="neutral" />
        <StatCard label="Pesanan Sukses" value={stats.successOrders.toString()} sub={`Pending: ${stats.pendingOrders} | Gagal: ${stats.failedOrders}`} icon={CheckCircle} color="#00FF87" trend="up" />
      </div>

      {/* Chart + Status */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Revenue Chart */}
        <div className="lg:col-span-2 bg-[rgba(10,16,32,0.5)] border border-white/10 rounded-2xl p-5">
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-[10px] font-orbitron uppercase tracking-wider text-white/40">Pendapatan 7 Hari</p>
              <p className="text-lg font-orbitron font-bold text-[#00E5FF] mt-0.5">
                Rp {stats.totalRevenue.toLocaleString("id-ID")}
              </p>
            </div>
            <Activity className="w-5 h-5 text-[#00E5FF]" />
          </div>
          <MiniBarChart data={chartData} color="#00E5FF" />
          <div className="flex justify-between mt-2">
            {chartDates.map((d, i) => (
              <span key={i} className="text-[9px] text-white/30 font-orbitron">{d}</span>
            ))}
          </div>
        </div>

        {/* Order Status */}
        <div className="bg-[rgba(10,16,32,0.5)] border border-white/10 rounded-2xl p-5">
          <p className="text-[10px] font-orbitron uppercase tracking-wider text-white/40 mb-4">Status Pesanan</p>
          <div className="space-y-3">
            {[
              { label: "Sukses", val: stats.successOrders, icon: CheckCircle, color: "text-emerald-400", bg: "bg-emerald-500" },
              { label: "Pending", val: stats.pendingOrders, icon: Clock, color: "text-amber-400", bg: "bg-amber-500" },
              { label: "Gagal", val: stats.failedOrders, icon: XCircle, color: "text-red-400", bg: "bg-red-500" },
            ].map((item) => {
              const pct = stats.totalOrders > 0 ? (item.val / stats.totalOrders) * 100 : 0;
              const Icon = item.icon;
              return (
                <div key={item.label}>
                  <div className="flex items-center justify-between mb-1">
                    <div className="flex items-center gap-2">
                      <Icon className={`w-3.5 h-3.5 ${item.color}`} />
                      <span className="text-xs text-white/60">{item.label}</span>
                    </div>
                    <span className={`text-xs font-bold ${item.color}`}>{item.val}</span>
                  </div>
                  <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
                    <div className={`h-full ${item.bg} rounded-full transition-all`} style={{ width: `${pct}%` }} />
                  </div>
                </div>
              );
            })}
          </div>

          {/* Top Games */}
          {topGames.length > 0 && (
            <div className="mt-5">
              <p className="text-[10px] font-orbitron uppercase tracking-wider text-white/40 mb-3">Top Game Revenue</p>
              <div className="space-y-2">
                {topGames.map((g, i) => (
                  <div key={i}>
                    <div className="flex justify-between text-xs mb-0.5">
                      <span className="text-white/60 truncate max-w-[120px]">{g.name}</span>
                      <span className="text-[#FFD740] font-bold shrink-0">Rp {(g.total / 1000).toFixed(0)}k</span>
                    </div>
                    <div className="h-1 bg-white/5 rounded-full overflow-hidden">
                      <div className="h-full bg-[#FFD740] rounded-full" style={{ width: `${(g.total / maxGame) * 100}%` }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Recent Transactions */}
      <div className="bg-[rgba(10,16,32,0.5)] border border-white/10 rounded-2xl overflow-hidden">
        <div className="flex items-center justify-between px-5 py-3 border-b border-white/5">
          <p className="text-[10px] font-orbitron uppercase tracking-wider text-white/60">Transaksi Terbaru</p>
          <TrendingUp className="w-4 h-4 text-white/20" />
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm min-w-max">
            <thead>
              <tr className="bg-white/[0.02]">
                <th className="text-left px-5 py-2.5 text-[9px] font-orbitron uppercase text-white/30">Invoice</th>
                <th className="text-left px-5 py-2.5 text-[9px] font-orbitron uppercase text-white/30">Produk</th>
                <th className="text-right px-5 py-2.5 text-[9px] font-orbitron uppercase text-white/30">Amount</th>
                <th className="text-center px-5 py-2.5 text-[9px] font-orbitron uppercase text-white/30">Status</th>
                <th className="text-right px-5 py-2.5 text-[9px] font-orbitron uppercase text-white/30">Waktu</th>
              </tr>
            </thead>
            <tbody>
              {recentTxns.length === 0 ? (
                <tr>
                  <td colSpan={5} className="text-center py-8 text-white/30 text-sm">Belum ada transaksi</td>
                </tr>
              ) : (
                recentTxns.map((t) => (
                  <tr key={t.id} className="border-t border-white/5 hover:bg-white/[0.02]">
                    <td className="px-5 py-3 font-mono text-[#9FD3E8] text-xs">{t.invoice}</td>
                    <td className="px-5 py-3 text-white/70 max-w-[150px] truncate">{t.products?.name || "—"}</td>
                    <td className="px-5 py-3 text-right text-[#FFD740] font-bold">Rp {t.amount?.toLocaleString("id-ID")}</td>
                    <td className="px-5 py-3 text-center">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${statusBg[t.status] || "bg-white/10"} ${statusColor[t.status] || "text-white/60"}`}>
                        {t.status}
                      </span>
                    </td>
                    <td className="px-5 py-3 text-right text-[10px] text-white/30">
                      {new Date(t.created_at).toLocaleString("id-ID", { dateStyle: "short", timeStyle: "short" })}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
