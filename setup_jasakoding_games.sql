-- ==========================================
-- SCRIPT AUTO-SYNC SEMUA GAME DARI JASAKODING
-- ==========================================

ALTER TABLE games ADD COLUMN IF NOT EXISTS category text DEFAULT 'Games';
NOTIFY pgrst, 'reload schema';

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM games WHERE slug = 'mobile-legends') THEN
    INSERT INTO games (name, slug, thumbnail_url, category, description, has_zone_id)
    VALUES ('MOBILE LEGENDS', 'mobile-legends', 'https://test.jasakoding.web.id/assets/thumbnail/01KJQVJW12X94JJENQP8XR5B91.jpeg', 'Games', 'Top up MOBILE LEGENDS otomatis dan instan.', true);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM games WHERE slug = 'free-fire') THEN
    INSERT INTO games (name, slug, thumbnail_url, category, description, has_zone_id)
    VALUES ('FREE FIRE', 'free-fire', 'https://test.jasakoding.web.id/assets/thumbnail/01KJNEVGYQ0HRWWT2NZG4W9SRP.jpeg', 'Games', 'Top up FREE FIRE otomatis dan instan.', false);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM games WHERE slug = 'genshin-impact') THEN
    INSERT INTO games (name, slug, thumbnail_url, category, description, has_zone_id)
    VALUES ('Genshin Impact', 'genshin-impact', 'https://test.jasakoding.web.id/assets/thumbnail/01KJQVVJMZGKNRF0XHX8KHNH8E.jpeg', 'Games', 'Top up Genshin Impact otomatis dan instan.', true);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM games WHERE slug = 'pubg-mobile') THEN
    INSERT INTO games (name, slug, thumbnail_url, category, description, has_zone_id)
    VALUES ('PUBG MOBILE', 'pubg-mobile', 'https://test.jasakoding.web.id/assets/thumbnail/01KJQFV74VNX763JJ99ZFSBXD7.jpeg', 'Games', 'Top up PUBG MOBILE otomatis dan instan.', false);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM games WHERE slug = 'roblox') THEN
    INSERT INTO games (name, slug, thumbnail_url, category, description, has_zone_id)
    VALUES ('ROBLOX', 'roblox', 'https://test.jasakoding.web.id/assets/thumbnail/01KJQW0B266FF6PVT96RH0WFSM.jpeg', 'Games', 'Top up ROBLOX otomatis dan instan.', false);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM games WHERE slug = 'arena-of-valor') THEN
    INSERT INTO games (name, slug, thumbnail_url, category, description, has_zone_id)
    VALUES ('ARENA OF VALOR', 'arena-of-valor', 'https://test.jasakoding.web.id/assets/thumbnail/01KJQW2APCX09RRH3EG69TQ049.jpeg', 'Games', 'Top up ARENA OF VALOR otomatis dan instan.', false);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM games WHERE slug = 'call-of-duty-mobile') THEN
    INSERT INTO games (name, slug, thumbnail_url, category, description, has_zone_id)
    VALUES ('Call Of Duty MOBILE', 'call-of-duty-mobile', 'https://test.jasakoding.web.id/assets/thumbnail/01KJQV5GEE83BDZEZJJ4QX3138.jpeg', 'Games', 'Top up Call Of Duty MOBILE otomatis dan instan.', false);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM games WHERE slug = 'eggy-party') THEN
    INSERT INTO games (name, slug, thumbnail_url, category, description, has_zone_id)
    VALUES ('Eggy Party', 'eggy-party', 'https://test.jasakoding.web.id/assets/thumbnail/01KJQH6J6TEWQ4QRG54PEAGA71.jpeg', 'Games', 'Top up Eggy Party otomatis dan instan.', false);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM games WHERE slug = 'fc-mobile') THEN
    INSERT INTO games (name, slug, thumbnail_url, category, description, has_zone_id)
    VALUES ('FC Mobile', 'fc-mobile', 'https://test.jasakoding.web.id/assets/thumbnail/01KJQVQ0HGXJH4GJNNSVM67GM7.jpeg', 'Games', 'Top up FC Mobile otomatis dan instan.', false);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM games WHERE slug = 'honkai-impact-3') THEN
    INSERT INTO games (name, slug, thumbnail_url, category, description, has_zone_id)
    VALUES ('Honkai Impact 3', 'honkai-impact-3', 'https://test.jasakoding.web.id/assets/thumbnail/01KJQVBTCYQH2C2JJ2WGGWRCMN.jpeg', 'Games', 'Top up Honkai Impact 3 otomatis dan instan.', false);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM games WHERE slug = 'honkai-star-rail') THEN
    INSERT INTO games (name, slug, thumbnail_url, category, description, has_zone_id)
    VALUES ('Honkai Star Rail', 'honkai-star-rail', 'https://test.jasakoding.web.id/assets/thumbnail/01KJQGWCY0EJFG1XWQQ5F2PYJ0.jpeg', 'Games', 'Top up Honkai Star Rail otomatis dan instan.', false);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM games WHERE slug = 'honor-of-kings') THEN
    INSERT INTO games (name, slug, thumbnail_url, category, description, has_zone_id)
    VALUES ('Honor Of Kings', 'honor-of-kings', 'https://test.jasakoding.web.id/assets/thumbnail/01KJNG07RE61SP0CXQ310R7P75.jpeg', 'Games', 'Top up Honor Of Kings otomatis dan instan.', false);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM games WHERE slug = 'identity-v') THEN
    INSERT INTO games (name, slug, thumbnail_url, category, description, has_zone_id)
    VALUES ('Identity V', 'identity-v', 'https://test.jasakoding.web.id/assets/thumbnail/01KJQV2WV8JJKQ1WFKYMB22561.jpeg', 'Games', 'Top up Identity V otomatis dan instan.', false);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM games WHERE slug = 'magic-chess') THEN
    INSERT INTO games (name, slug, thumbnail_url, category, description, has_zone_id)
    VALUES ('Magic Chess', 'magic-chess', 'https://test.jasakoding.web.id/assets/thumbnail/01KJQGT33PT3ZX4J7JS8BN8W9V.jpeg', 'Games', 'Top up Magic Chess otomatis dan instan.', false);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM games WHERE slug = 'point-blank') THEN
    INSERT INTO games (name, slug, thumbnail_url, category, description, has_zone_id)
    VALUES ('POINT BLANK', 'point-blank', 'https://test.jasakoding.web.id/assets/thumbnail/01KJQVRAYPDFV826XS903Y49M6.jpeg', 'Games', 'Top up POINT BLANK otomatis dan instan.', false);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM games WHERE slug = 'sausage-man') THEN
    INSERT INTO games (name, slug, thumbnail_url, category, description, has_zone_id)
    VALUES ('Sausage Man', 'sausage-man', 'https://test.jasakoding.web.id/assets/thumbnail/01KJQTSAN58Q5SHZK5K0Z8ANBD.jpeg', 'Games', 'Top up Sausage Man otomatis dan instan.', false);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM games WHERE slug = 'undawn') THEN
    INSERT INTO games (name, slug, thumbnail_url, category, description, has_zone_id)
    VALUES ('Undawn', 'undawn', 'https://test.jasakoding.web.id/assets/thumbnail/01KJQW3DJK0JN9QP1WTKHJRYQW.jpeg', 'Games', 'Top up Undawn otomatis dan instan.', false);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM games WHERE slug = 'valorant') THEN
    INSERT INTO games (name, slug, thumbnail_url, category, description, has_zone_id)
    VALUES ('Valorant', 'valorant', 'https://test.jasakoding.web.id/assets/thumbnail/01KJQVWN75FTFE2357PDZAYS67.jpeg', 'Games', 'Top up Valorant otomatis dan instan.', false);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM games WHERE slug = 'joki-rank-ecer') THEN
    INSERT INTO games (name, slug, thumbnail_url, category, description, has_zone_id)
    VALUES ('JOKI RANK ECER', 'joki-rank-ecer', 'https://test.jasakoding.web.id/assets/thumbnail/9dc8550f5626f4a669f1ce4b13168da4bacd5e94.webp', 'Games', 'Top up JOKI RANK ECER otomatis dan instan.', false);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM games WHERE slug = 'mlbb-via-login') THEN
    INSERT INTO games (name, slug, thumbnail_url, category, description, has_zone_id)
    VALUES ('Mlbb Via Login', 'mlbb-via-login', 'https://test.jasakoding.web.id/assets/thumbnail/e350bb2275777da25f912e020ed61a99956a30ca.webp', 'Games', 'Top up Mlbb Via Login otomatis dan instan.', false);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM games WHERE slug = 'alight-motion') THEN
    INSERT INTO games (name, slug, thumbnail_url, category, description, has_zone_id)
    VALUES ('Alight Motion', 'alight-motion', 'https://test.jasakoding.web.id/assets/thumbnail/alight-motion.webp', 'Games', 'Top up Alight Motion otomatis dan instan.', false);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM games WHERE slug = 'bstation-premium') THEN
    INSERT INTO games (name, slug, thumbnail_url, category, description, has_zone_id)
    VALUES ('Bstation Premium', 'bstation-premium', 'https://test.jasakoding.web.id/assets/thumbnail/bstation.webp', 'Games', 'Top up Bstation Premium otomatis dan instan.', false);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM games WHERE slug = 'canva-pro') THEN
    INSERT INTO games (name, slug, thumbnail_url, category, description, has_zone_id)
    VALUES ('Canva Pro', 'canva-pro', 'https://test.jasakoding.web.id/assets/thumbnail/eb6e9b42a3ee41f31451c7bc6d29e86e.jpg_720x720q80.jpg_.webp', 'Games', 'Top up Canva Pro otomatis dan instan.', false);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM games WHERE slug = 'getcontact-premium') THEN
    INSERT INTO games (name, slug, thumbnail_url, category, description, has_zone_id)
    VALUES ('Getcontact Premium', 'getcontact-premium', 'https://test.jasakoding.web.id/assets/thumbnail/get-contact.png', 'Games', 'Top up Getcontact Premium otomatis dan instan.', false);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM games WHERE slug = 'netflix-premium') THEN
    INSERT INTO games (name, slug, thumbnail_url, category, description, has_zone_id)
    VALUES ('Netflix Premium', 'netflix-premium', 'https://test.jasakoding.web.id/assets/thumbnail/netflix.jpg', 'Games', 'Top up Netflix Premium otomatis dan instan.', false);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM games WHERE slug = 'spotify-premium') THEN
    INSERT INTO games (name, slug, thumbnail_url, category, description, has_zone_id)
    VALUES ('Spotify Premium', 'spotify-premium', 'https://test.jasakoding.web.id/assets/thumbnail/spotify.jpg', 'Games', 'Top up Spotify Premium otomatis dan instan.', false);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM games WHERE slug = 'tiktok-music') THEN
    INSERT INTO games (name, slug, thumbnail_url, category, description, has_zone_id)
    VALUES ('TikTok Music', 'tiktok-music', 'https://test.jasakoding.web.id/assets/thumbnail/tiktok-music.jpg', 'Games', 'Top up TikTok Music otomatis dan instan.', false);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM games WHERE slug = 'vidio-premier') THEN
    INSERT INTO games (name, slug, thumbnail_url, category, description, has_zone_id)
    VALUES ('Vidio Premier', 'vidio-premier', 'https://test.jasakoding.web.id/assets/thumbnail/vidio-premier.jpg', 'Games', 'Top up Vidio Premier otomatis dan instan.', false);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM games WHERE slug = 'wetv-premium') THEN
    INSERT INTO games (name, slug, thumbnail_url, category, description, has_zone_id)
    VALUES ('WeTv Premium', 'wetv-premium', 'https://test.jasakoding.web.id/assets/thumbnail/bcc57869475b868a686844e4fb82e4ee.jpeg', 'Games', 'Top up WeTv Premium otomatis dan instan.', false);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM games WHERE slug = 'youtube-premium') THEN
    INSERT INTO games (name, slug, thumbnail_url, category, description, has_zone_id)
    VALUES ('Youtube Premium', 'youtube-premium', 'https://test.jasakoding.web.id/assets/thumbnail/youtube-new.jpg', 'Games', 'Top up Youtube Premium otomatis dan instan.', false);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM games WHERE slug = 'indosat') THEN
    INSERT INTO games (name, slug, thumbnail_url, category, description, has_zone_id)
    VALUES ('INDOSAT', 'indosat', 'https://test.jasakoding.web.id/assets/thumbnail/indosat.png', 'Games', 'Top up INDOSAT otomatis dan instan.', false);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM games WHERE slug = 'cara-top-up-mobile-legends-murah-dan-aman') THEN
    INSERT INTO games (name, slug, thumbnail_url, category, description, has_zone_id)
    VALUES ('Cara Top Up Mobile Legends Murah dan Aman', 'cara-top-up-mobile-legends-murah-dan-aman', 'https://test.jasakoding.web.id/articles/thumbnails/01KFRHXFFKPQDPYRHC945GEWZV.jpg', 'Games', 'Top up Cara Top Up Mobile Legends Murah dan Aman otomatis dan instan.', true);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM games WHERE slug = 'event-promo-diamond-kuning-2026') THEN
    INSERT INTO games (name, slug, thumbnail_url, category, description, has_zone_id)
    VALUES ('Event Promo Diamond Kuning 2026', 'event-promo-diamond-kuning-2026', 'https://test.jasakoding.web.id/articles/thumbnails/01KFRHZP9P9P1J0KAXC69GF0E3.jpg', 'Games', 'Top up Event Promo Diamond Kuning 2026 otomatis dan instan.', false);
  END IF;
END $$;
