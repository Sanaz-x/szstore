import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router"; // WAJIB react-router-dom
import { User, Lock, Eye, EyeOff } from "lucide-react";
import { supabase } from "../lib/supabase";
import gsap from "gsap";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showGranted, setShowGranted] = useState(false);
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (cardRef.current) {
      gsap.from(cardRef.current, {
        scale: 0.9,
        opacity: 0,
        duration: 0.6,
        ease: "power3.out",
      });
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsSubmitting(true);

    try {
      // 1. Eksekusi Login ke Supabase
      const { data, error } = await supabase.auth.signInWithPassword({
        email: email,
        password: password,
      });

      if (error) throw error;

      // 2. Proteksi Admin (Ganti email di bawah dengan email asli Anda yang terdaftar di Supabase)
      if (data.user?.email !== "admin@sztopup.com") {
        await supabase.auth.signOut();
        throw new Error("Akses Ditolak! Akun ini bukan administrator.");
      }

      // 3. Sukses
      setShowGranted(true);
      setTimeout(() => {
        navigate("/admin");
      }, 1500);
    } catch (err: any) {
      setError(err.message || "Email atau password salah");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#050816] flex items-center justify-center px-4 relative overflow-hidden">
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(159,211,232,1) 1px, transparent 1px), linear-gradient(90deg, rgba(159,211,232,1) 1px, transparent 1px)",
          backgroundSize: "50px 50px",
        }}
      />

      {showGranted && (
        <div className="absolute inset-0 z-50 flex items-center justify-center bg-[#050816]/80 animate-in fade-in duration-300">
          <div className="text-center animate-in zoom-in duration-500">
            <div className="w-16 h-16 rounded-full border-2 border-[#00E5FF] flex items-center justify-center mx-auto mb-4">
              <svg
                className="w-8 h-8 text-[#00E5FF]"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>
            <h2 className="text-2xl font-orbitron font-bold text-[#00E5FF] uppercase tracking-wider">
              ACCESS GRANTED
            </h2>
            <p className="text-sm font-rajdhani text-white/50 mt-2">
              Mengalihkan ke dashboard...
            </p>
          </div>
        </div>
      )}

      <div
        ref={cardRef}
        className="relative w-full max-w-[420px] card-surface rounded-3xl border border-[rgba(159,211,232,0.2)] p-8 lg:p-10"
        style={{ boxShadow: "0 0 60px rgba(159, 211, 232, 0.1)" }}
      >
        <div className="absolute top-3 left-3 w-5 h-5 border-t-2 border-l-2 border-[rgba(159,211,232,0.3)] rounded-tl" />
        <div className="absolute top-3 right-3 w-5 h-5 border-t-2 border-r-2 border-[rgba(159,211,232,0.3)] rounded-tr" />
        <div className="absolute bottom-3 left-3 w-5 h-5 border-b-2 border-l-2 border-[rgba(159,211,232,0.3)] rounded-bl" />
        <div className="absolute bottom-3 right-3 w-5 h-5 border-b-2 border-r-2 border-[rgba(159,211,232,0.3)] rounded-br" />

        <div className="text-center">
          <img
            src="/assets/sztopup-logo.jpg"
            alt="SZTopup"
            className="h-14 w-auto mx-auto"
            style={{ filter: "drop-shadow(0 0 12px rgba(159, 211, 232, 0.6))" }}
          />
          <h1 className="mt-6 text-xl font-orbitron font-bold uppercase tracking-[0.03em] text-gradient-cyan">
            ADMIN PORTAL
          </h1>
          <p className="mt-2 text-sm font-rajdhani text-white/50">
            Secure login area
          </p>
        </div>

        <form onSubmit={handleSubmit} className="mt-8 space-y-4">
          {error && (
            <div className="px-4 py-2.5 rounded-xl bg-[rgba(255,64,129,0.1)] border border-[rgba(255,64,129,0.3)] text-sm font-rajdhani text-[#FF4081] text-center">
              {error}
            </div>
          )}

          <div className="relative">
            <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[rgba(159,211,232,0.4)]" />
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Admin Email"
              className="w-full pl-11 pr-4 py-3.5 rounded-xl card-surface border border-[rgba(159,211,232,0.2)] text-white font-rajdhani text-sm placeholder:text-white/30 focus:border-[#9FD3E8] focus:shadow-neon-cyan focus:outline-none transition-all"
            />
          </div>

          <div className="relative">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[rgba(159,211,232,0.4)]" />
            <input
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              className="w-full pl-11 pr-11 py-3.5 rounded-xl card-surface border border-[rgba(159,211,232,0.2)] text-white font-rajdhani text-sm placeholder:text-white/30 focus:border-[#9FD3E8] focus:shadow-neon-cyan focus:outline-none transition-all"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-white/40 hover:text-white/60"
            >
              {showPassword ? (
                <EyeOff className="w-5 h-5" />
              ) : (
                <Eye className="w-5 h-5" />
              )}
            </button>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-3.5 rounded-xl text-[13px] font-orbitron font-semibold uppercase tracking-[0.06em] text-[#0A1020] transition-all duration-300 hover:shadow-neon-cyan hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
            style={{
              background: "linear-gradient(135deg, #9FD3E8, #BEEAF5, #00E5FF)",
            }}
          >
            {isSubmitting ? "AUTHENTICATING..." : "LOGIN"}
          </button>
        </form>
      </div>
    </div>
  );
}
