// src/admin/AdminUsers.tsx
import { useState, useEffect } from "react";
import { Search, Loader2, Shield } from "lucide-react";
import { supabase } from "../lib/supabase";

export default function AdminUsers() {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  const fetchUsers = async () => {
    setLoading(true);
    const { data } = await supabase
      .from("profiles")
      .select("*")
      .order("created_at", { ascending: false });
    setUsers(data || []);
    setLoading(false);
  };

  useEffect(() => {
    fetchUsers();
    const channel = supabase
      .channel("profiles_changes")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "profiles" },
        () => fetchUsers(),
      )
      .subscribe();
    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const updateRole = async (id: string, newRole: string) => {
    if (!confirm(`Ubah role user ini menjadi ${newRole}?`)) return;
    const { error } = await supabase
      .from("profiles")
      .update({ role: newRole })
      .eq("id", id);
    if (error) alert("Gagal mengubah role");
  };

  const filtered = users.filter((u) =>
    u.full_name?.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row justify-between gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Cari nama user..."
            className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[rgba(10,16,32,0.5)] border border-[rgba(159,211,232,0.15)] text-sm text-white outline-none"
          />
        </div>
      </div>

      <div className="bg-[rgba(10,16,32,0.5)] rounded-2xl border border-[rgba(159,211,232,0.15)] overflow-hidden">
        <table className="w-full text-left">
          <thead>
            <tr className="border-b border-white/5 text-[10px] font-orbitron uppercase text-white/40">
              <th className="px-4 py-3">ID User</th>
              <th className="px-4 py-3">Nama Lengkap</th>
              <th className="px-4 py-3">Role Akses</th>
              <th className="px-4 py-3">Bergabung</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={4} className="py-10 text-center">
                  <Loader2 className="animate-spin w-6 h-6 mx-auto text-[#9FD3E8]" />
                </td>
              </tr>
            ) : (
              filtered.map((u) => (
                <tr
                  key={u.id}
                  className="border-b border-white/5 hover:bg-white/5"
                >
                  <td className="px-4 py-3 text-xs text-white/50 font-mono truncate max-w-[100px]">
                    {u.id}
                  </td>
                  <td className="px-4 py-3 text-sm text-white">
                    {u.full_name || "User Baru"}
                  </td>
                  <td className="px-4 py-3">
                    <select
                      value={u.role}
                      onChange={(e) => updateRole(u.id, e.target.value)}
                      className="bg-transparent text-xs font-orbitron text-[#9FD3E8] border border-[#9FD3E8]/30 rounded px-2 py-1 outline-none"
                    >
                      <option value="user" className="bg-[#0A1020]">
                        User
                      </option>
                      <option value="moderator" className="bg-[#0A1020]">
                        Moderator
                      </option>
                      <option value="admin" className="bg-[#0A1020]">
                        Admin
                      </option>
                      <option value="super_admin" className="bg-[#0A1020]">
                        Super Admin
                      </option>
                    </select>
                  </td>
                  <td className="px-4 py-3 text-xs text-white/40">
                    {new Date(u.created_at).toLocaleDateString("id-ID")}
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
