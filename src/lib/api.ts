// src/lib/api.ts
// ============================================================
// SZSTORE — API Utilities
// Backend helpers untuk fitur: Nickname Check, Promo, Invoice
// ============================================================

import { supabase } from "./supabase";

// ============================================================
// 1. AUTO CHECK NICKNAME
// ============================================================
/**
 * Cek nickname berdasarkan userId dan zoneId.
 * gameCode harus sesuai dengan `validation_code` di tabel games.
 * Ganti endpoint dengan API provider nyata (Digiflazz, dll).
 */
export async function checkNickname(
  userId: string,
  zoneId: string,
  gameCode: string
): Promise<{ nickname: string | null; error: string | null }> {
  try {
    // --- Gunakan API eksternal di sini ---
    // Contoh integrasi Digiflazz (uncomment jika sudah ada API key):
    // const res = await fetch("https://api.digiflazz.com/v1/cek-id", {
    //   method: "POST",
    //   headers: { "Content-Type": "application/json" },
    //   body: JSON.stringify({ username: "USERNAME", buyer_sku_code: gameCode, customer_no: userId, zone_id: zoneId }),
    // });

    // --- PLACEHOLDER MOCK (ganti dengan API nyata) ---
    // Simulasi: jika userId valid (panjang >= 4 digit), return nickname dummy
    await new Promise((r) => setTimeout(r, 800)); // simulate network delay

    if (!userId || userId.length < 4) {
      return { nickname: null, error: "User ID tidak ditemukan" };
    }

    // Demo nickname — GANTI dengan data dari API nyata
    const demoNicknames: Record<string, string> = {
      "mobile-legends": "Hero " + userId.slice(-3),
      "free-fire": "Survivor " + userId.slice(-3),
      "pubg-mobile": "Player " + userId.slice(-3),
      "genshin-impact": "Traveler " + userId.slice(-3),
      valorant: "Agent " + userId.slice(-3),
    };

    const nickname = demoNicknames[gameCode] || "Player " + userId.slice(-3);
    return { nickname, error: null };
  } catch {
    return { nickname: null, error: "Gagal menghubungi server" };
  }
}

// ============================================================
// 2. APPLY PROMO CODE
// ============================================================
export interface PromoResult {
  valid: boolean;
  promo?: any;
  discountAmount?: number;
  finalAmount?: number;
  error?: string;
}

export async function applyPromo(
  code: string,
  purchaseAmount: number
): Promise<PromoResult> {
  try {
    const now = new Date().toISOString();

    const { data: promo, error } = await supabase
      .from("promos")
      .select("*")
      .eq("code", code.toUpperCase())
      .eq("status", true)
      .single();

    if (error || !promo) {
      return { valid: false, error: "Kode promo tidak ditemukan" };
    }

    // Cek tanggal
    if (promo.start_date && now < promo.start_date) {
      return { valid: false, error: "Promo belum aktif" };
    }
    if (promo.end_date && now > promo.end_date + "T23:59:59") {
      return { valid: false, error: "Promo sudah berakhir" };
    }

    // Cek minimum pembelian
    if (promo.min_purchase && purchaseAmount < promo.min_purchase) {
      return {
        valid: false,
        error: `Minimum pembelian Rp ${promo.min_purchase.toLocaleString("id-ID")}`,
      };
    }

    // Cek kuota
    if (promo.quota !== -1 && promo.used_count >= promo.quota) {
      return { valid: false, error: "Kuota promo sudah habis" };
    }

    // Hitung diskon
    let discountAmount = 0;
    if (promo.type === "percent") {
      discountAmount = Math.floor(purchaseAmount * (promo.amount / 100));
      // Jika ada max_discount
      if (promo.max_discount > 0 && discountAmount > promo.max_discount) {
        discountAmount = promo.max_discount;
      }
    } else {
      // flat
      discountAmount = promo.amount;
    }

    const finalAmount = Math.max(0, purchaseAmount - discountAmount);

    return { valid: true, promo, discountAmount, finalAmount };
  } catch {
    return { valid: false, error: "Gagal memvalidasi promo" };
  }
}

// ============================================================
// 3. GET INVOICE STATUS
// ============================================================
export async function getInvoiceStatus(invoiceCode: string): Promise<any> {
  const { data } = await supabase
    .from("transactions")
    .select(
      "*, products(name, sell_price, games(name, thumbnail_url, slug, category_id))"
    )
    .eq("invoice", invoiceCode)
    .single();

  return data;
}

// ============================================================
// 4. REFRESH PAYMENT (trigger ulang jika timeout)
// ============================================================
export async function refreshPaymentStatus(
  invoiceCode: string
): Promise<{ success: boolean; status: string }> {
  try {
    const { data } = await supabase
      .from("transactions")
      .select("status, is_paid")
      .eq("invoice", invoiceCode)
      .single();

    return {
      success: true,
      status: data?.status || "Pending",
    };
  } catch {
    return { success: false, status: "Error" };
  }
}

// ============================================================
// 5. GET CATEGORIES (untuk GameCatalog)
// ============================================================
export async function getCategories(): Promise<any[]> {
  const { data } = await supabase
    .from("categories")
    .select("*")
    .eq("is_active", true)
    .order("sort_order", { ascending: true });

  return data || [];
}

// ============================================================
// 6. SIMPAN KONTAK INVOICE (WA + Email)
// ============================================================
export async function saveInvoiceContact(
  invoice: string,
  whatsapp: string,
  email: string
): Promise<void> {
  await supabase.from("invoice_contacts").upsert([{ invoice, whatsapp, email }]);
}

// ============================================================
// 7. RECORD PROMO USAGE
// ============================================================
export async function recordPromoUsage(
  promoId: string,
  invoice: string,
  discountAmount: number
): Promise<void> {
  await supabase.from("promo_usages").insert([{ promo_id: promoId, invoice, discount_amount: discountAmount }]);
  // Increment used_count
  await supabase.rpc("increment_promo_used", { promo_id_input: promoId }).maybeSingle();
}
