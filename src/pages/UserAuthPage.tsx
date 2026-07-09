import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { User, Lock, Eye, EyeOff, Mail } from "lucide-react";
import { supabase } from "../lib/supabase";
import TopNavigation from "../components/TopNavigation";
import Footer from "../components/Footer";

export default function UserAuthPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccessMsg("");
    setIsSubmitting(true);

    try {
      if (isLogin) {
        const { error } = await supabase.auth.signInWithPassword({
          email: email,
          password: password,
        });

        if (error) throw error;
        navigate("/");
      } else {
        const { error } = await supabase.auth.signUp({
          email: email,
          password: password,
        });

        if (error) throw error;
        setSuccessMsg("Pendaftaran berhasil! Silakan cek email Anda atau coba login.");
        setIsLogin(true); // Switch to login tab
        setPassword("");
      }
    } catch (err: any) {
      setError(err.message || "Terjadi kesalahan. Silakan coba lagi.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#1c0a30] text-white overflow-x-hidden font-rajdhani flex flex-col">
      <TopNavigation />
      <div className="pt-[100px] flex-grow flex items-center justify-center p-4">
        <div className="w-full max-w-md bg-[#120224] border border-white/10 rounded-2xl p-8 shadow-2xl relative overflow-hidden">
          {/* Decorative background effects */}
          <div className="absolute -top-20 -right-20 w-40 h-40 bg-[#FF007F] rounded-full blur-[80px] opacity-20"></div>
          <div className="absolute -bottom-20 -left-20 w-40 h-40 bg-[#00E5FF] rounded-full blur-[80px] opacity-20"></div>

          <div className="relative z-10">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-orbitron font-bold text-white uppercase tracking-wider">
                {isLogin ? "Masuk ke Akun" : "Daftar Akun Baru"}
              </h2>
              <p className="text-sm text-white/50 mt-2">
                {isLogin
                  ? "Selamat datang kembali di SZStore!"
                  : "Bergabunglah untuk menikmati fitur lengkap SZStore."}
              </p>
            </div>

            {/* Tabs */}
            <div className="flex bg-[#1c0a30] rounded-lg p-1 mb-8 border border-white/5">
              <button
                className={`flex-1 py-2 rounded-md text-sm font-bold font-orbitron uppercase transition-colors ${
                  isLogin ? "bg-[#00E5FF] text-[#1c0a30]" : "text-white/50 hover:text-white"
                }`}
                onClick={() => {
                  setIsLogin(true);
                  setError("");
                  setSuccessMsg("");
                }}
              >
                Masuk
              </button>
              <button
                className={`flex-1 py-2 rounded-md text-sm font-bold font-orbitron uppercase transition-colors ${
                  !isLogin ? "bg-[#FF007F] text-white" : "text-white/50 hover:text-white"
                }`}
                onClick={() => {
                  setIsLogin(false);
                  setError("");
                  setSuccessMsg("");
                }}
              >
                Daftar
              </button>
            </div>

            {error && (
              <div className="mb-6 p-3 rounded-lg bg-[#FF007F]/10 border border-[#FF007F]/30 text-sm text-[#FF007F] text-center">
                {error}
              </div>
            )}
            
            {successMsg && (
              <div className="mb-6 p-3 rounded-lg bg-[#00E5FF]/10 border border-[#00E5FF]/30 text-sm text-[#00E5FF] text-center">
                {successMsg}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Email Anda"
                  required
                  className="w-full pl-11 pr-4 py-3 bg-[#1c0a30] border border-white/10 rounded-xl text-white outline-none focus:border-[#00E5FF] transition-colors"
                />
              </div>

              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" />
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Password"
                  required
                  className="w-full pl-11 pr-11 py-3 bg-[#1c0a30] border border-white/10 rounded-xl text-white outline-none focus:border-[#00E5FF] transition-colors"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-white/40 hover:text-white transition-colors"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className={`w-full py-3 mt-4 rounded-xl font-orbitron font-bold uppercase tracking-wider transition-all hover:scale-[1.02] disabled:opacity-50 disabled:hover:scale-100 ${
                  isLogin ? "bg-[#00E5FF] text-[#1c0a30]" : "bg-[#FF007F] text-white"
                }`}
              >
                {isSubmitting ? "MEMPROSES..." : isLogin ? "MASUK SEKARANG" : "DAFTAR SEKARANG"}
              </button>
            </form>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
