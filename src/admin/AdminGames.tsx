import { useState, useEffect } from "react";
import {
  Loader2,
  Plus,
  Edit,
  Trash2,
  X,
  Image as ImageIcon,
  Settings,
} from "lucide-react";
import { supabase } from "../lib/supabase";


export default function AdminGames() {
  const [games, setGames] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  // Form State yang disesuaikan dengan referensi gambar
  const [formData, setFormData] = useState({
    name: "",
    slug: "",
    thumbnail_url: "",
    guide_image_url: "",
    category: "Top Up Games",
    category_id: "",
    description: "",
    validation_code: "",
    has_zone_id: false,
    placeholder_user_id: "User ID",
    placeholder_zone_id: "Zone ID",
    server_list: "",
    status: true,
  });

  const fetchGames = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("games")
      .select("*, categories(name)")
      .order("created_at", { ascending: false });
      
    if (error) {
      console.warn("Categories relation not found, falling back to basic game fetch.", error);
      const fallback = await supabase
        .from("games")
        .select("*")
        .order("created_at", { ascending: false });
      setGames(fallback.data || []);
    } else {
      setGames(data || []);
    }
    setLoading(false);
  };

  const fetchCategories = async () => {
    const { data } = await supabase
      .from("categories")
      .select("id, name")
      .eq("is_active", true)
      .order("sort_order", { ascending: true });
    setCategories(data || []);
  };

  useEffect(() => {
    fetchGames();
    fetchCategories();
  }, []);

  const handleOpenModal = (game: any = null) => {
    if (game) {
      setEditingId(game.id);
      setFormData(game);
    } else {
      setEditingId(null);
      setFormData({
        name: "",
        slug: "",
        thumbnail_url: "",
        guide_image_url: "",
        category: "Top Up Games",
        category_id: "",
        description: "",
        validation_code: "",
        has_zone_id: false,
        placeholder_user_id: "User ID",
        placeholder_zone_id: "Zone ID",
        server_list: "",
        status: true,
      });
    }
    setIsModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Sanitize payload: ambil kolom yang valid saja
    const payload = {
      name: formData.name,
      slug: formData.slug,
      thumbnail_url: formData.thumbnail_url,
      guide_image_url: formData.guide_image_url,
      category: formData.category,
      category_id: formData.category_id || null,
      description: formData.description,
      validation_code: formData.validation_code,
      has_zone_id: formData.has_zone_id,
      placeholder_user_id: formData.placeholder_user_id,
      placeholder_zone_id: formData.placeholder_zone_id,
      server_list: formData.server_list,
      status: formData.status,
    };

    if (editingId) {
      const { error } = await supabase.from("games").update(payload).eq("id", editingId);
      if (error) alert("Gagal menyimpan: " + error.message);
    } else {
      const { error } = await supabase.from("games").insert([payload]);
      if (error) alert("Gagal menyimpan: " + error.message);
    }
    setIsModalOpen(false);
    fetchGames();
  };

  const toggleStatus = async (
    id: string,
    currentStatus: boolean,
    field: string = "status",
  ) => {
    await supabase
      .from("games")
      .update({ [field]: !currentStatus })
      .eq("id", id);
    fetchGames();
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-orbitron font-bold text-white">
          KATEGORI LAYANAN
        </h2>
        <button
          onClick={() => handleOpenModal()}
          className="px-4 py-2 bg-[#7367F0] hover:bg-[#5E50EE] text-white rounded-lg text-sm font-bold flex items-center gap-2"
        >
          <Plus className="w-4 h-4" /> Tambah Kategori Layanan
        </button>
      </div>

      {/* Tabel Kategori Layanan */}
      <div className="bg-[#1C2237] rounded-xl border border-white/10 overflow-hidden">
        <table className="w-full text-left text-white text-sm">
          <thead className="bg-white/5 border-b border-white/10 font-orbitron text-xs">
            <tr>
              <th className="p-4">ID</th>
              <th className="p-4">NAMA</th>
              <th className="p-4">KATEGORI</th>
              <th className="p-4 text-center">ZONE ID</th>
              <th className="p-4 text-center">STATUS</th>
              <th className="p-4 text-center">AKSI</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={5} className="text-center p-8">
                  <Loader2 className="animate-spin mx-auto text-[#7367F0]" />
                </td>
              </tr>
            ) : (
              games.map((g, idx) => (
                <tr
                  key={g.id}
                  className="border-b border-white/5 hover:bg-white/5"
                >
                  <td className="p-4 text-white/50">{idx + 1}</td>
                  <td className="p-4 font-bold uppercase">{g.name}</td>
                  <td className="p-4 text-xs text-white/70">{g.category || "Top Up Games"}</td>
                  <td className="p-4 text-center">
                    <button
                      onClick={() =>
                        toggleStatus(g.id, g.has_zone_id, "has_zone_id")
                      }
                      className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors ${g.has_zone_id ? "bg-[#7367F0]" : "bg-gray-600"}`}
                    >
                      <span
                        className={`inline-block h-3 w-3 transform rounded-full bg-white transition-transform ${g.has_zone_id ? "translate-x-5" : "translate-x-1"}`}
                      />
                    </button>
                  </td>
                  <td className="p-4 text-center">
                    <button
                      onClick={() => toggleStatus(g.id, g.status, "status")}
                      className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors ${g.status ? "bg-[#7367F0]" : "bg-gray-600"}`}
                    >
                      <span
                        className={`inline-block h-3 w-3 transform rounded-full bg-white transition-transform ${g.status ? "translate-x-5" : "translate-x-1"}`}
                      />
                    </button>
                  </td>
                  <td className="p-4 flex justify-center gap-2">
                    <button
                      onClick={() => handleOpenModal(g)}
                      className="p-1.5 bg-amber-500/20 text-amber-400 hover:bg-amber-500 hover:text-white rounded"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    <button className="p-1.5 bg-red-500/20 text-red-400 hover:bg-red-500 hover:text-white rounded">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Modal Edit Kategori Lengkap */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
          <div className="bg-[#1C2237] w-full max-w-2xl rounded-xl border border-white/10 flex flex-col max-h-[90vh]">
            <div className="flex justify-between items-center p-4 border-b border-white/10 bg-[#7367F0] rounded-t-xl">
              <h3 className="font-bold text-white flex items-center gap-2">
                <Settings className="w-4 h-4" />{" "}
                {editingId
                  ? `Edit #${editingId.split("-")[0]}`
                  : "Tambah Kategori"}
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-white hover:text-gray-200"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 overflow-y-auto space-y-6">
              <div>
                <label className="text-xs text-white/70 mb-1 block">Nama</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  className="w-full bg-[#111526] border border-white/10 rounded-lg p-2.5 text-sm text-white"
                />
              </div>
              <div>
                <label className="text-xs text-white/70 mb-1 block">
                  Slug (URL)
                </label>
                <input
                  type="text"
                  value={formData.slug}
                  onChange={(e) =>
                    setFormData({ ...formData, slug: e.target.value })
                  }
                  className="w-full bg-[#111526] border border-white/10 rounded-lg p-2.5 text-sm text-white"
                />
              </div>

              <div>
                <label className="text-xs text-white/70 mb-1 block">Kategori</label>
                <select
                  value={formData.category_id || ""}
                  onChange={(e) => setFormData({ ...formData, category_id: e.target.value, category: categories.find(c => c.id === e.target.value)?.name || "" })}
                  className="w-full bg-[#111526] border border-white/10 rounded-lg p-2.5 text-sm text-white focus:outline-none"
                >
                  <option value="">-- Pilih Kategori --</option>
                  {categories.map((cat) => (
                    <option key={cat.id} value={cat.id}>{cat.name}</option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs text-white/70 mb-1 block">
                    URL Gambar Utama
                  </label>
                  <input
                    type="text"
                    value={formData.thumbnail_url}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        thumbnail_url: e.target.value,
                      })
                    }
                    className="w-full bg-[#111526] border border-white/10 rounded-lg p-2.5 text-sm text-white mb-2"
                  />
                  {formData.thumbnail_url && (
                    <img
                      src={formData.thumbnail_url}
                      className="h-24 object-cover rounded-lg border border-white/10"
                      alt="Preview"
                    />
                  )}
                </div>
                <div>
                  <label className="text-xs text-white/70 mb-1 block">
                    URL Gambar Petunjuk
                  </label>
                  <input
                    type="text"
                    value={formData.guide_image_url}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        guide_image_url: e.target.value,
                      })
                    }
                    className="w-full bg-[#111526] border border-white/10 rounded-lg p-2.5 text-sm text-white mb-2"
                  />
                  {formData.guide_image_url && (
                    <img
                      src={formData.guide_image_url}
                      className="h-24 object-cover rounded-lg border border-white/10"
                      alt="Guide Preview"
                    />
                  )}
                </div>
              </div>

              <div className="border-t border-white/10 pt-4">
                <h4 className="text-sm font-bold text-[#7367F0] mb-4">
                  Setting Form
                </h4>

                <div className="mb-4">
                  <label className="text-xs text-white/70 mb-1 block">
                    Kode Validasi Nickname
                  </label>
                  <input
                    type="text"
                    value={formData.validation_code}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        validation_code: e.target.value,
                      })
                    }
                    placeholder="ex: mobile-legends"
                    className="w-full bg-[#111526] border border-white/10 rounded-lg p-2.5 text-sm text-white"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="text-xs text-white/70 mb-1 block">
                      Placeholder Data / User ID
                    </label>
                    <input
                      type="text"
                      value={formData.placeholder_user_id}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          placeholder_user_id: e.target.value,
                        })
                      }
                      className="w-full bg-[#111526] border border-white/10 rounded-lg p-2.5 text-sm text-white"
                    />
                  </div>
                  <div>
                    <label className="text-xs text-white/70 mb-1 block flex justify-between">
                      <span>Placeholder Additional Data / Zone ID</span>
                      <label className="flex items-center gap-1 text-[10px]">
                        Aktifkan?{" "}
                        <input
                          type="checkbox"
                          checked={formData.has_zone_id}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              has_zone_id: e.target.checked,
                            })
                          }
                          className="accent-[#7367F0]"
                        />
                      </label>
                    </label>
                    <input
                      type="text"
                      disabled={!formData.has_zone_id}
                      value={formData.placeholder_zone_id}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          placeholder_zone_id: e.target.value,
                        })
                      }
                      className="w-full bg-[#111526] border border-white/10 rounded-lg p-2.5 text-sm text-white disabled:opacity-50"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs text-white/70 mb-1 block">
                    Server List Additional Data{" "}
                    <span className="text-red-400 text-[10px]">
                      *Kosongkan jika tidak butuh
                    </span>
                  </label>
                  <textarea
                    value={formData.server_list}
                    onChange={(e) =>
                      setFormData({ ...formData, server_list: e.target.value })
                    }
                    placeholder="ex: asia|Asia,euro|Europa"
                    className="w-full bg-[#111526] border border-white/10 rounded-lg p-2.5 text-sm text-white h-20"
                  ></textarea>
                </div>
              </div>
            </div>

            <div className="p-4 border-t border-white/10 flex justify-end gap-3 bg-[#111526] rounded-b-xl">
              <button
                onClick={() => setIsModalOpen(false)}
                className="px-4 py-2 text-sm text-white/70 hover:text-white"
              >
                Tutup
              </button>
              <button
                onClick={handleSave}
                className="px-4 py-2 bg-[#7367F0] hover:bg-[#5E50EE] text-white rounded-lg text-sm font-bold"
              >
                Simpan Data
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
