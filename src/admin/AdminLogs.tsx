// src/admin/AdminLogs.tsx
import { useState, useEffect } from "react";
import { Loader2, Activity } from "lucide-react";
import { supabase } from "../lib/supabase";

export default function AdminLogs() {
  const [logs, setLogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchLogs() {
      setLoading(true);
      const { data } = await supabase
        .from("website_logs")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(50);
      setLogs(data || []);
      setLoading(false);
    }
    fetchLogs();
  }, []);

  return (
    <div className="space-y-4">
      <h2 className="text-sm font-orbitron font-semibold text-white flex items-center gap-2">
        <Activity className="w-4 h-4" /> ACTIVITY & WEBHOOK LOGS
      </h2>
      <div className="bg-[rgba(10,16,32,0.5)] rounded-2xl border border-[rgba(159,211,232,0.15)] overflow-hidden">
        <table className="w-full text-left text-white">
          <thead className="bg-white/5 text-[10px] uppercase text-white/40">
            <tr>
              <th className="p-4">Waktu</th>
              <th className="p-4">Aksi</th>
              <th className="p-4">Detail</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={3} className="text-center p-10">
                  <Loader2 className="animate-spin mx-auto text-[#9FD3E8]" />
                </td>
              </tr>
            ) : logs.length === 0 ? (
              <tr>
                <td colSpan={3} className="p-4 text-center text-white/40">
                  Tidak ada log aktivitas.
                </td>
              </tr>
            ) : (
              logs.map((l) => (
                <tr key={l.id} className="border-t border-white/5">
                  <td className="p-4 text-[10px] text-white/40">
                    {new Date(l.created_at).toLocaleString("id-ID")}
                  </td>
                  <td className="p-4 text-xs font-bold text-[#00E5FF]">
                    {l.action}
                  </td>
                  <td className="p-4 text-xs text-white/70 font-mono">
                    {l.details}
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
