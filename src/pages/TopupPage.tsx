// src/pages/TopupPage.tsx — UPGRADED
// ============================================================
// Fitur Baru: Auto Nickname, Promo Code, WA/Email, Checkout Modal
// ============================================================
import { useEffect, useState, useRef, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Loader2,
  ArrowLeft,
  ShieldCheck,
  ShoppingCart,
  ChevronDown,
  CheckCircle2,
  X,
  Tag,
  Phone,
  Mail,
  CheckCircle,
  AlertCircle,
  User,
  Gift,
} from "lucide-react";
import { supabase } from "../lib/supabase";
import { checkNickname, applyPromo, recordPromoUsage } from "../lib/api";
import TopNavigation from "../components/TopNavigation";
import Footer from "../components/Footer";

const paymentGroups = [
  {
    id: "qris",
    title: "QRIS",
    logos: ["Gopay", "BNI", "ShopeePay", "Mandiri", "BCA", "LinkAja", "OVO", "DANA"],
    methods: [
      { id: "qris_all", name: "QRIS All Payment", fee: 0, flat_fee: 700 },
    ],
  },
  {
    id: "va",
    title: "Virtual Account",
    logos: ["BCA", "Danamon", "CIMB", "Maybank", "Permata", "SeaBank", "Sinarmas", "BRIVA", "BSI", "Mandiri", "BNI"],
    methods: [
      { id: "va_bca", name: "BCA Virtual Account", fee: 0, flat_fee: 4000 },
      { id: "va_mandiri", name: "Mandiri Virtual Account", fee: 0, flat_fee: 4000 },
      { id: "va_bni", name: "BNI Virtual Account", fee: 0, flat_fee: 4000 },
      { id: "va_bri", name: "BRI Virtual Account", fee: 0, flat_fee: 4000 },
    ],
  },
  {
    id: "cstore",
    title: "Convenience Store",
    logos: ["LAWSON", "Indomaret", "Alfamidi", "Alfamart", "Dandan"],
    methods: [
      { id: "cs_alfamart", name: "Alfamart", fee: 0, flat_fee: 2500 },
      { id: "cs_indomaret", name: "Indomaret", fee: 0, flat_fee: 2500 },
    ],
  },
];

export default function TopupPage() {
  const { slug } = useParams();
  const navigate = useNavigate();

  // Game & Products
  const [game, setGame] = useState<any>(null);
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Form
  const [userId, setUserId] = useState("");
  const [zoneId, setZoneId] = useState("");
  const [selectedProduct, setSelectedProduct] = useState<any>(null);
  const [selectedPayment, setSelectedPayment] = useState<any>(null);
  const [openAccordion, setOpenAccordion] = useState<string | null>(null);

  // Nickname Check (Fitur 3)
  const [nickname, setNickname] = useState<string | null>(null);
  const [nicknameLoading, setNicknameLoading] = useState(false);
  const [nicknameError, setNicknameError] = useState<string | null>(null);
  const nicknameTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Promo Code (Fitur 7)
  const [promoInput, setPromoInput] = useState("");
  const [promoResult, setPromoResult] = useState<any>(null);
  const [promoLoading, setPromoLoading] = useState(false);
  const [promoError, setPromoError] = useState<string | null>(null);
  const [showAvailablePromos, setShowAvailablePromos] = useState(false);
  const [availablePromos, setAvailablePromos] = useState<any[]>([]);

  // WA & Email (Fitur 8)
  const [whatsapp, setWhatsapp] = useState("");
  const [email, setEmail] = useState("");
  const [waError, setWaError] = useState<string | null>(null);

  // Checkout Modal (Fitur 4)
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  // Fetch game & products
  useEffect(() => {
    async function fetchTopupDetails() {
      setLoading(true);
      try {
        const { data: gameData } = await supabase
          .from("games")
          .select("*")
          .eq("slug", slug)
          .single();
        if (gameData) {
          setGame(gameData);
          const { data: productData } = await supabase
            .from("products")
            .select("*")
            .eq("game_id", gameData.id)
            .eq("status", true)
            .order("sell_price", { ascending: true });
          if (productData) setProducts(productData);
        }
      } catch (err) {
        console.error("Error fetching data:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchTopupDetails();
  }, [slug]);

  // Fetch available promo codes
  useEffect(() => {
    async function fetchPromos() {
      const now = new Date().toISOString().split("T")[0];
      const { data } = await supabase
        .from("promos")
        .select("id, code, title, type, amount, min_purchase, end_date")
        .eq("status", true)
        .not("code", "is", null)
        .or(`end_date.gte.${now},end_date.is.null`);
      setAvailablePromos(data || []);
    }
    fetchPromos();
  }, []);

  // Auto Nickname Check — debounce 800ms (Fitur 3)
  const triggerNicknameCheck = useCallback(async () => {
    if (!game?.validation_code || !userId) {
      setNickname(null);
      setNicknameError(null);
      return;
    }
    // Need userId (and optionally zoneId for games that require it)
    if (game.has_zone_id && !zoneId) {
      setNickname(null);
      setNicknameError(null);
      return;
    }
    setNicknameLoading(true);
    setNickname(null);
    setNicknameError(null);
    const result = await checkNickname(userId, zoneId, game.validation_code || game.slug);
    setNicknameLoading(false);
    if (result.error) {
      setNicknameError(result.error);
    } else {
      setNickname(result.nickname);
    }
  }, [game, userId, zoneId]);

  useEffect(() => {
    if (nicknameTimerRef.current) clearTimeout(nicknameTimerRef.current);
    if (!userId) {
      setNickname(null);
      setNicknameError(null);
      return;
    }
    nicknameTimerRef.current = setTimeout(triggerNicknameCheck, 800);
    return () => {
      if (nicknameTimerRef.current) clearTimeout(nicknameTimerRef.current);
    };
  }, [userId, zoneId, triggerNicknameCheck]);

  const parseServerList = (serverString: string) => {
    if (!serverString) return [];
    return serverString.split(",").map((item) => {
      const [value, label] = item.split("|");
      return { value: value.trim(), label: (label || value).trim() };
    });
  };

  const calculateBaseTotal = (method: any) => {
    if (!selectedProduct) return 0;
    return (
      selectedProduct.sell_price +
      selectedProduct.sell_price * (method.fee / 100) +
      method.flat_fee
    );
  };

  const calculateFinalTotal = (method: any) => {
    const base = calculateBaseTotal(method);
    if (!promoResult?.valid) return base;
    return Math.max(0, base - (promoResult.discountAmount || 0));
  };

  // Apply Promo
  const handleApplyPromo = async () => {
    if (!promoInput.trim()) return;
    if (!selectedProduct || !selectedPayment) {
      setPromoError("Pilih nominal dan metode pembayaran dulu.");
      return;
    }
    setPromoLoading(true);
    setPromoError(null);
    setPromoResult(null);
    const base = calculateBaseTotal(selectedPayment);
    const result = await applyPromo(promoInput.trim(), base);
    setPromoLoading(false);
    if (result.valid) {
      setPromoResult(result);
    } else {
      setPromoError(result.error || "Promo tidak valid.");
    }
  };

  const handleRemovePromo = () => {
    setPromoResult(null);
    setPromoInput("");
    setPromoError(null);
  };

  // Validate WA
  const validateWhatsapp = (val: string) => {
    const cleaned = val.replace(/\D/g, "");
    if (!cleaned) return "Nomor WhatsApp wajib diisi";
    if (cleaned.length < 9 || cleaned.length > 15) return "Format nomor tidak valid";
    return null;
  };

  // Open Checkout Modal (Fitur 4)
  const handleOpenConfirmModal = () => {
    const waErr = validateWhatsapp(whatsapp);
    if (waErr) {
      setWaError(waErr);
      return;
    }
    setWaError(null);
    setShowConfirmModal(true);
  };

  // Final Checkout (called from modal)
  const handleFinalCheckout = async () => {
    setIsProcessing(true);
    const finalAmount = calculateFinalTotal(selectedPayment);
    const generatedInvoice = `SZ-${Date.now().toString().slice(-8)}`;
    const discountAmt = promoResult?.discountAmount || 0;
    const calculatedProfit =
      selectedProduct.sell_price -
      (selectedProduct.original_price || selectedProduct.sell_price * 0.9);

    try {
      const { error } = await supabase.from("transactions").insert([
        {
          invoice: generatedInvoice,
          target_data: userId,
          target_additional_data: zoneId || "-",
          amount: finalAmount,
          profit: calculatedProfit,
          status: "Pending",
          product_id: selectedProduct.id,
          is_paid: false,
          promo_code: promoResult?.promo?.code || null,
          discount_amount: discountAmt,
          whatsapp: whatsapp,
          email: email || null,
          nickname: nickname || null,
          payment_method: selectedPayment.name,
          expired_at: new Date(Date.now() + 60 * 60 * 1000).toISOString(), // 1 hour
        },
      ]);

      if (error) throw error;

      // Record promo usage if applied
      if (promoResult?.valid && promoResult.promo?.id) {
        await recordPromoUsage(promoResult.promo.id, generatedInvoice, discountAmt);
      }

      setShowConfirmModal(false);
      navigate(`/invoice/${generatedInvoice}`);
    } catch (err: any) {
      alert("Gagal memproses pesanan: " + err.message);
    } finally {
      setIsProcessing(false);
    }
  };

  if (loading)
    return (
      <div className="min-h-screen bg-[#1c0a30] flex justify-center items-center">
        <Loader2 className="animate-spin text-[#FF007F] w-12 h-12" />
      </div>
    );
  if (!game)
    return (
      <div className="min-h-screen bg-[#1c0a30] text-white flex justify-center items-center">
        GAME TIDAK DITEMUKAN
      </div>
    );

  const serverOptions = parseServerList(game.server_list);
  const currentBaseTotal = selectedPayment ? calculateBaseTotal(selectedPayment) : 0;
  const currentFinalTotal = selectedPayment ? calculateFinalTotal(selectedPayment) : 0;
  const canCheckout = !!selectedPayment && !isProcessing;

  return (
    <div className="min-h-screen bg-[#1c0a30] text-white font-rajdhani overflow-x-hidden pb-20">
      <TopNavigation />
      <div className="pt-[80px]" />

      <div className="container mx-auto px-4 max-w-6xl py-6">
        <a
          href="/#games"
          className="flex items-center gap-2 text-xs text-white/50 hover:text-white mb-6 font-orbitron w-fit"
        >
          <ArrowLeft className="w-4 h-4" /> KEMBALI
        </a>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left: Game Info */}
          <div className="lg:col-span-1 space-y-4">
            <div className="bg-[#120224] border border-white/5 rounded-2xl p-4 shadow-xl sticky top-[100px]">
              <img
                src={game.thumbnail_url}
                alt={game.name}
                className="w-full h-48 object-cover rounded-xl mb-4"
              />
              <h1 className="text-xl font-bold font-orbitron uppercase text-white">
                {game.name}
              </h1>
              <p className="text-xs text-white/40 mt-2 leading-relaxed">
                {game.description || "Top up aman, murah, dan instan otomatis 24 jam legal bergaransi resmi."}
              </p>
              <div className="mt-4 pt-4 border-t border-white/5 flex items-center gap-2 text-[11px] text-emerald-400 font-orbitron">
                <ShieldCheck className="w-4 h-4" /> PROSES INSTAN & OTOMATIS
              </div>
            </div>
          </div>

          {/* Right: Form */}
          <div className="lg:col-span-2 space-y-6">
            {/* STEP 1: Data Akun */}
            <div className="bg-[#120224] border border-white/5 rounded-2xl p-5 shadow-xl">
              <h2 className="text-sm font-bold font-orbitron mb-4 text-[#FF007F]">
                1. MASUKKAN DATA AKUN
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] text-white/50 uppercase mb-2">
                    {game.placeholder_user_id || "User ID"}
                  </label>
                  <input
                    type="text"
                    value={userId}
                    onChange={(e) => setUserId(e.target.value)}
                    placeholder={`Ketik ${game.placeholder_user_id || "User ID"}`}
                    className="w-full p-3 bg-[#1c0a30] border border-white/10 rounded-xl text-sm focus:border-[#FF007F] outline-none text-white transition-colors"
                  />
                </div>
                {game.has_zone_id && (
                  <div>
                    <label className="block text-[11px] text-white/50 uppercase mb-2">
                      {game.placeholder_zone_id || "Zone ID"}
                    </label>
                    {serverOptions.length > 0 ? (
                      <select
                        value={zoneId}
                        onChange={(e) => setZoneId(e.target.value)}
                        className="w-full p-3 bg-[#1c0a30] border border-white/10 rounded-xl text-sm focus:border-[#FF007F] outline-none text-white"
                      >
                        <option value="">-- Pilih Server --</option>
                        {serverOptions.map((opt, i) => (
                          <option key={i} value={opt.value}>
                            {opt.label}
                          </option>
                        ))}
                      </select>
                    ) : (
                      <input
                        type="text"
                        value={zoneId}
                        onChange={(e) => setZoneId(e.target.value)}
                        placeholder={`Ketik ${game.placeholder_zone_id || "Zone ID"}`}
                        className="w-full p-3 bg-[#1c0a30] border border-white/10 rounded-xl text-sm focus:border-[#FF007F] outline-none text-white"
                      />
                    )}
                  </div>
                )}
              </div>

              {/* Nickname Check Result (Fitur 3) */}
              {game.validation_code && userId && (
                <div className="mt-3">
                  {nicknameLoading ? (
                    <div className="flex items-center gap-2 text-xs text-white/40 mt-2">
                      <Loader2 className="w-3.5 h-3.5 animate-spin text-[#00D4FF]" />
                      <span>Mengecek nickname...</span>
                    </div>
                  ) : nickname ? (
                    <div className="flex items-center gap-2 mt-2 px-3 py-2 bg-emerald-500/10 border border-emerald-500/30 rounded-xl">
                      <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
                      <div>
                        <p className="text-[10px] text-emerald-400/70 uppercase font-orbitron">Nickname</p>
                        <p className="text-sm font-bold text-emerald-300">{nickname}</p>
                      </div>
                    </div>
                  ) : nicknameError ? (
                    <div className="flex items-center gap-2 mt-2 px-3 py-2 bg-red-500/10 border border-red-500/30 rounded-xl">
                      <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
                      <p className="text-xs text-red-400">{nicknameError}</p>
                    </div>
                  ) : null}
                </div>
              )}
            </div>

            {/* STEP 2: Nominal */}
            <div className="bg-[#120224] border border-white/5 rounded-2xl p-5 shadow-xl">
              <h2 className="text-sm font-bold font-orbitron mb-4 text-[#FF007F]">
                2. PILIH NOMINAL TOP UP
              </h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {products.map((p) => (
                  <button
                    key={p.id}
                    type="button"
                    onClick={() => setSelectedProduct(p)}
                    className={`p-4 rounded-xl border text-left flex flex-col justify-between transition-all relative overflow-hidden group ${
                      selectedProduct?.id === p.id
                        ? "border-[#FF007F] bg-[#FF007F]/10 shadow-[0_0_15px_rgba(255,0,127,0.2)]"
                        : "border-white/5 bg-[#1c0a30] hover:border-[#00D4FF]/50"
                    }`}
                  >
                    <span className="text-xs font-bold text-white group-hover:text-[#00D4FF] transition-colors">
                      {p.name}
                    </span>
                    <span className="text-sm font-bold text-[#FFD740] mt-3">
                      Rp {p.sell_price?.toLocaleString("id-ID")}
                    </span>
                    {selectedProduct?.id === p.id && (
                      <CheckCircle2 className="absolute top-2 right-2 w-4 h-4 text-[#FF007F]" />
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* STEP 3: Pembayaran */}
            <div className="bg-[#120224] border border-white/5 rounded-2xl p-5 shadow-xl">
              <h2 className="text-sm font-bold font-orbitron mb-4 text-[#FF007F]">
                3. PILIH PEMBAYARAN
              </h2>
              {!selectedProduct ? (
                <p className="text-xs text-white/40 py-6 text-center border border-dashed border-white/10 rounded-xl">
                  Silakan pilih nominal Top Up terlebih dahulu.
                </p>
              ) : (
                <div className="space-y-4">
                  {paymentGroups.map((group) => {
                    const isOpen = openAccordion === group.id;
                    return (
                      <div
                        key={group.id}
                        className="border border-white/10 rounded-xl overflow-hidden bg-[#2D2D35] shadow-lg"
                      >
                        <div
                          className="p-4 flex justify-between items-center cursor-pointer bg-[#353642] hover:bg-[#3f404e] transition-colors"
                          onClick={() => setOpenAccordion(isOpen ? null : group.id)}
                        >
                          <h3 className="text-[13px] font-bold text-white/90">{group.title}</h3>
                          <ChevronDown
                            className={`w-4 h-4 text-white/50 transition-transform duration-300 ${isOpen ? "rotate-180" : ""}`}
                          />
                        </div>
                        <div className="bg-[#404048] p-2.5 px-4 flex gap-1.5 flex-wrap border-t border-white/5">
                          {group.logos.map((logo) => (
                            <span
                              key={logo}
                              className="bg-white text-gray-800 text-[9px] font-bold px-1.5 py-0.5 rounded-sm"
                            >
                              {logo}
                            </span>
                          ))}
                        </div>
                        {isOpen && (
                          <div className="p-4 grid grid-cols-1 gap-2 bg-[#2D2D35] border-t border-white/5">
                            {group.methods.map((method) => (
                              <div
                                key={method.id}
                                onClick={() => setSelectedPayment(method)}
                                className={`p-4 rounded-lg border flex justify-between items-center cursor-pointer transition-all ${
                                  selectedPayment?.id === method.id
                                    ? "border-[#FF007F] bg-[#FF007F]/10"
                                    : "border-white/10 bg-[#1c0a30]/50 hover:border-white/30"
                                }`}
                              >
                                <span className="text-xs font-bold text-white flex items-center gap-2">
                                  {selectedPayment?.id === method.id && (
                                    <CheckCircle2 className="w-4 h-4 text-[#FF007F]" />
                                  )}
                                  {method.name}
                                </span>
                                <div className="text-right">
                                  <span className="text-xs text-[#FFD740] font-bold">
                                    Rp {calculateFinalTotal(method).toLocaleString("id-ID")}
                                  </span>
                                  {promoResult?.valid && (
                                    <p className="text-[10px] text-white/30 line-through">
                                      Rp {calculateBaseTotal(method).toLocaleString("id-ID")}
                                    </p>
                                  )}
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* STEP 4: Kode Promo (Fitur 7) */}
            {selectedProduct && selectedPayment && (
              <div className="bg-[#120224] border border-white/5 rounded-2xl p-5 shadow-xl">
                <h2 className="text-sm font-bold font-orbitron mb-4 text-[#FF007F]">
                  4. KODE PROMO
                </h2>

                {promoResult?.valid ? (
                  // Promo Applied State
                  <div className="flex items-center justify-between p-3 bg-emerald-500/10 border border-emerald-500/30 rounded-xl">
                    <div className="flex items-center gap-2">
                      <CheckCircle className="w-5 h-5 text-emerald-400 shrink-0" />
                      <div>
                        <p className="text-xs font-bold font-orbitron text-emerald-300">
                          {promoResult.promo?.code} — Promo Berhasil!
                        </p>
                        <p className="text-[11px] text-emerald-400/70">
                          Hemat Rp {promoResult.discountAmount?.toLocaleString("id-ID")}
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={handleRemovePromo}
                      className="text-white/40 hover:text-red-400 transition-colors"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ) : (
                  <>
                    <div className="flex gap-2 mb-3">
                      <div className="relative flex-1">
                        <Tag className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
                        <input
                          type="text"
                          value={promoInput}
                          onChange={(e) => {
                            setPromoInput(e.target.value.toUpperCase());
                            setPromoError(null);
                          }}
                          onKeyDown={(e) => e.key === "Enter" && handleApplyPromo()}
                          placeholder="Masukkan Kode Promo"
                          className="w-full pl-10 pr-3 py-3 bg-[#1c0a30] border border-white/10 rounded-xl text-sm text-white font-mono tracking-widest outline-none focus:border-[#FF007F] transition-colors uppercase"
                        />
                      </div>
                      <button
                        onClick={handleApplyPromo}
                        disabled={promoLoading || !promoInput}
                        className="px-5 py-3 rounded-xl text-xs font-bold font-orbitron bg-gradient-to-r from-[#FF007F] to-purple-600 text-white disabled:opacity-40 hover:scale-[1.02] transition-all flex items-center gap-2 shrink-0"
                      >
                        {promoLoading ? (
                          <Loader2 className="w-4 h-4 animate-spin" />
                        ) : null}
                        Gunakan
                      </button>
                    </div>

                    {promoError && (
                      <p className="text-xs text-red-400 mb-2 flex items-center gap-1">
                        <AlertCircle className="w-3.5 h-3.5" /> {promoError}
                      </p>
                    )}

                    {availablePromos.length > 0 && (
                      <div>
                        <button
                          onClick={() => setShowAvailablePromos(!showAvailablePromos)}
                          className="w-full py-2.5 rounded-xl text-xs font-bold font-orbitron text-white bg-gradient-to-r from-amber-500/20 to-orange-500/20 border border-amber-500/30 hover:border-amber-400/60 transition-all flex items-center justify-center gap-2"
                        >
                          <Gift className="w-4 h-4 text-amber-400" />
                          Pakai Promo Yang Tersedia
                          <ChevronDown
                            className={`w-4 h-4 transition-transform duration-300 ${showAvailablePromos ? "rotate-180" : ""}`}
                          />
                        </button>
                        {showAvailablePromos && (
                          <div className="mt-2 space-y-2 max-h-48 overflow-y-auto">
                            {availablePromos.map((p) => (
                              <button
                                key={p.id}
                                onClick={() => {
                                  setPromoInput(p.code);
                                  setShowAvailablePromos(false);
                                }}
                                className="w-full flex items-center justify-between p-3 rounded-xl bg-[#1c0a30] border border-white/10 hover:border-[#FF007F]/50 transition-all text-left"
                              >
                                <div>
                                  <p className="text-xs font-mono font-bold text-[#00E5FF] tracking-widest">
                                    {p.code}
                                  </p>
                                  <p className="text-[10px] text-white/40">{p.title}</p>
                                </div>
                                <span className="text-xs text-[#FF007F] font-bold font-orbitron">
                                  {p.type === "percent"
                                    ? `${p.amount}% OFF`
                                    : `Rp ${p.amount.toLocaleString("id-ID")} OFF`}
                                </span>
                              </button>
                            ))}
                          </div>
                        )}
                      </div>
                    )}
                  </>
                )}

                {/* Total setelah promo */}
                {promoResult?.valid && selectedPayment && (
                  <div className="mt-3 p-3 bg-[#1c0a30] rounded-xl border border-white/10">
                    <div className="flex justify-between text-xs text-white/50 mb-1">
                      <span>Subtotal</span>
                      <span>Rp {currentBaseTotal.toLocaleString("id-ID")}</span>
                    </div>
                    <div className="flex justify-between text-xs text-emerald-400 mb-2">
                      <span>Diskon Promo</span>
                      <span>- Rp {promoResult.discountAmount?.toLocaleString("id-ID")}</span>
                    </div>
                    <div className="flex justify-between font-bold text-sm border-t border-white/10 pt-2">
                      <span className="text-white font-orbitron">Total Bayar</span>
                      <span className="text-[#FFD740] font-orbitron">
                        Rp {currentFinalTotal.toLocaleString("id-ID")}
                      </span>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* STEP 5: WhatsApp & Email (Fitur 8) */}
            <div className="bg-[#120224] border border-white/5 rounded-2xl p-5 shadow-xl">
              <h2 className="text-sm font-bold font-orbitron mb-4 text-[#FF007F]">
                {selectedProduct && selectedPayment ? "5." : "4."} KONTAK NOTIFIKASI
              </h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-[11px] text-white/50 uppercase mb-2">
                    Nomor WhatsApp *
                  </label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
                    <input
                      type="tel"
                      value={whatsapp}
                      onChange={(e) => {
                        setWhatsapp(e.target.value);
                        setWaError(null);
                      }}
                      placeholder="Contoh: 081234567890"
                      className={`w-full pl-10 pr-3 py-3 bg-[#1c0a30] border rounded-xl text-sm outline-none text-white transition-colors ${
                        waError
                          ? "border-red-500/50 focus:border-red-500"
                          : "border-white/10 focus:border-[#FF007F]"
                      }`}
                    />
                  </div>
                  {waError && (
                    <p className="text-xs text-red-400 mt-1 flex items-center gap-1">
                      <AlertCircle className="w-3 h-3" /> {waError}
                    </p>
                  )}
                  <p className="text-[10px] text-white/30 mt-1">
                    Notifikasi pesanan akan dikirim ke WhatsApp ini.
                  </p>
                </div>
                <div>
                  <label className="block text-[11px] text-white/50 uppercase mb-2">
                    Email{" "}
                    <span className="text-white/30 normal-case">(Opsional)</span>
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="email@contoh.com"
                      className="w-full pl-10 pr-3 py-3 bg-[#1c0a30] border border-white/10 rounded-xl text-sm focus:border-[#FF007F] outline-none text-white transition-colors"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Tombol Checkout */}
            <button
              type="button"
              onClick={handleOpenConfirmModal}
              disabled={!canCheckout}
              className="w-full py-4 rounded-2xl font-orbitron font-bold text-sm bg-gradient-to-r from-[#FF007F] to-purple-600 text-white disabled:opacity-30 disabled:cursor-not-allowed shadow-[0_10px_20px_rgba(255,0,127,0.3)] flex items-center justify-center gap-2 mt-4 hover:scale-[1.01] transition-all"
            >
              <ShoppingCart className="w-5 h-5" /> BELI SEKARANG
            </button>
          </div>
        </div>
      </div>

      {/* ═══ MODAL KONFIRMASI CHECKOUT (Fitur 4) ═══ */}
      {showConfirmModal && selectedProduct && selectedPayment && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
          <div
            className="w-full max-w-md rounded-2xl overflow-hidden border border-[#FF007F]/20"
            style={{
              background: "linear-gradient(145deg, #1a0835, #120224)",
              boxShadow: "0 0 60px rgba(255,0,127,0.15), 0 0 120px rgba(138,43,226,0.1)",
            }}
          >
            {/* Modal Header */}
            <div className="relative bg-gradient-to-br from-[#FF007F]/20 to-purple-900/30 p-6 text-center border-b border-white/5">
              <button
                onClick={() => setShowConfirmModal(false)}
                className="absolute top-4 right-4 text-white/40 hover:text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
              <div className="w-14 h-14 rounded-full bg-gradient-to-br from-emerald-400 to-emerald-600 flex items-center justify-center mx-auto mb-3 shadow-[0_0_20px_rgba(52,211,153,0.5)]">
                <CheckCircle className="w-8 h-8 text-white" />
              </div>
              <h2 className="text-lg font-orbitron font-black text-white">
                Buat Pesanan
              </h2>
              <p className="text-xs text-white/50 mt-1">
                Pastikan data akun benar sebelum memesan.
              </p>
            </div>

            {/* Modal Body */}
            <div className="p-5 space-y-4 max-h-[60vh] overflow-y-auto">
              {/* Data Player */}
              <div className="bg-white/5 rounded-xl p-4 border border-white/10">
                <p className="text-[10px] font-orbitron uppercase text-[#FF007F] mb-3 flex items-center gap-1.5">
                  <User className="w-3 h-3" /> Data Player
                </p>
                <div className="space-y-2">
                  {[
                    { label: game.placeholder_user_id || "User ID", value: userId },
                    game.has_zone_id && zoneId
                      ? { label: game.placeholder_zone_id || "Zone", value: zoneId }
                      : null,
                    nickname ? { label: "Nickname", value: nickname } : null,
                    { label: "WhatsApp", value: whatsapp },
                  ]
                    .filter(Boolean)
                    .map((row: any) => (
                      <div key={row.label} className="flex justify-between text-sm">
                        <span className="text-white/50">{row.label}</span>
                        <span className="font-bold text-white">{row.value}</span>
                      </div>
                    ))}
                </div>
              </div>

              {/* Divider */}
              <div className="border-t border-white/10" />

              {/* Ringkasan */}
              <div className="bg-white/5 rounded-xl p-4 border border-white/10">
                <p className="text-[10px] font-orbitron uppercase text-[#00D4FF] mb-3">
                  Ringkasan Pembelian
                </p>
                <div className="space-y-2">
                  {[
                    { label: "Game", value: game.name },
                    { label: "Produk", value: selectedProduct.name },
                    {
                      label: "Harga",
                      value: `Rp ${currentBaseTotal.toLocaleString("id-ID")}`,
                    },
                    promoResult?.valid
                      ? {
                          label: "Diskon",
                          value: `- Rp ${promoResult.discountAmount?.toLocaleString("id-ID")}`,
                          highlight: "emerald",
                        }
                      : null,
                    { label: "Metode", value: selectedPayment.name },
                  ]
                    .filter(Boolean)
                    .map((row: any) => (
                      <div key={row.label} className="flex justify-between text-sm">
                        <span className="text-white/50">{row.label}</span>
                        <span
                          className={`font-bold ${
                            row.highlight === "emerald"
                              ? "text-emerald-400"
                              : "text-white"
                          }`}
                        >
                          {row.value}
                        </span>
                      </div>
                    ))}
                  <div className="border-t border-white/10 pt-2 flex justify-between">
                    <span className="text-white font-orbitron text-sm">Total Bayar</span>
                    <span className="text-[#FFD740] font-orbitron font-black text-base">
                      Rp {currentFinalTotal.toLocaleString("id-ID")}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Modal Footer Buttons */}
            <div className="p-5 grid grid-cols-2 gap-3 border-t border-white/5">
              <button
                onClick={() => setShowConfirmModal(false)}
                disabled={isProcessing}
                className="py-3 rounded-xl text-sm font-bold font-orbitron border border-white/15 text-white/60 hover:bg-white/5 transition-all disabled:opacity-40"
              >
                Batalkan
              </button>
              <button
                onClick={handleFinalCheckout}
                disabled={isProcessing}
                className="py-3 rounded-xl text-sm font-bold font-orbitron bg-gradient-to-r from-[#FF007F] to-purple-600 text-white shadow-[0_0_20px_rgba(255,0,127,0.3)] hover:scale-[1.02] transition-all disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {isProcessing ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" /> Memproses...
                  </>
                ) : (
                  <>
                    <CheckCircle2 className="w-4 h-4" /> Pesan Sekarang
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}
