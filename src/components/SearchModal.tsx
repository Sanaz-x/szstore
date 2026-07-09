import { useState, useEffect, useRef } from "react";
import { Search, X, Gamepad2, Package } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../lib/supabase";

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function SearchModal({ isOpen, onClose }: SearchModalProps) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<{ games: any[]; products: any[] }>({
    games: [],
    products: [],
  });
  const [loading, setLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
    } else {
      setQuery("");
      setResults({ games: [], products: [] });
    }
  }, [isOpen]);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [onClose]);

  useEffect(() => {
    if (!query.trim()) {
      setResults({ games: [], products: [] });
      return;
    }
    const timeout = setTimeout(async () => {
      setLoading(true);
      const [{ data: games }, { data: products }] = await Promise.all([
        supabase
          .from("games")
          .select("id, name, slug, thumbnail_url")
          .ilike("name", `%${query}%`)
          .limit(4),
        supabase
          .from("products")
          .select("id, name, sell_price, games(name, slug)")
          .ilike("name", `%${query}%`)
          .eq("status", true)
          .limit(5),
      ]);
      setResults({ games: games || [], products: products || [] });
      setLoading(false);
    }, 300);
    return () => clearTimeout(timeout);
  }, [query]);

  const handleGameClick = (slug: string) => {
    navigate(`/topup/${slug}`);
    onClose();
  };

  if (!isOpen) return null;

  const hasResults = results.games.length > 0 || results.products.length > 0;

  return (
    <div className="fixed inset-0 z-[100] flex items-start justify-center pt-20 px-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal Box */}
      <div className="relative w-full max-w-2xl bg-[#120520] border border-white/10 rounded-2xl shadow-2xl shadow-[#FF007F]/10 overflow-hidden animate-in fade-in slide-in-from-top-4 duration-200">
        {/* Search Input */}
        <div className="flex items-center gap-3 px-4 py-3 border-b border-white/10">
          <Search className="w-5 h-5 text-[#00E5FF] shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Cari Game, Item, Voucher..."
            className="flex-1 bg-transparent text-white placeholder-white/40 font-rajdhani text-base outline-none"
          />
          {loading && (
            <div className="w-4 h-4 border-2 border-white/20 border-t-[#00E5FF] rounded-full animate-spin" />
          )}
          <button
            onClick={onClose}
            className="text-white/40 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Results */}
        <div className="max-h-[60vh] overflow-y-auto">
          {!query && (
            <div className="flex flex-col items-center justify-center py-12 gap-3 text-white/30">
              <Search className="w-10 h-10" />
              <p className="font-rajdhani text-sm">Ketik untuk mencari produk...</p>
            </div>
          )}

          {query && !loading && !hasResults && (
            <div className="flex flex-col items-center justify-center py-12 gap-3 text-white/30">
              <Package className="w-10 h-10" />
              <p className="font-rajdhani text-sm">Tidak ada hasil ditemukan untuk "<span className="text-white/60">{query}</span>"</p>
            </div>
          )}

          {hasResults && (
            <div className="p-3 space-y-4">
              {results.games.length > 0 && (
                <div>
                  <p className="text-[10px] font-orbitron uppercase tracking-wider text-white/30 px-2 mb-2">Game</p>
                  <div className="space-y-1">
                    {results.games.map((g) => (
                      <button
                        key={g.id}
                        onClick={() => handleGameClick(g.slug)}
                        className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-white/5 transition-colors group text-left"
                      >
                        {g.thumbnail_url ? (
                          <img src={g.thumbnail_url} alt={g.name} className="w-9 h-9 rounded-lg object-cover" />
                        ) : (
                          <div className="w-9 h-9 rounded-lg bg-[#FF007F]/20 flex items-center justify-center">
                            <Gamepad2 className="w-4 h-4 text-[#FF007F]" />
                          </div>
                        )}
                        <span className="font-rajdhani font-semibold text-white group-hover:text-[#00E5FF] transition-colors">
                          {g.name}
                        </span>
                        <span className="ml-auto text-[10px] text-white/30 font-orbitron">GAME</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {results.products.length > 0 && (
                <div>
                  <p className="text-[10px] font-orbitron uppercase tracking-wider text-white/30 px-2 mb-2">Item / Produk</p>
                  <div className="space-y-1">
                    {results.products.map((p) => (
                      <button
                        key={p.id}
                        onClick={() => handleGameClick((p.games as any)?.slug || "")}
                        className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-white/5 transition-colors group text-left"
                      >
                        <div className="w-9 h-9 rounded-lg bg-[#00E5FF]/10 flex items-center justify-center shrink-0">
                          <Package className="w-4 h-4 text-[#00E5FF]" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-rajdhani font-semibold text-white group-hover:text-[#00E5FF] transition-colors truncate">
                            {p.name}
                          </p>
                          <p className="text-[10px] text-white/40">{(p.games as any)?.name || "—"}</p>
                        </div>
                        <span className="text-sm font-bold text-[#FFD740] font-rajdhani shrink-0">
                          Rp {p.sell_price?.toLocaleString("id-ID")}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer hint */}
        <div className="border-t border-white/5 px-4 py-2 flex items-center gap-4">
          <span className="text-[10px] text-white/20 font-rajdhani">ESC untuk menutup</span>
          <span className="text-[10px] text-white/20 font-rajdhani ml-auto">Tekan ↵ untuk memilih</span>
        </div>
      </div>
    </div>
  );
}
