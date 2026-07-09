import { useState, useEffect } from "react";
import { Plus, Trash2, Loader2 } from "lucide-react";
import { supabase } from "../lib/supabase";

export default function AdminOrders() {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({
    customer_name: "",
    product_name: "",
    price: 0,
  });

  const fetchOrders = async () => {
    setLoading(true);
    const { data } = await supabase
      .from("manual_orders")
      .select("*")
      .order("created_at", { ascending: false });
    setOrders(data || []);
    setLoading(false);
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleSave = async () => {
    if (!form.customer_name || !form.product_name)
      return alert("Lengkapi data!");
    await supabase.from("manual_orders").insert([form]);
    setShowForm(false);
    fetchOrders();
  };

  const updateStatus = async (id: string, status: string) => {
    await supabase.from("manual_orders").update({ status }).eq("id", id);
    fetchOrders();
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Hapus order ini?")) return;
    await supabase.from("manual_orders").delete().eq("id", id);
    fetchOrders();
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-sm font-orbitron font-semibold text-white">
          ORDER MANUAL
        </h2>
        <button
          onClick={() => setShowForm(true)}
          className="px-4 py-2 bg-[#9FD3E8] text-[#0A1020] rounded-xl text-xs font-bold flex gap-2"
        >
          <Plus className="w-4 h-4" /> TAMBAH
        </button>
      </div>
      <div className="bg-[rgba(10,16,32,0.5)] rounded-2xl border border-[rgba(159,211,232,0.15)] overflow-hidden">
        <table className="w-full text-left text-white">
          <thead className="bg-white/5 text-[10px] uppercase text-white/40">
            <tr>
              <th className="p-4">Pelanggan</th>
              <th className="p-4">Produk</th>
              <th className="p-4">Harga</th>
              <th className="p-4">Status</th>
              <th className="p-4">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={5} className="text-center p-10">
                  <Loader2 className="animate-spin mx-auto text-[#9FD3E8]" />
                </td>
              </tr>
            ) : (
              orders.map((o) => (
                <tr
                  key={o.id}
                  className="border-t border-white/5 hover:bg-white/5"
                >
                  <td className="p-4 text-sm">{o.customer_name}</td>
                  <td className="p-4 text-xs">{o.product_name}</td>
                  <td className="p-4 text-xs text-[#00E5FF]">
                    Rp {o.price.toLocaleString()}
                  </td>
                  <td className="p-4">
                    <select
                      value={o.status}
                      onChange={(e) => updateStatus(o.id, e.target.value)}
                      className="bg-transparent text-xs text-[#9FD3E8] border border-[#9FD3E8]/30 rounded p-1 outline-none"
                    >
                      <option value="Pending" className="bg-[#0A1020]">
                        Pending
                      </option>
                      <option value="Success" className="bg-[#0A1020]">
                        Success
                      </option>
                    </select>
                  </td>
                  <td className="p-4">
                    <button
                      onClick={() => handleDelete(o.id)}
                      className="text-[#FF4081]"
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

      {showForm && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center p-4">
          <div className="bg-[#0A1020] p-6 rounded-2xl border border-[rgba(159,211,232,0.2)] w-full max-w-sm space-y-4">
            <h3 className="text-white font-bold">BUAT ORDER MANUAL</h3>
            <input
              type="text"
              placeholder="Nama Pelanggan"
              onChange={(e) =>
                setForm({ ...form, customer_name: e.target.value })
              }
              className="w-full p-2 rounded bg-white/5 text-white outline-none"
            />
            <input
              type="text"
              placeholder="Nama Produk"
              onChange={(e) =>
                setForm({ ...form, product_name: e.target.value })
              }
              className="w-full p-2 rounded bg-white/5 text-white outline-none"
            />
            <input
              type="number"
              placeholder="Harga"
              onChange={(e) =>
                setForm({ ...form, price: Number(e.target.value) })
              }
              className="w-full p-2 rounded bg-white/5 text-white outline-none"
            />
            <div className="flex gap-2">
              <button
                onClick={() => setShowForm(false)}
                className="flex-1 p-2 bg-white/10 text-white rounded"
              >
                Batal
              </button>
              <button
                onClick={handleSave}
                className="flex-1 p-2 bg-[#9FD3E8] text-black font-bold rounded"
              >
                Simpan
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
