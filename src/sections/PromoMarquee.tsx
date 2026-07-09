import { Sparkles } from 'lucide-react'

const promoItems = [
  'DISKON 20% ALL GAMES',
  'CASHBACK 10%',
  'EVENT ESPORTS',
  'VOUCHER GRATIS',
  'FLASH SALE SETIAP HARI',
  'PROSES OTOMATIS 24/7',
]

export default function PromoMarquee() {
  return (
    <div className="w-full h-14 bg-[#050816] border-y border-[rgba(159,211,232,0.1)] overflow-hidden flex items-center relative">
      {/* Sweep glow */}
      <div
        className="absolute top-0 left-0 w-[60px] h-full pointer-events-none z-10 animate-sweep"
        style={{
          background: 'linear-gradient(90deg, transparent, rgba(224, 64, 251, 0.5), transparent)',
        }}
      />

      <div className="marquee-track animate-marquee">
        {Array.from({ length: 2 }).map((_, group) =>
          promoItems.map((item, i) => (
            <span
              key={`${group}-${i}`}
              className="marquee-item text-xs font-orbitron uppercase tracking-[0.1em] mx-6 flex items-center gap-3"
            >
              <Sparkles className="w-3.5 h-3.5 text-[#FFD740] inline-block shrink-0" />
              {item}
            </span>
          ))
        )}
      </div>
    </div>
  )
}
