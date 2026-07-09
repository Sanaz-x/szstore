import { useState, useEffect } from "react";
import { Loader2, RefreshCw, Search } from "lucide-react";
import { supabase } from "../lib/supabase";

export default function AdminOrders() {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchOrders = async () => {
    setLoading(true);
    const { data } = await supabase
      .from("transactions")
      .select("*, products(name), profiles(full_name)")
      .order("created_at", { ascending: false });
    setOrders(data || []);
    setLoading(false);
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const togglePaidStatus = async (id: string, currentStatus: boolean) => {
    await supabase
      .from("transactions")
      .update({ is_paid: !currentStatus })
      .eq("id", id);
    fetchOrders();
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-orbitron font-bold text-white">PESANAN</h2>
      </div>

      <div className="bg-[#1C2237] rounded-xl border border-white/10 overflow-hidden overflow-x-auto">
        <table className="w-full text-left text-white text-sm min-w-max">
          <thead className="bg-white/5 border-b border-white/10 font-orbitron text-[10px] uppercase text-white/60">
            <tr>
              <th className="p-4">Waktu</th>
              <th className="p-4">Invoice</th>
              <th className="p-4">Username</th>
              <th className="p-4">Layanan</th>
              <th className="p-4">Data Target</th>
              <th className="p-4">Harga / Profit</th>
              <th className="p-4 text-center">Status</th>
              <th className="p-4 text-center">Lunas</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={8} className="text-center p-8">
                  <Loader2 className="animate-spin mx-auto text-[#7367F0]" />
                </td>
              </tr>
            ) : (
              orders.map((o) => (
                <tr
                  key={o.id}
                  className="border-b border-white/5 hover:bg-white/5"
                >
                  <td className="p-4 text-xs text-white/50">
                    {new Date(o.created_at).toLocaleString("id-ID")}
                  </td>
                  <td className="p-4 font-mono text-[#7367F0]">{o.invoice}</td>
                  <td className="p-4">{o.profiles?.full_name || "Guest"}</td>
                  <td className="p-4 text-xs uppercase max-w-[150px] truncate">
                    {o.products?.name || "-"}
                  </td>
                  <td className="p-4">
                    <div className="bg-[#7367F0] text-white text-xs px-2 py-1 rounded inline-block">
                      {o.target_data || "081234"}{" "}
                      {o.target_additional_data
                        ? `(${o.target_additional_data})`
                        : ""}
                    </div>
                  </td>
                  <td className="p-4">
                    <p className="text-emerald-400 font-bold">
                      Rp {o.amount?.toLocaleString("id-ID")}
                    </p>
                    <p className="text-[10px] text-white/50">
                      Profit: Rp {o.profit?.toLocaleString("id-ID")}
                    </p>
                  </td>
                  <td className="p-4 text-center">
                    <span
                      className={`px-2 py-1 rounded text-[10px] font-bold ${o.status === "Success" ? "bg-emerald-500/20 text-emerald-400" : o.status === "Pending" ? "bg-amber-500/20 text-amber-400" : "bg-red-500/20 text-red-400"}`}
                    >
                      {o.status.toUpperCase()}
                    </span>
                  </td>
                  <td className="p-4 text-center">
                    <button
                      onClick={() => togglePaidStatus(o.id, o.is_paid)}
                      className={`p-1.5 rounded transition-colors ${o.is_paid ? "bg-emerald-500/20 text-emerald-400 hover:bg-emerald-500" : "bg-amber-500/20 text-amber-400 hover:bg-amber-500"} hover:text-white`}
                    >
                      <RefreshCw className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
