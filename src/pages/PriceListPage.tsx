import { useState, useEffect } from "react";
import { List, Search, ChevronDown, ChevronRight, Tag, Loader2 } from "lucide-react";
import { supabase } from "../lib/supabase";
import TopNavigation from "../components/TopNavigation";
import Footer from "../components/Footer";

export default function PriceListPage() {
  const [games, setGames] = useState<any[]>([]);
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [openGame, setOpenGame] = useState<string | null>(null);
  const [search, setSearch] = useState("");

  useEffect(() => {
    async function fetchData() {
      const [{ data: gData }, { data: pData }] = await Promise.all([
        supabase.from("games").select("id, name, thumbnail_url, category").order("name"),
        supabase
          .from("products")
          .select("id, name, sell_price, original_price, game_id, sku_code")
          .eq("status", true)
          .order("sell_price"),
      ]);
      setGames(gData || []);
      setProducts(pData || []);
      setLoading(false);
    }
    fetchData();
  }, []);

  const filteredGames = games.filter((g) =>
    g.name.toLowerCase().includes(search.toLowerCase())
  );

  const getProductsForGame = (gameId: string) =>
    products.filter((p) => p.game_id === gameId);

  return (
    <div className="min-h-screen bg-[#1c0a30] text-white font-rajdhani">
      <TopNavigation />
      <div className="pt-[80px]" />

      {/* Hero */}
      <div className="relative overflow-hidden bg-gradient-to-b from-[#2d0a4a] to-[#1c0a30] py-14">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-[#FF007F]/10 rounded-full blur-3xl" />
          <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-[#00E5FF]/10 rounded-full blur-3xl" />
        </div>
        <div className="relative max-w-5xl mx-auto px-4 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-[#FF007F]/30 bg-[#FF007F]/10 mb-4">
            <List className="w-4 h-4 text-[#FF007F]" />
            <span className="text-[#FF007F] text-xs font-orbitron uppercase tracking-widest">Daftar Harga</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-orbitron font-black text-white mb-3">
            Transparansi <span className="text-[#00E5FF]">Harga Terbaik</span>
          </h1>
          <p className="text-white/50 font-rajdhani max-w-lg mx-auto">
            Lihat semua harga item di SZStore. Harga murah, proses instan, dan aman!
          </p>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-5xl mx-auto px-4 py-10">
        {/* Search */}
        <div className="relative mb-8">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/30" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Cari nama game..."
            className="w-full pl-12 pr-4 py-3.5 rounded-xl bg-[#120520] border border-white/10 text-white font-rajdhani placeholder-white/30 focus:outline-none focus:border-[#00E5FF]/50 transition-colors"
          />
        </div>

        {loading ? (
          <div className="flex justify-center py-20">
            <Loader2 className="animate-spin w-10 h-10 text-[#00E5FF]" />
          </div>
        ) : filteredGames.length === 0 ? (
          <div className="text-center py-20 text-white/30">Tidak ada game ditemukan.</div>
        ) : (
          <div className="space-y-3">
            {filteredGames.map((game) => {
              const gameProducts = getProductsForGame(game.id);
              const isOpen = openGame === game.id;

              return (
                <div
                  key={game.id}
                  className="rounded-2xl border border-white/10 overflow-hidden bg-[#120520]/60"
                >
                  {/* Game Header */}
                  <button
                    onClick={() => setOpenGame(isOpen ? null : game.id)}
                    className="w-full flex items-center gap-4 p-4 hover:bg-white/5 transition-colors"
                  >
                    {game.thumbnail_url ? (
                      <img
                        src={game.thumbnail_url}
                        alt={game.name}
                        className="w-12 h-12 rounded-xl object-cover"
                      />
                    ) : (
                      <div className="w-12 h-12 rounded-xl bg-[#FF007F]/20 flex items-center justify-center">
                        <Tag className="w-5 h-5 text-[#FF007F]" />
                      </div>
                    )}
                    <div className="flex-1 text-left">
                      <p className="font-orbitron font-bold text-white text-sm">{game.name}</p>
                      <p className="text-[10px] text-white/40 mt-0.5">
                        {gameProducts.length} item tersedia
                      </p>
                    </div>
                    {isOpen ? (
                      <ChevronDown className="w-5 h-5 text-[#00E5FF]" />
                    ) : (
                      <ChevronRight className="w-5 h-5 text-white/30" />
                    )}
                  </button>

                  {/* Products Table */}
                  {isOpen && (
                    <div className="border-t border-white/10">
                      {gameProducts.length === 0 ? (
                        <p className="text-center py-6 text-white/30 text-sm">
                          Belum ada produk untuk game ini.
                        </p>
                      ) : (
                        <table className="w-full text-sm">
                          <thead>
                            <tr className="bg-white/5 text-[10px] font-orbitron uppercase text-white/30">
                              <th className="text-left px-4 py-2.5">Item</th>
                              <th className="text-left px-4 py-2.5 hidden sm:table-cell">SKU</th>
                              <th className="text-right px-4 py-2.5">Harga Asli</th>
                              <th className="text-right px-4 py-2.5">Harga Jual</th>
                            </tr>
                          </thead>
                          <tbody>
                            {gameProducts.map((p, idx) => (
                              <tr
                                key={p.id}
                                className={`border-t border-white/5 ${idx % 2 === 0 ? "" : "bg-white/[0.02]"}`}
                              >
                                <td className="px-4 py-3 font-semibold text-white">{p.name}</td>
                                <td className="px-4 py-3 text-white/30 font-mono text-xs hidden sm:table-cell">
                                  {p.sku_code || "—"}
                                </td>
                                <td className="px-4 py-3 text-right text-white/50">
                                  Rp {p.original_price?.toLocaleString("id-ID")}
                                </td>
                                <td className="px-4 py-3 text-right font-bold text-[#FFD740]">
                                  Rp {p.sell_price?.toLocaleString("id-ID")}
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
}
