import fs from 'fs';
import https from 'https';

console.log("Memulai scraping Jasakoding...");

https.get('https://test.jasakoding.web.id/id', (res) => {
  let data = '';
  res.on('data', (chunk) => data += chunk);
  res.on('end', () => {
    // Basic regex to find game links and images
    // Based on typical jasakoding themes, games are often inside <a> tags or grid items
    // Let's use regex to find thumbnail images and names.
    // Usually it looks like: <img src="URL" alt="Nama Game" ...> or similar.
    
    // We'll extract image source and game names using regex.
    const regex = /<img[^>]+src="([^">]+)"[^>]*alt="([^">]+)"/gi;
    let match;
    const games = [];
    const seen = new Set();
    
    while ((match = regex.exec(data)) !== null) {
      let src = match[1];
      let name = match[2];
      
      // Filter out common non-game images (like logos, banners, etc)
      if (src.includes('banner') || src.includes('logo') || src.includes('icon') || name.toLowerCase().includes('logo')) {
        continue;
      }
      
      if (!src.startsWith('http')) {
        src = 'https://test.jasakoding.web.id' + src;
      }
      
      if (!seen.has(name) && name.length > 2) {
        seen.add(name);
        
        // Generate slug
        const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
        
        games.push({
          name: name.trim(),
          slug: slug,
          thumbnail_url: src,
          category: 'Games', // default
          has_zone_id: name.toLowerCase().includes('mobile legends') || name.toLowerCase().includes('genshin')
        });
      }
    }
    
    console.log(`Ditemukan ${games.length} games. Menyiapkan script SQL...`);
    
    let sql = `-- ==========================================\n`;
    sql += `-- SCRIPT AUTO-SYNC SEMUA GAME DARI JASAKODING\n`;
    sql += `-- ==========================================\n\n`;
    
    sql += `ALTER TABLE games ADD COLUMN IF NOT EXISTS category text DEFAULT 'Games';\n`;
    sql += `NOTIFY pgrst, 'reload schema';\n\n`;
    
    sql += `DO $$\nBEGIN\n`;
    
    games.forEach(g => {
        // Escape single quotes
        const safeName = g.name.replace(/'/g, "''");
        
        sql += `  IF NOT EXISTS (SELECT 1 FROM games WHERE slug = '${g.slug}') THEN\n`;
        sql += `    INSERT INTO games (name, slug, thumbnail_url, category, description, has_zone_id)\n`;
        sql += `    VALUES ('${safeName}', '${g.slug}', '${g.thumbnail_url}', '${g.category}', 'Top up ${safeName} otomatis dan instan.', ${g.has_zone_id});\n`;
        sql += `  END IF;\n`;
    });
    
    sql += `END $$;\n`;
    
    fs.writeFileSync('setup_jasakoding_games.sql', sql);
    console.log("File 'setup_jasakoding_games.sql' berhasil dibuat!");
  });
}).on('error', (err) => {
  console.log("Error: " + err.message);
});
