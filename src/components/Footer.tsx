import { Phone, Mail, MessageCircle, Instagram } from 'lucide-react'

const navLinks = [
  { label: 'Top Up', href: '/#topup' },
  { label: 'Cek Transaksi', href: '/#stats' },
  { label: 'Promo', href: '/#promo' },
  { label: 'Artikel', href: '/#faq' },
  { label: 'Bantuan', href: '/#faq' },
  { label: 'Syarat & Ketentuan', href: '#' },
]

const gameLinks = [
  'Mobile Legends',
  'Free Fire',
  'PUBG Mobile',
  'Valorant',
  'Genshin Impact',
  'COD Mobile',
]

const helpLinks = [
  'Cara Top Up',
  'Metode Pembayaran',
  'Refund & Komplain',
  'Hubungi Kami',
  'FAQ',
]

export default function Footer() {
  return (
    <footer className="bg-[#050816] border-t border-[rgba(159,211,232,0.1)]">
      <div className="max-w-[1440px] mx-auto px-6 pt-16 pb-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-10">
          {/* Logo Column */}
          <div className="lg:col-span-2">
            <img
              src="/assets/sztopup-logo.jpg"
              alt="SZTopup"
              className="h-12 w-auto"
              style={{ filter: 'drop-shadow(0 0 8px rgba(159, 211, 232, 0.4))' }}
            />
            <p className="mt-2 text-[10px] font-orbitron uppercase tracking-[0.1em] text-white/30">
              Super Admin
            </p>
            <div className="flex items-center gap-3 mt-6">
              <a href="#" className="text-white/40 hover:text-[#9FD3E8] transition-colors">
                <Phone className="w-5 h-5" />
              </a>
              <a href="#" className="text-white/40 hover:text-[#9FD3E8] transition-colors">
                <MessageCircle className="w-5 h-5" />
              </a>
              <a href="#" className="text-white/40 hover:text-[#9FD3E8] transition-colors">
                <Mail className="w-5 h-5" />
              </a>
              <a href="#" className="text-white/40 hover:text-[#9FD3E8] transition-colors">
                <Instagram className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Navigation */}
          <div>
            <h4 className="text-xs font-orbitron font-medium uppercase tracking-[0.08em] text-[#9FD3E8] mb-4">
              NAVIGASI
            </h4>
            <ul className="space-y-2.5">
              {navLinks.map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    className="text-sm font-rajdhani text-white/50 hover:text-white transition-colors duration-200"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Game Populer */}
          <div>
            <h4 className="text-xs font-orbitron font-medium uppercase tracking-[0.08em] text-[#9FD3E8] mb-4">
              GAME POPULER
            </h4>
            <ul className="space-y-2.5">
              {gameLinks.map((game) => (
                <li key={game}>
                  <a
                    href="/#games"
                    className="text-sm font-rajdhani text-white/50 hover:text-white transition-colors duration-200"
                  >
                    {game}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Bantuan + Contact */}
          <div>
            <h4 className="text-xs font-orbitron font-medium uppercase tracking-[0.08em] text-[#9FD3E8] mb-4">
              BANTUAN
            </h4>
            <ul className="space-y-2.5 mb-6">
              {helpLinks.map((link) => (
                <li key={link}>
                  <a
                    href="/#faq"
                    className="text-sm font-rajdhani text-white/50 hover:text-white transition-colors duration-200"
                  >
                    {link}
                  </a>
                </li>
              ))}
            </ul>

            <h4 className="text-xs font-orbitron font-medium uppercase tracking-[0.08em] text-[#9FD3E8] mb-4">
              HUBUNGI KAMI
            </h4>
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-sm font-rajdhani text-white/60">
                <Phone className="w-4 h-4 text-[#9FD3E8]" />
                0812-3456-7890
              </div>
              <div className="flex items-center gap-2 text-sm font-rajdhani text-white/60">
                <Mail className="w-4 h-4 text-[#9FD3E8]" />
                cs@sztopup.com
              </div>
              <button className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-[11px] font-orbitron font-semibold uppercase tracking-[0.06em] text-[#00E5FF] border border-[rgba(0,229,255,0.3)] bg-[rgba(0,229,255,0.1)] hover:bg-[rgba(0,229,255,0.15)] transition-colors mt-2">
                <span className="w-2 h-2 rounded-full bg-[#00E5FF] animate-pulse-dot" />
                LIVE CHAT ONLINE
              </button>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-12 pt-6 border-t border-white/5 flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-[10px] font-orbitron uppercase tracking-[0.1em] text-white/30">
            &copy; 2025 SZTopup. All rights reserved.
          </p>
          <div className="flex items-center gap-4">
            <a href="#" className="text-[10px] font-orbitron uppercase tracking-[0.1em] text-white/30 hover:text-white/60 transition-colors">
              Terms
            </a>
            <a href="#" className="text-[10px] font-orbitron uppercase tracking-[0.1em] text-white/30 hover:text-white/60 transition-colors">
              Privacy
            </a>
            <a href="#" className="text-[10px] font-orbitron uppercase tracking-[0.1em] text-white/30 hover:text-white/60 transition-colors">
              Cookies
            </a>
          </div>
        </div>
      </div>
    </footer>
  )
}
