import { useState } from "react";
import { Lock, User, Eye, EyeOff, Loader2, ShieldAlert } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function AdminLogin() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const navigate = useNavigate();

  const handleAdminLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMsg("");

    try {
      const apiUrl =
        import.meta.env.VITE_API_BASE_URL || "http://localhost:8000/api/v1";

      // Memanggil API khusus Admin
      const response = await fetch(`${apiUrl}/admin/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();

      if (response.ok) {
        localStorage.setItem("admin_token", data.token);
        // Arahkan ke dashboard admin jika sukses
        navigate("/admin-dashboard");
      } else {
        setErrorMsg(data.message || "Akses Ditolak. Kredensial tidak valid.");
      }
    } catch (error) {
      setErrorMsg("Koneksi server gagal.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0a1020] flex items-center justify-center p-4 relative overflow-hidden">
      {/* Efek Background Merah/Waspada Khas Admin */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-red-900/10 rounded-full blur-[120px] pointer-events-none"></div>

      <div className="bg-[#121727] w-full max-w-md p-8 rounded-2xl shadow-2xl relative border border-red-500/20 z-10">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-red-500/10 border border-red-500/30 rounded-full flex items-center justify-center mx-auto mb-4">
            <ShieldAlert className="w-8 h-8 text-red-500" />
          </div>
          <h2 className="text-2xl font-orbitron font-bold text-white tracking-wider uppercase">
            SECURE PORTAL
          </h2>
          <p className="text-sm text-red-400/80 mt-2 font-medium">
            Restricted Access. Authorized Personnel Only.
          </p>
        </div>

        {errorMsg && (
          <div className="mb-6 p-3 bg-red-500/10 border border-red-500/30 rounded-lg text-red-400 text-sm text-center">
            {errorMsg}
          </div>
        )}

        <form className="flex flex-col gap-5" onSubmit={handleAdminLogin}>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <User className="w-5 h-5 text-white/40" />
            </div>
            <input
              type="text"
              required
              placeholder="Admin Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full pl-12 pr-4 py-4 rounded-xl bg-[rgba(255,255,255,0.03)] border border-white/10 text-white placeholder-white/30 focus:border-red-500 focus:outline-none transition-all"
            />
          </div>

          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <Lock className="w-5 h-5 text-white/40" />
            </div>
            <input
              type={showPassword ? "text" : "password"}
              required
              placeholder="Admin Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full pl-12 pr-12 py-4 rounded-xl bg-[rgba(255,255,255,0.03)] border border-white/10 text-white placeholder-white/30 focus:border-red-500 focus:outline-none transition-all"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute inset-y-0 right-0 pr-4 flex items-center text-white/40 hover:text-white"
            >
              {showPassword ? (
                <EyeOff className="w-5 h-5" />
              ) : (
                <Eye className="w-5 h-5" />
              )}
            </button>
          </div>

          <button
            disabled={isLoading}
            className="w-full py-4 mt-4 flex justify-center items-center rounded-xl text-white font-orbitron font-bold uppercase tracking-widest transition-all hover:scale-[1.02] disabled:opacity-70 bg-red-600 hover:bg-red-700 shadow-[0_0_20px_rgba(220,38,38,0.3)]"
          >
            {isLoading ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              "AUTHENTICATE"
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
