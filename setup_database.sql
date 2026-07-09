-- ==========================================
-- SCRIPT PERBAIKAN SCHEMA & SEED DATA GAME
-- Silakan Jalankan di Menu SQL Editor Supabase Anda
-- ==========================================

-- 1. PERBAIKAN TABEL TRANSACTIONS (Tambahkan kolom yang kurang agar error cache hilang)
ALTER TABLE transactions ADD COLUMN IF NOT EXISTS amount numeric DEFAULT 0;
ALTER TABLE transactions ADD COLUMN IF NOT EXISTS profit numeric DEFAULT 0;
ALTER TABLE transactions ADD COLUMN IF NOT EXISTS is_paid boolean DEFAULT false;
ALTER TABLE transactions ADD COLUMN IF NOT EXISTS target_data text;
ALTER TABLE transactions ADD COLUMN IF NOT EXISTS target_additional_data text;

-- 2. DUMMY DATA GAMES & PRODUCTS
-- Karena ada relasi ke tabel produk, kita masukkan beberapa game populer.
-- Hapus isi games dan products lama untuk memastikan data bersih
TRUNCATE TABLE products CASCADE;
TRUNCATE TABLE games CASCADE;

-- Masukkan Games
INSERT INTO games (id, name, slug, thumbnail_url, category, description, placeholder_user_id, placeholder_zone_id, has_zone_id, server_list) VALUES
(gen_random_uuid(), 'Mobile Legends', 'mobile-legends', 'https://upload.wikimedia.org/wikipedia/en/thumb/2/23/Mobile_Legends_Bang_Bang_logo.png/220px-Mobile_Legends_Bang_Bang_logo.png', 'Games', 'Top up diamond Mobile Legends legal 100% aman dan instan.', 'User ID', 'Zone ID', true, ''),
(gen_random_uuid(), 'Free Fire', 'free-fire', 'https://upload.wikimedia.org/wikipedia/en/thumb/6/62/Free_Fire_logo.svg/1200px-Free_Fire_logo.svg.png', 'Games', 'Top up diamond Free Fire legal 100% aman dan instan.', 'Player ID', '', false, ''),
(gen_random_uuid(), 'PUBG Mobile', 'pubg-mobile', 'https://upload.wikimedia.org/wikipedia/en/thumb/b/b5/PUBG_Mobile_Logo.png/220px-PUBG_Mobile_Logo.png', 'Games', 'Top up UC PUBG Mobile legal 100% aman dan instan.', 'Character ID', '', false, ''),
(gen_random_uuid(), 'Valorant', 'valorant', 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/b2/Valorant_logo_-_pink_color_version.svg/1200px-Valorant_logo_-_pink_color_version.svg.png', 'Games', 'Top up Valorant Points legal 100% aman dan instan.', 'Riot ID (Username)', 'Tagline (Contoh: #ID1)', true, ''),
(gen_random_uuid(), 'Genshin Impact', 'genshin-impact', 'https://upload.wikimedia.org/wikipedia/en/thumb/5/5d/Genshin_Impact_logo.svg/1200px-Genshin_Impact_logo.svg.png', 'Games', 'Top up Genesis Crystals legal 100% aman.', 'UID', 'Server', true, 'os_asia|Asia,os_cht|TW/HK/MO,os_euro|Europe,os_usa|America');

-- Masukkan Products untuk Mobile Legends (id: dari data di atas, tapi karena uuid random, kita gunakan query)
DO $$
DECLARE
    game_ml uuid;
    game_ff uuid;
    game_pubg uuid;
    game_valo uuid;
    game_genshin uuid;
BEGIN
    SELECT id INTO game_ml FROM games WHERE slug = 'mobile-legends';
    SELECT id INTO game_ff FROM games WHERE slug = 'free-fire';
    SELECT id INTO game_pubg FROM games WHERE slug = 'pubg-mobile';
    SELECT id INTO game_valo FROM games WHERE slug = 'valorant';
    SELECT id INTO game_genshin FROM games WHERE slug = 'genshin-impact';

    -- Mobile Legends Products
    INSERT INTO products (name, game_id, original_price, sell_price, status) VALUES
    ('86 Diamonds (78 + 8 Bonus)', game_ml, 23000, 24500, true),
    ('172 Diamonds (156 + 16 Bonus)', game_ml, 46000, 48000, true),
    ('257 Diamonds (234 + 23 Bonus)', game_ml, 68000, 71500, true),
    ('344 Diamonds (312 + 32 Bonus)', game_ml, 91000, 95500, true),
    ('429 Diamonds (390 + 39 Bonus)', game_ml, 114000, 119500, true),
    ('514 Diamonds (468 + 46 Bonus)', game_ml, 137000, 143500, true),
    ('706 Diamonds (625 + 81 Bonus)', game_ml, 182000, 191000, true),
    ('Weekly Diamond Pass', game_ml, 26000, 27500, true),
    ('Twilight Pass', game_ml, 135000, 140000, true);

    -- Free Fire Products
    INSERT INTO products (name, game_id, original_price, sell_price, status) VALUES
    ('70 Diamonds', game_ff, 9500, 10000, true),
    ('140 Diamonds', game_ff, 19000, 20000, true),
    ('355 Diamonds', game_ff, 47000, 49000, true),
    ('720 Diamonds', game_ff, 94000, 98000, true),
    ('1450 Diamonds', game_ff, 188000, 195000, true),
    ('Membership Mingguan', game_ff, 28000, 30000, true),
    ('Membership Bulanan', game_ff, 105000, 110000, true);

    -- PUBG Mobile Products
    INSERT INTO products (name, game_id, original_price, sell_price, status) VALUES
    ('60 UC', game_pubg, 14500, 15000, true),
    ('325 UC', game_pubg, 72500, 75000, true),
    ('660 UC', game_pubg, 145000, 150000, true),
    ('1800 UC', game_pubg, 360000, 370000, true),
    ('Royale Pass Upgrade', game_pubg, 145000, 150000, true);

    -- Valorant Products
    INSERT INTO products (name, game_id, original_price, sell_price, status) VALUES
    ('420 VP', game_valo, 47000, 50000, true),
    ('700 VP', game_valo, 78000, 80000, true),
    ('1375 VP', game_valo, 145000, 150000, true),
    ('2400 VP', game_valo, 240000, 250000, true),
    ('8150 VP', game_valo, 790000, 800000, true);

    -- Genshin Impact Products
    INSERT INTO products (name, game_id, original_price, sell_price, status) VALUES
    ('60 Genesis Crystals', game_genshin, 14500, 15500, true),
    ('330 Genesis Crystals', game_genshin, 72500, 75000, true),
    ('1090 Genesis Crystals', game_genshin, 215000, 220000, true),
    ('Blessing of the Welkin Moon', game_genshin, 72500, 75000, true);

END $$;

-- 3. Selesai! Schema telah diperbarui dan tabel games & products kini penuh dengan data referensi
