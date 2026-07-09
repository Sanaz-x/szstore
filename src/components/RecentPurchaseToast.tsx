import { useState, useEffect } from "react";
import { ShoppingBag, X } from "lucide-react";

// Data dummy untuk simulasi pembelian
const DUMMY_NAMES = ["0812***", "0857***", "0821***", "0896***", "0852***", "0819***", "Sandi***", "Budi***", "Alok***", "Fahri***"];
const DUMMY_GAMES = ["Mobile Legends", "Free Fire", "PUBG Mobile", "Valorant", "Genshin Impact"];
const DUMMY_ITEMS: Record<string, string[]> = {
  "Mobile Legends": ["86 Diamonds", "172 Diamonds", "257 Diamonds", "706 Diamonds", "Weekly Diamond Pass"],
  "Free Fire": ["70 Diamonds", "140 Diamonds", "355 Diamonds", "720 Diamonds", "Membership Mingguan"],
  "PUBG Mobile": ["60 UC", "325 UC", "660 UC"],
  "Valorant": ["420 VP", "700 VP", "1375 VP"],
  "Genshin Impact": ["60 Genesis Crystals", "Blessing of the Welkin Moon"]
};

export default function RecentPurchaseToast() {
  const [show, setShow] = useState(false);
  const [data, setData] = useState({ name: "", game: "", item: "", timeAgo: "" });

  useEffect(() => {
    // Fungsi untuk memunculkan toast acak
    const triggerToast = () => {
      const game = DUMMY_GAMES[Math.floor(Math.random() * DUMMY_GAMES.length)];
      const items = DUMMY_ITEMS[game];
      const item = items[Math.floor(Math.random() * items.length)];
      const name = DUMMY_NAMES[Math.floor(Math.random() * DUMMY_NAMES.length)];
      const timeAgo = `${Math.floor(Math.random() * 59) + 1} detik yang lalu`;

      setData({ name, game, item, timeAgo });
      setShow(true);

      // Sembunyikan setelah 5 detik
      setTimeout(() => {
        setShow(false);
      }, 5000);
    };

    // Trigger pertama kali setelah 3 detik
    const initialTimer = setTimeout(triggerToast, 3000);

    // Trigger berulang setiap 10-25 detik secara acak
    const interval = setInterval(() => {
      if (!show) {
        setTimeout(triggerToast, Math.random() * 15000 + 10000);
      }
    }, 20000);

    return () => {
      clearTimeout(initialTimer);
      clearInterval(interval);
    };
  }, [show]);

  if (!show) return null;

  return (
    <div className="fixed bottom-4 left-4 z-50 animate-in slide-in-from-bottom-5 fade-in duration-500">
      <div className="bg-[#120224]/95 backdrop-blur-md border border-[#00E5FF]/30 p-3 rounded-2xl shadow-[0_0_20px_rgba(0,229,255,0.15)] flex items-start gap-3 max-w-xs relative group">
        <button 
          onClick={() => setShow(false)}
          className="absolute -top-2 -right-2 bg-[#FF007F] text-white rounded-full p-0.5 opacity-0 group-hover:opacity-100 transition-opacity"
        >
          <X className="w-3 h-3" />
        </button>
        
        <div className="bg-gradient-to-br from-[#00E5FF] to-blue-500 p-2 rounded-xl shrink-0 mt-0.5">
          <ShoppingBag className="w-4 h-4 text-[#0a0a1a]" />
        </div>
        
        <div>
          <p className="text-[10px] text-white/50 mb-0.5">{data.timeAgo}</p>
          <p className="text-xs text-white leading-tight">
            <span className="font-bold text-[#FFD740]">{data.name}</span> baru saja membeli <span className="font-bold text-[#00E5FF]">{data.item}</span> di <span className="font-bold text-white">{data.game}</span>
          </p>
        </div>
      </div>
    </div>
  );
}
