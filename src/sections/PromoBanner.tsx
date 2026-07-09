import { useState, useEffect } from "react";
import { supabase } from "../lib/supabase";

export default function PromoBanner() {
  const [banners, setBanners] = useState<any[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    async function fetchBanners() {
      const { data } = await supabase
        .from("promos")
        .select("*")
        .eq("status", true)
        .order("created_at", { ascending: false });

      if (data && data.length > 0) {
        setBanners(data);
      }
    }
    fetchBanners();
  }, []);

  useEffect(() => {
    if (banners.length <= 1) return;
    const timer = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % banners.length);
    }, 4500);
    return () => clearInterval(timer);
  }, [banners.length]);

  if (banners.length === 0) return null;

  return (
    <div className="w-full bg-[#1c0a30] py-4 md:py-6">
      <div className="max-w-5xl mx-auto px-4">
        {/* Kunci Tinggi & Rasio Gambar (Mencegah Bug Scroll Melompat ke Atas) */}
        <div className="relative w-full aspect-[16/8] sm:aspect-[21/9] bg-[#26123a] rounded-xl overflow-hidden shadow-2xl border border-white/5">
          {banners.map((banner, index) => (
            <div
              key={banner.id}
              className={`absolute inset-0 w-full h-full transition-opacity duration-700 ease-in-out ${
                index === currentIndex
                  ? "opacity-100 z-10"
                  : "opacity-0 z-0 pointer-events-none"
              }`}
            >
              <img
                src={banner.banner_url}
                alt={banner.title}
                className="w-full h-full object-cover object-center"
              />
            </div>
          ))}
        </div>

        {/* Titik Navigasi */}
        {banners.length > 1 && (
          <div className="flex justify-center items-center gap-2.5 mt-4">
            {banners.map((_, index) => (
              <button
                key={index}
                type="button"
                onClick={() => setCurrentIndex(index)}
                className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${
                  index === currentIndex
                    ? "bg-[#00E5FF] scale-110 shadow-[0_0_8px_#00E5FF]"
                    : "bg-white/30 hover:bg-white/60"
                }`}
                aria-label={`Lihat banner ${index + 1}`}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
