// src/pages/Home.tsx

import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import TopNavigation from "../components/TopNavigation";
import Footer from "../components/Footer";
import PromoMarquee from "../sections/PromoMarquee";
import PromoBanner from "../sections/PromoBanner";
import GameCatalog from "../sections/GameCatalog";
import Testimonials from "../sections/Testimonials";
import Statistics from "../sections/Statistics";
import FAQSection from "../sections/FAQSection";

export default function Home() {
  const { hash } = useLocation();

  useEffect(() => {
    if (hash) {
      const element = document.getElementById(hash.replace("#", ""));
      if (element) {
        setTimeout(() => {
          element.scrollIntoView({ behavior: "smooth" });
        }, 100);
      }
    } else {
      window.scrollTo(0, 0);
    }
  }, [hash]);
  return (
    <div className="min-h-screen bg-[#1c0a30] text-white overflow-x-hidden font-rajdhani">
      <TopNavigation />

      <div className="pt-[80px]"></div>

      <main className="container mx-auto px-4 max-w-6xl space-y-12">
        <PromoBanner />

        <PromoMarquee />

        <section id="games" className="w-full pb-12 pt-4">
          <GameCatalog />
        </section>

        <div className="bg-[#120224] p-6 rounded-2xl border border-white/5">
          <Testimonials />
          <Statistics />
          <section id="bantuan" className="pt-10">
            <FAQSection />
          </section>
        </div>
      </main>

      <Footer />
    </div>
  );
}
