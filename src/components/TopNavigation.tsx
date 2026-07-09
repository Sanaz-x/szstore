import { useState, useEffect, useRef } from "react";
import { Link, useLocation } from "react-router-dom";
import { Search, Menu, X, User, LogOut, ChevronDown, TrendingUp, Gem, Stars, Trophy, List } from "lucide-react";
import { useAuth } from "../contexts/AuthContext";
import { supabase } from "../lib/supabase";
import SearchModal from "./SearchModal";

const calcSubItems = [
  {
    label: "Win Rate",
    href: "/kalkulator/winrate",
    icon: TrendingUp,
    desc: "Hitung jumlah match untuk target win rate",
  },
  {
    label: "Magic Wheel",
    href: "/kalkulator/magic-wheel",
    icon: Gem,
    desc: "Total diamond untuk skin Legends",
  },
  {
    label: "Zodiac",
    href: "/kalkulator/zodiac",
    icon: Stars,
    desc: "Total diamond untuk skin Zodiac",
  },
];

export default function TopNavigation() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isCalcOpen, setIsCalcOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const location = useLocation();
  const { user, isAuthenticated } = useAuth();
  const calcRef = useRef<HTMLDivElement>(null);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    window.location.reload();
  };

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close calc dropdown when clicking outside
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (calcRef.current && !calcRef.current.contains(e.target as Node)) {
        setIsCalcOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  // Close mobile menu when route changes
  useEffect(() => {
    setIsMobileMenuOpen(false);
    setIsCalcOpen(false);
  }, [location.pathname]);

  const mainLinks = [
    { label: "Beranda", href: "/" },
    { label: "Cek Transaksi", href: "/cek-transaksi" },
    { label: "Daftar Harga", href: "/daftar-harga", icon: List },
    { label: "Leaderboard", href: "/leaderboard", icon: Trophy },
  ];

  const isCalcActive = location.pathname.startsWith("/kalkulator");

  return (
    <>
      <SearchModal isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />

      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          isScrolled
            ? "bg-[#050816]/90 backdrop-blur-md border-b border-white/10 shadow-lg"
            : "bg-transparent"
        }`}
      >
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="flex items-center justify-between h-[80px]">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-2 shrink-0">
              <img
                src="/assets/sztopup-logo.jpg"
                alt="SZTopup"
                className="h-10 w-auto rounded"
                style={{ filter: "drop-shadow(0 0 8px rgba(159, 211, 232, 0.4))" }}
              />
              <span className="font-orbitron font-bold text-xl tracking-wider text-white hidden sm:block">
                SZ<span className="text-[#00E5FF]">STORE</span>
              </span>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center gap-6">
              {mainLinks.map((link) => (
                <Link
                  key={link.label}
                  to={link.href}
                  className={`font-rajdhani font-semibold text-sm uppercase tracking-wider transition-colors hover:text-[#00E5FF] ${
                    location.pathname === link.href ? "text-[#00E5FF]" : "text-white/70"
                  }`}
                >
                  {link.label}
                </Link>
              ))}

              {/* Kalkulator Dropdown */}
              <div ref={calcRef} className="relative">
                <button
                  onClick={() => setIsCalcOpen(!isCalcOpen)}
                  className={`flex items-center gap-1.5 font-rajdhani font-semibold text-sm uppercase tracking-wider transition-colors hover:text-[#00E5FF] ${
                    isCalcActive ? "text-[#00E5FF]" : "text-white/70"
                  }`}
                >
                  Kalkulator
                  <ChevronDown
                    className={`w-4 h-4 transition-transform duration-200 ${isCalcOpen ? "rotate-180" : ""}`}
                  />
                </button>

                {isCalcOpen && (
                  <div className="absolute top-full left-1/2 -translate-x-1/2 mt-3 w-72 bg-[#0d0420] border border-white/10 rounded-2xl shadow-2xl shadow-black/40 overflow-hidden z-50">
                    <div className="p-2">
                      {calcSubItems.map((item) => {
                        const Icon = item.icon;
                        return (
                          <Link
                            key={item.href}
                            to={item.href}
                            className="flex items-start gap-3 px-3 py-3 rounded-xl hover:bg-white/5 transition-colors group"
                          >
                            <div className="w-9 h-9 rounded-lg bg-[#00E5FF]/10 flex items-center justify-center shrink-0 group-hover:bg-[#00E5FF]/20 transition-colors">
                              <Icon className="w-4 h-4 text-[#00E5FF]" />
                            </div>
                            <div>
                              <p className="font-orbitron font-bold text-xs text-white group-hover:text-[#00E5FF] transition-colors">
                                {item.label}
                              </p>
                              <p className="text-[11px] text-white/40 mt-0.5 font-rajdhani">{item.desc}</p>
                            </div>
                          </Link>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            </nav>

            {/* Right Actions */}
            <div className="flex items-center gap-3">
              {/* Search Button */}
              <button
                onClick={() => setIsSearchOpen(true)}
                className="flex items-center gap-2 px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-white/50 hover:text-[#00E5FF] hover:border-[#00E5FF]/30 transition-all"
                title="Cari produk"
              >
                <Search className="w-4 h-4" />
                <span className="hidden lg:block text-xs font-rajdhani">Cari...</span>
              </button>

              {isAuthenticated ? (
                <div className="flex items-center gap-2">
                  <Link
                    to="/profil"
                    className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[#1c0a30] border border-white/10 hover:border-[#00E5FF]/40 transition-all"
                  >
                    <User className="w-4 h-4 text-[#00E5FF]" />
                    <span className="text-xs font-orbitron text-white/80 max-w-[80px] truncate">
                      {user?.email?.split("@")[0]}
                    </span>
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="flex items-center gap-2 px-3 py-2 rounded-lg bg-[#FF007F]/10 border border-[#FF007F]/30 hover:bg-[#FF007F] hover:text-white transition-all text-sm font-orbitron font-bold text-[#FF007F]"
                    title="Keluar"
                  >
                    <LogOut className="w-4 h-4" />
                    <span className="hidden sm:block text-xs">Keluar</span>
                  </button>
                </div>
              ) : (
                <Link
                  to="/login"
                  className="flex items-center gap-2 px-4 py-2 rounded-lg bg-[#1c0a30] border border-white/10 hover:border-[#FF007F]/50 transition-all text-sm font-orbitron font-bold text-white group"
                >
                  <User className="w-4 h-4 text-[#FF007F] group-hover:animate-pulse" />
                  <span className="hidden sm:block">Masuk</span>
                </Link>
              )}

              {/* Mobile Menu Button */}
              <button
                className="md:hidden text-white/70 hover:text-white"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              >
                {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>

          {/* Mobile Navigation */}
          {isMobileMenuOpen && (
            <div className="md:hidden absolute top-[80px] left-0 right-0 bg-[#050816] border-b border-white/10 p-4 shadow-xl">
              <nav className="flex flex-col gap-1">
                {mainLinks.map((link) => (
                  <Link
                    key={link.label}
                    to={link.href}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={`font-rajdhani font-semibold text-sm uppercase tracking-wider py-3 px-3 rounded-lg transition-colors hover:bg-white/5 hover:text-[#00E5FF] ${
                      location.pathname === link.href ? "text-[#00E5FF] bg-white/5" : "text-white/70"
                    }`}
                  >
                    {link.label}
                  </Link>
                ))}

                {/* Mobile Kalkulator Sub-menu */}
                <div>
                  <p className="text-[10px] font-orbitron uppercase tracking-wider text-white/30 px-3 pt-3 pb-2">Kalkulator</p>
                  {calcSubItems.map((item) => {
                    const Icon = item.icon;
                    return (
                      <Link
                        key={item.href}
                        to={item.href}
                        onClick={() => setIsMobileMenuOpen(false)}
                        className={`flex items-center gap-3 py-2.5 px-3 rounded-lg transition-colors hover:bg-white/5 hover:text-[#00E5FF] ${
                          location.pathname === item.href ? "text-[#00E5FF]" : "text-white/60"
                        }`}
                      >
                        <Icon className="w-4 h-4" />
                        <span className="font-rajdhani font-semibold text-sm">{item.label}</span>
                      </Link>
                    );
                  })}
                </div>
              </nav>
            </div>
          )}
        </div>
      </header>
    </>
  );
}
