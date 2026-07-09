// src/admin/AdminContacts.tsx
import { useState, useEffect } from "react";
import { Loader2, MessageCircle } from "lucide-react";
import { supabase } from "../lib/supabase";

export default function AdminContacts() {
  const [tickets, setTickets] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchTickets = async () => {
    setLoading(true);
    const { data } = await supabase
      .from("tickets")
      .select("*, profiles(full_name)")
      .order("created_at", { ascending: false });
    setTickets(data || []);
    setLoading(false);
  };

  useEffect(() => {
    fetchTickets();
  }, []);

  const updateStatus = async (id: string, status: string) => {
    await supabase.from("tickets").update({ status }).eq("id", id);
    fetchTickets();
  };

  return (
    <div className="space-y-4">
      <h2 className="text-sm font-orbitron font-semibold text-white flex items-center gap-2">
        <MessageCircle className="w-4 h-4" /> LIVE KONTAKS / TIKET
      </h2>
      <div className="grid gap-4">
        {loading ? (
          <Loader2 className="animate-spin mx-auto text-[#9FD3E8] mt-10" />
        ) : tickets.length === 0 ? (
          <p className="text-white/40 text-sm">
            Belum ada pesan dari pelanggan.
          </p>
        ) : (
          tickets.map((t) => (
            <div
              key={t.id}
              className="bg-[rgba(10,16,32,0.5)] p-4 rounded-xl border border-[rgba(159,211,232,0.15)]"
            >
              <div className="flex justify-between items-start mb-2">
                <div>
                  <h3 className="text-sm text-white font-bold">{t.subject}</h3>
                  <p className="text-xs text-white/40">
                    Dari: {t.profiles?.full_name || "User Anonim"}
                  </p>
                </div>
                <select
                  value={t.status}
                  onChange={(e) => updateStatus(t.id, e.target.value)}
                  className={`text-xs outline-none rounded p-1 border ${t.status === "Open" ? "text-green-400 border-green-400" : "text-gray-400 border-gray-400"} bg-transparent`}
                >
                  <option value="Open" className="bg-[#0A1020]">
                    Open
                  </option>
                  <option value="Pending" className="bg-[#0A1020]">
                    Pending
                  </option>
                  <option value="Closed" className="bg-[#0A1020]">
                    Closed
                  </option>
                </select>
              </div>
              <p className="text-sm text-white/80 bg-white/5 p-3 rounded">
                {t.message}
              </p>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
