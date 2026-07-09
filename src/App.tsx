// src/App.tsx
import { Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./contexts/AuthContext";
import { ToastProvider } from "./contexts/ToastContext";

// Import Halaman Publik
import Home from "./pages/Home";
import LoginPage from "./pages/LoginPage";
import TopupPage from "./pages/TopupPage";
import CekTransaksi from "./pages/CekTransaksi";
import KalkulatorPage from "./pages/KalkulatorPage";
import UserAuthPage from "./pages/UserAuthPage";
import PriceListPage from "./pages/PriceListPage";
import LeaderboardPage from "./pages/LeaderboardPage";
import WinRateCalc from "./pages/calculators/WinRateCalc";
import MagicWheelCalc from "./pages/calculators/MagicWheelCalc";
import ZodiacCalc from "./pages/calculators/ZodiacCalc";
import UserProfilePage from "./pages/UserProfilePage";
import InvoicePage from "./pages/InvoicePage";
import RecentPurchaseToast from "./components/RecentPurchaseToast";

// Import Layout Admin
import AdminLayout from "./admin/AdminLayout";

// Import Halaman Admin
import AdminOverview from "./admin/AdminOverview";
import AdminTransactions from "./admin/AdminTransactions";
import AdminAPIProviders from "./admin/AdminAPIProviders";
import AdminPaymentGateways from "./admin/AdminPaymentGateways";
import AdminSettings from "./admin/AdminSettings";
import AdminPromos from "./admin/AdminPromos";
import AdminNotifications from "./admin/AdminNotifications";
import AdminOrders from "./admin/AdminOrders";
import AdminProducts from "./admin/AdminProducts";
import AdminGames from "./admin/AdminGames";
import AdminUsers from "./admin/AdminUsers";
import AdminLogs from "./admin/AdminLogs";
import AdminContacts from "./admin/AdminContacts";
import AdminCategories from "./admin/AdminCategories";

// Guard Khusus untuk Proteksi Admin Panel
function AdminGuard({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, loading } = useAuth();

  // Jika auth Supabase untuk panel admin masih memproses sesi, tampilkan loading di sini
  if (loading) {
    return (
      <div className="min-h-screen bg-[#1c0a30] text-white flex flex-col items-center justify-center font-orbitron">
        <div className="w-10 h-10 border-4 border-white/20 border-t-[#FF007F] rounded-full animate-spin mb-4"></div>
        <h2 className="text-xl font-bold text-[#FF007F]">
          MEMUAT SISTEM ADMIN...
        </h2>
        <p className="text-xs text-white/50 mt-2">
          Memverifikasi kredensial...
        </p>
      </div>
    );
  }

  return isAuthenticated ? (
    <>{children}</>
  ) : (
    <Navigate to="/sz-admin" replace />
  );
}

export default function App() {
  return (
    <AuthProvider>
      <ToastProvider>
        <Routes>
          {/* RUTE HALAMAN PUBLIK / DASHBOARD USER */}
          <Route path="/" element={<Home />} />
          <Route path="/topup/:slug" element={<TopupPage />} />
          <Route path="/cek-transaksi" element={<CekTransaksi />} />
          <Route path="/kalkulator-mlbb" element={<KalkulatorPage />} />
          <Route path="/daftar-harga" element={<PriceListPage />} />
          <Route path="/leaderboard" element={<LeaderboardPage />} />
          <Route path="/kalkulator/winrate" element={<WinRateCalc />} />
          <Route path="/kalkulator/magic-wheel" element={<MagicWheelCalc />} />
          <Route path="/kalkulator/zodiac" element={<ZodiacCalc />} />
          <Route path="/profil" element={<UserProfilePage />} />
          <Route path="/invoice/:invoiceCode" element={<InvoicePage />} />
          <Route path="/login" element={<UserAuthPage />} />

          {/* Rute Form Login Admin Asli */}
          <Route path="/sz-admin" element={<LoginPage />} />

          {/* RUTE PANEL ADMIN (Dilindungi AdminGuard) */}
          <Route
            path="/admin"
            element={
              <AdminGuard>
                <AdminLayout />
              </AdminGuard>
            }
          >
            <Route index element={<AdminOverview />} />
            <Route path="transactions" element={<AdminTransactions />} />
            <Route path="orders" element={<AdminOrders />} />
            <Route path="products" element={<AdminProducts />} />
            <Route path="games" element={<AdminGames />} />
            <Route path="categories" element={<AdminCategories />} />
            <Route path="users" element={<AdminUsers />} />
            <Route path="promos" element={<AdminPromos />} />
            <Route path="payments" element={<AdminPaymentGateways />} />
            <Route path="providers" element={<AdminAPIProviders />} />
            <Route path="logs" element={<AdminLogs />} />
            <Route path="notifications" element={<AdminNotifications />} />
            <Route path="settings" element={<AdminSettings />} />
            <Route path="contacts" element={<AdminContacts />} />
          </Route>
        </Routes>
        <RecentPurchaseToast />
      </ToastProvider>
    </AuthProvider>
  );
}
