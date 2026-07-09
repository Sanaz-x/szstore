// src/sections/GameCatalog.tsx
// ============================================================
// SZSTORE — GameCatalog dengan Kategori Dinamis + Skeleton + AJAX
// ============================================================
import { useEffect, useState, useRef } from "react";
import { Link } from "react-router-dom";
import { Loader2, Flame, Tag } from "lucide-react";
import { supabase } from "../lib/supabase";

// ---- Skeleton Card ----
function SkeletonCard() {
  return (
    <div className="bg-[#121626] rounded-2xl overflow-hidden border border-white/5 animate-pulse">
      <div className="p-2 h-48 sm:h-56">
        <div className="w-full h-full rounded-xl bg-white/10 skeleton-shimmer" />
      </div>
      <div className="px-4 pb-4 space-y-2">
        <div className="h-3 bg-white/10 rounded-full skeleton-shimmer" />
        <div className="h-2 w-2/3 bg-white/5 rounded-full skeleton-shimmer mx-auto" />
      </div>
    </div>
  );
}

function SkeletonPopular() {
  return (
    <div className="bg-[#242A4A]/80 rounded-xl overflow-hidden flex items-center border border-white/5 animate-pulse">
      <div className="w-24 h-24 p-2 shrink-0">
        <div className="w-full h-full rounded-lg bg-white/10 skeleton-shimmer" />
      </div>
      <div className="p-3 flex-1 space-y-2">
        <div className="h-3 bg-white/10 rounded-full w-3/4 skeleton-shimmer" />
        <div className="h-2 bg-white/5 rounded-full w-1/2 skeleton-shimmer" />
      </div>
    </div>
  );
}

export default function GameCatalog() {
  const [games, setGames] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [loadingGames, setLoadingGames] = useState(true);
  const [loadingCats, setLoadingCats] = useState(true);
  const [activeCategoryId, setActiveCategoryId] = useState<string | null>(null);
  const [filtering, setFiltering] = useState(false);
  const catalogRef = useRef<HTMLDivElement>(null);

  const popularSlugs = [
    "mobile-legends",
    "free-fire",
    "genshin-impact",
    "pubg-mobile",
    "valorant",
  ];

  // Fetch categories
  useEffect(() => {
    async function fetchCategories() {
      setLoadingCats(true);
      const { data } = await supabase
        .from("categories")
        .select("*")
        .eq("is_active", true)
        .order("sort_order", { ascending: true });
      setCategories(data || []);
      // Set first category as default
      if (data && data.length > 0) {
        setActiveCategoryId(data[0].id);
      }
      setLoadingCats(false);
    }
    fetchCategories();
  }, []);

  // Fetch all games once
  useEffect(() => {
    async function fetchGames() {
      setLoadingGames(true);
      const { data, error } = await supabase
        .from("games")
        .select("*, categories(id, name, slug)")
        .eq("status", true)
        .order("created_at", { ascending: false });
      
      if (error) {
        console.warn("Categories relation not found, falling back to basic game fetch. Please run SQL migration.", error);
        // Fallback jika belum jalankan SQL migration
        const fallback = await supabase
          .from("games")
          .select("*")
          .eq("status", true)
          .order("created_at", { ascending: false });
        setGames(fallback.data || []);
      } else {
        setGames(data || []);
      }
      setLoadingGames(false);
    }
    fetchGames();
  }, []);

  // Filter on category change (smooth)
  const handleCategoryChange = (catId: string | null) => {
    if (catId === activeCategoryId) return;
    setFiltering(true);
    setTimeout(() => {
      setActiveCategoryId(catId);
      setFiltering(false);
    }, 200);
  };

  const popularGames = games.filter((g) => popularSlugs.includes(g.slug));

  const filteredGames =
    activeCategoryId === null
      ? games
      : games.filter((g) => g.category_id === activeCategoryId || g.categories?.id === activeCategoryId);

  const loading = loadingGames;

  return (
    <div className="w-full">
      {/* ── SECTION POPULER ── */}
      <div className="bg-gradient-to-br from-[#1D3B8E]/80 to-[#12245a]/60 rounded-2xl p-6 mb-8 border border-blue-500/20 backdrop-blur-sm">
        <div className="mb-4">
          <h2 className="text-xl font-bold font-orbitron uppercase flex items-center gap-2 text-white">
            <Flame className="w-6 h-6 text-orange-400 animate-pulse-dot" />
            POPULER!
          </h2>
          <p className="text-sm text-white/60 mt-1 font-rajdhani">
            Produk yang paling sering dibeli.
          </p>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[...Array(3)].map((_, i) => (
              <SkeletonPopular key={i} />
            ))}
          </div>
        ) : popularGames.length === 0 ? (
          <p className="text-white/40 text-sm text-center py-6">
            Belum ada game populer.
          </p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {popularGames.map((game) => (
              <Link
                key={game.id}
                to={`/topup/${game.slug}`}
                className="bg-[#242A4A]/80 hover:bg-[#2C335A] rounded-xl overflow-hidden flex items-center border border-white/5 hover:border-[#FF007F]/30 transition-all group"
              >
                <div className="w-24 h-24 p-2 shrink-0">
                  <img
                    src={game.thumbnail_url}
                    alt={game.name}
                    className="w-full h-full object-cover rounded-lg group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <div className="p-3">
                  <h3 className="text-sm font-bold font-orbitron text-white uppercase line-clamp-1">
                    {game.name}
                  </h3>
                  <p className="text-xs text-white/50 font-rajdhani mt-0.5">
                    {game.categories?.name || game.category || "Game Populer"}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>

      {/* ── FILTER KATEGORI ── */}
      <div className="flex flex-wrap items-center gap-2 mb-6">
        {loadingCats ? (
          // Skeleton for category buttons
          <>
            {[...Array(5)].map((_, i) => (
              <div
                key={i}
                className="h-9 w-28 rounded-full bg-white/10 skeleton-shimmer animate-pulse"
              />
            ))}
          </>
        ) : (
          <>
            {/* "Semua" button */}
            <button
              onClick={() => handleCategoryChange(null)}
              className={`px-4 py-2 rounded-full text-xs font-semibold font-orbitron transition-all border ${
                activeCategoryId === null
                  ? "bg-gradient-to-r from-[#FF007F] to-purple-600 text-white border-transparent shadow-[0_0_15px_rgba(255,0,127,0.4)]"
                  : "bg-transparent text-white/60 border-white/20 hover:border-[#FF007F]/50 hover:text-white"
              }`}
            >
              Semua
            </button>
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => handleCategoryChange(cat.id)}
                className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-semibold font-orbitron transition-all border ${
                  activeCategoryId === cat.id
                    ? "bg-gradient-to-r from-[#FF007F] to-purple-600 text-white border-transparent shadow-[0_0_15px_rgba(255,0,127,0.4)]"
                    : "bg-transparent text-white/60 border-white/20 hover:border-[#FF007F]/50 hover:text-white"
                }`}
              >
                {cat.icon_url && (
                  <img
                    src={cat.icon_url}
                    alt=""
                    className="w-4 h-4 object-cover rounded"
                  />
                )}
                {cat.name}
              </button>
            ))}
          </>
        )}
      </div>

      {/* ── DAFTAR GAME ── */}
      <div
        ref={catalogRef}
        className={`transition-all duration-200 ${
          filtering ? "opacity-0 scale-[0.98]" : "opacity-100 scale-100"
        }`}
      >
        {loading ? (
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4 lg:gap-6">
            {[...Array(10)].map((_, i) => (
              <SkeletonCard key={i} />
            ))}
          </div>
        ) : filteredGames.length === 0 ? (
          <div className="text-center py-20 border border-white/5 rounded-2xl bg-white/[0.02]">
            <Tag className="w-10 h-10 text-white/20 mx-auto mb-3" />
            <p className="text-white/40 text-sm">
              Belum ada produk di kategori ini.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4 lg:gap-6">
            {filteredGames.map((game) => (
              <Link
                key={game.id}
                to={`/topup/${game.slug}`}
                className="bg-[#121626] rounded-2xl overflow-hidden flex flex-col border border-white/5 hover:border-[#FF007F]/50 transition-all duration-300 group shadow-lg hover:shadow-[0_8px_25px_rgba(255,0,127,0.15)]"
              >
                {/* Thumbnail */}
                <div className="relative p-2 h-48 sm:h-56">
                  <div className="w-full h-full rounded-xl overflow-hidden relative">
                    {game.thumbnail_url ? (
                      <img
                        src={game.thumbnail_url}
                        alt={game.name}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                    ) : (
                      <div className="w-full h-full bg-[#1C2333] flex items-center justify-center text-white/20 text-xs">
                        NO IMAGE
                      </div>
                    )}
                    {/* Gradient overlay */}
                    <div className="absolute bottom-0 left-0 right-0 h-1/2 bg-gradient-to-t from-[#121626] to-transparent pointer-events-none" />
                    {/* Hover neon glow overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-[#FF007F]/0 group-hover:from-[#FF007F]/10 to-transparent transition-all duration-300 pointer-events-none" />
                  </div>
                </div>

                {/* Info */}
                <div className="px-3 pb-4 flex flex-col flex-1 relative z-10 -mt-2">
                  <h3 className="text-xs font-bold font-orbitron text-white uppercase truncate text-center group-hover:text-[#FF007F] transition-colors duration-300">
                    {game.name}
                  </h3>
                  {game.categories?.name && (
                    <p className="text-[10px] text-white/30 text-center mt-0.5 font-rajdhani">
                      {game.categories.name}
                    </p>
                  )}
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
