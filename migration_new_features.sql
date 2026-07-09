-- ============================================================
-- SZSTORE - MIGRATION: NEW FEATURES
-- Jalankan di Supabase SQL Editor
-- ============================================================

-- ============================================================
-- 1. TABEL CATEGORIES (Kategori Produk)
-- ============================================================
CREATE TABLE IF NOT EXISTS categories (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  name text NOT NULL,
  slug text UNIQUE NOT NULL,
  icon_url text,
  sort_order int DEFAULT 0,
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Seed kategori default
INSERT INTO categories (name, slug, sort_order, is_active) VALUES
  ('Top Up Games', 'top-up-games', 1, true),
  ('Voucher', 'voucher', 2, true),
  ('Pulsa & Data', 'pulsa-data', 3, true),
  ('App Premium', 'app-premium', 4, true),
  ('Entertainment', 'entertainment', 5, true),
  ('Gift Card', 'gift-card', 6, true)
ON CONFLICT (slug) DO NOTHING;

-- ============================================================
-- 2. TAMBAH KOLOM category_id KE TABEL games
-- ============================================================
ALTER TABLE games ADD COLUMN IF NOT EXISTS category_id uuid REFERENCES categories(id) ON DELETE SET NULL;

-- Update game yang ada ke kategori 'Top Up Games'
UPDATE games 
SET category_id = (SELECT id FROM categories WHERE slug = 'top-up-games' LIMIT 1)
WHERE category_id IS NULL;

-- ============================================================
-- 3. UPGRADE TABEL promos (tambah field kode promo)
-- ============================================================
ALTER TABLE promos ADD COLUMN IF NOT EXISTS code text;
ALTER TABLE promos ADD COLUMN IF NOT EXISTS type text DEFAULT 'percent'; -- 'percent' atau 'flat'
ALTER TABLE promos ADD COLUMN IF NOT EXISTS amount numeric DEFAULT 0;
ALTER TABLE promos ADD COLUMN IF NOT EXISTS min_purchase numeric DEFAULT 0;
ALTER TABLE promos ADD COLUMN IF NOT EXISTS quota int DEFAULT -1; -- -1 = unlimited
ALTER TABLE promos ADD COLUMN IF NOT EXISTS used_count int DEFAULT 0;
ALTER TABLE promos ADD COLUMN IF NOT EXISTS max_discount numeric DEFAULT 0; -- 0 = no limit

-- Unique constraint untuk kode promo (skip jika sudah ada)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'promos_code_unique'
  ) THEN
    ALTER TABLE promos ADD CONSTRAINT promos_code_unique UNIQUE (code);
  END IF;
END $$;

-- ============================================================
-- 4. TABEL promo_usages (Statistik penggunaan)
-- ============================================================
CREATE TABLE IF NOT EXISTS promo_usages (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  promo_id uuid REFERENCES promos(id) ON DELETE CASCADE,
  invoice text,
  discount_amount numeric DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

-- ============================================================
-- 5. UPGRADE TABEL transactions (kolom baru)
-- ============================================================
ALTER TABLE transactions ADD COLUMN IF NOT EXISTS promo_code text;
ALTER TABLE transactions ADD COLUMN IF NOT EXISTS discount_amount numeric DEFAULT 0;
ALTER TABLE transactions ADD COLUMN IF NOT EXISTS whatsapp text;
ALTER TABLE transactions ADD COLUMN IF NOT EXISTS email text;
ALTER TABLE transactions ADD COLUMN IF NOT EXISTS nickname text;
ALTER TABLE transactions ADD COLUMN IF NOT EXISTS payment_method text;
ALTER TABLE transactions ADD COLUMN IF NOT EXISTS expired_at timestamptz;
ALTER TABLE transactions ADD COLUMN IF NOT EXISTS payment_qr_url text;
ALTER TABLE transactions ADD COLUMN IF NOT EXISTS payment_va_number text;

-- ============================================================
-- 6. TABEL invoice_contacts (WA & Email terpisah, optional)
-- ============================================================
CREATE TABLE IF NOT EXISTS invoice_contacts (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  invoice text NOT NULL,
  whatsapp text,
  email text,
  created_at timestamptz DEFAULT now()
);

-- ============================================================
-- 7. ROW LEVEL SECURITY (jika RLS aktif)
-- ============================================================

-- categories: public read & write
DO $$ BEGIN
  IF EXISTS (SELECT 1 FROM pg_tables WHERE tablename = 'categories' AND schemaname = 'public') THEN
    ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
  END IF;
END $$;

DROP POLICY IF EXISTS "categories_public_read" ON categories;
CREATE POLICY "categories_public_read" ON categories FOR SELECT USING (true);
DROP POLICY IF EXISTS "categories_admin_all" ON categories;
CREATE POLICY "categories_admin_all" ON categories FOR ALL USING (true) WITH CHECK (true);

-- promo_usages: public insert, admin read
DO $$ BEGIN
  IF EXISTS (SELECT 1 FROM pg_tables WHERE tablename = 'promo_usages' AND schemaname = 'public') THEN
    ALTER TABLE promo_usages ENABLE ROW LEVEL SECURITY;
  END IF;
END $$;

DROP POLICY IF EXISTS "promo_usages_insert" ON promo_usages;
CREATE POLICY "promo_usages_insert" ON promo_usages FOR INSERT WITH CHECK (true);
DROP POLICY IF EXISTS "promo_usages_read" ON promo_usages;
CREATE POLICY "promo_usages_read" ON promo_usages FOR SELECT USING (true);

-- ============================================================
-- 8. GRANT HAK AKSES KE ROLE ANON & AUTHENTICATED
-- Ini wajib agar frontend (yang pakai anon key) bisa CRUD
-- ============================================================
GRANT ALL PRIVILEGES ON TABLE categories TO anon, authenticated;
GRANT ALL PRIVILEGES ON TABLE promo_usages TO anon, authenticated;
GRANT ALL PRIVILEGES ON TABLE invoice_contacts TO anon, authenticated;
GRANT ALL PRIVILEGES ON TABLE promos TO anon, authenticated;
GRANT ALL PRIVILEGES ON TABLE transactions TO anon, authenticated;
GRANT ALL PRIVILEGES ON TABLE games TO anon, authenticated;
GRANT ALL PRIVILEGES ON TABLE products TO anon, authenticated;

-- ============================================================
-- SELESAI
-- ============================================================
-- Verifikasi: SELECT * FROM categories;
