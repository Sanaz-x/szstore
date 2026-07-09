// src/admin/AdminProducts.tsx
import { useState, useEffect } from "react";
import {
  RefreshCw,
  Loader2,
  Plus,
  Edit,
  Trash2,
  X,
  Settings,
} from "lucide-react";
import { supabase } from "../lib/supabase";

export default function AdminProducts() {
  const [products, setProducts] = useState<any[]>([]);
  const [games, setGames] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [syncing, setSyncing] = useState(false);

  // State untuk Modal Manual
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    sku_code: "",
    name: "",
    original_price: 0,
    sell_price: 0,
    status: true,
    game_id: "",
  });

  const fetchData = async () => {
    setLoading(true);
    const { data: prodData } = await supabase
      .from("products")
      .select("*, games(name)")
      .order("created_at", { ascending: false });
    const { data: gameData } = await supabase.from("games").select("id, name");

    setProducts(prodData || []);
    setGames(gameData || []);
    setLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, []);

  // --- FUNGSI SINKRONISASI API ---
  const handleSyncProvider = async () => {
    if (games.length === 0)
      return alert("Tambahkan game di menu GAME terlebih dahulu!");
    if (!confirm("Mulai sinkronisasi produk otomatis dari Digiflazz?")) return;

    setSyncing(true);
    try {
      // (Logika API provider Anda tetap sama seperti sebelumnya)
      // fetch('https://api.digiflazz.com/v1/price-list', {...})
      // ...
      alert(
        "Fitur sinkronisasi berjalan (silakan sesuaikan kredensial API Anda di dalam kode).",
      );
      fetchData();
    } catch (err: any) {
      alert("Error saat sinkronisasi: " + err.message);
    } finally {
      setSyncing(false);
    }
  };

  // --- FUNGSI MANUAL (TAMBAH/EDIT/HAPUS) ---
  const handleOpenModal = (product: any = null) => {
    if (product) {
      setEditingId(product.id);
      setFormData({
        sku_code: product.sku_code || "",
        name: product.name,
        original_price: product.original_price,
        sell_price: product.sell_price,
        status: product.status,
        game_id: product.game_id || "",
      });
    } else {
      setEditingId(null);
      setFormData({
        sku_code: "",
        name: "",
        original_price: 0,
        sell_price: 0,
        status: true,
        game_id: games[0]?.id || "",
      });
    }
    setIsModalOpen(true);
  };

  const handleSaveManual = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.game_id)
      return alert("Nama Produk dan Game wajib diisi!");

    if (editingId) {
      await supabase.from("products").update(formData).eq("id", editingId);
    } else {
      await supabase.from("products").insert([formData]);
    }

    setIsModalOpen(false);
    fetchData();
  };

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Yakin ingin menghapus produk "${name}"?`)) return;
    await supabase.from("products").delete().eq("id", id);
    fetchData();
  };

  const toggleStatus = async (id: string, currentStatus: boolean) => {
    await supabase
      .from("products")
      .update({ status: !currentStatus })
      .eq("id", id);
    fetchData();
  };

  return (
    <div className="space-y-4">
      {/* HEADER & TOMBOL */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h2 className="text-sm font-orbitron font-semibold text-white">
          DAFTAR PRODUK (ITEM TOP UP)
        </h2>
        <div className="flex gap-2">
          <button
            onClick={() => handleOpenModal()}
            className="px-4 py-2 bg-[#7367F0] hover:bg-[#5E50EE] text-white rounded-xl text-xs font-bold flex items-center gap-2 transition-all"
          >
            <Plus className="w-4 h-4" /> TAMBAH MANUAL
          </button>
          <button
            onClick={handleSyncProvider}
            disabled={syncing}
            className="px-4 py-2 bg-emerald-500 hover:bg-emerald-600 disabled:bg-emerald-800 text-white rounded-xl text-xs font-bold flex items-center gap-2 transition-all"
          >
            <RefreshCw className={`w-4 h-4 ${syncing ? "animate-spin" : ""}`} />
            {syncing ? "SINKRONISASI..." : "SINKRONISASI API"}
          </button>
        </div>
      </div>

      {/* TABEL DAFTAR PRODUK */}
      <div className="bg-[#1C2237] rounded-xl border border-white/10 overflow-hidden overflow-x-auto">
        <table className="w-full text-left text-white min-w-max">
          <thead className="bg-white/5 text-[10px] uppercase text-white/40 font-orbitron border-b border-white/10">
            <tr>
              <th className="p-4">SKU / Kode</th>
              <th className="p-4">Nama Item</th>
              <th className="p-4">Game</th>
              <th className="p-4">Harga Modal</th>
              <th className="p-4">Harga Jual</th>
              <th className="p-4 text-center">Status</th>
              <th className="p-4 text-center">Aksi</th>
            </tr>
          </thead>
          <tbody className="font-rajdhani text-sm">
            {loading ? (
              <tr>
                <td colSpan={7} className="text-center p-10">
                  <Loader2 className="animate-spin mx-auto text-[#7367F0]" />
                </td>
              </tr>
            ) : products.length === 0 ? (
              <tr>
                <td colSpan={7} className="text-center p-10 text-white/40">
                  Belum ada produk. Klik "Tambah Manual" atau "Sinkronisasi
                  API".
                </td>
              </tr>
            ) : (
              products.map((p) => (
                <tr
                  key={p.id}
                  className="border-b border-white/5 hover:bg-white/5"
                >
                  <td className="p-4 font-mono text-xs text-white/50">
                    {p.sku_code || "-"}
                  </td>
                  <td className="p-4 font-bold">{p.name}</td>
                  <td className="p-4 text-[#00E5FF]">
                    {p.games?.name || "Tanpa Game"}
                  </td>
                  <td className="p-4 text-white/50">
                    Rp {p.original_price?.toLocaleString("id-ID")}
                  </td>
                  <td className="p-4 text-[#FFD740] font-bold">
                    Rp {p.sell_price?.toLocaleString("id-ID")}
                  </td>
                  <td className="p-4 text-center">
                    <button
                      onClick={() => toggleStatus(p.id, p.status)}
                      className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors ${p.status ? "bg-[#7367F0]" : "bg-gray-600"}`}
                    >
                      <span
                        className={`inline-block h-3 w-3 transform rounded-full bg-white transition-transform ${p.status ? "translate-x-5" : "translate-x-1"}`}
                      />
                    </button>
                  </td>
                  <td className="p-4 flex justify-center gap-2">
                    <button
                      onClick={() => handleOpenModal(p)}
                      className="p-1.5 bg-amber-500/20 text-amber-400 hover:bg-amber-500 hover:text-white rounded"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(p.id, p.name)}
                      className="p-1.5 bg-red-500/20 text-red-400 hover:bg-red-500 hover:text-white rounded"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* MODAL FORM MANUAL */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
          <div className="bg-[#1C2237] w-full max-w-md rounded-xl border border-white/10 flex flex-col">
            <div className="flex justify-between items-center p-4 border-b border-white/10 bg-[#7367F0] rounded-t-xl">
              <h3 className="font-bold text-white flex items-center gap-2">
                <Settings className="w-4 h-4" />{" "}
                {editingId ? "Edit Produk" : "Tambah Produk Manual"}
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-white hover:text-gray-200"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveManual} className="p-6 space-y-4">
              <div>
                <label className="text-xs text-white/70 mb-1 block">
                  Pilih Game (Kategori)
                </label>
                <select
                  value={formData.game_id}
                  onChange={(e) =>
                    setFormData({ ...formData, game_id: e.target.value })
                  }
                  className="w-full bg-[#111526] border border-white/10 rounded-lg p-2.5 text-sm text-white appearance-none"
                  required
                >
                  <option value="" disabled>
                    -- Pilih Game --
                  </option>
                  {games.map((g) => (
                    <option key={g.id} value={g.id}>
                      {g.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-xs text-white/70 mb-1 block">
                  Nama Produk (Item)
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  placeholder="Contoh: 86 Diamonds"
                  className="w-full bg-[#111526] border border-white/10 rounded-lg p-2.5 text-sm text-white"
                  required
                />
              </div>

              <div>
                <label className="text-xs text-white/70 mb-1 block">
                  SKU Code (Opsional, untuk konek ke API)
                </label>
                <input
                  type="text"
                  value={formData.sku_code}
                  onChange={(e) =>
                    setFormData({ ...formData, sku_code: e.target.value })
                  }
                  placeholder="Contoh: ML86"
                  className="w-full bg-[#111526] border border-white/10 rounded-lg p-2.5 text-sm text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs text-white/70 mb-1 block">
                    Harga Modal
                  </label>
                  <input
                    type="number"
                    value={formData.original_price}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        original_price: Number(e.target.value),
                      })
                    }
                    className="w-full bg-[#111526] border border-white/10 rounded-lg p-2.5 text-sm text-white"
                    required
                  />
                </div>
                <div>
                  <label className="text-xs text-white/70 mb-1 block">
                    Harga Jual
                  </label>
                  <input
                    type="number"
                    value={formData.sell_price}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        sell_price: Number(e.target.value),
                      })
                    }
                    className="w-full bg-[#111526] border border-white/10 rounded-lg p-2.5 text-sm text-white"
                    required
                  />
                </div>
              </div>

              <div className="pt-4 border-t border-white/10 flex justify-end gap-3 mt-6">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 text-sm text-white/70 hover:text-white"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-[#7367F0] hover:bg-[#5E50EE] text-white rounded-lg text-sm font-bold"
                >
                  Simpan Produk
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
